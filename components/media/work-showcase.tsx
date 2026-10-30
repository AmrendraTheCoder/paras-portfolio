"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { WorkCard } from "@/components/media/work-card";

/**
 * Selected work as a horizontal row you drag or scroll through — the Jesper
 * Landberg drag-scroll idea, done WITHOUT hijacking the page's vertical scroll,
 * so nothing behind it is ever hidden. Drag with the pointer, flick on a
 * trackpad, or shift-scroll; the cards reuse the hover previews and links.
 */
export function WorkShowcase({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const onDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    drag.current = { startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    setGrabbing(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !drag.current) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const onUp = () => {
    setGrabbing(false);
    // Swallow the click that follows a real drag so it doesn't open a card.
    if (drag.current?.moved) {
      const stop = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      ref.current?.addEventListener("click", stop, { capture: true, once: true });
    }
    drag.current = null;
  };

  return (
    <section id="work" className="relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="right">Work</GhostWord>
      <div className="shell relative">
        <SectionHeader
          index="01"
          eyebrow="Selected work"
          title="Films, aftermovies and motion"
          lede="Drag or scroll the row. Open any one for the full film and the story behind it."
        />
      </div>
      <div
        ref={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className={`-mx-[clamp(20px,5vw,48px)] flex gap-6 overflow-x-auto px-[clamp(20px,5vw,48px)] pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          grabbing ? "cursor-grabbing select-none" : "lg:cursor-grab"
        }`}
        style={{ scrollSnapType: "x proximity" }}
      >
        {projects.map((p, i) => (
          <div key={p.slug} className="w-[82vw] shrink-0 snap-start sm:w-[56vw] lg:w-[40vw] xl:w-[34vw]" style={{ scrollSnapAlign: "start" }}>
            <WorkCard project={p} index={i} />
          </div>
        ))}
        <div aria-hidden className="w-px shrink-0" />
      </div>
    </section>
  );
}
