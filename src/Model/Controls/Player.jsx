import * as THREE from "three"
import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RigidBody } from "@react-three/rapier"
import { useThreeContext } from "../../Context/threeContext"

const SPEED = 30 // 降低速度以增加穩定性
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

export function Player() {
  const {set_s_isPlayerShowing}= useThreeContext();
  const ref = useRef()
  const [, get] = useKeyboardControls()

  // 防止物理引擎休眠
  useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current) {
        ref.current.wakeUp() // 每秒強制喚醒物理體
      }
    }, 1000)
    set_s_isPlayerShowing(true);
    return () => {
      clearInterval(interval)
      set_s_isPlayerShowing(false);
    }
  }, [])

  useFrame((state) => {
    if (!ref.current) return

    const { forward, backward, left, right } = get()
    const velocity = ref.current.linvel() //取得該剛體的線性速度
    const pos = ref.current.translation()

    // 正確設置相機位置（Y軸偏移）
    state.camera.position.set(
      pos.x,
      pos.y + 1.8, // 標準第一人稱視角高度偏移
      pos.z
    )

    // 移動方向計算
    frontVector.set(0, 0, backward - forward) // 前後方向向量計算
    sideVector.set(left - right, 0, 0)        // 左右方向向量計算
    direction
      .subVectors(frontVector, sideVector) // 將前後方向 (frontVector) 減去左右方向 (sideVector)可得總移動方向
      .normalize()                       // 把方向向量轉成長度為 1 的單位向量，避免對角線方向比直走快
      .multiplyScalar(SPEED)             // 將方向向量轉成速度向量: 以「每秒 speed 單位距離」移動
      .applyEuler(state.camera.rotation) // 把方向向量根據目前鏡頭的旋轉角度（朝向）做旋轉

    // 設置物體在 3D 空間中的運動速度
    ref.current.setLinvel({
      x: direction.x,
      y: velocity.y, // 保持原有Y軸速度（重力）
      z: direction.z
    })
  })

  return (
    <RigidBody
      ref={ref}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 10, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={0.25} // 適當阻尼
      friction={0.1}       // 降低摩擦
      userData={{ name: "player" }}
    >
      <CapsuleCollider args={[15.88, 0.5]} />
    </RigidBody>
  )
}

