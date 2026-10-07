import type { Article } from "../blog/articles";

type ArticleStructuredDataProps = {
    article: Article;
};

export default function ArticleStructuredData({
    article,
}: ArticleStructuredDataProps) {
    const url = `https://youtubevideodownload.app/blog/${article.slug}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.publishedAt,
        ...(article.updatedAt && {
            dateModified: article.updatedAt,
        }),
        author: {
            "@type": "Organization",
            name: article.author.name,
            description: article.author.bio,
        },
        articleSection: article.category,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema),
            }}
        />
    );
}
