import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useSelector } from 'react-redux';

const FanSpeed = ({ className }) => {
    const { s_focusTargetMain } = useSelector(state => state.three);
    const seriesData = useMemo(() => {
        const dataArr = [
            {
                name: '雞舍',
                data: [1200, 1250, 1230, 1280, 1300, 1340, 1320],
                color: '#f39c12',
            },
            {
                name: '豬舍',
                data: [1100, 1150, 1170, 1190, 1210, 1240, 1225],
                color: '#27ae60',
            },
            {
                name: '牛舍',
                data: [1050, 1080, 1100, 1120, 1140, 1170, 1150],
                color: '#2980b9',
            },
        ];
        if (s_focusTargetMain === "Building1") return dataArr.filter(x => x.name === "雞舍")
        else return dataArr;
    }, [s_focusTargetMain])

    const options = {
        chart: {
            type: 'line',
            backgroundColor: '#173e5e',
        },
        title: {
            text: '畜舍一週風扇轉速變化',
            style: { color: '#ffffff' },
        },
        subtitle: {
            text: '單位：RPM',
            style: { color: '#ffffff' },
        },
        xAxis: {
            categories: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            labels: { style: { color: '#ffffff' } },
        },
        yAxis: {
            title: {
                text: '轉速 (RPM)',
                style: { color: '#ffffff' },
            },
            labels: { style: { color: '#ffffff' } },
        },
        tooltip: {
            shared: true,
            valueSuffix: ' RPM',
        },
        legend: {
            itemStyle: { color: '#ffffff' },
        },
        credits: { enabled: false },
        series: seriesData,
    };

    return (
        <div className={`p-4 bg-[#173e5e] border rounded-md shadow-md w-[600px] opacity-90 ${className}`}>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default FanSpeed;
