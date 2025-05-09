import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Energy_b1 = ({ className }) => {
    const [s_ops, set_s_ops] = useState({
        chart: {
            type: 'column',
            backgroundColor: '#173e5e',
        },
        title: {
            text: '雞舍一週每日設備用電分布',
            style: { color: '#ffffff' },
        },
        subtitle: {
            text: '單位：kWh',
            style: { color: '#ffffff' },
        },
        xAxis: {
            categories: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            labels: { style: { color: '#ffffff' } },
        },
        yAxis: {
            min: 0,
            title: {
                text: '每日總用電量 (kWh)',
                style: { color: '#ffffff' },
            },
            labels: { style: { color: '#ffffff' } },
            stackLabels: {
                enabled: true,
                style: {
                    color: 'white',
                    fontWeight: 'bold',
                },
            },
        },
        legend: {
            itemStyle: { color: '#ffffff' },
        },
        tooltip: {
            shared: true,
            valueSuffix: ' kWh',
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false,
                },
            },
        },
        series: [
            {
                name: '風扇',
                data: [60, 65, 70, 68, 72, 74, 69],
                color: '#f39c12',
            },
            {
                name: '照明',
                data: [25, 24, 26, 27, 28, 30, 29],
                color: '#27ae60',
            },
            {
                name: '自動飼料系統',
                data: [20, 19, 18, 21, 22, 23, 22],
                color: '#2980b9',
            },
            {
                name: '加熱器',
                data: [15, 16, 15, 14, 13, 12, 12],
                color: '#e74c3c',
            },
        ],
        credits: { enabled: false },
    })

    // const options = ;

    return (
        <div className={`p-4 bg-[#173e5e] border rounded-md shadow-md w-[600px] opacity-90 ${className}`}>
            <HighchartsReact highcharts={Highcharts} options={s_ops} />
        </div>
    );
};

export default Energy_b1;
