import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

export default function R3FCanvas({ eventSource }) {
    return (
      <Canvas eventSource={eventSource} className="bg-[#b0c4de]">
        <View.Port />
      </Canvas>
    )
  }
  