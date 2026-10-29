import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Gate for everything under /admin, and a refresh of the Supabase session on
 * each request so an admin is not logged out mid-edit.
 *
 * This is the outer lock. The inner lock is Row Level Security in Postgres:
 * even if this were bypassed, the anon key cannot read or write the content
 * tables, and only an allow-listed admin email can. Defence in depth, because
 * what is behind this gate can change what the public site shows.
 *
 * Unauthenticated requests to /admin (except the login page) are redirected to
 * the login before any page code runs. When Supabase is not configured the
 * admin pages render their own "connect Supabase" screen, so the gate steps
 * aside rather than redirecting into a login that cannot work.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser revalidates the token with Supabase rather than trusting a cookie.
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";
  if (path.startsWith("/admin") && !isLogin && !user) {
    const to = request.nextUrl.clone();
    to.pathname = "/admin/login";
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }
  // Already signed in and sitting on the login page: send to the dashboard.
  if (isLogin && user) {
    const to = request.nextUrl.clone();
    to.pathname = "/admin";
    to.search = "";
    return NextResponse.redirect(to);
  }
  return response;
}

export const config = {
  // Everything under /admin, nothing else. The public site never runs this.
  matcher: ["/admin/:path*"],
};
