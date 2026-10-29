/**
 * Critically-damped spring follow, the Unity `SmoothDamp` formulation.
 *
 * Used instead of `lerp` on the advice of oil-oil/oil-motion, and the reason is
 * worth stating: `lerp(current, target, k)` is frame-rate dependent and has no
 * velocity, so it goes sticky when the frame rate varies and stalls visibly
 * every time the input reverses. Keeping velocity across frames means a
 * reversal carries momentum through the turn instead of stopping dead at it.
 *
 * `maxSpeed` exists to stop an unnaturally fast whip when the pointer jumps
 * across the screen, and `dt` is capped by the caller so that a backgrounded
 * tab does not resume with one enormous jump.
 */
export type Damped = { value: number; velocity: number };

export function smoothDamp(
  state: Damped,
  target: number,
  smoothTime: number,
  maxSpeed: number,
  dt: number,
): number {
  const t = Math.max(0.0001, smoothTime);
  const omega = 2 / t;

  // Rational approximation of exp(-x), which is what makes this cheap enough
  // to run per axis per frame.
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let change = state.value - target;
  const maxChange = maxSpeed * t;
  change = Math.max(-maxChange, Math.min(maxChange, change));

  const goal = state.value - change;
  const temp = (state.velocity + omega * change) * dt;

  state.velocity = (state.velocity - omega * temp) * exp;
  let output = goal + (change + temp) * exp;

  // Clamp overshoot, otherwise the value oscillates around the target forever.
  if (target - state.value > 0 === output > target) {
    output = target;
    state.velocity = (output - goal) / dt;
  }

  state.value = output;
  return output;
}
