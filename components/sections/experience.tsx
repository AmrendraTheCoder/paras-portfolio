import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { StaggerGrid, StaggerItem } from "@/components/reveal";
import { experience, isPlaceholder } from "@/lib/content";

/**
 * A compact timeline: one rule, one dot per role, one or two lines each.
 * Dates sit in the mono rail so the eye can run down them without reading.
 */
export function Experience() {
  return (
    <section id="experience" className="band relative overflow-hidden section-rhythm-sm scroll-mt-24">
      <GhostWord align="left">Path</GhostWord>
      <div className="shell relative">
        <SectionHeader index="04" eyebrow="Experience" title="Where the work has been" />
        <StaggerGrid className="relative ml-2 border-l border-[var(--line-strong)] sm:ml-4">
          {experience.map((job) => (
            <StaggerItem key={`${job.org}-${job.role}`} className="relative pl-7 pb-10 last:pb-0 sm:pl-10">
              <span
                aria-hidden
                className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg-band)]"
              />
              <p className={`font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)] ${isPlaceholder(job.period) ? "opacity-60" : ""}`}>
                {job.period}
              </p>
              <h3 className="mt-1.5 text-[17px] font-medium tracking-[-0.01em] text-[var(--fg)]">
                {job.role} <span className="text-[var(--fg-muted)]">· {job.org}</span>
              </h3>
              <p className={`mt-1.5 max-w-[60ch] text-[15px] leading-[1.6] text-[var(--fg-muted)] ${isPlaceholder(job.line) ? "opacity-60" : ""}`}>
                {job.line}
              </p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
