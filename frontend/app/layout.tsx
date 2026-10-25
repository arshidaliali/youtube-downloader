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

  title: "YouTube Shorts Downloader – Save Shorts & Videos Online",

  keywords: [
    "YouTube Shorts Downloader",
    "Download YouTube Shorts",
    "Save YouTube Shorts",
    "YouTube Video Downloader",
    "Shorts to MP4",
  ],

  verification: {
    google: "W9extQa2TU8S9UY-X-cAHktRem3z_vytBFILyUUDej4",
  },

  description:
    "Free YouTube Shorts Downloader. Fast and easy way to save YouTube Shorts and videos in HD MP4 quality instantly with no registration required.",

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
    title: "YouTube Shorts Downloader – Save Shorts & Videos Online",
    description:
      "Quickly download YouTube Shorts and videos in high quality. Fast, simple, and free with no account required.",
    url: "https://youtubevideodownload.app/",
    siteName: "YouTube Video Download",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "YouTube Shorts Downloader – Save Shorts & Videos Online",
    description:
      "Save YouTube Shorts and videos in high quality instantly. Free, fast, and easy to use.",
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