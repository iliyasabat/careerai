from pydantic import BaseModel


class ParsedBullet(BaseModel):
    id: str
    text: str
    is_strong: bool
    action_verb: str | None
    has_metric: bool


class ParsedResume(BaseModel):
    resume_id: str
    filename: str
    sections: dict[str, str]
    skills: list[str]
    experience_years: float
    bullets: list[ParsedBullet]
    embedding: list[float]
