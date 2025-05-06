import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Environment } from '@react-three/drei';
import ThirdPersonController from '../Model/Controls/ThirdPersonController';
import { Physics } from '@react-three/rapier';
import { componentMap } from "../util";
import { useSelector } from "react-redux";
import { useThree } from "@react-three/fiber";


export default function ViewContent2({ s_data }) {
    // const { ComponentView2 } = useThreeContext();
    const { ComponentView2, s_selectedObj_view2 } = useSelector(state => state.three);

    const modelRef = useRef();
    const { scene } = useThree();

    // 強制避免re-render造成視角變化
    const camPos = useMemo(() => new THREE.Vector3(50, 50, 50), [s_selectedObj_view2]);
    const camTarget = useMemo(() =>  new THREE.Vector3(0, 1, 0) , [s_selectedObj_view2]);

    const [s_camTarget, set_s_camTarget] = useState(undefined);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.name === "Empty") {
                console.log("Empty pos:", child.position)
                set_s_camTarget(child.position)
            }
        });
    }, [])


    return (
        <>
            <Physics gravity={[0, -30, 0]}>
                <color attach="background" args={['#d6edf3']} />
                {
                    s_selectedObj_view2 &&
                    React.createElement(componentMap[s_selectedObj_view2], { clickable_view1: false, clickable_view2: true, position: new THREE.Vector3(0, 0, 0), s_data: s_data })
                }
                {/* <ComponentView2 clickable_view1={false} clickable_view2={true} position={[0, 0, 0]} s_data={s_data} /> */}
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 100, 10]} />
                <Environment files="/image/environment/empty_warehouse_01_1k.exr" />
                <ThirdPersonController
                    cameraPosition={camPos}
                    orbitTarget={s_camTarget}
                />
            </Physics>
        </>
    )
}