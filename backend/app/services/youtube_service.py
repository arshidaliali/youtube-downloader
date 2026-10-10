import os
import json
import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple
from urllib.parse import parse_qs, urlparse

import yt_dlp
from yt_dlp.utils import DownloadError


YOUTUBE_HOSTS = {
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
}


class YouTubeServiceError(RuntimeError):
    """Raised when yt-dlp cannot return YouTube video metadata."""


QUALITY_OPTIONS = (
    (1080, "1080p HD"),
    (720, "720p HD"),
    (480, "480p"),
    (360, "360p"),
)


def _has_video(format_info: Dict[str, Any]) -> bool:
    return bool(format_info.get("vcodec") not in (None, "none"))


def _has_audio(format_info: Dict[str, Any]) -> bool:
    return bool(format_info.get("acodec") not in (None, "none"))


def _is_mp4_compatible(format_info: Dict[str, Any]) -> bool:
    codec = str(format_info.get("vcodec") or "")
    return format_info.get("ext") == "mp4" or codec.startswith(("avc1", "h264"))


def _is_h264(format_info: Dict[str, Any]) -> bool:
    codec = str(format_info.get("vcodec") or "").lower()
    return codec.startswith(("avc1", "h264"))


def _is_aac(format_info: Dict[str, Any]) -> bool:
    codec = str(format_info.get("acodec") or "").lower()
    return codec.startswith(("mp4a", "aac"))


def _video_score(format_info: Dict[str, Any]) -> Tuple[int, int, float]:
    return (
        1 if _is_h264(format_info) else 0,
        1 if _is_mp4_compatible(format_info) else 0,
        float(format_info.get("tbr") or 0),
    )


def _audio_score(format_info: Dict[str, Any]) -> Tuple[int, int, float]:
    codec = str(format_info.get("acodec") or "")
    return (
        1 if _is_aac(format_info) else 0,
        1 if format_info.get("ext") == "m4a" or "mp4a" in codec else 0,
        float(format_info.get("abr") or format_info.get("tbr") or 0),
    )


