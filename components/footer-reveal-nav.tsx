"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { themes } from "@/lib/content";
import { ThemeArt } from "@/components/theme-poster";

/**
 * The footer index, with a codrops-style image reveal.
 *
 * The main destinations are set large; on a fine pointer, hovering one reveals
 * a panel that follows the cursor and wipes in with a mask, showing that
 * destination's world (the hero's generative art, so it reads right before any
 * real photographs exist). Touch and reduced motion get a plain list with none
 * of the follow or reveal.
 */
const NAV = [
  { label: "Work", href: "#work", theme: 2 },
  { label: "Motion", href: "#motion", theme: 3 },
  { label: "Photography", href: "#photography", theme: 1 },
  { label: "Leadership", href: "#leadership", theme: 0 },
  { label: "Experience", href: "#experience", theme: 3 },
  { label: "Contact", href: "#contact", theme: 2 },
];

export function FooterRevealNav() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const read = () => setCanHover(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  const show = canHover && !reduced;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 350, damping: 30, mass: 0.5 });
  const y = useSpring(my, { stiffness: 350, damping: 30, mass: 0.5 });

  const onMove = (e: React.PointerEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const theme = active !== null ? themes[NAV[active].theme] : null;

  return (
    <div ref={wrap} className="relative" onPointerMove={show ? onMove : undefined}>
      <ul className="relative z-10 -my-1">
        {NAV.map((n, i) => (
          <li key={n.label} className="border-b border-[var(--line)] first:border-t">
            <Link
              href={n.href}
              onPointerEnter={() => show && setActive(i)}
              onPointerLeave={() => show && setActive(null)}
              style={{ ["--tint" as string]: themes[n.theme].palette[0] }}
              className="group flex items-center justify-between gap-6 py-4 sm:py-5"
            >
              <span className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-[var(--fg-muted)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-[var(--fg)] transition-all duration-[var(--duration-base)] group-hover:text-[var(--tint)] sm:group-hover:translate-x-3">
                  {n.label}
                </span>
              </span>
              <span
                aria-hidden
                className="font-display text-[clamp(1.4rem,3vw,2.2rem)] text-[var(--fg-muted)] transition-all duration-[var(--duration-base)] group-hover:text-[var(--tint)] group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {show ? (
        <AnimatePresence>
          {active !== null && theme ? (
            <motion.div style={{ x, y }} className="pointer-events-none absolute left-0 top-0 z-0">
              <div className="-translate-x-1/2 -translate-y-1/2">
                <motion.figure
                  initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0.6 }}
                  animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
                  exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0.6 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-[clamp(220px,26vw,340px)] w-[clamp(170px,20vw,272px)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] shadow-[var(--shadow-lift)]"
                >
                  <ThemeArt theme={theme} />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">{theme.event}</span>
                    <span className="block font-display text-[15px] font-bold text-white">{theme.name}</span>
                  </figcaption>
                </motion.figure>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : null}
    </div>
  );
}
