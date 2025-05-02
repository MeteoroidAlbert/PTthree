import React, { useEffect, useRef, useState } from "react";
import AppUI from "./AppUI";
import R3FCanvas from "./R3FCanvas";
import { useThreeContext } from "../Context/threeContext";
import { useSelector, useDispatch } from "react-redux";
import { set_s_screenPos } from "../Redux/Slice/3Dslice";

export default function ThreeScene() {
    const [s_data, set_s_data] = useState(undefined);  // 存取後端資料
    // const { set_s_screenPos } = useThreeContext();
    const dispatch = useDispatch();

    const ws = useRef(null);
    const divRef = useRef();

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
                // setTimeout(() => {
                //     console.log('Disconnected. Trying to reconnect.');
                //     connectToWs();
                // }, 1000);
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

    const handleOndrop = (event) => {
        event.preventDefault();
        const screenPos = {
            x: event.clientX,
            y: event.clientY,
        }
        // set_s_screenPos(screenPos);
        dispatch(set_s_screenPos(screenPos));
        setTimeout(() => {
            // set_s_screenPos({});
            dispatch(set_s_screenPos({}))
        }, [500])
    }

    const handleOnDragOver = (event) => {
        event.preventDefault() // 讓onDrop能正常觸發
    }

    useEffect(() => {
        connectToWs();
    }, [])

    return (
        <div ref={divRef} className="relative w-full h-screen" >
            <AppUI /> {/* DOM UI 元件 */}
            <div className="w-full h-full" onDrop={handleOndrop} onDragOver={handleOnDragOver}>
                <R3FCanvas eventSource={divRef} s_data={s_data} />
            </div>

        </div>
    )
}