"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatNprFromUsd } from "@/lib/currency";

export function CartDrawer() {
  const { items, total, count, removeItem, setQuantity, clear } = useCart();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  async function checkout() {
    setCheckoutError(null);
    setSuccess(null);
    if (!items.length) return;
    if (!email.trim()) {
      alert("Enter your email to checkout.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          items: items.map((i) => ({
            artworkId: i.artworkId,
            quantity: i.quantity,
          })),
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
      clear();
      setSuccess(
        `Artist will contact you regarding this order. (Ref: ${data.orderId ?? "—"})`
      );
      setSuccessOpen(true);
      window.setTimeout(() => setSuccess(null), 7000);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm shadow-lg"
      >
        Cart ({count}) · {formatNprFromUsd(total)}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Cart</h2>
          <button
            type="button"
            className="text-sm text-[var(--muted)]"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-sm text-[var(--muted)]">Your cart is empty.</p>
          )}
          {items.map((i) => (
            <div
              key={i.artworkId}
              className="flex gap-3 rounded-xl border border-[var(--border)] p-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--border)]">
                <Image src={i.imageUrl} alt={i.title} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/work/${i.slug}`}
                  className="line-clamp-2 text-sm font-medium"
                >
                  {i.title}
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded border border-[var(--border)] px-2 text-xs"
                    onClick={() => setQuantity(i.artworkId, i.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="text-xs">{i.quantity}</span>
                  <button
                    type="button"
                    className="rounded border border-[var(--border)] px-2 text-xs"
                    onClick={() => setQuantity(i.artworkId, i.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-xs text-[var(--muted)]"
                    onClick={() => removeItem(i.artworkId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-[var(--border)] pt-4">
          <label className="block text-xs text-[var(--muted)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
            />
          </label>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">Total</span>
            <span className="text-lg">{formatNprFromUsd(total)}</span>
          </div>
          <button
            type="button"
            disabled={busy || !items.length}
            onClick={checkout}
            className="mt-4 w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)] disabled:opacity-50"
          >
            {busy ? "Sending…" : "Send inquiry"}
          </button>
          {checkoutError && (
            <p className="mt-3 text-sm text-red-600">
              {checkoutError}
            </p>
          )}
          <button
            type="button"
            className="mt-2 w-full text-center text-xs text-[var(--muted)]"
            onClick={clear}
          >
            Clear cart
          </button>
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
    </div>
  );
}
