# YouTube Video Downloader

A full-stack web application for retrieving video information, selecting available formats and processing download requests through an asynchronous backend workflow.

## Technology Stack

- **Frontend:** Next.js and TypeScript
- **Backend:** FastAPI and Python
- **Background processing:** Celery and Redis
- **Video processing:** yt-dlp and FFmpeg
- **Database:** PostgreSQL
- **Deployment:** Docker and Docker Compose

## Project Highlights

- REST API development with FastAPI
- Asynchronous background task processing
- Queue-based job management using Celery and Redis
- Video information retrieval and format selection
- Backend service integration and downloadable file delivery
- Containerized application deployment

This project demonstrates practical experience building and integrating frontend applications, Python APIs, background workers and supporting infrastructure.

## Architecture Overview

The application separates the user interface, API backend, and background processing to handle download requests asynchronously.

- **Frontend — Next.js:** Provides the user interface for submitting requests and viewing results.
- **Backend — FastAPI:** Handles API requests for video information and downloads.
- **Task processing — Celery:** Executes long-running download tasks asynchronously.
- **Message broker — Redis:** Supports communication between the backend and background workers.
- **Video retrieval — yt-dlp:** Retrieves video information and processes supported download requests.
- **Database — PostgreSQL:** Supports persistent application data.
- **Containerization — Docker Compose:** Helps run the application's services in containers.

### Request Workflow

1. The user submits a video URL through the frontend.
2. The backend validates the request and retrieves video information.
3. When a download is requested, the backend dispatches background work through Celery and Redis.
4. A worker processes the download, and the frontend can retrieve the job status and access the resulting file through the API.
