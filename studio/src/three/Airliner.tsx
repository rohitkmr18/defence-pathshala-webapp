import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/** Engine exhaust positions on the Blender-built airliner (Three.js axes,
 *  nose +X, up +Y, left wing −Z). See scripts/blender/airliner_lib.py. */
export const ENGINE_EXHAUST: [number, number, number][] = [
  [2.2, -2.45, -5.9],
  [2.2, -2.45, 5.9],
];

let cache: Promise<THREE.Group> | null = null;
const load = () => {
  if (!cache) {
    cache = fetch(staticFile("models/airliner.glb"))
      .then((r) => { if (!r.ok) throw new Error(`airliner.glb HTTP ${r.status}`); return r.arrayBuffer(); })
      .then((buf) => new Promise<THREE.Group>((res, rej) => new GLTFLoader().parse(buf, "", (g) => res(g.scene), rej)));
  }
  return cache;
};

/** Call OUTSIDE the ThreeCanvas (regular Remotion tree) so delayRender blocks capture. */
export const useAirlinerModel = () => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender("airliner.glb"));
  useEffect(() => {
    load().then((g) => { setModel(g); continueRender(handle); }).catch((e) => cancelRender(e));
  }, [handle]);
  return model;
};

export const Airliner: React.FC<{ model: THREE.Group | null; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; envMap?: THREE.Texture | null }> = ({ model, position, rotation = [0, 0, 0], scale = 1, envMap }) => {
  const [inst, setInst] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (!model) return;
    const c = model.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const m = (mesh.material as THREE.MeshStandardMaterial).clone();
        m.envMapIntensity = 1.0; if (envMap) m.envMap = envMap;
        mesh.material = m;
      }
    });
    setInst(c);
  }, [model, envMap]);
  if (!inst) return null;
  return <primitive object={inst} position={position} rotation={rotation} scale={scale} />;
};

/** Small procedural sky environment for PBR reflections (deterministic). */
export const useSkyEnv = (renderer: THREE.WebGLRenderer) => {
  const [env] = useState(() => {
    const w = 256, h = 128; const data = new Uint8Array(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const el = 1 - y / (h - 1); // 1 top .. 0 bottom
      const top = [40, 90, 190], hor = [200, 220, 245], bot = [235, 240, 248];
      const t = el > 0.5 ? (el - 0.5) * 2 : (0.5 - el) * 2;
      const tgt = el > 0.5 ? top : bot;
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) data[i + c] = hor[c] + (tgt[c] - hor[c]) * Math.pow(t, 0.6);
      data[i + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, w, h); tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace; tex.needsUpdate = true;
    const pm = new THREE.PMREMGenerator(renderer);
    return pm.fromEquirectangular(tex).texture;
  });
  return env;
};
