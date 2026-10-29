"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { profile, themes } from "@/lib/content";

/**
 * The monument.
 *
 * "PARAS GUPTA" fills the screen, and his four event worlds live inside the
 * letters: a moving colour field — built from each theme's own three colours —
 * shows through the type via background-clip, cycling melange → pixel → vector
 * → neon. A pointer-tracked highlight makes the field feel lit from where the
 * cursor is, and the whole monument eases down a few percent as the first
 * screen leaves, so it reads as heavy. The name is the window into the work.
 *
 * Reduced motion gets the first world as a still fill, no cycle, no parallax.
 */
export function HeroMonument() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const nameRef = useRef<HTMLHeadingElement>(null);

  // Cycle the world the letters are filled with.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % themes.length), 3600);
    return () => window.clearInterval(id);
  }, [reduced]);

  // Pointer-tracked highlight, written straight to CSS vars at frame rate.
  useEffect(() => {
    if (reduced) return;
    const el = nameRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Monument eases down slightly as the hero scrolls away.
  const { scrollYProgress } = useScroll();
  const raw = useTransform(scrollYProgress, [0, 0.14], [1, 0.93]);
  const scale = useSpring(raw, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const t = themes[i];
  const fieldVars = {
    "--c1": t.palette[0],
    "--c2": t.palette[1],
    "--c3": t.palette[2],
    "--c-hi": t.palette[0],
  } as React.CSSProperties;

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* A very faint wash of the current world behind everything, so the dark
          ground breathes with the name instead of sitting flat black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] transition-[background] duration-1000 motion-safe:animate-[drift_26s_linear_infinite_alternate]"
        style={{
          backgroundImage: `radial-gradient(60vw 50vw at 75% 18%, ${t.palette[0]}, transparent 60%), radial-gradient(55vw 45vw at 15% 90%, ${t.palette[2]}, transparent 60%)`,
          backgroundSize: "160% 160%",
        }}
      />

      {/* Top row: who, and which world is showing. */}
      <div className="shell relative z-10 flex items-center justify-between gap-4 pt-24 sm:pt-28">
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-[var(--accent)]" aria-hidden />
          {profile.role}
        </p>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)] sm:inline">
            Now showing
          </span>
          <span
            key={t.slug}
            className="font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-700"
            style={{ color: t.palette[0] }}
          >
            {t.name}
          </span>
          <span className="flex gap-1.5" aria-hidden>
            {themes.map((th, n) => (
              <span
                key={th.slug}
                className="h-1.5 w-1.5 rounded-full transition-all duration-500"
                style={{ background: n === i ? th.palette[0] : "var(--line-strong)", transform: n === i ? "scale(1.4)" : "scale(1)" }}
              />
            ))}
          </span>
        </div>
      </div>

      {/* The monument. Two stacked words, filled with the living world. */}
      <div className="relative z-10 flex flex-1 items-center">
        <motion.h1
          ref={nameRef}
          style={{ ...fieldVars, scale: reduced ? undefined : scale }}
          className="hero-monument w-full select-none px-[clamp(16px,4vw,48px)] font-display font-bold uppercase leading-[0.82] tracking-[-0.045em]"
        >
          <span className="block text-[clamp(4.5rem,23vw,22rem)]">{profile.first}</span>
          <span className="block text-[clamp(4.5rem,23vw,22rem)]">{profile.last}</span>
        </motion.h1>
      </div>

      {/* Bottom row: one line of positioning, one action. */}
      <div className="shell relative z-10 flex flex-col gap-4 pb-10 sm:flex-row sm:items-end sm:justify-between sm:pb-12">
        <p className="max-w-[42ch] text-[clamp(1rem,1.5vw,1.2rem)] leading-[1.4] text-[var(--fg)]">
          Motion design, photography and graphic design for fests, hackathons and clients. Creative Head of VIVACITY and LNMHACKS 9.0.
        </p>
        <a
          href="#work"
          className="group inline-flex w-fit items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--bg-tile)] px-5 py-3 text-[14px] font-medium text-[var(--fg)] transition-colors duration-[var(--duration-base)] hover:border-[var(--accent)]"
        >
          See the work
          <span aria-hidden className="transition-transform duration-[var(--duration-base)] group-hover:translate-y-0.5">↓</span>
        </a>
      </div>
    </section>
  );
}
