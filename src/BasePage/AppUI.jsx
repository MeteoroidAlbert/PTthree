import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Drawer, Form, Input, Row, Slider, Space, Table } from 'antd';
import SceneViews from "./SceneView";
import { useThreeContext } from "../Context/threeContext";
import { useSelector, useDispatch } from "react-redux";
import { set_s_cameraType, set_s_draggingObj } from "../Redux/Slice/3Dslice";
import { For } from "three/examples/jsm/transpiler/AST.js";

export default function AppUI() {
    // const { s_cameraType, set_s_cameraType, set_s_draggingObj} = useThreeContext();
    const { s_cameraType } = useSelector(state => state.three);
    const dispatch = useDispatch();

    return (
        <>
            {/* DOM元素 */}
            <Space className="absolute top-0 right-0 z-[100] p-2 bg-white border border-solid rounded-md m-2">
                <Button
                    onClick={() => {
                        dispatch(set_s_cameraType("first"));
                    }}
                    className={`${s_cameraType === "first" ? "bg-cyan-500 text-white" : null}`}
                >
                    第一人稱
                </Button>
                <Button
                    onClick={() => {
                        dispatch(set_s_cameraType("third"));
                    }}
                    className={`${s_cameraType === "third" ? "bg-cyan-500 text-white" : null}`}
                >
                    第三人稱
                </Button>
                <Button
                    onClick={() => {
                        dispatch(set_s_cameraType("drag"));
                    }}
                    className={`${s_cameraType === "drag" ? "bg-cyan-500 text-white" : null}`}
                >
                    拖拽模式
                </Button>
            </Space>
            <Drawer
                height="270"
                open={s_cameraType === "drag"}
                mask={false}
                placement="bottom"
                closable={false}
            >
                <div className="flex">
                    {/*元件區*/}
                    <div className="w-3/5 flex gap-5">
                        {/*可拖動圖示*/}
                        <div className="flex flex-col items-center w-[97px] h-[97px]">
                            <div
                                className="w-[95px] h-[95px] border border-gray border-solid rounded-md flex flex-col justify-center items-center"
                                onDragStart={() => {
                                    dispatch(set_s_draggingObj("Reactor2"))
                                }}
                                draggable
                            >
                                <img src="./image/toolbar/Reactor2.jpg" />
                            </div>
                            <p>Reactor2</p>
                        </div>
                        <div className="flex flex-col items-center w-[97px] h-[97px]">
                            <div
                                className="w-[95px] h-[95px] border border-gray border-solid rounded-md flex flex-col justify-center items-center"
                                onDragStart={() => {
                                    dispatch(set_s_draggingObj("Reactor3"))
                                }}
                                draggable
                            >
                                <img src="./image/toolbar/Reactor3.jpg" />
                            </div>
                            <p>Reactor3</p>
                        </div>
                    </div>
                    {/*調整區*/}
                    <Form
                        className="w-2/5"
                        layout="vertical"
                    >
                        <Row gutter={[24, 0]}>
                            <Col span={24} className="-mb-8">
                                <Form.Item label="旋轉">
                                    <Slider
                                        min={0}
                                        max={360}
                                        marks={{
                                            0: "0°",
                                            90: "90°",
                                            180: "180°",
                                            270: "270°",
                                            360: "360°"
                                        }} />
                                </Form.Item>
                            </Col>
                            <Col span={24} className="-mb-4">
                                <Form.Item label="縮放">
                                    <Form.Item name="length" noStyle>
                                        <Input addonBefore="長" className="w-[30%] mr-[3%]" />
                                    </Form.Item>
                                    <Form.Item name="width" noStyle>
                                        <Input addonBefore="寬" className="w-[30%] mr-[3%]" />
                                    </Form.Item>
                                    <Form.Item name="height" noStyle>
                                        <Input addonBefore="高" className="w-[30%] mr-[3%]" />
                                    </Form.Item>
                                </Form.Item>
                            </Col>
                            <Col span={24} className="-mb-4">
                                <Form.Item label="位置">
                                    <Form.Item name="x" noStyle>
                                        <Input addonBefore="x" className="w-[30%] mr-[3%]" />
                                    </Form.Item>
                                    <Form.Item name="y" noStyle>
                                        <Input addonBefore="y" className="w-[30%] mr-[3%]" />
                                    </Form.Item>
                                    <Form.Item name="z" noStyle>
                                        <Input addonBefore="z" className="w-[30%] mr-[3%]" />
                                    </Form.Item>
                                </Form.Item>
                            </Col>



                        </Row>
                    </Form>
                </div>
            </Drawer>
        </>
    )
}