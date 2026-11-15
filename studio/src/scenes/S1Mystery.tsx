import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { HeroFlight } from "./HeroFlight";
import { KineticTitle } from "../components/KineticTitle";
import { DP } from "../branding/brand";
import { K, SCENES, f } from "../projects/contrails/timeline";

/** SHOT 1 — the mystery: cruise air-to-air, push onto the trail at "white line",
 *  then SMOKE? (red, on "dhuaan") / OR SCIENCE? (on "ya phir kuch aur"). */
export const S1Mystery: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = SCENES.mystery.from;
  const smokeAt = f(K.dhuaan.on - s0);
  const sciAt = f(6.93 - s0);
  const shade = interpolate(frame, [smokeAt - 6, smokeAt + 10], [0, 0.42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <HeroFlight shot={{ pushAt: K.line.on - 0.25 - s0, pushDur: 1.5 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, rgba(2,6,23,${shade}) 0%, rgba(2,6,23,${shade * 0.4}) 70%)` }} />
      <KineticTitle top={560} lines={[
        { text: "SMOKE?", at: smokeAt, color: DP.red, size: 190, tracking: 2 },
        { text: "OR SCIENCE?", at: sciAt, color: DP.white, size: 118, tracking: 1 },
      ]} />
    </AbsoluteFill>
  );
};
