"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useEffect, useState } from "react";

const nav = [
  { href: "/portfolio", label: "Works" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_92%,transparent)] backdrop-blur-md">
      <div className="container-narrow flex h-16 items-center justify-between gap-3 md:h-[4.5rem] md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4">
        <Link
          href="/"
          className="min-w-0 justify-self-start leading-tight text-[var(--foreground)]"
        >
          <span className="font-display text-lg font-light tracking-tight md:text-xl">
            Kohinoor
          </span>
          <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            Artist
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:justify-self-center lg:flex">
          {nav.map((n) => {
            const active =
              n.href === "/"
                ? pathname === "/"
                : pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`nav-link px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] ${
                  active
                    ? "nav-link-active text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2 md:justify-self-end">
          <Link
            href="/shop"
            className="relative inline-flex items-center justify-center border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] transition hover:border-[var(--gold)]"
          >
            Cart
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-[var(--gold-deep)] px-1 text-[9px] font-semibold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--border)] bg-[var(--background)] lg:hidden">
          <div className="container-narrow py-4">
            <Link
              href="/"
              className={`mb-2 block rounded-sm px-3 py-3 text-sm ${
                pathname === "/"
                  ? "bg-[var(--surface)] text-[var(--foreground)]"
                  : "text-[var(--muted)]"
              }`}
            >
              Home
            </Link>
            <nav className="grid gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`rounded-sm px-3 py-3 text-sm ${
                    pathname === n.href || pathname.startsWith(`${n.href}/`)
                      ? "bg-[var(--surface)] text-[var(--foreground)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
