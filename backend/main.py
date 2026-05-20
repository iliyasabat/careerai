import asyncio
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
# Bump our own loggers to INFO regardless of the root config so the per-feature
# diagnostics from services.* always reach the console.
logging.getLogger("careeros").setLevel(logging.INFO)

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
from services.follow_up_scheduler import follow_up_poll_loop


logger = logging.getLogger("careeros")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception:
        # Allow the app to start even if the database isn't reachable yet.
        logger.exception("Startup DB init failed")

    poll_task = asyncio.create_task(follow_up_poll_loop())
    try:
        yield
    finally:
        poll_task.cancel()
        try:
            await poll_task
        except asyncio.CancelledError:
            pass


app = FastAPI(title="CareerOS API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {type(exc).__name__}: {exc}"},
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api")
app.include_router(resume.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(ats.router, prefix="/api")
app.include_router(curator.router, prefix="/api")
app.include_router(skills.router, prefix="/api")
app.include_router(email.router, prefix="/api")
app.include_router(interview.router, prefix="/api")
app.include_router(tracker.router, prefix="/api")
