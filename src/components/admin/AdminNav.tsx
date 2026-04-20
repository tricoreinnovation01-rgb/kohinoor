"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/artworks", label: "Artworks", icon: "image" },
  { href: "/admin/artworks/new", label: "Add artwork", icon: "plus" },
  { href: "/admin/stats", label: "Home stats", icon: "spark" },
  { href: "/admin/about", label: "About", icon: "spark" },
  { href: "/admin/orders", label: "Orders", icon: "cart" },
  { href: "/admin/customers", label: "Customers", icon: "users" },
  { href: "/admin/stitch", label: "Stitch MCP", icon: "spark" },
] as const;

function Icon({ name }: { name: (typeof links)[number]["icon"] }) {
  const cls = "h-4 w-4";
  switch (name) {
    case "grid":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7" />
        </svg>
      );
    case "image":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <rect x="4" y="5" width="16" height="14" rx="1" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m4 17 5-5 4 4 3-3 4 4" />
        </svg>
      );
    case "plus":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "cart":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <path d="M6 6h15l-1.5 9H7.5L6 6zm0 0L5 3H2" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="18" cy="19" r="1" />
        </svg>
      );
    case "users":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <circle cx="9" cy="8" r="3" />
          <path d="M4 19v-1a5 5 0 0 1 5-5h0a5 5 0 0 1 5 5v1" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M22 19v0a4 4 0 0 0-3-3.87" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.25" aria-hidden>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        </svg>
      );
  }
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 px-2 py-5">
      {links.map((l) => {
        let active = false;
        if (l.href === "/admin") active = pathname === "/admin";
        else if (l.href === "/admin/artworks")
          active =
            pathname === "/admin/artworks" ||
            Boolean(pathname.match(/\/admin\/artworks\/[^/]+\/edit$/));
        else if (l.href === "/admin/artworks/new")
          active = pathname === "/admin/artworks/new";
        else active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition ${
              active
                ? "border-[var(--gold-deep)] bg-[color-mix(in_oklab,var(--gold)_8%,var(--surface-card))] font-medium text-[var(--foreground)]"
                : "border-transparent text-[var(--secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            }`}
          >
            <span className={active ? "text-[var(--gold-deep)]" : "text-[var(--muted)]"}>
              <Icon name={l.icon} />
            </span>
            {l.label}
          </Link>
        );
      })}
      <div className="mt-auto flex flex-col gap-0.5 border-t border-[var(--border)] pt-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-sm text-[var(--secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
        >
          View site
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 border-l-2 border-transparent px-3 py-2.5 text-left text-sm text-[var(--secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
        >
          Log out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-[5.5rem] z-[60] flex items-center border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground)] md:hidden"
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        Menu
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[55] bg-[#0d0d0d]/25 md:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-[58] flex w-56 flex-col border-r border-[var(--border)] bg-[var(--surface-card)] transition-transform duration-300 md:sticky md:top-0 md:z-40 md:h-screen md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-[var(--border)] px-5 py-6">
          <p className="font-display text-lg font-light text-[var(--foreground)]">
            Kohinoor
          </p>
          <p className="label-caps mt-1 text-[var(--muted)]">Portfolio admin</p>
        </div>
        {nav}
      </aside>
    </>
  );
}
