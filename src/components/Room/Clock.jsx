import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { COLORS } from './colors'

/**
 * Clock - Đồng hồ treo tường với kim chuyển động
 */
function Clock() {
  const secondHandRef = useRef()
  const minuteHandRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = -t * 0.5
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -t * 0.02
    }
  })
  
  return (
    <group position={[0, 2.3, -3.90]} rotation={[0, 0, 0]}>
      {/* Frame - outer ring */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 24]} />
        <meshToonMaterial color="#8B4513" />
      </mesh>
      
      {/* Inner frame ring */}
      <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 24]} />
        <meshToonMaterial color="#6B3410" />
      </mesh>
      
      {/* Face - mặt đồng hồ trắng */}
      <mesh position={[0, 0, 0.035]}>
        <circleGeometry args={[0.24, 24]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
        const r = 0.18
        return (
          <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0.04]}>
            <circleGeometry args={[i % 3 === 0 ? 0.018 : 0.008, 8]} />
            <meshBasicMaterial color="#333" />
          </mesh>
        )
      })}
      
      {/* Center dot */}
      <mesh position={[0, 0, 0.045]}>
        <circleGeometry args={[0.012, 8]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      
      {/* Hour hand - ngắn và dày */}
      <group position={[0, 0, 0.05]} ref={minuteHandRef}>
        <mesh position={[0, 0.035, 0]}>
          <boxGeometry args={[0.018, 0.08, 0.008]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      </group>
      
      {/* Second hand - dài và mỏng, màu đỏ */}
      <group position={[0, 0, 0.055]} ref={secondHandRef}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.006]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  )
}

export default Clock
