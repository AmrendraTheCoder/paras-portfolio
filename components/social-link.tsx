"use client";

import { socialIcons, ArrowUpRightIcon } from "@/components/icons";
import { useBrand } from "@/components/use-brand";
import { isPlaceholder, type Social } from "@/lib/content";

/**
 * One social link, two shapes, one rule: the platform owns its colour on hover
 * and keeps it everywhere it appears.
 *
 * A link whose URL has not been supplied yet renders as a visibly disabled row
 * with the placeholder showing, so a missing link is a gap you can see on the
 * page rather than a dead click.
 */
export function SocialLink({
  social,
  variant = "row",
  className = "",
}: {
  social: Social;
  variant?: "row" | "bare";
  className?: string;
}) {
  const Icon = socialIcons[social.icon];
  const brand = useBrand(social.brand, social.brandDark);
  const missing = isPlaceholder(social.href);
  const external = social.href.startsWith("http");

  if (variant === "bare") {
    if (missing) {
      return (
        <span
          title={`${social.label}: link not supplied yet`}
          className={`grid h-10 w-10 place-items-center rounded-full text-[var(--fg-muted)] opacity-50 ${className}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      );
    }
    return (
      <a
        href={social.href}
        aria-label={social.label}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        style={{ "--brand": brand } as React.CSSProperties}
        className={`grid h-10 w-10 place-items-center rounded-full text-[var(--fg-muted)]
                    transition-colors duration-[var(--duration-micro)]
                    hover:bg-[var(--bg-tile-hover)] hover:text-[var(--brand)] ${className}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </a>
    );
  }

  const shell =
    "group flex items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--bg-tile)] px-5 py-4 shadow-[var(--shadow-tile)]";

  if (missing) {
    return (
      <div className={`${shell} opacity-70 ${className}`} aria-disabled="true">
        <Icon className="h-5 w-5 shrink-0 text-[var(--fg-muted)]" />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-[var(--fg)]">{social.label}</span>
          <span className="block truncate font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            {social.href.replace("mailto:", "")}
          </span>
        </span>
      </div>
    );
  }

  return (
    <a
      href={social.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ "--brand": brand } as React.CSSProperties}
      className={`${shell} transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-quint)]
                  hover:border-[var(--brand)] hover:shadow-[var(--shadow-lift)] ${className}`}
    >
      <Icon className="h-5 w-5 shrink-0 text-[var(--fg-muted)] transition-colors group-hover:text-[var(--brand)]" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-[var(--fg)]">{social.label}</span>
        <span className="block truncate font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          {social.href.replace(/^https?:\/\/(www\.)?/, "").replace("mailto:", "")}
        </span>
      </span>
      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-[var(--fg-muted)] transition-transform duration-[var(--duration-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]" />
    </a>
  );
}
