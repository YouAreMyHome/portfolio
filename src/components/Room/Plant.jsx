import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────────
   1. MONSTERA DELICIOSA (Trầu bà lá xẻ Nam Mỹ cao cấp)
   - Phiến lá to bản xẻ rãnh nghệ thuật, màu xanh ngọc bích chuyển sắc
   - Cuống lá uốn cong tự nhiên theo trọng lực, đung đưa nhẹ trong gió
   - Chậu gốm tráng men gân sọc đặt trên giá gỗ 3 chân sang trọng
───────────────────────────────────────────────────────────────── */
function MonsteraPlant() {
  const crownRef = useRef()

  useFrame(({ clock }) => {
    if (!crownRef.current) return
    const t = clock.elapsedTime
    crownRef.current.rotation.z = Math.sin(t * 0.45) * 0.015
    crownRef.current.rotation.x = Math.sin(t * 0.35 + 0.8) * 0.012
  })

  // Dữ liệu các tán lá Monstera: [góc quay Y, độ ngả, chiều dài, độ rộng, màu sắc]
  const leaves = [
    { ry: 0.1, tilt: 0.52, len: 0.55, w: 0.32, color: '#166534' },
    { ry: 1.1, tilt: 0.62, len: 0.58, w: 0.34, color: '#15803d' },
    { ry: 2.2, tilt: 0.48, len: 0.52, w: 0.30, color: '#14532d' },
    { ry: 3.3, tilt: 0.58, len: 0.60, w: 0.36, color: '#166534' },
    { ry: 4.4, tilt: 0.45, len: 0.54, w: 0.32, color: '#15803d' },
    { ry: 5.5, tilt: 0.32, len: 0.46, w: 0.26, color: '#22c55e' }, // Lá non mới nhú
  ]

  const woodColor = '#9a6b42'

  return (
    <group>
      {/* ── Giá đỡ gỗ 3 chân (Tripod Stand) ── */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          {/* Chân gỗ nghiêng thanh mảnh */}
          <mesh position={[0.13, 0.12, 0]} rotation={[0, 0, -0.06]} castShadow>
            <cylinderGeometry args={[0.011, 0.014, 0.26, 10]} />
            <meshStandardMaterial color={woodColor} roughness={0.65} />
          </mesh>
          {/* Thanh giằng ngang liên kết 3 chân */}
          <mesh position={[0.065, 0.15, 0]}>
            <boxGeometry args={[0.13, 0.016, 0.016]} />
            <meshStandardMaterial color={woodColor} roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* ── Chậu gốm tráng men màu kem thanh lịch (Ceramic Planter) ── */}
      <group position={[0, 0.18, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.11, 0.24, 24]} />
          <meshStandardMaterial color="#f1ede6" roughness={0.5} metalness={0.04} />
        </mesh>
        {/* Miệng chậu bo viền */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <torusGeometry args={[0.14, 0.012, 10, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#e5ded3" roughness={0.5} />
        </mesh>
        {/* Lớp đất trồng cây màu nâu thẫm */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 18]} />
          <meshStandardMaterial color="#22150e" roughness={0.95} />
        </mesh>
        {/* Lớp sỏi trang trí rải mặt chậu */}
        {[...Array(6)].map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + 0.3
          return (
            <mesh key={i} position={[Math.cos(a) * 0.08, 0.232, Math.sin(a) * 0.08]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#e2d7c5' : '#c9baaa'} roughness={0.8} />
            </mesh>
          )
        })}
      </group>

      {/* ── Cụm tán lá Monstera uốn lượn tự nhiên ── */}
      <group ref={crownRef} position={[0, 0.54, 0]}>
        {leaves.map((leaf, idx) => (
          <group key={idx} rotation={[0, leaf.ry, 0]}>
            {/* Cuống lá (Petiole) vươn cong ra ngoài */}
            <group rotation={[leaf.tilt * 0.6, 0, 0]}>
              <mesh position={[0, leaf.len * 0.2, 0]} castShadow>
                <cylinderGeometry args={[0.007, 0.012, leaf.len * 0.42, 8]} />
                <meshStandardMaterial color="#1e5c2b" roughness={0.6} />
              </mesh>
            </group>

            {/* Phiến lá Monstera xẻ rãnh */}
            <group position={[0, leaf.len * 0.35, 0]} rotation={[leaf.tilt, 0, 0]}>
              {/* Sống lá chính giữa */}
              <mesh position={[0, leaf.len * 0.3, 0.006]} castShadow>
                <boxGeometry args={[0.012, leaf.len * 0.6, 0.008]} />
                <meshStandardMaterial color="#4ade80" roughness={0.5} />
              </mesh>

              {/* Thân lá trung tâm */}
              <mesh position={[0, leaf.len * 0.3, 0]} castShadow>
                <boxGeometry args={[leaf.w * 0.55, leaf.len * 0.58, 0.006]} />
                <meshStandardMaterial color={leaf.color} roughness={0.5} side={2} />
              </mesh>

              {/* Các dải lá xẻ đối xứng hai bên (Leaf Fenestrations) */}
              {[-0.14, 0.14].map((sideX, sIdx) => (
                <group key={sIdx} position={[sideX, leaf.len * 0.28, 0]}>
                  {[-0.1, 0, 0.1].map((fy, fIdx) => (
                    <mesh key={fIdx} position={[0, fy, 0]} rotation={[0, 0, sIdx === 0 ? -0.2 : 0.2]} castShadow>
                      <boxGeometry args={[leaf.w * 0.42, 0.065, 0.006]} />
                      <meshStandardMaterial color={leaf.color} roughness={0.5} side={2} />
                    </mesh>
                  ))}
                </group>
              ))}

              {/* Chóp đầu lá rủ nhẹ xuống */}
              <group position={[0, leaf.len * 0.58, 0]} rotation={[0.3, 0, 0]}>
                <mesh position={[0, 0.06, 0]} castShadow>
                  <coneGeometry args={[leaf.w * 0.28, 0.14, 4]} />
                  <meshStandardMaterial color={leaf.color} roughness={0.5} side={2} />
                </mesh>
              </group>
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────────
   2. SUCCULENT PLANTER (Chậu sen đá Jade Plant mọng nước cạnh giường)
   - Chậu đất nung Terracotta dập nổi hoa văn hình học
   - Các nhánh sen đá xếp cánh mọng nước chuyển màu xanh ngọc pha phớt hồng
───────────────────────────────────────────────────────────────── */
function SucculentPlant() {
  const plantRef = useRef()

  useFrame(({ clock }) => {
    if (!plantRef.current) return
    const t = clock.elapsedTime
    plantRef.current.rotation.y = Math.sin(t * 0.3) * 0.01
  })

  return (
    <group>
      {/* ── Đĩa lót chậu đất nung (Terracotta Saucer) ── */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.22, 0.19, 0.03, 18]} />
        <meshStandardMaterial color="#c26a45" roughness={0.85} />
      </mesh>

      {/* ── Thân chậu đất nung gờ miệng nổi ── */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.13, 0.3, 18]} />
        <meshStandardMaterial color="#c8704b" roughness={0.85} />
      </mesh>
      {/* Vành miệng chậu dày dặn */}
      <mesh position={[0, 0.335, 0]} castShadow>
        <cylinderGeometry args={[0.195, 0.185, 0.035, 18]} />
        <meshStandardMaterial color="#b9623e" roughness={0.85} />
      </mesh>

      {/* ── Lớp sỏi núi lửa phủ mặt ── */}
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
        <meshStandardMaterial color="#382a22" roughness={0.95} />
      </mesh>

      {/* ── Cụm hoa sen đá mọng nước (Succulent Rosette) ── */}
      <group ref={plantRef} position={[0, 0.35, 0]}>
        {/* Tầng cánh lớn bên dưới */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const rotY = (i / 6) * Math.PI * 2
          return (
            <group key={i} rotation={[0, rotY, 0]}>
              <mesh position={[0.07, 0.03, 0]} rotation={[0, 0, -0.45]} castShadow>
                <coneGeometry args={[0.048, 0.11, 6]} />
                <meshStandardMaterial color="#4ade80" roughness={0.6} />
              </mesh>
              {/* Phớt hồng viền chóp lá */}
              <mesh position={[0.11, 0.05, 0]} rotation={[0, 0, -0.45]}>
                <sphereGeometry args={[0.014, 6, 6]} />
                <meshStandardMaterial color="#fb7185" roughness={0.5} />
              </mesh>
            </group>
          )
        })}

        {/* Tầng cánh trung tâm hướng lên */}
        {[0, 1, 2, 3, 4].map((i) => {
          const rotY = (i / 5) * Math.PI * 2 + 0.4
          return (
            <group key={i} rotation={[0, rotY, 0]}>
              <mesh position={[0.045, 0.08, 0]} rotation={[0, 0, -0.25]} castShadow>
                <coneGeometry args={[0.036, 0.09, 6]} />
                <meshStandardMaterial color="#86efac" roughness={0.55} />
              </mesh>
              {/* Phớt hồng viền chóp lá tầng trên */}
              <mesh position={[0.065, 0.11, 0]} rotation={[0, 0, -0.25]}>
                <sphereGeometry args={[0.011, 6, 6]} />
                <meshStandardMaterial color="#f43f5e" roughness={0.5} />
              </mesh>
            </group>
          )
        })}

        {/* Búp non giữa tâm sen đá */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#bbf7d0" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Plant Component tổng hợp
 */
function Plant({ variant = 'tropical', ...props }) {
  return (
    <group {...props}>
      {variant === 'tropical' ? <MonsteraPlant /> : <SucculentPlant />}
    </group>
  )
}

export default Plant
