"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HomeStatsContent } from "@/types/stats";

const DEFAULTS: HomeStatsContent = {
  works: 240,
  exhibitions: 18,
  awards: 12,
  experienceYears: 8,
};

function inputCls() {
  return "mt-2 w-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-light";
}

export function StatsEditor({ initial }: { initial: Partial<HomeStatsContent> | null }) {
  const router = useRouter();
  const initialState = useMemo<HomeStatsContent>(() => {
    const src: Partial<HomeStatsContent> = initial ?? {};
    return {
      works: Number(src.works ?? DEFAULTS.works),
      exhibitions: Number(src.exhibitions ?? DEFAULTS.exhibitions),
      awards: Number(src.awards ?? DEFAULTS.awards),
      experienceYears: Number(src.experienceYears ?? DEFAULTS.experienceYears),
    };
  }, [initial]);

  const [state, setState] = useState<HomeStatsContent>(initialState);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/stats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg("Saved.");
      router.refresh();
    } catch {
      setMsg("Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Delete stats? This will revert to defaults on the public site.")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/stats", { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMsg("Deleted.");
      router.refresh();
    } catch {
      setMsg("Could not delete.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Works (0 hides)
          </label>
          <input
            type="number"
            min={0}
            value={state.works}
            onChange={(e) => setState((s) => ({ ...s, works: Number(e.target.value) }))}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Exhibitions (0 hides)
          </label>
          <input
            type="number"
            min={0}
            value={state.exhibitions}
            onChange={(e) =>
              setState((s) => ({ ...s, exhibitions: Number(e.target.value) }))
            }
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Awards (0 hides)
          </label>
          <input
            type="number"
            min={0}
            value={state.awards}
            onChange={(e) => setState((s) => ({ ...s, awards: Number(e.target.value) }))}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Experience (years, 0 hides)
          </label>
          <input
            type="number"
            min={0}
            value={state.experienceYears}
            onChange={(e) =>
              setState((s) => ({ ...s, experienceYears: Number(e.target.value) }))
            }
            className={inputCls()}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm text-[var(--background)] disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void remove()}
          className="rounded-full border border-red-500/40 px-6 py-3 text-sm text-red-600 disabled:opacity-50"
        >
          Delete (reset to defaults)
        </button>
        {msg ? <p className="text-sm text-[var(--muted)]">{msg}</p> : null}
      </div>
    </div>
  );
}

