from __future__ import annotations

import random

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from data.question_bank import QUESTION_BANK, ROLE_TO_CATEGORIES
from utils.auth import get_current_user
from services.interview_coach import generate_dynamic_questions, evaluate_answer

router = APIRouter(prefix="/interview", tags=["interview"])


class QuestionsRequest(BaseModel):
    role: str
    job_description: str | None = None


class EvaluateRequest(BaseModel):
    question_id: str
    question_text: str
    answer_text: str
    role: str


@router.post("/questions")
async def questions(payload: QuestionsRequest, _u=Depends(get_current_user)):
    if payload.job_description:
        # Use LLM dynamic questions
        dynamic = await generate_dynamic_questions(payload.role, payload.job_description)
        if dynamic:
            return dynamic
            
    cats = ROLE_TO_CATEGORIES.get(payload.role) or ["System Design", "Backend Engineering", "Behavioural"]
    pool = [q for q in QUESTION_BANK if q["category"] in cats]
    random.shuffle(pool)
    n = random.randint(5, 8)
    return pool[:n]


@router.post("/evaluate")
async def evaluate(payload: EvaluateRequest, _u=Depends(get_current_user)):
    try:
        result = await evaluate_answer(
            question_id=payload.question_id,
            question_text=payload.question_text,
            answer_text=payload.answer_text,
            role=payload.role
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Answer evaluation failed: {e}",
        ) from e
    return result.model_dump()
