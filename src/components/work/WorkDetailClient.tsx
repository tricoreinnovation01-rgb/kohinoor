"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatNprFromUsd } from "@/lib/currency";
import type { ArtworkPublic } from "@/types/artwork";

const WISHLIST_KEY = "aria-wishlist";

function mediumLabel(cat: string) {
  const m: Record<string, string> = {
    sketch: "Graphite / ink on paper",
    painting: "Mixed media on panel",
    digital: "Digital pigment print",
    photography: "Archival pigment print",
    sculpture: "Mixed media",
    mixed: "Mixed media",
  };
  return m[cat] ?? cat;
}

export function WorkDetailClient({
  artwork,
  related,
}: {
  artwork: ArtworkPublic;
  related: ArtworkPublic[];
}) {
  const { addItem } = useCart();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const picks = related.slice(0, 3);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      setWishlisted(arr.includes(artwork._id));
    } catch {
      setWishlisted(false);
    }
  }, [artwork._id]);

  const toggleWishlist = useCallback(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      let arr: string[] = raw ? JSON.parse(raw) : [];
      if (arr.includes(artwork._id)) {
        arr = arr.filter((id) => id !== artwork._id);
        setWishlisted(false);
      } else {
        arr = [...arr, artwork._id];
        setWishlisted(true);
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr));
    } catch {
      /* ignore */
    }
  }, [artwork._id]);

  async function buyNow() {
    setCheckoutError(null);
    setSuccess(null);
    if (!email.trim()) {
      alert("Please enter your email for checkout.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          items: [{ artworkId: artwork._id, quantity: 1 }],
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        orderId?: string;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setCheckoutError(data.error ?? "Request failed");
        return;
      }
      setSuccess(
        `Artist will contact you regarding this order. (Ref: ${data.orderId ?? "—"})`
      );
      setSuccessOpen(true);
      window.setTimeout(() => setSuccess(null), 7000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-24 pt-10 md:pt-14">
      <div className="container-narrow grid gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          className="relative aspect-[3/4] overflow-hidden border border-[var(--border)] bg-[var(--surface)] lg:sticky lg:top-28 lg:h-[min(82vh,920px)]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <a
            href={artwork.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-card)_88%,transparent)] text-[var(--foreground)] backdrop-blur-sm transition hover:border-[var(--gold)]"
            aria-label="View full size"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3M4 8V4h4M16 4h4v4" />
            </svg>
          </a>
        </motion.div>

        <div>
          <nav className="label-caps flex flex-wrap gap-x-2 gap-y-1 text-[var(--muted)]">
            <Link href="/" className="transition hover:text-[var(--foreground)]">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link
              href="/portfolio"
              className="transition hover:text-[var(--foreground)]"
            >
              Works
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--foreground)]">{artwork.title}</span>
          </nav>

          <p className="label-caps mt-8 text-[var(--gold-deep)]">
            {artwork.category}
          </p>
          <h1 className="font-display mt-3 text-4xl font-light leading-tight md:text-5xl lg:text-[3.25rem]">
            {artwork.title}
          </h1>
          <p className="label-caps mt-4 text-[var(--muted)]">
            {new Date().getFullYear()} · Original, single edition
          </p>
          <p className="font-display mt-8 text-4xl font-light md:text-5xl">
            {formatNprFromUsd(artwork.price)}
          </p>
          <p className="mt-8 text-sm font-light leading-relaxed text-[var(--secondary)] md:text-base">
            {artwork.description ?? "—"}
          </p>

          <div className="mt-10 border border-[var(--border)]">
            {[
              ["Medium", mediumLabel(artwork.category)],
              ["Dimensions", "On request — studio measurement"],
              ["Year", String(new Date().getFullYear())],
              ["Frame", "Optional — museum glass available"],
              ["Shipping", "Worldwide, insured crate"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid gap-2 border-b border-[var(--border)] px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_1.4fr] sm:gap-4"
              >
                <span className="label-caps text-[var(--muted)]">{k}</span>
                <span className="font-light text-[var(--secondary)]">{v}</span>
              </div>
            ))}
          </div>

          {artwork.sold ? (
            <p className="mt-10 text-sm text-[var(--muted)]">Sold</p>
          ) : (
            <div className="mt-10 space-y-4">
              <label className="block">
                <span className="label-caps text-[var(--muted)]">
                  Email for receipt
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border border-[var(--border)] bg-[var(--surface-card)] px-4 py-3 text-sm font-light text-[var(--foreground)]"
                  placeholder="you@example.com"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    artworkId: artwork._id,
                    slug: artwork.slug,
                    title: artwork.title,
                    price: artwork.price,
                    imageUrl: artwork.imageUrl,
                  })
                }
                className="w-full border border-[var(--gold-deep)] bg-[var(--gold-deep)] py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              >
                Add to cart
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={buyNow}
                className="w-full border border-[var(--foreground)] bg-[var(--foreground)] py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Redirecting…" : "Buy now"}
              </button>
              <button
                type="button"
                onClick={toggleWishlist}
                className="w-full border border-[var(--border)] bg-[var(--surface-card)] py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] transition hover:border-[var(--gold)]"
              >
                {wishlisted ? "Saved to wishlist" : "Wishlist"}
              </button>
              {checkoutError ? (
                <p className="text-sm text-red-600">
                  {checkoutError}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {successOpen && success ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Order sent"
          onClick={() => setSuccessOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="label-caps text-[var(--muted)]">Request sent</p>
            <h3 className="font-display mt-3 text-2xl font-light">
              Artist will contact you
            </h3>
            <p className="mt-3 text-sm text-[var(--secondary)]">{success}</p>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)]"
              onClick={() => setSuccessOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {picks.length > 0 ? (
        <section className="container-narrow mt-24 border-t border-[var(--border)] pt-20 md:mt-28 md:pt-24">
          <div className="mb-10 flex items-center gap-3">
            <span
              className="ai-dot h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]"
              aria-hidden
            />
            <p className="label-caps text-[var(--gold-deep)]">
              AI-powered recommendations
            </p>
          </div>
          <h2 className="font-display text-3xl font-light md:text-4xl">
            You may also like
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((r) => (
              <Link
                key={r._id}
                href={`/work/${r.slug}`}
                className="group block border border-[var(--border)] bg-[var(--surface-card)] transition duration-500 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]">
                  <Image
                    src={r.imageUrl}
                    alt={r.title}
                    fill
                    className="object-cover transition duration-[650ms] group-hover:scale-[1.03]"
                    sizes="33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="label-caps text-[var(--muted)]">{r.category}</p>
                  <p className="font-display mt-2 text-lg font-light">
                    {r.title}
                  </p>
                  <p className="mt-2 text-sm font-light text-[var(--secondary)]">
                    {formatNprFromUsd(r.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
