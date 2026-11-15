import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { SkyScene } from "../three/SkyScene";
import { Chip } from "../components/Chip";
import { DP } from "../branding/brand";
import { projectToScreen } from "../three/project";
import { K, SCENES, f } from "../projects/contrails/timeline";

const SPLIT_AT = 12.35; // reel s, pause before "Kabhi ye kuch seconds mein..."
const EL = (deg: number) => (deg * Math.PI) / 180;
const groundCam = (elev: number, fov: number, az = 0) => ({
  position: [0, 0, 0] as [number, number, number],
  target: [Math.sin(az) * Math.cos(EL(elev)) * 1000, Math.sin(EL(elev)) * 1000, -Math.cos(az) * Math.cos(EL(elev)) * 1000] as [number, number, number],
  fov,
});

/** Two jets overhead: only the higher one (colder air) leaves a trail. */
const TWO_CAM = { ...groundCam(68, 11), roll: 0.0 };
const TWO = [
  { p0: [-560, 10600, -4100] as [number, number, number], heading: 0.12, scale: 1.8, trail: { r0: 3, grow: 2.2, opacity: 0.32, spacing: 3.5 } },
  { p0: [520, 9200, -3900] as [number, number, number], heading: Math.PI + 0.2, scale: 1.8, trail: null },
];
const planeAt = (i: number, t: number): [number, number, number] => {
  const fl = TWO[i]; const v = 230;
  return [fl.p0[0] + Math.cos(fl.heading) * v * t, fl.p0[1], fl.p0[2] - Math.sin(fl.heading) * v * t];
};
const TwoPlanes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const s0 = SCENES.contradiction.from;
  const [ax, ay] = projectToScreen(planeAt(0, t), TWO_CAM, width, height);
  const [bx, by] = projectToScreen(planeAt(1, t), TWO_CAM, width, height);
  return (
    <AbsoluteFill>
      <SkyScene t={t} width={width} height={height} mode="ground" camera={TWO_CAM} flights={TWO} />
      <Chip at={f(9.3 - s0)} x={ax - 40} y={ay - 90} text="TRAIL" color={DP.blue} size={34} />
      <Chip at={f(K.nahiDikhti.on - s0)} x={bx + 10} y={by + 95} text="NO TRAIL?" color={DP.red} size={34} />
    </AbsoluteFill>
  );
};

/** One pane of the comparison: ground view looking north, jet flying away. */
const Pane: React.FC<{ kind: "short" | "persist"; t: number }> = ({ kind, t }) => {
  const { height } = useVideoConfig();
  const persist = kind === "persist";
  // time-lapse only for the persistent pane's plume evolution (labelled on screen)
  const ageScale = persist ? interpolate(t, [0, 4.7], [3, 12], { extrapolateRight: "clamp" }) : 1;
  return (
    <SkyScene t={t} width={540} height={height} mode="ground" camera={groundCam(64, 13, 0)} sky={{ cirrus: persist ? 0.2 : 0.05 }} flights={[
      { p0: [-70, 10500, -4400], heading: Math.PI / 2 + 0.035, scale: 1.7, trail: persist
        ? { r0: 2.6, grow: 1.6, spread: 0.32, tau: 1e6, ageScale, gapAge: 0.25 * ageScale, sink: 0.5, opacity: 0.26, spacing: 3, wind: [2, 0, 0], tStart: -60 }
        : { r0: 2.6, grow: 1.8, spread: 0, tau: 0.55, gapAge: 0.25, sink: 2, opacity: 0.36, spacing: 3, tStart: -20 } },
    ]} />
  );
};

const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const wipe = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const base = SPLIT_AT;
  return (
    <AbsoluteFill style={{ background: DP.bg }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 540, height: 1920, overflow: "hidden", clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}><Pane kind="short" t={t} /></div>
      <div style={{ position: "absolute", left: 540, top: 0, width: 540, height: 1920, overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)` }}><Pane kind="persist" t={t} /></div>
      <div style={{ position: "absolute", left: 537, top: 0, width: 6, height: 1920 * wipe, background: DP.white, boxShadow: "0 0 24px rgba(255,255,255,0.6)" }} />
      <Chip at={f(K.gayab.on - base) - 4} x={270} y={330} text="DISAPPEARS" color={DP.red} size={34} sub="IN SECONDS" />
      <Chip at={f(K.ghanton.on - base) - 4} x={810} y={330} text="PERSISTS" color={DP.blue} size={34} sub="FOR HOURS" />
      <Chip at={f(K.ghanton.on - base) + 6} x={810} y={1110} text="TIME-LAPSE" color={DP.white} size={24} solid={false} />
    </AbsoluteFill>
  );
};

export const S2Contradiction: React.FC = () => {
  const s0 = SCENES.contradiction.from;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={f(SPLIT_AT - s0)}>
        <TwoPlanes />
      </Sequence>
      <Sequence from={f(SPLIT_AT - s0)}>
        <Split />
      </Sequence>
    </AbsoluteFill>
  );
};
