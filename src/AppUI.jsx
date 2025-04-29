import React, { useRef } from "react";
import { Button, Space, Table } from 'antd';

export default function AppUI() {
    const [s_data, set_s_data] = useState(undefined);  // 存取後端資料
    const ws = useRef(null);
    let wsURL = "ws://localhost:5000";

    const connectToWs = () => {
        if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
            console.log("WebSocket is already connected or connecting.");
            return;
        };

        if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            ws.current = new WebSocket(wsURL);   //與目的地建立websocket連線

            ws.current.addEventListener("message", handleMessage);   //監聽對象:ws (即與url指向的伺服器的websocket連線);監聽事件:伺服器向客戶端發送message
            ws.current.addEventListener("close", () => {
                setTimeout(() => {
                    console.log('Disconnected. Trying to reconnect.');
                    connectToWs();
                }, 1000);
            });
        }
    }

    const handleMessage = (e) => {
        const messageData = JSON.parse(e.data);
        // console.log({ e, messageData });

        if (messageData.type === "test") {
            set_s_data(messageData.value);
        }
    }

    useEffect(() => {
        connectToWs();
    }, [])

    return (
        <div className="relative w-full h-screen bg-black">
            <Space className="absolute top-0 right-0 z-[100] p-2 bg-white border border-solid rounded-md m-2">
                <Button
                    onClick={() => {
                        set_s_cameraType("first");
                    }}
                    className={`${s_cameraType === "first" ? "bg-cyan-500 text-white" : null}`}
                >
                    第一人稱
                </Button>
                <Button
                    onClick={() => {
                        set_s_cameraType("third");
                    }}
                    className={`${s_cameraType === "third" ? "bg-cyan-500 text-white" : null}`}
                >
                    第三人稱
                </Button>
                <Button
                    onClick={() => {
                        set_s_cameraType("drag");
                    }}
                    className={`${s_cameraType === "drag" ? "bg-cyan-500 text-white" : null}`}
                >
                    拖拽模式
                </Button>
            </Space>
            {/* <SceneViews /> */}
        </div>
    )
}