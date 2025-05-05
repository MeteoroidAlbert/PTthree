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
import ViewContent1 from "./ViewContent1";
import ViewContent2 from "./ViewContent2";
import ViewContent3 from "./ViewContent3";
import ViewContent4 from "./ViewContent4";



export default function SceneViews({ s_data }) {
    // const {
    //     s_cameraType,
    //     set_s_selectedObj_view2,
    //     s_visible_view2,
    //     ComponentView2,
    //     setComponentView2,
    //     set_s_selectedObj_view3,
    //     s_visible_view3,
    //     ComponentView3,
    //     setComponentView3,
    // } = useThreeContext();

    const {
        s_cameraType,
        s_selectedObj_view2,
        s_visible_view2,
        ComponentView2,
        s_selectedObj_view3,
        s_visible_view3,
        ComponentView3,
    } = useSelector(state => state.three);

    const dispatch = useDispatch();

    // 延遲visible = true(hint: 使View2可以表現出Drawer行為)
    useEffect(() => {
        if (s_selectedObj_view2 && s_cameraType === "third") {
            setTimeout(() => {
                dispatch(set_s_visible_view2(true));
            }, 100)

        }
        else {
            dispatch(set_s_visible_view2(false));
        }
    }, [s_selectedObj_view2])


    // 延遲visible = true(hint: 使View3可以表現出Drawer行為)
    useEffect(() => {
        if (s_selectedObj_view3 && s_cameraType === "third") {
            setTimeout(() => {
                dispatch(set_s_visible_view3(true));
            }, 100)

        }
        else {
            dispatch(set_s_visible_view3(false));
        }
    }, [s_selectedObj_view3])

    return (
        <>
            <View key="view1" index={1} className="absolute w-full h-full">
                <ViewContent1 s_data={s_data} />
                {/* <ViewContent4/> */}
            </View>
            {(s_selectedObj_view2 && s_cameraType === "third") && (
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
                        dispatch(setComponentView2(undefined));
                        dispatch(set_s_selectedObj_view2(undefined));
                    }}
                />
            )}
            {(s_selectedObj_view3 && s_cameraType === "third") && (
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
                        dispatch(setComponentView3(undefined));
                        dispatch(set_s_selectedObj_view3(undefined));
                    }}
                />
            )}
        </>
    )
}







