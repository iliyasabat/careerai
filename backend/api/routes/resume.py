from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.resume import Resume
from models.user import User
from services.resume_parser import parse_resume
from utils.auth import get_current_user


router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    filename = file.filename or "resume"
    file_bytes = await file.read()

    try:
        parsed = parse_resume(file_bytes, filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse resume: {e}",
        ) from e

    resume_row = Resume(
        id=uuid.UUID(parsed.resume_id),
        user_id=user.id,
        filename=filename,
        parsed_json={
            "resume_id": parsed.resume_id,
            "filename": parsed.filename,
            "sections": parsed.sections,
            "skills": parsed.skills,
            "experience_years": parsed.experience_years,
            "bullets": [
                {
                    "id": b.id,
                    "text": b.text,
                    "is_strong": b.is_strong,
                    "action_verb": b.action_verb,
                    "has_metric": b.has_metric,
                }
                for b in parsed.bullets
            ],
        },
        embedding=parsed.embedding,
    )
    db.add(resume_row)
    await db.commit()

    return {
        "resume_id": parsed.resume_id,
        "parsed": {
            "sections": parsed.sections,
            "skills": parsed.skills,
            "experience_years": parsed.experience_years,
            "bullets": [
                {
                    "id": b.id,
                    "text": b.text,
                    "is_strong": b.is_strong,
                    "action_verb": b.action_verb,
                    "has_metric": b.has_metric,
                }
                for b in parsed.bullets
            ],
        },
    }


@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        rid = uuid.UUID(resume_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid resume id") from e

    res = await db.execute(select(Resume).where(Resume.id == rid, Resume.user_id == user.id))
    row = res.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    parsed_json = row.parsed_json or {}
    return {
        "resume_id": str(row.id),
        "filename": row.filename,
        "sections": parsed_json.get("sections", {}),
        "skills": parsed_json.get("skills", []),
        "experience_years": parsed_json.get("experience_years", 0.0),
        "bullets": parsed_json.get("bullets", []),
        "embedding": row.embedding or [],
    }
