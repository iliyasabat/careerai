from pydantic import BaseModel


class Question(BaseModel):
    id: str
    question: str
    difficulty: str
    category: str
    model_answer: str


class Evaluation(BaseModel):
    question_id: str
    star_score: int
    feedback: str
    missing_elements: list[str]
    improved_answer: str