def _select_quality_formats(video: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Build the small user-facing quality list from yt-dlp's raw formats."""
    raw_formats = [
        format_info
        for format_info in video.get("formats", [])
        if format_info.get("format_id") and format_info.get("ext") != "mhtml"
    ]
    audio_formats = [format_info for format_info in raw_formats if _has_audio(format_info)]
    quality_formats = []

    for height, label in QUALITY_OPTIONS:
        candidates = [
            format_info
            for format_info in raw_formats
            if _has_video(format_info) and format_info.get("height") == height
        ]
        if not candidates:
            continue

        video_format = max(candidates, key=_video_score)
        audio_format = None

        if not _has_audio(video_format):
            if not audio_formats:
                continue
            audio_format = max(audio_formats, key=_audio_score)

        sizes = [
            format_info.get("filesize") or format_info.get("filesize_approx")
            for format_info in (video_format, audio_format)
            if format_info
        ]

        quality_formats.append(
            {
                "format_id": f"quality-{height}",
                "ext": "mp4",
                "height": height,
                "width": video_format.get("width"),
                "fps": video_format.get("fps"),
                "filesize": sum(size for size in sizes if size),
                "filesize_approx": None,
                "has_video": True,
                "has_audio": True,
                "quality_label": label,
            }
        )

    return quality_formats


def _quality_height(quality_id: str) -> Optional[int]:
    for height, _label in QUALITY_OPTIONS:
        if quality_id == f"quality-{height}":
            return height
    return None


def _resolve_quality(video: Dict[str, Any], quality_id: str) -> str:
    height = _quality_height(quality_id)
    if height is None:
        raise YouTubeServiceError("The requested video quality is invalid")

    raw_formats = [
        format_info
        for format_info in video.get("formats", [])
        if format_info.get("format_id") and format_info.get("ext") != "mhtml"
    ]
    candidates = [
        format_info
        for format_info in raw_formats
        if _has_video(format_info) and format_info.get("height") == height
    ]
    if not candidates:
        raise YouTubeServiceError(f"{height}p is not available for this video")

    video_format = max(candidates, key=_video_score)
    if _has_audio(video_format):
        return str(video_format["format_id"])

    audio_formats = [format_info for format_info in raw_formats if _has_audio(format_info)]
    if not audio_formats:
        raise YouTubeServiceError("No compatible audio stream is available")
    audio_format = max(audio_formats, key=_audio_score)
    return f"{video_format['format_id']}+{audio_format['format_id']}"


def _find_downloaded_media(directory: Path) -> Optional[Path]:
    media_extensions = {
        ".mp4",
        ".webm",
        ".mkv",
        ".mov",
        ".avi",
        ".m4a",
        ".aac",
        ".opus",
    }

    for path in directory.iterdir():
        if path.is_file() and path.suffix.lower() in media_extensions:
            return path

    return None


def is_youtube_url(url: str) -> bool:
    parsed = urlparse(url)

    return (parsed.hostname or "").lower() in YOUTUBE_HOSTS


def get_youtube_video_id(url: str) -> Optional[str]:
    parsed = urlparse(url)
    hostname = (parsed.hostname or "").lower()

    if hostname not in YOUTUBE_HOSTS:
        return None

    # Standard URL:
    # https://www.youtube.com/watch?v=VIDEO_ID
    if hostname in {
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
    }:
        path_parts = parsed.path.strip("/").split("/")
        if len(path_parts) >= 2 and path_parts[0].lower() == "shorts":
            return path_parts[1] or None

        query = parse_qs(parsed.query)

        video_id = query.get("v", [None])[0]
        return video_id or None

    # Short URL:
    # https://youtu.be/VIDEO_ID
    if hostname == "youtu.be":
        video_id = parsed.path.strip("/").split("/")[0]
        return video_id or None

    return None


def get_youtube_video_info(url: str):
    """Extract a small, JSON-serializable metadata dictionary with yt-dlp."""
    if not is_youtube_url(url) or not get_youtube_video_id(url):
        raise YouTubeServiceError("Invalid YouTube URL")

    options: Dict[str, Any] = {
        "quiet": True,
        "skip_download": True,
        "js_runtimes": {
            "deno": {},
        },
    }

    try:
        
        with yt_dlp.YoutubeDL(options) as downloader:
            video = downloader.extract_info(
                url,
                download=False,
                process=False,
            )
    except DownloadError as exc:
        raise YouTubeServiceError(
            "Unable to process the YouTube video"
        ) from exc
    except Exception as exc:
        raise YouTubeServiceError(
            "Unable to process the YouTube video"
        ) from exc

    if not video:
        return None

    return {
        "video_id": video.get("id"),
        "title": video.get("title"),
        "description": video.get("description"),
        "channel_title": video.get("channel") or video.get("uploader"),
        "thumbnail": video.get("thumbnail"),
        "duration": video.get("duration"),
        "upload_date": video.get("upload_date"),
        "view_count": video.get("view_count"),
        "like_count": video.get("like_count"),
        "formats": _select_quality_formats(video),
    }

def _run_ffprobe(path: Path) -> Dict[str, Any]:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=format_name:stream=codec_type,codec_name",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def _has_compatible_codecs(path: Path) -> bool:
    probe = _run_ffprobe(path)
    format_names = str(probe.get("format", {}).get("format_name", "")).split(",")
    streams = probe.get("streams", [])
    video_codecs = {
        stream.get("codec_name") for stream in streams if stream.get("codec_type") == "video"
    }
    audio_codecs = {
        stream.get("codec_name") for stream in streams if stream.get("codec_type") == "audio"
    }
    return (
        "mp4" in format_names
        and "h264" in video_codecs
        and "aac" in audio_codecs
    )


def _download_thumbnail(url: Optional[str], directory: Path) -> Optional[Path]:
    if not url:
        return None

    thumbnail_path = directory / "thumbnail.jpg"
    try:
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=30) as response:
            thumbnail_path.write_bytes(response.read())
        return thumbnail_path
    except Exception:
        return None


def _convert_to_compatible_mp4(
    source_path: Path,
    output_path: Path,
    metadata: Dict[str, Any],
    thumbnail_path: Optional[Path],
) -> None:
    compatible_source = _has_compatible_codecs(source_path)
    metadata_args = []
    metadata_values = {
        "title": metadata.get("title"),
        "artist": metadata.get("channel") or metadata.get("uploader"),
        "description": metadata.get("description"),
        "date": metadata.get("upload_date"),
        "comment": metadata.get("id"),
    }
    for key, value in metadata_values.items():
        if value:
            metadata_args.extend(["-metadata", f"{key}={value}"])

    base_command = ["ffmpeg", "-y", "-i", str(source_path)]
    if thumbnail_path:
        base_command.extend(["-i", str(thumbnail_path)])

    codec_args = (
        ["-c:v", "copy", "-c:a", "copy"]
        if compatible_source
        else [
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "23",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
        ]
    )
    base_command.extend(
        [
            "-map",
            "0:v:0",
            "-map",
            "0:a:0",
            *codec_args,
            "-movflags",
            "+faststart",
            *metadata_args,
        ]
    )

    if thumbnail_path:
        command_with_cover = [
            *base_command,
            "-map",
            "1:v:0",
            "-c:v:1",
            "mjpeg",
            "-disposition:v:1",
            "attached_pic",
            str(output_path),
        ]
        try:
            subprocess.run(command_with_cover, check=True, capture_output=True)
            return
        except subprocess.CalledProcessError:
            if output_path.exists():
                output_path.unlink()

    subprocess.run([*base_command, str(output_path)], check=True, capture_output=True)


