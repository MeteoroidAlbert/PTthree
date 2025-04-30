import React, { useEffect, useRef, useState } from "react";
import { Button, Drawer, Space, Table } from 'antd';
import SceneViews from "./SceneView";
import { useThreeContext } from "../Context/threeContext";

export default function AppUI() {
    const { s_cameraType, set_s_cameraType, set_s_view1Component, set_s_draggingObj} = useThreeContext();

    return (
        <>
            {/* DOM元素 */}
            <Space className="absolute top-0 right-0 z-[100] p-2 bg-white border border-solid rounded-md m-2">
                <Button
                    onClick={() => {
                        set_s_cameraType("first");
                    }}
                    className={`${s_cameraType === "first" ? "bg-cyan-500 text-white" : null}`}
                >
                    第一人稱
                </Button>
                <Button
                    onClick={() => {
                        set_s_cameraType("third");
                    }}
                    className={`${s_cameraType === "third" ? "bg-cyan-500 text-white" : null}`}
                >
                    第三人稱
                </Button>
                <Button
                    onClick={() => {
                        set_s_cameraType("drag");
                    }}
                    className={`${s_cameraType === "drag" ? "bg-cyan-500 text-white" : null}`}
                >
                    拖拽模式
                </Button>
            </Space>
            <Drawer
                height="200"
                open={s_cameraType === "drag"}
                mask={false}
                placement="bottom"
            >
                <div 
                    className="w-[95px] h-[95px] border border-gray border-solid rounded-md flex justify-center items-center"
                    onDragStart={() => {
                        set_s_draggingObj("Reactor2")
                    }}
                    draggable
                >
                    Reactor2
                </div>
            </Drawer>
        </>
    )
}