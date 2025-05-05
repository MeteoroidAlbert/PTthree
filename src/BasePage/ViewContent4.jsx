import React, { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Environment, GizmoHelper, GizmoViewport, Html, KeyboardControls, OrbitControls, PointerLockControls, Text, useHelper, View } from '@react-three/drei';
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

export default function ViewContent4() {
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