def download_youtube_video(
    url: str,
    format_id: Optional[str] = None,
    progress_callback: Optional[Callable[[int], None]] = None,
) -> tuple[Path, str | None]:
    """Download one YouTube video into a private temporary directory."""
    if not is_youtube_url(url) or not get_youtube_video_id(url):
        raise YouTubeServiceError("Invalid YouTube URL")

    temporary_directory = tempfile.mkdtemp(prefix="youtube-download-")
    output_template = os.path.join(temporary_directory, "source.%(ext)s")
    options: Dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "continuedl": True,
        "retries": 10,
        "fragment_retries": 10,
        "file_access_retries": 5,
        "socket_timeout": 30,
        "format": "best[ext=mp4]/best",
        "outtmpl": output_template,
    
    }
    ffmpeg_available = shutil.which("ffmpeg") is not None
    ffprobe_available = shutil.which("ffprobe") is not None
    def progress_hook(progress: Dict[str, Any]) -> None:
        print("YT-DLP PROGRESS:", progress)
        if progress.get("status") != "downloading":
            return

        total_bytes = (
            progress.get("total_bytes")
            or progress.get("total_bytes_estimate")
        )
        downloaded_bytes = progress.get("downloaded_bytes")

        if not total_bytes or downloaded_bytes is None:
            return

        percentage = int(
            (downloaded_bytes / total_bytes) * 100
        )

        percentage = max(0, min(percentage, 100))

        if progress_callback:
            print("CALLING PROGRESS CALLBACK:", percentage)
            progress_callback(percentage)

    try:
        metadata_options: Dict[str, Any] = {
            "quiet": True,
            "no_warnings": True,
            "noplaylist": True,
            "skip_download": True,
        }
        with yt_dlp.YoutubeDL(metadata_options) as downloader:
            video = downloader.extract_info(url, download=False)
        if not video:
            raise YouTubeServiceError("YouTube video not found")

        if format_id:
            options["format"] = _resolve_quality(video, format_id)

        if "+" in options["format"]:
            if not ffmpeg_available:
                raise YouTubeServiceError(
                    "FFmpeg is required to merge the selected video and audio streams"
                )
            options["merge_output_format"] = "mkv"

        if not format_id:
            options["extractor_args"] = {
                "youtube": {
                    "player_client": ["android"],
                },
            }
        options["progress_hooks"] = [progress_hook]
        with yt_dlp.YoutubeDL(options) as downloader:
            downloader.download([url])

        source_file = _find_downloaded_media(Path(temporary_directory))
        if not source_file:
            raise YouTubeServiceError("YouTube download produced no file")

        if not ffmpeg_available or not ffprobe_available:
            raise YouTubeServiceError("FFmpeg and FFprobe are required for MP4 output")

        thumbnail_path = _download_thumbnail(video.get("thumbnail"), Path(temporary_directory))
        final_path = Path(temporary_directory) / "download.mp4"
        _convert_to_compatible_mp4(
            source_file,
            final_path,
            video,
            thumbnail_path,
        )
        if not final_path.exists() or not _has_compatible_codecs(final_path):
            raise YouTubeServiceError(
                "The downloaded file could not be verified as H.264/AAC MP4"
            )

        return (final_path, video.get("title"))
    except DownloadError as exc:
        shutil.rmtree(temporary_directory, ignore_errors=True)
        raise YouTubeServiceError("Unable to download the YouTube video") from exc
    except subprocess.CalledProcessError as exc:
        shutil.rmtree(temporary_directory, ignore_errors=True)
        raise YouTubeServiceError("FFmpeg could not create a compatible MP4") from exc
    except YouTubeServiceError:
        shutil.rmtree(temporary_directory, ignore_errors=True)
        raise
    except Exception as exc:
        shutil.rmtree(temporary_directory, ignore_errors=True)
        raise YouTubeServiceError("Unable to download the YouTube video") from exc


def cleanup_youtube_download(path: str) -> None:
    """Remove a downloaded file and its private temporary directory."""
    file_path = Path(path)
    temporary_directory = file_path.parent

    if file_path.exists():
        file_path.unlink()
    if temporary_directory.name.startswith("youtube-download-"):
        shutil.rmtree(str(temporary_directory), ignore_errors=True)