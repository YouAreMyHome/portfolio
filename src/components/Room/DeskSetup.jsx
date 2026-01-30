import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { COLORS } from './colors'

/**
 * DeskSetup - PC Setup với 2 monitor, keyboard, mouse và accessories
 * Focus Zone: Góc cửa sổ, xoay chéo về camera
 * Projects trigger
 */
function DeskSetup() {
  const cursorRef = useRef()
  
  // Cursor blink animation
  useFrame((state) => {
    if (cursorRef.current) {
      cursorRef.current.visible = Math.sin(state.clock.elapsedTime * 4) > 0
    }
  })
  
  return (
    <group position={[-2.8, 0, -2.5]} rotation={[0, Math.PI / 4, 0]}>
      {/* Desk top */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.08, 1.1]} />
        <meshToonMaterial color={COLORS.desk} />
      </mesh>
      
      {/* Desk edge detail */}
      <mesh position={[0, 0.38, 0.55]} castShadow>
        <boxGeometry args={[2.2, 0.04, 0.02]} />
        <meshToonMaterial color={COLORS.deskDark} />
      </mesh>
      
      {/* Desk drawer section */}
      <mesh position={[0.7, 0.25, 0]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.9]} />
        <meshToonMaterial color={COLORS.desk} />
      </mesh>
      <mesh position={[0.7, 0.25, 0.46]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.02]} />
        <meshToonMaterial color={COLORS.deskDark} />
      </mesh>
      <mesh position={[0.7, 0.25, 0.48]} castShadow>
        <boxGeometry args={[0.15, 0.03, 0.02]} />
        <meshToonMaterial color="#666" />
      </mesh>
      
      {/* Desk legs */}
      {[[-1, -0.45], [-1, 0.45], [0.3, 0.45]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.06]} />
          <meshToonMaterial color={COLORS.deskDark} />
        </mesh>
      ))}
      
      {/* Monitor 1 - Left (Code Editor) */}
      <group position={[-0.45, 0.75, -0.25]}>
        {/* Monitor frame */}
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.45, 0.03]} />
          <meshToonMaterial color={COLORS.pc} />
        </mesh>
        {/* Screen bezel */}
        <mesh position={[0, 0, 0.016]}>
          <boxGeometry args={[0.6, 0.4, 0.01]} />
          <meshToonMaterial color={COLORS.pcDark} />
        </mesh>
        {/* Screen with code */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.55, 0.35]} />
          <meshStandardMaterial 
            color={COLORS.screen} 
            emissive={COLORS.screenGlow}
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Code lines */}
        {[-0.1, -0.03, 0.04, 0.11].map((y, i) => (
          <mesh key={i} position={[-0.1 + i * 0.02, y, 0.025]}>
            <planeGeometry args={[0.25 - i * 0.03, 0.02]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#4ade80' : '#60a5fa'} />
          </mesh>
        ))}
        {/* Blinking cursor */}
        <mesh ref={cursorRef} position={[0.1, -0.05, 0.025]}>
          <planeGeometry args={[0.015, 0.04]} />
          <meshBasicMaterial color="#4ade80" />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.28, 0.08]} castShadow>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshToonMaterial color={COLORS.pc} />
        </mesh>
        <mesh position={[0, -0.33, 0.08]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.12]} />
          <meshToonMaterial color={COLORS.pc} />
        </mesh>
      </group>
      
      {/* Monitor 2 - Right (Browser/Projects) */}
      <group position={[0.35, 0.75, -0.25]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.45, 0.03]} />
          <meshToonMaterial color={COLORS.pc} />
        </mesh>
        <mesh position={[0, 0, 0.016]}>
          <boxGeometry args={[0.6, 0.4, 0.01]} />
          <meshToonMaterial color={COLORS.pcDark} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.55, 0.35]} />
          <meshStandardMaterial 
            color={COLORS.screen} 
            emissive="#60a5fa"
            emissiveIntensity={0.35}
          />
        </mesh>
        {/* App icons grid */}
        {[[-0.12, 0.08], [0, 0.08], [0.12, 0.08], [-0.12, -0.04], [0, -0.04], [0.12, -0.04]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.025]}>
            <planeGeometry args={[0.08, 0.08]} />
            <meshBasicMaterial color={['#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'][i]} />
          </mesh>
        ))}
        <mesh position={[0, -0.28, 0.08]} castShadow>
          <boxGeometry args={[0.06, 0.08, 0.06]} />
          <meshToonMaterial color={COLORS.pc} />
        </mesh>
        <mesh position={[0, -0.33, 0.08]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.12]} />
          <meshToonMaterial color={COLORS.pc} />
        </mesh>
      </group>
      
      {/* Keyboard with keys */}
      <group position={[0, 0.46, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.02, 0.18]} />
          <meshToonMaterial color={COLORS.pc} />
        </mesh>
        {/* Key rows */}
        {[-0.05, 0, 0.05].map((z, row) => (
          [...Array(8)].map((_, col) => (
            <mesh key={`${row}-${col}`} position={[-0.21 + col * 0.06, 0.015, z]}>
              <boxGeometry args={[0.04, 0.01, 0.035]} />
              <meshToonMaterial color="#444" />
            </mesh>
          ))
        ))}
      </group>
      
      {/* Mouse */}
      <mesh position={[0.5, 0.46, 0.2]} castShadow>
        <boxGeometry args={[0.05, 0.025, 0.08]} />
        <meshToonMaterial color={COLORS.pc} />
      </mesh>
      
      {/* Coffee mug */}
      <group position={[-0.9, 0.48, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.08, 8]} />
          <meshToonMaterial color="#e74c3c" />
        </mesh>
        {/* Handle */}
        <mesh position={[0.045, 0, 0]} castShadow>
          <torusGeometry args={[0.02, 0.008, 8, 16, Math.PI]} />
          <meshToonMaterial color="#e74c3c" />
        </mesh>
      </group>
      
      {/* Books stack */}
      <group position={[0.9, 0.52, -0.3]}>
        {[0, 0.04, 0.08].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[0.15, 0.03, 0.2]} />
            <meshToonMaterial color={['#3b82f6', '#22c55e', '#f59e0b'][i]} />
          </mesh>
        ))}
      </group>
      
      {/* Pen holder */}
      <group position={[0.6, 0.48, 0.35]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.025, 0.06, 8]} />
          <meshToonMaterial color="#666" />
        </mesh>
        {/* Pens */}
        {[-0.01, 0.01].map((x, i) => (
          <mesh key={i} position={[x, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />
            <meshToonMaterial color={i === 0 ? '#3b82f6' : '#ef4444'} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default DeskSetup
