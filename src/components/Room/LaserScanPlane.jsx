import { forwardRef } from 'react'
import * as THREE from 'three'

/**
 * LaserScanPlane - Mặt phẳng Laser quét thi công toàn phòng (Volumetric Laser Slicing Plane)
 * - Quét từ sàn (Y=0) lên đỉnh tường (Y=3.2m)
 * - Tái hiện công nghệ in 3D laser tổng hợp vật chất kiến trúc
 * - Viền cạnh phát quang rực rỡ tạo điểm nhấn thị giác đẳng cấp
 */

// Shared Flyweight Assets
const laserSurfaceGeo = new THREE.PlaneGeometry(8.06, 8.06)
const laserSurfaceMat = new THREE.MeshBasicMaterial({
  color: '#00f5ff',
  transparent: true,
  opacity: 0.14,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

const laserEdgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(8.06, 0.02, 8.06))
const laserEdgeMat = new THREE.LineBasicMaterial({
  color: '#00f5ff',
  transparent: true,
  opacity: 0.95,
  linewidth: 2,
})

const LaserScanPlane = forwardRef(function LaserScanPlane(props, ref) {
  return (
    <group ref={ref} position={[0, 0.01, 0]}>
      {/* Mặt phẳng laser mờ trong suốt */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={laserSurfaceGeo}
        material={laserSurfaceMat}
      />

      {/* Viền laser rực sáng chạy theo mặt phẳng */}
      <lineSegments geometry={laserEdgeGeo} material={laserEdgeMat} />
    </group>
  )
})

export default LaserScanPlane

