import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { useMemo, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { CameraRig } from "../three/CameraRig";
import { SettleFrame } from "../three/SettleFrame";
import { useSkyEnv } from "../three/Airliner";
import { HeroFlight } from "./HeroFlight";
import { KineticTitle } from "../components/KineticTitle";
import { Chip } from "../components/Chip";
import { DP } from "../branding/brand";
import { K, SCENES, f } from "../projects/contrails/timeline";
import { mulberry32 } from "../lib/rand";
import { clamp01 } from "../lib/motion";

const N = 70; // hero nuclei → droplets → crystals
const NB = 2600; // background crystals forming the band on pull-back
const T_FREEZE = 0.7, T_PULL = 2.45; // scene seconds

const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

const Micro: React.FC<{ t: number; h: number }> = ({ t, h }) => {
  const gl = useThree((s) => s.gl);
  const env = useSkyEnv(gl);
  const data = useMemo(() => {
    const r = mulberry32(5);
    const nuclei = Array.from({ length: N }, () => {
      const u = r() * 2 - 1, th = r() * Math.PI * 2, rad = 4 + Math.cbrt(r()) * 13;
      const s = Math.sqrt(1 - u * u);
      return { p: new THREE.Vector3(Math.cos(th) * s * rad * 1.6, u * rad, Math.sin(th) * s * rad - 4), size: 0.55 + r() * 0.55, delay: r() * 0.5, rot: r() * 6.28, spin: (r() - 0.5) * 1.2, band: new THREE.Vector3((r() - 0.5) * 260, (r() - 0.5) * 7, (r() - 0.5) * 7) };
    });
    // vapour molecules: start scattered, each assigned to a nucleus
    const VM = 1400; const vpos = new Float32Array(VM * 3); const vA = new Float32Array(VM * 4);
    for (let i = 0; i < VM; i++) {
      const n = Math.floor(r() * N);
      vA.set([n, (r() - 0.5) * 24, (r() - 0.5) * 30, (r() - 0.5) * 16], i * 4);
    }
    const vg = new THREE.BufferGeometry(); vg.setAttribute("position", new THREE.BufferAttribute(vpos, 3));
    // background band crystals (points)
    const bpos = new Float32Array(NB * 3), bseed = new Float32Array(NB);
    for (let i = 0; i < NB; i++) { const x = (r() - 0.5) * 900, rr = Math.sqrt(r()) * (3 + Math.abs(x) * 0.012), a = r() * 6.28; bpos.set([x, Math.cos(a) * rr, Math.sin(a) * rr], i * 3); bseed[i] = r(); }
    const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.BufferAttribute(bpos, 3)); bg.setAttribute("aSeed", new THREE.BufferAttribute(bseed, 1));
    return { nuclei, vA, vg, bg };
  }, []);

  const hex = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.22, 6, 1), []);
  const sph = useMemo(() => new THREE.SphereGeometry(1, 24, 16), []);
  const soot = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const iceMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#eaf6ff", roughness: 0.12, metalness: 0.05, emissive: "#8fc4ff", emissiveIntensity: 0.35, transparent: true, opacity: 0.92, envMap: env, envMapIntensity: 1.6 }), [env]);
  const dropMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9fd0ff", roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.5, envMap: env, envMapIntensity: 2.2 }), [env]);
  const sootMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2f38", roughness: 0.9 }), []);
  const vapMat = useMemo(() => new THREE.PointsMaterial({ color: "#7fb8ff", size: 0.28, transparent: true, opacity: 0.9, depthWrite: false }), []);
  const bandMat = useMemo(() => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uO: { value: 0 }, uScale: { value: 1 } },
    vertexShader: `attribute float aSeed; uniform float uScale; varying float vS; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix*mv; gl_PointSize = clamp((0.6+aSeed*0.9)*uScale/-mv.z, 1.0, 40.0); vS = aSeed; }`,
    fragmentShader: `uniform float uO; varying float vS; void main(){ float d = length(gl_PointCoord-0.5)*2.0; if(d>1.0) discard; gl_FragColor = vec4(vec3(0.92,0.97,1.0), uO*(0.35+0.5*vS)*exp(-d*d*3.0)); }` }), []);

  const iceRef = useRef<THREE.InstancedMesh>(null), dropRef = useRef<THREE.InstancedMesh>(null), sootRef = useRef<THREE.InstancedMesh>(null);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), pos = new THREE.Vector3();
  const pull = smooth(T_PULL, T_PULL + 2.4, t);
  useLayoutEffect(() => {
    data.nuclei.forEach((n, i) => {
      const grow = smooth(0.0 + n.delay * 0.3, 0.6 + n.delay * 0.3, t);              // condensation
      const frz = smooth(T_FREEZE + n.delay * 0.6, T_FREEZE + 0.4 + n.delay * 0.6, t); // freezing
      pos.copy(n.p).lerp(n.band, pull);
      // soot nucleus
      sc.setScalar(n.size * 0.32 * (1 - grow * 0.9)); m.compose(pos, q.identity(), sc); sootRef.current?.setMatrixAt(i, m);
      // liquid droplet
      sc.setScalar(n.size * (0.2 + 0.85 * grow) * (1 - frz)); m.compose(pos, q.identity(), sc); dropRef.current?.setMatrixAt(i, m);
      // hexagonal ice plate
      e.set(0.9 + n.rot * 0.3, n.rot + t * n.spin, 0.3); q.setFromEuler(e);
      sc.set(n.size * 1.05 * frz, n.size * 1.05 * frz, n.size * 1.05 * frz); m.compose(pos, q, sc); iceRef.current?.setMatrixAt(i, m);
    });
    [iceRef, dropRef, sootRef].forEach((r) => { if (r.current) r.current.instanceMatrix.needsUpdate = true; });
    const vp = data.vg.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < vp.count; i++) {
      const n = data.nuclei[data.vA[i * 4]];
      const k = smooth(-0.3, 0.55 + n.delay * 0.3, t);
      vp.setXYZ(i, n.p.x + data.vA[i * 4 + 1] * (1 - k), n.p.y + data.vA[i * 4 + 2] * (1 - k), n.p.z + data.vA[i * 4 + 3] * (1 - k));
    }
    vp.needsUpdate = true;
  });
  vapMat.opacity = 0.9 * (1 - smooth(0.4, 0.9, t));
  bandMat.uniforms.uO.value = smooth(T_PULL + 0.4, T_PULL + 2.0, t);
  const fov = 34;
  bandMat.uniforms.uScale.value = h / (2 * Math.tan((fov * Math.PI) / 360));
  const camZ = 38 + pull * 330, camX = -6 + pull * -40;
  return (
    <>
      <CameraRig position={[camX + t * 0.8, 3 - pull * 20, camZ]} target={[camX * 0.6, 0, -4]} fov={fov} roll={-0.18 * pull} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[20, 30, 25]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-30, -10, -20]} intensity={1.4} color="#5aa2ff" />
      <instancedMesh ref={sootRef} args={[soot, sootMat, N]} frustumCulled={false} />
      <instancedMesh ref={dropRef} args={[sph, dropMat, N]} frustumCulled={false} />
      <instancedMesh ref={iceRef} args={[hex, iceMat, N]} frustumCulled={false} />
      <points geometry={data.vg} material={vapMat} frustumCulled={false} />
      <points geometry={data.bg} material={bandMat} frustumCulled={false} />
      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={0.0} focalLength={0.06} bokehScale={pull > 0.05 ? 0 : 3} />
        <Bloom intensity={0.8} luminanceThreshold={0.7} mipmapBlur />
        <Vignette darkness={0.6} offset={0.3} />
      </EffectComposer>
      <SettleFrame passes={3} />
    </>
  );
};

