import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Slider, Space, Table } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { RollbackOutlined } from "@ant-design/icons";
import { reset_allState } from "../Redux/Slice/3Dslice";
import LivestockEnergyChart from "../Component/LivestockEnergyChart";

const tableColumns_Evn = [
    {
        title: "畜舍/環境數據",
        dataIndex: "name",
        width: 130,
    },
    {
        title: "二氧化碳",
        dataIndex: "CO2",
        width: 120,
    },
    {
        title: "溫度(℃)",
        dataIndex: "temp",
        width: 120,
    },
    {
        title: "濕度(%, RH)",
        dataIndex: "humidity",
        width: 120,
    },
    {
        title: "噪音(dB)",
        dataIndex: "noise",
        width: 120,
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
    const { s_isFocus } = useSelector(state => state.three);

    const dispatch = useDispatch();

    return (
        <>
            {/* DOM元素 */}
            <Space className="absolute top-0 right-0 z-[100] p-2 bg-white border border-solid rounded-md m-2">
                <Button
                    onClick={() => dispatch(reset_allState())}
                >
                    <RollbackOutlined />回到總覽
                </Button>
            </Space>
            {!s_isFocus && (
                <Table
                    className={`absolute top-5 left-5 z-[100] bg-white border border-solid rounded-md animate-slide-left`}
                    columns={tableColumns_Evn}
                    dataSource={fakeData_Evn}
                    pagination={false}
                />
            )}
            {!s_isFocus && (
                <LivestockEnergyChart/>
            )}

        </>
    )
}