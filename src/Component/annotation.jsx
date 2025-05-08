export default function Annotation({ label, pinX, pinY, labelX, labelY }) {
    // if ([pinX, pinY, labelX, labelY].some(x => x === null)) return null

    return (
        <div className="animate-fade-in">
            <div
                className="absolute z-[99] "
                style={{ transform: `translate3d(${labelX}px, ${labelY}px, 0)` }}
            >
                {label}
            </div>
            {[pinX, pinY].every(x => x !== null) && (
                <div
                className="absolute z-[99] bg-white border border-solid border-black rounded-full h-2 w-2"
                style={{ transform: `translate3d(${pinX}px, ${pinY}px, 0)` }}
            />
            )}
            
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
