import "server-only";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Anonymous, cookieless client for reading PUBLIC content (published rows).
 *
 * The public site's data layer uses this rather than the cookie-bound server
 * client for two reasons: reading a visitor's cookies at build time is not
 * allowed (it breaks generateStaticParams and forces every page dynamic), and
 * public content should not depend on who is viewing anyway. Row Level
 * Security still restricts this to published rows. Returns null when Supabase
 * is unset, and callers fall back to the seed content.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createJsClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
