/**
 * Bounded security self-test. NOT a load or stress tool.
 *
 * It makes a few dozen ordinary requests to confirm the public defences are in
 * place, then stops. It never floods: every phase has a hard, small cap, and
 * there is no concurrency beyond a handful of sequential checks. Run it against
 * your own site only.
 *
 *   npm run security                      # checks http://localhost:3100
 *   npm run security -- https://your-site # checks a deployed origin
 *
 * What it verifies:
 *   1. Security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy).
 *   2. The CSP allows only the YouTube player to be framed.
 *   3. /admin and the editor routes are gated (redirect to login or show the
 *      unconfigured screen — never the dashboard — when not signed in).
 *   4. No service-role key or Supabase secret is present in the home page HTML.
 *
 * It exits non-zero if any check fails, so it can run in CI.
 */

const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
// Hard ceiling on total requests. The script is structured to stay well under
// this; the cap exists so a bug can never turn it into a flood.
const MAX_REQUESTS = 40;
let made = 0;

async function get(path, opts = {}) {
  if (made >= MAX_REQUESTS) throw new Error("request cap reached — refusing to make more");
  made++;
  return fetch(BASE + path, { redirect: "manual", ...opts });
}

const results = [];
const ok = (name, pass, detail = "") => results.push({ name, pass, detail });

async function run() {
  // 1 + 2. Headers on the home page.
  const home = await get("/");
  const csp = home.headers.get("content-security-policy") || "";
  ok("CSP present", csp.length > 0);
  ok("X-Frame-Options DENY", (home.headers.get("x-frame-options") || "").toUpperCase() === "DENY");
  ok("X-Content-Type-Options nosniff", (home.headers.get("x-content-type-options") || "") === "nosniff");
  ok("Referrer-Policy set", Boolean(home.headers.get("referrer-policy")));
  ok("frame-src limited to YouTube", /frame-src[^;]*youtube-nocookie\.com/.test(csp) && !/frame-src[^;]*\*/.test(csp));

  // 4. No secret leaked into the public HTML.
  const html = await home.text();
  ok("no service-role / secret in HTML",
    !/service_role|SUPABASE_SERVICE_ROLE|sb_secret_/.test(html));

  // 3. Admin gating. Not signed in, these must NOT return the dashboard.
  for (const path of ["/admin", "/admin/projects", "/admin/photos", "/admin/timeline", "/admin/links"]) {
    const res = await get(path);
    const body = res.status === 200 ? await res.text() : "";
    const redirected = res.status >= 300 && res.status < 400;
    const unconfigured = /Connect Supabase first/.test(body);
    const leaked = /Add a new project|\.admin<\/|Sign out/.test(body);
    ok(`gated: ${path}`, (redirected || unconfigured) && !leaked,
      redirected ? `→ ${res.headers.get("location") || "redirect"}` : unconfigured ? "unconfigured screen" : `status ${res.status}`);
  }

  // Report.
  const failed = results.filter((r) => !r.pass);
  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} passed · ${made} requests made`);
  if (failed.length) process.exit(1);
}

run().catch((e) => {
  console.error("security-check error:", e.message);
  process.exit(1);
});
