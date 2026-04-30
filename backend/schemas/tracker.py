from pydantic import BaseModel


class Application(BaseModel):
    id: str
    user_id: str
    company: str
    role: str
    status: str
    date_applied: str
    days_since: int
    notes: str
