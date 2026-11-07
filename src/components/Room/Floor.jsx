import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import gsap from 'gsap'

/**
 * Floor - Sàn gỗ kiến trúc thi công từng nan ván gỗ (Procedural Plank-by-Plank Assembly)
 * Tái hiện quy trình lát sàn từ hư vô:
 * 1. Móng phòng (Plinth) đùn lên từ dưới đất
 * 2. 16 nan ván sàn gỗ lần lượt rơi đập khít vào mộng theo làn sóng thác đổ (stagger cascade)
 * 3. Rãnh nan gỗ ăn khớp hoàn hảo
 * 4. Thảm len Japandi cuộn mở bung ra từ tâm phòng
 */

// Shared Flyweight Materials (Roughness 0.58 & metalness 0.0 - Không lóa chói dưới nắng)
const mainFloorMat = new THREE.MeshStandardMaterial({
  color: '#7a522f',
  roughness: 0.58,
  metalness: 0.0,
})

const plankMatA = new THREE.MeshStandardMaterial({
  color: '#875d38',
  roughness: 0.58,
  metalness: 0.0,
})

const plankMatB = new THREE.MeshStandardMaterial({
  color: '#6e4726',
  roughness: 0.58,
  metalness: 0.0,
})

const grooveMat = new THREE.MeshBasicMaterial({
  color: '#21140b',
  opacity: 0.88,
  transparent: true,
})

// Thảm len Japandi ấm cúng
const rugBaseMat = new THREE.MeshStandardMaterial({ color: '#cfc5b4', roughness: 0.95, metalness: 0.0 })
const rugInnerMat = new THREE.MeshStandardMaterial({ color: '#ede6db', roughness: 0.96 })
const rugBorderMat = new THREE.MeshStandardMaterial({ color: '#8c4e3e', roughness: 0.92 })
const rugStripeMatA = new THREE.MeshStandardMaterial({ color: '#a05442', roughness: 0.90 })
const rugStripeMatB = new THREE.MeshStandardMaterial({ color: '#4f5f4e', roughness: 0.90 })
const rugFringeMat = new THREE.MeshStandardMaterial({ color: '#e6dfd3', roughness: 0.92 })

// Flyweight Geometries
const plinthGeo = new THREE.BoxGeometry(8.04, 0.36, 8.04)
const plinthMat = new THREE.MeshStandardMaterial({ color: '#241a12', roughness: 0.82, metalness: 0.04 })
const baseFloorGeo = new THREE.PlaneGeometry(8.02, 8.02)
const plankGeo = new THREE.PlaneGeometry(8, 0.478)
const grooveGeo = new THREE.PlaneGeometry(8, 0.022)
const rugInnerPlaneGeo = new THREE.PlaneGeometry(3.08, 2.48)
const rugCenterPlaneGeo = new THREE.PlaneGeometry(2.78, 2.18)
const rugBorderPlaneGeo = new THREE.PlaneGeometry(2.84, 2.24)
const rugStripeGeo = new THREE.PlaneGeometry(0.026, 1.84)
const rugFringeGeo = new THREE.PlaneGeometry(0.018, 0.065)

const FRINGE_OFFSETS = [
  -1.5, -1.35, -1.2, -1.05, -0.9, -0.75, -0.6, -0.45, -0.3, -0.15,
  0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5
]

const NUM_PLANKS = 16

