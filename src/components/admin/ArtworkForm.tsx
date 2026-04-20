"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "painting",
  "sketch",
  "digital",
  "sculpture",
  "photography",
  "mixed",
] as const;

type Props = {
  initial?: {
    _id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl: string;
    publicId?: string;
    category: (typeof CATEGORIES)[number];
    tags: string[];
    featured: boolean;
  };
};

export function ArtworkForm({ initial }: Props) {
  const router = useRouter();
  const edit = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [publicId, setPublicId] = useState(initial?.publicId ?? "");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(
    initial?.category ?? "painting"
  );
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as {
        url?: string;
        publicId?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      if (data.url) setImageUrl(data.url);
      if (data.publicId) setPublicId(data.publicId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function suggestTags() {
    try {
      const res = await fetch("/api/ai/tag-artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      });
      const data = (await res.json()) as { tags?: string[] };
      if (data.tags?.length) setTags(data.tags.join(", "));
    } catch {
      /* ignore */
    }
  }

  async function onDelete() {
    if (!edit || !initial || !confirm("Delete this artwork?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/artworks/${initial._id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed");
        return;
      }
      router.push("/admin/artworks");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const body = {
        title,
        description,
        price: Number(price),
        imageUrl,
        publicId: publicId || undefined,
        category,
        tags: tagList,
        featured,
      };
      const url = edit ? `/api/artworks/${initial!._id}` : "/api/artworks";
      const res = await fetch(url, {
        method: edit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(JSON.stringify(err));
        return;
      }
      router.push("/admin/artworks");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
      <div>
        <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Price (USD)
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
            Category
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as (typeof CATEGORIES)[number])
            }
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Image
        </label>
        <input type="file" accept="image/*" onChange={onUpload} className="mt-2 block text-sm" />
        {uploading && <p className="mt-1 text-xs text-[var(--muted)]">Uploading…</p>}
        <input type="hidden" name="imageUrl" value={imageUrl} readOnly />
        {imageUrl && (
          <p className="mt-2 truncate text-xs text-[var(--muted)]">{imageUrl}</p>
        )}
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Tags (comma-separated)
        </label>
        <div className="mt-2 flex gap-2">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
          />
          <button
            type="button"
            onClick={() => void suggestTags()}
            className="shrink-0 rounded-xl border border-[var(--border)] px-3 text-xs"
          >
            AI tags
          </button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured on home
      </label>
      <button
        type="submit"
        disabled={busy || !imageUrl}
        className="w-full rounded-full bg-[var(--foreground)] py-3 text-sm text-[var(--background)] disabled:opacity-50"
      >
        {busy ? "Saving…" : edit ? "Update" : "Create"}
      </button>
      {edit && (
        <button
          type="button"
          onClick={() => void onDelete()}
          className="w-full rounded-full border border-red-500/50 py-3 text-sm text-red-600"
        >
          Delete artwork
        </button>
      )}
    </form>
  );
}
