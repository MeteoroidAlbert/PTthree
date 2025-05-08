import { useSpring } from '@react-spring/three';
import { Gltf, Html, Line, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { change_s_isFocus, change_s_focusTarget, change_s_view1Component, change_s_annotation_b1, change_s_test } from '../Redux/Slice/3Dslice';
import Pin from './pin';


const annotationPoints = [
    { id: "fan", position: new THREE.Vector3(-13, 22, -130) },
    { id: "blinds", position: new THREE.Vector3(-40, 10, 80) },
    { id: "exhaust", position: new THREE.Vector3(40, 10, 0) }
]


export default function Building1({ position, scale, rotation }) {
    const [s_shouldUnMount, set_s_shouldUnMount] = useState(false);
    const [s_isOpen, set_s_isOpen] = useState({
        "DA_820_FAN": false,
        "DA_17K_System_Plane": false,
        "DA_17K_System_Plane_2": false,
        "DA_17K_System_Plane_3": false,
        "DA_17K_System_Plane_4": false,
        "DA_17K_System_Plane_5": false,
    });
    const { s_isFocus, s_focusTarget, s_annotation_b1, s_test } = useSelector(state => state.three);

    const dispatch = useDispatch();

    const modelRef = useRef();
    const lastAnnoRef = useRef();


    const { camera, gl } = useThree();

    const { materials, animations, scene } = useGLTF("/modal/b1/scene.gltf");
    const { actions } = useAnimations(animations, modelRef);

    const { opacity } = useSpring({
        opacity: !s_isFocus || s_focusTarget === "Building1" ? 1 : 0.5,
        config: { tension: 120, friction: 20 }
    });


    useFrame(() => {
        if (!modelRef.current) return;

        // 每幀spring-opacity動態設置透明度
        const current = opacity.get();
        modelRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = opacity.get();
            }
        });
        if (current === 0.5) set_s_shouldUnMount(true);

        // 轉映世界座標至平面NDC座標
        annotationPoints.forEach(({ id, position }) => {
            const vector = position.clone().project(camera);

            // 判斷是否在 NDC 合法區間內 (-1 ~ 1)
            const isVisible = vector.x >= -1 && vector.x <= 1 &&
                vector.y >= -1 && vector.y <= 1 &&
                vector.z >= -1 && vector.z <= 1;



            const x = isVisible ? Number(((vector.x + 1) / 2 * gl.domElement.clientWidth).toFixed(0)) : null;
            const y = isVisible ? Number(((-vector.y + 1) / 2 * gl.domElement.clientHeight).toFixed(0)) : null;



            const targetAnno = s_annotation_b1[id]
            const threshold = 0.1;

            const hasChanged =
                !targetAnno ||
                Math.abs(targetAnno?.x - x) > threshold ||
                Math.abs(targetAnno?.y - y) > threshold;

            if (hasChanged) {
                dispatch(change_s_annotation_b1({ [id]: { x, y } }));

            }
        });

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
            dispatch(change_s_focusTarget("Building1"));
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
        if (Object.keys(actions).length > 0) {
            for (let actionAnimation in actions) {
                if (actionAnimation.includes("BF55")) actions[actionAnimation].play();

            }
        }
    }, [actions])

    useEffect(() => {
        if (s_shouldUnMount) {
            dispatch(change_s_view1Component(prev => prev.filter(x => x.name !== "Building1")));
        }
    }, [s_shouldUnMount]);

    useEffect(() => {
        console.log("s_annotation_b1:", s_annotation_b1);
    }, [s_annotation_b1])

    return (
        <group ref={modelRef} position={position} scale={scale} rotation={rotation}>
            <Gltf src="/modal/b1/scene.gltf" position={[0, 0, 0]} onClick={handleClick} />
        </group>
    );
}
