from pydantic import BaseModel


class Course(BaseModel):
    title: str
    platform: str
    instructor: str
    duration: str
    free: bool
    url: str
    rating: float | None


class SkillGapResult(BaseModel):
    target_role: str
    your_skills: list[str]
    required_skills: list[str]
    missing_skills: list[str]
    courses: dict[str, list[Course]]
