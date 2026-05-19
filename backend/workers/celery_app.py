import os
from celery import Celery
from celery.schedules import crontab
import tzlocal

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "careeros_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["workers.follow_up"]
)

celery_app.conf.timezone = "Asia/Kolkata"

celery_app.conf.beat_schedule = {
    "send-daily-follow-ups": {
        "task": "workers.follow_up.process_follow_ups",
        "schedule": crontab(hour=9, minute=0),
    },
}
