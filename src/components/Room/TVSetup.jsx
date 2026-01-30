import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { COLORS } from './colors'

/**
 * TVSetup - TV + Console (Playground/Hobby)
 * Screen có color shift animation
 */
function TVSetup() {
  const screenRef = useRef()
  
  // Screen color shift animation
  useFrame((state) => {
    if (screenRef.current) {
      const hue = (state.clock.elapsedTime * 0.1) % 1
      screenRef.current.material.emissive.setHSL(hue, 0.6, 0.3)
    }
  })
  
  return (
    <group position={[1, 0, -3.6]} rotation={[0, 0, 0]}>
      {/* TV Stand - nhỏ hơn để vừa góc */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.7, 0.35, 0.35]} />
        <meshToonMaterial color={COLORS.cabinet} />
      </mesh>
      
      {/* Stand shelf */}
      <mesh position={[0, 0.2, 0.03]}>
        <boxGeometry args={[0.6, 0.02, 0.28]} />
        <meshToonMaterial color="#A08060" />
      </mesh>
      
      {/* Game console */}
      <group position={[-0.15, 0.28, 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.05, 0.14]} />
          <meshToonMaterial color="#1a1a1a" />
        </mesh>
        {/* Console LED */}
        <mesh position={[0.08, 0.01, 0.08]}>
          <boxGeometry args={[0.015, 0.015, 0.015]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
        </mesh>
      </group>
      
      {/* Controller on stand */}
      <mesh position={[0.15, 0.22, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.025, 0.06]} />
        <meshToonMaterial color="#333" />
      </mesh>
      
      {/* TV Frame - nhỏ hơn, facing INTO room */}
      <mesh position={[0, 0.7, 0.08]} castShadow>
        <boxGeometry args={[0.85, 0.55, 0.05]} />
        <meshToonMaterial color={COLORS.pc} />
      </mesh>
      
      {/* TV Bezel */}
      <mesh position={[0, 0.7, 0.11]}>
        <boxGeometry args={[0.78, 0.48, 0.02]} />
        <meshToonMaterial color={COLORS.pcDark} />
      </mesh>
      
      {/* TV Screen with animation */}
      <mesh ref={screenRef} position={[0, 0.7, 0.125]}>
        <planeGeometry args={[0.72, 0.42]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#a855f7"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* App icons on TV */}
      {[[-0.22, 0.06], [-0.07, 0.06], [0.08, 0.06], [0.23, 0.06]].map(([x, y], i) => (
        <mesh key={i} position={[x, 0.7 + y, 0.13]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshBasicMaterial color={['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'][i]} />
        </mesh>
      ))}
      
      {/* TV Stand pole */}
      <mesh position={[0, 0.42, 0.04]} castShadow>
        <boxGeometry args={[0.06, 0.12, 0.06]} />
        <meshToonMaterial color={COLORS.pc} />
      </mesh>
      <mesh position={[0, 0.37, 0.04]} castShadow>
        <boxGeometry args={[0.18, 0.02, 0.12]} />
        <meshToonMaterial color={COLORS.pc} />
      </mesh>
    </group>
  )
}

export default TVSetup
