import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Slider, Space, Table } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { ConsoleSqlOutlined, HomeOutlined, RollbackOutlined } from "@ant-design/icons";
import { reset_allState, change_s_camPosNTarget } from "../Redux/Slice/3Dslice";
import Annotation from "../Component/annotation";
import { fakeData_Evn } from "../FakeData/data";
import { tableColumns_Evn } from "../FakeData/columns";
import LivestockEnergy from "../Component/Chart/LivestockEnergy";
import LivestockTemp from "../Component/Chart/LivestockTemp";
import Energy_b1 from "../Component/Chart/Energy_b1";
import FanSpeed from "../Component/Chart/FanSpeed";
import BuildingSVG from "../Component/buildingSVG";

export default function AppUI() {
    const { s_isFocus, s_focusTargetMain, s_annotation_b1, s_focusTargetSub } = useSelector(state => state.three);

    const dispatch = useDispatch();

    return (
        <>
            {/* UI 測試區 */}
            <div className="max-w-1/5 absolute top-5 right-5 z-[100] flex flex-col p-2 bg-[#173e5e] border border-white rounded-md opacity-90">
                <div className="text-white flex justify-between items-center text-4xl">
                    <div className="mr-2">
                        {
                            s_focusTargetMain === "Building1"
                                ? "雞舍"
                                : s_focusTargetMain === "Building2"
                                    ? "豬舍"
                                    : s_focusTargetMain === "Building3"
                                        ? "牛舍"
                                        : "畜舍總覽"
                        }
                    </div>
                    {s_isFocus && (
                        <Space>
                            <Button
                                className="bg-[#2a6a85] text-white"
                                onClick={() => dispatch(reset_allState())}
                            >
                                <HomeOutlined />全局總覽
                            </Button>
                            {s_focusTargetSub && (
                                <Button
                                    className="bg-[#2a6a85] text-white"
                                    onClick={() => dispatch(change_s_camPosNTarget(s_focusTargetMain))}
                                >
                                    <RollbackOutlined />局部總覽
                                </Button>
                            )}
                        </Space>
                    )}
                </div>
                {/* miniMap */}
                <div className="w-[250px] h-[250px] -mb-10 -mt-16">
                    <BuildingSVG />
                </div>



            </div>
            {/* 表格數據 測試區 */}
            {!s_isFocus && (
                <>
                    <Table
                        className="absolute top-5 left-5 z-[100] border border-solid rounded-md animate-slide-left bg-white opacity-90"
                        columns={tableColumns_Evn}
                        dataSource={fakeData_Evn}
                        pagination={false}
                        rowClassName={() => "hover:bg-[#6aa8bc]"}
                    />
                    <LivestockEnergy className="absolute bottom-5 left-5 z-[100] animate-slide-left" />
                    <LivestockTemp className="absolute bottom-[23vh] right-5 z-[100] animate-slide-right" />
                </>

            )}
            {s_isFocus && (
                <Table
                    className="absolute top-5 left-5 z-[100] border border-solid rounded-md animate-slide-left bg-white opacity-90"
                    columns={tableColumns_Evn}
                    dataSource={fakeData_Evn.filter(x => {
                        const target = s_focusTargetMain === "Building1"
                            ? "雞舍"
                            : s_focusTargetMain === "Building2"
                                ? "豬舍"
                                : s_focusTargetMain === "Building3"
                                    ? "牛舍"
                                    : null

                        return x.name === target
                    })}
                    pagination={false}
                    rowClassName={() => "hover:bg-[#6aa8bc]"}
                />
            )}
            {s_focusTargetSub === "fan_b1" && (
                <>
                    <FanSpeed className="absolute top-[27vh] right-5 z-[100] animate-slide-right" />
                </>

            )}
            {
                (s_focusTargetMain === "Building1" && !s_focusTargetSub) && (
                    <>
                        <LivestockTemp className="absolute top-[27vh] right-5 z-[100] animate-slide-right" />
                        <Energy_b1 className="absolute bottom-5 left-5 z-[100] animate-slide-left" />
                    </>
                )
            }
            {/*annotation 測試區*/}
            {
                s_focusTargetMain === "Building1" && (
                    <>
                        <Annotation
                            pinX={s_annotation_b1.fan?.x}
                            pinY={s_annotation_b1.fan?.y}
                            label={
                                <div
                                    className="cursor-pointer p-2 bg-[#2a6a85] text-white rounded-md p-2 text-2xl border border-white"
                                    onClick={() => dispatch(change_s_camPosNTarget("fan_b1"))}
                                >
                                    風扇
                                </div>
                            }
                        />
                        <Annotation
                            pinX={s_annotation_b1.blinds?.x}
                            pinY={s_annotation_b1.blinds?.y}
                            label={
                                <div
                                    className="cursor-pointer p-2 bg-[#2a6a85] text-white rounded-md p-2 text-2xl border border-white"
                                    onClick={() => dispatch(change_s_camPosNTarget("blinds_b1"))}
                                >
                                    百葉窗
                                </div>
                            }
                        />
                        <Annotation
                            pinX={s_annotation_b1.exhaust?.x}
                            pinY={s_annotation_b1.exhaust?.y}
                            label={
                                <div
                                    className="cursor-pointer p-2 bg-[#2a6a85] text-white rounded-md p-2 text-2xl border border-white"
                                    onClick={() => dispatch(change_s_camPosNTarget("exhaust_b1"))}
                                >
                                    通風管道
                                </div>
                            }
                        />
                    </>
                )
            }
            {/* miniMap */}
            {/* <div className="w-[250px] h-[250px] absolute z-[100] bottom-5 right-10 ">
                <BuildingSVG />
            </div> */}


        </>
    )
}