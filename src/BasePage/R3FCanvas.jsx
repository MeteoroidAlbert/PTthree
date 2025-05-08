import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import SceneViews from "./SceneView";

export default function R3FCanvas({ eventSource, s_data }) {
  console.log("整個Canvas重新渲染!")

  return (
    <>
      <SceneViews s_data={s_data}/>
      <Canvas eventSource={eventSource} className="bg-[#011d2b]">
        <View.Port />
      </Canvas>
    </>

  )
}
