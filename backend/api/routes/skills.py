from __future__ import annotations

import logging
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.resume import Resume
from services.skill_gap import detect_gap, get_courses
from utils.auth import get_current_user


logger = logging.getLogger("careeros.skills")

router = APIRouter(prefix="/skills", tags=["skills"])


class SkillGapRequest(BaseModel):
    resume_id: str
    target_role: str


@router.post("/gap")
async def gap(payload: SkillGapRequest, db: AsyncSession = Depends(get_db), _u=Depends(get_current_user)):
    try:
        rid = uuid.UUID(payload.resume_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid resume id") from e

    res = await db.execute(select(Resume.parsed_json).where(Resume.id == rid))
    parsed = res.scalar_one_or_none() or {}
    skills = parsed.get("skills", [])
    try:
        result = await detect_gap(skills, payload.target_role)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Skill-gap detection failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Skill-gap detection failed: {e}",
        ) from e
    return result.model_dump()


@router.get("/courses")
async def courses(skill: str):
    return [c.model_dump() for c in get_courses(skill)]
