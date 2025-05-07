import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThreeScene from "./BasePage";


export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/plant" element={<ThreeScene/>}/>
            </Routes>
        </BrowserRouter>
    )
}