import { SocialLink } from "@/components/social-link";
import { profile, site, isPlaceholder } from "@/lib/content";
import { getSocials } from "@/lib/data";

/**
 * The footer is the last frame: the name set hollow and enormous, bleeding off
 * the bottom, with the links and the sign-off laid over it. No city, no
 * counters, nothing that is not a way to reach him.
 */
export async function Footer() {
  const socials = await getSocials();
  const year = new Date().getFullYear();
  const emailMissing = isPlaceholder(profile.email);

  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="shell relative pt-20 pb-8 sm:pt-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow">Next frame</p>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2.2rem,5vw,4rem)] leading-[0.98]">
              Got a story that needs moving<span className="text-[var(--accent)]">?</span>
            </h2>
            <div className="mt-7">
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
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {socials.map((s) => {
                const missing = isPlaceholder(s.href);
                const external = s.href.startsWith("http");
                return (
                  <li key={s.label}>
                    {missing ? (
                      <span className="flex items-center justify-between py-3 text-[15px] text-[var(--fg-muted)] opacity-60">
                        {s.label}
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">[URL]</span>
                      </span>
                    ) : (
                      <a
                        href={s.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="group flex items-center justify-between py-3 text-[15px] text-[var(--fg)] transition-colors hover:text-[var(--accent-text)]"
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
        </div>

        <p
          aria-hidden
          className="text-outline pointer-events-none mt-16 select-none whitespace-nowrap font-display text-[clamp(4rem,17vw,15rem)] font-bold uppercase leading-[0.8] tracking-[-0.05em] opacity-60 sm:mt-20"
          style={{ marginBottom: "-0.28em" }}
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
