from fastapi import APIRouter


router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/questions")
async def questions():
    return []


@router.post("/evaluate")
async def evaluate():
    return {"detail": "not implemented"}
