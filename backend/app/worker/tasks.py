
from datetime import datetime, timedelta
from pathlib import Path

from app.database.connection import SessionLocal
from app.database.models import DownloadJob
from app.services.storage_service import save_download
from app.services.youtube_service import (
    cleanup_youtube_download,
    download_youtube_video,
)
from app.worker.celery_app import celery_app


@celery_app.task
def download_youtube_task(job_id: int):
    db = SessionLocal()
    output_path = None
    try:
        # Find the download job
        job = db.get(DownloadJob, job_id)

        if job is None:
            raise ValueError(f"DownloadJob {job_id} not found")

        # Mark job as processing
        job.status = "PROCESSING"
        db.commit()

        # Track the last progress value written to the database
        last_progress = -1

        def update_progress(progress: int) -> None:
            nonlocal last_progress
            print("UPDATE_PROGRESS RECEIVED:", progress)

            if progress <= last_progress:
                return

            last_progress = progress
            print("SAVING PROGRESS TO DATABASE:", progress)
            job.progress = progress
            db.commit()

        # Perform the actual download
       # Perform the actual download
        output_path, video_title = download_youtube_video(
            url=job.url,
            format_id=job.format_id,
            progress_callback=update_progress,
        )

        # Move the temporary file into persistent storage
        persistent_path = save_download(
            source_path=Path(output_path),
            filename=f"{video_title}.mp4",
        )

        # Save successful result
        job.status = "COMPLETED"
        job.file_path = str(persistent_path)
        job.completed_at = datetime.utcnow()
        db.commit()

        return str(persistent_path)

    except Exception as exc:
        # If a job exists, record the failure
        if "job" in locals() and job is not None:
            job.status = "FAILED"
            job.error = str(exc)
            db.commit()

        raise

    finally:
        try:
            if output_path is not None:
                cleanup_youtube_download(str(output_path))
        finally:
            db.close()



@celery_app.task
def cleanup_expired_downloads() -> int:
    db = SessionLocal()

    try:
        cutoff_time = datetime.utcnow() - timedelta(minutes=15)

        expired_jobs = (
            db.query(DownloadJob)
            .filter(
                DownloadJob.status == "COMPLETED",
                DownloadJob.completed_at.is_not(None),
                DownloadJob.completed_at < cutoff_time,
            )
            .all()
        )

        cleaned_count = 0

        for job in expired_jobs:
            if job.file_path:
                file_path = Path(job.file_path)

                if file_path.is_file():
                    file_path.unlink()

            job.status = "EXPIRED"
            job.file_path = None
            cleaned_count += 1

        db.commit()

        return cleaned_count

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()
