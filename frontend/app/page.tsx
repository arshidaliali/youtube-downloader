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
  progress: number;
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
  onProgress: (progress: number) => void,
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

    onProgress(data.progress);

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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [browserDownloadProgress, setBrowserDownloadProgress] = useState(0);
  const [downloadStage, setDownloadStage] = useState<
  "server" | "browser"
>("server");
  const [error, setError] = useState("");
  
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
    setDownloadProgress(0);
    setBrowserDownloadProgress(0);
    setDownloadStage("server");
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

      const job = await waitForDownload(
  data.job_id,
  (progress) => setDownloadProgress(progress),
);
      

      if (job.status !== "COMPLETED") {
        throw new Error("The download did not complete.");
      }
      setDownloadStage("browser");
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

      const reader = fileResponse.body?.getReader();

if (!reader) {
  throw new Error("Unable to read the downloaded file.");
}

const chunks: BlobPart[] = [];
let receivedBytes = 0;

const contentLength = fileResponse.headers.get("Content-Length");
const totalBytes = contentLength ? Number(contentLength) : null;

while (true) {
  const { done, value } = await reader.read();

  if (done) {
    break;
  }

  if (value) {
    chunks.push(value);
    receivedBytes += value.length;

    if (totalBytes) {
      const progress = Math.round(
        (receivedBytes / totalBytes) * 100,
      );
      
      setBrowserDownloadProgress(progress);
      console.log(
  "BROWSER DOWNLOAD PROGRESS:",
  progress,
  "%",
);
    }
  }
}

const blob = new Blob(chunks, {
  type: contentType,
});

const objectUrl = URL.createObjectURL(blob);

const contentDisposition =
  fileResponse.headers.get("Content-Disposition");

let filename = `${videoInfo.title || "youtube-video"}.mp4`;

