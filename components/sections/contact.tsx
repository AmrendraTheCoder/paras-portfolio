"use client";

import { motion, useReducedMotion } from "motion/react";
import { GhostWord } from "@/components/ghost-word";
import { SectionHeader } from "@/components/section-header";
import { SocialLink } from "@/components/social-link";
import { StaggerGrid, StaggerItem } from "@/components/reveal";
import { profile, isPlaceholder, type Social } from "@/lib/content";
import { MorphBackground } from "@/components/morph-background";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Contact({ socials }: { socials: Social[] }) {
  const reduced = useReducedMotion();
  const emailMissing = isPlaceholder(profile.email);

  return (
    <section id="contact" className="band relative overflow-hidden section-rhythm scroll-mt-24">
      <MorphBackground />
      <GhostWord align="right">Hello</GhostWord>
      <div className="shell relative z-10">
        <SectionHeader
          index="07"
          eyebrow="Contact"
          title="Say hello"
          lede="For internships, junior roles, freelance briefs, or a story that needs moving."
        />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          {emailMissing ? (
            <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-7 py-4 text-[15px] font-medium text-[var(--accent-ink)] opacity-70">
              [EMAIL] · placeholder
            </span>
          ) : (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-7 py-4 text-[15px] font-medium text-[var(--accent-ink)] shadow-[var(--shadow-tile)] transition-[box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              {profile.email}
            </a>
          )}
        </motion.div>

        <StaggerGrid className="grid gap-3 sm:grid-cols-2">
          {socials.map((s) => (
            <StaggerItem key={s.label}>
              <SocialLink social={s} variant="row" />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
