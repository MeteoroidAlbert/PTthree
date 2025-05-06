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
    const ctrlsRef = useRef(); 
    



    const handleDragEnd = () => {
        //取得綁定3D物件的世界座標

        const worldPosition = new THREE.Vector3();
        objectRef.current.getWorldPosition(worldPosition);
        const localPos = objectRef.current.parent.worldToLocal(worldPosition.clone());
        console.log("原來世界座標:", worldPosition);
        console.log("轉換後本地座標:", localPos);

        const pos_arr = Object.values(worldPosition).map(x => Number(x.toFixed(2)));

        adjustYToGround(objectRef, pos_arr, modelID);
        
    };

    useEffect(() => {
        if (ctrlsRef.current) {
            console.log(ctrlsRef.current)
            ctrlsRef.current.enabled = enable;
        }
    }, [enable])


    return (
        <DragControls ref={ctrlsRef} dragLimits={[undefined, [0, 0], undefined]} onDragEnd={handleDragEnd}>
            {children}
        </DragControls>
    );
}
