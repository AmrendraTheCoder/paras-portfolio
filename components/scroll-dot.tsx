"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Scroll position indicator.
 *
 * The reference site floats a small ringed dot through the page. Here it is
 * pinned bottom-right and made to actually carry information: the ring is a
 * progress arc, so on a ~14,000px page you always know how much is left. A
 * decoration that answers a question costs the same as one that doesn't.
 *
 * Hidden until you have committed to scrolling, and it returns you to the top
 * on click.
 */
export function ScrollDot() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
      }
      aria-label="Back to top"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ opacity: scrollYProgress }}
      className="fixed bottom-6 right-6 z-30 hidden h-12 w-12 place-items-center rounded-full
                 border border-[var(--line)] bg-[color-mix(in_oklab,var(--bg)_86%,transparent)]
                 backdrop-blur-xl transition-colors duration-[var(--duration-micro)]
                 hover:border-[var(--accent)] sm:grid"
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <motion.circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          style={{ pathLength: progress }}
        />
      </svg>
      <span className="h-[7px] w-[7px] rounded-full bg-[var(--accent)]" aria-hidden />
    </motion.button>
  );
}
