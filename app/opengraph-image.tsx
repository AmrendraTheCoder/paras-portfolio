import { ImageResponse } from "next/og";
import { profile, site } from "@/lib/content";

export const runtime = "nodejs";
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card. Typographic for now: dark canvas, the name very large, the
 * positioning line, the city. [PLACEHOLDER: swap for a showreel still once one
 * exists, see Step 7 of the brief.]
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#f4f4f7",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 22, letterSpacing: 4, color: "#9a9aa3" }}>
          <div style={{ width: 48, height: 6, background: "#c0fe04" }} />
          MOTION DESIGN · PHOTOGRAPHY · {profile.city.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 196, fontWeight: 700, fontStyle: "italic", letterSpacing: -10, lineHeight: 0.9 }}>
            {profile.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 40, color: "#c9c9d1" }}>{profile.tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#9a9aa3", letterSpacing: 2 }}>
          <span>{site.url.replace(/^https?:\/\//, "")}</span>
          <span>Creative Head · VIVACITY · LNMHACKS 9.0</span>
        </div>
      </div>
    ),
    size,
  );
}
