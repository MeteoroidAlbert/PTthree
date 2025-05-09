import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"

const Box = ({ position, scale, args }) => {
    return (
        <mesh position={position} scale={scale}>
            <boxGeometry args={args} />
            <meshStandardMaterial color="gray"/>
        </mesh>
    )
}

export default function ViewContent2() {


    return (
        <>
            <color attach="background" args={['#d6edf3']} />
            {/* 光源 */}
            <ambientLight intensity={0.1} />
            <directionalLight
                castShadow
                intensity={0.003}
                position={[0, 50, 0]}
            />
            {/* 環境貼圖------------------------------->關鍵: 將自動套用到3D物件的envMap上，尤其使金屬光澤正常呈現，避免光線全吸收後模型變成黑色 */}
            <Environment files="/image/environment/empty_warehouse_01_1k.exr" />
            {/* 3D物件 */}
            <Box position={[0, 0, 0]} args={[3, 0.5, 6]} />
            <Box position={[0, 0.8, 0]} args={[3, 0.5, 6]} />
            <Box position={[0, 1.6, 0]} args={[3, 0.5, 6]} />
            {/* 相機 */}
            <OrbitControls makeDefault />
            {/* <PerspectiveCamera makeDefault/> */}
        </>
    )
}