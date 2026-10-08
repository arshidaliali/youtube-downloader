import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ArticleStructuredData from "@/app/components/article-structured-data";
import { articles, getArticleReadingTime } from "../articles";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function createHeadingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: "Article not found | The VideoDown Journal",
    };
  }

  return {
    title: `${article.title} | The VideoDown Journal`,
    description: article.description,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      ...(article.updatedAt && { modifiedTime: article.updatedAt }),
      authors: [article.author.name],
      section: article.category,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const headings = article.content.flatMap((section, index) =>
    section.type === "heading" ? [{ section, index }] : [],
  );

  return (
    <>
      <ArticleStructuredData article={article} />
      <div className="flex-1 bg-[#faf9f6] text-[#17211d] antialiased selection:bg-red-100 selection:text-red-900">
        <header className="border-b border-[#e8e7e0] bg-[#faf9f6]/85 backdrop-blur-md sticky top-0 z-30">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8"
          >
            <Link href="/" className="text-lg font-bold tracking-tight">
              Video<span className="text-red-600">Down</span>
              <span className="ml-2 hidden font-normal text-[#89918c] sm:inline">
                Journal
              </span>
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-[#dedfd8] bg-white/50 px-4 py-2 text-sm font-medium text-[#46514b] shadow-xs transition hover:border-red-200 hover:text-red-700 hover:bg-white"
            >
              ← All articles
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
          <header className="mx-auto max-w-4xl pb-12 pt-10 sm:pb-16 sm:pt-14">
            <nav aria-label="Breadcrumb" className="text-sm font-medium text-[#818b84]">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/blog" className="transition hover:text-red-700">
                    Journal
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[#b5bdbc]">/</li>
                <li className="truncate text-[#46514b]">{article.category}</li>
              </ol>
            </nav>

            <div className="mt-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                {article.category}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#17211d] sm:text-5xl lg:text-6xl font-sans">
                {article.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#546059] sm:text-xl sm:leading-9 font-normal">
                {article.description}
              </p>
            </div>

            <div className="mt-8 grid gap-6 rounded-2xl border border-[#e3e2db] bg-white p-5 shadow-xs sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="flex items-start gap-4">
                <Image
                  src={article.author.image}
                  alt={article.author.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#e3e2db]"
                />
                <div className="max-w-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#818b84]">
                    About the author
                  </p>
                  <p className="mt-1 text-base font-bold text-[#17211d]">
                    {article.author.name}
                  </p>
                  <p className="mt-0.5 text-sm text-[#66716a]">
                    {article.author.role} at{" "}
                    <span className="font-semibold text-[#29352e]">
                      {article.author.company}
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#66716a]">
                    {article.author.bio}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[#e3e2db] pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <div>
                  <p className="text-xs text-[#818b84]">
                    {article.updatedAt ? "Updated" : "Published"}
                  </p>
                  <time
                    dateTime={article.updatedAt ?? article.publishedAt}
                    className="mt-0.5 block text-sm font-semibold text-[#29352e]"
                  >
                    {formatArticleDate(article.updatedAt ?? article.publishedAt)}
                  </time>
                </div>
                <div>
                  <p className="text-xs text-[#818b84]">Reading time</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#29352e]">
                    {getArticleReadingTime(article)} min
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            {headings.length > 0 && (
              <aside className="self-start lg:sticky lg:top-24">
                <nav
                  aria-label="Table of contents"
                  className="rounded-2xl border border-[#e3e2db] bg-white/95 p-5 shadow-sm backdrop-blur-xs sm:p-6"
                >
                  <div className="flex items-center gap-2 border-b border-[#f0efe9] pb-3">
                    <span className="flex h-2 w-2 rounded-full bg-red-600"></span>
                    <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#46514b]">
                      In this guide
                    </h2>
                  </div>
                  <ol className="mt-4 space-y-3.5 border-l border-[#e3e2db] pl-4">
                    {headings.map(({ section, index }) => (
                      <li key={index}>
                        <a
                          href={`#${createHeadingId(section.text)}`}
                          className="group flex items-start text-sm font-medium leading-snug text-[#66716a] transition hover:text-red-700"
                        >
                          <span className="line-clamp-2 transition-colors group-hover:translate-x-0.5 duration-150">
                            {section.text}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>
            )}

            <article className="min-w-0">
              <div className="max-w-3xl">
                {article.content.map((section, index) => {
                  switch (section.type) {
                    case "heading":
                      return (
                        <h2
                          key={index}
                          id={createHeadingId(section.text)}
                          className="mb-5 mt-12 scroll-mt-28 text-2xl font-bold tracking-tight text-[#17211d] first:mt-0 sm:mt-16 sm:text-3xl font-sans"
                        >
                          {section.text}
                        </h2>
                      );

                    case "paragraph":
                      return (
                        <p
                          key={index}
                          className="mb-6 text-base font-normal leading-8 text-[#46514b] sm:text-[1.0625rem] sm:leading-8"
                        >
                          {section.text}
                        </p>
                      );

                    case "list":
                      return (
                        <ul
                          key={index}
                          className="mb-8 ml-1 space-y-3 border-l-2 border-[#d5e1d8] py-1 pl-5 text-base leading-7 text-[#46514b] marker:text-red-700"
                        >
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="pl-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );

                    case "code":
                      return (
                        <p
                          key={index}
                          className="my-6 whitespace-pre-line font-mono text-sm leading-7 text-[#46514b]"
                        >
                          {section.code}
                        </p>
                      );
                  }
                })}
              </div>
            </article>
          </div>

          <footer className="mx-auto mt-16 max-w-6xl border-t border-[#e3e2db] pt-8 sm:mt-20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                  Keep learning
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-[#17211d]">
                  More clear answers, less jargon.
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1b2b25] px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#273d35]"
              >
                Explore the journal <span aria-hidden="true">→</span>
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}