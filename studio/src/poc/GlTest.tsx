import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame } from "remotion";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export const GlTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <ThreeCanvas width={540} height={960} style={{ background: "#020617" }} camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <mesh rotation={[f * 0.05, f * 0.07, 0]}>
        <torusKnotGeometry args={[1, 0.3, 160, 24]} />
        <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.4} metalness={0.3} roughness={0.35} />
      </mesh>
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.2} luminanceThreshold={0.4} mipmapBlur />
        <Vignette darkness={0.6} />
      </EffectComposer>
    </ThreeCanvas>
  );
};
