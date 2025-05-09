import { useSpring } from '@react-spring/three';
import { Gltf, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { change_s_isFocus, change_s_camPosNTarget, change_s_view1Component } from '../Redux/Slice/3Dslice';

export default function Building3({ position, scale, rotation }) {
    const [s_shouldUnMount, set_s_shouldUnMount] = useState(false);
    const { s_isFocus, s_focusTargetMain, s_view1Component } = useSelector(state => state.three);

    const dispatch = useDispatch();

    const modelRef = useRef();

    const [s_isOpen, set_s_isOpen] = useState({
        "DA_820_FAN": false,
        "DA_17K_System_Plane": false,
        "DA_17K_System_Plane_2": false,
        "DA_17K_System_Plane_3": false,
        "DA_17K_System_Plane_4": false,
        "DA_17K_System_Plane_5": false,
    });

    const { materials, animations, scene } = useGLTF("/modal/b3/scene.gltf");
    const { actions } = useAnimations(animations, modelRef);

    const { opacity } = useSpring({
        opacity: !s_isFocus || s_focusTargetMain === "Building3" ? 1 : 0.5,
        config: { tension: 120, friction: 20 }
    });

    // 每幀spring-opacity動態設置透明度
    useFrame(() => {
        if (!modelRef.current) return;

        const current = opacity.get();
        modelRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = opacity.get();
            }
        });
        if (current === 0.5) set_s_shouldUnMount(true);
    });

    const handleClick = (e) => {
        e.stopPropagation();

        if (s_isFocus) {
            const clickName = e.object.name;
            let action = null;
            if (clickName === "DA_820_FAN") action = actions["DA 820 FAN_Action"];
            if (clickName === "DA_17K_System_Plane") action = actions["DA 17K System_PlaneAction"];
            if (clickName === "DA_17K_System_Plane_2") action = actions["DA 17K System_PlaneAction_2"];
            if (clickName === "DA_17K_System_Plane_3") action = actions["DA 17K System_PlaneAction_3"];
            if (clickName === "DA_17K_System_Plane_4") action = actions["DA 17K System_PlaneAction_4"];
            if (clickName === "DA_17K_System_Plane_5") action = actions["DA 17K System_PlaneAction_5"];

            if (!action) return;

            action.reset().setLoop(THREE.LoopOnce, 1).clampWhenFinished = true;

            if (!s_isOpen[clickName]) {
                action.time = 0;
                action.timeScale = 1;
                set_s_isOpen(prev => ({ ...prev, [clickName]: true }));
            } else {
                action.time = action.getClip().duration;
                action.timeScale = -1;
                set_s_isOpen(prev => ({ ...prev, [clickName]: false }));
            }
            action.play();
        } else {
            dispatch(change_s_isFocus(true));
            dispatch(change_s_camPosNTarget("Building3"));
        }
    };

    // 遍歷材質的transparent屬性，確保為true，才能夠改變透明度
    useEffect(() => {
        if (!modelRef.current) return;
        modelRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;

            }
        });
    }, [scene]);


    // 設定初始動畫播放
    useEffect(() => {
        // console.log("actions:", actions);
        // console.log("animation:", animations)
        // console.log("materials:", materials);
        // console.log("object3D:", scene);

        if (Object.keys(actions).length > 0) {
            for (let actionAnimation in actions) {
                if (actionAnimation.includes("BF55")) actions[actionAnimation].play();

            }
        }
    }, [actions])

    useEffect(() => {
        if (s_shouldUnMount) {
            dispatch(change_s_view1Component(prev => prev.filter(x => x.name !== "Building3")));
        }
    }, [s_shouldUnMount]);
    


    return (
        <group ref={modelRef} position={position} scale={scale} rotation={rotation}>
            {/* <primitive object={scene} onClick={handleClick} /> */}
            <Gltf src="/modal/b3/scene.gltf" position={[0, 0, 0]} onClick={handleClick}/>
        </group>
    );
}
