from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.email import EmailResult
from services.email_generator import generate_email_variants
from utils.auth import get_current_user
from models.user import User
from models.resume import Resume
from datetime import datetime
import uuid

router = APIRouter(prefix="/email", tags=["email"])

class EmailRequest(BaseModel):
    company_name: str
    role_title: str
    job_description: str
    manager_name: str | None = None
    tone: str
    include_news_hook: bool
    portfolio_url: str | None = None

@router.post("/generate", response_model=EmailResult)
async def generate(
    payload: EmailRequest,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    res = await db.execute(select(Resume).where(Resume.user_id == _user.id).order_by(Resume.created_at.desc()).limit(1))
    latest_resume = res.scalar_one_or_none()
    user_skills = []
    if latest_resume and latest_resume.parsed_json:
        user_skills = latest_resume.parsed_json.get("skills", [])
        
    result = await generate_email_variants(
        company_name=payload.company_name,
        role_title=payload.role_title,
        jd_text=payload.job_description,
        manager_name=payload.manager_name or "",
        requested_tone=payload.tone,
        include_news_hook=payload.include_news_hook,
        portfolio_url=payload.portfolio_url or "",
        user_skills=user_skills
    )
    
    try:
        from models.email_log import EmailLog
        email_log = EmailLog(
            id=uuid.UUID(result.email_id),
            user_id=_user.id,
            company=payload.company_name,
            role=payload.role_title,
            subject=result.subject,
            body=result.body,
            tone=payload.tone,
            follow_up_date=datetime.fromisoformat(result.follow_up_date.replace("Z", "+00:00")).replace(tzinfo=None)
        )
        db.add(email_log)
        await db.commit()
    except Exception as e:
        print(f"Failed to log email: {e}")
        # Ignore DB failure for email log for now
        
    return result

class SendRequest(BaseModel):
    email_id: str
    to_address: str

@router.post("/send")
async def send(payload: SendRequest, _user=Depends(get_current_user)):
    return {"ok": True}
