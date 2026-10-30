import { GhostWord } from "@/components/ghost-word";
import { Reveal, StaggerGrid, StaggerItem } from "@/components/reveal";
import { leadership } from "@/lib/content";

/**
 * Leadership as a story with chapters, not three tiles. The title column
 * stays put while the chapters scroll past it, each one a numbered beat with
 * its own event colour. Chapters still in draft say so, in small type, until
 * Paras replaces the wording with his own.
 */
export function Leadership() {
  const drafts = leadership.chapters.some((c) => c.draft);

  return (
    <section id="leadership" className="relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="right">Lead</GhostWord>
      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <div className="mb-6 flex items-center gap-4">
            <span className="font-mono text-[12px] font-medium tracking-[0.16em] text-[var(--accent-text)]">04</span>
            <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
            <span className="eyebrow">Leadership and mentoring</span>
          </div>
          <h2 className="text-[clamp(2.1rem,4vw,3.1rem)]">From one film to the whole creative team.</h2>
          <p className="mt-5 max-w-[34ch] text-[17px] leading-[1.6] text-[var(--fg-muted)]">{leadership.lede}</p>
          {drafts ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--line-strong)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
              Draft copy · facts his, wording mine
            </p>
          ) : null}
        </Reveal>

        <StaggerGrid className="lg:col-span-7 lg:col-start-6">
          <ol className="relative border-l border-[var(--line-strong)]">
            {leadership.chapters.map((c) => (
              <StaggerItem key={c.n} className="relative pl-8 pb-14 last:pb-0 sm:pl-12">
                <span
                  aria-hidden
                  className="absolute -left-[7px] top-[0.55rem] h-[13px] w-[13px] rounded-full ring-4 ring-[var(--bg)]"
                  style={{ background: c.tint }}
                />
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-[12px] font-medium tracking-[0.16em]" style={{ color: c.tint }}>
                    {c.n}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)]">{c.kicker}</span>
                </div>
                <h3 className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.1]">{c.title}</h3>
                <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.65] text-[var(--fg-muted)]">{c.body}</p>
              </StaggerItem>
            ))}
          </ol>
        </StaggerGrid>
      </div>
    </section>
  );
}
