"""FastAPI sketch for the Photostream media service.

The implementation intentionally keeps providers injectable: use S3/R2/MinIO for
object storage, PostgreSQL + pgvector for persistence, and Redis/SQS/Celery for
background processing.
"""

from datetime import datetime
from typing import Literal
from uuid import UUID

from fastapi import FastAPI, HTTPException, UploadFile
from pydantic import BaseModel, Field

app = FastAPI(title="Photostream API", version="0.1.0")


class MediaItem(BaseModel):
    id: UUID
    file_url: str
    thumbnail_url: str | None = None
    preview_url: str | None = None
    media_type: Literal["image", "video"]
    width: int | None = None
    height: int | None = None
    duration_seconds: float | None = None
    created_at: datetime | None = None
    uploaded_at: datetime
    caption: str | None = None
    labels: list[str] = Field(default_factory=list)
    processing_status: Literal["queued", "processing", "ready", "failed"]


class UploadRequest(BaseModel):
    filename: str
    content_type: str
    size_bytes: int


class UploadTarget(BaseModel):
    media_id: UUID
    upload_url: str
    file_url: str
    fields: dict[str, str] = Field(default_factory=dict)


class SearchResponse(BaseModel):
    items: list[MediaItem]
    next_cursor: str | None = None


@app.post("/api/media/uploads", response_model=UploadTarget)
async def create_upload_target(request: UploadRequest) -> UploadTarget:
    if not request.content_type.startswith(("image/", "video/")):
        raise HTTPException(status_code=415, detail="Only images and videos are supported")

    # 1. Insert queued media_items row.
    # 2. Create a short-lived presigned POST/PUT URL.
    # 3. Return media_id and upload target to the browser.
    raise HTTPException(status_code=501, detail="Wire to storage and database provider")


@app.post("/api/media/{media_id}/complete", status_code=202)
async def complete_upload(media_id: UUID) -> dict[str, str]:
    # Verify the object exists, then enqueue media_id for AI processing.
    return {"media_id": str(media_id), "status": "queued"}


@app.post("/api/media/direct", response_model=MediaItem)
async def direct_upload(file: UploadFile) -> MediaItem:
    # Useful for small self-hosted deployments; production should use presigned uploads.
    raise HTTPException(status_code=501, detail="Use /api/media/uploads for production")


@app.get("/api/media", response_model=SearchResponse)
async def list_media(cursor: str | None = None, limit: int = 60) -> SearchResponse:
    # SELECT ready and processing items ordered by created_at/uploaded_at DESC.
    return SearchResponse(items=[], next_cursor=None)


@app.get("/api/media/search", response_model=SearchResponse)
async def search_media(q: str, cursor: str | None = None, limit: int = 60) -> SearchResponse:
    # Generate text embedding for q, run hybrid keyword/vector search, and return ranked media.
    return SearchResponse(items=[], next_cursor=None)


@app.get("/api/media/{media_id}", response_model=MediaItem)
async def get_media(media_id: UUID) -> MediaItem:
    raise HTTPException(status_code=404, detail="Media item not found")


@app.get("/api/media/{media_id}/download")
async def download_media(media_id: UUID) -> dict[str, str]:
    # Return a short-lived signed URL to the original file.
    return {"url": "https://storage.example.com/signed-download"}


@app.delete("/api/media/{media_id}", status_code=204)
async def delete_media(media_id: UUID) -> None:
    # Delete DB row and original/thumbnail/preview objects.
    return None
