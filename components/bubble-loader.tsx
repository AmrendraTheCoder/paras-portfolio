"use client";

import { useEffect, useRef } from "react";
import { themes } from "@/lib/content";

/**
 * Themed bubbles behind the sign-in screen.
 *
 * Inspired by metaball bubble sketches, kept to a light 2D canvas: translucent
 * circles in the four event worlds' colours rise and drift, blended additively
 * so where they overlap the colour pools and glows like liquid light. Capped
 * count, device-pixel aware, paused when the tab is hidden, and a single still
 * frame under reduced motion. Purely decorative, so it is aria-hidden.
 */
type Bubble = { x: number; y: number; r: number; vx: number; vy: number; color: string; a: number };

export function BubbleLoader() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = themes.flatMap((t) => t.palette);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let bubbles: Bubble[] = [];

    const seed = () => {
      const count = Math.min(22, Math.max(10, Math.round((w * h) / 90000)));
      bubbles = Array.from({ length: count }, () => {
        const r = 40 + Math.random() * Math.min(w, h) * 0.22;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(0.12 + Math.random() * 0.4),
          color: colors[Math.floor(Math.random() * colors.length)],
          a: 0.18 + Math.random() * 0.22,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of bubbles) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, hexA(b.color, b.a));
        g.addColorStop(0.6, hexA(b.color, b.a * 0.4));
        g.addColorStop(1, hexA(b.color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const step = () => {
      for (const b of bubbles) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.y + b.r < 0) {
          b.y = h + b.r;
          b.x = Math.random() * w;
        }
        if (b.x + b.r < 0) b.x = w + b.r;
        if (b.x - b.r > w) b.x = -b.r;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    let raf = 0;
    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf), (raf = 0);
      } else if (!reduced && !raf) {
        raf = requestAnimationFrame(step);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    if (reduced) draw();
    else raf = requestAnimationFrame(step);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

/** "#rrggbb" + alpha 0..1 -> "rgba()". */
function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}
