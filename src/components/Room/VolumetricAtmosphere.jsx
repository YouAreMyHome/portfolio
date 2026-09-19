import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../store/useStore'

/**
 * VolumetricAtmosphere - Hiệu ứng không khí vi mô tinh tế
 * 1. Hạt bụi pixel lơ lửng trong không khí (Dust Motes nhẹ nhàng, không gây vệt đục)
 * 2. Hơi nước bốc lên từ cốc cà phê (Coffee Steam)
 * 3. Hạt mưa rơi bên ngoài cửa sổ khi trời mưa
 */
export default function VolumetricAtmosphere() {
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isNightMode = useStore((state) => state.isNightMode)
  const isRainy = lightingPreset === 'rainy'
  const isSunset = lightingPreset === 'sunset'

  const dustRef = useRef()
  const steamRef = useRef()
  const rainRef = useRef()

  // 1. Dữ liệu hạt bụi bay lơ lửng rất nhỏ và tinh tế (không dùng hình nón đục)
  const DUST_COUNT = 30
  const [dustPositions, dustSpeeds] = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3)
    const spd = []
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3 + 0] = -2.0 + Math.random() * 3.5
      pos[i * 3 + 1] = 0.6 + Math.random() * 1.8
      pos[i * 3 + 2] = -2.5 + Math.random() * 3.5
      spd.push({
        y: 0.002 + Math.random() * 0.003,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 1.0,
      })
    }
    return [pos, spd]
  }, [])

  // 2. Tạo hạt hơi nước từ cốc cà phê
  const STEAM_COUNT = 10
  const steamData = useMemo(() => {
    return Array.from({ length: STEAM_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.02,
      y: (i / STEAM_COUNT) * 0.18,
      z: (Math.random() - 0.5) * 0.02,
      scale: 0.01 + Math.random() * 0.012,
    }))
  }, [])

  // 3. Tạo hạt mưa khi preset là Rainy
  const RAIN_COUNT = 50
  const rainPositions = useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3)
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3 + 0] = -2.7 + Math.random() * 1.4
      pos[i * 3 + 1] = 0.8 + Math.random() * 2.0
      pos[i * 3 + 2] = -3.85 + Math.random() * 0.05
    }
    return pos
  }, [])

  // Animation frame loop
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Animate Dust Motes
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array
      for (let i = 0; i < DUST_COUNT; i++) {
        const s = dustSpeeds[i]
        positions[i * 3 + 1] += s.y
        positions[i * 3 + 0] += Math.sin(time * s.wobbleSpeed + s.wobble) * 0.001

        if (positions[i * 3 + 1] > 2.4) {
          positions[i * 3 + 1] = 0.5
        }
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Animate Rain
    if (rainRef.current && isRainy) {
      const positions = rainRef.current.geometry.attributes.position.array
      for (let i = 0; i < RAIN_COUNT; i++) {
        positions[i * 3 + 1] -= delta * 3.5
        positions[i * 3 + 0] += delta * 0.2

        if (positions[i * 3 + 1] < 0.8) {
          positions[i * 3 + 1] = 2.6
          positions[i * 3 + 0] = -2.7 + Math.random() * 1.4
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const dustColor = isNightMode ? '#c7d2fe' : isSunset ? '#fed7aa' : '#fef08a'

  return (
    <group>
      {/* ── 1. Floating Dust Motes (Disabled to prevent visual noise / wall artifacts) ── */}

      {/* ── 2. Coffee Mug Steam (Nhẹ nhàng) ── */}
      <group position={[-2.45, 0.84, -2.15]}>
        {steamData.map((d, i) => (
          <mesh
            key={i}
            position={[d.x, d.y, d.z]}
            scale={[d.scale, d.scale * 1.4, d.scale]}
          >
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.12 - (d.y / 0.2) * 0.1}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* ── 3. Rain Particles bên ngoài cửa sổ khi trời mưa ── */}
      {isRainy && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={RAIN_COUNT}
              array={rainPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#93c5fd"
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  )
}
