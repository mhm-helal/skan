from celery import Celery
from app.config import settings

celery = Celery("skan", broker=settings.REDIS_URL, backend=settings.REDIS_URL)
celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Africa/Cairo",
    enable_utc=True,
    task_routes={
        "app.tasks.email.*": {"queue": "email"},
    },
)
celery.autodiscover_tasks(["app.tasks"])
