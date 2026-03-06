
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

    // Custom material
    const customMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a9292f,
      emissive: 0x0a192f,
      emissiveIntensity: 0.6,
      roughness: 0.5,
      metalness: 0.1,
    });

    // Apply material to all meshes
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = customMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Play all animations
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        action.reset();
        action.play();
        action.timeScale = 0.9;
      });
    }

    //  Mark material applied after setup
    setMaterialApplied(true);
  }, [actions, scene]);

  return (
    <group
      ref={group}
      position={[2, 0, 0]}
      scale={0.8}
      rotation={[0, -0.55, 0]}
      visible={materialApplied} // hide until materials applied
    >
      <primitive object={scene} />
    </group>
  );
};

export default AnimatedHeart;