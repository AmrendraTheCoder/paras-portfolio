import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { Reveal } from "@/components/reveal";
import { MasonryGallery } from "@/components/media/masonry-gallery";
import { ArrowUpRightIcon } from "@/components/icons";
import { photographyInstagram, isPlaceholder } from "@/lib/content";
import { getPhotos } from "@/lib/photos";

/** Server component: the gallery is read from /public/photos at build time. */
export async function Photography() {
  const photos = await getPhotos();
  const ig = photographyInstagram;
  const missing = isPlaceholder(ig.href);

  return (
    <section id="photography" className="band relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="left">Stills</GhostWord>
      <div className="shell relative">
        <SectionHeader
          index="02"
          eyebrow="Photography"
          title="Hinged to photography too"
          lede="A selection of stills. Tap any one to see it large."
        />
        {photos.length ? (
          <MasonryGallery photos={photos} />
        ) : (
          <p className="rounded-[var(--radius-xl)] border border-dashed border-[var(--line-strong)] p-8 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
            [PLACEHOLDER: drop photographs into /public/photos]
          </p>
        )}
        <Reveal className="mt-10 flex justify-center">
          {missing ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-muted)] opacity-70">
              More on Instagram · [PLACEHOLDER URL]
            </span>
          ) : (
            <a
              href={ig.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-[var(--bg-tile)] px-6 py-3.5 text-[15px] font-medium text-[var(--fg)] shadow-[var(--shadow-tile)] transition-[border-color,box-shadow] duration-[var(--duration-base)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-lift)]"
            >
              More photography on Instagram
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-[var(--duration-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
