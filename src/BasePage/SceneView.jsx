import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Environment, GizmoHelper, GizmoViewport, Html, KeyboardControls, OrbitControls, PointerLockControls, Text, useHelper, View } from '@react-three/drei';
import Reactor1 from '../Model/Reactor1';
import Reactor2 from '../Model/Reactor2';
import ThirdPersonController from '../Model/camera/ThirdPersonController';
import Mixer from '../Model/Mixer';
import Pallet from '../Model/Pallet';
import { DataTableMixer, DataTableReactor } from '../Component/DataTable';
import PalletTruck from '../Model/PalletTruck';
import CautionTape from '../Model/CautionTape';
import FireExtinguisher from '../Model/FireExtinguisher';
import Scales from '../Model/Scale';
import { useThreeContext } from '../Context/threeContext';
import { Physics } from '@react-three/rapier';
import { Player } from '../Model/camera/Player';
import TestModle from '../Model/Test_Modle';
import { useThree } from "@react-three/fiber";
import { Box, HoleBox } from "../Model/Box";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TestBuilding from "../Model/Test_building";
import { componentMap } from "../util";


//相機位置與目標-----------------------------------------------------------> 0: cameraPosition, 1: orbitTarget
const positionTarget = {
    default: [[80, 120, 60], []],
    Reactor1: [[0, 20, -20], [-20, 20, -20]],
    Mixer: [[60, 5, -50], [60, 5, -70]]
};

