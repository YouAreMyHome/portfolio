import React, { useRef, useMemo, useLayoutEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * VolumetricAtmosphere - Hiệu ứng không khí vi mô tinh tế, trong trẻo
 * - Coffee Mug Steam: Hơi nước bốc lên từ cốc cà phê
 * Tối ưu hóa:
 * - InstancedMesh cho các hạt hơi nước thay vì render nhiều mesh riêng rẽ
 * - Không dùng các khối hình học giả luồng sáng làm đục màn hình
 */
const sharedSteamSphereGeo = new THREE.SphereGeometry(1, 6, 6)
const steamMat = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.08,
  depthWrite: false,
})

const STEAM_COUNT = 10

function VolumetricAtmosphere() {
  const steamGroupRef = useRef()
  const instancedRef = useRef()

  const steamData = useMemo(() => {
    return Array.from({ length: STEAM_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.02,
      y: (i / STEAM_COUNT) * 0.18,
      z: (Math.random() - 0.5) * 0.02,
      scale: 0.01 + Math.random() * 0.012,
    }))
  }, [])

  useLayoutEffect(() => {
    if (!instancedRef.current) return
    const dummy = new THREE.Object3D()
    steamData.forEach((d, i) => {
      dummy.position.set(d.x, d.y, d.z)
      dummy.scale.set(d.scale, d.scale * 1.4, d.scale)
      dummy.updateMatrix()
      instancedRef.current.setMatrixAt(i, dummy.matrix)
    })
    instancedRef.current.instanceMatrix.needsUpdate = true
  }, [steamData])

  // Animation frame loop nhẹ nhàng
  useFrame((state) => {
    if (steamGroupRef.current) {
      const time = state.clock.elapsedTime
      steamGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.12
    }
  })

  return (
    <group>
      {/* ── Coffee Mug Steam (Instanced Batch) ── */}
      <group ref={steamGroupRef} position={[-2.45, 0.84, -2.15]}>
        <instancedMesh
          ref={instancedRef}
          args={[sharedSteamSphereGeo, steamMat, STEAM_COUNT]}
        />
      </group>
    </group>
  )
}

export default memo(VolumetricAtmosphere)
