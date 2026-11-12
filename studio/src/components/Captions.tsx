import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { DP, SAFE } from "../branding/brand";
import { RichText } from "./RichText";

export type Caption = { from: number; to: number; text: string };
/** Burned-in phrase captions timed to measured speech; max two lines. */
export const Captions: React.FC<{ captions: Caption[]; hidden?: (t: number) => boolean }> = ({ captions, hidden }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = captions.find((x) => t >= x.from - 0.04 && t < x.to);
  if (!c || hidden?.(t)) return null;
  const fIn = (c.from - 0.04) * fps, fOut = c.to * fps;
  const o = interpolate(frame, [fIn, fIn + 4, fOut - 3, fOut], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [fIn, fIn + 6], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: SAFE.captionY, display: "flex", justifyContent: "center", transform: `translateY(calc(-50% + ${y}px))`, opacity: o }}>
      <div style={{ maxWidth: 880, padding: "16px 30px 18px", borderRadius: 24, background: "rgba(2,6,23,0.72)", boxShadow: "0 8px 30px rgba(2,6,23,0.35)", border: "1px solid rgba(203,213,225,0.10)",
        fontFamily: DP.text, fontWeight: 800, fontSize: 50, lineHeight: 1.22, color: DP.white, textAlign: "center", letterSpacing: -0.4, textWrap: "balance" as never }}>
        <RichText text={c.text} />
      </div>
    </div>
  );
};
