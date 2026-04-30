from __future__ import annotations

import random

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from data.question_bank import QUESTION_BANK, ROLE_TO_CATEGORIES
from utils.auth import get_current_user


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
    cats = ROLE_TO_CATEGORIES.get(payload.role) or ["System Design", "Backend Engineering", "Behavioural"]
    pool = [q for q in QUESTION_BANK if q["category"] in cats]
    random.shuffle(pool)
    n = random.randint(5, 8)
    return pool[:n]


@router.post("/evaluate")
async def evaluate(payload: EvaluateRequest, _u=Depends(get_current_user)):
    # Stubbed in Sprint 2 by design; Sprint 3 upgrades with LLM evaluation
    return {
        "question_id": payload.question_id,
        "star_score": 3,
        "feedback": "Good structure, add more concrete impact and metrics.",
        "missing_elements": ["Result"],
        "improved_answer": "I clarified the goal, implemented a focused approach, and validated outcomes with measurable impact while collaborating with stakeholders.",
    }
