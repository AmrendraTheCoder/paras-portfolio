"use client";

import { motion, useReducedMotion } from "motion/react";
import { Showreel } from "@/components/media/showreel";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile, showreel } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The hero is the showreel. Everything else in it is a caption: the name, the
 * one-line positioning, and the city. The name arrives as an ink wipe and the
 * video frame fades up behind it; nothing else moves, because the reel is the
 * motion.
 */
export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="hero" className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="shell relative !max-w-[1400px]">
        <div className="absolute right-[clamp(20px,5vw,48px)] top-0 z-20">
          <ThemeToggle compact />
        </div>

        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <motion.h1
            initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", filter: "blur(10px)", y: 8 }}
            animate={reduced ? undefined : { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
            className="font-display text-[clamp(3.6rem,12vw,9.5rem)] uppercase italic leading-[0.86] tracking-[-0.04em] text-[var(--fg)]"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
            className="sm:max-w-[34ch] sm:pb-3 sm:text-right"
          >
            <p className="text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.35] text-[var(--fg)]">
              {profile.tagline}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
              {profile.location}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        >
          <Showreel video={showreel} title={`${profile.name} showreel`} />
        </motion.div>

        {/* The supplied bio, as the only paragraph text above the work. The
            first paragraph is the voice; the next two are the facts. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
          className="mt-14 grid gap-8 sm:mt-20 lg:grid-cols-12"
        >
          <p className="font-display text-[clamp(1.35rem,2.3vw,1.9rem)] leading-[1.3] tracking-[-0.015em] text-[var(--fg)] lg:col-span-6">
            {profile.bio[0]}
          </p>
          <div className="space-y-5 text-[16px] leading-[1.65] text-[var(--fg-muted)] lg:col-span-5 lg:col-start-8">
            <p>{profile.bio[1]}</p>
            <p>{profile.bio[2]}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
