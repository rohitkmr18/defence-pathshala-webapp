import { useCurrentFrame, interpolate, Easing } from "remotion";
import { DP } from "../branding/brand";

export type TitleLine = { text: string; at: number; color?: string; size?: number; weight?: number; tracking?: number; font?: string };
/** Masked wipe-up reveal with a controlled scale settle and tracking tighten.
 *  `at` values are frames relative to the parent Sequence. */
export const KineticTitle: React.FC<{ lines: TitleLine[]; top: number; outAt?: number; align?: "center" | "left"; left?: number }> = ({ lines, top, outAt, align = "center", left = 0 }) => {
  const frame = useCurrentFrame();
  const out = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top, left: align === "center" ? 0 : left, right: 0, display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: 6, opacity: 1 - out, transform: `translateY(${-30 * out}px)` }}>
      {lines.map((l, i) => {
        const p = interpolate(frame, [l.at, l.at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
        const s = interpolate(frame, [l.at, l.at + 22], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
        const tr = (l.tracking ?? -2) + (1 - p) * 10;
        return (
          <div key={i} style={{ overflow: "hidden", padding: "4px 12px" }}>
            <div style={{ transform: `translateY(${(1 - p) * 105}%) scale(${s})`, fontFamily: l.font ?? DP.display, fontWeight: l.weight ?? 900, fontSize: l.size ?? 120, lineHeight: 1.0, color: l.color ?? DP.white, letterSpacing: tr, textShadow: "0 6px 40px rgba(2,6,23,0.55)", whiteSpace: "nowrap" }}>
              {l.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
