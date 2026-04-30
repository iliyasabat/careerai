from fastapi import APIRouter


router = APIRouter(prefix="/tracker", tags=["tracker"])


@router.get("")
async def list_applications():
    return []


@router.post("")
async def create_application():
    return {"detail": "not implemented"}


@router.patch("/{application_id}")
async def update_application(application_id: str):
    return {"detail": "not implemented", "id": application_id}


@router.delete("/{application_id}")
async def delete_application(application_id: str):
    return {"ok": True}
