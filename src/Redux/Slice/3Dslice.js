import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    s_cameraType: "third",
    s_isPlayerShowing: false,
    s_selectedObj_view2: undefined,
    s_visible_view2: false,
    ComponentView2: undefined,
    s_selectedObj_view3: undefined,
    s_visible_view3: false,
    ComponentView3: undefined,
    s_draggingObj: undefined, //拖拉、調整中元件
    s_view1Component: [],
    s_screenPos: {}
}

const threeDslice = createSlice({
    name: "three",
    initialState,
    reducers: {
        set_s_cameraType(state, action) {
            state.s_cameraType = action.payload;
        },
        set_s_isPlayerShowing(state, action) {
            state.s_isPlayerShowing = action.payload;
        },
        set_s_selectedObj_view2(state, action) {
            const prev = state.s_selectedObj_view2;
            const current = action.payload;
            if (prev === current) state.s_selectedObj_view2 = undefined;
            else state.s_selectedObj_view2 = action.payload;

        },
        set_s_visible_view2(state, action) {
            state.s_visible_view2 = action.payload;
        },
        setComponentView2(state, action) {
            state.ComponentView2 = action.payload;
        },
        set_s_selectedObj_view3(state, action) {
            state.s_selectedObj_view3 = action.payload;
        },
        set_s_visible_view3(state, action) {
            state.s_visible_view3 = action.payload;
        },
        setComponentView3(state, action) {
            state.ComponentView3 = action.payload;
        },
        set_s_draggingObj(state, action) {
            state.s_draggingObj = action.payload;
        },
        set_s_view1Component(state, action) {
            state.s_view1Component.push(
                action.payload
            )
        },
        set_s_screenPos(state, action) {
            state.s_screenPos = action.payload;
        },
        
        adjustPosition(state, action) {
            const {id, position} = action.payload;
            state.s_view1Component = state.s_view1Component.map(x => ({
                ...x,
                props: {
                    ...x.props,
                    position: x.id === id ? position : x.props.position  
                }
                
            }))
        }
    }
})

export const {
    set_s_cameraType,
    set_s_isPlayerShowing,
    set_s_selectedObj_view2,
    set_s_visible_view2,
    setComponentView2,
    set_s_selectedObj_view3,
    set_s_visible_view3,
    setComponentView3,
    set_s_draggingObj,
    set_s_view1Component,
    set_s_screenPos,
    adjustPosition
} = threeDslice.actions;

export default threeDslice.reducer;