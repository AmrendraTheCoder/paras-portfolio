import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { StaggerGrid, StaggerItem } from "@/components/reveal";
import { Tile } from "@/components/tile";
import { leadership } from "@/lib/content";

export function Leadership() {
  return (
    <section id="leadership" className="relative overflow-hidden section-rhythm-sm scroll-mt-24">
      <GhostWord align="right">Lead</GhostWord>
      <div className="shell relative">
        <SectionHeader
          index="03"
          eyebrow="Leadership and mentoring"
          title="Creative Head, VIVACITY and LNMHACKS 9.0"
          lede={leadership.lede}
        />
        <StaggerGrid className="grid gap-3 md:grid-cols-3">
          {leadership.items.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <Tile className="h-full p-6 sm:p-7">
                <h3 className="font-display text-[1.25rem] leading-[1.2] tracking-[-0.015em] text-[var(--fg)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-[var(--fg-muted)]">{item.body}</p>
              </Tile>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
