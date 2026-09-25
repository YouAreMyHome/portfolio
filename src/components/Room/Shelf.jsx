import React from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './colors'
import InteractiveObject from './InteractiveObject'

/**
 * Shelf - Kệ sách treo tường phong cách Bắc Âu (Walnut & Steel Floating Bookshelf)
 * - Từng cuốn sách được tạo hình bìa cứng, gáy nổi, dải đánh dấu trang và độ nghiêng tự nhiên
 * - Chặn sách đá cẩm thạch
 * - Cây thường xuân (Trailing Ivy) buông lá nhẹ nhàng bên sườn kệ
 * - Tượng điêu khắc hình học nghệ thuật
 * - Click vào cụm sách mở Blog panel
 */
// Flyweight Assets cho Giá đỡ kệ và Sách
const bracketVertGeo = new THREE.BoxGeometry(0.024, 0.14, 0.012)
const bracketHorizGeo = new THREE.BoxGeometry(0.024, 0.012, 0.19)
const bracketDiagGeo = new THREE.BoxGeometry(0.018, 0.012, 0.14)
const bracketMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4, metalness: 0.8 })
const spineGoldMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.9, roughness: 0.2 })
const bookPaperMat = new THREE.MeshStandardMaterial({ color: '#faf8f2', roughness: 0.9 })

