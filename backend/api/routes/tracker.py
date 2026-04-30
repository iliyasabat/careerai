from __future__ import annotations

import uuid
from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.application import Application
from models.user import User
from utils.auth import get_current_user


router = APIRouter(prefix="/tracker", tags=["tracker"])


class CreateApplicationRequest(BaseModel):
    company: str
    role: str
    status: str
    date_applied: str
    notes: str


class PatchApplicationRequest(BaseModel):
    status: str | None = None
    notes: str | None = None


def _days_since(d: date) -> int:
    return max(0, (date.today() - d).days)


@router.get("")
async def list_applications(
    user_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _ = user_id  # frontend may send user_id; backend uses JWT user
    res = await db.execute(
        select(Application).where(Application.user_id == user.id).order_by(Application.date_applied.desc())
    )
    rows = res.scalars().all()
    return [
        {
            "id": str(r.id),
            "user_id": str(r.user_id),
            "company": r.company,
            "role": r.role,
            "status": r.status,
            "date_applied": r.date_applied.isoformat(),
            "days_since": _days_since(r.date_applied),
            "notes": r.notes,
        }
        for r in rows
    ]


@router.post("")
async def create_application(
    payload: CreateApplicationRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        d = date.fromisoformat(payload.date_applied)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date_applied") from e

    row = Application(
        id=uuid.uuid4(),
        user_id=user.id,
        company=payload.company,
        role=payload.role,
        status=payload.status,
        date_applied=d,
        notes=payload.notes,
        created_at=datetime.utcnow(),
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)

    return {
        "id": str(row.id),
        "user_id": str(row.user_id),
        "company": row.company,
        "role": row.role,
        "status": row.status,
        "date_applied": row.date_applied.isoformat(),
        "days_since": _days_since(row.date_applied),
        "notes": row.notes,
    }


@router.patch("/{application_id}")
async def update_application(
    application_id: str,
    payload: PatchApplicationRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        aid = uuid.UUID(application_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid application id") from e

    values = {}
    if payload.status is not None:
        values["status"] = payload.status
    if payload.notes is not None:
        values["notes"] = payload.notes
    if not values:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No updates provided")

    await db.execute(update(Application).where(Application.id == aid, Application.user_id == user.id).values(**values))
    await db.commit()

    res = await db.execute(select(Application).where(Application.id == aid, Application.user_id == user.id))
    row = res.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    return {
        "id": str(row.id),
        "user_id": str(row.user_id),
        "company": row.company,
        "role": row.role,
        "status": row.status,
        "date_applied": row.date_applied.isoformat(),
        "days_since": _days_since(row.date_applied),
        "notes": row.notes,
    }


@router.delete("/{application_id}")
async def delete_application(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        aid = uuid.UUID(application_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid application id") from e

    await db.execute(delete(Application).where(Application.id == aid, Application.user_id == user.id))
    await db.commit()
    return {"ok": True}
