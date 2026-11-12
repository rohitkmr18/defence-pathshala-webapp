import { AbsoluteFill, Sequence, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import * as THREE from "three";
import { CameraRig } from "../three/CameraRig";
import { SettleFrame } from "../three/SettleFrame";
import { SciLabel } from "../components/SciLabel";
import { DP } from "../branding/brand";
import { K, SCENES, f } from "../projects/contrails/timeline";
import cam from "../projects/contrails/engine_camera.json";
import { mulberry32 } from "../lib/rand";

/* ───────────── SHOT 3a — CONTRAIL = CONdensation TRAIL ───────────── */
export const S3Title: React.FC = () => {
  const frame = useCurrentFrame();
  const s0 = SCENES.contrailTitle.from;
  const a1 = f(K.contrail.on - s0), a2 = f(K.condensation.on - s0);
  const e = Easing.bezier(0.16, 1, 0.3, 1);
  const p1 = interpolate(frame, [a1, a1 + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const p2 = interpolate(frame, [a2, a2 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
  const streak = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp", easing: e });
  const drift = frame * 0.6;
  const big = { fontFamily: DP.display, fontWeight: 900, letterSpacing: -4, lineHeight: 1 } as const;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${DP.navy} 0%, ${DP.bg} 70%)` }}>
      {/* a single glowing trail across the frame (the subject, abstracted) */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="tr" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.65" stopColor="#fff" stopOpacity="0.55" /><stop offset="1" stopColor="#fff" stopOpacity="0.95" /></linearGradient>
          <filter id="bl"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <g transform={`rotate(-14 540 960) translate(${-200 + drift} 0)`}>
          <rect x={-300} y={1190} width={1500 * streak} height={26} rx={13} fill="url(#tr)" filter="url(#bl)" />
          <rect x={-300} y={1198} width={1500 * streak} height={10} rx={5} fill="url(#tr)" />
        </g>
      </svg>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", opacity: p1, transform: `scale(${1.15 - 0.15 * p1}) translateY(${-90 * p2}px)` }}>
        <div style={{ ...big, fontSize: 196, color: DP.white }}>
          <span style={{ color: p2 > 0 ? DP.blueLight : DP.white, transition: "none" }}>CON</span>TRAIL
        </div>
      </div>
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: p2, transform: `translateY(${(1 - p2) * 40}px)` }}>
        <div style={{ width: 120 * p2, height: 6, borderRadius: 3, background: DP.blue }} />
        <div style={{ ...big, fontSize: 92, letterSpacing: -1, color: DP.white }}>
          <span style={{ color: DP.blueLight }}>CON</span><span style={{ color: DP.muted, fontWeight: 600 }}>DENSATION</span>
        </div>
        <div style={{ ...big, fontSize: 92, letterSpacing: -1, color: DP.blueLight }}>TRAIL</div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── SHOT 3b — engine: hot moist exhaust meets −40 °C air ───────────── */
type CamFrame = { f: number; pos: [number, number, number]; target: [number, number, number]; up: [number, number, number] };
const FRAMES = cam.camera as unknown as CamFrame[];
const NOZ = cam.nozzle as [number, number, number];
const U = 16; // visualisation speed of the exhaust (m/s, slowed for legibility)

const Plume: React.FC<{ t: number; h: number; cold: number; mix: number }> = ({ t, h, cold, mix }) => {
  const { geom, mat } = useMemo(() => {
    const N = 3400, rand = mulberry32(42);
    const g = new THREE.BufferGeometry();
    const a = new Float32Array(N * 4), b = new Float32Array(N * 4);
    for (let i = 0; i < N; i++) {
      const kind = i < 2400 ? 0 : 1; // 0 = exhaust, 1 = entrained ambient air
      a.set([rand() * 3.2 - 2.2, rand(), rand(), kind], i * 4); // emit time, angle, radius frac, kind
      b.set([rand(), rand(), rand(), rand()], i * 4);
    }
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    g.setAttribute("aA", new THREE.BufferAttribute(a, 4)); g.setAttribute("aB", new THREE.BufferAttribute(b, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: false, blending: THREE.NormalBlending,
      uniforms: { uT: { value: 0 }, uScale: { value: 1 }, uNoz: { value: new THREE.Vector3(...NOZ) }, uU: { value: U }, uCold: { value: 0 }, uMix: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute vec4 aA; attribute vec4 aB; uniform float uT, uScale, uU, uCold, uMix; uniform vec3 uNoz;
        varying vec4 vC; varying float vStreak;
        void main(){
          float period = 3.2; float age = mod(uT - aA.x, period);
          float d = uU * age;                       // metres downstream of the nozzle (schematic, slowed)
          float ang = aA.y * 6.2831; vec3 p; vec4 col; float size; vStreak = 0.0;
          if (aA.w < 0.5) {
            float r = 0.2 + aA.z * (0.35 + d * 0.12) + d * 0.05;     // jet spreading
            float swirl = ang + d * 0.1 + aB.x * 0.4;
            p = uNoz + vec3(-d, cos(swirl) * r, sin(swirl) * r) + (aB.xyz - 0.5) * (0.15 + d * 0.08);
            float hot = 1.0 - smoothstep(2.5, 9.0, d);              // hot vapour: nearly invisible shimmer
            float cond = smoothstep(4.0, 10.0, d) * uMix;           // mixes with cold air → droplets → ice (white)
            col.rgb = mix(vec3(0.86, 0.93, 1.0), vec3(1.0), cond);
            col.a = hot * 0.045 * (0.5 + aB.y) + cond * 0.34 * (0.6 + 0.6 * aB.z);
            size = (0.3 + d * 0.09) * (1.7 + aB.w * 1.4);
          } else {
            // ambient −40 °C air streaming past and being entrained into the jet
            float R = 2.5 + aA.z * 6.0;
            float pull = smoothstep(2.0, 10.0, d);
            float r = mix(R, 0.6 + d * 0.08, pull * 0.9);
            p = uNoz + vec3(5.0 - d * 1.2, cos(ang) * r, sin(ang) * r);
            col = vec4(0.62, 0.84, 1.0, uCold * 0.9 * smoothstep(0.0, 2.0, d) * (1.0 - smoothstep(9.0, 13.0, d)));
            size = 0.12 + aB.w * 0.08; vStreak = 1.0;
          }
          col.a *= smoothstep(0.0, 0.6, uT - aA.x);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(size * uScale / -mv.z, 1.5, 600.0);
          vC = col;
        }`,
      fragmentShader: /* glsl */ `
        varying vec4 vC; varying float vStreak;
        void main(){ vec2 q = gl_PointCoord - 0.5; float d = length(q) * 2.0; if (d > 1.0) discard;
          float a = exp(-d * d * 3.5); gl_FragColor = vec4(vC.rgb, vC.a * a); }`,
    });
    return { geom: g, mat: m };
  }, []);
  mat.uniforms.uT.value = t + 2.2; // pre-roll so the plume is established at frame 0
  mat.uniforms.uCold.value = cold; mat.uniforms.uMix.value = mix;
  mat.uniforms.uScale.value = h / (2 * Math.tan(((cam.fovY as number) * Math.PI) / 360));
  return <points geometry={geom} material={mat} frustumCulled={false} />;
};

