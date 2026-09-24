from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.download import router as download_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(download_router)


@app.get("/")
def home():
    return {"message": "YouTube Downloader API is running"}