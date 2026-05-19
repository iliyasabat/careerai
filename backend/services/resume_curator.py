import asyncio
import re
from fastapi import HTTPException
from anthropic import Anthropic, APIError
from schemas.resume import ParsedResume
from schemas.curator import CuratedBullet, CurationResult
from ml.ner_extractor import extract_skills
from config import settings

def get_section_for_bullet(bullet_text: str, sections: dict[str, str]) -> str:
    for sec_name, sec_text in sections.items():
        if bullet_text in sec_text:
            return sec_name
    return "Experience"

async def call_claude_curate(bullet_text: str, keywords: list[str], section_context: str) -> str:
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
    client_ai = Anthropic(api_key=settings.anthropic_api_key)
    
    system_prompt = """You are an expert resume writer. Rewrite the bullet below to be stronger and ATS-optimised.
Rules:
1. Start with a strong past-tense action verb
2. Incorporate 1-2 keywords naturally from the provided JD keywords list
3. If the original implies a measurable result, make it explicit — but NEVER invent specific numbers not inferable from context
4. Maximum 22 words
5. Do not add skills or technologies the candidate did not demonstrate
Return ONLY the rewritten bullet text. No explanation, no quotes."""
    
    user_message = f"Original: {bullet_text}\nJD Keywords: {', '.join(keywords)}\nContext: {section_context}"
    
    try:
        loop = asyncio.get_event_loop()
        def _call():
            msg = client_ai.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}]
            )
            return msg.content[0].text
        
        rewritten = await loop.run_in_executor(None, _call)
        return rewritten.strip().strip('"').strip()
    except APIError:
        raise HTTPException(status_code=503, detail="AI service error")

async def curate_bullet(bullet, keywords: list[str], section_context: str) -> CuratedBullet:
    rewritten = await call_claude_curate(bullet.text, keywords, section_context)
    
    # Hallucination guard
    original_numbers = set(re.findall(r'\d+', bullet.text + " " + section_context))
    rewritten_numbers = set(re.findall(r'\d+', rewritten))
    
    for num in rewritten_numbers:
        if num not in original_numbers:
            rewritten = re.sub(r'\b' + num + r'\b', 'significantly', rewritten)

    return CuratedBullet(
        id=bullet.id,
        original=bullet.text,
        rewritten=rewritten,
        status="pending"
    )

async def curate_resume(parsed_resume: ParsedResume, job_description: str) -> CurationResult:
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")
        
    weak_bullets = [b for b in parsed_resume.bullets if not b.is_strong]
    jd_keywords = extract_skills(job_description)
    
    tasks = []
    for bullet in weak_bullets:
        section_context = get_section_for_bullet(bullet.text, parsed_resume.sections)
        tasks.append(curate_bullet(bullet, jd_keywords, section_context))
        
    curated_bullets = await asyncio.gather(*tasks)
    
    return CurationResult(bullets=curated_bullets)
