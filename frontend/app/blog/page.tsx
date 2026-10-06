import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { articles, getArticleReadingTime } from "./articles";

export const metadata: Metadata = {
  title: "The VideoDown Journal | Video Technology, Made Clear",
  description:
    "Clear, practical guides to video formats, codecs, media tools, and the technology behind online video.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "The VideoDown Journal",
    description:
      "Clear, practical guides to video formats, codecs, media tools, and the technology behind online video.",
    url: "/blog",
    type: "website",
  },
};

function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function BlogPage() {
  const [featuredArticle, ...moreArticles] = articles;

  return (
    <div className="flex-1 bg-[#faf9f6] text-[#17211d]">
      <header className="border-b border-[#e8e7e0]">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8"
        >
          <Link href="/" className="text-lg font-bold tracking-tight">
            Video<span className="text-red-600">Down</span>
            <span className="ml-2 hidden font-normal text-[#89918c] sm:inline">
              Journal
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#dedfd8] px-4 py-2 text-sm font-medium text-[#46514b] transition hover:border-red-200 hover:text-red-700"
          >
            Back to downloader
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-14 sm:px-8 sm:pt-20">
        <section aria-labelledby="blog-title" className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
              The VideoDown Journal
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#17211d] sm:text-4xl font-sans">
              Video,{" "}
              <span className="font-serif italic font-normal text-red-700">without the jargon.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#66716a] sm:text-lg sm:leading-8">
              Straightforward guides to the formats, tools, and technology behind
              the videos you watch every day.
            </p>
          </div>

          {featuredArticle && (
            <div className="rounded-3xl border border-[#ded8cc] bg-[#faf9f6] p-6 shadow-xs sm:p-7">
              <div className="flex items-center justify-between gap-3 border-b border-[#e8e7e0] pb-4">
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                  Latest Article
                </span>
                <span className="text-xs font-semibold text-[#818b84]">
                  Last updated: {formatArticleDate(featuredArticle.updatedAt ?? featuredArticle.publishedAt)}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-tight text-[#17211d] transition hover:text-red-700">
                <Link href={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h3>

              <div className="mt-6 flex items-center gap-3.5 border-t border-[#e8e7e0] pt-4">
                <Image
                  src={featuredArticle.author.image}
                  alt={featuredArticle.author.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-[#e3e2db]"
                />
                <div>
                  <p className="text-sm font-bold text-[#17211d]">
                    {featuredArticle.author.name}
                  </p>
                  <p className="text-xs text-[#818b84]">
                    {featuredArticle.author.role} at <span className="font-semibold text-[#29352e]">{featuredArticle.author.company}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {featuredArticle && (
          <section aria-labelledby="featured-title" className="mt-12 sm:mt-16">
            <article className="relative isolate overflow-hidden rounded-[2rem] bg-[#172b24] text-white">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-28 -z-10 h-96 w-96 rounded-full border border-white/10 sm:right-8 sm:top-1/2 sm:-translate-y-1/2"
              >
                <div className="absolute inset-10 rounded-full border border-white/10" />
                <div className="absolute inset-20 rounded-full border border-white/10" />
              </div>

              <div className="grid gap-10 p-7 sm:p-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center lg:gap-16 lg:p-16">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                      Featured guide
                    </span>
                    <span className="text-sm text-[#bdc9c1]">
                      {featuredArticle.category}
                    </span>
                  </div>

                  <h2
                    id="featured-title"
                    className="mt-7 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
                  >
                    <Link
                      href={`/blog/${featuredArticle.slug}`}
                      className="rounded-sm outline-offset-4 transition hover:text-[#f6c5b9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    >
                      {featuredArticle.title}
                    </Link>
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-7 text-[#c4cec8]">
                    {featuredArticle.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#bdc9c1]">
                    <span>{formatArticleDate(featuredArticle.publishedAt)}</span>
                    <span aria-hidden="true" className="text-white/40">
                      ·
                    </span>
                    <span>{getArticleReadingTime(featuredArticle)} min read</span>
                  </div>

                  <Link
                    href={`/blog/${featuredArticle.slug}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#172b24] transition hover:bg-[#f6c5b9]"
                  >
                    Read the guide <span aria-hidden="true">→</span>
                  </Link>
                </div>

                <div
                  aria-hidden="true"
                  className="hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 lg:block"
                >
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9eafa4]">
                    Inside a media file
                  </p>
                  <div className="space-y-3">
                    {[
                      ["MP4", "Container", "bg-[#f0c5b7] text-[#41261d]"],
                      ["H.264", "Video codec", "bg-[#c7d8cc] text-[#1b362b]"],
                      ["AAC", "Audio codec", "bg-[#e6d8a9] text-[#443919]"],
                    ].map(([format, label, color]) => (
                      <div
                        key={format}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-[#20372e] px-4 py-3"
                      >
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-bold ${color}`}
                        >
                          {format}
                        </span>
                        <span className="text-xs text-[#c4cec8]">{label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-right font-mono text-[10px] text-[#83978b]">
                    VIDEO + AUDIO + METADATA
                  </p>
                </div>
              </div>
            </article>
          </section>
        )}

        {moreArticles.length > 0 && (
          <section aria-labelledby="latest-title" className="mt-16 sm:mt-20">
            <div className="flex items-end justify-between border-b border-[#e3e2db] pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#818b84]">
                  Keep exploring
                </p>
                <h2
                  id="latest-title"
                  className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  More from the journal
                </h2>
              </div>
              <span className="pb-1 text-sm text-[#818b84]">
                {moreArticles.length}{" "}
                {moreArticles.length === 1 ? "article" : "articles"}
              </span>
            </div>

            <div className="grid gap-4 pt-6 md:grid-cols-2">
              {moreArticles.map((article, index) => (
                <article
                  key={article.slug}
                  className="group flex min-h-64 flex-col rounded-2xl border border-[#e8e7e0] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#d6d5cc] hover:shadow-[0_12px_32px_-20px_rgba(23,33,29,0.35)] sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
                      {article.category}
                    </span>
                    <span className="font-mono text-xs text-[#a1a9a3]">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="rounded-sm outline-offset-4 transition group-hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#66716a]">
                    {article.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#eeede8] pt-4 text-sm text-[#7b857e]">
                    <time dateTime={article.publishedAt}>
                      {formatArticleDate(article.publishedAt)}
                    </time>
                    <span>{getArticleReadingTime(article)} min read</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#e8e7e0]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-sm text-[#7b857e] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Thoughtful guides for a more understandable video web.</span>
          <Link href="/" className="font-medium transition hover:text-red-700">
            Visit VideoDown <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
