"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * One slot in a sentence that keeps changing its mind. The slot is sized to
 * the longest word so the line never reflows; under reduced motion it simply
 * shows the first word and stays put.
 */
export function RotatingWord({ words, interval = 2200 }: { words: readonly string[]; interval?: number }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduced, words.length, interval]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-grid overflow-hidden align-bottom" aria-live="polite">
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {longest}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={reduced ? false : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap text-[var(--accent)]"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
