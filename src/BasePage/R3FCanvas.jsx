import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import SceneViews from "./SceneView";

export default function R3FCanvas({ eventSource, s_data }) {
  return (
    <>
      <SceneViews s_data={s_data}/>
      <Canvas eventSource={eventSource} className="bg-[#b0c4de]">
        <View.Port />
      </Canvas>
    </>

  )
}
