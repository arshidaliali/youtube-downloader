
import Link from "next/link";

export const metadata = {
  title: "Contact Us | YouTube Video Download",
  description:
    "Contact YouTube Video Download for questions, feedback, technical issues, or suggestions about our YouTube video downloader.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Video<span className="text-red-600">Down</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
          >
            Back to Downloader
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pb-12 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-600">
            Contact Us
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            How can we help?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
            Have a question about YouTube Video Download, found a technical
            issue, or want to share feedback? We&apos;re happy to hear from
            you.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              ✉
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
              Get in touch
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              For questions, feedback, technical issues, download problems,
              suggestions, or other inquiries related to our website, please
              contact us by email.
            </p>

            <a
              href="mailto:admin@youtubevideodownload.app"
              className="mt-7 inline-flex rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
            >
              admin@youtubevideodownload.app
            </a>

            <div className="mx-auto mt-8 max-w-xl border-t border-slate-200 pt-7">
              <h3 className="text-sm font-semibold text-slate-800">
                You can contact us about
              </h3>

              <ul className="mt-4 grid gap-3 text-left text-sm leading-6 text-slate-500 sm:grid-cols-2">
                <li className="rounded-xl bg-white p-3">
                  • Problems using the downloader
                </li>
                <li className="rounded-xl bg-white p-3">
                  • Download or format issues
                </li>
                <li className="rounded-xl bg-white p-3">
                  • Website feedback and suggestions
                </li>
                <li className="rounded-xl bg-white p-3">
                  • Technical questions
                </li>
                <li className="rounded-xl bg-white p-3">
                  • General inquiries
                </li>
                <li className="rounded-xl bg-white p-3">
                  • Other website-related concerns
                </li>
              </ul>
            </div>

            <p className="mx-auto mt-7 max-w-xl text-xs leading-5 text-slate-400">
              Please do not include sensitive personal, financial, or
              confidential information in your email.
            </p>
          </div>
        </div>
      </section>

      {/* Helpful Links */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Looking for more information?
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            You may also find useful information in our Privacy Policy and
            Terms & Conditions.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/privacy"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Go to Downloader
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

