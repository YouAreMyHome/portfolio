import React, { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * VolumetricAtmosphere - Hiệu ứng không khí vi mô tinh tế
 * - Hơi nước bốc lên từ cốc cà phê (Coffee Steam)
 */
const sharedSteamSphereGeo = new THREE.SphereGeometry(1, 6, 6)

function VolumetricAtmosphere() {
  const steamRef = useRef()

  // Tạo hạt hơi nước từ cốc cà phê
  const STEAM_COUNT = 10
  const steamData = useMemo(() => {
    return Array.from({ length: STEAM_COUNT }, (_, i) => ({
      x: (Math.random() - 0.5) * 0.02,
      y: (i / STEAM_COUNT) * 0.18,
      z: (Math.random() - 0.5) * 0.02,
      scale: 0.01 + Math.random() * 0.012,
    }))
  }, [])

  // Animation frame loop
  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (steamRef.current) {
      steamRef.current.rotation.y = Math.sin(time * 0.8) * 0.12
    }
  })

  return (
    <group>
      {/* ── Coffee Mug Steam ── */}
      <group ref={steamRef} position={[-2.45, 0.84, -2.15]}>
        {steamData.map((d, i) => (
          <mesh
            key={i}
            position={[d.x, d.y, d.z]}
            scale={[d.scale, d.scale * 1.4, d.scale]}
            geometry={sharedSteamSphereGeo}
          >
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.12 - (d.y / 0.2) * 0.1}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default memo(VolumetricAtmosphere)
