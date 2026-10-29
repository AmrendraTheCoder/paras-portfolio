"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroMonument } from "@/components/hero-monument";
import { Marquee } from "@/components/marquee";
import { ThemePoster } from "@/components/theme-poster";
import { profile, themes, ticker } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The hero leads with the monument — the name filled with the four event
 * worlds — then a ticker of the work so far, the bio, and the worlds shown
 * once more as posters: the name was the window, these are the rooms.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const up = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    whileInView: reduced ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12% 0px" },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <>
      <HeroMonument />

      <Marquee items={ticker} />

      <section className="shell !max-w-[1400px] py-16 sm:py-24">
        <motion.div {...up(0)} className="grid gap-8 lg:grid-cols-12">
          <p className="font-display text-[clamp(1.3rem,2.3vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--fg)] lg:col-span-6">
            {profile.bio[0]}
          </p>
          <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--fg-muted)] lg:col-span-5 lg:col-start-8">
            <p>{profile.bio[1]}</p>
            <p>{profile.bio[2]}</p>
          </div>
        </motion.div>

        <motion.div {...up(0.1)} className="mt-16 sm:mt-20">
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--accent)]" aria-hidden />
            The worlds I build in
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {themes.map((t, i) => (
              <ThemePoster key={t.slug} theme={t} index={i} />
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
