from fastapi import APIRouter


router = APIRouter(prefix="/skills", tags=["skills"])


@router.post("/gap")
async def gap():
    return {"detail": "not implemented"}


@router.get("/courses")
async def courses():
    return []
