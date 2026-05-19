import asyncio
import uuid
from datetime import datetime, timezone
from celery import shared_task
from sqlalchemy import select
from database import async_session
from models.email_log import EmailLog
from config import settings
import google.generativeai as genai

async def generate_follow_up_content(original_subject: str, original_body: str) -> str:
    if not settings.gemini_api_key:
        return "Just checking in to see if you had a chance to review my previous email. I would love to connect and discuss how I can add value."
        
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    system_prompt = """You are a professional cold email writer. Generate a short follow-up email based on the original email sent.
Rules:
1. Max 50 words
2. Casual check-in tone
3. DO NOT include a subject line, just the body text.
4. Return ONLY the email body text. No explanation, no quotes."""
    
    user_message = f"Original Subject: {original_subject}\nOriginal Body: {original_body}"
    try:
        def _call():
            prompt = f"{system_prompt}\n\n{user_message}"
            response = model.generate_content(prompt)
            return response.text
            
        loop = asyncio.get_event_loop()
        response_text = await loop.run_in_executor(None, _call)
        
        # Hardening
        text = response_text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            if len(lines) > 1 and lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            
        return text.strip('"').strip()
    except Exception:
        return "Just following up on my previous note. Let me know if you have a few minutes to connect."

async def _process_follow_ups_async():
    today = datetime.now(timezone.utc).date()
    
    async with async_session() as db:
        query = select(EmailLog).where(
            EmailLog.sent_at.isnot(None),
            EmailLog.follow_up_date == today,
            EmailLog.follow_up_sent == False
        )
        
        res = await db.execute(query)
        emails = res.scalars().all()
        
        for email in emails:
            new_body = await generate_follow_up_content(email.subject, email.body)
            
            new_log = EmailLog(
                id=uuid.uuid4(),
                user_id=email.user_id,
                company=email.company,
                role=email.role,
                subject=f"Re: {email.subject}",
                body=new_body,
                tone="casual",
                follow_up_date=today,
                parent_email_id=email.id
            )
            db.add(new_log)
            email.follow_up_sent = True
                
        await db.commit()

@shared_task
def process_follow_ups():
    asyncio.run(_process_follow_ups_async())
