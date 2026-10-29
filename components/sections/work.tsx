import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { Reveal } from "@/components/reveal";
import { WorkCard } from "@/components/media/work-card";
import { getProjects } from "@/lib/data";

/**
 * The asymmetric three-column canvas from the LNMHACKS sponsor grid: a wide
 * card on the right of the first row, two on the left of the second, two on
 * the right of the third. Five slots, so the five projects fill it exactly;
 * anything beyond five drops into a plain two-up row underneath.
 */
const SLOTS = [
  ["", "lg:col-span-2"],
  ["", "", ""],
  ["", "", ""],
] as const;

export async function Work() {
  const projects = await getProjects();
  const [p0, p1, p2, p3, p4, ...rest] = projects;

  return (
    <section id="work" className="relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="right">Work</GhostWord>
      <div className="shell relative !max-w-[1380px]">
        <SectionHeader
          index="01"
          eyebrow="Selected work"
          title="Films, aftermovies and motion"
          lede="Open any one for the full film, the role and the story behind it."
        />

        <div className="grid gap-x-6 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {/* Row 1: empty | wide */}
          <div className="hidden lg:block" aria-hidden />
          <Reveal className={SLOTS[0][1]}>{p0 ? <WorkCard project={p0} index={0} wide /> : null}</Reveal>

          {/* Row 2: card | card | empty */}
          <Reveal delay={0.05}>{p1 ? <WorkCard project={p1} index={1} /> : null}</Reveal>
          <Reveal delay={0.1}>{p2 ? <WorkCard project={p2} index={2} /> : null}</Reveal>
          <div className="hidden lg:block" aria-hidden />

          {/* Row 3: empty | card | card */}
          <div className="hidden lg:block" aria-hidden />
          <Reveal delay={0.05}>{p3 ? <WorkCard project={p3} index={3} /> : null}</Reveal>
          <Reveal delay={0.1}>{p4 ? <WorkCard project={p4} index={4} /> : null}</Reveal>

          {rest.map((p, i) => (
            <Reveal key={p.slug}>
              <WorkCard project={p} index={5 + i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