export default function SceneViews({ s_data }) {
    const {
        s_cameraType,
        set_s_selectedObj_view2,
        s_visible_view2,
        ComponentView2,
        setComponentView2,
        set_s_selectedObj_view3,
        s_visible_view3,
        ComponentView3,
        setComponentView3,
    } = useThreeContext();

    return (
        <>
            <View key="view1" index={1} className="absolute w-full h-full">
                <ViewContent1 s_data={s_data} />
                {/* <ViewContent4/> */}
            </View>
            {(ComponentView2 && s_cameraType === "third") && (
                <View
                    key="view2"
                    index={2}
                    className={`absolute top-0 left-0 w-[40%] h-full transition-transform duration-500 ease-in-out ${s_visible_view2 ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <ViewContent2 s_data={s_data} />
                </View>
            )}
            {/* View2關閉按鈕 */}
            {s_visible_view2 && (
                <CloseOutlined
                    className={`absolute top-2 left-2 z-[100] transition-transform duration-1000 ease-in-out ${s_visible_view2 ? "translate-x-0" : "-translate-x-full"}`}
                    onClick={() => {
                        setComponentView2(undefined);
                        set_s_selectedObj_view2(undefined);
                    }}
                />
            )}
            {(ComponentView3 && s_cameraType === "third") && (
                <View
                    key="view3"
                    index={3}
                    className={`absolute top-16 right-5 w-[40%] h-[40%] transition-transform duration-500 ease-in-out ${s_visible_view3 ? "translate-y-0" : "-translate-y-full"}`}
                >
                    <ViewContent3 />
                </View>
            )}
            {/* View3關閉按鈕 */}
            {s_visible_view3 && (
                <CloseOutlined
                    className={`absolute top-[72px] right-7 z-[100] transition-transform duration-1000 ease-in-out ${s_visible_view3 ? "translate-y-0" : "-translate-y-full"}`}
                    onClick={() => {
                        setComponentView3(undefined);
                        set_s_selectedObj_view3(undefined);
                    }}
                />
            )}
        </>
    )
}

function ViewContent1({ s_data }) {
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


    const {
        s_cameraType,
        s_selectedObj_view2,
        set_s_selectedObj_view2,
        setComponentView2,
        setComponentView3,
        s_screenPos,
        s_view1Component,
        set_s_view1Component,
        s_draggingObj
    } = useThreeContext();

    const handlePanelShowing = (type) => {
        set_s_islocking(prevState => !prevState);
        set_s_selectedObj_view2(prev => prev === type ? undefined : type);
        type === "Reactor1" && set_s_isShowing_reactor(prev => !prev);
        type === "Mixer" && setTimeout(() => set_s_isShowing_mixer(prev => !prev), 500)
    };

    // 轉換平面座標為3D世界座標
    function screenToWorld(screenX, screenY, camera) {
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

        return intersectPoint; //包含x, y = 0, z 
    }

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
        setComponentView2(undefined);
        setComponentView3(undefined);
    }, [s_cameraType])

    useEffect(() => {
        // console.log("s_screenPos:", s_screenPos);
        const { x, y } = s_screenPos;
        console.log(screenToWorld(x, y, camera));
        if (s_draggingObj) {
            set_s_view1Component(prev => [...prev, {
                name: s_draggingObj,
                props: {
                    position: screenToWorld(x, y, camera)
                }
            }])
        }


    }, [s_screenPos])

    useEffect(() => {
        console.log("s_view1Component:", s_view1Component)
    }, [s_view1Component])

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
                <Reactor2 key="reactor2-1" position={[0, 28.5, -60]} onClick={() => set_s_selectedObj_view2("Reactor2")} s_data={s_data} />
                <Reactor2 key="reactor2-2" position={[30, 28.5, -60]} onClick={() => set_s_selectedObj_view2("Reactor2")} s_data={s_data} />
                <Mixer position={[50, 0.55, -70]} rotation={[0, -Math.PI / 2, 0]} onClick={() => handlePanelShowing("Mixer")} />
                <Pallet position={[0, 0, 100]} scale={[12, 12, 12]} />
                <PalletTruck position={[26.5, 0, 50]} scale={[12, 12, 12]} rotation={[0, Math.PI, 0]} />
                <FireExtinguisher position={[65, 5.5, 33]} scale={[5, 5, 5]} rotation={[0, Math.PI / 2, 0]} />
                <FireExtinguisher position={[65, 5.5, 38]} scale={[5, 5, 5]} rotation={[0, Math.PI / 2, 0]} />
                <Scales position={[55, 2, 18]} scale={[1.5, 1.5, 1.5]} rotation={[0, -Math.PI / 2, 0]} />

                <TestModle position={[80, 1, -60]} scale={[1, 1, 1]} rotation={[0, Math.PI, 0]} />

                {s_view1Component.length > 0 && s_view1Component.map((x, i) => React.createElement(componentMap[x.name], { key: i, ...x.props }))}
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

function ViewContent2({ s_data }) {
    const { ComponentView2 } = useThreeContext();

    // 強制避免re-render造成視角變化
    const camPos = useMemo(() => new THREE.Vector3(25, 25, 25), [ComponentView2]);
    const camTarget = useMemo(() => new THREE.Vector3(0, 1, 0), [ComponentView2]);

    return (
        <>
            <Physics gravity={[0, -30, 0]}>
                <color attach="background" args={['#d6edf3']} />
                <ComponentView2 clickable_view1={false} clickable_view2={true} position={[0, 0, 0]} s_data={s_data} />
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

function ViewContent3() {
    const { ComponentView3 } = useThreeContext();

    // 強制避免re-render造成視角變化
    const camPos = useMemo(() => new THREE.Vector3(5, 5, 5), [ComponentView3]);
    const camTarget = useMemo(() => new THREE.Vector3(0, 1, 0), [ComponentView3]);

    return (
        <>
            <color attach="background" args={['#eef39d']} />
            <ComponentView3 clickable_view1={false} position={[0, 0, 0]} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 100, 10]} />
            <Environment files="/image/environment/empty_warehouse_01_1k.exr" />
            <ThirdPersonController
                cameraPosition={camPos}
                orbitTarget={camTarget}
            />

        </>
    )

}

function ViewContent4() {
    const [s_cameraPosition, set_s_cameraPosition] = useState( //------------------->相機位置
        new THREE.Vector3(...positionTarget.default[0])
    );
    const [s_orbitTarget, set_s_orbitTarget] = useState( //------------------------->相機目標
        new THREE.Vector3(...positionTarget.default[1]))

    const { s_cameraType } = useThreeContext();

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

            <TestBuilding position={[0, 0, 0]} />
            {(s_cameraType === "third" || s_cameraType === "drag") && (
                <ThirdPersonController
                    cameraPosition={s_cameraPosition}
                    orbitTarget={s_orbitTarget}
                    set_s_orbitTarget={set_s_orbitTarget}
                />
            )}
        </>
    )
}