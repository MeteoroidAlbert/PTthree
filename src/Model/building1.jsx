import { useSpring } from '@react-spring/three';
import { Gltf, Html, Line, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { change_s_isFocus, change_s_focusTarget, change_s_view1Component, change_s_annotation_b1 } from '../Redux/Slice/3Dslice';
import Pin from './pin';

// Annotation Pins的位置(hint: Anno Pin就是屏幕上看到的各個標記白點，這個3D位置的初始值需要被紀錄，隨後再轉換成屏幕DOM元素該顯示的位置)
const annotationPoints = [
    { id: "fan", position: new THREE.Vector3(-13, 22, -130) },
    { id: "blinds", position: new THREE.Vector3(-40, 10, 80) },
    { id: "exhaust", position: new THREE.Vector3(40, 10, 0) }
]


export default function Building1({ position, scale, rotation }) {
    const [s_shouldUnMount, set_s_shouldUnMount] = useState(false); // ------> 判斷元件本身是否該被卸載
    const [s_isOpen, set_s_isOpen] = useState({ // --------------------------> 判斷模型上自控動畫啟動與否
        "DA_820_FAN": false,
        "DA_17K_System_Plane": false,
        "DA_17K_System_Plane_2": false,
        "DA_17K_System_Plane_3": false,
        "DA_17K_System_Plane_4": false,
        "DA_17K_System_Plane_5": false,
    });
    const { s_isFocus, s_focusTarget, s_annotation_b1 } = useSelector(state => state.three);

    const dispatch = useDispatch();

    const modelRef = useRef();
    

    const { camera, gl } = useThree();

    const { materials, animations, scene } = useGLTF("/modal/b1/scene.gltf"); //---> 取得.gltf模型內容
    const { actions } = useAnimations(animations, modelRef);   // -----------------> 綁定動畫到指定模型上

    // 建立動畫、效果參數
    const { opacity } = useSpring({ 
        opacity: !s_isFocus || s_focusTarget === "Building1" ? 1 : 0.5,
        config: { tension: 120, friction: 20 } // 動畫參數: tension: 動畫快慢; friction: 動畫慢停(hint: 想成摩擦力)
    });

    // 每幀處理內容
    useFrame(() => {
        if (!modelRef.current) return;

        // 1. 每幀spring-opacity動態設置透明度(使模型改變透明度)
        const current = opacity.get();
        modelRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = opacity.get();
            }
        });

        // 1.1 透明度達0.5時，應該卸載元件
        if (current === 0.5) set_s_shouldUnMount(true);

        // 2. 每幀處理3D世界的Pin位置，轉換後的位置就是Pin DOM元素在屏幕上該出現的位置 
        // 2.1 轉映世界座標 --> NDC座標 --> 平面座標 --> 平面座標形成state --> 傳給DOM元素做style變化
        annotationPoints.forEach(({ id, position }) => {
            // 世界 --> NDC
            const vector = position.clone().project(camera);

            // 判斷是否在 NDC 合法區間內 (-1 ~ 1) (hint: 表示該座標在視野範圍之內)
            const isVisible = vector.x >= -1 && vector.x <= 1 &&
                vector.y >= -1 && vector.y <= 1 &&
                vector.z >= -1 && vector.z <= 1;

            // NDC --> 平面 (hint: visible為false表示不再範圍內，所以不該返回平面座標)
            const x = isVisible ? Number(((vector.x + 1) / 2 * gl.domElement.clientWidth).toFixed(0)) : null;
            const y = isVisible 
                ? Number(((-vector.y + 1) / 2 * gl.domElement.clientHeight).toFixed(0))
                : null;

            

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

    // 點擊事件
    const handleClick = (e) => {
        e.stopPropagation(); // 阻止冒泡觸發父元件事件

        // 1. 決定應該觸發的內容:
        // 1.1 s_isFocus為true時，表示當前視角聚焦在單一畜舍上，可以觸發額外動畫等互動
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
        } 
        // 1.2 s_isFocus為false時，應該使視角聚焦到單一畜舍上
        else {
            dispatch(change_s_isFocus(true));
            dispatch(change_s_focusTarget("Building1"));
        }
    };

    // 遍歷材質的transparent屬性，確保為true，才能夠確保useFrame(1.)可以生效
    useEffect(() => {
        if (!modelRef.current) return;
        modelRef.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;
            }
        });
    }, [scene]);


    // 設定初掛載下，應該直接播放的動畫
    useEffect(() => {
        if (Object.keys(actions).length > 0) {
            for (let actionAnimation in actions) {
                if (actionAnimation.includes("BF55")) actions[actionAnimation].play();
            }
        }
    }, [actions])


    // 決定是否卸載這個元件本身 (hint: 渲染方式是利用s_view1Component這個state是否存有對應的Component Name來決定)
    useEffect(() => {
        if (s_shouldUnMount) {
            dispatch(change_s_view1Component(prev => prev.filter(x => x.name !== "Building1")));
        }
    }, [s_shouldUnMount]);

    return (
        <group ref={modelRef} position={position} scale={scale} rotation={rotation}>
            <Gltf src="/modal/b1/scene.gltf" position={[0, 0, 0]} onClick={handleClick} />
        </group>
    );
}
