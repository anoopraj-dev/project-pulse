import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";


const AnimatedHeart = () => {
    const group = useRef();
    const {scene,animations} = useGLTF('/models/heart.glb');
    const {actions} = useAnimations(animations,group);

    useEffect(() =>{
        if(actions){
            Object.values(actions).forEach((action)=>{
                action.timeScale = 0.9;
                action.play()});
        }
    },[actions])
    

    return (
        <group ref={group} scale={1} position={[2, -0.3, 0]}>
      <primitive object={scene} />
    </group>
    )
}

export default AnimatedHeart;