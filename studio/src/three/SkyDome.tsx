import { useMemo } from "react";
import * as THREE from "three";
import { NOISE_GLSL } from "./noise.glsl";

export type SkyMode = "cruise" | "ground";
type Props = {
  mode: SkyMode;
  time: number; // seconds, drives slow cloud drift
  sunDir?: [number, number, number];
  zenith?: string; horizon?: string;
  cirrus?: number; // 0..1 high thin cloud amount
  deckAltitude?: number; // metres below camera for the cruise cloud deck
  exposure?: number;
};

/** Camera-centred procedural sky: gradient + sun glow + fbm cirrus, and for
 *  cruise shots an fbm cloud deck far below with aerial-perspective haze. */
export const SkyDome: React.FC<Props> = ({ mode, time, sunDir = [0.35, 0.55, -0.75], zenith = "#0a2a7a", horizon = "#9cc6f2", cirrus = 0.25, deckAltitude = 7000, exposure = 1 }) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, depthTest: false, toneMapped: false,
    uniforms: {
      uSun: { value: new THREE.Vector3() }, uTime: { value: 0 }, uMode: { value: 0 },
      uZenith: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() },
      uCirrus: { value: 0 }, uDeck: { value: 7000 }, uExposure: { value: 1 },
    },
    vertexShader: /* glsl */ `varying vec3 vWorld; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = gl_Position.w * 0.9999; }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uSun, uZenith, uHorizon; uniform float uTime, uMode, uCirrus, uDeck, uExposure; varying vec3 vWorld;
      ${NOISE_GLSL}
      void main(){
        vec3 d = normalize(vWorld - cameraPosition);
        float el = d.y;
        vec3 sky = mix(uHorizon, uZenith, pow(clamp(el, 0.0, 1.0), 0.45));
        // high-altitude sky darkens slightly below horizon line too (haze band)
        float haze = exp(-abs(el) * 9.0);
        sky = mix(sky, uHorizon * 1.08, haze * 0.65);
        float sd = max(dot(d, normalize(uSun)), 0.0);
        sky += vec3(1.0, 0.96, 0.88) * (pow(sd, 900.0) * 6.0 + pow(sd, 18.0) * 0.22 + pow(sd, 3.0) * 0.06);
        // cirrus wisps above horizon, stretched along x
        if (el > 0.0) {
          vec2 p = d.xz / (el + 0.25) * vec2(1.4, 4.0) + vec2(uTime * 0.004, 0.0);
          float c = smoothstep(0.55, 0.95, fbm(p * 1.6)) * uCirrus * smoothstep(0.0, 0.15, el);
          sky = mix(sky, vec3(0.95, 0.97, 1.0), c * 0.55);
        }
        if (uMode < 0.5 && el < 0.0) {
          // cloud deck far below: intersect plane y = cam - deck
          float t = uDeck / max(-el, 0.002);
          vec2 p = (cameraPosition.xz + d.xz * t) * 0.00028 + vec2(uTime * 0.01, 0.0);
          float c = fbm(p); float c2 = fbm(p * 3.1 + 4.0);
          float cov = smoothstep(0.38, 0.72, c * 0.75 + c2 * 0.35);
          vec3 cloud = mix(vec3(0.62, 0.70, 0.84), vec3(1.0), smoothstep(0.3, 0.9, c2)) ;
          vec3 gap = vec3(0.16, 0.27, 0.45);
          vec3 below = mix(gap, cloud, cov);
          float fog = 1.0 - exp(-t * 0.000022);
          sky = mix(below, uHorizon * 1.05, clamp(fog, 0.0, 1.0));
        }
        gl_FragColor = vec4(sky * uExposure, 1.0);
      }`,
  }), []);
  mat.uniforms.uSun.value.set(...sunDir);
  mat.uniforms.uTime.value = time;
  mat.uniforms.uMode.value = mode === "cruise" ? 0 : 1;
  mat.uniforms.uZenith.value.set(zenith).convertSRGBToLinear();
  mat.uniforms.uHorizon.value.set(horizon).convertSRGBToLinear();
  mat.uniforms.uCirrus.value = cirrus;
  mat.uniforms.uDeck.value = deckAltitude;
  mat.uniforms.uExposure.value = exposure;
  return (
    <mesh material={mat} frustumCulled={false} renderOrder={-10}>
      <sphereGeometry args={[40000, 48, 24]} />
    </mesh>
  );
};
