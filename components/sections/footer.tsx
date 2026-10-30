import { SocialLink } from "@/components/social-link";
import { FooterRevealNav } from "@/components/footer-reveal-nav";
import { MorphBackground } from "@/components/morph-background";
import { profile, site, isPlaceholder } from "@/lib/content";
import { getSocials } from "@/lib/data";

/**
 * The footer: a large index whose links reveal their world on hover, then the
 * email and social links, and the hollow wordmark as the last frame. No city,
 * nothing that is not a way to reach him or a way back into the work.
 */
export async function Footer() {
  const socials = await getSocials();
  const year = new Date().getFullYear();
  const emailMissing = isPlaceholder(profile.email);

  return (
    <footer id="contact" className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--bg)] scroll-mt-24">
      <MorphBackground />
      <div className="shell relative z-10 pt-16 sm:pt-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Next frame</p>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.0]">
              Got a story that needs moving<span className="text-[var(--accent)]">?</span>
            </h2>
          </div>
          {emailMissing ? (
            <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3.5 text-[15px] font-medium text-[var(--accent-ink)] opacity-70">
              [EMAIL] · placeholder
            </span>
          ) : (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3.5 text-[15px] font-medium text-[var(--accent-ink)] shadow-[var(--shadow-tile)] transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              {profile.email}
            </a>
          )}
        </div>

        {/* The index, with the hover image reveal. */}
        <FooterRevealNav />

        {/* Social links. */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="eyebrow">Elsewhere</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map((s) => {
              const missing = isPlaceholder(s.href);
              const external = s.href.startsWith("http");
              return (
                <li key={s.label}>
                  {missing ? (
                    <span className="inline-flex items-center gap-2 text-[14px] text-[var(--fg-muted)] opacity-60">
                      {s.label} <span className="font-mono text-[10px] uppercase tracking-[0.14em]">[URL]</span>
                    </span>
                  ) : (
                    <a
                      href={s.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-2 text-[14px] text-[var(--fg)] transition-colors hover:text-[var(--accent-text)]"
                    >
                      {s.label}
                      <span aria-hidden className="transition-transform duration-[var(--duration-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <p
          aria-hidden
          className="text-outline pointer-events-none mt-14 mb-[-0.24em] select-none whitespace-nowrap text-center font-display text-[13.2vw] font-bold uppercase leading-[0.8] tracking-[-0.03em] opacity-55 sm:mt-16"
        >
          {profile.first} {profile.last}
        </p>
      </div>

      <div className="relative border-t border-[var(--line)] bg-[var(--bg-band)]">
        <div className="shell flex flex-col gap-3 py-5 text-[13px] text-[var(--fg-muted)] sm:flex-row sm:items-center sm:justify-between">
          <a href="#main" className="font-medium text-[var(--fg)]" aria-label="Back to top">
            {site.footer}
            <span className="text-[var(--accent)]">.</span>
            <span className="ml-3 font-normal text-[var(--fg-muted)]">{profile.role}</span>
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">© {year} · Back to top ↑</span>
          <ul className="flex items-center gap-1">
            {socials.map((s) => (
              <li key={s.label}>
                <SocialLink social={s} variant="bare" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
