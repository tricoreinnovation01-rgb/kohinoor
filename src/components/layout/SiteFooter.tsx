"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewsletterSignup } from "@/components/layout/NewsletterSignup";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/40 py-16 md:py-20">
      <div className="container-narrow grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="font-display text-2xl font-light text-[var(--foreground)]">
            Kohinoor
          </p>
          <p className="label-caps mt-2 text-[var(--gold-deep)]">Artist</p>
          <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-[var(--secondary)]">
            Fine drawings and originals — quiet luxury, museum-grade
            presentation, worldwide shipping from Kathmandu.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            <Link
              href="/portfolio"
              className="nav-link transition hover:text-[var(--foreground)]"
            >
              Works
            </Link>
            <Link
              href="/shop"
              className="nav-link transition hover:text-[var(--foreground)]"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="nav-link transition hover:text-[var(--foreground)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="nav-link transition hover:text-[var(--foreground)]"
            >
              Contact
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="nav-link transition hover:text-[var(--foreground)]"
            >
              Instagram
            </a>
          </div>
        </div>
        <NewsletterSignup />
      </div>
      <div className="container-narrow mt-14 border-t border-[var(--border)] pt-8 text-center text-[10px] font-light tracking-[0.12em] text-[var(--muted)]">
        © {new Date().getFullYear()} Kohinoor Artist · Tricore innovations. All rights reserved.
      </div>
    </footer>
  );
}
