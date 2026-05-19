import json
import asyncio
import uuid
from datetime import datetime, timedelta, timezone
from httpx import AsyncClient
from fastapi import HTTPException
import google.generativeai as genai

from config import settings
from schemas.email import EmailResult, EmailVariant
from ml.ner_extractor import extract_skills

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
        pass
    return ""

async def call_gemini_email(system_prompt: str, user_message: str) -> dict:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")
        
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    try:
        loop = asyncio.get_event_loop()
        def _call():
            prompt = f"{system_prompt}\n\n{user_message}"
            response = model.generate_content(prompt)
            return response.text
            
        response_text = await loop.run_in_executor(None, _call)
        
        text = response_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
            
        return json.loads(text)
    except Exception as e:
        return {"subject": "Application", "body": f"I would like to apply for the role."}

async def generate_email_variants(company_name: str, role_title: str, jd_text: str, manager_name: str, requested_tone: str, include_news_hook: bool, portfolio_url: str, user_skills: list[str]) -> EmailResult:
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
        tasks.append(call_gemini_email(tone_prompt, user_context))
        
    results = await asyncio.gather(*tasks)
    
    variants = {}
    for i, t in enumerate(tones):
        variants[t] = EmailVariant(subject=results[i].get("subject", "Subject"), body=results[i].get("body", "Body"))
        
    selected_variant = variants.get(requested_tone, variants["formal"])
    word_count = len(selected_variant.body.split())
    
    email_id = str(uuid.uuid4())
    follow_up_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
    
    return EmailResult(
        email_id=email_id,
        subject=selected_variant.subject,
        body=selected_variant.body,
        word_count=word_count,
        tone_used=requested_tone,
        variants=variants,
        follow_up_date=follow_up_date
    )
