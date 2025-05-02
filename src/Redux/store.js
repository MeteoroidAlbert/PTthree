import { configureStore } from "@reduxjs/toolkit";
import threeReducer from "./Slice/3Dslice"

export const store = configureStore({
    reducer: {
        three: threeReducer,
    }
});