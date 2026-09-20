import React from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { COLORS } from './colors'

/**
 * Floor - Sàn gỗ đánh bóng sang trọng với hiệu ứng bóng bẩy PBR
 * - Sử dụng meshPhysicalMaterial có clearcoat để phản chiếu ánh nắng & đèn LED
 * - Vân gỗ parquet đan xen vát rãnh tinh xảo
 * - Thảm trung tâm bo góc mềm mại, êm ái
 */
// Shared materials cho toàn bộ sàn nhà (Tránh tạo 32 vật liệu lặp lại)
const mainFloorMat = new THREE.MeshStandardMaterial({ color: '#c89d68', roughness: 0.35, metalness: 0.05 })
const plankMatA = new THREE.MeshStandardMaterial({ color: '#c39763', roughness: 0.32, metalness: 0.04 })
const plankMatB = new THREE.MeshStandardMaterial({ color: '#bd905c', roughness: 0.32, metalness: 0.04 })
const grooveMat = new THREE.MeshBasicMaterial({ color: '#6a4c33', opacity: 0.55, transparent: true })
const rugBorderMat = new THREE.MeshStandardMaterial({ color: '#d8cebf', roughness: 0.92, metalness: 0.02 })
const rugInnerMat = new THREE.MeshStandardMaterial({ color: '#ede6d8', roughness: 0.9 })
const rugPatternMat = new THREE.MeshStandardMaterial({ color: '#dfd2c0', roughness: 0.88 })
const rugCenterMat = new THREE.MeshStandardMaterial({ color: '#f7f3ec', roughness: 0.85 })

function Floor() {
  return (
    <group>
      {/* ── 1. Nền sàn gỗ bóng bẩy (Varnished Parquet Floor) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow material={mainFloorMat}>
        <planeGeometry args={[8.02, 8.02]} />
      </mesh>

      {/* ── 2. Các tấm ván sàn ghép rãnh bắt sáng (Beveled Wood Planks) ── */}
      {[...Array(16)].map((_, i) => {
        const plankMat = i % 2 === 0 ? plankMatA : plankMatB
        return (
          <group key={i} position={[0, 0.001, -3.75 + i * 0.5]}>
            {/* Plank bề mặt */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={plankMat}>
              <planeGeometry args={[8, 0.48]} />
            </mesh>
            {/* Rãnh tối giữa các nan gỗ */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0.245]} material={grooveMat}>
              <planeGeometry args={[8, 0.015]} />
            </mesh>
          </group>
        )
      })}

      {/* ── 3. Thảm phòng trung tâm (Plush Beveled Rug - Japandi Style) ── */}
      <group position={[0, 0, 0.3]}>
        {/* Lớp viền nền thảm dày bo viền mềm - Màu hạt dẻ / Terracotta ấm cúng */}
        <RoundedBox
          args={[3.25, 0.035, 2.75]}
          radius={0.08}
          smoothness={2}
          position={[0, 0.018, 0]}
          receiveShadow
          castShadow
          material={rugBorderMat}
        />

        {/* Lớp lòng thảm - Màu kem dệt len tự nhiên ấm áp */}
        <RoundedBox
          args={[2.92, 0.015, 2.42]}
          radius={0.06}
          smoothness={2}
          position={[0, 0.036, 0]}
          receiveShadow
          material={rugInnerMat}
        />

        {/* Họa tiết bo viền trong thanh lịch */}
        <RoundedBox
          args={[2.25, 0.01, 1.75]}
          radius={0.04}
          smoothness={2}
          position={[0, 0.044, 0]}
          receiveShadow
          material={rugPatternMat}
        />

        {/* Lớp hoa văn tâm thảm màu kem sáng */}
        <RoundedBox
          args={[1.55, 0.008, 1.05]}
          radius={0.03}
          smoothness={2}
          position={[0, 0.05, 0]}
          receiveShadow
          material={rugCenterMat}
        />

        {/* Các dải sợi dệt sọc trang trí tinh tế màu Terracotta ấm áp */}
        {[-0.85, -0.42, 0, 0.42, 0.85].map((x, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.054, 0]}
          >
            <planeGeometry args={[0.035, 1.5]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#c47c69" : "#9e6e58"} roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default Floor
