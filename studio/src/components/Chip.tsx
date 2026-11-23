import { useCurrentFrame, interpolate, Easing } from "remotion";
import { DP } from "../branding/brand";
/** Pill label with a scale-in; used for comparison headers and small tags. */
export const Chip: React.FC<{ at: number; text: string; color?: string; x: number; y: number; size?: number; anchor?: "center" | "left" | "right"; sub?: string; outAt?: number; solid?: boolean }> = ({ at, text, color = DP.blue, x, y, size = 40, anchor = "center", sub, outAt, solid = true }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const o = interpolate(f, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (outAt === undefined ? 1 : interpolate(f, [outAt, outAt + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  if (f < at) return null;
  const tx = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0%";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) scale(${0.85 + 0.15 * p})`, opacity: o, display: "flex", flexDirection: "column", alignItems: anchor === "right" ? "flex-end" : anchor === "left" ? "flex-start" : "center", gap: 8 }}>
      <div style={{ padding: `${size * 0.28}px ${size * 0.55}px`, borderRadius: 999, background: solid ? color : "rgba(2,6,23,0.75)", border: solid ? "none" : `3px solid ${color}`, fontFamily: DP.display, fontWeight: 900, fontSize: size, color: DP.white, letterSpacing: 0.5, whiteSpace: "nowrap", boxShadow: "0 8px 26px rgba(2,6,23,0.45)" }}>{text}</div>
      {sub && <div style={{ fontFamily: DP.text, fontWeight: 800, fontSize: Math.max(size * 0.62, 26), color: DP.white, textShadow: "0 2px 12px rgba(2,6,23,0.9)", whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
};
