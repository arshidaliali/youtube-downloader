
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 text-sm text-slate-500 md:grid-cols-3">

        {/* Column 1: Brand */}
        <div className="space-y-2">
          <p>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              Video<span className="text-red-600">Down</span>
            </span>
          </p>

          <p className="max-w-xs text-xs leading-relaxed text-slate-400">
            Fast, simple, and reliable tools for downloading YouTube videos
            with ease.
          </p>

          <p className="pt-2 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} youtubevideodownload.app. All
            rights reserved.
          </p>
        </div>

        {/* Column 2: About / Support */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
            Support
          </h3>

          <ul className="space-y-2">
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-slate-800"
              >
                Contact Us
              </Link>
            </li>

            <li>
              <Link
                href="/terms"
                className="transition-colors hover:text-slate-800"
              >
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link
                href="/privacy"
                className="transition-colors hover:text-slate-800"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Service Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
            YouTube Downloader
          </h3>

          <p className="max-w-xs text-xs leading-relaxed text-slate-400">
            Download available YouTube videos in supported formats and
            qualities directly to your device.
          </p>

          <Link
            href="/"
            className="inline-block pt-1 text-xs font-medium text-red-600 transition-colors hover:text-red-700"
          >
            Back to Downloader →
          </Link>
        </div>

      </div>
    </footer>
  );
}
