"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll, the LNMHACKS feel.
 *
 * Lenis intercepts the wheel and interpolates scrollTop toward the target, so
 * the page glides and settles instead of jumping. It drives its own
 * requestAnimationFrame loop (there is no WebGL loop to ride here), dispatches
 * native scroll events so every existing scroll-reveal and the progress dot
 * keep working, and honours in-page anchor clicks.
 *
 * Switched off entirely under prefers-reduced-motion: the native scroll is
 * returned untouched, which is both the accessible choice and the correct one
 * for anyone who finds momentum scrolling disorienting.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Anchor links (the nav, "back to top") handed to Lenis so they ease
    // rather than snap, and so the URL hash still updates.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80 });
      history.pushState(null, "", id);
    };
    document.addEventListener("click", onClick);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
