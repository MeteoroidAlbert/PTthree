import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { change_s_camPosNTarget, change_s_isFocus, reset_allState } from "../Redux/Slice/3Dslice";

const BuildingSVG = () => {
    const [s_hoverArea, set_s_hoverArea] = useState(undefined);

    const dispatch = useDispatch();

    const { s_focusTargetMain } = useSelector(state => state.three);

    const handleMouseEnter = (building) => {
        set_s_hoverArea(building);
    }

    const handleMouseLeave = () => set_s_hoverArea(undefined);

    const handleClick = (building) => {
        dispatch(reset_allState());
        setTimeout(() => {
            dispatch(change_s_camPosNTarget(building));
            dispatch(change_s_isFocus(true));
        }, 100)

    }

    const getFill = (building) => s_focusTargetMain === building
        ? "#ffa500"
        : s_hoverArea === building
            ? "#ffd700"
            : "#2a6a85";

    useEffect(() => {
        set_s_hoverArea(s_focusTargetMain);
    }, [s_focusTargetMain])

    return (
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            {/* Building1 */}
            <g onMouseEnter={() => handleMouseEnter("Building1")} onMouseLeave={handleMouseLeave} onClick={() => handleClick("Building1")}>
                {/* 頂面 */}
                <polygon points="60,180 160,210 260,210 160,180" fill={getFill("Building1")} stroke="white" opacity={0.7} />
                {/* 側面 */}
                <polygon points="60,180 60,210 160,240 160,210" fill={getFill("Building1")} stroke="white" opacity={0.7} />
                {/* 正面 */}
                <polygon points="160,210 160,240 260,240 260,210" fill={getFill("Building1")} stroke="white" opacity={0.7} />
                {/* Label */}
                <text x="20" y="200" fill="white" fontSize={20} textAnchor="middle">雞舍</text>


            </g>


            {/* Building2 */}
            <g onMouseEnter={() => handleMouseEnter("Building2")} onMouseLeave={handleMouseLeave} onClick={() => handleClick("Building2")}>
                {/* 頂面 */}
                <polygon points="60,140 160,140 260,170 160,170" fill={getFill("Building2")} stroke="white" opacity={0.7} />
                {/* 側面 */}
                <polygon points="60,140 60,170 160,200 160,170" fill={getFill("Building2")} stroke="white" opacity={0.7} />
                {/* 正面 */}
                <polygon points="160,200 260,200 260,170 160,170" fill={getFill("Building2")} stroke="white" opacity={0.7} />
                {/* Label */}
                <text x="20" y="160" fill="white" fontSize={20} textAnchor="middle">豬舍</text>
            </g>


            {/* Building3 */}
            <g onMouseEnter={() => handleMouseEnter("Building3")} onMouseLeave={handleMouseLeave} onClick={() => handleClick("Building3")}>
                {/* 頂面 */}
                <polygon points="60,100 160,100 260,130 160,130" fill={getFill("Building3")} stroke="white" opacity={0.7} />
                {/* 側面 */}
                <polygon points="60,100 60,130 160,160 160,130" fill={getFill("Building3")} stroke="white" opacity={0.7} />
                {/* 正面 */}
                <polygon points="160,130 160,160 260,160 260,130" fill={getFill("Building3")} stroke="white" opacity={0.7} />
                {/* Label */}
                <text x="20" y="120" fill="white" fontSize={20} textAnchor="middle">牛舍</text>
            </g>
        </svg>
    )


};

export default BuildingSVG;
