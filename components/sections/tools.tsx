import { Reveal } from "@/components/reveal";
import { tools } from "@/lib/content";

/** One clean line. No bars, no percentages, no logos until licensed marks are sorted. */
export function Tools() {
  return (
    <section id="tools" className="relative section-rhythm-sm">
      <div className="shell">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <span className="eyebrow">Tools</span>
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-display text-[clamp(1.3rem,2.6vw,2rem)] leading-[1.2] tracking-[-0.015em] text-[var(--fg)]">
            {tools.map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> : null}
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="max-w-[40ch] text-[14px] text-[var(--fg-muted)]">
            The tools are only half the story.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
