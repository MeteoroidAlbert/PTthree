import { Gltf, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';


export default function TestBuilding({ position, scale, rotation }) {
    const modleRef = useRef();

    const { animations, materials, scene } = useGLTF("/modal/testModle/building/buildingAll/Building All.gltf")
    const { actions } = useAnimations(animations, modleRef);

    const handleClick = () => {

    }


    useEffect(() => {
        console.log("actions:", actions);
        console.log("animation:", animations)
        console.log("materials:", materials);
        console.log("object3D:", scene);

        if (Object.keys(actions).length> 0) {
            for(let actionAnimation in actions) {
                actions[actionAnimation].play();
            }
        }
    }, [actions])

    

    


    return (
        <Gltf
            ref={modleRef}
            src={"/modal/testModle/building/buildingAll/Building All.gltf"}
            position={position}
            scale={scale}
            rotation={rotation}
            onClick={handleClick}
        />
    )
}