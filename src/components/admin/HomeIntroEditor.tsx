"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HomeArtistIntroContent } from "@/types/home-intro";

const DEFAULTS: HomeArtistIntroContent = {
  imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
  imageAlt: "Kohinoor in the studio",
  name: "Kohinoor",
  roleLine: "Drawing artist & architectural designer",
  eyebrow: "Artist",
  headline: "A dialogue between light and void.",
  headlineEmphasis: "light and void",
  body:
    "The studio treats drawing as architecture of attention — each line holds breath. Work moves between portraiture, botanical study, and abstract fields of graphite, always in service of stillness.",
  quote: "The space between lines is where the masterpiece actually begins.",
  signature: "— Kohinoor",
};

function inputCls() {
  return "mt-2 w-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-light";
}

export function HomeIntroEditor({
  initial,
}: {
  initial: Partial<HomeArtistIntroContent> | null;
}) {
  const router = useRouter();
  const initialState = useMemo<HomeArtistIntroContent>(() => {
    const src: Partial<HomeArtistIntroContent> = initial ?? {};
    return {
      imageUrl: src.imageUrl ?? DEFAULTS.imageUrl,
      imageAlt: src.imageAlt ?? DEFAULTS.imageAlt,
      name: src.name ?? DEFAULTS.name,
      roleLine: src.roleLine ?? DEFAULTS.roleLine,
      eyebrow: src.eyebrow ?? DEFAULTS.eyebrow,
      headline: src.headline ?? DEFAULTS.headline,
      headlineEmphasis: src.headlineEmphasis ?? DEFAULTS.headlineEmphasis,
      body: src.body ?? DEFAULTS.body,
      quote: src.quote ?? DEFAULTS.quote,
      signature: src.signature ?? DEFAULTS.signature,
    };
  }, [initial]);

  const [state, setState] = useState<HomeArtistIntroContent>(initialState);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/home-intro", {
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
    if (!confirm("Delete intro content? This will revert to defaults on the public site.")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/home-intro", { method: "DELETE" });
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
            Image URL
          </label>
          <input
            value={state.imageUrl}
            onChange={(e) => setState((s) => ({ ...s, imageUrl: e.target.value }))}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Image Alt
          </label>
          <input
            value={state.imageAlt}
            onChange={(e) => setState((s) => ({ ...s, imageAlt: e.target.value }))}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Name
          </label>
          <input
            value={state.name}
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Role line
          </label>
          <input
            value={state.roleLine}
            onChange={(e) => setState((s) => ({ ...s, roleLine: e.target.value }))}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Eyebrow label
          </label>
          <input
            value={state.eyebrow}
            onChange={(e) => setState((s) => ({ ...s, eyebrow: e.target.value }))}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Headline emphasis (italic)
          </label>
          <input
            value={state.headlineEmphasis}
            onChange={(e) =>
              setState((s) => ({ ...s, headlineEmphasis: e.target.value }))
            }
            className={inputCls()}
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Headline
        </label>
        <input
          value={state.headline}
          onChange={(e) => setState((s) => ({ ...s, headline: e.target.value }))}
          className={inputCls()}
        />
        <p className="mt-2 text-xs text-[var(--muted)]">
          The first occurrence of the emphasis text will be italic + gold.
        </p>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Body
        </label>
        <textarea
          value={state.body}
          onChange={(e) => setState((s) => ({ ...s, body: e.target.value }))}
          rows={5}
          className={inputCls()}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Quote
          </label>
          <textarea
            value={state.quote}
            onChange={(e) => setState((s) => ({ ...s, quote: e.target.value }))}
            rows={3}
            className={inputCls()}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Signature
          </label>
          <input
            value={state.signature}
            onChange={(e) =>
              setState((s) => ({ ...s, signature: e.target.value }))
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

