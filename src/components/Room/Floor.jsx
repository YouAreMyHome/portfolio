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
// Shared materials cho toàn bộ sàn nhà (Flyweight Pattern - Tránh tạo vật liệu lặp lại)
const mainFloorMat = new THREE.MeshPhysicalMaterial({ 
  color: '#c89d68', 
  roughness: 0.32, 
  metalness: 0.05,
  clearcoat: 0.28,
  clearcoatRoughness: 0.2
})
const plankMatA = new THREE.MeshPhysicalMaterial({ 
  color: '#c39763', 
  roughness: 0.30, 
  metalness: 0.04,
  clearcoat: 0.22,
  clearcoatRoughness: 0.25
})
const plankMatB = new THREE.MeshPhysicalMaterial({ 
  color: '#bd905c', 
  roughness: 0.30, 
  metalness: 0.04,
  clearcoat: 0.22,
  clearcoatRoughness: 0.25
})
const grooveMat = new THREE.MeshBasicMaterial({ color: '#6a4c33', opacity: 0.55, transparent: true })

// ── Materials thảm dệt len cao cấp phong cách Japandi (Woven Wool Rug) ──
const rugBaseMat = new THREE.MeshStandardMaterial({
  color: '#ece5d8', // Màu sợi dệt tự nhiên Oatmeal / Be ấm áp
  roughness: 0.96,
  metalness: 0.0,
})
const rugInnerMat = new THREE.MeshStandardMaterial({
  color: '#f7f4ec', // Lòng thảm sợi len kem sáng mềm mại
  roughness: 0.98,
})
const rugBorderMat = new THREE.MeshStandardMaterial({
  color: '#ded4c5', // Viền dệt vắt sổ linen tự nhiên
  roughness: 0.92,
})
const rugStripeMatA = new THREE.MeshStandardMaterial({
  color: '#b67a68', // Chỉ thêu Terracotta ấm cúng
  roughness: 0.92,
})
const rugStripeMatB = new THREE.MeshStandardMaterial({
  color: '#8b9a89', // Chỉ thêu Sage Green thanh lịch
  roughness: 0.92,
})
const rugFringeMat = new THREE.MeshStandardMaterial({
  color: '#f0eae1', // Sợi tua rua dệt thủ công hai đầu thảm
  roughness: 0.95,
})

// Shared Geometries (Flyweight Pattern - Giảm GPU geometry allocations)
const baseFloorGeo = new THREE.PlaneGeometry(8.02, 8.02)
const plankGeo = new THREE.PlaneGeometry(8, 0.48)
const grooveGeo = new THREE.PlaneGeometry(8, 0.015)
const rugInnerPlaneGeo = new THREE.PlaneGeometry(3.08, 2.48)
const rugCenterPlaneGeo = new THREE.PlaneGeometry(2.80, 2.20)
const rugBorderPlaneGeo = new THREE.PlaneGeometry(2.84, 2.24)
const rugStripeGeo = new THREE.PlaneGeometry(0.018, 1.8)
const rugFringeGeo = new THREE.PlaneGeometry(0.016, 0.06)

// Tọa độ các sợi tua rua hai đầu thảm (Flyweight array)
const FRINGE_OFFSETS = [
  -1.5, -1.35, -1.2, -1.05, -0.9, -0.75, -0.6, -0.45, -0.3, -0.15,
  0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5
]

function Floor() {
  return (
    <group>
      {/* ── 1. Nền sàn gỗ bóng bẩy (Varnished Parquet Floor) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow material={mainFloorMat} geometry={baseFloorGeo} />

      {/* ── 2. Các tấm ván sàn ghép rãnh bắt sáng (Beveled Wood Planks) ── */}
      {[...Array(16)].map((_, i) => {
        const plankMat = i % 2 === 0 ? plankMatA : plankMatB
        return (
          <group key={i} position={[0, 0.001, -3.75 + i * 0.5]}>
            {/* Plank bề mặt */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={plankMat} geometry={plankGeo} />
            {/* Rãnh tối giữa các nan gỗ */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0.245]} material={grooveMat} geometry={grooveGeo} />
          </group>
        )
      })}

      {/* ── 3. Thảm phòng trung tâm (Slim Flatweave Japandi Rug - Siêu mỏng ~6mm chân thực) ── */}
      <group position={[0, 0, 0.3]}>
        {/* Lớp nền thảm dệt mỏng sát sàn - Không đổ bóng khối giả tạo (castShadow={false}) */}
        <RoundedBox
          args={[3.2, 0.006, 2.6]}
          radius={0.012}
          smoothness={2}
          position={[0, 0.0035, 0]}
          receiveShadow
          castShadow={false}
          material={rugBaseMat}
        />

        {/* Lớp lòng thảm dệt phẳng mềm mại */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.0066, 0]}
          receiveShadow
          geometry={rugInnerPlaneGeo}
          material={rugInnerMat}
        />

        {/* Khung viền dệt chỉ vắt sổ thanh nhã */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.0068, 0]}
          receiveShadow
          geometry={rugBorderPlaneGeo}
          material={rugBorderMat}
        />

        {/* Lòng trong sáng màu êm ái */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.0070, 0]}
          receiveShadow
          geometry={rugCenterPlaneGeo}
          material={rugInnerMat}
        />

        {/* Các dải chỉ thêu tối giản phong cách Bắc Âu (Japandi Stripes) */}
        {[-0.9, -0.45, 0, 0.45, 0.9].map((x, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.0072, 0]}
            geometry={rugStripeGeo}
            material={idx % 2 === 0 ? rugStripeMatA : rugStripeMatB}
          />
        ))}

        {/* Tua rua dệt thủ công mềm mại ở hai đầu mép thảm (Fringe Tassels) */}
        {[-1.315, 1.315].map((z, sideIdx) => (
          <group key={sideIdx} position={[0, 0.003, z]}>
            {FRINGE_OFFSETS.map((x, idx) => (
              <mesh
                key={idx}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[x, 0, sideIdx === 0 ? -0.025 : 0.025]}
                geometry={rugFringeGeo}
                material={rugFringeMat}
              />
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}

export default Floor
