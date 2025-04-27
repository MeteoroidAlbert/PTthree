import { Gltf, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from "three";
import { ColorManagement } from 'three'

export default function TestModle({ position, scale, rotation }) {
    const [s_isOpen, set_s_isOpen] = useState({
        SmallLock: false,
        TopLock: false,
    })
    const modleRef = useRef();

    const { animations, materials } = useGLTF("/modal/testModle/normal/Sejong Pharmatech_20250424.gltf")
    const { actions } = useAnimations(animations, modleRef);

    // ColorManagement.enabled = true
    // ColorManagement.workingColorSpace = 'srgb'



    // useEffect(() => {
    //     for (const mat of Object.values(materials)) {
    //         if (mat.map) {
    //             mat.map.encoding = 3000 // 或 sRGBEncoding，如果版本允許
    //             mat.map.needsUpdate = true
    //         }
    //     }
    // }, [materials])

    // 處理點擊觸發動畫
    const handleClick = (e) => {
        e.stopPropagation();
        const clickName = e.object.name;

        console.log("clickName:", clickName);
        let actionName;
        if (clickName === "SmallLock") actionName = "SmallLock";
        if (clickName === "TopLock") actionName = "TopLock";

        const action = actions[`${actionName}_Action`];

        if (!action) return;

        action.reset()  // 重置該action
            .setLoop(THREE.LoopOnce) // 設置循環方法
            .clampWhenFinished = true // 將動作停留在動畫最後一幀

        if (!s_isOpen[actionName]) {
            action.time = 0; // 起始時間點
            action.timeScale = 1; // 順軸進行
            set_s_isOpen(prev => ({
                ...prev,
                [actionName]: true,
            }))
        }
        else {
            action.time = action.getClip().duration //getClip: 返回存有此AnimationClip; .ducration: 動畫總長度 ---> 終點時間點 
            action.timeScale = -1 // 逆軸進行
            set_s_isOpen(prev => ({
                ...prev,
                [actionName]: false,
            }))
        }
        action.play(); // 順放or 倒放動畫

    }

    useEffect(() => {
        console.log("actions:", actions);
        console.log("animation:", animations)
        console.log("materials:", materials);
    }, [actions])



    return (
        <Gltf
            ref={modleRef}
            src={"/modal/testModle/normal/Sejong Pharmatech_20250424.gltf"}
            position={position}
            scale={scale}
            rotation={rotation}
            onClick={handleClick}
        />
    )
}