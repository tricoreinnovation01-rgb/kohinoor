"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutIntro({
  heroTitle,
  heroItalicWord,
  bioP1,
  bioP2,
  portraitImageUrl,
  quote,
  quoteLabel,
}: {
  heroTitle: string;
  heroItalicWord: string;
  bioP1: string;
  bioP2: string;
  portraitImageUrl: string;
  quote: string;
  quoteLabel: string;
}) {
  const parts = heroTitle.split(new RegExp(`\\b${heroItalicWord}\\b`, "i"));
  return (
    <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.05]">
          {parts[0]}
          <em className="not-italic italic text-[var(--gold-deep)]">
            {heroItalicWord}
          </em>
          {parts[1] ?? ""}
        </h1>
        <p className="mt-10 text-sm font-light leading-relaxed text-[var(--secondary)] md:text-base">
          {bioP1}
        </p>
        <p className="mt-6 text-sm font-light leading-relaxed text-[var(--secondary)] md:text-base">
          {bioP2}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
        className="relative mx-auto w-full max-w-md justify-self-end lg:max-w-none"
      >
        <div className="relative aspect-[3/5] overflow-hidden border border-[var(--border)]">
          <Image
            src={portraitImageUrl}
            alt="Portrait"
            fill
            className="object-cover grayscale"
            sizes="(max-width:1024px) 90vw, 40vw"
            priority
          />
        </div>
        <div className="relative -mt-16 ml-auto max-w-[280px] border border-[var(--border)] bg-[var(--surface-card)] p-6 md:-mt-24 md:mr-[-2rem] lg:max-w-xs">
          <p className="font-display text-lg font-light italic leading-snug text-[var(--foreground)] md:text-xl">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="label-caps mt-4 text-[var(--gold-deep)]">{quoteLabel}</p>
        </div>
      </motion.div>
    </div>
  );
}
