import React, { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { DragControls, Environment, GizmoHelper, GizmoViewport, Html, KeyboardControls, OrbitControls, PointerLockControls, Text, useHelper, View } from '@react-three/drei';
import Reactor1 from '../Model/Reactor1';
import Reactor2 from '../Model/Reactor2';
import ThirdPersonController from '../Model/Controls/ThirdPersonController';
import Mixer from '../Model/Mixer';
import Pallet from '../Model/Pallet';
import { DataTableMixer, DataTableReactor } from '../Component/DataTable';
import PalletTruck from '../Model/PalletTruck';
import CautionTape from '../Model/CautionTape';
import FireExtinguisher from '../Model/FireExtinguisher';
import Scales from '../Model/Scale';
import { useThreeContext } from '../Context/threeContext';
import { Physics } from '@react-three/rapier';
import { Player } from '../Model/Controls/Player';
import TestModle from '../Model/Test_Modle';
import { useThree } from "@react-three/fiber";
import { Box, HoleBox } from "../Model/Box";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TestBuilding from "../Model/Test_building";
import { componentMap } from "../util";
import { useSelector, useDispatch } from "react-redux";
import {
    set_s_cameraType,
    set_s_isPlayerShowing,
    set_s_selectedObj_view2,
    set_s_visible_view2,
    setComponentView2,
    set_s_selectedObj_view3,
    set_s_visible_view3,
    setComponentView3,
    set_s_draggingObj,
    set_s_view1Component,
    set_s_screenPos
} from "../Redux/Slice/3Dslice";
import FirstPersonControls from "../Model/Controls/FirstPersonControls";
import Reactor3 from "../Model/Reactor3";

//相機位置與目標-----------------------------------------------------------> 0: cameraPosition, 1: orbitTarget
const positionTarget = {
    default: [[80, 120, 60], []],
    Reactor1: [[0, 20, -20], [-20, 20, -20]],
    Mixer: [[60, 5, -50], [60, 5, -70]]
};

//產生3D物件ID
const generateID = (state, type) => {
    const target = state.filter(x => x.name === type);
    console.log("target:",target);
    if (target.length === 0) {
        return `${type}_1`;
    } else {
        const IDArr = target.map(x => x.id.split("_"));
        return `${type}-${Math.max(...IDArr.map(x => Number(x[1]))) + 1}`;
    }
};

// 轉換平面座標為3D世界座標
export function screenToWorld(screenX, screenY, camera) {
    // 屏幕座標轉成NDC(左上: (-1, 1); 右下:(1, -1))
    const mouse = new THREE.Vector2(
        (screenX / window.innerWidth) * 2 - 1,
        -(screenY / window.innerHeight) * 2 + 1
    );

    // Raycaster 建立一條從相機發射出去的射線
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // 定義一個平面：Y=0（水平地板
    // Plane(normal: 法向量, distance: 到原點的距離)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    // 求射線與平面交點
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);
    const { x, y, z } = intersectPoint
    const pos_arr = [x, y, z].map(el => Number(el.toFixed(2)))
    return pos_arr; //包含x, y = 0, z 
}

