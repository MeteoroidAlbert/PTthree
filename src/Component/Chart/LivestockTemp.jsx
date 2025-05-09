import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';

const LivestockTemp = ({className}) => {
    const { s_focusTargetMain } = useSelector(state => state.three);

    const seriesData = useMemo(() => {
        const dataArr = [
            {
                name: '雞舍',
                data: [22.5, 23.0, 22.8, 23.5, 24.0, 24.3, 23.9],
                color: '#f39c12',
            },
            {
                name: '豬舍',
                data: [24.2, 24.6, 24.5, 25.1, 25.0, 25.5, 25.3],
                color: '#27ae60',
            },
            {
                name: '牛舍',
                data: [20.1, 20.3, 20.5, 21.0, 21.2, 21.5, 21.3],
                color: '#2980b9',
            },
        ]
        if (s_focusTargetMain === "Building1") return dataArr.filter(x => x.name === "雞舍")
        else return dataArr;

    }, [s_focusTargetMain])

    const options = {
        chart: {
            type: 'line',
            backgroundColor: '#173e5e',
        },
        title: {
            text: '畜舍一週溫度變化',
            style: {
                color: '#ffffff',
            },
        },
        subtitle: {
            text: '單位：°C',
            style: {
                color: '#ffffff',
            },
        },
        xAxis: {
            categories: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            labels: {
                style: {
                    color: '#ffffff',
                },
            },
        },
        yAxis: {
            title: {
                text: '溫度 (°C)',
                style: {
                    color: '#ffffff',
                },
            },
            labels: {
                style: {
                    color: '#ffffff',
                },
            },
        },
        tooltip: {
            shared: true,
            valueSuffix: ' °C',
        },
        legend: {
            itemStyle: {
                color: '#ffffff',
            },
        },
        credits: {
            enabled: false,
        },
        series: seriesData,
    };

    return (
        <div className={`p-4 bg-[#173e5e] border rounded-md shadow-md w-[450px] opacity-90 ${className}`}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default LivestockTemp;