const project = (p: [number, number, number], fr: CamFrame): [number, number] => {
  const c = new THREE.PerspectiveCamera(cam.fovY as number, 1080 / 1920, 0.1, 1000);
  c.position.set(...fr.pos); c.up.set(...fr.up); c.lookAt(...fr.target); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x * 0.5 + 0.5) * 1080, (-v.y * 0.5 + 0.5) * 1920];
};

export const S3Engine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const s0 = SCENES.engine.from;
  const idx = Math.min(frame, FRAMES.length - 1);
  const cf = FRAMES[idx];
  const t = frame / fps;
  const hotAt = f(K.waterVapour.on - 0.25 - s0), coldAt = f(K.thandi.on - 0.2 - s0);
  const hotAnchor = project([NOZ[0] - 1.6, NOZ[1], NOZ[2]], FRAMES[Math.min(hotAt + 12, FRAMES.length - 1)]);
  const coldAnchor = project([NOZ[0] - 3, NOZ[1] - 4.5, NOZ[2] + 2.5], FRAMES[Math.min(coldAt + 12, FRAMES.length - 1)]);
  const zoom = interpolate(frame, [0, 174], [1.0, 1.06]);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #072a78 0%, #1a56c0 55%, #5e95dc 100%)" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img src={staticFile(`renders/engine/engine_${String(idx).padStart(4, "0")}.png`)} style={{ width: 1080, height: 1920 }} />
        <AbsoluteFill>
          <ThreeCanvas width={1080} height={1920} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: false }} camera={{ fov: cam.fovY as number, near: 0.1, far: 2000 }}>
            <CameraRig position={cf.pos} target={cf.target} up={cf.up} fov={cam.fovY as number} near={0.1} far={2000} />
            <Plume t={t} h={height} cold={interpolate(frame, [coldAt - 10, coldAt + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} mix={interpolate(frame, [coldAt, coldAt + 30], [0.0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <SettleFrame passes={2} />
          </ThreeCanvas>
        </AbsoluteFill>
      </AbsoluteFill>
      <SciLabel at={hotAt} anchor={hotAnchor} box={[110, 1010]} title="HOT EXHAUST" sub="garam + water vapour (H₂O) · abhi invisible" color={DP.red} width={620} outAt={coldAt - 4} />
      <SciLabel at={coldAt} anchor={coldAnchor} box={[110, 1060]} title="COLD AIR ≈ −40°C" sub="cruise altitude ~10–12 km · mixing → droplets → ice" color={DP.blue} width={720} />
    </AbsoluteFill>
  );
};

export const S3Reveal: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={f(SCENES.contrailTitle.to - SCENES.contrailTitle.from)}><S3Title /></Sequence>
    <Sequence from={f(SCENES.engine.from - SCENES.contrailTitle.from)}><S3Engine /></Sequence>
  </AbsoluteFill>
);
