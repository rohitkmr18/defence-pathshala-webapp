import { Easing, interpolate } from "remotion";
/** Frame-based easing helpers (deterministic). */
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ease = Easing.bezier(0.22, 1, 0.36, 1); // expo-out-ish, premium settle
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const prog = (f: number, start: number, dur: number, e = ease) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sec = (s: number, fps = 30) => Math.round(s * fps);
// From video-shotcraft helpers/motion.ts (Apache-2.0): closed-form damped settle.
export const dampedSettle = (t: number, freq: number, damping: number): number =>
  t <= 0 ? 0 : Math.exp(-damping * t) * Math.sin(2 * Math.PI * freq * t);
