import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LivestockEnergyChart = () => {
    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: '當週畜舍每日用電量',
        },
        subtitle: {
            text: '單位：kWh',
        },
        xAxis: {
            categories: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            crosshair: true,
        },
        yAxis: {
            min: 0,
            title: {
                text: '用電量 (kWh)',
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
    };

    return (
        <div className="p-4 bg-white border rounded-md shadow-md absolute bottom-5 left-5 z-[100] w-[600px] animate-slide-left">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default LivestockEnergyChart;