if (contentDisposition) {
  const filenameMatch = contentDisposition.match(
    /filename="([^"]+)"/i,
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
      <header className="fixed inset-x-0 top-4 z-50 mx-auto max-w-6xl px-4">
  <div className="flex h-16 items-center justify-between rounded-2xl border border-white/20 bg-white/80 px-5 backdrop-blur-md shadow-lg shadow-slate-900/5">
    {/* Logo */}
    <a href="/" className="flex items-center gap-2.5" aria-label="VideoDown home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-xs text-white shadow-sm">
        ▶
      </span>
      <span className="text-lg font-extrabold tracking-tight text-slate-900">
        Video<span className="text-red-600">Down</span>
      </span>
    </a>

    {/* Center Navigation Links (Desktop) */}
    <nav className="hidden md:flex items-center gap-8">
      <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600">
        How it works
      </a>
      <a href="#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600">
        Features
      </a>
      <a href="#faq" className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600">
        FAQ
      </a>

    </nav>

    {/* Action Area */}
    <div className="flex items-center">
      <a
        href="#downloader"
        className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-red-500/25 hover:shadow-md"
      >
        Get Started
      </a>
    </div>
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

          {/* Downloader Wrapper with Scroll Target Offset */}
          <div className="relative mt-10">
            {/* Invisible anchor target positioned 28 padding units above the input box */}
            <div id="downloader" className="absolute -top-28 left-0 h-0 w-0 pointer-events-none" />

            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
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
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.687 1.687m-5.742 1.49a4.5 4.5 0 0 0 6.365 6.364l3.182-3.182a4.5 4.5 0 0 0 0-6.364l-.318-.318a4.5 4.5 0 0 0-6.364 0l-.318.318m-2.546 2.546a4.5 4.5 0 0 0-1.687-1.687m5.742-1.49a4.5 4.5 0 0 0-6.365-6.364L3.642 4.87a4.5 4.5 0 0 0 0 6.364l.318.318a4.5 4.5 0 0 0 6.364 0l-.318-.318"
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
            <div className="overflow-hidden rounded-3xl border border-slate-200/85 bg-white shadow-2xl shadow-slate-200/40 transition-all duration-300">
              {/* Video information header */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col items-center text-center">
                  {/* Thumbnail */}
                  {videoInfo.thumbnail ? (
                    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md">
                      <img
                        src={videoInfo.thumbnail}
                        alt={videoInfo.title || "YouTube video"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                      {/* Duration */}
                      <div className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
                        {formatDuration(videoInfo.duration)}
                      </div>

                      {/* Play indicator */}
                      <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xs text-red-600 shadow-xl transition-transform duration-300 group-hover:scale-110">
                        ▶
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100 text-sm font-medium text-slate-400">
                      No thumbnail available
                    </div>
                  )}

                  {/* Video details */}
                  <div className="mt-6 w-full min-w-0">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                      Ready for download
                    </div>

                    <h2 className="text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl line-clamp-2">
                      {videoInfo.title || "YouTube video"}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700">
                        <span className="text-red-500 font-bold">▶</span>
                        YouTube
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700">
                        <span>◷</span>
                        {formatDuration(videoInfo.duration)}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700">
                        <span>MP4</span>
                      </span>

                      {isDownloaded && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
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
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5 sm:p-6 backdrop-blur-sm">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Select video format & quality
                      </h3>
                      <p className="text-xs text-slate-500">
                        Choose your preferred resolution and file format.
                      </p>
                    </div>

                    {/* Format selector */}
                    <div className="mt-4">
                      <label
                        htmlFor="video-format"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
                      >
                        Available Options
                      </label>

                      <div className="relative">
                        <select
                          id="video-format"
                          value={selectedFormat}
                          onChange={(event) =>
                            setSelectedFormat(event.target.value)
                          }
                          disabled={isDownloading}
                          className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-12 text-sm font-semibold text-slate-900 shadow-sm outline-none transition-all hover:border-slate-400 focus:border-red-600 focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
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

                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
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
                      <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {getFormatLabel(selectedFormatData)}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
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

                          <div className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {formatFileSize(
                              selectedFormatData.filesize ||
                                selectedFormatData.filesize_approx,
                            )}
                          </div>
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
                      className="mt-5 flex h-14 w-full items-center justify-center rounded-xl bg-red-600 px-6 font-bold text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDownloading ? (
  <div className="flex w-full flex-col gap-2">
    {downloadStage === "browser" && (
  <div className="text-sm font-semibold text-emerald-200">
    ✓ Server download complete
  </div>
)}
    <div className="flex items-center justify-between text-sm">
      <span>
  {downloadStage === "server"
    ? "Downloading from YouTube..."
    : "Downloading to your device..."}
</span>
      <span>
  {downloadStage === "server"
    ? `${downloadProgress}%`
    : `${browserDownloadProgress}%`}
</span>
    </div>

    <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
      <div
        className="h-full rounded-full bg-white transition-all duration-300"
        style={{
  width: `${
    downloadStage === "server"
      ? downloadProgress
      : browserDownloadProgress
  }%`,
}}
      />
    </div>
  </div>
) : (
  "Download Now"
)}
                    </button>
                  </div>
                )}

                {/* Download completed */}
                {isDownloaded && !isDownloading && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 shadow-sm">
                        ✓
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-emerald-950">
                          Download complete!
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-emerald-800">
                          Your video file has been successfully prepared and downloaded to your device.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-emerald-200/60 pt-4 text-center sm:text-left">
                      <button
                        type="button"
                        onClick={handleChooseAnotherVideo}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-900 transition-colors hover:text-emerald-950"
                      >
                        ← Choose another video
                      </button>
                    </div>
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

      <section
  id="faq"
  className="px-6 py-20"
>
  <div className="mx-auto max-w-5xl">
    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-red-600">
        FAQ
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        Frequently Asked Questions
      </h2>
    </div>

    <div className="mt-12 grid gap-8 md:grid-cols-3">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-600">
          01
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900">
          Is VideoDown free to use?
        </h3>

        <p className="mt-2 leading-7 text-slate-600">
          Yes, VideoDown is completely free with no registration or hidden subscriptions required.
        </p>
      </div>

      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-600">
          02
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900">
          What video qualities are supported?
        </h3>

        <p className="mt-2 leading-7 text-slate-600">
          You can select from all available formats and quality options provided by the source video.
        </p>
      </div>

      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-600">
          03
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900">
          Do I need to install any software?
        </h3>

        <p className="mt-2 leading-7 text-slate-600">
          No installations or extensions are necessary. Everything works right inside your browser.
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