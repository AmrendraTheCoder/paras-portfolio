/**
 * Refuses to build when a secret is about to be published.
 *
 * `NEXT_PUBLIC_` is not a label, it is an instruction: Next inlines any variable
 * carrying that prefix into the JavaScript every visitor downloads. A secret
 * given that prefix is not "exposed if something goes wrong", it is published,
 * silently, at build time, with no error and nothing in the output to notice.
 *
 * This happened once here: NEXT_PUBLIC_SUPABASE_SECRET_KEY was set locally and
 * the value was found sitting in a client chunk. It had not reached production,
 * but only because the variable had not been added there yet. That is luck, not
 * a control, so this is the control.
 *
 * Runs before every build, locally and on Vercel. Exits non-zero on a match,
 * which fails the deploy rather than shipping the key.
 *
 * It loads the .env files itself rather than reading process.env alone. On
 * Vercel the variables are already in the environment, but locally they are not
 * until Next loads them, and this runs first. A guard that only worked on the
 * server would have missed the exact case that prompted it.
 */

// Default import: @next/env is CommonJS, so the named form does not resolve.
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), true, {
  info: () => {},
  error: console.error,
});

// Patterns that mean "this is a credential", not "this looks vaguely secret".
// Deliberately narrow: a check that cries wolf gets skipped, and a skipped
// check protects nothing.
const SECRET_NAME = /(SECRET|SERVICE_ROLE|PRIVATE_KEY|_PASSWORD|API_KEY|ACCESS_TOKEN)/i;

const SECRET_VALUE = [
  { re: /^sb_secret_/, what: "a Supabase secret key" },
  { re: /^re_[A-Za-z0-9]{10,}/, what: "a Resend API key" },
  { re: /^sk-[A-Za-z0-9]{10,}/, what: "an OpenAI-style secret key" },
  { re: /^sk_live_/, what: "a Stripe live secret key" },
  { re: /^ghp_[A-Za-z0-9]{20,}/, what: "a GitHub personal access token" },
  { re: /^xox[baprs]-/, what: "a Slack token" },
  // A Supabase service-role JWT. The anon key is also a JWT and is safe, so the
  // role claim is what separates them, not the shape.
  {
    re: /^eyJ/,
    what: "a service-role JWT",
    deep: (value) => {
      try {
        const payload = JSON.parse(
          Buffer.from(value.split(".")[1] ?? "", "base64url").toString("utf8"),
        );
        return payload.role === "service_role";
      } catch {
        return false;
      }
    },
  },
];

// Known-safe names that trip the name heuristic. Each one is public by design.
const ALLOWED = new Set([
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
]);

const problems = [];

for (const [name, value] of Object.entries(process.env)) {
  if (!name.startsWith("NEXT_PUBLIC_") || !value) continue;
  if (ALLOWED.has(name)) continue;

  if (SECRET_NAME.test(name.replace(/^NEXT_PUBLIC_/, ""))) {
    problems.push(`${name} is named like a credential and carries NEXT_PUBLIC_.`);
    continue;
  }

  for (const { re, what, deep } of SECRET_VALUE) {
    if (re.test(value) && (!deep || deep(value))) {
      problems.push(`${name} holds what looks like ${what}.`);
      break;
    }
  }
}

if (problems.length) {
  console.error("\n  Build stopped. A secret would have been published.\n");
  for (const p of problems) console.error(`  - ${p}`);
  console.error(
    "\n  NEXT_PUBLIC_ inlines a value into the JavaScript every visitor downloads.\n" +
      "  Drop the prefix if the server needs it, delete the variable if nothing\n" +
      "  does, and rotate the key either way: assume it is already public.\n",
  );
  process.exit(1);
}
