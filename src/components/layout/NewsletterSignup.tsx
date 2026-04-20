"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Newsletter",
          lastName: "Subscriber",
          email: email.trim(),
          subject: "other",
          message:
            "Please add me to the Kohinoor Artist mailing list for studio news and releases.",
        }),
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) setEmail("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 max-w-md border border-[var(--border)] bg-[var(--surface-card)] p-5"
    >
      <p className="label-caps text-[var(--gold-deep)]">Newsletter</p>
      <p className="mt-2 text-sm font-light text-[var(--secondary)]">
        Occasional notes on new works and exhibitions — no noise.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
          className="min-h-11 flex-1 border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-light"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="min-h-11 border border-[var(--foreground)] bg-[var(--foreground)] px-6 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--background)] disabled:opacity-50"
        >
          {status === "sending" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "ok" ? (
        <p className="mt-3 text-xs text-emerald-700">
          Thank you — you are on the list.
        </p>
      ) : null}
      {status === "err" ? (
        <p className="mt-3 text-xs text-red-600">
          Something went wrong. Try again later.
        </p>
      ) : null}
    </form>
  );
}
