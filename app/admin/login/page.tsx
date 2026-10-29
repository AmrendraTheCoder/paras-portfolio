"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const denied = params.get("denied");
  const next = params.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(denied ? "That account is not an admin." : null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  const field =
    "w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-3.5 py-3 text-[15px] text-[var(--fg)] outline-none transition-colors focus:border-[var(--accent)]";

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[360px] space-y-4">
      <div>
        <h1 className="font-display text-[1.8rem] font-bold tracking-[-0.025em]">
          Paras<span className="text-[var(--accent)]">.</span>admin
        </h1>
        <p className="mt-2 text-[14px] text-[var(--fg-muted)]">Sign in to edit the site.</p>
      </div>
      {!isSupabaseConfigured ? (
        <p className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-tile)] p-3 text-[13px] text-[var(--fg-muted)]">
          Supabase is not connected yet. See SETUP-SUPABASE.md.
        </p>
      ) : null}
      <input className={field} type="email" placeholder="Email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={field} type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error ? <p className="text-[13px] text-[var(--color-error)]">{error}</p> : null}
      <button
        disabled={busy || !isSupabaseConfigured}
        className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-[14px] font-medium text-[var(--accent-ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
