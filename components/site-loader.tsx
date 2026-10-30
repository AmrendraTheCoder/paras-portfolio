"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile, themes } from "@/lib/content";

/**
 * The intro: a short motion-graphics loading screen that plays on load, counts
 * up, assembles the name, then wipes away to reveal the site. Moving elements
 * (drifting colour fields and kinetic shapes in the four worlds' colours) do
 * the work, so it reads as a motion designer's own title card. Plays in full on
 * the first load of a session and briefly on later loads; a single still frame
 * under reduced motion. Locks scroll while it is up.
 */
export function SiteLoader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let already = false;
    try {
      already = sessionStorage.getItem("pg_intro") === "1";
    } catch {}
    const dur = reduced ? 450 : already ? 700 : 2100;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      // ease-out so the count decelerates into 100
      const eased = 1 - Math.pow(1 - t, 2);
      setPct(Math.round(eased * 100));
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        try {
          sessionStorage.setItem("pg_intro", "1");
        } catch {}
        window.setTimeout(() => setDone(true), reduced ? 120 : 420);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, [reduced]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  const colors = themes.map((t) => t.palette[0]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[var(--bg)]"
          initial={{ opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduced ? 0.3 : 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Drifting colour fields */}
          {!reduced ? (
            <>
              {themes.map((t, i) => (
                <motion.span
                  key={t.slug}
                  aria-hidden
                  className="pointer-events-none absolute rounded-full"
                  style={{
                    width: "46vw",
                    height: "46vw",
                    background: `radial-gradient(closest-side, ${t.palette[0]}, transparent)`,
                    opacity: 0.22,
                    filter: "blur(60px)",
                    top: ["-8%", "40%", "55%", "10%"][i],
                    left: ["-6%", "58%", "8%", "62%"][i],
                  }}
                  animate={{ x: [0, 30, -20, 0], y: [0, -20, 25, 0] }}
                  transition={{ duration: 8 + i * 2, ease: "easeInOut", repeat: Infinity }}
                />
              ))}

              {/* Kinetic shapes */}
              <motion.svg
                aria-hidden
                viewBox="0 0 200 200"
                className="pointer-events-none absolute h-[min(64vw,420px)] w-[min(64vw,420px)] opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, ease: "linear", repeat: Infinity }}
              >
                <motion.circle cx="100" cy="100" r="78" fill="none" stroke={colors[2]} strokeWidth="1" strokeDasharray="4 8" />
                <motion.rect
                  x="62" y="62" width="76" height="76" fill="none" stroke={colors[1]} strokeWidth="1.5"
                  animate={{ rotate: [0, 90, 0] }} transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                  style={{ transformOrigin: "100px 100px" }}
                />
                <motion.polygon
                  points="100,40 152,140 48,140" fill="none" stroke={colors[0]} strokeWidth="1.5"
                  animate={{ rotate: [0, -120, 0] }} transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
                  style={{ transformOrigin: "100px 100px" }}
                />
              </motion.svg>
            </>
          ) : null}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[var(--fg-muted)]">
              PARAS·CUT — loading sequence
            </p>
            <h2
              className="mt-4 font-display text-[clamp(2.4rem,9vw,6.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-[var(--fg)]"
              style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
            >
              {profile.first} {profile.last}
            </h2>
            <div className="mt-8 flex w-[min(78vw,420px)] items-center gap-4">
              <span className="relative h-px flex-1 overflow-hidden bg-[var(--line-strong)]">
                <span ref={barRef} className="absolute inset-0 origin-left bg-[var(--accent)]" style={{ transform: "scaleX(0)" }} />
              </span>
              <span className="w-12 text-right font-mono text-[13px] tabular-nums text-[var(--fg)]">{String(pct).padStart(3, "0")}</span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