const Floor = forwardRef(function Floor({ timeline }, ref) {
  const plinthRef = useRef()
  const baseFloorRef = useRef()
  const rugGroupRef = useRef()
  const plankRefs = useRef([])
  const tasselsRef = useRef()

  useImperativeHandle(ref, () => ({
    plinth: plinthRef.current,
    baseFloor: baseFloorRef.current,
    rug: rugGroupRef.current,
    planks: plankRefs.current,
  }))

  // Khởi tạo các tua rua thảm
  useEffect(() => {
    if (!tasselsRef.current) return
    const dummy = new THREE.Object3D()
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
  }, [])

  // ── Procedural Construction Sequence for Floor ──
  useEffect(() => {
    // 1. Trạng thái hư vô ban đầu của sàn
    if (plinthRef.current) {
      plinthRef.current.position.y = -0.55
      plinthRef.current.scale.set(1, 0.01, 1)
    }
    if (baseFloorRef.current) {
      baseFloorRef.current.scale.set(0.001, 0.001, 0.001)
    }
    if (rugGroupRef.current) {
      rugGroupRef.current.scale.set(0.001, 1, 0.001)
    }

    // Thiết lập 16 nan sàn lơ lửng trên không, sẵn sàng rơi vào mộng
    plankRefs.current.forEach((plank, i) => {
      if (plank) {
        plank.position.y = 0.45 + (NUM_PLANKS - i) * 0.015
        plank.rotation.x = -0.12
        plank.scale.set(0.2, 0.2, 0.2)
      }
    })

    // 2. Nếu có timeline truyền từ Room, ghép chuỗi lát sàn vào timeline
    const tl = timeline || gsap.timeline({ delay: 0.05 })

    // Bước 1: Móng bệ đỡ trồi lên vững chãi
    if (plinthRef.current) {
      tl.to(
        plinthRef.current.position,
        { y: -0.19, duration: 0.45, ease: 'power2.out' },
        0.05
      ).to(
        plinthRef.current.scale,
        { y: 1.0, duration: 0.45, ease: 'power2.out' },
        0.05
      )
    }

    // Bước 2: Nền sàn gỗ mở rộng
    if (baseFloorRef.current) {
      tl.to(
        baseFloorRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.35, ease: 'power2.out' },
        0.12
      )
    }

    // Bước 3: Lát 16 nan ván sàn gỗ gối sóng nối tiếp nhau (Cascade Ripple Stagger)
    plankRefs.current.forEach((plank, i) => {
      if (plank) {
        const startTime = 0.16 + i * 0.024 // Nhịp lát liên hồi cực kỳ đã mắt (~0.4s toàn bộ sàn)
        tl.to(
          plank.position,
          {
            y: 0,
            duration: 0.24,
            ease: 'bounce.out',
          },
          startTime
        ).to(
          plank.rotation,
          {
            x: 0,
            duration: 0.2,
            ease: 'power2.out',
          },
          startTime
        ).to(
          plank.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.18,
            ease: 'power2.out',
          },
          startTime
        )
      }
    })

    // Bước 4: Thảm len trải cuộn mở bung ra từ tâm phòng
    if (rugGroupRef.current) {
      tl.to(
        rugGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.55, ease: 'back.out(1.4)' },
        0.58
      )
    }
  }, [timeline])

  return (
    <group>
      {/* ── 0. Bệ móng Diorama đùn lên từ hư vô ── */}
      <mesh
        ref={plinthRef}
        position={[0, -0.19, 0]}
        receiveShadow
        geometry={plinthGeo}
        material={plinthMat}
      />

      {/* ── 1. Nền móng sàn gỗ dưới ── */}
      <mesh
        ref={baseFloorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
        receiveShadow
        material={mainFloorMat}
        geometry={baseFloorGeo}
      />

      {/* ── 2. 16 Nan ván sàn gỗ được lát nối tiếp nhau (Plank-by-plank) ── */}
      {Array.from({ length: NUM_PLANKS }).map((_, i) => {
        const z = -3.75 + i * 0.5
        const isEven = i % 2 === 0
        return (
          <group
            key={`plank-group-${i}`}
            ref={(el) => (plankRefs.current[i] = el)}
            position={[0, 0, z]}
          >
            {/* Thanh ván sàn */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.001, 0]}
              receiveShadow
              geometry={plankGeo}
              material={isEven ? plankMatA : plankMatB}
            />
            {/* Rãnh tối giữa các nan gỗ */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.0015, 0.245]}
              geometry={grooveGeo}
              material={grooveMat}
            />
          </group>
        )
      })}

      {/* ── 3. Thảm phòng trung tâm cuộn mở (Slim Flatweave Japandi Rug) ── */}
      <group ref={rugGroupRef} position={[0, 0, 0.3]}>
        <RoundedBox
          args={[3.2, 0.006, 2.6]}
          radius={0.012}
          smoothness={2}
          position={[0, 0.0035, 0]}
          receiveShadow
          castShadow={false}
          material={rugBaseMat}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.0066, 0]}
          receiveShadow
          geometry={rugInnerPlaneGeo}
          material={rugInnerMat}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.0068, 0]}
          receiveShadow
          geometry={rugBorderPlaneGeo}
          material={rugBorderMat}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.0070, 0]}
          receiveShadow
          geometry={rugCenterPlaneGeo}
          material={rugInnerMat}
        />
        {[-0.9, -0.45, 0, 0.45, 0.9].map((x, idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x, 0.0072, 0]}
            geometry={rugStripeGeo}
            material={idx % 2 === 0 ? rugStripeMatA : rugStripeMatB}
          />
        ))}
        <instancedMesh
          ref={tasselsRef}
          args={[rugFringeGeo, rugFringeMat, 42]}
        />
      </group>
    </group>
  )
})

export default React.memo(Floor)
