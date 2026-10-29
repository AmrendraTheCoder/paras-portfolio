/**
 * Confirms the Supabase setup is wired correctly. Reads .env.local, connects
 * with the public anon key (the same access the live site has), and checks that
 * each content table is reachable and the media bucket exists. A few requests,
 * no writes.
 *
 *   npm run supabase:check
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local; rely on the shell environment */
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admins = process.env.ADMIN_EMAILS;

const results = [];
const ok = (name, pass, detail = "") => results.push({ name, pass, detail });

ok("NEXT_PUBLIC_SUPABASE_URL set", Boolean(url), url ? new URL(url).host : "missing");
ok("NEXT_PUBLIC_SUPABASE_ANON_KEY set", Boolean(anon));
ok("ADMIN_EMAILS set", Boolean(admins), admins || "missing — /admin will let no one in");

if (!url || !anon) {
  report();
} else {
  const supabase = createClient(url, anon);
  for (const table of ["projects", "links", "timeline", "photos"]) {
    try {
      const { error } = await supabase.from(table).select("id", { head: true, count: "exact" });
      ok(`table "${table}" reachable`, !error, error ? error.message : "");
    } catch (e) {
      ok(`table "${table}" reachable`, false, e.message);
    }
  }
  try {
    // list() goes through the object API the anon key can actually read, so a
    // public bucket reports correctly; getBucket reads a table anon cannot.
    const { error } = await supabase.storage.from("media").list("", { limit: 1 });
    ok('storage bucket "media" reachable', !error, error ? error.message : "");
  } catch (e) {
    ok('storage bucket "media" reachable', false, e.message);
  }
  report();
}

function report() {
  for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  if (failed) {
    console.log("\nIf tables or the bucket are missing, run supabase/schema.sql in the Supabase SQL editor.");
    process.exit(1);
  }
  console.log("\nSupabase is wired up. Visit /admin and sign in.");
}
