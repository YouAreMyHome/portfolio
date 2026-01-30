import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { COLORS } from './colors'

/**
 * Plant - Cây cảnh với sway animation
 */
function Plant({ position }) {
  const plantRef = useRef()
  
  // Subtle sway animation
  useFrame((state) => {
    if (plantRef.current) {
      plantRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.03
      plantRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.02
    }
  })
  
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.24, 8]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.1, 0.03, 8]} />
        <meshToonMaterial color="#6B3410" />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 8]} />
        <meshToonMaterial color="#3E2723" />
      </mesh>
      
      {/* Plant leaves group */}
      <group ref={plantRef} position={[0, 0.35, 0]}>
        {/* Main leaves */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshToonMaterial color={COLORS.plant} />
        </mesh>
        <mesh position={[0.08, 0.25, 0.05]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshToonMaterial color={COLORS.plantDark} />
        </mesh>
        <mesh position={[-0.06, 0.22, -0.04]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshToonMaterial color="#66BB6A" />
        </mesh>
        
        {/* Individual leaves sticking out */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2 + 0.3
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * 0.15, 0.1, Math.sin(angle) * 0.15]}
              rotation={[0.3, angle, 0.2]}
              castShadow
            >
              <boxGeometry args={[0.08, 0.15, 0.02]} />
              <meshToonMaterial color={i % 2 === 0 ? COLORS.plant : COLORS.plantDark} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

export default Plant
