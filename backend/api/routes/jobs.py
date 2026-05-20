from __future__ import annotations

import uuid

from fastapi import APIRouter, Header, HTTPException, Query, status
from sqlalchemy import select

from database import async_session
from models.resume import Resume
from services.job_fetcher import get_job_by_id, get_jobs


router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("")
async def list_jobs(
    query: str = Query(...),
    location: str = Query(...),
    mode: str | None = Query(None),
    experience: str | None = Query(None),
    salary_min: int | None = Query(None),
    page: int | None = Query(None),
    x_resume_id: str | None = Header(None, alias="X-Resume-Id"),
):
    _ = page  # reserved for Sprint 3 pagination
    resume_embedding = None
    if x_resume_id:
        try:
            rid = uuid.UUID(x_resume_id)
        except ValueError:
            rid = None
        if rid:
            async with async_session() as db:
                res = await db.execute(select(Resume.embedding).where(Resume.id == rid))
                resume_embedding = res.scalar_one_or_none()

    try:
        jobs = await get_jobs(
            query=query,
            location=location,
            mode=mode,
            experience=experience,
            salary_min=salary_min,
            resume_embedding=resume_embedding,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Job search failed: {e}") from e

    return [j.model_dump() for j in jobs]


@router.get("/{job_id}")
async def get_job(
    job_id: str,
    query: str = Query(""),
    location: str = Query(""),
    mode: str | None = Query(None),
):
    job = await get_job_by_id(job_id, query=query, location=location, mode=mode)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job.model_dump()
