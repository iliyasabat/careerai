from pydantic import BaseModel


class ATSDimension(BaseModel):
    score: int
    max: int
    missing: list[str] = []
    weak_bullets: list[str] = []


class ATSResult(BaseModel):
    resume_id: str
    overall_score: int
    grade: str
    dimensions: dict[str, ATSDimension]
    recommendation: str
    missing_keywords: list[str]
    weak_bullets: list[str]
