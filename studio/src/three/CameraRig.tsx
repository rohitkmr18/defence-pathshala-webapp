import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Places the R3F camera from pure per-frame values (no accumulated state). */
export const CameraRig: React.FC<{ position: [number, number, number]; target: [number, number, number]; fov: number; roll?: number; up?: [number, number, number]; near?: number; far?: number }> = ({ position, target, fov, roll = 0, up, near = 0.5, far = 60000 }) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    cam.position.set(...position);
    if (up) cam.up.set(...up); else cam.up.set(Math.sin(roll), Math.cos(roll), 0);
    cam.lookAt(...target);
    cam.fov = fov; cam.near = near; cam.far = far;
    cam.updateProjectionMatrix();
  });
  return null;
};
