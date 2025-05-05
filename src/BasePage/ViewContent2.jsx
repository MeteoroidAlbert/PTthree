import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Environment } from '@react-three/drei';
import ThirdPersonController from '../Model/Controls/ThirdPersonController';
import { Physics } from '@react-three/rapier';
import { componentMap } from "../util";
import { useSelector } from "react-redux";


export default function ViewContent2({ s_data }) {
    // const { ComponentView2 } = useThreeContext();
    const { ComponentView2, s_selectedObj_view2 } = useSelector(state => state.three);

    const modelRef = useRef();

    // 強制避免re-render造成視角變化
    const camPos = useMemo(() => new THREE.Vector3(50, 50, 50), [s_selectedObj_view2]);
    const camTarget = useMemo(() => modelRef.current?.children[0]?.children.find(x => x.name === "Empty").position ?? new THREE.Vector3(0, 1, 0) , [s_selectedObj_view2, modelRef.current]);

    useEffect(() => {
        console.log("modelRef:", modelRef.current);
        
    }, [])

    return (
        <>
            <Physics gravity={[0, -30, 0]}>
                <color attach="background" args={['#d6edf3']} />
                {
                    s_selectedObj_view2 &&
                    React.createElement(componentMap[s_selectedObj_view2], { ref: modelRef, clickable_view1: false, clickable_view2: true, position: new THREE.Vector3(0, 0, 0), s_data: s_data })
                }
                {/* <ComponentView2 clickable_view1={false} clickable_view2={true} position={[0, 0, 0]} s_data={s_data} /> */}
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 100, 10]} />
                <Environment files="/image/environment/empty_warehouse_01_1k.exr" />
                <ThirdPersonController
                    cameraPosition={camPos}
                    orbitTarget={camTarget}
                />
            </Physics>
        </>
    )
}