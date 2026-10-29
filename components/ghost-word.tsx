"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { smoothDamp, type Damped } from "@/lib/smooth-damp";

/**
 * The sectional watermark, lit from inside its own letterforms.
 *
 * Every band carries one enormous, almost-invisible word behind it. It gives a
 * long scroll a sense of chapters without adding furniture, and it is why the
 * page reads as composed rather than stacked.
 *
 * The word used to be inert: a flat 6% fill that you registered once and never
 * looked at again. Now the pointer is a light source and the letters are the
 * only place its light lands. A soft coral pool tracks the cursor, and
 * `background-clip: text` clips it to the glyphs, so the light exists solely
 * inside the letters. Move the mouse across a band and the name warms where you
 * are and cools behind you.
 *
 * Why this and not a cursor follower: a shape chasing the pointer is a layer on
 * top of the page competing with the content. This puts the same playfulness
 * *into* the typography, so nothing overlaps anything, there is nothing to
 * collide with a link, and the effect costs one repaint of an element that was
 * already on screen.
 *
 * Set in the sans rather than the display serif, and larger. The serif at 6%
 * read as a printer's watermark, which was the point when it was static; a
 * light moving through it wants the plainer, heavier letterforms because they
 * hold a bigger interior to be lit.
 *
 * Two damped scalars per frame, and only when the pointer is over the section.
 * Reduced motion gets the flat fill and no listener at all.
 */
export function GhostWord({
  children,
  align = "right",
  className = "",
}: {
  children: string;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  /**
   * Size the word to its section, by measuring it.
   *
   * `clamp(140px, 26vw, 380px)` cannot know how many letters it is sizing, so
   * "Writing" sat comfortably while "AMRENDRA" and "Experience" ran off both
   * edges and were sliced by the section's `overflow-hidden`. A guess that is
   * right for one word is wrong for the rest.
   *
   * So: render at a known size, measure the actual advance width, and scale to
   * the fraction of the section we want it to span. Every word then lands at
   * the same optical width regardless of length, which is what makes a set of
   * watermarks look like a system rather than a series of accidents.
   */
  useEffect(() => {
    const host = ref.current;
    const el = word.current;
    if (!host || !el) return;

    const REFERENCE = 200;
    const fit = () => {
      const box = host.parentElement ?? host;
      const available = box.clientWidth;
      if (!available) return;

      el.style.fontSize = `${REFERENCE}px`;
      const natural = el.scrollWidth;
      if (!natural) return;

      // 92% of the section. Short of the edges on purpose: a watermark that
      // touches both gutters reads as a mistake, and one that bleeds off them
      // reads as clipping, which is the complaint this is fixing.
      const target = (available * 0.92 * REFERENCE) / natural;
      el.style.fontSize = `${Math.max(96, Math.min(target, 460)).toFixed(1)}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host.parentElement ?? host);
    // Fonts land after first paint, and the measurement is meaningless until
    // the real face is in use.
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [children]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // A shallow parallax. Enough to feel like it sits behind the page, not enough
  // to read as movement.
  // Halved, and the wrapper below carries headroom to absorb it. At 12% of a
  // 400px line the word travelled ~48px, which at `top-0` walked the capitals
  // straight back out of the top of the section.
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  useEffect(() => {
    if (reduced) return;
    const host = ref.current;
    const el = word.current;
    if (!host || !el) return;

    // Damped, not assigned straight from the event: the raw pointer position
    // makes the light snap between frames on a fast flick. Same reasoning as
    // the pointer mark, same helper.
    const x: Damped = { value: 50, velocity: 0 };
    const yy: Damped = { value: 50, velocity: 0 };
    const glow = { value: 0, velocity: 0 } as Damped;

    let targetX = 50;
    let targetY = 50;
    let targetGlow = 0;
    let raf = 0;
    let last = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width) * 100;
      targetY = ((e.clientY - r.top) / r.height) * 100;
      targetGlow = 1;
    };
    const onLeave = () => {
      targetGlow = 0;
    };

    const tick = (now: number) => {
      // Capped, so a backgrounded tab does not resume with one enormous step.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      smoothDamp(x, targetX, 0.12, 400, dt);
      smoothDamp(yy, targetY, 0.12, 400, dt);
      smoothDamp(glow, targetGlow, 0.22, 8, dt);

      el.style.setProperty("--lx", `${x.value.toFixed(2)}%`);
      el.style.setProperty("--ly", `${yy.value.toFixed(2)}%`);
      el.style.setProperty("--lit", glow.value.toFixed(3));
      raf = requestAnimationFrame(tick);
    };

    // The section is the surface, not the word: the letters are sparse and a
    // listener on the glyphs themselves would drop the light between strokes.
    const section = host.parentElement ?? host;
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Inset on every alignment now. The old -6% pulled the word past the section
  // edge so the first or last letter was permanently half-cut.
  const place =
    align === "left"
      ? "-left-[10%] justify-start"
      : align === "center"
        ? "inset-x-0 justify-center"
        : "right-0 justify-end";

  return (
    <div
      ref={ref}
      aria-hidden
      /* Pinned near the top rather than vertically centred: these sections run
         2,000px+, and a centred watermark sits below the fold for the whole
         time the section header is on screen, which is exactly when it should
         be doing its work.

         Flush to the section's top edge, and no further. A few tens of pixels
         of overlap behind faint type is the intent; a decapitated word is the
         bug. */
      /* pt is headroom for the parallax and for the ascenders. Without it the
         word sits flush against the section's own clip and any upward drift
         shaves the tops off the capitals. */
      className={`pointer-events-none absolute top-0 flex h-full select-none items-start
                  overflow-hidden pt-[3.5rem] ${place} ${className}`}
    >
      <motion.span
        ref={word}
        style={reduced ? undefined : { y }}
        /* leading-[1.06], not the old 0.78. A line box shorter than the glyphs
           lets ascenders and descenders spill outside it, and the section's
           own `overflow-hidden` then cuts the tops off the capitals and the
           tails off the descenders. The font size comes from the effect above,
           so there is no size class here. */
        className="ghost-word block whitespace-nowrap px-[4%] font-sans font-semibold
                   leading-[1.06] tracking-[-0.055em]"
      >
        {children}
      </motion.span>
    </div>
  );
}
