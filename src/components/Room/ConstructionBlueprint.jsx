import { forwardRef, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ConstructionBlueprint - Lưới quy hoạch kiến trúc Holographic & Cọc mốc Laser thi công
 * Tái hiện quy trình định vị công trình chuẩn Awwwards:
 * - Lưới toạ độ Blueprint cyan neon phát quang với các đường kẻ tỷ lệ kiến trúc chính xác
 * - 4 cọc laser mốc cao độ 3.0m tại 4 góc phòng với các vòng định vị xoay nhịp nhàng
 * - Vòng sóng radar thi công quét lan tỏa từ tâm phòng ra 4 cạnh
 * - Các vạch đánh dấu toạ độ trục X / Z nổi bật
 */

// Shared Flyweight Geometries & Materials (Zero GC)
const cornerPillarGeo = new THREE.CylinderGeometry(0.016, 0.016, 3.0, 8)
const cornerPillarMat = new THREE.MeshBasicMaterial({
  color: '#00f5ff',
  transparent: true,
  opacity: 0.85,
})

const cornerRingGeo = new THREE.RingGeometry(0.12, 0.24, 24)
const cornerRingMat = new THREE.MeshBasicMaterial({
  color: '#00f5ff',
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide,
})

const centerOriginRingGeo = new THREE.RingGeometry(0.2, 0.28, 32)
const centerOriginRingMat = new THREE.MeshBasicMaterial({
  color: '#38bdf8',
  transparent: true,
  opacity: 0.9,
  side: THREE.DoubleSide,
})

const radarWaveGeo = new THREE.RingGeometry(0.02, 0.08, 32)
const radarWaveMat = new THREE.MeshBasicMaterial({
  color: '#00f5ff',
  transparent: true,
  opacity: 0.65,
  side: THREE.DoubleSide,
})

const CORNER_COORDS = [
  [-4, 1.5, -4],
  [-4, 1.5, 4],
  [4, 1.5, -4],
  [4, 1.5, 4],
]

const CORNER_RING_COORDS = [
  [-4, 0.005, -4],
  [-4, 0.005, 4],
  [4, 0.005, -4],
  [4, 0.005, 4],
]

const ConstructionBlueprint = forwardRef(function ConstructionBlueprint(props, ref) {
  const radarWaveRef = useRef()
  const ringsGroupRef = useRef()

  // Diễn hoạt sóng radar quét mở rộng từ tâm trên mặt sàn
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (radarWaveRef.current) {
      // Sóng radar quét lan tỏa từ bán kính 0.2m ra 5.5m rồi lặp lại
      const cycle = (t * 1.5) % 1.0
      const scale = 0.2 + cycle * 5.2
      radarWaveRef.current.scale.set(scale, scale, 1)
      radarWaveRef.current.material.opacity = Math.max(0, (1 - cycle) * 0.75)
    }

    if (ringsGroupRef.current) {
      ringsGroupRef.current.rotation.y = t * 0.8
    }
  })

  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* ── 1. Lưới toạ độ kiến trúc Holographic Cyan trên mặt sàn (Chia ô 0.5m) ── */}
      <gridHelper
        args={[8.0, 16, '#00f5ff', '#0284c7']}
        position={[0, 0.003, 0]}
      />

      {/* ── 2. Đường chữ thập toạ độ trục X & Z phát quang ── */}
      <lineSegments position={[0, 0.004, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={4}
            array={new Float32Array([-4, 0, 0, 4, 0, 0, 0, 0, -4, 0, 0, 4])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#38bdf8" linewidth={2} transparent opacity={0.85} />
      </lineSegments>

      {/* ── 3. Vòng tròn tâm toạ độ (0, 0, 0) ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        geometry={centerOriginRingGeo}
        material={centerOriginRingMat}
      />

      {/* ── 4. Sóng Radar kiến trúc quét lan tỏa từ tâm ── */}
      <mesh
        ref={radarWaveRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.006, 0]}
        geometry={radarWaveGeo}
        material={radarWaveMat}
      />

      {/* ── 5. 4 Cọc mốc Laser định vị 4 góc ranh giới phòng cao 3.0m ── */}
      {CORNER_COORDS.map((pos, idx) => (
        <group key={`pylon-${idx}`}>
          <mesh
            position={pos}
            geometry={cornerPillarGeo}
            material={cornerPillarMat}
          />
          {/* Các vạch phân tầng độ cao (0.5m, 1.0m, 1.5m, 2.0m, 2.5m) trên cọc mốc */}
          {[0.5, 1.0, 1.5, 2.0, 2.5].map((y, ringIdx) => (
            <mesh
              key={`ring-height-${ringIdx}`}
              position={[pos[0], y, pos[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
              geometry={new THREE.RingGeometry(0.025, 0.045, 8)}
              material={cornerPillarMat}
            />
          ))}
        </group>
      ))}

      {/* ── 6. Vòng tròn Laser định vị xoay nhịp nhàng dưới chân 4 cọc mốc ── */}
      <group ref={ringsGroupRef}>
        {CORNER_RING_COORDS.map((pos, idx) => (
          <mesh
            key={`ring-${idx}`}
            position={pos}
            rotation={[-Math.PI / 2, 0, 0]}
            geometry={cornerRingGeo}
            material={cornerRingMat}
          />
        ))}
      </group>

      {/* ── 7. Đường bao ranh giới công trình 8x8m ── */}
      <lineSegments position={[0, 0.004, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(8.0, 0.01, 8.0)]}
        />
        <lineBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.95}
          linewidth={2}
        />
      </lineSegments>
    </group>
  )
})

export default ConstructionBlueprint
