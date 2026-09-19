import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from './colors'

/**
 * Clock - Đồng hồ treo tường phong cách Bắc Âu (Scandinavian Minimalist Wall Clock)
 * - Khung gỗ sồi tự nhiên bo vát CNC, viền trong mạ đồng thau
 * - Mặt số tinh giản sang trọng
 * - Kim đồng hồ đồng bộ chuẩn xác theo giờ thực tế của hệ thống với chuyển động kim trôi mượt mà (Continuous Silent Sweep)
 * - Mặt kính thủy tinh lồi phản xạ ánh sáng môi trường chân thực
 */
function Clock() {
  const secondHandRef = useRef()
  const minuteHandRef = useRef()
  const hourHandRef = useRef()

  const oakWood = '#b8895b'
  const brassColor = '#d4af37'

  // Chuyển động kim đồng hồ mượt mà theo thời gian thực tế
  useFrame(() => {
    const now = new Date()
    const ms = now.getMilliseconds()
    const sec = now.getSeconds() + ms / 1000
    const min = now.getMinutes() + sec / 60
    const hr = (now.getHours() % 12) + min / 60

    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = -sec * (Math.PI / 30)
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -min * (Math.PI / 30)
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -hr * (Math.PI / 6)
    }
  })

  return (
    <group position={[0, 2.3, -3.90]} rotation={[0, 0, 0]}>
      {/* ── 1. Khung viền gỗ sồi bo vát CNC (Outer Oak Frame) ── */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.045, 32]} />
        <meshStandardMaterial color={oakWood} roughness={0.55} metalness={0.06} />
      </mesh>

      {/* ── 2. Vành kim loại đồng thau bên trong (Brushed Brass Bezel) ── */}
      <mesh position={[0, 0, 0.024]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.26, 0.008, 12, 32]} />
        <meshStandardMaterial color={brassColor} metalness={0.92} roughness={0.25} />
      </mesh>

      {/* ── 3. Mặt đồng hồ màu trắng vỏ trứng (Eggshell Dial Face) ── */}
      <mesh position={[0, 0, 0.026]}>
        <circleGeometry args={[0.255, 32]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.88} />
      </mesh>

      {/* ── 4. Cọc số giờ thanh lịch (Hour Markers) ── */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
        const isMain = i % 3 === 0
        const r = 0.205
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -Math.sin(angle) * r, 0.03]}
            rotation={[0, 0, -angle + Math.PI / 2]}
          >
            <boxGeometry args={[isMain ? 0.009 : 0.005, isMain ? 0.028 : 0.015, 0.003]} />
            <meshStandardMaterial color={isMain ? '#1e293b' : '#64748b'} roughness={0.4} />
          </mesh>
        )
      })}

      {/* Điểm tâm trục kim bằng đồng thau */}
      <mesh position={[0, 0, 0.038]}>
        <cylinderGeometry args={[0.012, 0.012, 0.01, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color={brassColor} metalness={0.95} roughness={0.2} />
      </mesh>

      {/* ── 5. Kim giờ đen thanh mảnh (Hour Hand) ── */}
      <group position={[0, 0, 0.04]} ref={hourHandRef}>
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.012, 0.11, 0.004]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Đối trọng đuôi kim ngắn */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.01, 0.03, 0.004]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* ── 6. Kim phút đen vươn dài (Minute Hand) ── */}
      <group position={[0, 0, 0.044]} ref={minuteHandRef}>
        <mesh position={[0, 0.085, 0]}>
          <boxGeometry args={[0.008, 0.17, 0.003]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.025, 0]}>
          <boxGeometry args={[0.008, 0.035, 0.003]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* ── 7. Kim giây màu cam Bauhaus trôi êm ái (Sweeping Second Hand) ── */}
      <group position={[0, 0, 0.048]} ref={secondHandRef}>
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.004, 0.19, 0.002]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
        {/* Vòng tròn đối trọng đuôi kim giây cổ điển */}
        <mesh position={[0, -0.035, 0]}>
          <circleGeometry args={[0.009, 12]} />
          <meshBasicMaterial color="#ea580c" />
        </mesh>
      </group>

      {/* ── 8. Mặt kính bảo vệ phản xạ ánh sáng (Convex Protective Glass) ── */}
      <mesh position={[0, 0, 0.052]}>
        <circleGeometry args={[0.26, 32]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.92}
          transparent
          opacity={0.25}
          reflectivity={0.95}
        />
      </mesh>
    </group>
  )
}

export default Clock
