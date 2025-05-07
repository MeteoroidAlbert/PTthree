import { Gltf, useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from "three";

export default function TestBuilding({ position, scale, rotation }) {
    const [s_isOpen, set_s_isOpen] = useState({
        "DA_820_FAN": false,
        "DA_17K_System_Plane": false,
        "DA_17K_System_Plane_2": false,
        "DA_17K_System_Plane_3": false,
        "DA_17K_System_Plane_4": false,
        "DA_17K_System_Plane_5": false,
    })
    const modleRef = useRef();

    const { animations, materials, scene } = useGLTF("/modal/test/Scene.gltf")
    const { actions } = useAnimations(animations, modleRef);

    const handleClick = (e) => {
        e.stopPropagation();
        const clickName = e.object.name;

        console.log("clickName:", clickName);

        // let action;
        // if (clickName === "DA_820_FAN") action = actions["DA 820 FAN_Action"];
        // if (clickName === "DA_17K_System_Plane") action = actions["DA 17K System_PlaneAction"];
        // if (clickName === "DA_17K_System_Plane_2") action = actions["DA 17K System_PlaneAction_2"];
        // if (clickName === "DA_17K_System_Plane_3") action = actions["DA 17K System_PlaneAction_3"];
        // if (clickName === "DA_17K_System_Plane_4") action = actions["DA 17K System_PlaneAction_4"];
        // if (clickName === "DA_17K_System_Plane_5") action = actions["DA 17K System_PlaneAction_5"];

        // if (!action) return;

        // action.reset()
        //     .setLoop(THREE.LoopOnce)
        //     .clampWhenFinished = true

        // if (!s_isOpen[clickName]) {
        //     action.time = 0; // 起始時間點
        //     action.timeScale = 1; // 順軸進行
        //     set_s_isOpen(prev => ({
        //         ...prev,
        //         [clickName]: true,
        //     }))
        // }
        // else {
        //     action.time = action.getClip().duration //getClip: 返回存有此AnimationClip; .ducration: 動畫總長度 ---> 終點時間點 
        //     action.timeScale = -1 // 逆軸進行
        //     set_s_isOpen(prev => ({
        //         ...prev,
        //         [clickName]: false,
        //     }))
        // }
        // action.play(); // 順放or 倒放動畫
        for (let actionAnimation in actions) {
            // if (actionAnimation.includes("BF55")) actions[actionAnimation].play();
            actions["example_mat"].play();

        }
    }


    useEffect(() => {
        console.log("actions:", actions);
        console.log("animation:", animations)
        console.log("materials:", materials);
        console.log("object3D:", scene);

        if (Object.keys(actions).length > 0) {
            console.log("有動畫")
            for (let actionAnimation in actions) {
                // if (actionAnimation.includes("BF55")) actions[actionAnimation].play();
                actions[actionAnimation].play();

            }
        }
    }, [actions])






    return (
        <Gltf
            ref={modleRef}
            src={"/modal/test/Scene.gltf"}
            position={position}
            scale={scale}
            rotation={rotation}
            onClick={handleClick}
        />
    )
}