/** Process strip: VAPOUR → DROPLET → ICE with the active step lit. */
const Steps: React.FC<{ t: number }> = ({ t }) => {
  const step = t < 0.35 ? 0 : t < T_FREEZE + 0.3 ? 1 : 2;
  const o = interpolate(t, [0.0, 0.25, T_PULL + 0.6, T_PULL + 1.0], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const items = ["VAPOUR", "DROPLET", "ICE"];
  return (
    <div style={{ position: "absolute", top: 1040, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: o }}>
      {items.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ padding: "10px 22px", borderRadius: 999, fontFamily: DP.display, fontWeight: 900, fontSize: 32, letterSpacing: 1, color: DP.white, background: i === step ? DP.blue : "rgba(2,6,23,0.6)", border: `2px solid ${i <= step ? DP.blue : "rgba(203,213,225,0.25)"}`, opacity: i <= step ? 1 : 0.55 }}>{s}</div>
          {i < 2 && <div style={{ fontFamily: DP.display, fontWeight: 900, fontSize: 34, color: i < step ? DP.blueLight : "rgba(203,213,225,0.35)" }}>→</div>}
        </div>
      ))}
    </div>
  );
};

export const S4Ice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s0 = SCENES.ice.from;
  const t = frame / fps;
  const toSky = f(K.whiteLine.on - 0.55 - s0);
  const skyO = interpolate(frame, [toSky, toSky + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #0f2a66 0%, ${DP.bg} 75%)` }}>
      {skyO < 1 && (
        <AbsoluteFill>
          <ThreeCanvas width={width} height={height} gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 34, near: 0.5, far: 5000 }}>
            <Micro t={t} h={height} />
          </ThreeCanvas>
        </AbsoluteFill>
      )}
      <Sequence from={toSky}>
        <AbsoluteFill style={{ opacity: skyO }}><HeroFlight shot={{ pushAt: 0.0, pushDur: 0.01 }} timeOffset={6.4} /></AbsoluteFill>
      </Sequence>
      <Steps t={t} />
      <KineticTitle top={470} outAt={toSky - 6} lines={[
        { text: "TINY", at: f(K.crystals.on - 0.45 - s0), color: DP.white, size: 96, tracking: 4 },
        { text: "ICE CRYSTALS", at: f(K.crystals.on - 0.3 - s0), color: DP.blueLight, size: 124 },
      ]} />
      <Chip at={f(K.crystals.on + 0.35 - s0)} outAt={toSky - 6} x={540} y={790} text="size ≈ a few micrometres (µm)" color={DP.blueLight} size={30} solid={false} />
      <Chip at={toSky + 8} x={540} y={560} text="WHITE LINE" color={DP.blue} size={56} sub="= billions of tiny ice crystals" />
    </AbsoluteFill>
  );
};
