from pydantic import BaseModel


class EmailVariant(BaseModel):
    subject: str
    body: str


class EmailResult(BaseModel):
    email_id: str
    subject: str
    body: str
    word_count: int
    tone_used: str
    variants: dict[str, EmailVariant]
    follow_up_date: str
