export const tableColumns_Evn = [
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