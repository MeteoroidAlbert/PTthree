import { Gltf, useGLTF } from '@react-three/drei';
import { useSelector } from 'react-redux';
import CustomDragControls from './Controls/CustomDragControls';
import { useEffect, useRef, useState } from 'react';

export default function Reactor3({ ref, position, scale, rotation, onClick }) {
    const { s_cameraType } = useSelector(state => state.three);
    const modelRef = useRef();

    const handleClick = () => {
        onClick && onClick();
    };

    const Content = () => {
        return (
            <Gltf
                ref={s_cameraType === "drag" ? modelRef : ref}
                src={"/modal/reactor3/scene.gltf"}
                position={position}
                scale={scale}
                rotation={rotation}
                onClick={handleClick}
            />
        )
    };

    return s_cameraType === "drag" ? (
        <CustomDragControls objectRef={modelRef}>
            <Content />
        </CustomDragControls>
    ) : <Content />
}
