import { Gltf } from '@react-three/drei';
export default function TestBox({ position, scale, rotation }) {
    const src1 = "/modal/testBox/Cube/Cube_1.gltf";
    const src2 = "/modal/testBox/Cube_2/Cube_2.gltf";
    const src3 = "/modal/testBox/Cube_3/Cube_3.gltf";
    const src4 = "/modal/testBox/Cube_4/Cube_4.gltf";

    return (
        <group
            position={position}
            scale={scale}
            rotation={rotation}
        >
            <Gltf
                src={src1}
            />
            <Gltf
                src={src2}
                position={[0, 0, -15]}
            />
            <Gltf
                src={src3}
                position={[0, 0, -30]}
            />
            <Gltf
                src={src4}
                position={[0, 0, -45]}
            />
        </group>

    )
}