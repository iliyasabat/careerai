from fastapi import APIRouter


router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("")
async def list_jobs():
    return []


@router.get("/{job_id}")
async def get_job(job_id: str):
    return {"detail": "not implemented", "job_id": job_id}
