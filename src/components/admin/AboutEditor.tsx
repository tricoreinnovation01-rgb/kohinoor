"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AboutContent, AboutTimelineItem } from "@/types/about";

type AboutState = AboutContent;

const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

const DEFAULTS: AboutState = {
  heroTitle: "A life in lines",
  heroItalicWord: "lines",
  bioP1:
    "Born in Bucharest and rooted in Kathmandu, Kohinoor builds images where silence is material.",
  bioP2:
    "The studio welcomes collectors, curators, and first-time buyers. Each work ships with a certificate and conservation notes.",
  portraitImageUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  quote: "The space between lines is where the masterpiece actually begins.",
  quoteLabel: "Artist",
  silenceTitle: "The beauty of silence.",
  silenceText:
    "Objects, light, and the pause before the next mark — a meditation in charcoal and breath.",
  silenceImageUrl:
    "https://images.unsplash.com/photo-1610701596007-115028617dc2?w=1200&q=80",
  timelineEyebrow: "The narrative arc",
  timelineTitle: "Exhibitions & milestones",
  timeline: [
    {
      year: "2024",
      title: "Solo exhibition",
      text: "Paper thresholds — new graphite and ink works, Kathmandu.",
      tag: "Solo",
    },
    {
      year: "2022",
      title: "Vienna residency",
      text: "Three months at a printmaking atelier; cross-disciplinary studies.",
      tag: "Residency",
    },
    {
      year: "2020",
      title: "London group show",
      text: "Contemporary drawing survey, curated booth alongside EU artists.",
      tag: "Group",
    },
    {
      year: "2017",
      title: "BFA Bucharest",
      text: "Fine arts degree with focus on figurative drawing and art history.",
      tag: "Education",
    },
  ],
};

function inputCls() {
  return "mt-2 w-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-light";
}