export default function ViewContent1({ s_data }) {
    const [s_isShowing_reactor, set_s_isShowing_reactor] = useState(false);  //-----> Panel_ractor顯示與否
    const [s_isShowing_mixer, set_s_isShowing_mixer] = useState(false);      //-----> Panel_mixer顯示與否
    const [s_islocking, set_s_islocking] = useState(false);  //--------------------->視角鎖定與否
    const [s_cameraPosition, set_s_cameraPosition] = useState( //------------------->相機位置
        new THREE.Vector3(...positionTarget.default[0])
    );
    const [s_orbitTarget, set_s_orbitTarget] = useState( //------------------------->相機目標
        new THREE.Vector3(...positionTarget.default[1])
    );

    const { camera } = useThree(); //----------------------------------------------->拿取當前View內的camera

    useEffect(() => {
        console.log("View1重新渲染!")
    }, [])

    // const {
    //     s_cameraType,
    //     s_selectedObj_view2,
    //     set_s_selectedObj_view2,
    //     setComponentView2,
    //     setComponentView3,
    //     s_screenPos,
    //     s_view1Component,
    //     set_s_view1Component,
    //     s_draggingObj
    // } = useThreeContext();

    const {
        s_cameraType,
        s_selectedObj_view2,
        s_screenPos,
        s_view1Component,
        s_draggingObj
    } = useSelector(state => state.three);

    const dispatch = useDispatch();

    const handlePanelShowing = (type) => {
        set_s_islocking(prevState => !prevState);
        // dispatch(set_s_selectedObj_view2(prev => prev === type ? undefined : type));
        dispatch(set_s_selectedObj_view2(type));
        type === "Reactor1" && set_s_isShowing_reactor(prev => !prev);
        type === "Mixer" && setTimeout(() => set_s_isShowing_mixer(prev => !prev), 500)
    };

    

    // 調整相機目標、位置
    useEffect(() => {
        if (s_islocking && s_selectedObj_view2) {
            set_s_cameraPosition(new THREE.Vector3(...positionTarget[s_selectedObj_view2][0]));
            set_s_orbitTarget(new THREE.Vector3(...positionTarget[s_selectedObj_view2][1]));
        }
        else {
            set_s_cameraPosition(new THREE.Vector3(...positionTarget.default[0]));
            set_s_orbitTarget(new THREE.Vector3(...positionTarget.default[1]));
        }
    }, [s_islocking, s_selectedObj_view2]);

    useEffect(() => {
        dispatch(setComponentView2(undefined));
        dispatch(setComponentView3(undefined));
    }, [s_cameraType])

    useEffect(() => {
        if (Object.keys(s_screenPos).length === 0) return;
        const { x, y } = s_screenPos;
        if (s_draggingObj) {
            // set_s_view1Component(prev => [...prev, {
            //     name: s_draggingObj,
            //     props: {
            //         position: screenToWorld(x, y, camera)
            //     }
            // }])
            dispatch(set_s_view1Component({
                name: s_draggingObj,
                // id: `${s_draggingObj}_${s_view1Component.filter(x => x.name === s_draggingObj).length}`,
                id: generateID(s_view1Component, s_draggingObj),
                props: {
                    position: screenToWorld(x, y, camera)
                }
            }))
        }
    }, [s_screenPos])

    useEffect(() => {
        console.log("s_view1Component:", s_view1Component)
    }, [s_view1Component])

    useEffect(() => {
        console.log("觸發相機視角、目標變化")
    }, [s_cameraPosition, s_orbitTarget])

    return (
        <KeyboardControls map={[
            { name: "forward", keys: ["ArrowUp", "w", "W"] },
            { name: "backward", keys: ["ArrowDown", "s", "S"] },
            { name: "left", keys: ["ArrowLeft", "a", "A"] },
            { name: "right", keys: ["ArrowRight", "d", "D"] },
            { name: "jump", keys: ["Space"] },
        ]}>
            <Physics gravity={[0, -30, 0]}>
                {/*光源*/}
                <ambientLight intensity={0.1} />
                <directionalLight
                    castShadow
                    intensity={0.001}
                    position={[0, 100, 0]}
                />
                {/*環境貼圖------------------------------->關鍵: 將自動套用到3D物件的envMap上，尤其使金屬光澤正常呈現，避免光線全吸收後模型變成黑色*/}
                <Environment files="/image/environment/empty_warehouse_01_1k.exr" />
                {/*建築*/}
                <Box type="wall_concrete" position={[10, 45.5, -89.5]} args={[200, 90, 1]} />
                <HoleBox type="wall_concrete" position={[-89.5, 45.5, 10]} args={[1, 90, 200]} />
                <Box type="floor_1" position={[10, 0, 10]} args={[200, 1, 200]} />
                <Box type="wall_concrete" position={[55, 45.5, 35]} args={[15, 90, 15]} />
                {/*3D物件*/}
                <Reactor1
                    position={[-50, -6, -20]}
                    scale={[8, 8, 8]}
                    rotation={[0, Math.PI * 1.5, 0]}
                    onClick={() => handlePanelShowing("Reactor1")}
                />
                {/* <Reactor2 key="reactor2-1" position={[0, 28.5, -60]} onClick={() => dispatch(set_s_selectedObj_view2("Reactor2"))} s_data={s_data} />
                <Reactor2 key="reactor2-2" position={[30, 28.5, -60]} onClick={() => dispatch(set_s_selectedObj_view2("Reactor2"))} s_data={s_data} /> */}
                <Mixer position={[50, 0.55, -70]} rotation={[0, -Math.PI / 2, 0]} onClick={() => handlePanelShowing("Mixer")} />
                <Pallet position={[0, 0, 100]} scale={[12, 12, 12]} />
                <PalletTruck position={[26.5, 0, 50]} scale={[12, 12, 12]} rotation={[0, Math.PI, 0]} />
                <FireExtinguisher position={[65, 5.5, 33]} scale={[5, 5, 5]} rotation={[0, Math.PI / 2, 0]} />
                <FireExtinguisher position={[65, 5.5, 38]} scale={[5, 5, 5]} rotation={[0, Math.PI / 2, 0]} />
                <Scales position={[55, 2, 18]} scale={[1.5, 1.5, 1.5]} rotation={[0, -Math.PI / 2, 0]} />

                <TestModle position={[80, 1, -60]} scale={[1, 1, 1]} rotation={[0, Math.PI, 0]} />
                <Reactor3 position={[0, 1, -60]} onClick={() => dispatch(set_s_selectedObj_view2("Reactor3"))}/>

                {/* 拖拽動態載入模型 */}
                {s_view1Component.length > 0
                    && s_view1Component.map(({ name, id, props }, i) =>
                        <Suspense key={id} fallback={null}>
                            {React.createElement(componentMap[name], { key: id, id, ...props })}
                        </Suspense>
                    )
                }
                {/*x軸警示線*/}
                {Array.from({ length: 22 }).map((x, i) => <CautionTape position={[-90 + 3 * i, 1, 43]} rotation={[0, Math.PI / 4, 0]} />)}
                {Array.from({ length: 28 }).map((x, i) => <CautionTape position={[-24 + 3 * i, 1, -50]} rotation={[0, Math.PI / 4, 0]} />)}
                {Array.from({ length: 11 }).map((x, i) => <CautionTape position={[28 + 3 * i, 1, 8]} rotation={[0, Math.PI / 4, 0]} />)}
                {Array.from({ length: 11 }).map((x, i) => <CautionTape position={[28 + 3 * i, 1, 42]} rotation={[0, Math.PI / 4, 0]} />)}
                {/*z軸警示線*/}
                {Array.from({ length: 31 }).map((x, i) => <CautionTape position={[-24.3, 1, -51 + 3 * i]} rotation={[0, -Math.PI / 4, 0]} />)}
                {Array.from({ length: 13 }).map((x, i) => <CautionTape position={[60, 1, -90 + 3 * i]} rotation={[0, -Math.PI / 4, 0]} />)}
                {Array.from({ length: 6 }).map((x, i) => <CautionTape position={[61.5, 1, 23 - 3 * i]} rotation={[0, -Math.PI / 4, 0]} />)}
                {Array.from({ length: 11 }).map((x, i) => <CautionTape position={[28.5, 1.1, 38 - 3 * i]} rotation={[0, -Math.PI / 4, 0]} />)}
                {/*相機*/}
                {(s_cameraType === "third" || s_cameraType === "drag") && (
                    <ThirdPersonController
                        cameraPosition={s_cameraPosition}
                        orbitTarget={s_orbitTarget}
                        s_islocking={s_islocking}
                        set_s_orbitTarget={set_s_orbitTarget}
                    />
                )}

                {s_cameraType === "first" && (
                    <>
                        <PointerLockControls />
                        <Player />
                    </>
                )}

                {/*2D介面*/}
                {s_isShowing_reactor && <DataTableReactor />}
                {s_isShowing_mixer && <DataTableMixer />}
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
            </Physics>
        </KeyboardControls>
    )
}