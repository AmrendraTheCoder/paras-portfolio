"use client";

import { motion, useReducedMotion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RotatingWord } from "@/components/rotating-word";
import { ThemePoster } from "@/components/theme-poster";
import { Marquee } from "@/components/marquee";
import { heroLine, profile, themes, ticker } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * No showreel yet, so the hero is the name, a sentence that keeps changing its
 * last word, and four posters painted from the four event themes. The posters
 * are the reel for now: the worlds the films were cut for.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const up = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: reduced ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section id="hero" className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="shell relative !max-w-[1400px]">
        <div className="absolute right-[clamp(20px,5vw,48px)] top-0 z-20">
          <ThemeToggle compact />
        </div>

        <motion.p {...up(0)} className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--accent)]" aria-hidden />
          {profile.role}
        </motion.p>

        <h1 className="font-display font-bold uppercase leading-[0.84] tracking-[-0.045em]">
          <motion.span
            initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", y: 10 }}
            animate={reduced ? undefined : { clipPath: "inset(0 0% 0 0)", y: 0 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
            className="block text-[clamp(4rem,14.5vw,12.5rem)] text-[var(--fg)]"
          >
            {profile.first}
          </motion.span>
          <motion.span
            initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", y: 10 }}
            animate={reduced ? undefined : { clipPath: "inset(0 0% 0 0)", y: 0 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.3 }}
            className="text-outline block text-[clamp(4rem,14.5vw,12.5rem)]"
          >
            {profile.last}
          </motion.span>
        </h1>

        <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-12 lg:items-end">
          <motion.p
            {...up(0.55)}
            className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.025em] text-[var(--fg)] lg:col-span-7"
          >
            {heroLine.before} <RotatingWord words={heroLine.words} /> {heroLine.after}
          </motion.p>
          <motion.p {...up(0.7)} className="max-w-[40ch] text-[16px] leading-[1.6] text-[var(--fg-muted)] lg:col-span-4 lg:col-start-9">
            Motion design, photography and graphic design for fests, hackathons and clients. Currently Creative Head of VIVACITY and LNMHACKS 9.0.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
          {themes.map((t, i) => (
            <ThemePoster key={t.slug} theme={t} index={i} />
          ))}
        </div>
      </div>

      <motion.div {...up(0.9)} className="mt-14 sm:mt-16">
        <Marquee items={ticker} />
      </motion.div>

      <div className="shell !max-w-[1400px]">
        <motion.div {...up(1.0)} className="grid gap-8 py-16 sm:py-20 lg:grid-cols-12">
          <p className="font-display text-[clamp(1.3rem,2.2vw,1.8rem)] font-medium leading-[1.3] tracking-[-0.015em] text-[var(--fg)] lg:col-span-6">
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
