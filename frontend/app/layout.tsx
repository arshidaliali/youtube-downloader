
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

  title: "YouTube Downloader – Download Videos & Shorts",

  description:
    "Download YouTube videos and Shorts in supported formats and qualities. Fast, simple, and easy to use with no account required.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "YouTube Downloader – Download Videos & Shorts",
    description:
      "Download YouTube videos and Shorts in supported formats and qualities. Fast, simple, and easy to use with no account required.",
    url: "https://youtubevideodownload.app/",
    siteName: "YouTube Video Download",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "YouTube Downloader – Download Videos & Shorts",
    description:
      "Download YouTube videos and Shorts in supported formats and qualities.",
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