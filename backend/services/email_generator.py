import asyncio
import logging
import uuid
from datetime import datetime, timedelta, timezone
from httpx import AsyncClient
from fastapi import HTTPException
import google.generativeai as genai
from utils.json_parser import clean_and_parse_json

from config import settings
from schemas.email import EmailResult, EmailVariant
from ml.ner_extractor import extract_skills

logger = logging.getLogger("careeros.email")


def extract_jd_emphasis(jd_text: str) -> list[str]:
    skills = extract_skills(jd_text)
    return skills[:3]

async def fetch_news_hook(company_name: str) -> str:
    if not settings.tavily_api_key:
        return ""
    try:
        async with AsyncClient() as client:
            res = await client.post(
                "https://api.tavily.com/search",
                json={"api_key": settings.tavily_api_key, "query": f"{company_name} latest news 2025", "max_results": 1},
                timeout=5.0
            )
            data = res.json()
            if "results" in data and len(data["results"]) > 0:
                return data["results"][0].get("content", "").split(". ")[0] + "."
    except Exception:
        logger.exception("Tavily news hook lookup failed for %s", company_name)
    return ""

async def call_gemini_email(system_prompt: str, user_message: str, tone: str) -> dict:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured. Set GEMINI_API_KEY in backend/.env.")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(
        "gemini-2.0-flash",
        generation_config={"response_mime_type": "application/json"},
    )
    loop = asyncio.get_event_loop()

    def _call():
        prompt = f"{system_prompt}\n\n{user_message}"
        response = model.generate_content(prompt)
        return response.text

    try:
        response_text = await loop.run_in_executor(None, _call)
    except Exception as e:
        logger.exception("Gemini call failed for tone=%s", tone)
        raise HTTPException(status_code=503, detail=f"AI service error ({tone}): {e}") from e

    try:
        parsed = clean_and_parse_json(response_text)
        if not isinstance(parsed, dict):
            raise ValueError(f"Expected JSON object, got {type(parsed).__name__}")
        return parsed
    except Exception as e:
        snippet = (response_text or "")[:200].replace("\n", " ")
        logger.warning("Gemini returned non-JSON for tone=%s: %s", tone, snippet)
        raise HTTPException(
            status_code=502,
            detail=f"AI returned unparseable output for tone '{tone}': {e}",
        ) from e

async def generate_email_variants(company_name: str, role_title: str, jd_text: str, manager_name: str, requested_tone: str, include_news_hook: bool, portfolio_url: str, user_skills: list[str]) -> EmailResult:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured. Set GEMINI_API_KEY in backend/.env.")

    jd_emphasis = extract_jd_emphasis(jd_text)
    matching_skills = [s for s in user_skills if s in jd_emphasis][:2]
    if not matching_skills:
        matching_skills = user_skills[:2] if user_skills else ["problem solving", "coding"]

    news_hook = ""
    if include_news_hook:
        news_hook = await fetch_news_hook(company_name)

    tones = ["formal", "conversational", "referral"]

    user_context = f"""
    Company: {company_name}
    Role: {role_title}
    Manager: {manager_name or 'Hiring Manager'}
    Portfolio: {portfolio_url or 'None'}
    JD Emphasis: {', '.join(jd_emphasis)}
    My matching skills: {', '.join(matching_skills)}
    News hook: {news_hook}
    """

    tasks = []
    for t in tones:
        tone_prompt = f"""You are a professional cold email writer for job outreach. Rules:
1. Max 150 words
2. First sentence: one specific thing about the company or role. NOT generic flattery.
3. State exactly 2 concrete skills/achievements matching the JD emphasis
4. One clear CTA: ask for a 15-minute call or invite a reply
5. Banned words: passionate, hardworking, synergy, leverage, excited, eager, dynamic
6. Tone: {t} (formal = third-person professional distance, conversational = first-name basis, casual but smart, referral = open by naming the referrer.)
7. Return a JSON object ONLY with keys: subject (string), body (string). No markdown, no explanation."""
        tasks.append(call_gemini_email(tone_prompt, user_context, t))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    variants: dict[str, EmailVariant] = {}
    failures: list[str] = []
    for tone_name, res in zip(tones, results):
        if isinstance(res, Exception):
            detail = getattr(res, "detail", str(res))
            failures.append(f"{tone_name}: {detail}")
            logger.warning("Tone %s failed: %s", tone_name, detail)
            continue
        variants[tone_name] = EmailVariant(
            subject=res.get("subject", "Reaching out"),
            body=res.get("body", ""),
        )

    if not variants:
        raise HTTPException(
            status_code=502,
            detail=f"All email variants failed. {' | '.join(failures)}",
        )

    if requested_tone not in variants:
        logger.info("Requested tone %s missing, falling back to %s", requested_tone, next(iter(variants)))
        selected_tone = next(iter(variants))
    else:
        selected_tone = requested_tone

    selected_variant = variants[selected_tone]
    word_count = len(selected_variant.body.split())

    email_id = str(uuid.uuid4())
    follow_up_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()

    return EmailResult(
        email_id=email_id,
        subject=selected_variant.subject,
        body=selected_variant.body,
        word_count=word_count,
        tone_used=selected_tone,
        variants=variants,
        follow_up_date=follow_up_date,
    )
