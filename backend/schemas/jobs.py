from pydantic import BaseModel


class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    mode: str
    salary: str
    experience: str
    match_score: int
    posted: str
    skills_required: list[str]
    description: str
    apply_url: str | None
