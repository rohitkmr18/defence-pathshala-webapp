import * as THREE from "three";
/** Projects a world point to pixel coords for a given camera (same maths as R3F). */
export const projectToScreen = (p: [number, number, number], cam: { position: [number, number, number]; target: [number, number, number]; fov: number; roll?: number; up?: [number, number, number] }, w: number, h: number): [number, number] => {
  const c = new THREE.PerspectiveCamera(cam.fov, w / h, 1, 1e6);
  c.position.set(...cam.position);
  if (cam.up) c.up.set(...cam.up); else c.up.set(Math.sin(cam.roll ?? 0), Math.cos(cam.roll ?? 0), 0);
  c.lookAt(...cam.target); c.updateMatrixWorld(); c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x * 0.5 + 0.5) * w, (-v.y * 0.5 + 0.5) * h];
};
