from pydantic import BaseModel

class CuratedBullet(BaseModel):
    id: str
    original: str
    rewritten: str
    status: str

class CurationRequest(BaseModel):
    resume_id: str
    job_description: str

class CurationResult(BaseModel):
    bullets: list[CuratedBullet]
