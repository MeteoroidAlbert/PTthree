import { DragControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useDispatch } from "react-redux";
import { useAdjustYToGround } from "../../Hooks/useAdjustYToGround";
import { adjustPosition } from "../../Redux/Slice/3Dslice";
import { useThree } from "@react-three/fiber";
export default function CustomDragControls({ children, objectRef, modelID, enable }) {
    const dispatch = useDispatch();
    const adjustYToGround = useAdjustYToGround();

    const { scene } = useThree();
    const object = scene.getObjectByName(modelID);



    const handleDragEnd = () => {
        //取得綁定3D物件的世界座標

        const worldPosition = new THREE.Vector3();
        objectRef.current.getWorldPosition(worldPosition);
        const localPos = objectRef.current.parent.worldToLocal(worldPosition.clone());
        console.log("原來是界標:", worldPosition);
        console.log("轉換後本地座標:", localPos);

        const pos_arr = Object.values(worldPosition).map(x => Number(x.toFixed(2)));

        adjustYToGround(objectRef, pos_arr, modelID);


        // const position = new THREE.Vector3();
        // const quaternion = new THREE.Quaternion();
        // const scale = new THREE.Vector3();

        // objectRef.current.updateMatrixWorld();
        // objectRef.current.matrixWorld.decompose(position, quaternion, scale);

        // console.log("Precise world position:", position);


    };

    return (
        <DragControls dragLimits={[undefined, [0, 0], undefined]} onDragEnd={handleDragEnd}>
            {children}
        </DragControls>
    );
}
