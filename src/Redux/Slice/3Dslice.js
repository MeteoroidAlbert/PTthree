import { createSlice } from "@reduxjs/toolkit";

//相機位置與目標------------------------------> 0: cameraPosition, 1: orbitTarget
const positionTarget = {
    default: [[-180, 150, 250], [0, 0, 0]],
    Building1: [[-100, 90, 200], [0, 0, 0]],
    Building2: [[-100, 130, 200], [0, 40, 0]],
    Building3: [[-100, 170, 200], [0, 80, 0]],
    fan_b1: [[0, 20, -90], [0, 15, -130]],
    blinds_b1: [[0, 10, 80], [-40, 10, 80]],
    exhaust_b1: [[0, 10, 0], [40, 10, 0]]
};

const initialState = {
    s_camPos: positionTarget.default[0],
    s_camTarget: positionTarget.default[1],
    s_focusTarget: undefined,
    s_isFocus: false,
    s_view1Component: [
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
    s_annotation_b1: {},

}

const threeDslice = createSlice({
    name: "three",
    initialState,
    reducers: {
        change_s_camPosNTarget(state, action) {
            state.s_camPos = positionTarget[action.payload][0];
            state.s_camTarget = positionTarget[action.payload][1];
        },
        change_s_focusTarget(state, action) {
            state.s_focusTarget = action.payload;
        },
        change_s_isFocus(state, action) {
            state.s_isFocus = action.payload;
        },
        change_s_view1Component: (state, action) => {
            const payload = action.payload;
            if (typeof payload === "function") {
                state.s_view1Component = payload(state.s_view1Component);  // 在reducer直接拿取最新的state處理，避免競爭錯誤
            } else {
                state.s_view1Component = payload;
            }
        },
        reset_allState(state, action) {
            return initialState;
        },
        change_s_annotation_b1(state, action) {
            const { payload } = action
            state.s_annotation_b1 = {
                ...state.s_annotation_b1,
                ...payload,
            }
        },
    }
})

export const {
    change_s_camPosNTarget,
    change_s_cameraType,
    change_s_focusTarget,
    change_s_isFocus,
    change_s_view1Component,
    reset_allState,
    change_s_annotation_b1,
    change_s_test,
} = threeDslice.actions;

export default threeDslice.reducer;