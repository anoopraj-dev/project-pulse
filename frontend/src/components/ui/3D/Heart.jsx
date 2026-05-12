import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import AnimatedHeart from "./AnimatedHeart";
import { OrbitControls } from "@react-three/drei";



const Heart = () => {
  return (
    <div className="w-full aspect-square">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ background: "transparent" }}>
        {/* -------- Lights -------- */}
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, 5, -5]} intensity={0.8} color="#ffffff" />


        {/* -------- Controls -------- */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
          enableDamping
          dampingFactor={0.02}
        />

        {/* -------- Animated Heart -------- */}
        <Suspense fallback={null}>
          <AnimatedHeart />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Heart;