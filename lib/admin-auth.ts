import "server-only";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

/**
 * Whether a signed-in email is allowed into the admin UI. The real
 * enforcement is Row Level Security in Postgres (public.is_admin), which gates
 * every read of a draft and every write regardless of this check; this just
 * keeps the dashboard from showing to someone who could do nothing with it.
 * Set ADMIN_EMAILS (server-only, comma-separated) to the same addresses.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/** For a page/action that must have an admin. Redirects otherwise. */
export async function requireAdmin() {
  const user = await getUser();
  if (!user) redirect("/admin/login");
  if (!isAdminEmail(user.email)) redirect("/admin/login?denied=1");
  return user;
}
