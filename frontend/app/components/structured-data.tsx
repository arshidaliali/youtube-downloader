
export default function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "YouTube Video Download",
    url: "https://youtubevideodownload.app/",
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "YouTube Downloader",
    url: "https://youtubevideodownload.app/",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    description:
      "Download YouTube videos and Shorts in supported formats and qualities.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />
    </>
  );
}

