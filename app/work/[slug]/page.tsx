import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { Reveal } from "@/components/reveal";
import { CaseVideo } from "@/components/media/case-video";
import { ArrowUpRightIcon } from "@/components/icons";
import { projects, projectBySlug, site, isPlaceholder } from "@/lib/content";
import { jsonLdScript } from "@/lib/json-ld";
import { youtubeId } from "@/lib/video";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  const description = isPlaceholder(p.story)
    ? `${p.title}: ${p.role}. ${p.client}, ${p.year}.`
    : p.story;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} · ${site.footer}`, description, type: "video.other", url: `${site.url}/work/${p.slug}` },
    // Placeholder projects should not be indexed until they are real.
    robots: isPlaceholder(p.title) ? { index: false, follow: false } : undefined,
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className={`mt-2 text-[16px] leading-[1.5] text-[var(--fg)] ${isPlaceholder(value) ? "opacity-60" : ""}`}>{value}</dd>
    </div>
  );
}

/**
 * A case study: the full film first, then the facts in a rail, then the story,
 * then the one result if there is one. Previous and next keep a reviewer
 * moving through the work without going back to the grid.
 */
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  /**
   * VideoObject structured data, only once the film is really on YouTube and
   * the title is real. Search engines show a video result for a page that
   * carries this; a placeholder would only teach them a page that is not there.
   */
  const yt = youtubeId(p.video.full);
  const videoLd =
    yt && !isPlaceholder(p.title)
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: p.title,
          description: isPlaceholder(p.story) ? `${p.title}, ${p.client}.` : p.story,
          thumbnailUrl: [`${site.url}${p.video.poster}`],
          contentUrl: `https://www.youtube.com/watch?v=${yt}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${yt}`,
          author: { "@type": "Person", "@id": `${site.url}#person` },
        }
      : null;

  return (
    <>
      {videoLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(videoLd) }} />
      ) : null}
      <Nav />
      <main id="main" className="relative z-10" style={{ "--tint": p.tint } as React.CSSProperties}>
        <article className="shell pt-28 pb-20 sm:pt-32 sm:pb-28">
          <Reveal className="mb-8 sm:mb-10">
            <Link href="/#work" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]">
              <span aria-hidden>←</span> All work
            </Link>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-[var(--line)] pb-5">
              <span className="font-mono text-[12px] font-medium tracking-[0.16em] text-[var(--tint)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h1 className={`font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] tracking-[-0.025em] text-[var(--fg)] ${isPlaceholder(p.title) ? "opacity-60" : ""}`}>
                {p.title}
              </h1>
              <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                {p.year} <span aria-hidden>·</span> {p.client}
                {p.status === "coming-soon" ? <> <span aria-hidden>·</span> Coming soon</> : null}
              </span>
            </div>
          </Reveal>

          <Reveal>
            <CaseVideo video={p.video} title={p.title} />
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 sm:mt-16">
            <Reveal className="lg:col-span-4">
              <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <Fact label="Role" value={p.role} />
                <Fact label="Tools" value={p.tools.join(", ")} />
                <Fact label="Client / event" value={p.client} />
                {p.theme ? <Fact label="Theme" value={p.theme} /> : null}
              </dl>
            </Reveal>

            <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.08}>
              <h2 className="eyebrow !font-mono">The story</h2>
              <p className={`mt-4 font-display text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.4] tracking-[-0.01em] text-[var(--fg)] ${isPlaceholder(p.story) ? "opacity-60" : ""}`}>
                {p.story}
              </p>
              {p.result ? (
                <div className="mt-8 border-l-2 pl-5" style={{ borderColor: p.tint }}>
                  <p className="eyebrow">Result</p>
                  <p className="mt-2 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] text-[var(--fg)]">{p.result}</p>
                </div>
              ) : null}
            </Reveal>
          </div>

          <Reveal className="mt-16 grid gap-3 border-t border-[var(--line)] pt-8 sm:grid-cols-2 sm:mt-24">
            <Link href={`/work/${prev.slug}`} className="group rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--bg-tile)] p-5 transition-[border-color] hover:border-[var(--fg-muted)]">
              <span className="eyebrow">Previous</span>
              <span className="mt-2 block text-[16px] font-medium text-[var(--fg)]">{prev.title}</span>
            </Link>
            <Link href={`/work/${next.slug}`} className="group rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--bg-tile)] p-5 text-right transition-[border-color] hover:border-[var(--fg-muted)]">
              <span className="eyebrow">Next</span>
              <span className="mt-2 flex items-center justify-end gap-2 text-[16px] font-medium text-[var(--fg)]">
                {next.title}
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        </article>
        <Footer />
      </main>
    </>
  );
}
