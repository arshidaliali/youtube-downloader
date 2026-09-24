from pathlib import Path
import shutil


BASE_DIR = Path(__file__).resolve().parents[2]
DOWNLOAD_STORAGE_DIR = BASE_DIR / "storage" / "downloads"


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

    destination = DOWNLOAD_STORAGE_DIR / filename

    shutil.move(
        str(source_path),
        str(destination),
    )

    return destination
