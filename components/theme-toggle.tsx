"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

const KEY = "paras-theme";

export function ThemeToggle({ compact = false }: { compact?: boolean } = {}) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* private mode, the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={`grid place-items-center rounded-full text-[var(--fg-muted)]
                  transition-colors duration-[var(--duration-micro)]
                  hover:bg-[var(--bg-tile-hover)] hover:text-[var(--fg)]
                  ${compact ? "h-11 w-11 sm:h-9 sm:w-9" : "tile h-11 w-11"}`}
    >
      {/* Rendered only after mount so SSR and client agree on the glyph. */}
      {mounted ? dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" /> : <span className="h-5 w-5" />}
    </button>
  );
}
