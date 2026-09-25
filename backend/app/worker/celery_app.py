import os
from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    "youtube_downloader",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1"),
    include=["app.worker.tasks"],
)

celery_app.conf.update(
    task_track_started=True,
    result_expires=3600,
    beat_schedule={
        "cleanup-expired-downloads": {
            "task": "app.worker.tasks.cleanup_expired_downloads",
            "schedule": crontab(minute="*/15"),
        },
    },
)
