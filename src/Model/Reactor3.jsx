import { Gltf } from '@react-three/drei';
export default function Reactor3({ position, scale, rotation }) {
    return (
        <Gltf
            src={"/modal/reactor3/Reactor3.gltf"}
            position={position} 
            scale={scale}
            rotation={rotation}
        />
    )
}