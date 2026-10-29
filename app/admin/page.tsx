import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminHeader, Unconfigured, shell, card } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

async function count(table: string): Promise<number | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminHome() {
  if (!isSupabaseConfigured) return <Unconfigured />;
  const user = await requireAdmin();
  const [projects, photos, timeline, links] = await Promise.all([count("projects"), count("photos"), count("timeline"), count("links")]);

  const tiles = [
    { href: "/admin/projects", label: "Projects", n: projects, note: "Films, aftermovies and client work" },
    { href: "/admin/photos", label: "Photography", n: photos, note: "Upload and order the gallery" },
    { href: "/admin/timeline", label: "Timeline", n: timeline, note: "Roles and dates" },
    { href: "/admin/links", label: "Links", n: links, note: "Instagram, LinkedIn, email" },
  ];

  return (
    <>
      <AdminHeader email={user.email} />
      <main className={shell}>
        <h1 className="mb-2 font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-[-0.03em]">Welcome back.</h1>
        <p className="mb-8 text-[15px] text-[var(--fg-muted)]">Everything you change here updates the live site within a minute.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className={`${card} group transition-colors hover:border-[var(--accent)]`}>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-[1.4rem] font-bold tracking-[-0.02em]">{t.label}</span>
                <span className="font-mono text-[13px] text-[var(--fg-muted)]">{t.n ?? "—"}</span>
              </div>
              <p className="mt-2 text-[14px] text-[var(--fg-muted)]">{t.note}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
