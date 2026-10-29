"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The credential ticker.
 *
 * A single strip of achievements that does in one line what a paragraph would
 * take six to do. It works because every item is a fact with a number attached,
 * so it reads as evidence rather than adjectives.
 *
 * The loop is built by repeating the list and translating the track by exactly
 * one copy's width, so the seam lands on an identical frame and is invisible.
 *
 * How many copies is measured, not assumed. The old version hard-coded two and
 * shifted -50%, which is only continuous while one copy is wider than the
 * screen. Split across two strips the shorter one had three items, one copy was
 * narrower than the viewport, and the band ran out mid-scroll and showed empty
 * page until the seam came round. It now renders as many copies as it takes to
 * overflow, remeasured on resize, so it is continuous at any list length and
 * any window width.
 *
 * Speed is held constant in pixels per second rather than in seconds per loop.
 * Tying the duration to the loop instead would make a four-item strip crawl and
 * a twelve-item strip sprint, which reads as two different components.
 */

/** Pixels per second. Slow enough to read a passing item, fast enough to move. */
const SPEED = 46;

/**
 * One copy of the list.
 *
 * Defined out here, not inside `Marquee`. Declared in the body it was a new
 * component type on every render, so React unmounted and remounted every `ul`,
 * which detached the measuring ref, which made `measure()` bail early, which
 * meant the copy count never updated on resize. The strip was correct at the
 * width it first rendered at and wrong at every other.
 */
function Row({ items, ariaHidden }: { items: readonly string[]; ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-0 [&>li]:flex [&>li]:items-center"
    >
      {items.map((item) => (
        <li key={item}>
          <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-body)] sm:text-[12px]">
            {item}
          </span>
          <span className="mx-6 text-[var(--accent)] sm:mx-8" aria-hidden>
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ items }: { items: readonly string[] }) {
  const reduced = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [duration, setDuration] = useState(20);

  const measure = useCallback(() => {
    const h = host.current;
    // The first rendered copy, read off the DOM rather than through a ref that
    // a remount can quietly detach.
    const c = track.current?.firstElementChild as HTMLElement | undefined;
    if (!h || !c) return;

    const copyWidth = c.scrollWidth;
    const width = h.clientWidth;
    if (!copyWidth || !width) return;

    // The track must stay covered after it has slid one whole copy left, so the
    // copies behind the seam have to fill the viewport on their own.
    setCopies(Math.max(2, Math.ceil(width / copyWidth) + 1));
    setDuration(copyWidth / SPEED);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (host.current) ro.observe(host.current);
    window.addEventListener("resize", measure);
    // Fonts land after first paint and change every width in the row.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, items]);

  return (
    <div
      ref={host}
      className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--bg-band)] py-4"
      role="region"
      aria-label="Highlights"
    >
      {/* Feathered edges so items enter and leave rather than getting chopped. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28"
        style={{ background: "linear-gradient(90deg, var(--bg-band), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28"
        style={{ background: "linear-gradient(270deg, var(--bg-band), transparent)" }}
        aria-hidden
      />

      {reduced ? (
        <div className="overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Row items={items} />
        </div>
      ) : (
        <div
          ref={track}
          className="marquee-track flex w-max hover:[animation-play-state:paused]"
          style={
            {
              // The shift is one copy of N, so the seam always lands on an
              // identical frame however many copies it took to fill the width.
              "--marquee-shift": `-${(100 / copies).toFixed(4)}%`,
              "--marquee-duration": `${duration.toFixed(2)}s`,
            } as React.CSSProperties
          }
        >
          {Array.from({ length: copies }, (_, i) => (
            // Only the first copy is the real list; the rest exist to fill the
            // band, and a screen reader should meet the facts once.
            <Row key={i} items={items} ariaHidden={i > 0} />
          ))}
        </div>
      )}
    </div>
  );
}
