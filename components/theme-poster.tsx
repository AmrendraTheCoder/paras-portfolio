"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Theme } from "@/lib/content";

/**
 * Four small posters, one per event theme, painted in CSS and SVG from the
 * three colours each theme owns. They stand in for a showreel until there is
 * one: not the films themselves, but the worlds the films were cut for.
 */
function Art({ theme }: { theme: Theme }) {
  const [a, b, c] = theme.palette;

  if (theme.look === "melange") {
    return (
      <div
        aria-hidden
        className="absolute inset-0 motion-safe:animate-[drift_18s_linear_infinite_alternate]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, ${a} 0, transparent 38%), radial-gradient(circle at 75% 70%, ${b} 0, transparent 42%), radial-gradient(circle at 60% 20%, ${c} 0, transparent 30%), repeating-conic-gradient(from 0deg at 50% 50%, ${a}22 0 6deg, transparent 6deg 12deg)`,
          backgroundSize: "200% 200%, 100% 100%",
        }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-70">
          {[18, 30, 42].map((r) => (
            <circle key={r} cx="50" cy="55" r={r} fill="none" stroke={c} strokeWidth="0.6" strokeDasharray="2 3" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d="M50 55 C 56 40, 66 40, 62 55 C 60 62, 54 64, 50 55 Z"
              fill={i % 2 ? a : b}
              opacity="0.9"
              transform={`rotate(${i * 30} 50 55)`}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (theme.look === "pixel") {
    return (
      <div aria-hidden className="absolute inset-0" style={{ background: "#07070a" }}>
        <div
          className="absolute inset-0 opacity-40 motion-safe:animate-[shimmer_6s_linear_infinite]"
          style={{
            backgroundImage: `linear-gradient(${a}33 1px, transparent 1px), linear-gradient(90deg, ${a}33 1px, transparent 1px)`,
            backgroundSize: "12px 12px",
          }}
        />
        <svg viewBox="0 0 16 20" className="absolute inset-0 h-full w-full" shapeRendering="crispEdges" style={{ imageRendering: "pixelated" }}>
          {[
            [3, 4, a], [4, 4, a], [11, 4, a], [12, 4, a],
            [2, 5, a], [5, 5, a], [10, 5, a], [13, 5, a],
            [6, 8, b], [7, 8, b], [8, 8, b], [9, 8, b],
            [5, 9, b], [10, 9, b], [4, 10, b], [11, 10, b],
            [4, 12, c], [5, 13, c], [6, 14, c], [7, 14, c], [8, 14, c], [9, 14, c], [10, 13, c], [11, 12, c],
            [2, 16, a], [3, 16, b], [4, 16, c], [11, 16, c], [12, 16, b], [13, 16, a],
          ].map(([x, y, fill], i) => (
            <rect key={i} x={x} y={y} width="1" height="1" fill={fill as string} />
          ))}
        </svg>
      </div>
    );
  }

  if (theme.look === "vector") {
    return (
      <div aria-hidden className="absolute inset-0" style={{ background: "#0b0b0c" }}>
        <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full">
          <circle cx="62" cy="40" r="26" fill="none" stroke={a} strokeWidth="1.2" />
          <circle cx="62" cy="40" r="26" fill={a} opacity="0.12" />
          <polygon points="12,110 48,46 84,110" fill="none" stroke={c} strokeWidth="1.2" />
          <polygon points="12,110 48,46 84,110" fill={b} opacity="0.85" />
          <line x1="0" y1="86" x2="100" y2="22" stroke={a} strokeWidth="1" />
          <line x1="0" y1="96" x2="100" y2="32" stroke={a} strokeWidth="1" opacity="0.5" />
          <rect x="70" y="92" width="18" height="18" fill={a} />
        </svg>
      </div>
    );
  }

  return (
    <div aria-hidden className="absolute inset-0" style={{ background: "#050507" }}>
      <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#glow)" fill="none" strokeWidth="1.4" strokeLinecap="round">
          <path d="M14 96 C 30 60, 50 60, 50 30 S 70 10, 86 30" stroke={a} />
          <path d="M10 70 Q 50 110 90 70" stroke={b} />
          <path d="M22 22 l 14 0 M22 22 l 0 14" stroke={c} />
          <path d="M78 104 l -14 0 M78 104 l 0 -14" stroke={c} />
          <circle cx="50" cy="64" r="9" stroke={a} />
        </g>
      </svg>
    </div>
  );
}

export function ThemePoster({ theme, index }: { theme: Theme; index: number }) {
  const reduced = useReducedMotion();
  const label = { done: "Shipped", live: "Live", soon: "Coming soon" }[theme.status];

  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 24, rotate: index % 2 ? 1.5 : -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={reduced ? undefined : { y: -8, rotate: index % 2 ? -1 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 + index * 0.08 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-black shadow-[var(--shadow-tile)]"
      style={{ "--tint": theme.palette[0] } as React.CSSProperties}
    >
      <Art theme={theme} />
      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur">
        {label}
      </span>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-10 text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">{theme.event}</p>
        <p className="mt-1 font-display text-[1.15rem] font-bold leading-[1.1] tracking-[-0.02em]">{theme.name}</p>
        <p className="mt-1.5 max-h-0 overflow-hidden text-[12.5px] leading-[1.4] text-white/80 opacity-0 transition-all duration-[var(--duration-base)] group-hover:max-h-12 group-hover:opacity-100">
          {theme.line}
        </p>
      </figcaption>
    </motion.figure>
  );
}