function Shelf() {
  const shelfWood = '#966538'

  // Bảng màu sách hiện đại thanh lịch
  const bookList = [
    { title: 'Design Systems', w: 0.045, h: 0.21, d: 0.16, color: '#1e3a5f', spineGold: true },
    { title: 'Clean Architecture', w: 0.038, h: 0.19, d: 0.15, color: '#854d0e', ribbon: '#d97706' },
    { title: 'Modern UI/UX', w: 0.052, h: 0.22, d: 0.17, color: '#14532d', spineGold: true },
    { title: 'Algorithms', w: 0.042, h: 0.18, d: 0.14, color: '#881337', ribbon: '#f43f5e' },
    { title: 'The Pragmatic Dev', w: 0.035, h: 0.17, d: 0.14, color: '#334155', spineGold: false },
    { title: 'Creative Coding', w: 0.048, h: 0.20, d: 0.16, color: '#b45309', ribbon: '#fde047' },
  ]

  let curX = -0.26

  return (
    <group position={[2.8, 2.05, -3.90]}>
      {/* ── 1. Mặt kệ gỗ vát cạnh (Floating Oak Shelf) ── */}
      <RoundedBox
        args={[1.15, 0.038, 0.26]}
        radius={0.008}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={shelfWood} roughness={0.65} metalness={0.05} />
      </RoundedBox>

      {/* ── 2. Giá đỡ kim loại đen mờ (Matte Black Brackets - Flyweight) ── */}
      {[-0.44, 0.44].map((x, i) => (
        <group key={i} position={[x, -0.09, -0.06]}>
          {/* Thanh dọc áp tường */}
          <mesh position={[0, -0.04, -0.055]} castShadow geometry={bracketVertGeo} material={bracketMat} />
          {/* Thanh ngang đỡ kệ */}
          <mesh position={[0, 0.05, 0.05]} castShadow geometry={bracketHorizGeo} material={bracketMat} />
          {/* Thanh chéo gia cố chịu lực */}
          <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 4, 0, 0]} castShadow geometry={bracketDiagGeo} material={bracketMat} />
        </group>
      ))}

      {/* ── 3. Chặn sách đá cẩm thạch bên trái ── */}
      <group position={[-0.34, 0.05, 0]}>
        <mesh rotation={[0, 0, -0.1]} castShadow>
          <coneGeometry args={[0.05, 0.11, 4]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.25} metalness={0.15} />
        </mesh>
      </group>

      {/* ── 4. Cụm sách tương tác (Interactive Books - Click mở Blog) ── */}
      <InteractiveObject name="books" panelId="blog" hoverLift={0.04}>
        <group>
          {bookList.map((b, idx) => {
            const posX = curX
            curX += b.w + 0.008
            return (
              <group key={idx} position={[posX, 0.019 + b.h / 2, 0]}>
                {/* Bìa cứng ngoài */}
                <RoundedBox args={[b.w, b.h, b.d]} radius={0.006} smoothness={4} castShadow>
                  <meshStandardMaterial color={b.color} roughness={0.72} />
                </RoundedBox>

                {/* Khối giấy bên trong (ruột sách thụt vào 2mm) */}
                <mesh position={[0, 0, 0.003]} material={bookPaperMat}>
                  <boxGeometry args={[b.w - 0.006, b.h - 0.01, b.d - 0.008]} />
                </mesh>

                {/* Dập kim vàng ở gáy sách */}
                {b.spineGold && (
                  <mesh position={[0, 0.04, -b.d / 2 - 0.001]} material={spineGoldMat}>
                    <planeGeometry args={[b.w - 0.008, 0.025]} />
                  </mesh>
                )}

                {/* Dải ruy băng bookmark buông thõng */}
                {b.ribbon && (
                  <mesh position={[0, -b.h / 2 - 0.02, 0.04]} rotation={[0.1, 0, 0]}>
                    <planeGeometry args={[0.008, 0.045]} />
                    <meshStandardMaterial color={b.ribbon} roughness={0.5} side={2} />
                  </mesh>
                )}
              </group>
            )
          })}

          {/* Cuốn sách tựa nghiêng tự nhiên (Leaning Book) */}
          <group position={[curX + 0.04, 0.075, 0.01]} rotation={[0, 0, -0.22]}>
            <RoundedBox args={[0.038, 0.17, 0.15]} radius={0.005} smoothness={4} castShadow>
              <meshStandardMaterial color="#0f766e" roughness={0.7} />
            </RoundedBox>
            <mesh position={[0, 0, 0.003]} material={bookPaperMat}>
              <boxGeometry args={[0.032, 0.16, 0.14]} />
            </mesh>
          </group>

          {/* Cuốn sách nằm bẹp phía dưới */}
          <group position={[curX + 0.13, 0.035, 0.01]}>
            <RoundedBox args={[0.15, 0.032, 0.18]} radius={0.004} smoothness={4} castShadow>
              <meshStandardMaterial color="#374151" roughness={0.75} />
            </RoundedBox>
            <mesh position={[0.003, 0, 0]} material={bookPaperMat}>
              <boxGeometry args={[0.14, 0.026, 0.17]} />
            </mesh>
          </group>
        </group>
      </InteractiveObject>

      {/* ── 5. Cây thường xuân rủ mép kệ (Trailing Ivy Plant) ── */}
      <group position={[-0.47, 0.019, 0.04]}>
        {/* Chậu gốm nung Terracotta có viền */}
        <mesh position={[0, 0.045, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.035, 0.09, 16]} />
          <meshStandardMaterial color="#c27d66" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.088, 0]} castShadow>
          <torusGeometry args={[0.045, 0.006, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#d48c77" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.085, 0]}>
          <circleGeometry args={[0.042, 16]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#2d1e16" roughness={0.95} />
        </mesh>

        {/* Tán lá rủ xum xuê buông qua mép kệ */}
        {[
          { x: 0.02, y: 0.07, z: 0.04, len: 0.24, rot: [0.35, 0.1, 0.15] },
          { x: -0.03, y: 0.06, z: 0.03, len: 0.32, rot: [0.45, 0.25, -0.2] },
          { x: 0.04, y: 0.05, z: 0.02, len: 0.18, rot: [0.25, -0.3, 0.35] },
        ].map((vine, vIdx) => (
          <group key={vIdx} position={[vine.x, vine.y, vine.z]} rotation={vine.rot}>
            {/* Thân nhánh dây leo */}
            <mesh position={[0, -vine.len / 2, 0]}>
              <cylinderGeometry args={[0.003, 0.003, vine.len, 6]} />
              <meshStandardMaterial color="#1b4332" roughness={0.8} />
            </mesh>
            {/* Từng chiếc lá thường xuân to bản, sinh động */}
            {[0.04, 0.09, 0.14, 0.19, 0.25, 0.3].map((ly, lIdx) => {
              if (ly > vine.len) return null
              return (
                <mesh
                  key={lIdx}
                  position={[lIdx % 2 === 0 ? 0.018 : -0.018, -ly, 0.01]}
                  rotation={[0.35, 0, lIdx * 0.5]}
                  castShadow
                >
                  <circleGeometry args={[0.026, 8]} />
                  <meshStandardMaterial
                    color={lIdx % 2 === 0 ? '#2d6a4f' : '#52b788'}
                    roughness={0.5}
                    side={2}
                  />
                </mesh>
              )
            })}
          </group>
        ))}
      </group>

      {/* ── 6. Tượng điêu khắc nghệ thuật hình học (Polyhedron Art Piece) ── */}
      <group position={[0.42, 0.02, 0]}>
        {/* Bệ đỡ bằng đá hoa cương đen */}
        <RoundedBox args={[0.08, 0.025, 0.08]} radius={0.004} position={[0, 0.012, 0]} castShadow>
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
        </RoundedBox>
        {/* Khối đa diện 12 mặt bằng đồng vàng */}
        <mesh position={[0, 0.06, 0]} rotation={[0.4, 0.6, 0.2]} castShadow>
          <dodecahedronGeometry args={[0.035, 0]} />
          <meshStandardMaterial color="#eab308" metalness={0.92} roughness={0.22} />
        </mesh>
      </group>
    </group>
  )
}

export default Shelf
