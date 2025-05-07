import React, { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { View, Environment } from '@react-three/drei';
import ViewContent1 from "./ViewContent1";



export default function SceneViews() {

    return (
        <>
            <View key="view1" index={1} className="absolute w-full h-full">
                <ViewContent1 />
            </View>
        </>
    )
}







