import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from models import (  # noqa: F401
    Application,
    EmailLog,
    InterviewSession,
    JobCache,
    Resume,
    User,
)
from api.routes import (
    ats,
    auth,
    curator,
    email,
    interview,
    jobs,
    resume,
    skills,
    tracker,
)
from config import settings
from ml import embeddings as _embeddings  # noqa: F401
from ml import ner_extractor as _ner_extractor  # noqa: F401


app = FastAPI(title="CareerOS API")

logger = logging.getLogger("careeros")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.on_event("startup")
async def _startup():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception:
        # Allow the app to start even if Postgres isn't up yet.
        logger.exception("Startup DB init failed")


app.include_router(auth.router, prefix="/api")
app.include_router(resume.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(ats.router, prefix="/api")
app.include_router(curator.router, prefix="/api")
app.include_router(skills.router, prefix="/api")
app.include_router(email.router, prefix="/api")
app.include_router(interview.router, prefix="/api")
app.include_router(tracker.router, prefix="/api")
