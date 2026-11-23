import { useCurrentFrame, interpolate, Easing } from "remotion";
import { DP } from "../branding/brand";

/** Scientific callout: anchor dot → leader line draws → label card slides in. */
export const SciLabel: React.FC<{ at: number; anchor: [number, number]; box: [number, number]; title: string; sub?: string; color?: string; outAt?: number; width?: number }> = ({ at, anchor, box, title, sub, color = DP.blue, outAt, width = 470 }) => {
  const f = useCurrentFrame();
  const e = Easing.bezier(0.16, 1, 0.3, 1);
  const dot = interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const line = interpolate(f, [at + 3, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const card = interpolate(f, [at + 10, at + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const out = outAt === undefined ? 0 : interpolate(f, [outAt, outAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (f < at) return null;
  const [ax, ay] = anchor, [bx, by] = box;
  const len = Math.hypot(bx - ax, by - ay);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={ax} cy={ay} r={10 * dot} fill="none" stroke={DP.white} strokeWidth={3} />
        <circle cx={ax} cy={ay} r={4.5 * dot} fill={DP.white} />
        <line x1={ax} y1={ay} x2={ax + (bx - ax) * line} y2={ay + (by - ay) * line} stroke={DP.white} strokeWidth={3} strokeDasharray={len} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: bx - (bx > 540 ? width : 0), top: by - 44, width, opacity: card, transform: `translateX(${(1 - card) * (bx > 540 ? 30 : -30)}px)` }}>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 6, padding: "14px 22px", borderRadius: 18, background: "rgba(2,6,23,0.78)", borderLeft: `6px solid ${color}`, boxShadow: "0 10px 30px rgba(2,6,23,0.4)" }}>
          <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 46, color: DP.white, letterSpacing: -0.5, lineHeight: 1.05 }}>{title}</div>
          {sub && <div style={{ fontFamily: DP.text, fontWeight: 500, fontSize: 30, color: DP.muted, lineHeight: 1.2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};
