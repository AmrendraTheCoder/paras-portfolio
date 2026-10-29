import { SocialLink } from "@/components/social-link";
import { profile, site, socials } from "@/lib/content";

/** A thin meta bar: identity, place and year, the links once more. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] px-5 py-8 sm:px-6 sm:py-6">
      <div className="mx-auto flex max-w-[1140px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <a href="#main" className="text-[14px] font-medium tracking-[-0.01em] text-[var(--fg)]" aria-label="Back to top">
          {site.footer}
          <span className="text-[var(--accent)]">.</span>
          <span className="ml-3 font-normal text-[var(--fg-muted)]">{profile.role}</span>
        </a>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
          {profile.location} · {year}
        </p>
        <ul className="flex items-center gap-1">
          {socials.map((s) => (
            <li key={s.label}>
              <SocialLink social={s} variant="bare" />
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
