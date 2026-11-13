import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { DP } from "../branding/brand";

/** Official DP logo (unaltered file) on a white plate, top-right, inside the
 *  platform-safe area. The plate keeps the blue mark legible on blue skies. */
export const LogoBug: React.FC<{ size?: number }> = ({ size = 104 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 168, right: 44, width: size, height: size, borderRadius: size * 0.24, background: "rgba(255,255,255,0.96)", boxShadow: "0 6px 24px rgba(2,6,23,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: o }}>
      <Img src={staticFile(DP.logo)} style={{ width: size * 0.74, height: "auto" }} />
    </div>
  );
};
