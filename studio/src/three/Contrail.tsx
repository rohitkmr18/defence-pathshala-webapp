import { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "../lib/rand";

/** Physically-motivated, fully deterministic contrail particle system.
 *
 *  An aircraft flies a straight path P(t) = p0 + v·t. Each engine emits
 *  particles at fixed time steps; a particle emitted at te sits at the
 *  engine position at te, then (as a function of age only):
 *   - stays invisible for `gapAge` (hot exhaust must first mix & cool, so the
 *     visible trail starts some distance behind the engine),
 *   - sinks with the wake vortices, the two engine plumes merge,
 *   - grows by turbulent diffusion (√age) plus `spread`·age (wind shear,
 *     dominant in ice-supersaturated air),
 *   - fades with e-folding time `tau` (short in dry air → short trail;
 *     effectively infinite in ice-supersaturated air → persistent trail).
 *  No state is carried between frames, so every frame renders identically. */
export type ContrailParams = {
  p0: [number, number, number];
  v: [number, number, number];
  engines: [number, number, number][]; // offsets from aircraft origin (world axes)
  tStart: number; tEnd: number; // emission window (s)
  spacing?: number; // metres between emitted particles
  gapAge?: number; tau?: number; r0?: number; grow?: number; spread?: number; sink?: number;
  merge?: number; opacity?: number; wind?: [number, number, number];
  ageScale?: number; // >1 = time-lapse for the plume's evolution only
  seed?: number; tint?: string;
};

export const Contrail: React.FC<{ time: number; viewportHeight: number; fovDeg: number; params: ContrailParams }> = ({ time, viewportHeight, fovDeg, params }) => {
  const { p0, v, engines, tStart, tEnd, spacing = 3, gapAge = 0.18, tau = 1e6, r0 = 0.8, grow = 1.4, spread = 0, sink = 1.8, merge = 3, opacity = 0.55, wind = [0, 0, 0], ageScale = 1, seed = 7, tint = "#ffffff" } = params;
  const speed = Math.hypot(...v);
  const geom = useMemo(() => {
    const dt = spacing / Math.max(speed, 1e-3);
    const n = Math.ceil((tEnd - tStart) / dt);
    const count = n * engines.length;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3); // unused placeholder, positions are computed in the shader
    const emit = new Float32Array(count); const eng = new Float32Array(count * 3); const rnd = new Float32Array(count * 4);
    const rand = mulberry32(seed);
    let k = 0;
    for (let i = 0; i < n; i++) for (let e = 0; e < engines.length; e++) {
      emit[k] = tStart + i * dt + rand() * dt * 0.5;
      eng.set(engines[e], k * 3);
      rnd.set([rand(), rand(), rand(), rand()], k * 4);
      k++;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aEmit", new THREE.BufferAttribute(emit, 1));
    g.setAttribute("aEngine", new THREE.BufferAttribute(eng, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e7);
    return g;
  }, [spacing, speed, tStart, tEnd, engines, seed]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: true,
    uniforms: Object.fromEntries(["uTime","uP0","uV","uGap","uTau","uR0","uGrow","uSpread","uSink","uMerge","uOpacity","uWind","uScale","uAgeScale","uTint"].map((k) => [k, { value: null as unknown }])),
    vertexShader: /* glsl */ `
      attribute float aEmit; attribute vec3 aEngine; attribute vec4 aRnd;
      uniform float uTime, uGap, uTau, uR0, uGrow, uSpread, uSink, uMerge, uOpacity, uScale, uAgeScale;
      uniform vec3 uP0, uV, uWind;
      varying float vAlpha; varying vec4 vRnd; varying float vR;
      void main(){
        float age = (uTime - aEmit) * uAgeScale;
        if (age < uGap * 0.4) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vAlpha = 0.0; return; }
        vec3 base = uP0 + uV * aEmit;
        float m = 1.0 - 0.75 * smoothstep(0.0, uMerge, age);          // engine plumes merge
        vec3 off = vec3(aEngine.x, aEngine.y, aEngine.z * m);
        float r = uR0 + uGrow * sqrt(age) + uSpread * age;
        vec3 jitter = (aRnd.xyz - 0.5) * vec3(0.6, 1.0, 1.0) * r * 1.3;
        // slow turbulent meander, deterministic in (seed, age)
        jitter += vec3(0.0, sin(age * 0.7 + aRnd.w * 6.28), cos(age * 0.5 + aRnd.x * 6.28)) * r * 0.35;
        vec3 p = base + off + vec3(0.0, -uSink * age, 0.0) + jitter + uWind * age;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float size = r * (2.4 + aRnd.y * 1.4);
        gl_PointSize = clamp(size * uScale / -mv.z, 0.0, 900.0);
        float appear = smoothstep(uGap * 0.5, uGap * 1.6, age);
        float fade = exp(-max(age - uGap, 0.0) / uTau);
        float thin = clamp(2.2 * uR0 / r + 0.08, 0.05, 1.0);           // optical depth falls as it spreads
        vAlpha = uOpacity * appear * fade * mix(0.55, 1.0, thin) * (0.55 + 0.45 * aRnd.z);
        vRnd = aRnd; vR = r;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uTint; varying float vAlpha; varying vec4 vRnd; varying float vR;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      void main(){
        vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0;
        if (d > 1.0) discard;
        float soft = exp(-d * d * 4.0) * (1.0 - smoothstep(0.6, 1.0, d));
        float n = n2(gl_PointCoord * 3.5 + vRnd.xy * 40.0) * 0.6 + n2(gl_PointCoord * 7.0 + vRnd.zw * 40.0) * 0.4;
        soft *= 0.78 + 0.34 * n;
        float lit = 0.72 + 0.28 * (1.0 - gl_PointCoord.y);             // sunlit top, cooler underside
        vec3 col = mix(vec3(0.74, 0.80, 0.90), uTint, lit);
        gl_FragColor = vec4(col, clamp(soft * vAlpha, 0.0, 1.0));
      }`,
  }), []);

  const u = mat.uniforms;
  u.uTime.value = time; u.uP0.value = new THREE.Vector3(...p0); u.uV.value = new THREE.Vector3(...v);
  u.uGap.value = gapAge; u.uTau.value = tau; u.uR0.value = r0; u.uGrow.value = grow; u.uSpread.value = spread;
  u.uSink.value = sink; u.uMerge.value = merge; u.uOpacity.value = opacity; u.uWind.value = new THREE.Vector3(...wind);
  u.uAgeScale.value = ageScale; u.uTint.value = new THREE.Color(tint).convertSRGBToLinear();
  u.uScale.value = viewportHeight / (2 * Math.tan((fovDeg * Math.PI) / 360));
  return <points geometry={geom} material={mat} frustumCulled={false} renderOrder={2} />;
};
