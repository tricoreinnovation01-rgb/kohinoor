"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatNprFromUsd } from "@/lib/currency";
import type { ArtworkPublic } from "@/types/artwork";

type SortKey = "new" | "price-asc" | "price-desc" | "title";

export function ShopClient({ initial }: { initial: ArtworkPublic[] }) {
  const [items, setItems] = useState<ArtworkPublic[]>(initial);
  const [sort, setSort] = useState<SortKey>("new");
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/artworks?limit=48");
      const data = (await res.json()) as { items: ArtworkPublic[] };
      if (data.items?.length) setItems(data.items);
    }
    if (!initial.length) void load();
  }, [initial.length]);

  const sorted = useMemo(() => {
    const copy = [...items];
    if (sort === "price-asc") {
      copy.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      copy.sort((a, b) => b.price - a.price);
    } else if (sort === "title") {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    return copy;
  }, [items, sort]);

  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="container-narrow mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-5xl font-light italic md:text-6xl lg:text-7xl">
            Shop
          </h1>
          <p className="label-caps mt-4 text-[var(--muted)]">
            Available works &amp; editions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="shop-sort" className="label-caps text-[var(--muted)]">
            Sort
          </label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-[var(--border)] bg-[var(--surface-card)] px-3 py-2 text-xs font-medium uppercase tracking-[0.1em] text-[var(--foreground)]"
          >
            <option value="new">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </div>
      <div className="container-narrow grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((a, i) => (
          <motion.article
            key={a._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: (i % 8) * 0.04,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="group flex flex-col"
          >
            <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition duration-500 ease-out group-hover:-translate-y-1">
              <div className="relative aspect-square">
                <Link href={`/work/${a.slug}`} className="absolute inset-0 z-0 block">
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="object-cover transition duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                    sizes="(max-width:1024px) 50vw, 25vw"
                    loading="lazy"
                  />
                </Link>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full transition duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0 group-hover:pointer-events-auto">
                  {!a.sold ? (
                    <button
                      type="button"
                      className="flex w-full items-center justify-center bg-[var(--foreground)] py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--background)]"
                      onClick={() =>
                        addItem({
                          artworkId: a._id,
                          slug: a.slug,
                          title: a.title,
                          price: a.price,
                          imageUrl: a.imageUrl,
                        })
                      }
                    >
                      Add to cart
                    </button>
                  ) : (
                    <div className="w-full bg-[var(--surface)] py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
                      Sold
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href={`/work/${a.slug}`}>
                <h2 className="font-display text-lg font-light text-[var(--foreground)] transition hover:text-[var(--gold-deep)]">
                  {a.title}
                </h2>
              </Link>
              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <p className="text-sm font-light text-[var(--secondary)]">
                  {a.sold ? "Sold" : formatNprFromUsd(a.price)}
                </p>
                <span className="label-caps text-[var(--muted)]">
                  {a.category}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
