
import os
import shutil
import tempfile
import urllib.request
from pathlib import Path


def download_media(url: str) -> Path:
    """
    Download media from a direct URL into a temporary MP4 file.

    Returns:
        Path: Path to the downloaded temporary file.

    Raises:
        Exception: Re-raises any error that occurs during downlo
        ad.
    """

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".mp4",
    )

    temp_file.close()

    try:
        request = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0",
            },
        )

        with urllib.request.urlopen(request) as response:
            with open(temp_file.name, "wb") as output_file:
                shutil.copyfileobj(response, output_file)

        return Path(temp_file.name)

    except Exception:
        if os.path.exists(temp_file.name):
            os.remove(temp_file.name)

        raise
