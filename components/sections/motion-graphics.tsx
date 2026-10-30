import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { StaggerGrid, StaggerItem } from "@/components/reveal";
import { MotionCard } from "@/components/media/motion-card";
import { getMotionGraphics } from "@/lib/data";

/** A gallery of shorter motion pieces, uploaded from /admin. */
export async function MotionGraphics() {
  const items = await getMotionGraphics();
  return (
    <section id="motion" className="relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="left">Motion</GhostWord>
      <div className="shell relative">
        <SectionHeader
          index="02"
          eyebrow="Motion graphics"
          title="Loops, titles and experiments"
          lede="Shorter motion pieces, outside the aftermovies. Hover to preview, tap to play."
        />
        {items.length ? (
          <StaggerGrid className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {items.map((m, i) => (
              <StaggerItem key={m.id ?? i}>
                <MotionCard item={m} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <p className="rounded-[var(--radius-xl)] border border-dashed border-[var(--line-strong)] p-8 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
            [PLACEHOLDER: add motion graphics from /admin]
          </p>
        )}
      </div>
    </section>
  );
}
