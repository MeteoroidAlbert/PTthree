import { useSelector } from "react-redux";

export default function Annotation({ label, pinX, pinY }) {
    
    // 依據當前接收到的pinX，並以屏幕中間寬的值來決定label該平移到哪個位置(hint: 避免不同label間的線段，因為3D世界沿Y軸旋轉造成交錯問題)
    const halfWidth = window.innerWidth / 2;
    const offsetX = 200;
    const offsetY = 100;

    const labelX = pinX < halfWidth ? pinX - offsetX : pinX + offsetX;
    const labelY = pinY - offsetY;


    return (
        <div className="animate-fade-in">
            {/* label 內容 */}
            <div
                className="absolute z-[99] "
                style={{ transform: `translate3d(${labelX}px, ${labelY}px, 0)` }}
            >
                {label}
            </div>

            {/* DOM pin  */}
            {/* 條件式渲染 (hint: 避免在3D世界座標轉換回平面座標時，把在視野之外的座標也渲染帶入屏幕座標，導致DOM元素渲染位置錯誤) */}
            {[pinX, pinY].every(x => x !== null) && (
                <div
                className="absolute z-[99] bg-white border border-solid border-black rounded-full h-2 w-2"
                style={{ transform: `translate3d(${pinX}px, ${pinY}px, 0)` }}
            />
            )}
            
            {/* 線段 */}
            <svg
                className="pointer-events-none absolute top-0 left-0 z-[98]"
                width={window.innerWidth}
                height={window.innerHeight}
            >
                <line
                    x1={pinX}
                    y1={pinY}
                    x2={labelX + 10}
                    y2={labelY + 10}
                    stroke="white"
                    strokeWidth="1"
                />
            </svg>
        </div>
    );
}
