"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ArtistIntro() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)]/80 py-20 md:py-28">
      <div className="container-narrow grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          className="relative mx-auto max-w-md lg:mx-0"
        >
          <div className="relative aspect-[3/4] overflow-hidden border border-[var(--border)] bg-[var(--surface-card)]">
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80"
              alt="Kohinoor in the studio"
              fill
              className="object-cover grayscale"
              sizes="(max-width:1024px) 90vw, 45vw"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-card)_94%,transparent)] px-5 py-4 backdrop-blur-sm">
              <p className="font-display text-xl font-light text-[var(--foreground)] md:text-2xl">
                Kohinoor
              </p>
              <p className="label-caps mt-1 text-[var(--muted)]">
                Drawing artist &amp; architectural designer
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-xl"
        >
          <p className="label-caps text-[var(--gold-deep)]">Artist</p>
          <h2 className="font-display mt-4 text-3xl font-light leading-[1.15] md:text-4xl lg:text-[2.75rem]">
            A dialogue between{" "}
            <em className="not-italic italic text-[var(--gold-deep)]">
              light and void
            </em>
            .
          </h2>
          <p className="mt-8 text-sm font-light leading-relaxed text-[var(--secondary)] md:text-base">
            The studio treats drawing as architecture of attention — each line
            holds breath. Work moves between portraiture, botanical study, and
            abstract fields of graphite, always in service of stillness.
          </p>
          <blockquote className="mt-10 border-l-2 border-[var(--gold)] pl-6">
            <p className="font-display text-lg font-light italic leading-snug text-[var(--foreground)] md:text-xl">
              The space between lines is where the masterpiece actually begins.
            </p>
          </blockquote>
          <p
            className="mt-10 font-display text-2xl italic text-[var(--gold-deep)] md:text-3xl"
            style={{
              fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
            }}
          >
            — Kohinoor
          </p>
        </motion.div>
      </div>
    </section>
  );
}
