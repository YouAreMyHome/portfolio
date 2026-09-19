import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * GamingChair - Ghế Công Thái Học / Gaming Cao Cấp (Ergonomic Executive Gaming Chair)
 * - Tựa lưng công thái học đa lớp nâng đỡ cột sống
 * - Đệm ngồi đúc bọc da PU thoáng khí viền chỉ tương phản
 * - Tay vịn 4D kim loại mạ chrome
 * - Chân sao 5 cánh hợp kim nhôm sáng bóng và bánh xe đôi
 * - Tự động xoay nhẹ thư giãn tự nhiên
 */
function GamingChair(props) {
  const chairRef = useRef()
  const upperBodyRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Tinh chỉnh chuyển động đu đưa / xoay nhẹ êm ái
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (upperBodyRef.current) {
      const targetRotY = hovered ? Math.sin(t * 2) * 0.12 : Math.sin(t * 0.6) * 0.03
      upperBodyRef.current.rotation.y = THREE.MathUtils.lerp(
        upperBodyRef.current.rotation.y,
        targetRotY,
        0.05
      )
    }
  })

  const CHAIR_COLORS = {
    leather: '#18181b',       // Da đen Carbon nhám sang trọng
    cushionInner: '#27272a',  // Lòng đệm xám than dập lỗ
    accent: '#ef4444',        // Chỉ may viền đỏ thể thao tinh tế
    chrome: '#f1f5f9',        // Kim loại mạ chrome bóng bẩy
    metalDark: '#334155',     // Kim loại đen mờ
    wheelRubber: '#09090b',   // Cao su bánh xe
  }

  return (
    <group
      ref={chairRef}
      position={[-1.8, 0, -1.2]}
      rotation={[0, Math.PI / 4 + 0.2, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    >
      {/* ── 1. PHẦN THÂN TRÊN (Upper Swiveling Body) ── */}
      <group ref={upperBodyRef} position={[0, 0, 0]}>
        {/* A. Đệm ngồi công thái học (Ergonomic Seat Cushion) */}
        <group position={[0, 0.48, 0]}>
          {/* Lòng đệm chính bo viền */}
          <RoundedBox args={[0.48, 0.08, 0.5]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color={CHAIR_COLORS.cushionInner} roughness={0.75} />
          </RoundedBox>

          {/* 2 cánh đệm nâng đỡ hông (Side Bolsters) */}
          {[-0.23, 0.23].map((bx, bi) => (
            <group key={bi} position={[bx, 0.035, 0]} rotation={[0, 0, bi === 0 ? 0.22 : -0.22]}>
              <RoundedBox args={[0.08, 0.065, 0.48]} radius={0.02} smoothness={4} castShadow>
                <meshStandardMaterial color={CHAIR_COLORS.leather} roughness={0.65} />
              </RoundedBox>
              {/* Chỉ viền thể thao tương phản */}
              <mesh position={[0, 0.035, 0]}>
                <boxGeometry args={[0.012, 0.004, 0.46]} />
                <meshStandardMaterial color={CHAIR_COLORS.accent} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>

        {/* B. Lưng ghế đa tầng uốn lượn (Contoured Backrest) */}
        <group position={[0, 0.88, -0.22]} rotation={[-0.08, 0, 0]}>
          {/* Khung lưng chính */}
          <RoundedBox args={[0.44, 0.78, 0.06]} radius={0.025} smoothness={4} castShadow>
            <meshStandardMaterial color={CHAIR_COLORS.leather} roughness={0.65} />
          </RoundedBox>

          {/* Cánh ôm vai thể thao (Shoulder Wings) */}
          <group position={[0, 0.22, 0.02]}>
            {[-0.24, 0.24].map((wx, wi) => (
              <group key={wi} position={[wx, 0, 0.04]} rotation={[0, wi === 0 ? 0.32 : -0.32, 0]}>
                <RoundedBox args={[0.11, 0.28, 0.035]} radius={0.015} smoothness={4} castShadow>
                  <meshStandardMaterial color={CHAIR_COLORS.leather} roughness={0.65} />
                </RoundedBox>
                {/* Viền đỏ thể thao bên vai */}
                <mesh position={[0, 0, 0.02]}>
                  <boxGeometry args={[0.015, 0.26, 0.004]} />
                  <meshStandardMaterial color={CHAIR_COLORS.accent} roughness={0.4} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Gối đệm tựa đầu (Headrest Pillow) */}
          <group position={[0, 0.3, 0.06]}>
            <RoundedBox args={[0.26, 0.12, 0.065]} radius={0.02} smoothness={4} castShadow>
              <meshStandardMaterial color={CHAIR_COLORS.leather} roughness={0.6} />
            </RoundedBox>
            {/* Logo dập nổi trên gối đầu */}
            <mesh position={[0, 0, 0.035]}>
              <circleGeometry args={[0.022, 16]} />
              <meshStandardMaterial color={CHAIR_COLORS.accent} roughness={0.4} />
            </mesh>
          </group>

          {/* Đệm đỡ thắt lưng công thái học (Lumbar Support Cushion) */}
          <group position={[0, -0.14, 0.055]}>
            <RoundedBox args={[0.32, 0.16, 0.06]} radius={0.02} smoothness={4} castShadow>
              <meshStandardMaterial color={CHAIR_COLORS.cushionInner} roughness={0.7} />
            </RoundedBox>
            {/* Dây đai gài gối thắt lưng */}
            <mesh position={[0, 0, -0.03]}>
              <boxGeometry args={[0.36, 0.025, 0.008]} />
              <meshStandardMaterial color="#000000" roughness={0.9} />
            </mesh>
          </group>
        </group>

        {/* C. Tay vịn điều chỉnh 4D (4D Armrests with Chrome Uprights) */}
        {[-0.28, 0.28].map((ax, ai) => (
          <group key={ai} position={[ax, 0.64, -0.04]}>
            {/* Trục nâng kim loại mạ chrome */}
            <mesh position={[0, -0.09, 0]} castShadow>
              <cylinderGeometry args={[0.016, 0.018, 0.22, 12]} />
              <meshStandardMaterial color={CHAIR_COLORS.chrome} metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Bệ tì tay bọc đệm êm mềm PU */}
            <RoundedBox args={[0.085, 0.032, 0.25]} radius={0.012} smoothness={4} castShadow>
              <meshStandardMaterial color="#27272a" roughness={0.88} />
            </RoundedBox>
          </group>
        ))}

        {/* Khớp đỡ kim loại dưới gầm ghế */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.26, 0.05, 0.26]} />
          <meshStandardMaterial color={CHAIR_COLORS.metalDark} metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 2. PHẦN CHÂN GHẾ & BÁNH XE (Base & Casters) ── */}
      {/* Trục Piston thủy lực mạ Chrome (Gas Lift Cylinder) */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.26, 16]} />
        <meshStandardMaterial color={CHAIR_COLORS.chrome} metalness={0.96} roughness={0.12} />
      </mesh>
      {/* Ốp che bụi cổ piston */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.042, 0.048, 0.12, 12]} />
        <meshStandardMaterial color="#09090b" roughness={0.7} />
      </mesh>

      {/* Chân sao 5 cánh hợp kim nhôm bóng bẩy (5-Star Aluminum Alloy Base) */}
      <group position={[0, 0.08, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
            {/* Nan chân ghế vát cạnh khí động học */}
            <mesh position={[0.16, 0, 0]} rotation={[0, 0, -0.05]} castShadow>
              <boxGeometry args={[0.32, 0.035, 0.045]} />
              <meshStandardMaterial color={CHAIR_COLORS.chrome} metalness={0.95} roughness={0.16} />
            </mesh>

            {/* Cụm bánh xe đôi 360 độ (Twin Dual Casters) */}
            <group position={[0.32, -0.045, 0]}>
              {/* Trục gắn bánh xe */}
              <mesh position={[0, 0.025, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.035, 8]} />
                <meshStandardMaterial color={CHAIR_COLORS.metalDark} metalness={0.8} />
              </mesh>
              {/* Vành bánh xe mạ chrome */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.038, 12]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={CHAIR_COLORS.chrome} metalness={0.9} roughness={0.2} />
              </mesh>
              {/* 2 bánh lăn cao su đen chống trầy sàn */}
              {[-0.018, 0.018].map((wz, wi) => (
                <mesh key={wi} position={[0, 0, wz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.026, 0.026, 0.014, 16]} />
                  <meshStandardMaterial color={CHAIR_COLORS.wheelRubber} roughness={0.85} />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}

export default GamingChair