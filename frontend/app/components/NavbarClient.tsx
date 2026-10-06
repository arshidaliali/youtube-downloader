"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavbarClient() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto max-w-6xl px-4">
      <div className="relative flex h-16 items-center justify-between rounded-2xl border border-white/20 bg-white/80 px-5 backdrop-blur-md shadow-lg shadow-slate-900/5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="VideoDown home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-xs text-white shadow-sm">
            ▶
          </span>

          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Video<span className="text-red-600">Down</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
          >
            How it works
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
          >
            Features
          </a>

          <a
            href="#faq"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
          >
            FAQ
          </a>

          <Link
            href="/blog"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
          >
            Blog
          </Link>
        </nav>

        {/* Desktop Action */}
        <div className="hidden items-center md:flex">
          <a
            href="#downloader"
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-red-500/25 hover:shadow-md"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 md:hidden"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:hidden"
          >
            <nav aria-label="Mobile navigation">
              <a
                href="#how-it-works"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                How it works
              </a>

              <a
                href="#features"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Features
              </a>

              <a
                href="#faq"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                FAQ
              </a>

              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Blog
              </Link>

              <a
                href="#downloader"
                onClick={() => setIsOpen(false)}
                className="mt-2 block rounded-xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Get Started
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}