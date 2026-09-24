"use client";

import { FormEvent, useEffect, useState } from "react";


type VideoFormat = {
  format_id: string;
  ext: string;
  height?: number | null;
  width?: number | null;
  fps?: number | null;
  filesize?: number | null;
  filesize_approx?: number | null;
  has_video: boolean;
  has_audio: boolean;
  quality_label?: string | null;
};

type VideoInfo = {
  video_id?: string;
  title?: string;
  thumbnail?: string;
  duration?: number | null;
  formats: VideoFormat[];
};

type DownloadJobResponse = {
  job_id: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  task_id?: string | null;
  file_path?: string | null;
  error?: string | null;
};

function formatDuration(seconds?: number | null) {
  if (!seconds) {
    return "Unknown duration";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatFileSize(bytes?: number | null) {
  if (!bytes) {
    return "Size unavailable";
  }

  const mb = bytes / (1024 * 1024);

  if (mb < 1) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${mb.toFixed(1)} MB`;
}

function getFormatLabel(format: VideoFormat) {
  if (format.quality_label) {
    return format.quality_label;
  }

  if (format.height) {
    return `${format.height}p`;
  }

  return "Available format";
}

async function waitForDownload(
  jobId: number,
): Promise<DownloadJobResponse> {
  const maxAttempts = 300;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(`/api/download/${jobId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      let message = "Unable to check the download status.";

      try {
        const data = await response.json();

        if (typeof data.detail === "string") {
          message = data.detail;
        }
      } catch {
        // Keep the friendly fallback.
      }

      throw new Error(message);
    }

    const data: DownloadJobResponse = await response.json();

    if (data.status === "COMPLETED") {
      return data;
    }

    if (data.status === "FAILED") {
      throw new Error(
        data.error || "The download failed. Please try again.",
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    "The download is taking too long. Please try again later.",
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [error, setError] = useState("");
  const [downloadDots, setDownloadDots] = useState("");
  useEffect(() => {
    if (!isDownloading) {
      setDownloadDots("");
      return;
    }

    let count = 0;

    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setDownloadDots(".".repeat(count));
    }, 500);

    return () => clearInterval(interval);
  }, [isDownloading]);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!url.trim()) {
      setError("Please enter a YouTube video URL.");
      return;
    }

    setError("");
    setVideoInfo(null);
    setSelectedFormat("");
    setIsDownloaded(false);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/video/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to analyze this video.",
        );
      }

      setVideoInfo(data);

      if (data.formats?.length > 0) {
        setSelectedFormat(data.formats[0].format_id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze this video.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleDownload() {
    if (!videoInfo || !selectedFormat) {
      setError("Please select a video format first.");
      return;
    }

    setError("");
    setIsDownloading(true);
    setIsDownloaded(false);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          format_id: selectedFormat,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to start the download.",
        );
      }

      const job = await waitForDownload(data.job_id);

      if (job.status !== "COMPLETED") {
        throw new Error("The download did not complete.");
      }

      const fileResponse = await fetch(
        `/api/download/${job.job_id}/file`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!fileResponse.ok) {
        let message = "Unable to retrieve the downloaded file.";

        try {
          const fileError = await fileResponse.json();

          if (typeof fileError.detail === "string") {
            message = fileError.detail;
          }
        } catch {
          // Keep fallback message.
        }

        throw new Error(message);
      }

      const contentType =
        fileResponse.headers.get("Content-Type") || "";

      if (!contentType.includes("video/")) {
        throw new Error(
          "The downloaded file is not a valid video.",
        );
      }

      const blob = await fileResponse.blob();
      const objectUrl = URL.createObjectURL(blob);

      const contentDisposition =
        fileResponse.headers.get("Content-Disposition");

      let filename = `youtube-video-${job.job_id}.mp4`;

      if (contentDisposition) {
        const filenameMatch =
          contentDisposition.match(
            /filename="?([^"]+)"?/i,
          );

        if (filenameMatch?.[1]) {
          filename = filenameMatch[1];
        }
      }

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);

      /*
       * Important:
       * Once the browser download has started successfully,
       * move the UI into the completed state.
       *
       * The format selector and download button will disappear
       * because they are rendered only when isDownloaded === false.
       */
      setIsDownloaded(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The download failed. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  function handleChooseAnotherVideo() {
    setUrl("");
    setVideoInfo(null);
    setSelectedFormat("");
    setIsDownloaded(false);
    setError("");
  }

  const selectedFormatData = videoInfo?.formats.find(
    (format) => format.format_id === selectedFormat,
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5"
            aria-label="VideoDown home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-sm text-white shadow-sm">
              ▶
            </span>

            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Video<span className="text-red-600">Down</span>
            </span>
          </a>

          {/* Animated tagline */}
          <div className="hidden items-center text-sm font-medium text-slate-500 md:flex">
            <span className="mr-2 text-red-500">✦</span>

            <div className="relative h-5 w-56 overflow-hidden">
              <div className="animate-[tagline_12s_ease-in-out_infinite]">
                <div>Fast. Simple. Effortless.</div>
                <div>No registration required.</div>
                <div>Choose your video quality.</div>
                <div>Download with ease.</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="hidden text-sm font-semibold text-slate-600 transition-colors hover:text-red-600 sm:block"
            >
              How it works
            </a>

            <a
              href="#features"
              className="hidden text-sm font-semibold text-slate-600 transition-colors hover:text-red-600 sm:block"
            >
              Features
            </a>

            <a
              href="#downloader"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
                />
              </svg>

              Download
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50 via-white to-white">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-red-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-red-50 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 text-center sm:pb-24 sm:pt-24">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm">
            <span className="text-red-500">✦</span>
            Simple • Fast • Free
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Download{" "}
            <span className="text-red-600">YouTube videos</span>
            <br className="hidden sm:block" />{" "}
            without the hassle
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Paste a YouTube link, choose your preferred quality, and download
            your video directly to your device.
          </p>

          {/* Downloader */}
          <div
            id="downloader"
            className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60"
          >
            <form
              onSubmit={handleAnalyze}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="flex flex-1 items-center rounded-xl bg-slate-50 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-3 h-5 w-5 shrink-0 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.687 1.687m-5.742 1.49a4.5 4.5 0 0 0 6.365 6.364l3.182-3.182a4.5 4.5 0 0 0 0-6.364l-.318-.318a4.5 4.5 0 0 0-6.364 0l-.318.318m-2.546 2.546a4.5 4.5 0 0 0-1.687-1.687m5.742-1.49a4.5 4.5 0 0 0-6.365-6.364L3.642 4.87a4.5 4.5 0 0 0 0 6.364l.318.318a4.5 4.5 0 0 0 6.364 0l.318-.318"
                  />
                </svg>

                <input
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="Paste your YouTube video URL..."
                  className="h-14 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
                  disabled={isAnalyzing || isDownloading}
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || isDownloading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-40"
              >
                {isAnalyzing ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Video
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Benefits */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-xs text-green-600">
                ✓
              </span>
              No registration
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-xs text-green-600">
                ✓
              </span>
              Multiple qualities
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-xs text-green-600">
                ✓
              </span>
              MP4 downloads
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {videoInfo && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
              {/* Video information */}
              <div className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-[280px_1fr] sm:items-center">
                  {/* Thumbnail */}
                  {videoInfo.thumbnail ? (
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                      <img
                        src={videoInfo.thumbnail}
                        alt={videoInfo.title || "YouTube video"}
                        className="h-full w-full object-cover"
                      />

                      {/* Duration */}
                      <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                        {formatDuration(videoInfo.duration)}
                      </div>

                      {/* Play indicator */}
                      <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-sm text-red-600 shadow-lg">
                        ▶
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
                      No thumbnail available
                    </div>
                  )}

                  {/* Video details */}
                  <div className="min-w-0">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      Video information
                    </div>

                    <h2 className="text-xl font-extrabold leading-8 tracking-tight text-slate-900 sm:text-2xl">
                      {videoInfo.title || "YouTube video"}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                        <span className="text-red-500">▶</span>
                        YouTube
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                        <span>◷</span>
                        {formatDuration(videoInfo.duration)}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                        <span>MP4</span>
                      </span>

                      {isDownloaded && (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-600">
                          ✓ Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="my-8 border-t border-slate-100" />

                {/*
                 * IMPORTANT UI STATE:
                 *
                 * Before download:
                 *   Show format selector + download button.
                 *
                 * After successful download:
                 *   Hide the entire section.
                 */}
                {!isDownloaded && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Select video format and quality
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Choose one of the available formats for
                        this video.
                      </p>
                    </div>

                    {/* Format selector */}
                    <div className="mt-5">
                      <label
                        htmlFor="video-format"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Video quality
                      </label>

                      <div className="relative">
                        <select
                          id="video-format"
                          value={selectedFormat}
                          onChange={(event) =>
                            setSelectedFormat(event.target.value)
                          }
                          disabled={isDownloading}
                          className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-12 text-sm font-medium text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                          {videoInfo.formats.map((format) => (
                            <option
                              key={format.format_id}
                              value={format.format_id}
                            >
                              {getFormatLabel(format)}
                              {" • "}
                              {format.ext.toUpperCase()}
                              {format.width && format.height
                                ? ` • ${format.width}×${format.height}`
                                : ""}
                              {format.fps
                                ? ` • ${format.fps} FPS`
                                : ""}
                              {" • "}
                              {formatFileSize(
                                format.filesize ||
                                format.filesize_approx,
                              )}
                            </option>
                          ))}
                        </select>

                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Selected format details */}
                    {selectedFormatData && (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-slate-900">
                              {getFormatLabel(selectedFormatData)}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {selectedFormatData.ext.toUpperCase()}
                              {selectedFormatData.width &&
                                selectedFormatData.height
                                ? ` • ${selectedFormatData.width} × ${selectedFormatData.height}`
                                : ""}
                              {selectedFormatData.fps
                                ? ` • ${selectedFormatData.fps} FPS`
                                : ""}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-slate-600">
                            {formatFileSize(
                              selectedFormatData.filesize ||
                              selectedFormatData.filesize_approx,
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Download button */}
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={
                        isDownloading || !selectedFormat
                      }
                      className="mt-5 flex h-14 w-full items-center justify-center rounded-xl bg-red-600 px-6 font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDownloading
                        ? `Processing download${downloadDots}`
                        : "Download Selected Format"}
                    </button>
                  </div>
                )}



                {/* Download completed */}
                {isDownloaded && !isDownloading && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-600">
                        ✓
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-emerald-900">
                          Download complete!
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-emerald-700">
                          Your video has been downloaded
                          successfully.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleChooseAnotherVideo}
                      className="mt-5 inline-flex items-center font-semibold text-emerald-800 transition hover:text-emerald-950"
                    >
                      ← Choose another video
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-slate-200 bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">
              Why VideoDown
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Simple tools. No unnecessary steps.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Everything you need to download supported YouTube videos
              quickly and easily.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Easy to use
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Paste a YouTube URL, analyze the video, select your
                preferred quality, and download.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Choose your quality
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Select from the video formats and quality options
                available for the YouTube video you provide.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
                  />
                </svg>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                Direct download
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Once processing is complete, the video file is sent
                directly to your browser for download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="px-6 py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Download in three simple steps
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-600">
                01
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Paste your URL
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Copy a YouTube video URL and paste it into the
                downloader.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-600">
                02
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Analyze and select
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                We analyze the video and show the available
                formats and qualities.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-600">
                03
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Download your video
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Select your preferred format and start the
                download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>
            <span className="font-bold text-slate-800">
              Video<span className="text-red-600">Down</span>
            </span>
          </p>

          <p>Simple YouTube video downloading.</p>
        </div>
      </footer>
    </main>
  );
}