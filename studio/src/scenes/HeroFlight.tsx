import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { SkyDome } from "../three/SkyDome";
import { Contrail } from "../three/Contrail";
import { Airliner, ENGINE_EXHAUST, useSkyEnv, useAirlinerModel } from "../three/Airliner";
import type * as THREE from "three";
import { CameraRig } from "../three/CameraRig";
import { lerp } from "../lib/motion";
import { SettleFrame } from "../three/SettleFrame";

const V = 230; // m/s, typical airliner cruise true airspeed
const SUN: [number, number, number] = [0.25, 0.5, 0.83];

type Shot = { pushAt: number; pushDur: number };

const Scene: React.FC<{ t: number; shot: Shot; w: number; h: number; model: THREE.Group | null }> = ({ t, shot, h, model }) => {
  const gl = useThree((s) => s.gl);
  const env = useSkyEnv(gl);
  const px = V * t;
  // camera flies alongside slightly slower than the jet → jet drifts across frame
  const push = interpolate(t, [shot.pushAt, shot.pushAt + shot.pushDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const camPos: [number, number, number] = [V * t * 0.95 - 120 + lerp(0, -60, push), -34 + lerp(0, 10, push), 195 + lerp(0, 50, push)];
  const target: [number, number, number] = [V * t * 0.95 - 4 + lerp(0, -230, push), -12 + lerp(0, -4, push), 0];
  const fov = lerp(40, 30, push);
  return (
    <>
      <CameraRig position={camPos} target={target} fov={fov} roll={0.34 - 0.08 * push} />
      <SkyDome mode="cruise" time={t} sunDir={SUN} cirrus={0.14} deckAltitude={6500} zenith="#041a52" horizon="#6fa3e0" />
      <hemisphereLight args={["#bcd6ff", "#f2f5fb", 1.1]} />
      <directionalLight position={[SUN[0] * 1000 + px, SUN[1] * 1000, SUN[2] * 1000]} intensity={3.2} color="#fff6ea" />
      <Airliner model={model} position={[px, 0, 0]} rotation={[0.03, 0, 0]} envMap={env} />
      <Contrail time={t} viewportHeight={h} fovDeg={fov} params={{
        p0: [0, 0, 0], v: [V, 0, 0], engines: ENGINE_EXHAUST, tStart: -7, tEnd: 9, spacing: 0.5,
        gapAge: 0.2, tau: 10, r0: 0.45, grow: 1.05, sink: 1.6, merge: 6, opacity: 0.2, seed: 11,
      }} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.45} luminanceThreshold={0.9} luminanceSmoothing={0.15} mipmapBlur />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.25} />
        <Vignette darkness={0.55} offset={0.32} />
      </EffectComposer>
      <SettleFrame passes={3} />
    </>
  );
};

/** Air-to-air tracking shot at cruise; `from` = scene start in reel seconds. */
export const HeroFlight: React.FC<{ shot?: Shot; timeOffset?: number }> = ({ shot = { pushAt: 3.0, pushDur: 1.6 }, timeOffset = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps + timeOffset;
  const model = useAirlinerModel();
  return (
    <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 34, near: 0.5, far: 60000 }}>
      <Scene t={t} shot={shot} w={width} h={height} model={model} />
    </ThreeCanvas>
  );
};
