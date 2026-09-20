import React from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './colors'

/**
 * Cabinet - Tủ ngăn kéo nan sóng phong cách Bắc Âu (Fluted Tambour Credenza)
 * Tinh xảo với vật liệu gỗ sồi PBR, phụ kiện bình gốm khuynh diệp, khay đá và nến thơm
 */
function Cabinet() {
  const oakColor = '#b38455'
  const oakDark = '#8a623c'
  const brassColor = '#d4af37'

  return (
    <group position={[3.2, 0, -3.2]}>
      {/* ── 1. Khung tủ chính (Main Body) ── */}
      <RoundedBox
        args={[0.88, 0.96, 0.52]}
        radius={0.02}
        smoothness={4}
        position={[0, 0.58, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={oakColor} roughness={0.62} metalness={0.04} />
      </RoundedBox>

      {/* Mặt trên tủ (Beveled Top Surface) */}
      <RoundedBox
        args={[0.92, 0.025, 0.56]}
        radius={0.01}
        smoothness={4}
        position={[0, 1.07, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={oakColor} roughness={0.55} metalness={0.05} />
      </RoundedBox>

      {/* ── 2. Chân tủ côn bọc đồng (Mid-century Tapered Legs) ── */}
      {[
        [-0.36, -0.19, 0.08, -0.08],
        [0.36, -0.19, 0.08, 0.08],
        [-0.36, 0.19, -0.08, -0.08],
        [0.36, 0.19, -0.08, 0.08],
      ].map(([x, z, rx, rz], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Chân gỗ côn */}
          <mesh position={[0, 0.06, 0]} rotation={[rx, 0, rz]} castShadow>
            <cylinderGeometry args={[0.016, 0.026, 0.14, 10]} />
            <meshStandardMaterial color={oakDark} roughness={0.6} />
          </mesh>
          {/* Chụp đồng đáy chân (Brass Ferrule) */}
          <mesh position={[0, 0.015, 0]} rotation={[rx, 0, rz]} castShadow>
            <cylinderGeometry args={[0.023, 0.026, 0.035, 10]} />
            <meshStandardMaterial color={brassColor} metalness={0.88} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* ── 3. Các ngăn kéo nan sọc (Fluted Tambour Drawers) ── */}
      {[
        { y: 0.26, h: 0.26 },
        { y: 0.56, h: 0.26 },
        { y: 0.86, h: 0.26 },
      ].map(({ y, h }, i) => (
        <group key={i} position={[0, y, 0.262]}>
          {/* Mặt ngăn kéo nền */}
          <RoundedBox args={[0.82, h - 0.02, 0.015]} radius={0.008} smoothness={4} castShadow>
            <meshStandardMaterial color="#c29465" roughness={0.65} />
          </RoundedBox>

          {/* Các rãnh nan gỗ dọc (Tambour Slats) */}
          {[...Array(17)].map((_, s) => (
            <mesh key={s} position={[-0.38 + s * 0.0475, 0, 0.009]}>
              <boxGeometry args={[0.028, h - 0.035, 0.008]} />
              <meshStandardMaterial color={s % 2 === 0 ? '#b8895b' : '#c99b6c'} roughness={0.6} />
            </mesh>
          ))}

          {/* Tay nắm thanh đồng thau dài sang trọng (Brushed Brass Bar Pull) */}
          <group position={[0, 0, 0.024]}>
            <RoundedBox args={[0.22, 0.014, 0.014]} radius={0.004} smoothness={4} castShadow>
              <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.22} />
            </RoundedBox>
            {/* 2 chốt chân gắn tay nắm */}
            {[-0.08, 0.08].map((px, idx) => (
              <mesh key={idx} position={[px, 0, -0.008]}>
                <cylinderGeometry args={[0.005, 0.005, 0.015, 8]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.22} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* ── 4. Đồ decor tinh xảo trên mặt tủ ── */}
      <group position={[0, 1.085, 0]}>
        {/* A. Bình gốm nghệ thuật + Cành khuynh diệp (Eucalyptus Vase) */}
        <group position={[-0.26, 0, 0.06]}>
          {/* Thân bình gốm mờ dáng tròn hồ lô */}
          <mesh position={[0, 0.07, 0]} castShadow>
            <sphereGeometry args={[0.068, 16, 16]} />
            <meshStandardMaterial color="#e8ded1" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.045, 0.07, 14]} />
            <meshStandardMaterial color="#e8ded1" roughness={0.85} />
          </mesh>
          {/* Cành cắm hoa */}
          {[
            { rot: [0.2, 0, -0.2], h: 0.22, leafColor: '#4a6b57' },
            { rot: [-0.1, 0.3, 0.15], h: 0.26, leafColor: '#5c7f6b' },
            { rot: [0.05, -0.4, 0.28], h: 0.19, leafColor: '#6e8f7c' },
          ].map((stem, idx) => (
            <group key={idx} position={[0, 0.14, 0]} rotation={stem.rot}>
              {/* Nhánh cây */}
              <mesh position={[0, stem.h / 2, 0]}>
                <cylinderGeometry args={[0.003, 0.003, stem.h, 6]} />
                <meshStandardMaterial color="#3c4e3f" roughness={0.7} />
              </mesh>
              {/* Các phiến lá tròn dẹt đặc trưng của bạch đàn */}
              {[0.06, 0.11, 0.16, 0.21].map((ly, lidx) => (
                <mesh
                  key={lidx}
                  position={[0, ly, 0.015]}
                  rotation={[0.3, lidx * 0.8, 0.2]}
                  castShadow
                >
                  <circleGeometry args={[0.022, 10]} />
                  <meshStandardMaterial color={stem.leafColor} roughness={0.65} side={2} />
                </mesh>
              ))}
            </group>
          ))}
        </group>

        {/* B. Khay đá Marble + Lọ tinh dầu khuếch tán (Reed Diffuser) */}
        <group position={[0.06, 0, -0.06]}>
          {/* Khay đá cẩm thạch vát cạnh */}
          <RoundedBox args={[0.22, 0.012, 0.16]} radius={0.005} smoothness={4} position={[0, 0.006, 0]} receiveShadow>
            <meshStandardMaterial color="#f0ece6" roughness={0.25} metalness={0.1} />
          </RoundedBox>
          {/* Lọ thủy tinh màu hổ phách */}
          <mesh position={[-0.05, 0.045, 0]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 0.065, 12]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.15}
              metalness={0.1}
              transparent
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
          {/* Nắp chai kim loại */}
          <mesh position={[-0.05, 0.08, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.01, 10]} />
            <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Que khuếch tán gỗ xòe góc */}
          {[-0.3, -0.1, 0.1, 0.25].map((angle, qIdx) => (
            <mesh key={qIdx} position={[-0.05, 0.12, 0]} rotation={[0.1, 0, angle]}>
              <cylinderGeometry args={[0.002, 0.002, 0.14, 6]} />
              <meshStandardMaterial color="#d4b996" roughness={0.7} />
            </mesh>
          ))}

          {/* Cốc nến thơm sáp đậu nành */}
          <mesh position={[0.05, 0.035, 0.02]} castShadow>
            <cylinderGeometry args={[0.028, 0.026, 0.055, 12]} />
            <meshStandardMaterial color="#fdfbf7" roughness={0.8} />
          </mesh>
          {/* Sáp nến bên trong */}
          <mesh position={[0.05, 0.055, 0.02]}>
            <circleGeometry args={[0.024, 12]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.4} />
          </mesh>
          {/* Bấc nến */}
          <mesh position={[0.05, 0.065, 0.02]}>
            <cylinderGeometry args={[0.0015, 0.0015, 0.015, 6]} />
            <meshBasicMaterial color="#111" />
          </mesh>
        </group>

        {/* C. Khung tranh kỷ niệm mặt kính phản chiếu (Framed Art) */}
        <group position={[0.26, 0, 0.04]} rotation={[0, -0.18, 0]}>
          {/* Khung gỗ óc chó vát góc */}
          <RoundedBox args={[0.15, 0.2, 0.018]} radius={0.004} smoothness={4} position={[0, 0.1, 0]} castShadow>
            <meshStandardMaterial color="#4a3525" roughness={0.5} />
          </RoundedBox>
          {/* Bo viền giấy trắng (Passe-partout) */}
          <mesh position={[0, 0.1, 0.01]}>
            <planeGeometry args={[0.125, 0.17]} />
            <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
          </mesh>
          {/* Tranh phong cảnh núi non nghệ thuật */}
          <mesh position={[0, 0.1, 0.011]}>
            <planeGeometry args={[0.095, 0.135]} />
            <meshStandardMaterial color="#557571" roughness={0.7} />
          </mesh>
          {/* Mặt trời mọc trong tranh */}
          <mesh position={[0.02, 0.13, 0.012]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color="#d4a373" />
          </mesh>
          {/* Lớp kính bảo vệ phản chiếu (Glass reflection) */}
          <mesh position={[0, 0.1, 0.013]}>
            <planeGeometry args={[0.13, 0.175]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.08}
              metalness={0.1}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
          {/* Chân chống khung tranh phía sau */}
          <mesh position={[0, 0.08, -0.03]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.02, 0.14, 0.006]} />
            <meshStandardMaterial color="#332418" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default Cabinet
