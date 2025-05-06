import { Gltf, useGLTF } from '@react-three/drei';
import { useSelector } from 'react-redux';
import CustomDragControls from './Controls/CustomDragControls';
import { useEffect, useRef, useState } from 'react';
import * as THREE from "three";

export default function Reactor3({ id, position, scale, rotation, onClick }) {
    const { s_cameraType } = useSelector(state => state.three);
    const [localPos, setLocalPos] = useState([]);

    const modelRef = useRef();

    const handleClick = () => {
        onClick && onClick();
    };

    const Content = () => {
        return (
            <Gltf
                
                src={"/modal/reactor3/scene.gltf"}
                position={[0, 0, 0]}
                
                onClick={handleClick}
            />
        )
    };

    // useEffect(() => {
    //     if (modelRef.current && position) {
    //         const localPosition = modelRef.current.parent.worldToLocal(
    //             new THREE.Vector3(...position)
    //         );
    //         console.log("localPosition:", localPosition);
    //         setLocalPos(localPosition.toArray());
    //     }
    //     else {
    //         console.log("沒有modelRef")
    //         setLocalPos(position);
    //     }
    // }, [position]);

    // return s_cameraType === "drag" ? (
    //     <CustomDragControls objectRef={modelRef} modelID={id}>
    //         <Content />
    //     </CustomDragControls>
    // ) : <Content />
    return (
        <group position={position} ref={modelRef} scale={scale} rotation={rotation}>
            <CustomDragControls objectRef={modelRef} modelID={id} enable={s_cameraType === "drag"}>
                <Content />
            </CustomDragControls>
        </group>
    )
}
