import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { StaggerGrid, StaggerItem } from "@/components/reveal";
import { WorkCard } from "@/components/media/work-card";
import { projects } from "@/lib/content";

/**
 * Selected work. Two across on desktop so each preview is big enough to read
 * as a film, one across on a phone where the poster stands in for the loop.
 */
export function Work() {
  return (
    <section id="work" className="relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="right">Work</GhostWord>
      <div className="shell relative">
        <SectionHeader
          index="01"
          eyebrow="Selected work"
          title="Films, aftermovies and motion"
          lede="Hover a card to see it move. Open one for the full film, the role and the story behind it."
        />
        <StaggerGrid className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {projects.map((p, i) => (
            <StaggerItem key={p.slug}>
              <WorkCard project={p} index={i} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
