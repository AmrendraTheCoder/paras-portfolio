"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/lib/content";

const LINKS = [
  // Same order as the page. A nav that lists sections in a different order than
  // the scroll does is a nav that lies about where you are.
  { label: "Work", href: "#work" },
  { label: "Photography", href: "#photography" },
  { label: "Leadership", href: "#leadership" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/**
 * A ~7,000px page with no navigation is a page people leave. The bar stays out
 * of the hero (nothing should compete with it) and slides in once the hero is
 * behind you, tracking the section you're in.
 */
export function Nav() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  // The bar also renders on each case study, where none of these sections
  // exist. A bare "#work" there scrolls to nothing, so off the home
  // page every hash is rewritten to "/#work" and the browser navigates home
  // first.
  const onHome = pathname === "/";
  const hrefFor = (href: string) =>
    href.startsWith("#") && !onHome ? `/${href}` : href;
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    // There is no hero to clear on a case-study page, so the bar is there from the
    // top rather than after most of a screen of scrolling.
    if (!onHome) {
      setShown(true);
      return;
    }
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  // Section spy. rootMargin pins the trigger line to the upper third.
  useEffect(() => {
    // Hash links only. Writing points at /blog, which is a route rather than a
    // section, and passing it to querySelector throws: "/blog" is not a valid
    // selector, and one throw here kills the observer for every other link.
    const sections = LINKS.filter((l) => l.href.startsWith("#"))
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
        if (hit?.target.id) setActive(`#${hit.target.id}`);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <motion.header
      initial={false}
      animate={
        reduced
          ? undefined
          : { y: shown ? 0 : -84, opacity: shown ? 1 : 0 }
      }
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
      style={reduced ? { display: shown ? "block" : "none" } : undefined}
    >
      <div className="shell pt-4">
        <nav
          aria-label="Sections"
          className="flex items-center justify-between gap-4 rounded-full border border-[var(--line)]
                     bg-[color-mix(in_oklab,var(--bg)_86%,transparent)] py-2 pl-5 pr-2
                     shadow-[var(--shadow-tile)] backdrop-blur-xl"
        >
          <a
            href={hrefFor("#main")}
            className="shrink-0 text-[14px] font-medium tracking-[-0.01em] text-[var(--fg)]"
          >
            {profile.initials}
          </a>

          {/* Tighter below lg. At 768px the bar's contents measured 20px wider
              than the bar with six links, clipping the theme toggle, and the
              seventh made it 82. px-2 here leaves about 14px spare at 768.
              Desktop spacing is unchanged. */}
          <ul className="hidden items-center gap-0.5 md:flex lg:gap-1">
            {LINKS.map((link) => {
              const isActive = onHome
                ? active === link.href
                : pathname.startsWith(link.href) && link.href !== "/";
              return (
                <li key={link.href}>
                  <a
                    href={hrefFor(link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-2 py-1.5 text-[14px] lg:px-3.5
                                transition-colors duration-[var(--duration-micro)]
                                ${
                                  /* --fg-body, not --fg-muted: muted grey on the
                                     translucent nav measured under 4.5:1. */
                                  isActive
                                    ? "text-[var(--fg)]"
                                    : "text-[var(--fg-body)] hover:text-[var(--fg)]"
                                }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-[var(--bg-tile-hover)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle compact />
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
