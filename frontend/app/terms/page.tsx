
import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions - YouTube Video Downloader",
  description:
    "Terms and Conditions governing the use of youtubevideodownload.app and its video downloading services.",
};

export default function TermsPage() {
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
              Terms and Conditions
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
                  (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
                </p>

                <p className="mt-4">
                  These Terms and Conditions govern your access to and use of
                  our website and YouTube video downloading services. By
                  accessing or using the website, you agree to comply with
                  these Terms and Conditions.
                </p>

                <p className="mt-4">
                  If you do not agree with these terms, please do not use the
                  service.
                </p>
              </section>

              {/* Description of Service */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  2. Description of the Service
                </h2>

                <p>
                  youtubevideodownload.app provides a web-based tool that
                  allows users to process publicly accessible video URLs and,
                  where technically available, download content in supported
                  formats and qualities.
                </p>

                <p className="mt-4">
                  The availability of particular videos, formats, resolutions,
                  or download options may depend on the source platform,
                  technical limitations, and other factors outside our
                  control.
                </p>
              </section>

              {/* Acceptable Use */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  3. Acceptable Use
                </h2>

                <p>
                  You agree to use our service only for lawful purposes and in
                  accordance with these Terms.
                </p>

                <p className="mt-4">You must not use the service to:</p>

                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>
                    Violate applicable local, national, or international laws
                    or regulations.
                  </li>
                  <li>
                    Infringe copyright, trademark, privacy, publicity, or other
                    rights belonging to another person or organization.
                  </li>
                  <li>
                    Download or distribute content when you do not have the
                    necessary rights or permission to do so.
                  </li>
                  <li>
                    Attempt to interfere with, disrupt, overload, or damage the
                    website or its underlying infrastructure.
                  </li>
                  <li>
                    Use automated methods to abuse, scrape, or excessively
                    consume our service.
                  </li>
                  <li>
                    Attempt to bypass security measures or gain unauthorized
                    access to our systems.
                  </li>
                </ul>
              </section>

              {/* Copyright */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  4. Copyright and User Responsibility
                </h2>

                <p>
                  Users are solely responsible for ensuring that their use of
                  downloaded content complies with applicable laws and the
                  terms, policies, and rights associated with the original
                  content and source platform.
                </p>

                <p className="mt-4">
                  The availability of a download through our service does not
                  mean that the content is free from copyright restrictions or
                  that you have permission to reproduce, modify, publish,
                  distribute, or otherwise use it.
                </p>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                  <p className="font-medium">
                    You are responsible for having the necessary rights or
                    permissions before downloading or using copyrighted
                    material.
                  </p>
                </div>
              </section>

              {/* Third Party Platform */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  5. Third-Party Platforms and Content
                </h2>

                <p>
                  Our service may process URLs that point to third-party
                  platforms, including YouTube. We do not own or control the
                  content hosted on those platforms.
                </p>

                <p className="mt-4">
                  We are not responsible for the availability, accuracy,
                  legality, copyright status, or continued accessibility of
                  third-party content.
                </p>

                <p className="mt-4">
                  Your use of third-party platforms and their content may also
                  be subject to their respective terms, policies, and
                  restrictions.
                </p>
              </section>

              {/* Availability */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  6. Service Availability
                </h2>

                <p>
                  We aim to keep the service available and functioning
                  reliably, but we do not guarantee that the website or any
                  particular feature will always be available, uninterrupted,
                  secure, or error-free.
                </p>

                <p className="mt-4">
                  The service may occasionally be unavailable because of
                  maintenance, technical problems, infrastructure failures,
                  network issues, third-party changes, or other circumstances.
                </p>
              </section>

              {/* Download Results */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  7. Download Results and Limitations
                </h2>

                <p>
                  Download availability, processing time, file size, video
                  quality, supported formats, and other technical
                  characteristics may vary.
                </p>

                <p className="mt-4">
                  We do not guarantee that every submitted URL will result in a
                  successful download or that a particular resolution or format
                  will always be available.
                </p>

                <p className="mt-4">
                  Users are responsible for ensuring that downloaded files are
                  appropriate for their intended use and compatible with their
                  devices or software.
                </p>
              </section>

              {/* Disclaimer */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  8. Disclaimer
                </h2>

                <p>
                  The website and its services are provided on an
                  &quot;as available&quot; basis. To the extent permitted by
                  applicable law, we make no warranties regarding the
                  availability, reliability, accuracy, suitability, or
                  uninterrupted operation of the service.
                </p>

                <p className="mt-4">
                  We do not guarantee that the service will meet every user's
                  requirements or that errors or interruptions will always be
                  corrected.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  9. Limitation of Liability
                </h2>

                <p>
                  To the maximum extent permitted by applicable law,
                  youtubevideodownload.app and its operators shall not be
                  responsible for losses, damages, or claims arising from or
                  related to your use of the website or downloaded content.
                </p>

                <p className="mt-4">
                  This includes, where legally permitted, indirect,
                  incidental, consequential, or other losses resulting from
                  service interruptions, unavailable downloads, third-party
                  content, or the use or misuse of downloaded files.
                </p>
              </section>

              {/* Suspension */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  10. Suspension or Termination
                </h2>

                <p>
                  We reserve the right to restrict, suspend, or terminate
                  access to the service when we reasonably believe that a user
                  has violated these Terms, abused the service, attempted to
                  compromise its security, or used it for unlawful purposes.
                </p>
              </section>

              {/* Changes */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  11. Changes to These Terms
                </h2>

                <p>
                  We may modify these Terms and Conditions from time to time.
                  Updated terms will be published on this page, and the
                  &quot;Last updated&quot; date will be changed accordingly.
                </p>

                <p className="mt-4">
                  Your continued use of the website after changes are
                  published constitutes your acceptance of the updated terms,
                  to the extent permitted by applicable law.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  12. Governing Law
                </h2>

                <p>
                  These Terms and Conditions shall be interpreted and applied
                  in accordance with applicable laws. Any disputes relating to
                  the service shall be handled by the courts or authorities
                  having appropriate jurisdiction, subject to applicable law.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
                  13. Contact Us
                </h2>

                <p>
                  If you have questions about these Terms and Conditions,
                  please contact us through our{" "}
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
              These Terms and Conditions were last updated on {currentDate}.
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
