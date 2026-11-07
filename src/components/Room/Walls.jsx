import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { COLORS } from './colors'

/**
 * Walls - Tường phòng thi công bằng công nghệ in 3D Laser (Procedural Wall Extrusion)
 * - Tường mọc đùn cao từ mặt sàn (Y=0 -> 3.0m)
 * - Tia Laser Scan công trình màu Cyan quét dọc theo mép tường đang mọc
 * - Len chân tường ốp khít ở mặt đáy
 * - Phào trần trắng tinh khôi khóa chặt đỉnh tường khi hoàn thiện
 */

const backWallGeo = new THREE.BoxGeometry(8, 3, 0.1)
const leftWallGeo = new THREE.BoxGeometry(0.1, 3, 8)
const crownBackGeo = new THREE.BoxGeometry(8, 0.08, 0.08)
const crownLeftGeo = new THREE.BoxGeometry(0.08, 0.08, 8)
const baseboardBackGeo = new THREE.BoxGeometry(8, 0.14, 0.06)
const baseboardLeftGeo = new THREE.BoxGeometry(0.06, 0.14, 8)

// Flyweight Laser Beams cho thi công
const laserBeamBackGeo = new THREE.BoxGeometry(8.06, 0.024, 0.14)
const laserBeamLeftGeo = new THREE.BoxGeometry(0.14, 0.024, 8.06)
const laserBeamMat = new THREE.MeshBasicMaterial({
  color: '#00f5ff',
  transparent: true,
  opacity: 0.9,
})

const backWallMat = new THREE.MeshStandardMaterial({
  color: COLORS.wall,
  roughness: 0.92,
  metalness: 0.02,
})

const leftWallMat = new THREE.MeshStandardMaterial({
  color: COLORS.wallDark,
  roughness: 0.92,
  metalness: 0.02,
})

const crownMat = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.45,
  metalness: 0.05,
})

const baseboardMat = new THREE.MeshStandardMaterial({
  color: '#5c3d28',
  roughness: 0.65,
  metalness: 0.08,
})

