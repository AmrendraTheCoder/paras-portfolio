import Link from "next/link";
import { signOut } from "@/app/admin/actions";

const field =
  "w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-3.5 py-2.5 text-[15px] text-[var(--fg)] outline-none transition-colors focus:border-[var(--accent)]";

export function Field({ label, name, defaultValue = "", type = "text", placeholder = "", required = false }: {
  label: string; name: string; defaultValue?: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">{label}</span>
      <input className={field} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required} />
    </label>
  );
}

export function Area({ label, name, defaultValue = "", rows = 3, placeholder = "" }: {
  label: string; name: string; defaultValue?: string; rows?: number; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">{label}</span>
      <textarea className={field} name={name} rows={rows} defaultValue={defaultValue} placeholder={placeholder} />
    </label>
  );
}

export function FileField({ label, name, accept, hint }: { label: string; name: string; accept: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">{label}</span>
      <input className={`${field} file:mr-3 file:rounded file:border-0 file:bg-[var(--bg-tile-hover)] file:px-3 file:py-1 file:text-[var(--fg)]`} name={name} type="file" accept={accept} />
      {hint ? <span className="mt-1 block text-[12px] text-[var(--fg-muted)]">{hint}</span> : null}
    </label>
  );
}

export function Toggle({ name, defaultChecked = true, label = "Published" }: { name: string; defaultChecked?: boolean; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2.5 text-[14px] text-[var(--fg)]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--accent)]" />
      {label}
    </label>
  );
}

export function Btn({ children, variant = "solid" }: { children: React.ReactNode; variant?: "solid" | "ghost" | "danger" }) {
  const v =
    variant === "solid"
      ? "bg-[var(--accent)] text-[var(--accent-ink)] hover:opacity-90"
      : variant === "danger"
        ? "border border-[var(--line)] text-[var(--color-error)] hover:border-[var(--color-error)]"
        : "border border-[var(--line)] text-[var(--fg)] hover:border-[var(--fg-muted)]";
  return <button className={`rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${v}`}>{children}</button>;
}

const SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/photos", label: "Photography" },
  { href: "/admin/timeline", label: "Timeline" },
  { href: "/admin/links", label: "Links" },
];

export function AdminHeader({ email }: { email?: string | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--bg)_90%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3">
        <Link href="/admin" className="font-display text-[16px] font-bold tracking-[-0.02em]">
          Paras<span className="text-[var(--accent)]">.</span>admin
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {SECTIONS.slice(1).map((s) => (
            <Link key={s.href} href={s.href} className="rounded-full px-3 py-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-tile-hover)] hover:text-[var(--fg)]">
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-[12px] text-[var(--fg-muted)]">
          <Link href="/" target="_blank" className="hover:text-[var(--fg)]">View site ↗</Link>
          {email ? <span className="hidden sm:inline">{email}</span> : null}
          <form action={signOut}>
            <button className="rounded-full border border-[var(--line)] px-3 py-1 text-[12px] text-[var(--fg)] transition-colors hover:border-[var(--fg-muted)]">Sign out</button>
          </form>
        </div>
      </div>
    </header>
  );
}

export function Unconfigured() {
  return (
    <div className="mx-auto max-w-[640px] px-5 py-24">
      <h1 className="font-display text-[2rem] font-bold tracking-[-0.02em]">Connect Supabase first</h1>
      <p className="mt-4 text-[16px] leading-[1.6] text-[var(--fg-muted)]">
        The admin needs a Supabase project for sign-in, the content database and file storage.
        Follow <code className="rounded bg-[var(--bg-tile)] px-1.5 py-0.5 text-[13px]">SETUP-SUPABASE.md</code> in the
        repository, set the three environment variables, and redeploy. Until then the public site
        runs on the seed content in <code className="rounded bg-[var(--bg-tile)] px-1.5 py-0.5 text-[13px]">lib/content.ts</code>.
      </p>
    </div>
  );
}

export function PageTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-[-0.025em]">{title}</h1>
      {action}
    </div>
  );
}

export const card = "rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--bg-tile)] p-5";
export const shell = "mx-auto max-w-[1100px] px-5 py-8";
