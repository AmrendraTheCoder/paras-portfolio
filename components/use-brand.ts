"use client";

import { useEffect, useState } from "react";

/**
 * Picks the theme-appropriate brand colour for any mark that carries one.
 *
 * Several official marks are pure black (GitHub, Vercel, Notion, Three.js) and
 * disappear on the dark canvas, so every branded item ships a `brandDark`
 * alongside its `brand`. Watching the root `class` rather than reading a media
 * query keeps this in step with the manual theme toggle.
 */
export function useBrand(brand: string, brandDark: string) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const read = () => setDark(document.documentElement.classList.contains("dark"));
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return dark ? brandDark : brand;
}
