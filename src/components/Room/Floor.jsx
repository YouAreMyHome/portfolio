import React, { useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

/**
 * Floor - Sàn gỗ đánh bóng sang trọng với hiệu ứng bóng bẩy PBR
 * Tối ưu hóa:
 * - InstancedMesh cho 16 tấm ván sàn ghép (8 plank A + 8 plank B)
 * - InstancedMesh cho 16 rãnh nan gỗ
 * - InstancedMesh cho 42 tua rua thảm dệt
 * - matrixAutoUpdate={false} cho các vật thể tĩnh
 * -> Giảm Draw Calls từ ~85 xuống còn 7!
 */

// Shared materials (Flyweight Pattern)
const mainFloorMat = new THREE.MeshStandardMaterial({
  color: '#c89d68',
  roughness: 0.42,
  metalness: 0.04
})
const plankMatA = new THREE.MeshStandardMaterial({
  color: '#c39763',
  roughness: 0.40,
  metalness: 0.04
})
const plankMatB = new THREE.MeshStandardMaterial({
  color: '#bd905c',
  roughness: 0.40,
  metalness: 0.04
})
const grooveMat = new THREE.MeshBasicMaterial({ color: '#6a4c33', opacity: 0.55, transparent: true })

// Materials thảm dệt len cao cấp phong cách Japandi (Woven Wool Rug - Màu kem ecru ấm áp, không chói lóa)
const rugBaseMat = new THREE.MeshStandardMaterial({
  color: '#e4dcce',
  roughness: 0.96,
  metalness: 0.0,
})
const rugInnerMat = new THREE.MeshStandardMaterial({
  color: '#ece5d7',
  roughness: 0.98,
})
const rugBorderMat = new THREE.MeshStandardMaterial({
  color: '#ded4c5',
  roughness: 0.92,
})
const rugStripeMatA = new THREE.MeshStandardMaterial({
  color: '#b67a68',
  roughness: 0.92,
})
const rugStripeMatB = new THREE.MeshStandardMaterial({
  color: '#8b9a89',
  roughness: 0.92,
})
const rugFringeMat = new THREE.MeshStandardMaterial({
  color: '#f0eae1',
  roughness: 0.95,
})

// Shared Geometries (Flyweight Pattern)
const plinthGeo = new THREE.BoxGeometry(8.04, 0.36, 8.04)
const plinthMat = new THREE.MeshStandardMaterial({ color: '#2d2218', roughness: 0.8, metalness: 0.05 })
const baseFloorGeo = new THREE.PlaneGeometry(8.02, 8.02)
const plankGeo = new THREE.PlaneGeometry(8, 0.48)
const grooveGeo = new THREE.PlaneGeometry(8, 0.015)
const rugInnerPlaneGeo = new THREE.PlaneGeometry(3.08, 2.48)
const rugCenterPlaneGeo = new THREE.PlaneGeometry(2.80, 2.20)
const rugBorderPlaneGeo = new THREE.PlaneGeometry(2.84, 2.24)
const rugStripeGeo = new THREE.PlaneGeometry(0.018, 1.8)
const rugFringeGeo = new THREE.PlaneGeometry(0.016, 0.06)

// Tọa độ các sợi tua rua hai đầu thảm
const FRINGE_OFFSETS = [
  -1.5, -1.35, -1.2, -1.05, -0.9, -0.75, -0.6, -0.45, -0.3, -0.15,
  0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5
]

function Floor() {
  const planksARef = useRef()
  const planksBRef = useRef()
  const groovesRef = useRef()
  const tasselsRef = useRef()

  // Khởi tạo InstancedMesh matrices một lần duy nhất khi mount
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()

    // 1. Planks A (chẵn: 0, 2, 4, 6, 8, 10, 12, 14)
    if (planksARef.current) {
      for (let i = 0; i < 8; i++) {
        const actualIdx = i * 2
        dummy.position.set(0, 0.001, -3.75 + actualIdx * 0.5)
        dummy.rotation.set(-Math.PI / 2, 0, 0)
        dummy.updateMatrix()
        planksARef.current.setMatrixAt(i, dummy.matrix)
      }
      planksARef.current.instanceMatrix.needsUpdate = true
    }

    // 2. Planks B (lẻ: 1, 3, 5, 7, 9, 11, 13, 15)
    if (planksBRef.current) {
      for (let i = 0; i < 8; i++) {
        const actualIdx = i * 2 + 1
        dummy.position.set(0, 0.001, -3.75 + actualIdx * 0.5)
        dummy.rotation.set(-Math.PI / 2, 0, 0)
        dummy.updateMatrix()
        planksBRef.current.setMatrixAt(i, dummy.matrix)
      }
      planksBRef.current.instanceMatrix.needsUpdate = true
    }

    // 3. Rãnh tối giữa các nan gỗ (16 nan)
    if (groovesRef.current) {
      for (let i = 0; i < 16; i++) {
        dummy.position.set(0, 0.0015, -3.75 + i * 0.5 + 0.245)
        dummy.rotation.set(-Math.PI / 2, 0, 0)
        dummy.updateMatrix()
        groovesRef.current.setMatrixAt(i, dummy.matrix)
      }
      groovesRef.current.instanceMatrix.needsUpdate = true
    }

    // 4. Tua rua thảm hai đầu (42 sợi)
    if (tasselsRef.current) {
      let idx = 0
        ;[-1.315, 1.315].forEach((z, sideIdx) => {
          const zOffset = sideIdx === 0 ? -0.025 : 0.025
          FRINGE_OFFSETS.forEach((x) => {
            dummy.position.set(x, 0.003, z + zOffset)
            dummy.rotation.set(-Math.PI / 2, 0, 0)
            dummy.updateMatrix()
            tasselsRef.current.setMatrixAt(idx++, dummy.matrix)
          })
        })
      tasselsRef.current.instanceMatrix.needsUpdate = true
    }
  }, [])

  return (
    <group>
      {/* ── 0. Bệ đỡ Diorama vững chãi ── */}
      <mesh
        position={[0, -0.19, 0]}
        receiveShadow
        geometry={plinthGeo}
        material={plinthMat}
      />

      {/* ── 1. Nền sàn gỗ bóng bẩy ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
        receiveShadow
        material={mainFloorMat}
        geometry={baseFloorGeo}
      />

      {/* ── 2. Instanced ván sàn gỗ & rãnh (Batching 32 draw calls -> 3) ── */}
      <instancedMesh
        ref={planksARef}
        args={[plankGeo, plankMatA, 8]}
        receiveShadow
      />
      <instancedMesh
        ref={planksBRef}
        args={[plankGeo, plankMatB, 8]}
        receiveShadow
      />
      <instancedMesh
        ref={groovesRef}
        args={[grooveGeo, grooveMat, 16]}
      />

      {/* ── 3. Thảm phòng trung tâm (Slim Flatweave Japandi Rug) ── */}
      <group position={[0, 0, 0.3]}>
        {/* Lớp nền thảm dệt mỏng sát sàn */}
        <RoundedBox
          args={[3.2, 0.006, 2.6]}
          radius={0.012}
          smoothness={2}
          position={[0, 0.0035, 0]}
          receiveShadow
          castShadow={false}
          material={rugBaseMat}
        />

        {/* Lớp lòng thảm dệt phẳng */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.0066, 0]}
          receiveShadow
          geometry={rugInnerPlaneGeo}
          material={rugInnerMat}
        />

        {/* Khung viền dệt chỉ vắt sổ */}
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

        {/* Các dải chỉ thêu Bắc Âu */}
        {[-0.9, -0.45, 0, 0.45, 0.9].map((x, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.0072, 0]}
            geometry={rugStripeGeo}
            material={idx % 2 === 0 ? rugStripeMatA : rugStripeMatB}
          />
        ))}

        {/* Instanced tua rua thảm (Batching 42 draw calls -> 1) */}
        <instancedMesh
          ref={tasselsRef}
          args={[rugFringeGeo, rugFringeMat, 42]}
        />
      </group>
    </group>
  )
}

export default React.memo(Floor)
