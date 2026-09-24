import unittest

from app.services.youtube_service import (
    get_youtube_video_id,
    get_youtube_video_info,
    is_youtube_url,
)


class YouTubeUrlTests(unittest.TestCase):
    def test_supported_watch_url(self):
        url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

        self.assertTrue(is_youtube_url(url))
        self.assertEqual(get_youtube_video_id(url), "dQw4w9WgXcQ")

    def test_supported_short_url(self):
        url = "https://youtu.be/dQw4w9WgXcQ"

        self.assertTrue(is_youtube_url(url))
        self.assertEqual(get_youtube_video_id(url), "dQw4w9WgXcQ")

    def test_supported_shorts_url(self):
        url = "https://www.youtube.com/shorts/qcH182Exm8I"

        self.assertTrue(is_youtube_url(url))
        self.assertEqual(get_youtube_video_id(url), "qcH182Exm8I")

    def test_non_youtube_url(self):
        url = "https://example.com/video.mp4"

        self.assertFalse(is_youtube_url(url))
        self.assertIsNone(get_youtube_video_id(url))

    def test_youtube_url_without_video_id(self):
        url = "https://www.youtube.com/watch"

        self.assertTrue(is_youtube_url(url))
        self.assertIsNone(get_youtube_video_id(url))

    def test_youtube_video_info(self):
        video = get_youtube_video_info(
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        )

        self.assertEqual(video["video_id"], "dQw4w9WgXcQ")
        self.assertTrue(video["title"])
        self.assertTrue(video["thumbnail"])
        self.assertIsNotNone(video["duration"])


if __name__ == "__main__":
    unittest.main()