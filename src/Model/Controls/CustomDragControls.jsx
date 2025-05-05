import { DragControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

export default function CustomDragControls({ children, objectRef }) {
    const modelRef = useRef()

    const handleDragEnd = () => {
        console.log(objectRef.current?.position)
    };

    return (
        <DragControls dragLimits={[undefined, [0, 0], undefined]} onDragEnd={handleDragEnd}>
            {children}
        </DragControls>
    );
}
