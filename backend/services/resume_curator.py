import asyncio
import logging
import re
from fastapi import HTTPException
from schemas.resume import ParsedResume
from schemas.curator import CuratedBullet, CurationResult
from ml.ner_extractor import extract_skills
from config import settings

import google.generativeai as genai

logger = logging.getLogger("careeros.curator")

# Cap how many bullets we send to the LLM per request. Keeps latency bounded
# and prevents one resume from burning through the quota.
MAX_BULLETS_TO_CURATE = 8


def get_section_for_bullet(bullet_text: str, sections: dict[str, str]) -> str:
    for sec_name, sec_text in sections.items():
        if bullet_text in sec_text:
            return sec_name
    return "Experience"


async def call_gemini_curate(bullet_text: str, keywords: list[str], section_context: str) -> str:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured. Set GEMINI_API_KEY in backend/.env.")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    system_prompt = """You are an expert resume writer. Rewrite the bullet below to be stronger and ATS-optimised.
Rules:
1. Start with a strong past-tense action verb
2. Incorporate 1-2 keywords naturally from the provided JD keywords list
3. If the original implies a measurable result, make it explicit — but NEVER invent specific numbers not inferable from context
4. Maximum 22 words
5. Do not add skills or technologies the candidate did not demonstrate
Return ONLY the rewritten bullet text. No explanation, no quotes."""

    user_message = f"Original: {bullet_text}\nJD Keywords: {', '.join(keywords)}\nContext: {section_context}"

    loop = asyncio.get_event_loop()

    def _call():
        prompt = f"{system_prompt}\n\n{user_message}"
        response = model.generate_content(prompt)
        return response.text

    try:
        rewritten = await loop.run_in_executor(None, _call)
    except Exception as e:
        logger.exception("Gemini curate call failed for bullet: %s", bullet_text[:80])
        raise HTTPException(status_code=503, detail=f"AI service error: {e}") from e

    text = (rewritten or "").strip()
    if text.startswith("```"):
        lines = text.split("\n")
        if len(lines) > 1 and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    return text.strip('"').strip()


async def curate_bullet(bullet, keywords: list[str], section_context: str) -> CuratedBullet:
    rewritten = await call_gemini_curate(bullet.text, keywords, section_context)

    # Hallucination guard — strip any new numbers that didn't appear in the original.
    original_numbers = set(re.findall(r"\d+", bullet.text + " " + section_context))
    rewritten_numbers = set(re.findall(r"\d+", rewritten))

    for num in rewritten_numbers:
        if num not in original_numbers:
            rewritten = re.sub(r"\b" + num + r"\b", "significantly", rewritten)

    return CuratedBullet(
        id=bullet.id,
        original=bullet.text,
        rewritten=rewritten,
        status="pending",
    )


async def curate_resume(parsed_resume: ParsedResume, job_description: str) -> CurationResult:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured. Set GEMINI_API_KEY in backend/.env.")

    weak_bullets = [b for b in parsed_resume.bullets if not b.is_strong]
    if not weak_bullets:
        # Fall back to all bullets so the user always sees rewrites instead of
        # a silent empty list when the heuristic flags everything as strong.
        weak_bullets = parsed_resume.bullets

    if not weak_bullets:
        raise HTTPException(
            status_code=422,
            detail="No bullets could be parsed from your resume. Re-upload with bullet points in the experience section.",
        )

    bullets_to_send = weak_bullets[:MAX_BULLETS_TO_CURATE]
    jd_keywords = extract_skills(job_description)
    logger.info(
        "Curating %d/%d bullets against %d JD keywords",
        len(bullets_to_send),
        len(parsed_resume.bullets),
        len(jd_keywords),
    )

    tasks = []
    for bullet in bullets_to_send:
        section_context = get_section_for_bullet(bullet.text, parsed_resume.sections)
        tasks.append(curate_bullet(bullet, jd_keywords, section_context))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    curated: list[CuratedBullet] = []
    failures: list[str] = []
    for bullet, res in zip(bullets_to_send, results):
        if isinstance(res, Exception):
            detail = getattr(res, "detail", str(res))
            failures.append(detail)
            logger.warning("Curate failed for bullet '%s…': %s", bullet.text[:60], detail)
            continue
        curated.append(res)

    if not curated:
        raise HTTPException(
            status_code=502,
            detail=f"All bullet rewrites failed. {failures[0] if failures else ''}",
        )

    return CurationResult(bullets=curated)
