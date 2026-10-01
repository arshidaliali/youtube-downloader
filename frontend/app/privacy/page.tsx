
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - YouTube Video Downloader",
  description:
    "Privacy Policy for youtubevideodownload.app explaining how we handle information and protect your privacy.",
};

export default function PrivacyPolicyPage() {
  const currentDate = "October 1, 2026";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
          >
            <span aria-hidden="true">←</span>
            Back to Home
          </Link>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-600">
              Legal
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Privacy Policy
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Last updated: {currentDate}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
            <div className="max-w-3xl space-y-10 text-[15px] leading-7 text-slate-600">

              {/* Introduction */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  1. Introduction
                </h2>

                <p>
                  Welcome to{" "}
                  <strong className="font-semibold text-slate-900">
                    youtubevideodownload.app
                  </strong>{" "}
                  (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We
                  respect your privacy and are committed to protecting your
                  information while you use our website and services.
                </p>

                <p className="mt-4">
                  This Privacy Policy explains what information may be
                  collected when you use our service, how that information may
                  be used, and the measures we take to protect your privacy.
                </p>
              </section>

              {/* Information We Do Not Collect */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  2. Information We Do Not Collect
                </h2>

                <p className="mb-5">
                  Our downloader is designed to be simple and does not require
                  users to create an account.
                </p>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex gap-3">
                      <span className="mt-1 text-green-600">✓</span>
                      <span>
                        <strong className="text-slate-900">
                          No account required:
                        </strong>{" "}
                        You do not need to register or create an account to use
                        the downloader.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span className="mt-1 text-green-600">✓</span>
                      <span>
                        <strong className="text-slate-900">
                          No personal profile:
                        </strong>{" "}
                        We do not require information such as your name, phone
                        number, or email address to use the basic downloading
                        service.
                      </span>
                    </li>

                    <li className="flex gap-3">
                      <span className="mt-1 text-green-600">✓</span>
                      <span>
                        <strong className="text-slate-900">
                          No permanent download history:
                        </strong>{" "}
                        We do not intend to maintain a permanent history of the
                        videos you download through the service.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Automatically Collected Information */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  3. Information Automatically Collected
                </h2>

                <p>
                  Like most websites, our servers and infrastructure may
                  automatically process certain technical information when you
                  visit or use the service. This may include:
                </p>

                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system and device information</li>
                  <li>Referring page or website</li>
                  <li>Pages or features accessed</li>
                  <li>Date and time of requests</li>
                </ul>

                <p className="mt-4">
                  This information may be used for security, troubleshooting,
                  service reliability, performance monitoring, and improving
                  the website.
                </p>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  4. Cookies and Tracking Technologies
                </h2>

                <p>
                  We may use cookies or similar technologies that are necessary
                  for website functionality, security, analytics, or other
                  legitimate website operations.
                </p>

                <p className="mt-4">
                  If third-party analytics or advertising services are used,
                  those providers may use cookies or similar technologies in
                  accordance with their own privacy policies.
                </p>

                <p className="mt-4">
                  You can manage or disable cookies through your browser
                  settings. Disabling certain cookies may affect some website
                  functionality.
                </p>
              </section>

              {/* Third Party Services */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  5. Third-Party Services and Links
                </h2>

                <p>
                  Our website may use or link to third-party services,
                  websites, analytics providers, advertising networks, or
                  other external resources.
                </p>

                <p className="mt-4">
                  Third-party services operate under their own terms and
                  privacy policies. We are not responsible for the privacy
                  practices of external websites or services that we do not
                  control.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  6. Children&apos;s Privacy
                </h2>

                <p>
                  Our service is not directed toward children under the age of
                  13, and we do not knowingly collect personal information from
                  children under 13.
                </p>

                <p className="mt-4">
                  If you believe that a child has provided personal information
                  through our service, please contact us so that we can review
                  the situation and take appropriate action.
                </p>
              </section>

              {/* Security */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  7. Data Security
                </h2>

                <p>
                  We take reasonable technical and organizational measures to
                  protect information processed through our service. However,
                  no internet transmission or electronic storage system can be
                  guaranteed to be completely secure.
                </p>
              </section>

              {/* Policy Changes */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  8. Changes to This Privacy Policy
                </h2>

                <p>
                  We may update this Privacy Policy from time to time. When
                  changes are made, we will update the &quot;Last updated&quot;
                  date displayed at the top of this page.
                </p>

                <p className="mt-4">
                  We encourage you to review this page periodically to remain
                  informed about how we handle information.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  9. Contact Us
                </h2>

                <p>
                  If you have questions, concerns, or requests regarding this
                  Privacy Policy or our privacy practices, please contact us
                  through our{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-red-600 underline decoration-red-200 underline-offset-4 transition-colors hover:text-red-700"
                  >
                    Contact page
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 sm:px-10 lg:px-14">
            <p className="text-center text-xs leading-5 text-slate-500">
              This Privacy Policy was last updated on {currentDate}.
            </p>
          </div>
        </article>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
          >
            ← Return to YouTube Video Downloader
          </Link>
        </div>
      </div>
    </main>
  );
}