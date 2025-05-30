import React, { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';

const LivestockEnergy = ({ className }) => {
    const { s_focusTargetMain } = useSelector(state => state.three);

    const [s_options, set_s_option] = useState({
        chart: {
            type: 'column',
            backgroundColor: "#173e5e",

        },
        title: {
            text: '當週畜舍每日用電量',
            style: {
                color: "#ffffff"
            }
        },
        subtitle: {
            text: '單位：kWh',
            style: {
                color: "#ffffff"
            }
        },
        xAxis: {
            categories: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            crosshair: true,
            labels: {
                style: {
                    color: '#ffffff',
                },
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: '用電量 (kWh)',
                style: {
                    color: "#ffffff"
                }
            },
            labels: {
                style: {
                    color: '#ffffff',
                },
            },
        },
        tooltip: {
            shared: true,
            valueSuffix: ' kWh',
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
        },
        series: [
            {
                name: '雞舍',
                data: [120, 130, 125, 140, 138, 150, 145],
                color: '#f39c12',

            },
            {
                name: '豬舍',
                data: [160, 170, 165, 180, 175, 190, 185],
                color: '#27ae60',
            },
            {
                name: '牛舍',
                data: [200, 210, 205, 220, 215, 230, 225],
                color: '#2980b9',
            },

        ],
        legend: {
            itemStyle: {
                color: '#ffffff',
            },
        },
        credits: {
            enabled: false,
        },

    })

    const seriesData = useMemo(() => {
        const dataArr = [
            {
                name: '雞舍',
                data: [120, 130, 125, 140, 138, 150, 145],
                color: '#f39c12',

            },
            {
                name: '豬舍',
                data: [160, 170, 165, 180, 175, 190, 185],
                color: '#27ae60',
            },
            {
                name: '牛舍',
                data: [200, 210, 205, 220, 215, 230, 225],
                color: '#2980b9',
            },

        ]
        if (s_focusTargetMain === "Building1") return dataArr.filter(x => x.name === "雞舍")
        else return dataArr;
    }, [s_focusTargetMain])

    useEffect(() => {
        set_s_option(prev => ({
            ...prev,
            series: seriesData
        }))
    }, [s_focusTargetMain])

    return (
        <div className={`p-4 bg-[#173e5e] border rounded-md shadow-md w-[600px] opacity-90 ${className}`}>
            <HighchartsReact highcharts={Highcharts} options={s_options} />
        </div>
    );
};

export default LivestockEnergy;
