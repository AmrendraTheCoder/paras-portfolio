"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile, themes } from "@/lib/content";
import { ThemeArt } from "@/components/theme-poster";

/**
 * The hero as an original non-linear editor, full-screen.
 *
 * A stylised, believable editing app — "PARAS·CUT" — not a copy of any real
 * product: its own name, its own panel labels, its own layout. It fills the
 * whole first screen like a real editing suite: a menu bar, a tools rail, a
 * media bin, a program monitor, an effect panel and a multi-track timeline. A
 * clip plays in the monitor, the playhead sweeps the timeline, and the title
 * "PARAS GUPTA" is keyed over the footage with no backing box, the way a motion
 * designer would. It is a mock — the playhead moves, play/pause and the tools
 * toggle, clips light up as the head crosses them, but nothing here edits.
 *
 * One rAF loop drives it, writing the playhead straight to the DOM and only
 * re-rendering React when the cut changes. Paused when the tab is hidden; under
 * reduced motion it holds one composed frame with the title up.
 */

const LOOP_MS = 12000;
const CLIPS = themes;
const N = CLIPS.length;
const SEG = LOOP_MS / N;

const two = (n: number) => String(Math.floor(n)).padStart(2, "0");
const timecode = (ms: number) => `${two(ms / 1000 / 60)}:${two((ms / 1000) % 60)}`;

