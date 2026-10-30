import { themes } from "@/lib/content";

/**
 * MorphingBackgroundShapes, kept cheap: three large radial fields in the event
 * worlds' colours, heavily blurred and low in opacity, whose shape and
 * position drift on long, offset loops. Decorative and aria-hidden; it holds a
 * still shape under reduced motion (handled in globals.css).
 */
const BLOBS = [
  { color: themes[0].palette[0], top: "-10%", left: "-5%", size: "46vw", dur: "26s", opacity: 0.4, delay: "0s" },
  { color: themes[3].palette[1], top: "30%", left: "55%", size: "40vw", dur: "32s", opacity: 0.32, delay: "-8s" },
  { color: themes[2].palette[0], top: "55%", left: "10%", size: "38vw", dur: "29s", opacity: 0.28, delay: "-16s" },
];

export function MorphBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="morph-blob"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            background: `radial-gradient(closest-side, ${b.color}, transparent)`,
            animationDelay: b.delay,
            ["--dur" as string]: b.dur,
          }}
        />
      ))}
    </div>
  );
}
