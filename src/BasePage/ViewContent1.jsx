import React, { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import ThirdPersonController from '../Model/Controls/ThirdPersonController';
import TestBuilding from "../Model/Test_building";
import { useDispatch, useSelector } from "react-redux";
import { change_s_camPosNTarget } from "../Redux/Slice/3Dslice";
import Building1 from "../Model/building1";
import Building2 from "../Model/building2";
import Building3 from "../Model/building3";
import { componentMap } from "../util";




export default function ViewContent1() {
    const { s_focusTarget, s_view1Component, s_camPos, s_camTarget } = useSelector(state => state.three);

    const dispatch = useDispatch();

    useEffect(() => {
        if (s_focusTarget) {
            dispatch(change_s_camPosNTarget(s_focusTarget))
        }
    }, [s_focusTarget])

    return (
        <>
            {/*光源*/}
            <ambientLight intensity={0.1} />
            <directionalLight
                castShadow
                intensity={0.003}
                position={[0, 50, 0]}
            />
            {/*環境貼圖------------------------------->關鍵: 將自動套用到3D物件的envMap上，尤其使金屬光澤正常呈現，避免光線全吸收後模型變成黑色*/}
            <Environment files="/image/environment/empty_warehouse_01_1k.exr" />

            {s_view1Component.length > 0
                && s_view1Component.map(({ name, props }, i) =>
                    <Suspense fallback={null}>
                        {React.createElement(componentMap[name], { key: name, ...props })}
                    </Suspense>
                )
            }
            {/*相機*/}
            <ThirdPersonController
                cameraPosition={new THREE.Vector3(...s_camPos)}
                orbitTarget={new THREE.Vector3(...s_camTarget)}
            />
            {/*坐標軸*/}
            <primitive object={new THREE.AxesHelper(1000)} />
            <GizmoHelper
                alignment="bottom-right" // 在畫布上的位置
                margin={[80, 80]} // 距離畫布邊緣
            >
                <GizmoViewport
                    axisColors={['red', 'green', 'blue']}
                    labelColor="white"
                />
            </GizmoHelper>

        </>
    )
}