export function HeroEditor() {
  const reduced = useReducedMotion();

  const [cut, setCut] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [tool, setTool] = useState("select");

  const playheadRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const cutRef = useRef(0);
  const playingState = useRef(!reduced);

  useEffect(() => {
    playingState.current = playing;
  }, [playing]);

  useEffect(() => {
    if (!reduced) return;
    setPlaying(false);
    if (playheadRef.current) playheadRef.current.style.left = "0%";
    if (scrubRef.current) scrubRef.current.style.width = "0%";
    if (tcRef.current) tcRef.current.textContent = `${timecode(0)} / ${timecode(LOOP_MS)}`;
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      if (playingState.current) elapsed.current = (elapsed.current + dt) % LOOP_MS;
      const p = elapsed.current / LOOP_MS;
      if (playheadRef.current) playheadRef.current.style.left = `${(p * 100).toFixed(3)}%`;
      if (scrubRef.current) scrubRef.current.style.width = `${(p * 100).toFixed(3)}%`;
      if (tcRef.current) tcRef.current.textContent = `${timecode(elapsed.current)} / ${timecode(LOOP_MS)}`;
      const idx = Math.min(N - 1, Math.floor(p * N));
      if (idx !== cutRef.current) {
        cutRef.current = idx;
        setCut(idx);
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf), (raf = 0);
      } else if (!raf) start();
    };
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  const active = CLIPS[cut] ?? CLIPS[0];
  const label = "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-muted)]";

  return (
    <section id="hero" className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-[var(--bg-raised)]">
      {/* ── Menu bar ─────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--bg-tile)] px-3 py-2 sm:px-4">
        <span className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-[var(--accent)]">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[var(--accent-ink)]"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="font-display text-[14px] font-bold tracking-[-0.02em] text-[var(--fg)]">
            PARAS<span className="text-[var(--accent)]">·</span>CUT
          </span>
          <span className={`${label} hidden sm:inline`}>v1.0</span>
        </span>
        <nav className="ml-2 hidden items-center gap-4 md:flex">
          {["File", "Edit", "Clip", "Sequence", "Title", "Effects", "Window"].map((m) => (
            <span key={m} className="font-mono text-[11px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]">{m}</span>
          ))}
        </nav>
        <span className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-1 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
            <span className={label}>Rendering · {profile.initials}</span>
          </span>
          <span className="flex items-center gap-1.5" aria-hidden>
            {["#5b5", "#eb4", "#e55"].map((c) => (
              <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
            ))}
          </span>
        </span>
      </div>

      {/* ── Middle: tools · bin · monitor · effects ─────────────────── */}
      <div className="flex min-h-0 flex-1">
        {/* Tools rail */}
        <aside className="hidden w-12 shrink-0 flex-col items-center gap-1 border-r border-[var(--line)] bg-[var(--bg-tile)] py-3 lg:flex">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-label={t.name}
              title={`${t.name} (${t.key})`}
              onClick={() => setTool(t.id)}
              className={`grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] transition-colors ${
                tool === t.id ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "text-[var(--fg-muted)] hover:bg-[var(--bg-raised)] hover:text-[var(--fg)]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {t.icon}
              </svg>
            </button>
          ))}
          <span className="mt-auto font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">{keyFor(tool)}</span>
        </aside>

        {/* Media bin */}
        <aside className="hidden w-[210px] shrink-0 flex-col gap-2 border-r border-[var(--line)] p-3 xl:flex">
          <div className="flex items-center justify-between">
            <p className={label}>Project · media</p>
            <span className={label}>{N}</span>
          </div>
          <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
            {CLIPS.map((c, i) => (
              <li
                key={c.slug}
                className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] border px-2 py-2 transition-colors ${
                  i === cut ? "border-[var(--line-strong)] bg-[var(--bg-raised)]" : "border-transparent hover:bg-[var(--bg-tile)]"
                }`}
              >
                <span className="relative h-8 w-11 shrink-0 overflow-hidden rounded-[4px]" style={{ background: `linear-gradient(135deg, ${c.palette[0]}, ${c.palette[2]})` }}>
                  <span className="absolute bottom-0 right-0.5 font-mono text-[7px] text-black/70">00:0{i}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium text-[var(--fg)]">{c.name}</span>
                  <span className={`${label} block truncate`}>{c.event}</span>
                </span>
                {i === cut ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" /> : null}
              </li>
            ))}
          </ul>
          <p className={label}>{N} clips · 00:12 total</p>
        </aside>

        {/* Program monitor */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--bg)]">
          <div className="flex shrink-0 items-center justify-between border-b border-[var(--line)] px-3 py-1.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg)]">Program</span>
              <span className={label}>sequence_01</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={label}>Fit</span>
              <span className={label}>4K · 24fps</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.palette[0] }} />
                <span className={label}>{active.name}</span>
              </span>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-4 sm:p-8">
            <div className="relative aspect-video max-h-full w-full max-w-[min(100%,calc((100%-0px)*16/9))] overflow-hidden" style={{ maxHeight: "100%" }}>
              {/* Footage */}
              <div className="absolute inset-0"><ThemeArt theme={active} /></div>
              {!reduced ? (
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)", backgroundSize: "260% 100%" }}
                  animate={{ backgroundPosition: ["140% 0", "-40% 0"] }}
                  transition={{ duration: 3.4, ease: "linear", repeat: Infinity }}
                />
              ) : null}

              {/* Safe-area / thirds guides, like a real program monitor */}
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.14]">
                <div className="absolute inset-x-0 top-1/3 h-px bg-white" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-white" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white" />
                <div className="absolute inset-[7%] border border-white/60" />
              </div>

              {/* Title layer — keyed on every cut, NO backing box */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reduced ? "static" : cut}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="[text-shadow:0_2px_24px_rgba(0,0,0,0.55)]"
                  >
                    <motion.p
                      initial={reduced ? false : { y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/90"
                    >
                      {profile.role}
                    </motion.p>
                    <h1 className="mt-2 overflow-hidden font-display text-[clamp(2.6rem,8vw,7rem)] font-bold uppercase leading-[0.88] tracking-[-0.03em] text-white">
                      <motion.span
                        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", y: 10 }}
                        animate={{ clipPath: "inset(0 0% 0 0)", y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                      >
                        {profile.first}
                      </motion.span>
                      <motion.span
                        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)", y: 10 }}
                        animate={{ clipPath: "inset(0 0% 0 0)", y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                        className="block"
                        style={{ color: "transparent", WebkitTextStroke: "1.6px #fff" }}
                      >
                        {profile.last}
                      </motion.span>
                    </h1>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Monitor corner marks */}
              <span className="absolute left-2 top-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">{active.event}</span>
              <span ref={tcRef} className="absolute bottom-2 right-2 font-mono text-[10px] tabular-nums text-white/70">00:00 / 00:12</span>
            </div>
          </div>

          {/* Transport */}
          <div className="flex shrink-0 items-center gap-3 border-t border-[var(--line)] px-3 py-2">
            <div className="flex items-center gap-1.5">
              <TransportBtn label="Go to start" onClick={() => jump(-N, cutRef, elapsed, setCut)}>{Icon.toStart}</TransportBtn>
              <TransportBtn label="Previous clip" onClick={() => jump(-1, cutRef, elapsed, setCut)}>{Icon.prev}</TransportBtn>
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((p) => !p)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] transition-transform hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">{playing ? <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></> : <path d="M8 5v14l11-7z" />}</svg>
              </button>
              <TransportBtn label="Next clip" onClick={() => jump(1, cutRef, elapsed, setCut)}>{Icon.next}</TransportBtn>
              <TransportBtn label="Go to end" onClick={() => jump(N, cutRef, elapsed, setCut)}>{Icon.toEnd}</TransportBtn>
            </div>
            <div className="relative ml-1 hidden h-1 flex-1 overflow-hidden rounded-full bg-[var(--line)] sm:block">
              <div ref={scrubRef} className="absolute inset-y-0 left-0 w-0 bg-[var(--accent)]" />
            </div>
          </div>
        </div>

        {/* Effect controls */}
        <aside className="hidden w-[220px] shrink-0 flex-col gap-4 border-l border-[var(--line)] p-3 lg:flex">
          <div>
            <p className={label}>Effect controls · title</p>
            <div className="mt-3 flex flex-col gap-3">
              <Slider name="Opacity" value={92} tint={active.palette[0]} />
              <Slider name="Scale" value={64} tint={active.palette[1]} />
              <Slider name="Blur" value={18} tint={active.palette[2]} />
              <Slider name="Speed" value={50} tint="var(--accent)" />
            </div>
          </div>
          <div>
            <p className={label}>Toggles</p>
            <div className="mt-2.5 flex flex-col gap-2">
              {[["Loop sequence", true], ["Film grain", true], ["Snap to cut", true]].map(([t, on]) => (
                <div key={t as string} className="flex items-center justify-between text-[12px] text-[var(--fg)]">
                  <span>{t as string}</span>
                  <span className={`flex h-4 w-7 items-center rounded-full px-0.5 ${on ? "justify-end bg-[var(--accent)]" : "justify-start bg-[var(--line-strong)]"}`}>
                    <span className="h-3 w-3 rounded-full bg-[var(--bg)]" />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto">
            <p className={label}>Applied effects</p>
            <ul className="mt-2 flex flex-col gap-1 font-mono text-[11px] text-[var(--fg-muted)]">
              <li>› Kinetic Title — {active.name}</li>
              <li>› Colour grade / {active.palette[0]}</li>
              <li>› Motion Blur 180°</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <div className="relative shrink-0 border-t border-[var(--line)] bg-[var(--bg-tile)]">
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-3">
            <span className={label}>Timeline · sequence_01</span>
            <span className="hidden items-center gap-1.5 sm:flex">
              {["M", "S"].map((b) => (
                <span key={b} className="grid h-4 w-4 place-items-center rounded-[3px] border border-[var(--line-strong)] font-mono text-[8px] text-[var(--fg-muted)]">{b}</span>
              ))}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 sm:flex" aria-hidden>
              <span className={label}>Zoom</span>
              <span className="relative h-1 w-16 rounded-full bg-[var(--line-strong)]"><span className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-[var(--fg-muted)]" /></span>
            </span>
            <span className={label}>00:12:00</span>
          </div>
        </div>
        <div className="relative border-t border-[var(--line)] bg-[var(--bg)]">
          <div aria-hidden className="ml-[70px] flex h-4 items-end border-b border-[var(--line)]">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="flex-1 border-l border-[var(--line)]" style={{ height: i % 4 === 0 ? "100%" : "45%" }} />
            ))}
          </div>
          <div className="flex flex-col">
            {TRACKS.map((track, ti) => (
              <div key={track.label} className="relative flex h-9 items-center border-b border-[var(--line)] last:border-b-0">
                <span className="absolute left-0 z-10 flex w-[70px] items-center gap-1 pl-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--fg-muted)]">
                  {track.label}
                </span>
                <div className="relative ml-[70px] mr-2 h-full flex-1">
                  {CLIPS.map((c, i) => {
                    const on = i === cut;
                    const isTitle = ti === 0;
                    const isAudio = track.kind === "audio";
                    return (
                      <div
                        key={c.slug}
                        className="absolute top-1/2 flex h-[64%] -translate-y-1/2 items-center overflow-hidden rounded-[4px] px-2 transition-[filter,box-shadow] duration-200"
                        style={{
                          left: `${(i / N) * 100 + 0.4}%`,
                          width: `${(1 / N) * 100 - 0.8}%`,
                          background: isTitle ? `${c.palette[0]}` : isAudio ? "var(--bg-tile-hover)" : `linear-gradient(90deg, ${c.palette[0]}cc, ${c.palette[2]}cc)`,
                          opacity: track.alpha,
                          filter: on ? "brightness(1.12) saturate(1.1)" : "brightness(0.82)",
                          boxShadow: on ? `0 0 0 1.5px var(--fg)` : "none",
                        }}
                      >
                        {isAudio ? (
                          <span aria-hidden className="flex h-full w-full items-center gap-[2px] overflow-hidden">
                            {Array.from({ length: 40 }).map((_, k) => (
                              <span key={k} className="w-[2px] shrink-0 rounded-full" style={{ height: `${(20 + Math.abs(Math.sin(k * 0.9 + i)) * 60).toFixed(2)}%`, background: c.palette[2], opacity: 0.8 }} />
                            ))}
                          </span>
                        ) : (
                          <span className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-black/80">
                            {isTitle ? "PARAS GUPTA" : c.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div ref={playheadRef} aria-hidden className="pointer-events-none absolute bottom-0 top-0 z-20 ml-[70px] w-px bg-[var(--accent)]" style={{ left: "0%" }}>
            <span className="absolute -left-[5px] -top-[1px] h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[var(--accent)]" />
          </div>
        </div>
        <p className={`${label} px-3 py-1.5`}>Scroll to explore the work ↓</p>
      </div>
    </section>
  );
}

/* ── Tools, drawn as original simple glyphs ─────────────────────────── */
const TOOLS = [
  { id: "select", name: "Selection", key: "V", icon: <path d="M5 3l6 16 2-6 6-2z" /> },
  { id: "razor", name: "Razor", key: "C", icon: <><path d="M4 20l9-9" /><circle cx="18" cy="6" r="2.4" /><path d="M14 10l6-6" /></> },
  { id: "hand", name: "Hand", key: "H", icon: <path d="M8 11V5.5a1.5 1.5 0 013 0V11m0 0V4.5a1.5 1.5 0 013 0V11m0 0V6.5a1.5 1.5 0 013 0V13a6 6 0 01-6 6h-1a5 5 0 01-4-2l-3-4a1.6 1.6 0 012.4-2L8 11z" /> },
  { id: "zoom", name: "Zoom", key: "Z", icon: <><circle cx="10.5" cy="10.5" r="6" /><path d="M20 20l-4.5-4.5" /></> },
  { id: "text", name: "Type", key: "T", icon: <><path d="M5 6h14" /><path d="M12 6v13" /></> },
  { id: "pen", name: "Pen", key: "P", icon: <path d="M12 3l7 7-9 9H4v-6z" /> },
  { id: "marker", name: "Marker", key: "M", icon: <><path d="M6 3v18" /><path d="M6 4h11l-2.5 3.5L17 11H6" /></> },
];
const keyFor = (id: string) => TOOLS.find((t) => t.id === id)?.key ?? "";

const Icon = {
  prev: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M16 5v14l-9-7z" /><rect x="5" y="5" width="2" height="14" rx="1" /></svg>,
  next: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M8 5v14l9-7z" /><rect x="17" y="5" width="2" height="14" rx="1" /></svg>,
  toStart: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M18 5v14l-9-7z" /><rect x="6" y="5" width="2" height="14" rx="1" /></svg>,
  toEnd: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M6 5v14l9-7z" /><rect x="16" y="5" width="2" height="14" rx="1" /></svg>,
} as const;

const TRACKS = [
  { label: "V2 TTL", kind: "title", alpha: 1 },
  { label: "V1 VID", kind: "video", alpha: 1 },
  { label: "A1 SND", kind: "audio", alpha: 0.9 },
] as const;

function jump(dir: number, cutRef: React.MutableRefObject<number>, elapsed: React.MutableRefObject<number>, setCut: (n: number) => void) {
  const next = (cutRef.current + dir + N * 4) % N;
  cutRef.current = next;
  elapsed.current = next * SEG + 1;
  setCut(next);
}

function TransportBtn({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[var(--fg-muted)] transition-colors hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
    >
      {children}
    </button>
  );
}

function Slider({ name, value, tint }: { name: string; value: number; tint: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[12px] text-[var(--fg)]">{name}</span>
        <span className="font-mono text-[11px] tabular-nums text-[var(--fg-muted)]">{value}</span>
      </div>
      <div className="relative h-1 rounded-full bg-[var(--line-strong)]">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${value}%`, background: tint }} />
        <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--bg)]" style={{ left: `${value}%`, background: tint }} />
      </div>
    </div>
  );
}

export default HeroEditor;
