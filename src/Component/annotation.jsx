import { useEffect, useState, useRef } from "react";

const offsetX = 200;
const offsetY = 100;

export default function Annotation({ label, pinX, pinY }) {
    const halfWidth = window.innerWidth / 2;

    const [s_labelX, set_s_labelX] = useState(pinX);
    const [s_labelY, set_s_labelY] = useState(pinY);


    useEffect(() => {
        if (pinX === null || pinY === null) return;
        // 依據當前接收到的pinX，並以屏幕中間寬的值來決定label該平移到哪個位置(hint: 避免不同label間的線段，因為3D世界沿Y軸旋轉造成交錯問題)
        const targetX = pinX < halfWidth ? pinX - offsetX : pinX + offsetX;
        const targetY = pinY - offsetY;

        // 設定插值動畫以平滑過度state的變更(hint: 避免label立即跳顯到定位)
        const lerp = (a, b, t) => a + (b - a) * t;
        const animate = () => {
            set_s_labelX((prev) => lerp(prev, targetX, 0.1));
            set_s_labelY((prev) => lerp(prev, targetY, 0.1));
        };

        animate();
    }, [pinX, pinY]);


    return (
        // pinter-event-none 不可以刪掉，刪掉會造成3D Canvas被這個div DOM層給覆蓋住，畫布將無法進行交互(hint: pointer-event-none會允許穿透該元素層之下的滑鼠事件發生)!
        // 直接使用className進行元素隱藏，可以避免該label內容不在視野時被卸載掉(hint: 可以想像成，假如label是個antd Table並且已經callAPI 獲得Data了，hidden --> block時，就不需要再重新掛載CallAPI)
        <div className={`animate-fade-in pointer-events-none ${(pinX === null || pinY === null) ? "hidden" : "block"}`}>
            {/* label 內容 */}
            <div
                className="absolute z-[99] pointer-events-auto"
                style={{ transform: `translate3d(${s_labelX}px, ${s_labelY}px, 0)` }}
            >
                {label}
            </div>

            {/* DOM pin  */}
            <div
                className="absolute z-[99] bg-white border border-solid border-black rounded-full h-2 w-2"
                style={{ transform: `translate3d(${pinX}px, ${pinY}px, 0)` }}
            />

            {/* svg line */}
            <svg
                className="absolute top-0 left-0 z-[98]"
                width={window.innerWidth}
                height={window.innerHeight}
            >
                <line
                    x1={pinX}
                    y1={pinY}
                    x2={s_labelX + 10}
                    y2={s_labelY + 10}
                    stroke="white"
                    strokeWidth="1"
                />
            </svg>
        </div>
    );
}
