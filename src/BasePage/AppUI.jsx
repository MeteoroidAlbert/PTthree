import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Slider, Space, Table } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { ConsoleSqlOutlined, RollbackOutlined } from "@ant-design/icons";
import { reset_allState, change_s_camPosNTarget } from "../Redux/Slice/3Dslice";
import LivestockEnergyChart from "../Component/LivestockEnergyChart";
import Annotation from "../Component/annotation";

const tableColumns_Evn = [
    {
        title: "畜舍/環境數據",
        dataIndex: "name",
        width: 130,
        onCell: () => ({ className: "bg-[#173e5e] text-white" }),
        onHeaderCell: () => {
            return {
                style: {
                    backgroundColor: "#2a6a85",
                    color: "#fff",
                },
            };
        },
    },
    {
        title: "二氧化碳",
        dataIndex: "CO2",
        width: 120,
        onCell: () => ({ className: "bg-[#173e5e] text-white" }),
        onHeaderCell: () => {
            return {
                style: {
                    backgroundColor: "#2a6a85",
                    color: "#fff",
                },
            };
        },
    },
    {
        title: "溫度(℃)",
        dataIndex: "temp",
        width: 120,
        onCell: () => ({ className: "bg-[#173e5e] text-white" }),
        onHeaderCell: () => {
            return {
                style: {
                    backgroundColor: "#2a6a85",
                    color: "#fff",
                },
            };
        },
    },
    {
        title: "濕度(%, RH)",
        dataIndex: "humidity",
        width: 120,
        onCell: () => ({ className: "bg-[#173e5e] text-white" }),
        onHeaderCell: () => {
            return {
                style: {
                    backgroundColor: "#2a6a85",
                    color: "#fff",
                },
            };
        },
    },
    {
        title: "噪音(dB)",
        dataIndex: "noise",
        width: 120,
        onCell: () => ({ className: "bg-[#173e5e] text-white" }),
        onHeaderCell: () => {
            return {
                style: {
                    backgroundColor: "#2a6a85",
                    color: "#fff",
                },
            };
        },
    }
]

const fakeData_Evn = [
    {
        name: "雞舍",
        CO2: "900ppm",
        temp: "24",
        humidity: "65",
        noise: "61",
    },
    {
        name: "豬舍",
        CO2: "1200ppm",
        temp: "21",
        humidity: "68",
        noise: "62",
    },
    {
        name: "牛舍",
        CO2: "1200ppm",
        temp: "25",
        humidity: "67",
        noise: "58",
    },
]

export default function AppUI() {
    const { s_isFocus, s_focusTarget, s_annotation_b1 } = useSelector(state => state.three);

    const dispatch = useDispatch();

    return (
        <>
            {/* UI 測試區 */}
            {s_isFocus && (<Space className="absolute top-0 right-0 z-[100] p-2 m-2">
                <Button
                    className="bg-[#2a6a85] text-white"
                    onClick={() => dispatch(reset_allState())}
                >
                    <RollbackOutlined />回到總覽
                </Button>
            </Space>)}
            {/* 表格數據 測試區 */}
            {!s_isFocus && (
                <Table
                    className="absolute top-5 left-5 z-[100] border border-solid rounded-md animate-slide-left bg-white opacity-90"
                    columns={tableColumns_Evn}
                    dataSource={fakeData_Evn}
                    pagination={false}
                    rowClassName={() => "hover:bg-[#6aa8bc]"}
                />
            )}
            {!s_isFocus && (
                <LivestockEnergyChart />
            )}
            {s_isFocus && (
                <Table
                    className="absolute top-5 left-5 z-[100] border border-solid rounded-md animate-slide-left bg-white opacity-90"
                    columns={tableColumns_Evn}
                    dataSource={fakeData_Evn.filter(x => {
                        const target = s_focusTarget === "Building1"
                            ? "雞舍"
                            : s_focusTarget === "Building2"
                                ? "豬舍"
                                : s_focusTarget === "Building3"
                                    ? "牛舍"
                                    : null

                        return x.name === target
                    })}
                    pagination={false}
                    rowClassName={() => "hover:bg-[#6aa8bc]"}
                />
            )}
            {/*annotation 測試區*/}
            {
                s_focusTarget === "Building1" && (
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



        </>
    )
}