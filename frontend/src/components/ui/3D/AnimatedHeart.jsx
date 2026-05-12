
import { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const AnimatedHeart = () => {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/heart.glb");
  const { actions } = useAnimations(animations, group);
  const [materialApplied, setMaterialApplied] = useState(false);

  useEffect(() => {
    if (!scene) return;

    // Apply properties to all meshes
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.metalness = 0;
          child.material.roughness = 1;
        }
      }
    });

    // Play all animations
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        action.reset();
        action.play();
        action.timeScale = 0.8;
      });
    }

    //  Mark material applied after setup
    setMaterialApplied(true);
  }, [actions, scene]);

  return (
    <group
      ref={group}
      position={[0.5, 0.8, 0]}
      scale={1}
      rotation={[0, -0.65, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

export default AnimatedHeart;