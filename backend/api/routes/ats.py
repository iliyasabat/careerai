from fastapi import APIRouter


router = APIRouter(prefix="/ats", tags=["ats"])


@router.post("/score")
async def score_ats():
    return {"detail": "not implemented"}
