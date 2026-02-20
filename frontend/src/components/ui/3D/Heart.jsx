import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import AnimatedHeart from "./AnimatedHeart";
import { OrbitControls } from "@react-three/drei";

const Heart = () => {
  return (
    <div className="w-full aspect-square">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} color="#6ea8ff" />
        {/* ---------Key light ---------- */}
        <directionalLight position={[4, 5, 5]} intensity={1.6} color="#ffff" />
        {/* ----------- Rim Light -------- */}
        <directionalLight
          position={[-5, -2, 3]}
          intensity={1.2}
          color="#3b82f6"
        />
        {/* ------ Glow ------ */}
        <pointLight position={[0, 1, 2.5]} intensity={5} color="#ff4d4d" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
        />
        <Suspense fallback={null}>
          <AnimatedHeart />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Heart;
