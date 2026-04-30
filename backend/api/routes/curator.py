from fastapi import APIRouter


router = APIRouter(prefix="/curator", tags=["curator"])


@router.post("/curate")
async def curate():
    return {"detail": "not implemented"}


@router.get("/accept")
async def accept():
    return {"detail": "not implemented"}
