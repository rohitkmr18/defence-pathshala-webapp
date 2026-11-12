import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type * as THREE from "three";
import { SkyDome, SkyMode } from "./SkyDome";
import { Contrail, ContrailParams } from "./Contrail";
import { Airliner, ENGINE_EXHAUST, useSkyEnv, useAirlinerModel } from "./Airliner";
import { CameraRig } from "./CameraRig";
import { SettleFrame } from "./SettleFrame";

export type Flight = {
  p0: [number, number, number]; // position at t = 0 (scene seconds)
  heading: number; // radians, 0 = +X, rotates about +Y (π/2 = −Z, "north")
  speed?: number;
  trail?: Partial<ContrailParams> | null;
  scale?: number;
};
export type SkySceneProps = {
  t: number; width: number; height: number;
  mode: SkyMode; camera: { position: [number, number, number]; target: [number, number, number]; fov: number; roll?: number };
  flights: Flight[];
  sky?: { zenith?: string; horizon?: string; cirrus?: number; sunDir?: [number, number, number]; exposure?: number };
  bloom?: number;
};

const Inner: React.FC<SkySceneProps & { model: THREE.Group | null }> = ({ t, height, mode, camera, flights, sky = {}, model, bloom = 0.4 }) => {
  const gl = useThree((s) => s.gl);
  const env = useSkyEnv(gl);
  const sun = sky.sunDir ?? [0.3, 0.75, 0.4];
  return (
    <>
      <CameraRig position={camera.position} target={camera.target} fov={camera.fov} roll={camera.roll ?? 0} near={mode === "ground" ? 50 : 0.5} far={80000} />
      <SkyDome mode={mode} time={t} sunDir={sun} zenith={sky.zenith ?? (mode === "ground" ? "#1c5ad6" : "#041a52")} horizon={sky.horizon ?? (mode === "ground" ? "#a9d0f7" : "#6fa3e0")} cirrus={sky.cirrus ?? 0.12} exposure={sky.exposure ?? 1} />
      <hemisphereLight args={["#bcd6ff", "#f2f5fb", 1.1]} />
      <directionalLight position={[sun[0] * 1000, sun[1] * 1000, sun[2] * 1000]} intensity={3.2} color="#fff6ea" />
      {flights.map((fl, i) => {
        const v = fl.speed ?? 230;
        const vx = Math.cos(fl.heading) * v, vz = -Math.sin(fl.heading) * v;
        const pos: [number, number, number] = [fl.p0[0] + vx * t, fl.p0[1], fl.p0[2] + vz * t];
        // rotate engine offsets with heading (model nose = +X)
        const c = Math.cos(fl.heading), s = Math.sin(fl.heading), k = fl.scale ?? 1;
        const engines = ENGINE_EXHAUST.map(([x, y, z]) => [(x * c + z * s) * k, y * k, (-x * s + z * c) * k] as [number, number, number]);
        return (
          <group key={i}>
            <Airliner model={model} position={pos} rotation={[0, fl.heading, 0]} scale={k} envMap={env} />
            {fl.trail !== null && (
              <Contrail time={t} viewportHeight={height} fovDeg={camera.fov} params={{
                p0: fl.p0, v: [vx, 0, vz], engines, tStart: -40, tEnd: t + 0.1, spacing: 4,
                gapAge: 0.25, tau: 1e6, r0: 2.5, grow: 2.4, sink: 2, merge: 6, opacity: 0.3, seed: 3 + i,
                ...(fl.trail ?? {}),
              }} />
            )}
          </group>
        );
      })}
      <EffectComposer multisampling={0}>
        <Bloom intensity={bloom} luminanceThreshold={0.9} luminanceSmoothing={0.15} mipmapBlur />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.22} />
        <Vignette darkness={0.5} offset={0.3} />
      </EffectComposer>
      <SettleFrame passes={3} />
    </>
  );
};

/** Generic sky shot: ground-view telephoto or cruise, N aircraft with contrails. */
export const SkyScene: React.FC<SkySceneProps> = (p) => {
  const model = useAirlinerModel();
  return (
    <ThreeCanvas width={p.width} height={p.height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: p.camera.fov, near: 1, far: 80000 }}>
      <Inner {...p} model={model} />
    </ThreeCanvas>
  );
};
