"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatNprFromUsd } from "@/lib/currency";

export type FeaturedItem = {
  _id: string;
  slug: string;
  title: string;
  imageUrl: string;
  category: string;
  price: number;
  tags?: string[];
};

export function FeaturedGrid({ items }: { items: FeaturedItem[] }) {
  if (!items.length) return null;

  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)] py-20 md:py-28">
      <div className="container-narrow mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-caps text-[var(--gold-deep)]">The archive</p>
          <h2 className="font-display mt-4 text-3xl font-light md:text-4xl lg:text-[2.75rem]">
            Recent acquisitions
          </h2>
        </div>
        <Link
          href="/portfolio"
          className="nav-link label-caps text-[var(--secondary)] transition hover:text-[var(--foreground)]"
        >
          View all works
        </Link>
      </div>
      <div className="container-narrow grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((it, i) => (
          <motion.article
            key={it._id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{
              duration: 0.55,
              delay: i * 0.06,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="group"
          >
            <div className="relative overflow-hidden border border-[var(--border)] bg-[var(--surface-card)] transition duration-500 ease-out group-hover:-translate-y-1">
              <Link
                href={`/work/${it.slug}`}
                className="relative block aspect-square"
              >
                <Image
                  src={it.imageUrl}
                  alt={it.title}
                  fill
                  className="object-cover transition duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                  sizes="(max-width:1024px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#0d0d0d]/0 transition duration-500 group-hover:bg-[#0d0d0d]/45" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-3 p-5 transition duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">
                  <span className="inline-flex w-fit border border-white/35 bg-white/10 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    View piece
                  </span>
                </div>
              </Link>
            </div>
            <div className="mt-5 space-y-2 border-t border-transparent pt-1">
              <p className="label-caps text-[var(--gold-deep)]">{it.category}</p>
              <Link href={`/work/${it.slug}`}>
                <h3 className="font-display text-xl font-light text-[var(--foreground)] transition hover:text-[var(--gold-deep)] md:text-2xl">
                  {it.title}
                </h3>
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display text-base font-light text-[var(--secondary)]">
                  {formatNprFromUsd(it.price)}
                </p>
                {it.tags?.[0] ? (
                  <span className="border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                    {it.tags[0]}
                  </span>
                ) : null}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
