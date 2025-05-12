import React, { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { View, Environment } from '@react-three/drei';
import ViewContent1 from "./ViewContent1";
import ViewContent2 from "./ViewContent2";



export default function SceneViews() {

    return (
        <>
            <View key="view1" index={1} className="absolute w-full h-full">
                <ViewContent1 />
            </View>
            {/* <View key="view2" index={2} className="absolute z-[10] bottom-5 right-5 w-[15%] h-[15%]">
                <ViewContent2 />
            </View> */}
        </>
    )
}