const Walls = forwardRef(function Walls({ timeline }, ref) {
  const backWallGroupRef = useRef()
  const leftWallGroupRef = useRef()
  const laserBeamBackRef = useRef()
  const laserBeamLeftRef = useRef()
  const baseboardGroupRef = useRef()
  const crownGroupRef = useRef()

  useImperativeHandle(ref, () => ({
    backWall: backWallGroupRef.current,
    leftWall: leftWallGroupRef.current,
    laserBack: laserBeamBackRef.current,
    laserLeft: laserBeamLeftRef.current,
    baseboards: baseboardGroupRef.current,
    crown: crownGroupRef.current,
  }))

  useEffect(() => {
    // 1. Trạng thái hư vô ban đầu
    if (backWallGroupRef.current) {
      backWallGroupRef.current.scale.set(1, 0.001, 1)
    }
    if (leftWallGroupRef.current) {
      leftWallGroupRef.current.scale.set(1, 0.001, 1)
    }
    if (baseboardGroupRef.current) {
      baseboardGroupRef.current.scale.set(0.001, 1, 0.001)
    }
    if (crownGroupRef.current) {
      crownGroupRef.current.scale.set(0.001, 0.001, 0.001)
    }
    if (laserBeamBackRef.current) {
      laserBeamBackRef.current.position.y = 0.01
      laserBeamBackRef.current.visible = true
      laserBeamBackRef.current.material.opacity = 0.9
    }
    if (laserBeamLeftRef.current) {
      laserBeamLeftRef.current.position.y = 0.01
      laserBeamLeftRef.current.visible = true
      laserBeamLeftRef.current.material.opacity = 0.9
    }

    // 2. Diễn hoạt đùn tường bằng GSAP
    const tl = timeline || gsap.timeline({ delay: 0.1 })

    // Đùn tường sau (Back Wall) từ Y=0 lên 3.0m
    if (backWallGroupRef.current) {
      tl.to(
        backWallGroupRef.current.scale,
        {
          y: 1.0,
          duration: 0.58,
          ease: 'power2.out',
        },
        0.32
      )
    }

    // Tia laser quét theo đỉnh tường sau
    if (laserBeamBackRef.current) {
      tl.to(
        laserBeamBackRef.current.position,
        {
          y: 3.0,
          duration: 0.58,
          ease: 'power2.out',
        },
        0.32
      ).to(
        laserBeamBackRef.current.material,
        {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            if (laserBeamBackRef.current) laserBeamBackRef.current.visible = false
          },
        },
        0.88
      )
    }

    // Đùn tường trái (Left Wall) từ Y=0 lên 3.0m
    if (leftWallGroupRef.current) {
      tl.to(
        leftWallGroupRef.current.scale,
        {
          y: 1.0,
          duration: 0.58,
          ease: 'power2.out',
        },
        0.38
      )
    }

    // Tia laser quét theo đỉnh tường trái
    if (laserBeamLeftRef.current) {
      tl.to(
        laserBeamLeftRef.current.position,
        {
          y: 3.0,
          duration: 0.58,
          ease: 'power2.out',
        },
        0.38
      ).to(
        laserBeamLeftRef.current.material,
        {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            if (laserBeamLeftRef.current) laserBeamLeftRef.current.visible = false
          },
        },
        0.94
      )
    }

    // Len chân tường (Baseboards) ốp khít ở mặt sàn
    if (baseboardGroupRef.current) {
      tl.to(
        baseboardGroupRef.current.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.52
      )
    }

    // Phào trần (Crown moldings) khóa khít trên đỉnh tường 3.0m
    if (crownGroupRef.current) {
      tl.to(
        crownGroupRef.current.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.4,
          ease: 'back.out(1.5)',
        },
        0.92
      )
    }
  }, [timeline])

  return (
    <group>
      {/* ── 1. TƯỜNG SAU (Back Wall Pivot tại Y=0, Z=-4) ── */}
      <group ref={backWallGroupRef} position={[0, 0, -4]}>
        <mesh
          position={[0, 1.5, 0]}
          receiveShadow
          geometry={backWallGeo}
          material={backWallMat}
        />
      </group>

      {/* Tia laser quét đỉnh tường sau */}
      <mesh
        ref={laserBeamBackRef}
        position={[0, 0.01, -3.98]}
        geometry={laserBeamBackGeo}
        material={laserBeamMat}
      />

      {/* ── 2. TƯỜNG TRÁI (Left Wall Pivot tại X=-4, Y=0) ── */}
      <group ref={leftWallGroupRef} position={[-4, 0, 0]}>
        <mesh
          position={[0, 1.5, 0]}
          receiveShadow
          geometry={leftWallGeo}
          material={leftWallMat}
        />
      </group>

      {/* Tia laser quét đỉnh tường trái */}
      <mesh
        ref={laserBeamLeftRef}
        position={[-3.98, 0.01, 0]}
        geometry={laserBeamLeftGeo}
        material={laserBeamMat}
      />

      {/* ── 3. LEN CHÂN TƯỜNG (Baseboard thanh mảnh ốp mép sàn) ── */}
      <group ref={baseboardGroupRef}>
        <mesh position={[0, 0.07, -3.94]} geometry={baseboardBackGeo} material={baseboardMat} />
        <mesh position={[-3.94, 0.07, 0]} geometry={baseboardLeftGeo} material={baseboardMat} />
      </group>

      {/* ── 4. PHÀO TRẦN (Crown Molding khóa đỉnh tường 3.0m) ── */}
      <group ref={crownGroupRef}>
        <mesh position={[0, 2.95, -3.94]} geometry={crownBackGeo} material={crownMat} />
        <mesh position={[-3.94, 2.95, 0]} geometry={crownLeftGeo} material={crownMat} />
      </group>
    </group>
  )
})

export default React.memo(Walls)
