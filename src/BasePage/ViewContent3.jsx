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

export default function ViewContent3() {
    // const { ComponentView3 } = useThreeContext();
    const { ComponentView3, s_selectedObj_view3 } = useSelector(state => state.three)

    // 強制避免re-render造成視角變化
    const camPos = useMemo(() => new THREE.Vector3(5, 5, 5), [s_selectedObj_view3]);
    const camTarget = useMemo(() => new THREE.Vector3(0, 1, 0), [s_selectedObj_view3]);

    return (
        <>
            <color attach="background" args={['#eef39d']} />
            {
                s_selectedObj_view3 &&
                React.createElement(componentMap[s_selectedObj_view3], { clickable_view1: false, position: new THREE.Vector3(0, 0, 0) })
            }
            {/* <ComponentView3 clickable_view1={false} position={[0, 0, 0]} /> */}
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