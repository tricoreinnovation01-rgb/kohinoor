"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = String(fd.get("firstName") ?? "");
    const lastName = String(fd.get("lastName") ?? "");
    const email = String(fd.get("email") ?? "");
    const subject = String(fd.get("subject") ?? "");
    const message = String(fd.get("message") ?? "");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          subject: subject || undefined,
          message,
        }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6 border border-[var(--border)] bg-[var(--surface-card)] p-6 md:p-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label-caps text-[var(--muted)]" htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            className="mt-2 w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-light"
          />
        </div>
        <div>
          <label className="label-caps text-[var(--muted)]" htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            className="mt-2 w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-light"
          />
        </div>
      </div>
      <div>
        <label className="label-caps text-[var(--muted)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-light"
        />
      </div>
      <div>
        <label className="label-caps text-[var(--muted)]" htmlFor="subject">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="mt-2 w-full border border-[var(--border)] bg-[var(--surface-card)] px-4 py-3 text-sm font-light text-[var(--foreground)]"
          defaultValue=""
        >
          <option value="" disabled>
            Select…
          </option>
          <option value="commission">Commission</option>
          <option value="purchase">Purchase inquiry</option>
          <option value="press">Press</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="label-caps text-[var(--muted)]" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-2 w-full border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-light"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full border border-[var(--foreground)] bg-[var(--foreground)] py-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--background)] transition disabled:opacity-50"
      >
        {status === "sending"
          ? "Sending…"
          : status === "ok"
            ? "Sent"
            : "Submit"}
      </button>
      {status === "ok" ? (
        <p className="text-center text-sm text-emerald-700">
          Thank you — we will reply shortly.
        </p>
      ) : null}
      {status === "err" ? (
        <p className="text-center text-sm text-red-600">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </motion.form>
  );
}
