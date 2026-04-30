from pydantic import BaseModel


class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: str


class AuthResponse(BaseModel):
    token: str
    user: User
