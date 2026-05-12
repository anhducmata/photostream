"""AI processing pipeline outline for uploaded photos and videos."""

from dataclasses import dataclass
from pathlib import Path
from typing import Literal
from uuid import UUID


@dataclass
class ProcessingResult:
    media_id: UUID
    thumbnail_path: Path
    preview_path: Path | None
    media_type: Literal["image", "video"]
    width: int
    height: int
    duration_seconds: float | None
    labels: list[str]
    caption: str
    embedding: list[float]


def process_media(media_id: UUID, original_path: Path, workdir: Path) -> ProcessingResult:
    """Process one uploaded object.

    Production implementation steps:
    1. Probe metadata with Pillow/ExifTool for images or ffprobe for videos.
    2. Create a WebP thumbnail and optional animated image preview frames.
    3. Create muted short MP4/WebM preview clips for videos with ffmpeg.
    4. Select a representative key frame for embedding/detection/captioning.
    5. Run SigLIP/CLIP image encoder, YOLO object detector, and BLIP/Florence-2 captioner.
    6. Upload generated renditions and write labels/caption/embedding back to PostgreSQL.
    """

    raise NotImplementedError("Connect model, storage, and database adapters")


def normalize_labels(raw_labels: list[str]) -> list[str]:
    """Deduplicate model labels while preserving stable lowercase display labels."""

    return sorted({label.strip().lower().replace("_", " ") for label in raw_labels if label.strip()})
