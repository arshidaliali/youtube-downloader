
import os
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette.background import BackgroundTask

from app.database.connection import get_db
from app.database.models import DownloadJob
from app.services.media_service import download_media
from app.services.youtube_service import (
    YouTubeServiceError,
    get_youtube_video_info,
    is_youtube_url,
)
from app.worker.tasks import download_youtube_task


router = APIRouter()


class DownloadRequest(BaseModel):
    url: str
    format_id: Optional[str] = None


class VideoInfoRequest(BaseModel):
    url: str


class VideoFormat(BaseModel):
    format_id: str
    ext: Optional[str] = None
    height: Optional[int] = None
    width: Optional[int] = None
    fps: Optional[float] = None
    filesize: Optional[int] = None
    filesize_approx: Optional[int] = None
    has_video: bool
    has_audio: bool
    quality_label: Optional[str] = None


class VideoInfoResponse(BaseModel):
    video_id: Optional[str] = None
    title: Optional[str] = None
    thumbnail: Optional[str] = None
    duration: Optional[float] = None
    formats: List[VideoFormat]


class DownloadJobResponse(BaseModel):
    job_id: int
    status: str
    progress: int = 0
    task_id: Optional[str] = None
    file_path: Optional[str] = None
    error: Optional[str] = None

class DownloadJobSubmissionResponse(BaseModel):
    job_id: int
    task_id: str
    status: str


def remove_file(path: str):
    if os.path.exists(path):
        os.remove(path)


@router.post("/api/video/info", response_model=VideoInfoResponse)
def video_info(request: VideoInfoRequest) -> VideoInfoResponse:
    if not is_youtube_url(request.url):
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL",
        )

    try:
        video_info = get_youtube_video_info(request.url)

        if not video_info:
            raise HTTPException(
                status_code=404,
                detail="YouTube video not found",
            )

        return video_info
    except HTTPException:
        raise
    except YouTubeServiceError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve YouTube video information",
        ) from exc


@router.post("/api/download")
def download_video(
    request: DownloadRequest,
    db: Session = Depends(get_db),
):
    if is_youtube_url(request.url):
        job = DownloadJob(
            url=request.url,
            format_id=request.format_id,
            status="PENDING",
        )

        try:
            db.add(job)
            db.commit()
            db.refresh(job)

            task = download_youtube_task.delay(job.id)
            job.task_id = task.id
            db.commit()

            return DownloadJobSubmissionResponse(
                job_id=job.id,
                task_id=task.id,
                status=job.status,
            )
        except Exception as exc:
            
            if job.id is not None:
                db.rollback()
                job.status = "FAILED"
                job.error = f"Unable to enqueue YouTube download: {exc}"
                db.commit()

            raise HTTPException(
                status_code=503,
                detail="Unable to enqueue the YouTube download",
            ) from exc

    try:
        file_path = download_media(request.url)

        return FileResponse(
            path=file_path,
            media_type="video/mp4",
            filename="download.mp4",
            background=BackgroundTask(
                remove_file,
                str(file_path),
            ),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to download media: {str(exc)}",
        )


@router.get("/api/download/{job_id}/file")
def download_completed_file(job_id: int, db: Session = Depends(get_db)):
    job = db.get(DownloadJob, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Download job not found")

    if job.status != "COMPLETED":
        raise HTTPException(
            status_code=409,
            detail=f"Download is not completed (status: {job.status})",
        )

    if not job.file_path:
        raise HTTPException(status_code=404, detail="Completed file path not found")

    file_path = Path(job.file_path)
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Completed file not found")

    return FileResponse(
        path=file_path,
        media_type="video/mp4",
        filename=file_path.name,
    )


@router.get("/api/download/{job_id}", response_model=DownloadJobResponse)
def download_status(job_id: int, db: Session = Depends(get_db)):
    job = db.get(DownloadJob, job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Download job not found")

    return DownloadJobResponse(
    job_id=job.id,
    status=job.status,
    progress=job.progress,
    task_id=job.task_id,
    file_path=job.file_path,
    error=job.error,
)
