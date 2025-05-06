import { Gltf, useGLTF } from '@react-three/drei';
import { useSelector } from 'react-redux';
import CustomDragControls from './Controls/CustomDragControls';
import { useEffect, useRef, useState } from 'react';
import * as THREE from "three";
import { useThree } from '@react-three/fiber';

export default function Reactor3({ id, position, scale, rotation, onClick }) {
    const { s_cameraType } = useSelector(state => state.three);
    const [localPos, setLocalPos] = useState([]);

    const modelRef = useRef();
    const { scene } = useThree();

    const handleClick = () => {
        onClick && onClick();
    };

    const Content = () => {
        return (
            <Gltf
                ref={modelRef}
                src={"/modal/reactor3/scene.gltf"}
                position={localPos}
                scale={scale} 
                rotation={rotation}
                onClick={handleClick}
            />
        )
    };


    useEffect(() => {
        if (modelRef.current && position) {
            const localPosition = modelRef.current.parent.worldToLocal(
                new THREE.Vector3(...position)
            );
            console.log("localPosition:", localPosition);
            setLocalPos(localPosition.toArray());
        }
    }, [position]);

    // return s_cameraType === "drag" ? (
    //     <CustomDragControls objectRef={modelRef} modelID={id}>
    //         <Content />
    //     </CustomDragControls>
    // ) : <Content />
    return (

            <CustomDragControls objectRef={modelRef} modelID={id} enable={s_cameraType === "drag"}>
                <Content />
            </CustomDragControls>

    )
}
