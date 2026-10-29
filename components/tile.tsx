"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";

/** Plain bento tile. Static content, no pointer response beyond the hairline. */
export function Tile({
  children,
  className = "",
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  return <As className={`tile p-5 ${className}`}>{children}</As>;
}

/**
 * The signature interaction, lifted from the live site's "Visit" tile: on hover
 * the tile lifts off the page, tips toward the cursor and floods with accent.
 *
 * Rotation is driven by springs on pointer position rather than a CSS
 * transition, so the tile keeps tracking while the cursor moves across it and
 * settles instead of snapping. Layout never shifts, only transform and colour,
 * both compositor properties.
 */
export function TiltTile({
  children,
  className = "",
  href,
  intensity = 9,
  flood = true,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  /** Max tilt in degrees at the tile's corners. */
  intensity?: number;
  /** Fill with the accent colour on hover. */
  flood?: boolean;
  ariaLabel?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 260, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), spring);

  function onPointerMove(e: React.PointerEvent) {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  /**
   * The link IS the tile, no wrapper element. A wrapper would swallow the
   * layout classes the caller passes (grid spans land on the grid child, not
   * on its content), which silently collapsed every tile to one column.
   */
  const Comp = href ? motion.a : motion.div;
  const external = href?.startsWith("http");

  return (
    <Comp
      ref={ref as never}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 700 }}
      whileHover={reduced ? undefined : { scale: 1.035, z: 40 }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      data-flood={flood ? "" : undefined}
      /* A flooding tile announces itself by filling. One that does not flood
         had only a lift and a tilt, which is the same thing a decorative card
         does, so the border takes the accent instead: that is the hover
         language every other interactive tile on the page already speaks. */
      className={`tile group/tilt p-5 will-change-transform
        transition-[border-color,box-shadow] duration-[var(--duration-base)]
        ease-[var(--ease-out-quint)]
        data-[flood]:hover:border-transparent
        data-[flood]:hover:bg-[var(--accent)]
        data-[flood]:hover:text-[var(--accent-ink)]
        not-data-[flood]:hover:border-[var(--accent)]
        hover:shadow-[var(--shadow-lift)]
        ${className}`}
    >
      {children}
    </Comp>
  );
}
