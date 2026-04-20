"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedDemoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function seed() {
    if (!confirm("Create demo artworks? This will add/update items.")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = (await res.json()) as {
        ok?: boolean;
        created?: number;
        updated?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "Seed failed");
        return;
      }
      setMsg(
        `Seeded: +${data.created ?? 0} created, ${data.updated ?? 0} updated.`
      );
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] p-6">
      <p className="text-sm text-[var(--muted)]">Demo data</p>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Adds a premium-looking set of artworks for Home / Portfolio / Shop.
      </p>
      <button
        type="button"
        onClick={() => void seed()}
        disabled={busy}
        className="mt-4 rounded-full border border-[var(--border)] px-5 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Seeding…" : "Seed demo artworks"}
      </button>
      {msg && <p className="mt-3 text-xs text-[var(--muted)]">{msg}</p>}
    </div>
  );
}
