import { forwardRef } from 'react'
import * as THREE from 'three'

/**
 * HolographicScaffold - Khung lưới dây ma trận kiến trúc (Architectural Blueprint Ghost Wireframe)
 * Tạo nên linh hồn của quá trình xây dựng từ hư vô chuẩn Awwwards:
 * - Dự phóng toàn bộ hình bóng 3D của căn phòng (tường, bàn, giường, tủ, cửa sổ) dưới dạng wireframe neon cyan
 * - Giúp người xem nhìn thấy ngay bản thiết kế số của toàn bộ không gian trước khi vật chất đặc xuất hiện
 * - Tự động mờ dần và hòa tan vào các khối vật lý thực khi quá trình thi công hoàn tất
 */

// Shared Flyweight Wireframe Material
const scaffoldMat = new THREE.LineBasicMaterial({
  color: '#00f5ff',
  transparent: true,
  opacity: 0.65,
  linewidth: 1,
})

const accentMat = new THREE.LineBasicMaterial({
  color: '#38bdf8',
  transparent: true,
  opacity: 0.9,
  linewidth: 2,
})

// Geometries cho từng cấu kiện kiến trúc wireframe
const roomBoxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(8, 3, 8))
const deskBoxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.3, 0.05, 1.1))
const bedBoxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.35, 0.35, 1.95))
const headboardGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.35, 1.1, 0.12))
const tvConsoleGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.1, 0.42, 0.48))
const cabinetGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.05, 0.82, 0.48))
const windowGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.08, 1.6, 1.8))

const HolographicScaffold = forwardRef(function HolographicScaffold(props, ref) {
  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* ── 1. Khung bao kiến trúc tổng thể 8x3x8m ── */}
      <lineSegments position={[0, 1.5, 0]} geometry={roomBoxGeo} material={accentMat} />

      {/* ── 2. Khung bàn làm việc PC ── */}
      <group position={[-2.45, 0.75, -2.4]}>
        <lineSegments geometry={deskBoxGeo} material={scaffoldMat} />
        {/* 4 chân bàn wireframe */}
        {[
          [-1.05, -0.375, -0.45],
          [-1.05, -0.375, 0.45],
          [1.05, -0.375, -0.45],
          [1.05, -0.375, 0.45],
        ].map((pos, i) => (
          <lineSegments
            key={`desk-leg-${i}`}
            position={pos}
            geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.04, 0.72, 0.04))}
            material={scaffoldMat}
          />
        ))}
      </group>

      {/* ── 3. Khung giường ngủ Japandi & vách đầu giường ── */}
      <group position={[-2.6, 0.18, 1.9]}>
        <lineSegments geometry={bedBoxGeo} material={scaffoldMat} />
        <lineSegments position={[0, 0.55, -0.92]} geometry={headboardGeo} material={scaffoldMat} />
      </group>

      {/* ── 4. Khung Kệ TV & Giải trí ── */}
      <lineSegments position={[1.6, 0.22, -3.6]} geometry={tvConsoleGeo} material={scaffoldMat} />

      {/* ── 5. Khung Tủ ngăn kéo (Cabinet) ── */}
      <lineSegments position={[3.1, 0.42, -1.8]} geometry={cabinetGeo} material={scaffoldMat} />

      {/* ── 6. Khung Cửa sổ tường trái ── */}
      <lineSegments position={[-3.96, 1.8, -1.4]} geometry={windowGeo} material={accentMat} />
    </group>
  )
})

export default HolographicScaffold

