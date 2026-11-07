import { useRef, useMemo, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ConstructionParticles - Hệ hạt tia lửa năng lượng thi công (Matrix Assembly Sparks)
 * Tái hiện hiệu ứng hạt ánh sáng tụ hội khi vật chất được tổng hợp từ hư vô:
 * - 120 hạt năng lượng cyan/amber bay xoáy nhẹ từ mặt sàn lên không gian
 * - Tối ưu Zero GC Allocation trong useFrame (chỉ cập nhật buffer cục bộ)
 * - Tự động fade-out khi căn phòng hoàn thiện
 */

const NUM_PARTICLES = 120

const particleMat = new THREE.PointsMaterial({
  color: '#38bdf8',
  size: 0.045,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

const ConstructionParticles = forwardRef(function ConstructionParticles(props, ref) {
  const pointsRef = useRef()

  // Khởi tạo toạ độ và vận tốc ban đầu cho 120 hạt
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(NUM_PARTICLES * 3)
    const vel = new Float32Array(NUM_PARTICLES * 3)

    for (let i = 0; i < NUM_PARTICLES; i++) {
      // Phân bố ngẫu nhiên trong phạm vi căn phòng 8x8m
      pos[i * 3 + 0] = (Math.random() - 0.5) * 7.6 // X
      pos[i * 3 + 1] = Math.random() * 2.8         // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7.6 // Z

      // Vận tốc bay lên nhẹ và dao động ngang
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.4
      vel[i * 3 + 1] = 0.3 + Math.random() * 0.7
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4
    }

    return { positions: pos, velocities: vel }
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position
    const posArray = posAttr.array

    for (let i = 0; i < NUM_PARTICLES; i++) {
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta
      posArray[i * 3 + 0] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.003
      posArray[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 2 + i) * 0.003

      // Reset xuống sàn khi bay qua đỉnh phòng 3.0m
      if (posArray[i * 3 + 1] > 3.0) {
        posArray[i * 3 + 1] = 0.01
        posArray[i * 3 + 0] = (Math.random() - 0.5) * 7.6
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 7.6
      }
    }

    posAttr.needsUpdate = true
  })

  return (
    <group ref={ref}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={NUM_PARTICLES}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={particleMat} attach="material" />
      </points>
    </group>
  )
})

export default ConstructionParticles

