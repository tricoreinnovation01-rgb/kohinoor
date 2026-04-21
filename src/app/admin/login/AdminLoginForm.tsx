"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        let message = "Login failed";
        try {
          const data = (await res.json()) as { error?: string };
          if (data?.error) message = data.error;
        } catch {
          try {
            const t = (await res.text()).trim();
            if (t) message = t.slice(0, 300);
          } catch {
            /* ignore */
          }
        }
        setErr(message);
        return;
      }
      router.replace(from);
      router.refresh();
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-narrow flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] p-8">
        <h1 className="text-2xl font-light">Admin sign in</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          JWT session — use credentials from seed.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4"
          aria-busy={loading}
        >
          <div>
            <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          {loading ? (
            <p className="text-sm text-[var(--muted)]">
              Signing in… please wait.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
