from pathlib import Path
import re
import shutil


BASE_DIR = Path(__file__).resolve().parents[2]
DOWNLOAD_STORAGE_DIR = BASE_DIR / "storage" / "downloads"


def _make_safe_filename(filename: str) -> str:
    """
    Convert a user/video title into a filesystem-safe filename.
    """

    path = Path(filename)

    stem = path.stem
    suffix = path.suffix or ".mp4"

    # Replace characters that are unsafe on common filesystems.
    stem = re.sub(r'[<>:"/\\|?*]', "", stem)

    # Replace repeated whitespace with a single space.
    stem = re.sub(r"\s+", " ", stem).strip()

    # Remove trailing dots/spaces.
    stem = stem.rstrip(". ")

    # Provide a fallback if the title becomes empty.
    if not stem:
        stem = "youtube-video"

    # Keep the filename reasonably short.
    stem = stem[:180].rstrip(". ")

    return f"{stem}{suffix}"


def save_download(source_path: Path, filename: str) -> Path:
    """
    Move a completed download into persistent application storage.

    Returns:
        Path: Persistent path of the saved file.
    """

    DOWNLOAD_STORAGE_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    safe_filename = _make_safe_filename(filename)
    destination = DOWNLOAD_STORAGE_DIR / safe_filename

    # Avoid overwriting an existing download.
    counter = 2

    while destination.exists():
        destination = (
            DOWNLOAD_STORAGE_DIR
            / f"{Path(safe_filename).stem}-{counter}{Path(safe_filename).suffix}"
        )
        counter += 1

    shutil.move(
        str(source_path),
        str(destination),
    )

    return destination