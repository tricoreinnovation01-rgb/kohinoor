"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { formatNprFromUsd } from "@/lib/currency";
import type { ArtworkPublic } from "@/types/artwork";

const FILTERS: { key: string; label: string; apiCategory: string | null }[] = [
  { key: "all", label: "All", apiCategory: null },
  { key: "drawings", label: "Drawings", apiCategory: "sketch" },
  { key: "sketches", label: "Sketches", apiCategory: "sketch" },
  { key: "commissions", label: "Commissions", apiCategory: "mixed" },
  { key: "archive", label: "Archive", apiCategory: "photography" },
];

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[5/4]"] as const;

function apiParamForFilter(key: string): string {
  const f = FILTERS.find((x) => x.key === key);
  return f?.apiCategory ?? "all";
}

export function PortfolioClient({
  initialItems,
}: {
  initialItems: ArtworkPublic[];
}) {
  const [filterKey, setFilterKey] = useState("all");
  const [items, setItems] = useState<ArtworkPublic[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialItems.length >= 12);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ArtworkPublic | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const skipFirstAll = useRef(initialItems.length > 0);

  const category = apiParamForFilter(filterKey);

  const load = useCallback(
    async (nextPage: number, cat: string, append: boolean) => {
      setLoading(true);
      const q =
        cat === "all"
          ? `/api/artworks?page=${nextPage}&limit=12`
          : `/api/artworks?page=${nextPage}&limit=12&category=${encodeURIComponent(cat)}`;
      const res = await fetch(q);
      const data = (await res.json()) as {
        items: ArtworkPublic[];
        hasMore: boolean;
      };
      setHasMore(Boolean(data.hasMore));
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      setPage(nextPage);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (skipFirstAll.current && filterKey === "all") {
      skipFirstAll.current = false;
      return;
    }
    void load(1, category, false);
  }, [category, load]); // eslint-disable-line react-hooks/exhaustive-deps -- filterKey only for skipInitial; API key is category

  useEffect(() => {
    if (!modalOpen || !modal) return;
    const el = document.getElementById("portfolio-modal-inner");
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.98, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power2.inOut" }
    );
  }, [modalOpen, modal]);

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: { opacity: 1, y: 0 },
    }),
    []
  );

  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="container-narrow mb-16 text-center">
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl lg:text-[3.5rem]">
          Kohinoor
        </h1>
        <p className="label-caps mx-auto mt-4 max-w-xl text-[var(--secondary)]">
          Drawing artist &amp; architectural designer
        </p>
        <p className="mx-auto mt-6 max-w-lg text-sm font-light leading-relaxed text-[var(--secondary)] md:text-base">
          A living archive of works on paper — filter by series or browse the
          full collection.
        </p>
      </div>

      <div className="container-narrow mb-12 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => {
          const active = filterKey === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterKey(f.key)}
              className={`border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition duration-300 ${
                active
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                  : "border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="container-narrow">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={filterKey + items.length}
          className="columns-1 gap-6 sm:columns-2 lg:columns-3"
        >
          {items.map((a, i) => (
            <motion.div
              key={a._id}
              variants={itemVariants}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="mb-6 break-inside-avoid"
            >
              <ArtworkCard
                title={a.title}
                imageUrl={a.imageUrl}
                price={a.price}
                category={a.category}
                aspectClassName={ASPECTS[i % ASPECTS.length]}
                onOpen={() => {
                  setModal(a);
                  setModalOpen(true);
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => load(page + 1, category, true)}
              className="border border-[var(--border)] px-8 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--foreground)] disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {modalOpen && modal ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0d0d0d]/55 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <div
              id="portfolio-modal-inner"
              role="dialog"
              aria-modal
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface-card)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-[10px] uppercase tracking-widest"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
              <div className="relative aspect-[4/3] w-full bg-[var(--surface)]">
                <Image
                  src={modal.imageUrl}
                  alt={modal.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="border-t border-[var(--border)] p-6">
                <p className="label-caps text-[var(--gold-deep)]">
                  {modal.category}
                </p>
                <h2 className="font-display mt-2 text-2xl font-light md:text-3xl">
                  {modal.title}
                </h2>
                <p className="mt-3 text-sm font-light text-[var(--secondary)]">
                  {modal.description ?? "—"}
                </p>
                <p className="mt-4 font-display text-xl font-light">
                  {formatNprFromUsd(modal.price)}
                </p>
                <Link
                  href={`/work/${modal.slug}`}
                  className="mt-6 inline-flex border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--background)]"
                  onClick={() => setModalOpen(false)}
                >
                  View artwork
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
