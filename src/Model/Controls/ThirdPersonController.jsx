import { OrbitControls, PerspectiveCamera, useKeyboardControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as THREE from "three";
import { change_s_camPosNTarget_view2 } from '../../Redux/Slice/3Dslice';

export default function ThirdPersonController({ viewType, cameraPosition, orbitTarget, s_islocking, set_s_orbitTarget }) {
    const { s_camPos_View2, s_camTarget_view2 } = useSelector(state => state.three);
    const dispatch = useDispatch();
    const orbitControlsRef = useRef();
    const cameraRef = useRef();
    const [s_isAnimated, set_s_isAnimated] = useState(false) // 控制是否啟用相機轉移時的動畫

    // 強制打斷useFrame的平滑插值動畫(hint: 這樣就可以不必等到鏡頭移回定點就能進行操作)
    const cancelAnimate = () => {
        set_s_isAnimated(false); //orbitControls事件；onStart: 交互發生時； onEnd: 交互結束時； onChange: 每當OrbitControls做出改變時都會觸發（例如滑動、滾輪縮放、鍵盤縮放）
    }

    useFrame(() => {
        if (!s_isAnimated) return;
        const cam = cameraRef.current;
        const ctrls = orbitControlsRef.current;
        cam?.position.lerp(cameraPosition, 0.05); // 平滑插值: 每幀畫面使相機向目標位置推進5%
        ctrls?.target.lerp(orbitTarget, 0.05); // 使相機看向目標位置推進5%
        ctrls.update();

        // 當相機到達指定位置必須停止動畫
        if (cam?.position.distanceTo(cameraPosition) < 0.1 && ctrls.target.distanceTo(orbitTarget) < 0.1) {
            cam?.position.copy(cameraPosition);
            ctrls.target.copy(orbitTarget);
            set_s_isAnimated(false);
        }
    });

    // useFrame(() => {
    //     if (viewType !== "view1") return;
    //     const cam = cameraRef.current;
    //     const ctrls = orbitControlsRef.current;
    //     // console.log("camera:", {
    //     //     pos: cam.position,
    //     //     target: ctrls.target,
    //     // });
    //     const threshold = 0.1
    //     const { x: px, y: py, z: pz } = cam.position;
    //     const { x: tx, y: ty, z: tz } = ctrls.target;
    //     if (s_camPos_View2?.length === 0 && s_camTarget_view2?.length === 0) {

    //         dispatch(change_s_camPosNTarget_view2({
    //             position: [px, py, pz],
    //             target: [tx, ty, tz]
    //         }))
    //     }
    //     else {
    //         const [xc, yc, zc] = s_camPos_View2;
    //         const [xt, yt, zt] = s_camTarget_view2;
    //         if ((Math.abs(px - xc) > threshold || Math.abs(py - yc) > threshold || Math.abs(pz - zc) > threshold) || (
    //             (Math.abs(tx - xt) > threshold || Math.abs(ty - yt) > threshold || Math.abs(tz - zt) > threshold)
    //         )) {
    //             dispatch(change_s_camPosNTarget_view2({
    //                 position: [px, py, pz],
    //                 target: [tx, ty, tz]
    //             }))
    //         }
    //     }
    // })

    // useFrame(() => {
    //     if (viewType === "view2") {
    //         const cam = cameraRef.current;
    //         const ctrls = orbitControlsRef.current;
    //         cam?.position.lerp(cameraPosition, 0.05); // 平滑插值: 每幀畫面使相機向目標位置推進5%
    //         ctrls?.target.lerp(orbitTarget, 0.05); // 使相機看向目標位置推進5%
    //         ctrls.update();
    //     }
    //     else return
    // })

    useEffect(() => {
        const cam = cameraRef.current;
        const ctrl = orbitControlsRef.current;
        if (!cam || !ctrl) return;

        // 僅當相機位置真的「不同」時才啟用動畫
        const positionChanged = cam.position.distanceTo(cameraPosition) > 0.1;
        const targetChanged = ctrl.target.distanceTo(orbitTarget) > 0.1;

        if (positionChanged || targetChanged) {
            set_s_isAnimated(true);
        }
    }, [cameraPosition, orbitTarget]);

    

    useEffect(() => {
        console.log("相機初始化!")
    }, [])



    return (
        <>
            <PerspectiveCamera ref={cameraRef} fov={60} near={0.1} far={1000} makeDefault />
            <OrbitControls ref={orbitControlsRef} onStart={cancelAnimate} enableRotate={!s_islocking} makeDefault />
        </>

    )
}


