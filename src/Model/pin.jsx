import { Gltf } from "@react-three/drei";

export default function Pin({position, scale}) {
    return (
        <Gltf
            src="/3D_models/pin/scene.gltf"
            position={position}
            scale={scale}
        />
    )
}