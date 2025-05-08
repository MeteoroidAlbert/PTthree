import { Gltf } from "@react-three/drei";

export default function Pin({position, scale}) {
    return (
        <Gltf
            src="/modal/pin/scene.gltf"
            position={position}
            scale={scale}
        />
    )
}