import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Model({url,position}){
    const group = useRef();
    const {scene,animations} = useGLTF(url);
    const {actions} = useAnimations(animations,group);

    useEffect(()=>{
        Object.values(actions).forEach((action)=> action.play())
    },[actions]);

    return (
        <primitive
        ref={group}
        object={scene}
        position={position}
        scale={10}
        />
    )
}