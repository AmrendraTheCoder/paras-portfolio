"use client";

import { useEffect, useRef, useState } from "react";
import { smoothDamp, type Damped } from "@/lib/smooth-damp";

/**
 * The pointer.
 *
 * A coral dot inside a trailing ring. Over anything clickable the dot turns
 * white and the ring opens around it; over a field the ring becomes a caret.
 * That is the whole vocabulary.
 *
 * It used to name the action and borrow the brand colour of what it was over.
 * Both were dropped on purpose: a cursor that reads as a caption competes with
 * the page it is pointing at, and the only things a pointer owes you are where
 * it is and whether what is under it does something.
 *
 * Two bodies, two speeds. The dot is nearly rigid (0.02s) so aiming never feels
 * laggy, which is the usual complaint about cursors like this. The ring trails
 * at 0.09s, and that gap is the whole effect: it stretches behind on a fast
 * flick and settles when you stop.
 *
 * Rules it will not break:
 *
 *  - **Fine pointers only.** Never mounts for touch, where there is no cursor
 *    to replace and a lagging ring would be a bug with no cause.
 *  - **Reduced motion gets the system cursor.** Nothing here is information you
 *    can only get this way, so it is safe to switch off entirely.
 *  - **The native cursor is only hidden after this has mounted and painted.**
 *    If the script fails, the browser keeps its own cursor. A page with no
 *    visible pointer is not a page you can recover from.
 *  - **`pointer-events: none`.** It can never eat a click.
 *
 * Interactivity is inferred from the element rather than annotated, so every
 * link, button and field on the site behaves correctly without anyone
 * remembering to mark it up.
 */

type Mode = "idle" | "link" | "text";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  // Gate on capability, not on width: a small laptop has a fine pointer and a
  // large tablet does not.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setEnabled(fine.matches && !still.matches);
    read();
    fine.addEventListener("change", read);
    still.addEventListener("change", read);
    return () => {
      fine.removeEventListener("change", read);
      still.removeEventListener("change", read);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    // Only now: the elements exist and are about to be positioned.
    document.documentElement.classList.add("has-cursor");

    const dx: Damped = { value: -100, velocity: 0 };
    const dy: Damped = { value: -100, velocity: 0 };
    const rx: Damped = { value: -100, velocity: 0 };
    const ry: Damped = { value: -100, velocity: 0 };
    const scale: Damped = { value: 1, velocity: 0 };

    let tx = -100;
    let ty = -100;
    let mode: Mode = "idle";
    let down = false;
    let visible = false;
    let raf = 0;
    let last = performance.now();

    /**
     * Only three answers, and none of them is a label.
     *
     * An earlier version named the action ("Email", "Download", "GitHub") and
     * took the brand colour of whatever it was over. It was clever and it was
     * too much: a cursor that reads as a caption competes with the page it is
     * pointing at. What a pointer owes you is where it is and whether the thing
     * under it does something. Colour carries that on its own.
     */
    const describe = (el: Element): Mode => {
      if (el.closest("a[href], button, [role='button'], summary, select, [data-cursor]"))
        return "link";
      if (el.closest("input, textarea")) return "text";
      return "idle";
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      if (!visible) {
        visible = true;
        d.style.opacity = "1";
        r.style.opacity = "1";
        // Jump both bodies to the pointer on first sight, so the ring does not
        // fly in from the corner on entry.
        dx.value = rx.value = tx;
        dy.value = ry.value = ty;
      }

      const el = e.target as Element | null;
      if (!el) return;
      const next = describe(el);
      if (next !== mode) {
        mode = next;
        r.dataset.mode = mode;
        d.dataset.mode = mode;
      }
    };

    const onLeave = () => {
      visible = false;
      d.style.opacity = "0";
      r.style.opacity = "0";
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      // Argument order is (state, target, smoothTime, maxSpeed, dt). Passing
      // dt where maxSpeed goes clamps maxChange to maxSpeed * smoothTime,
      // roughly 0.0003px per frame, and the cursor sits still while every
      // computed style still looks perfectly correct.
      // The dot is almost rigid; the ring is the one that lags.
      smoothDamp(dx, tx, 0.02, 12000, dt);
      smoothDamp(dy, ty, 0.02, 12000, dt);
      smoothDamp(rx, tx, 0.09, 12000, dt);
      smoothDamp(ry, ty, 0.09, 12000, dt);

      // 1.45, not 2.1. A 36px ring at 2.1 is a 76px disc sitting on top of the
      // thing you are trying to read, and it arrives before you have finished
      // aiming at the link. Enough growth to register as a state change, not
      // enough to become the largest object on screen.
      const target = (mode === "link" ? 1.45 : mode === "text" ? 0.5 : 1) * (down ? 0.86 : 1);
      // Slightly quicker than the ring's own follow, so the state change reads as
      // a response to the link rather than as the ring catching up with itself.
        smoothDamp(scale, target, 0.09, 40, dt);

      d.style.transform = `translate3d(${dx.value}px, ${dy.value}px, 0) translate(-50%, -50%)`;
      r.style.transform = `translate3d(${rx.value}px, ${ry.value}px, 0) translate(-50%, -50%) scale(${scale.value.toFixed(3)})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ring} className="cursor-ring" data-mode="idle" />
      <div ref={dot} className="cursor-dot" data-mode="idle" />
    </div>
  );
}
