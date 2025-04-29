import React from "react";
import * as THREE from "three";
import { View } from "@react-three/drei";
import { Billboard, Environment, GizmoHelper, GizmoViewport, KeyboardControls, PointerLockControls, Text, useHelper, View } from '@react-three/drei';
import Reactor1 from './Modal/Reactor1';
import Reactor2 from './Modal/Reactor2';
import ThirdPersonController from './Modal/camera/ThirdPersonController';
import Mixer from './Modal/Mixer';
import Pallet from './Modal/Pallet';
import { DataTableMixer, DataTableReactor } from './Component/DataTable';
import PalletTruck from './Modal/PalletTruck';
import CautionTape from './Modal/CautionTape';
import FireExtinguisher from './Modal/FireExtinguisher';
import Scales from './Modal/Scale';
import { useThreeContext } from './Context/threeContext';
import { Physics } from '@react-three/rapier';
import { Player } from './Modal/camera/Player';
import TestModle from './Modal/TestModle';




export default function SceneViews() {
    return (
        <>
            <View key="view1" index={1} className="absolute w-full h-full">
                <ViewContent1 />
            </View>
            {(ComponentView2 && s_cameraType === "third") && (
                <View key="view2" index={2} className={`absolute top-0 left-0 w-[40%] h-full transition-transform duration-500 ease-in-out ${s_visible_view2 ? "translate-x-0" : "-translate-x-full"}`}>
                    <ViewContent2 />
                </View>
            )}
            {(ComponentView3 && s_cameraType === "third") && (
                <View key="view3" index={3} className={`absolute top-16 right-5 w-[40%] h-[40%] transition-transform duration-500 ease-in-out ${s_visible_view3 ? "translate-y-0" : "-translate-y-full"}`}>
                    <ViewContent3 />
                </View>
            )}
        </>
    )
}

function ViewContent1() {
    const { camera, size } = useThree()

    useEffect(() => {
        console.log("R3F Context Available:", camera, size)
    }, [camera])

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
                    ref={lightRef}
                    intensity={0.003}
                    position={[0, 50, 0]}
                />
                {/*環境貼圖---關鍵: 將自動套用到3D物件的envMap上，尤其使金屬光澤正常呈現，避免光線全吸收後模型變成黑色*/}
                <Environment preset="warehouse" />
                {/*建築*/}
                <Box type="wall_marble" position={[10, 45.5, -89.5]} args={[200, 90, 1]} />
                <HoleBox type="wall_marble" position={[-89.5, 45.5, 10]} args={[1, 90, 200]} />
                <Box type="floor_1" position={[10, 0, 10]} args={[200, 1, 200]} />
                <Box type="wall_marble" position={[55, 45.5, 35]} args={[15, 90, 15]} />
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

                <TestModle position={[-25, 1, -60]} scale={[1, 1, 1]} rotation={[0, Math.PI, 0]} />              {/*x軸警示線*/}
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

function ViewContent2() {
    return (
        <>
            <Physics gravity={[0, -30, 0]}>
                <color attach="background" args={['#d6edf3']} />
                <ComponentView2 clickable_view1={false} clickable_view2={true} position={[0, 0, 0]} s_data={s_data} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 100, 10]} />
                <ThirdPersonController
                    cameraPosition={new THREE.Vector3(25, 25, 25)}
                    orbitTarget={new THREE.Vector3(0, 1, 0)}
                />
            </Physics>
        </>
    )
}

function ViewContent3() {
    <>


        <Physics gravity={[0, -30, 0]}>
            <color attach="background" args={['#eef39d']} />
            <ComponentView3 clickable_view1={false} position={[0, 0, 0]} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 100, 10]} />
            <ThirdPersonController
                cameraPosition={new THREE.Vector3(5, 5, 5)}
                orbitTarget={new THREE.Vector3(0, 1, 0)}
            />
        </Physics>


    </>
}