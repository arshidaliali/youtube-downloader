import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://youtubevideodownload.app"),

  title: "YouTube Video Downloader – Download Videos in HD MP4",

  keywords: [
    "YouTube Video Downloader",
    "Free YouTube Video Downloader",
    "Download YouTube Videos",
    "Video Downloader App",
    "Video Down",
    "YouTube Shorts Downloader",
    "Download YouTube Shorts",
  ],

  verification: {
    google: "W9extQa2TU8S9UY-X-cAHktRem3z_vytBFILyUUDej4",
  },

  description:
    "Download YouTube videos in HD MP4. Paste a link, choose your preferred quality, and save videos quickly with no registration. YouTube Shorts are supported.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "YouTube Video Downloader – Download Videos in HD MP4",
    description:
      "Download YouTube videos in HD MP4. Paste a link, choose your preferred quality, and save videos quickly with no registration. YouTube Shorts supported.",
    url: "https://youtubevideodownload.app/",
    siteName: "YouTube Video Download",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "YouTube Video Downloader – Download Videos in HD MP4",
    description:
      "Download YouTube videos in HD MP4. Fast, simple, and free. YouTube Shorts supported.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}