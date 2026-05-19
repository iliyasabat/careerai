import asyncio
import re
from fastapi import HTTPException
from schemas.resume import ParsedResume
from schemas.curator import CuratedBullet, CurationResult
from ml.ner_extractor import extract_skills
from config import settings

def get_section_for_bullet(bullet_text: str, sections: dict[str, str]) -> str:
    for sec_name, sec_text in sections.items():
        if bullet_text in sec_text:
            return sec_name
    return "Experience"

import google.generativeai as genai

async def call_claude_curate(bullet_text: str, keywords: list[str], section_context: str) -> str:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
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
    
    try:
        loop = asyncio.get_event_loop()
        def _call():
            prompt = f"{system_prompt}\n\n{user_message}"
            response = model.generate_content(prompt)
            return response.text
        
        rewritten = await loop.run_in_executor(None, _call)
        
        # Hardening output
        text = rewritten.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if len(lines) > 1 and lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            
        return text.strip('"').strip()
    except Exception:
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
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")
        
    weak_bullets = [b for b in parsed_resume.bullets if not b.is_strong]
    jd_keywords = extract_skills(job_description)
    
    tasks = []
    for bullet in weak_bullets:
        section_context = get_section_for_bullet(bullet.text, parsed_resume.sections)
        tasks.append(curate_bullet(bullet, jd_keywords, section_context))
        
    curated_bullets = await asyncio.gather(*tasks)
    
    return CurationResult(bullets=curated_bullets)
