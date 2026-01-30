import { COLORS } from './colors'

/**
 * PlanBoard - Bảng kế hoạch (Skills & Exp) với avatar và code lines
 * Skills trigger
 */
function PlanBoard() {
  return (
    <group position={[-3.88, 1.8, 0.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.9, 0.05]} />
        <meshToonMaterial color="#3D2914" />
      </mesh>
      
      {/* Board inner frame */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1, 0.8, 0.02]} />
        <meshToonMaterial color="#4A3520" />
      </mesh>
      
      {/* Board surface - dark for code */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.95, 0.75]} />
        <meshStandardMaterial 
          color="#1e293b"
          emissive="#22c55e"
          emissiveIntensity={0.12}
        />
      </mesh>
      
      {/* Avatar pixel art */}
      <group position={[-0.25, 0.15, 0.04]}>
        {/* Head */}
        <mesh>
          <boxGeometry args={[0.12, 0.12, 0.01]} />
          <meshBasicMaterial color="#F5D0C5" />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.05, 0.005]}>
          <boxGeometry args={[0.13, 0.06, 0.01]} />
          <meshBasicMaterial color="#4A3520" />
        </mesh>
        {/* Body */}
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.14, 0.12, 0.01]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
      </group>
      
      {/* Code lines on board */}
      {[-0.05, 0.03, 0.11, 0.19].map((y, i) => (
        <mesh key={i} position={[0.15, y - 0.1, 0.04]}>
          <planeGeometry args={[0.4 - i * 0.05, 0.03]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#4ade80' : '#60a5fa'} />
        </mesh>
      ))}
      
      {/* Heart icon */}
      <mesh position={[0.35, 0.3, 0.04]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      
      {/* Sticky notes - colorful */}
      {[
        [-0.35, -0.2, '#fbbf24'],
        [-0.2, -0.25, '#f472b6'],
        [0.3, -0.2, '#4ade80'],
        [0.15, -0.28, '#60a5fa'],
      ].map(([x, y, color], i) => (
        <mesh key={i} position={[x, y, 0.04]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshToonMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

export default PlanBoard
