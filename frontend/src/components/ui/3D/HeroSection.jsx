import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Model } from "./Model";

export default function HeroSection() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 1.5, 6], fov: 60 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />

      <Suspense fallback={null}>
        <Model url="/models/dna_hologram.glb" position={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  );
}