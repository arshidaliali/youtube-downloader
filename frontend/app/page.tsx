import Downloader from "./components/downloader/downloader";
import Footer from "./components/footer";
import NavbarClient from "./components/NavbarClient";
import StructuredData from "./components/structured-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <NavbarClient />

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
            <span className="text-red-600">YouTube Shorts</span>
            <br className="hidden sm:block" />{" "}
            without the hassle
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Paste a YouTube Shorts link, choose your preferred quality, and download
            your shorts directly to your device.
          </p>

          {/* Interactive Downloader */}
          <Downloader />

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

      {/* Features */}
      <section
        id="features"
        className="border-y border-slate-200 bg-slate-50 px-6 py-24"
      >
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
              Everything you need to download supported YouTube Shorts
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
                Paste a YouTube Shorts URL, analyze the video, select your preferred
                quality, and download.
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
                Select from the video formats and quality options available for
                the YouTube Shorts you provide.
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
                Once processing is complete, the video file is sent directly
                to your browser for download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20">
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

              <h3 className="mt-5 text-lg font-bold">Paste your URL</h3>

              <p className="mt-2 leading-7 text-slate-600">
                Copy a YouTube Shorts URL and paste it into the downloader.
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
                We analyze the video and show the available formats and
                qualities.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-600">
                03
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Download your video Shorts
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Select your preferred format and start the download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20">
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
                Yes, VideoDown is completely free with no registration or
                hidden subscriptions required.
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
                You can select from all available formats and quality options
                provided by the source video.
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
                No installations or extensions are necessary. Everything works
                right inside your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <StructuredData />
    </main>
  );
}