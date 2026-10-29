import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { StaggerGrid, StaggerItem } from "@/components/reveal";
import { experience, isPlaceholder } from "@/lib/content";

/**
 * The timeline as a strip of film. Four frames side by side on a desktop,
 * sprocket holes along the edges, each frame a role: the dates at the top in
 * mono, the organisation large, then one or two lines. On a phone the strip
 * turns vertical and the holes run down the sides.
 */
export function Experience() {
  return (
    <section id="experience" className="band relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="left">Path</GhostWord>
      <div className="shell relative !max-w-[1380px]">
        <SectionHeader index="04" eyebrow="Experience" title="Where the work has been" />

        <StaggerGrid className="film-strip grid overflow-hidden border-y-2 border-[var(--fg)] py-6 sm:py-7 lg:grid-cols-4">
          {experience.map((job, i) => (
            <StaggerItem
              key={`${job.org}-${job.role}`}
              className="relative flex min-h-[260px] flex-col border-[var(--line-strong)] p-6 sm:p-7 max-lg:border-b max-lg:last:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-1"
                style={{ background: job.tint }}
              />
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)]">
                  Frame {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.16em] ${isPlaceholder(job.period) ? "opacity-50" : ""}`}
                  style={{ color: job.tint }}
                >
                  {job.period}
                </span>
              </div>
              <h3 className="mt-8 text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.05]">{job.org}</h3>
              <p className="mt-2 text-[15px] font-medium text-[var(--fg)]">{job.role}</p>
              <p className={`mt-4 text-[14.5px] leading-[1.6] text-[var(--fg-muted)] ${isPlaceholder(job.line) ? "opacity-60" : ""}`}>
                {job.line}
              </p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
