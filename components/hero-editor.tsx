"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile, themes } from "@/lib/content";
import { ThemeArt } from "@/components/theme-poster";

/**
 * The hero as an original non-linear editor.
 *
 * A stylised, believable editing app — "PARAS·CUT" — not a copy of any real
 * product: its own name, its own panel labels, its own layout. A clip plays in
 * the program monitor, the playhead sweeps the timeline, and the title
 * "PARAS GUPTA" reveals over the footage on every cut, the way a motion
 * designer would key a title. It is a mock: the playhead moves, play/pause
 * toggles, clips light up as the head crosses them, but nothing here edits.
 *
 * One rAF loop drives it, writing the playhead position straight to the DOM and
 * only re-rendering React when the cut changes. Paused when the tab is hidden,
 * and under reduced motion it holds a single composed frame with the title up.
 */

const LOOP_MS = 12000;
const CLIPS = themes; // four worlds, used as the sequence's clips
const N = CLIPS.length;
const SEG = LOOP_MS / N; // each clip's slot on the timeline

const two = (n: number) => String(Math.floor(n)).padStart(2, "0");
const timecode = (ms: number) => `${two(ms / 1000 / 60)}:${two((ms / 1000) % 60)}`;

export function HeroEditor() {
  const reduced = useReducedMotion();

  const [cut, setCut] = useState(0);
  const [playing, setPlaying] = useState(!reduced);

  const playheadRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  const cutRef = useRef(0);
  const playingState = useRef(!reduced);

  useEffect(() => {
    playingState.current = playing;
  }, [playing]);

  // Static composed frame for reduced motion: first clip, title shown, head at 0.
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

  const panel = "rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--bg-tile)]";
  const label = "font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-muted)]";

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col px-[clamp(12px,3vw,28px)] pb-5 pt-[76px] sm:pt-20">
      <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line-strong)] bg-[var(--bg-raised)] shadow-[var(--shadow-lift)]`}>
        {/* ── App bar ─────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--bg-tile)] px-3 py-2 sm:px-4">
          <span className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-[var(--accent)] font-display text-[11px] font-bold text-[var(--accent-ink)]">▸</span>
            <span className="font-display text-[14px] font-bold tracking-[-0.02em] text-[var(--fg)]">
              PARAS<span className="text-[var(--accent)]">·</span>CUT
            </span>
            <span className={`${label} hidden sm:inline`}>v1.0</span>
          </span>
          <nav className="ml-2 hidden items-center gap-4 md:flex">
            {["Project", "Sequence", "Effects", "Colour", "Export"].map((m) => (
              <span key={m} className="font-mono text-[11px] text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]">{m}</span>
            ))}
          </nav>
          <span className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className={label}>Rendering · {profile.initials}</span>
            </span>
            <span className="flex items-center gap-1.5" aria-hidden>
              {["#5b5", "#eb4", "#e55"].map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
              ))}
            </span>
          </span>
        </div>

        {/* ── Middle: bin · monitor · controls ────────────────────── */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(200px,230px)_1fr_minmax(200px,230px)]">
          {/* Media bin */}
          <aside className="hidden min-h-0 flex-col gap-2 border-r border-[var(--line)] p-3 lg:flex">
            <p className={label}>Media bin</p>
            <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
              {CLIPS.map((c, i) => (
                <li
                  key={c.slug}
                  className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] border px-2 py-2 transition-colors ${
                    i === cut ? "border-[var(--line-strong)] bg-[var(--bg-raised)]" : "border-transparent"
                  }`}
                >
                  <span className="h-8 w-11 shrink-0 overflow-hidden rounded-[4px]" style={{ background: `linear-gradient(135deg, ${c.palette[0]}, ${c.palette[2]})` }} />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-medium text-[var(--fg)]">{c.name}</span>
                    <span className={`${label} block truncate`}>{c.event}</span>
                  </span>
                  {i === cut ? <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" /> : null}
                </li>
              ))}
            </ul>
            <p className={label}>4 clips · 00:12 total</p>
          </aside>

          {/* Program monitor */}
          <div className="relative flex min-h-0 min-w-0 flex-col bg-[var(--bg)] p-3">
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-black">
              {/* The "footage": the active world art */}
              <div className="absolute inset-0">
                <ThemeArt theme={active} />
              </div>
              {/* A playing sheen sweeping across, plus a subtle vignette */}
              {!reduced ? (
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)", backgroundSize: "260% 100%" }}
                  animate={{ backgroundPosition: ["140% 0", "-40% 0"] }}
                  transition={{ duration: 3.4, ease: "linear", repeat: Infinity }}
                />
              ) : null}
              <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]" />

              {/* Monitor overlay chrome */}
              <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">Program</span>
              <span className="absolute right-3 top-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> 4K · 24fps
              </span>

              {/* The title layer — PARAS GUPTA, re-keyed on every cut so it reveals */}
              <div className="relative z-10 w-full px-6 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reduced ? "static" : cut}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.p
                      initial={reduced ? false : { y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/80"
                    >
                      {profile.role}
                    </motion.p>
                    <h1 className="mt-1 overflow-hidden font-display text-[clamp(2.4rem,7vw,6rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-white">
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
                        style={{ color: "transparent", WebkitTextStroke: "1.5px #fff" }}
                      >
                        {profile.last}
                      </motion.span>
                    </h1>
                    {/* Lower third: which world is on the monitor */}
                    <motion.p
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.palette[0] }} />
                      {active.event} · {active.name}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Transport */}
            <div className="mt-3 flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-1.5">
                <TransportBtn label="Previous clip" onClick={() => jump(-1, cutRef, elapsed, setCut)}>⏮</TransportBtn>
                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] transition-transform hover:scale-105"
                >
                  {playing ? "❚❚" : "▶"}
                </button>
                <TransportBtn label="Next clip" onClick={() => jump(1, cutRef, elapsed, setCut)}>⏭</TransportBtn>
              </div>
              <span ref={tcRef} className="font-mono text-[12px] tabular-nums text-[var(--fg-muted)]">00:00 / 00:12</span>
              {/* Scrubber mirrors the playhead */}
              <div className="relative ml-auto hidden h-1 flex-1 overflow-hidden rounded-full bg-[var(--line)] sm:block">
                <div ref={scrubRef} className="absolute inset-y-0 left-0 w-0 bg-[var(--accent)]" />
              </div>
            </div>
          </div>

          {/* Controls / effects */}
          <aside className="hidden min-h-0 flex-col gap-4 border-l border-[var(--line)] p-3 lg:flex">
            <div>
              <p className={label}>Title · effect controls</p>
              <div className="mt-3 flex flex-col gap-3">
                <Slider name="Title opacity" value={92} tint={active.palette[0]} />
                <Slider name="Scale" value={64} tint={active.palette[1]} />
                <Slider name="Blur" value={18} tint={active.palette[2]} />
                <Slider name="Playback speed" value={50} tint="var(--accent)" />
              </div>
            </div>
            <div className="mt-1">
              <p className={label}>Toggles</p>
              <div className="mt-2.5 flex flex-col gap-2">
                {[["Loop sequence", true], ["Film grain", true], ["Snap to cut", false]].map(([t, on]) => (
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
                <li>› Colour / {active.palette[0]}</li>
                <li>› Motion Blur 180°</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* ── Timeline ────────────────────────────────────────────── */}
        <div className="relative shrink-0 border-t border-[var(--line)] bg-[var(--bg-tile)] p-3">
          {/* Ruler */}
          <div className="mb-1.5 flex items-center justify-between">
            <span className={label}>Timeline · sequence_01</span>
            <span className={label}>00:12:00</span>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)]">
            {/* ticks */}
            <div aria-hidden className="flex h-4 items-end border-b border-[var(--line)]">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="flex-1 border-l border-[var(--line)]" style={{ height: i % 4 === 0 ? "100%" : "45%" }} />
              ))}
            </div>

            {/* tracks */}
            <div className="flex flex-col">
              {TRACKS.map((track, ti) => (
                <div key={track.label} className="relative flex h-9 items-center border-b border-[var(--line)] last:border-b-0">
                  <span className="absolute left-2 z-10 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">{track.label}</span>
                  <div className="relative ml-[64px] mr-2 h-full flex-1">
                    {CLIPS.map((c, i) => {
                      const on = i === cut;
                      const isTitle = ti === 0;
                      return (
                        <div
                          key={c.slug}
                          className="absolute top-1/2 flex h-[62%] -translate-y-1/2 items-center overflow-hidden rounded-[4px] px-2 transition-[filter,box-shadow] duration-200"
                          style={{
                            left: `${(i / N) * 100 + 0.5}%`,
                            width: `${(1 / N) * 100 - 1}%`,
                            background: isTitle
                              ? `${c.palette[0]}`
                              : `linear-gradient(90deg, ${c.palette[0]}cc, ${c.palette[2]}cc)`,
                            opacity: track.alpha,
                            filter: on ? "brightness(1.12) saturate(1.1)" : "brightness(0.8)",
                            boxShadow: on ? `0 0 0 1.5px var(--fg)` : "none",
                          }}
                        >
                          <span className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-black/80">
                            {isTitle ? "PARAS GUPTA" : track.kind === "audio" ? "WAVEFORM" : c.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Playhead */}
            <div
              ref={playheadRef}
              aria-hidden
              className="pointer-events-none absolute bottom-0 top-0 z-20 ml-[64px] w-px bg-[var(--accent)]"
              style={{ left: "0%" }}
            >
              <span className="absolute -left-[5px] -top-[1px] h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[var(--accent)]" />
            </div>
          </div>
          <p className={`${label} mt-2`}>Scroll to explore the work ↓</p>
        </div>
      </div>
    </section>
  );
}

const TRACKS = [
  { label: "V2 · TITLES", kind: "title", alpha: 1 },
  { label: "V1 · FOOTAGE", kind: "video", alpha: 1 },
  { label: "A1 · SOUND", kind: "audio", alpha: 0.55 },
] as const;

function jump(
  dir: number,
  cutRef: React.MutableRefObject<number>,
  elapsed: React.MutableRefObject<number>,
  setCut: (n: number) => void,
) {
  const next = (cutRef.current + dir + N) % N;
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
      className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[12px] text-[var(--fg-muted)] transition-colors hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
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
        <span className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[var(--bg)]" style={{ left: `${value}%`, background: tint }} />
      </div>
    </div>
  );
}

export default HeroEditor;
