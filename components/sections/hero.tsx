"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroEditor } from "@/components/hero-editor";
import { Marquee } from "@/components/marquee";
import { profile, ticker } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The hero is an original editing-suite interface (PARAS·CUT) that plays the
 * worlds and reveals the name as a title layer, followed by the ticker and the
 * bio. The four worlds are surfaced inside the editor, so they are not repeated
 * as a separate strip here.
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
      <HeroEditor />
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
      </section>
    </>
  );
}
