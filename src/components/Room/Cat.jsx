import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { COLORS } from './colors'

/**
 * Cat - Mèo với breathing và tail animation
 * Easter Egg trigger - click nhiều lần để unlock
 */
function Cat() {
  const catRef = useRef()
  const tailRef = useRef()
  
  // Breathing + tail animation
  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Breathing
    if (catRef.current) {
      catRef.current.scale.y = 1 + Math.sin(t * 2) * 0.03
    }
    
    // Tail wag
    if (tailRef.current) {
      tailRef.current.rotation.x = 0.3 + Math.sin(t * 3) * 0.2
      tailRef.current.rotation.z = Math.sin(t * 2.5) * 0.15
    }
  })
  
  return (
    <group position={[0.3, 0, 0.8]} rotation={[0, -0.3, 0]}>
      {/* Body */}
      <mesh ref={catRef} position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.22, 0.18, 0.38]} />
        <meshToonMaterial color={COLORS.cat} />
      </mesh>
      
      {/* Belly (lighter) */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.3]} />
        <meshToonMaterial color="#F8C471" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.26, 0.22]} castShadow>
        <boxGeometry args={[0.2, 0.17, 0.17]} />
        <meshToonMaterial color={COLORS.cat} />
      </mesh>
      
      {/* Face details */}
      <mesh position={[0, 0.24, 0.31]}>
        <planeGeometry args={[0.16, 0.1]} />
        <meshToonMaterial color="#F8C471" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.04, 0.28, 0.31]}>
        <circleGeometry args={[0.02, 8]} />
        <meshBasicMaterial color="#2D2D2D" />
      </mesh>
      <mesh position={[0.04, 0.28, 0.31]}>
        <circleGeometry args={[0.02, 8]} />
        <meshBasicMaterial color="#2D2D2D" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.23, 0.31]}>
        <circleGeometry args={[0.015, 6]} />
        <meshBasicMaterial color="#E8967A" />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.06, 0.37, 0.2]} rotation={[0, 0, -0.2]} castShadow>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshToonMaterial color={COLORS.cat} />
      </mesh>
      <mesh position={[0.06, 0.37, 0.2]} rotation={[0, 0, 0.2]} castShadow>
        <coneGeometry args={[0.04, 0.08, 4]} />
        <meshToonMaterial color={COLORS.cat} />
      </mesh>
      {/* Inner ears */}
      <mesh position={[-0.06, 0.36, 0.21]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.025, 0.05, 4]} />
        <meshToonMaterial color="#F8C471" />
      </mesh>
      <mesh position={[0.06, 0.36, 0.21]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.025, 0.05, 4]} />
        <meshToonMaterial color="#F8C471" />
      </mesh>
      
      {/* Legs */}
      {[[-0.06, 0.18], [0.06, 0.18], [-0.06, -0.12], [0.06, -0.12]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} castShadow>
          <boxGeometry args={[0.05, 0.1, 0.06]} />
          <meshToonMaterial color={COLORS.cat} />
        </mesh>
      ))}
      
      {/* Tail */}
      <mesh ref={tailRef} position={[0, 0.18, -0.25]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.22]} />
        <meshToonMaterial color={COLORS.cat} />
      </mesh>
      <mesh position={[0, 0.22, -0.35]} castShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshToonMaterial color={COLORS.catDark} />
      </mesh>
    </group>
  )
}

export default Cat
