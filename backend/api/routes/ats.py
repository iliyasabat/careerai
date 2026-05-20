from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.resume import Resume
from schemas.resume import ParsedResume
from services.ats_scorer import score_ats as score_ats_service
from utils.auth import get_current_user


router = APIRouter(prefix="/ats", tags=["ats"])


class ATSScoreRequest(BaseModel):
    resume_id: str
    job_description: str


@router.post("/score")
async def score_ats(
    payload: ATSScoreRequest,
    db: AsyncSession = Depends(get_db),
    _user=Depends(get_current_user),
):
    try:
        rid = uuid.UUID(payload.resume_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid resume id") from e

    res = await db.execute(select(Resume).where(Resume.id == rid))
    row = res.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    parsed = row.parsed_json or {}
    embedding = row.embedding or []
    parsed_resume = ParsedResume(
        resume_id=str(row.id),
        filename=row.filename,
        sections=parsed.get("sections", {}),
        skills=parsed.get("skills", []),
        experience_years=float(parsed.get("experience_years", 0.0)),
        bullets=parsed.get("bullets", []),
        embedding=embedding,
    )

    try:
        result = score_ats_service(parsed_resume, payload.job_description)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ATS scoring failed: {e}",
        ) from e
    return result.model_dump()
