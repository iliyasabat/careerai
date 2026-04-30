from fastapi import APIRouter


router = APIRouter(prefix="/email", tags=["email"])


@router.post("/generate")
async def generate():
    return {"detail": "not implemented"}


@router.post("/send")
async def send():
    return {"detail": "not implemented"}
