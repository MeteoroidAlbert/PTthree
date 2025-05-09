import { createSlice } from "@reduxjs/toolkit";

//相機位置與目標 [0: cameraPosition; 1: orbitTarget]
const positionTarget = {
    default: [[-180, 150, 250], [0, 0, 0]],
    Building1: [[-100, 90, 200], [0, 0, 0]],
    Building2: [[-100, 130, 200], [0, 40, 0]],
    Building3: [[-100, 170, 200], [0, 80, 0]],
    fan_b1: [[20, 20, -70], [20, 15, -130]],
    blinds_b1: [[0, 10, 80], [-40, 10, 80]],
    exhaust_b1: [[0, 10, 0], [40, 10, 0]]
};

const initialState = {
    s_camPos: positionTarget.default[0], // -------------> 相機位置: Array
    s_camTarget: positionTarget.default[1], // ----------> 相機目標位置(看向的目標位置): Array
    s_focusTargetMain: undefined,   // ------------------> 相機正在聚焦的主體目標(building1/2/3): String
    s_focusTargetSub: undefined,    // ------------------> 相機正在聚焦的主體目標下的副目標: String
    s_isFocus: false, // --------------------------------> 聚焦與否: boolean
    s_view1Component: [ // ------------------------------> 渲染元件: [Object]
        {
            name: "Building1",
            props: {
                position: [0, 0, 0]
            }
        },
        {
            name: "Building2",
            props: {
                position: [0, 40, 0]
            }
        },
        {
            name: "Building3",
            props: {
                position: [0, 80, 0]
            }
        }
    ],
    s_annotation_b1: {}, // -----------------------------> Building1元件內部要放置annotation pin的位置
    
}

const threeDslice = createSlice({
    name: "three",
    initialState,
    reducers: {
        change_s_camPosNTarget(state, action) {
            const payload = action.payload 
            state.s_camPos = positionTarget[payload][0];
            state.s_camTarget = positionTarget[payload][1];

            if (payload.includes("Building")) state.s_focusTargetMain = action.payload;
            else {
                if (payload === "default") state.s_focusTargetSub = undefined;
                else state.s_focusTargetSub = action.payload;
            } 
            
        },
        change_s_isFocus(state, action) {
            state.s_isFocus = action.payload;
        },
        change_s_view1Component: (state, action) => {
            const payload = action.payload;
            if (typeof payload === "function") {
                // 在reducer直接拿取最新的state處理，避免同步多地調用時，拿到錯誤的state資料
                state.s_view1Component = payload(state.s_view1Component);  
            } else {
                state.s_view1Component = payload;
            }
        },
        change_s_annotation_b1(state, action) {
            const { payload } = action
            state.s_annotation_b1 = {
                ...state.s_annotation_b1,
                ...payload,
            }
        },
        reset_allState(state, action) {
            return initialState;
        },
    }
})

export const {
    change_s_camPosNTarget,
    change_s_cameraType,
    change_s_isFocus,
    change_s_view1Component,
    change_s_annotation_b1,
    reset_allState,
} = threeDslice.actions;


export default threeDslice.reducer;