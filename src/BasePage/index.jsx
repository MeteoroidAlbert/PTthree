import React, { useRef } from "react";
import AppUI from "./AppUI";
import R3FCanvas from "./R3FCanvas";

export default function ThreeScene() {
    const divRef = useRef();

    return (
        <div ref={divRef} className="relative w-full h-screen">
            <AppUI /> {/* DOM UI 元件 */}
            <R3FCanvas eventSource={divRef} />
        </div>
    )
}