export function AboutEditor({ initial }: { initial: Partial<AboutState> | null }) {
  const router = useRouter();
  const initialState = useMemo<AboutState>(() => {
    const src: Partial<AboutState> = initial ?? {};
    return {
      heroTitle: src.heroTitle ?? DEFAULTS.heroTitle,
      heroItalicWord: src.heroItalicWord ?? DEFAULTS.heroItalicWord,
      bioP1: src.bioP1 ?? DEFAULTS.bioP1,
      bioP2: src.bioP2 ?? DEFAULTS.bioP2,
      portraitImageUrl: src.portraitImageUrl ?? DEFAULTS.portraitImageUrl,
      quote: src.quote ?? DEFAULTS.quote,
      quoteLabel: src.quoteLabel ?? DEFAULTS.quoteLabel,
      silenceTitle: src.silenceTitle ?? DEFAULTS.silenceTitle,
      silenceText: src.silenceText ?? DEFAULTS.silenceText,
      silenceImageUrl: src.silenceImageUrl ?? DEFAULTS.silenceImageUrl,
      timelineEyebrow: src.timelineEyebrow ?? DEFAULTS.timelineEyebrow,
      timelineTitle: src.timelineTitle ?? DEFAULTS.timelineTitle,
      timeline:
        Array.isArray(src.timeline) && src.timeline.length
          ? (src.timeline as AboutTimelineItem[])
          : DEFAULTS.timeline,
    };
  }, [initial]);

  const [state, setState] = useState<AboutState>(initialState);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [portraitUploading, setPortraitUploading] = useState(false);
  const [portraitUploadError, setPortraitUploadError] = useState<string | null>(null);
  const [silenceUploading, setSilenceUploading] = useState(false);
  const [silenceUploadError, setSilenceUploadError] = useState<string | null>(null);

  async function uploadImage(
    file: File,
    setUploading: (v: boolean) => void,
    setError: (v: string | null) => void,
    onOk: (url: string) => void
  ) {
    setError(null);
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Image is too large. Max ${MAX_IMAGE_MB}MB. Please upload a smaller file.`);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      let data: { url?: string; error?: string } | null = null;
      try {
        data = (await res.json()) as { url?: string; error?: string };
      } catch {
        data = null;
      }
      if (!res.ok || !data?.url) {
        throw new Error(
          data?.error ??
            `Upload failed (HTTP ${res.status}). Check Cloudinary env vars on Vercel.`
        );
      }
      onOk(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/about", {
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
    if (!confirm("Delete About content? This will revert to defaults on the public site.")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/about", { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setMsg("Deleted.");
      router.refresh();
    } catch {
      setMsg("Could not delete.");
    } finally {
      setBusy(false);
    }
  }

  function set<K extends keyof AboutState>(k: K, v: AboutState[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  return (
    <div className="space-y-8">
      <div className="border border-[var(--border)] bg-[var(--surface-card)] p-6">
        <p className="label-caps text-[var(--gold-deep)]">Hero</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="label-caps text-[var(--muted)]">Title</label>
            <input
              className={inputCls()}
              value={state.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="label-caps text-[var(--muted)]">Italic word</label>
            <input
              className={inputCls()}
              value={state.heroItalicWord}
              onChange={(e) => set("heroItalicWord", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface-card)] p-6">
        <p className="label-caps text-[var(--gold-deep)]">Bio</p>
        <div className="mt-6 grid gap-6">
          <div>
            <label className="label-caps text-[var(--muted)]">Paragraph 1</label>
            <textarea
              className={inputCls()}
              rows={4}
              value={state.bioP1}
              onChange={(e) => set("bioP1", e.target.value)}
            />
          </div>
          <div>
            <label className="label-caps text-[var(--muted)]">Paragraph 2</label>
            <textarea
              className={inputCls()}
              rows={4}
              value={state.bioP2}
              onChange={(e) => set("bioP2", e.target.value)}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="label-caps text-[var(--muted)]">Portrait image URL</label>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Max {MAX_IMAGE_MB}MB. Recommended: 1200×1600 (3:4 portrait).
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  void uploadImage(
                    f,
                    setPortraitUploading,
                    setPortraitUploadError,
                    (url) => set("portraitImageUrl", url)
                  );
                  e.target.value = "";
                }}
                className="mt-2 block text-sm"
              />
              {portraitUploading ? (
                <p className="mt-1 text-xs text-[var(--muted)]">Uploading…</p>
              ) : null}
              {portraitUploadError ? (
                <p className="mt-2 text-xs text-red-600">{portraitUploadError}</p>
              ) : null}
              <input
                className={inputCls()}
                value={state.portraitImageUrl}
                onChange={(e) => set("portraitImageUrl", e.target.value)}
              />
              {state.portraitImageUrl ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
                  <div className="relative aspect-[3/4] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={state.portraitImageUrl}
                      alt="Portrait preview"
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div>
              <label className="label-caps text-[var(--muted)]">Quote label</label>
              <input
                className={inputCls()}
                value={state.quoteLabel}
                onChange={(e) => set("quoteLabel", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label-caps text-[var(--muted)]">Quote</label>
            <input
              className={inputCls()}
              value={state.quote}
              onChange={(e) => set("quote", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface-card)] p-6">
        <p className="label-caps text-[var(--gold-deep)]">Silence section</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="label-caps text-[var(--muted)]">Title</label>
            <input
              className={inputCls()}
              value={state.silenceTitle}
              onChange={(e) => set("silenceTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="label-caps text-[var(--muted)]">Image URL</label>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Max {MAX_IMAGE_MB}MB. Recommended: 1600×1000 (landscape).
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                void uploadImage(
                  f,
                  setSilenceUploading,
                  setSilenceUploadError,
                  (url) => set("silenceImageUrl", url)
                );
                e.target.value = "";
              }}
              className="mt-2 block text-sm"
            />
            {silenceUploading ? (
              <p className="mt-1 text-xs text-[var(--muted)]">Uploading…</p>
            ) : null}
            {silenceUploadError ? (
              <p className="mt-2 text-xs text-red-600">{silenceUploadError}</p>
            ) : null}
            <input
              className={inputCls()}
              value={state.silenceImageUrl}
              onChange={(e) => set("silenceImageUrl", e.target.value)}
            />
            {state.silenceImageUrl ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-card)]">
                <div className="relative aspect-[5/3] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.silenceImageUrl}
                    alt="Silence image preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div className="md:col-span-2">
            <label className="label-caps text-[var(--muted)]">Text</label>
            <textarea
              className={inputCls()}
              rows={3}
              value={state.silenceText}
              onChange={(e) => set("silenceText", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border border-[var(--border)] bg-[var(--surface-card)] p-6">
        <p className="label-caps text-[var(--gold-deep)]">Timeline</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="label-caps text-[var(--muted)]">Eyebrow</label>
            <input
              className={inputCls()}
              value={state.timelineEyebrow}
              onChange={(e) => set("timelineEyebrow", e.target.value)}
            />
          </div>
          <div>
            <label className="label-caps text-[var(--muted)]">Title</label>
            <input
              className={inputCls()}
              value={state.timelineTitle}
              onChange={(e) => set("timelineTitle", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {state.timeline.map((it, idx) => (
            <div key={`${it.year}-${idx}`} className="border border-[var(--border)] p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="label-caps text-[var(--muted)]">Year</label>
                  <input
                    className={inputCls()}
                    value={it.year}
                    onChange={(e) => {
                      const next = [...state.timeline];
                      next[idx] = { ...next[idx], year: e.target.value };
                      set("timeline", next);
                    }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label-caps text-[var(--muted)]">Title</label>
                  <input
                    className={inputCls()}
                    value={it.title}
                    onChange={(e) => {
                      const next = [...state.timeline];
                      next[idx] = { ...next[idx], title: e.target.value };
                      set("timeline", next);
                    }}
                  />
                </div>
                <div>
                  <label className="label-caps text-[var(--muted)]">Tag</label>
                  <input
                    className={inputCls()}
                    value={it.tag ?? ""}
                    onChange={(e) => {
                      const next = [...state.timeline];
                      next[idx] = { ...next[idx], tag: e.target.value };
                      set("timeline", next);
                    }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="label-caps text-[var(--muted)]">Description</label>
                <textarea
                  className={inputCls()}
                  rows={3}
                  value={it.text}
                  onChange={(e) => {
                    const next = [...state.timeline];
                    next[idx] = { ...next[idx], text: e.target.value };
                    set("timeline", next);
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em]"
                  onClick={() => set("timeline", state.timeline.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em]"
            onClick={() =>
              set("timeline", [
                ...state.timeline,
                { year: "2026", title: "New milestone", text: "Description…", tag: "" },
              ])
            }
          >
            Add timeline item
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="border border-red-500/40 bg-red-500/5 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-red-700 disabled:opacity-50"
        >
          Delete about content
        </button>
        <div className="flex items-center gap-3">
          {msg ? <p className="text-sm text-[var(--muted)]">{msg}</p> : null}
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--background)] disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

