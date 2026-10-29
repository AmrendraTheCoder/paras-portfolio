import type { Metadata } from "next";

/** The admin is never indexed and never part of the public site's crawl. */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">{children}</div>;
}
