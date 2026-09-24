import os
import unittest
from unittest.mock import patch

from fastapi import HTTPException

from app.routes.download import DownloadRequest, download_video
from app.services.youtube_service import (
    YouTubeServiceError,
    download_youtube_video,
    get_youtube_video_info,
)


VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"


class YouTubeServiceTests(unittest.TestCase):
    def test_valid_public_video_metadata(self):
        video = get_youtube_video_info(VIDEO_URL)

        self.assertEqual(video["video_id"], "dQw4w9WgXcQ")
        self.assertTrue(video["title"])
        self.assertTrue(video["thumbnail"])
        self.assertIsNotNone(video["duration"])

    def test_invalid_url_raises_service_error(self):
        with self.assertRaisesRegex(YouTubeServiceError, "Invalid YouTube URL"):
            get_youtube_video_info("https://example.com/video.mp4")

    @patch("app.services.youtube_service.yt_dlp.YoutubeDL")
    def test_unavailable_video_raises_service_error(self, youtube_downloader):
        youtube_downloader.return_value.__enter__.return_value.extract_info.side_effect = YouTubeServiceError(
            "Unable to process the YouTube video"
        )

        with self.assertRaises(YouTubeServiceError):
            get_youtube_video_info(VIDEO_URL)

    @patch("app.services.youtube_service.yt_dlp.YoutubeDL")
    def test_download_video_returns_file(self, youtube_downloader):
        def write_downloaded_file(_urls):
            options = youtube_downloader.call_args.args[0]
            output_path = options["outtmpl"].replace("%(ext)s", "mp4")
            with open(output_path, "wb") as output_file:
                output_file.write(b"test video")

        youtube_downloader.return_value.__enter__.return_value.download.side_effect = write_downloaded_file

        file_path = download_youtube_video(VIDEO_URL)

        try:
            self.assertTrue(file_path.exists())
            self.assertEqual(file_path.read_bytes(), b"test video")
        finally:
            file_path.unlink()
            file_path.parent.rmdir()


class DownloadRouteTests(unittest.TestCase):
    @patch("app.routes.download.download_youtube_video")
    def test_youtube_endpoint_returns_file_response(self, download_video_mock):
        temporary_file = os.path.join(os.getcwd(), "test-youtube-download.mp4")
        with open(temporary_file, "wb") as output_file:
            output_file.write(b"test video")
        download_video_mock.return_value = temporary_file

        try:
            response = download_video(DownloadRequest(url=VIDEO_URL))

            self.assertEqual(response.media_type, "video/mp4")
            self.assertEqual(response.filename, "download.mp4")
        finally:
            os.remove(temporary_file)

    @patch("app.routes.download.download_youtube_video")
    def test_unavailable_youtube_endpoint_returns_400(self, download_video_mock):
        download_video_mock.side_effect = YouTubeServiceError(
            "Unable to process the YouTube video"
        )

        with self.assertRaises(HTTPException) as context:
            download_video(DownloadRequest(url=VIDEO_URL))

        self.assertEqual(context.exception.status_code, 400)

    def test_direct_media_endpoint_returns_temporary_file(self):
        response = download_video(
            DownloadRequest(
                url="https://www.w3schools.com/html/mov_bbb.mp4"
            )
        )

        try:
            self.assertTrue(os.path.exists(response.path))
            self.assertGreater(os.path.getsize(response.path), 0)
        finally:
            os.remove(response.path)


if __name__ == "__main__":
    unittest.main()
