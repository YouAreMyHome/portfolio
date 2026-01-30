import { COLORS } from './colors'

/**
 * Chair - Ghế xoay chi tiết với armrests và wheels
 * Xoay nhẹ 15° tự nhiên
 */
function Chair() {
  return (
    <group position={[-1.8, 0, -1.2]} rotation={[0, Math.PI / 4 + 0.15, 0]}>
      {/* Seat cushion */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshToonMaterial color={COLORS.chair} />
      </mesh>
      
      {/* Seat bottom */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.48, 0.04, 0.48]} />
        <meshToonMaterial color={COLORS.chairDark} />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 0.78, -0.22]} castShadow>
        <boxGeometry args={[0.48, 0.55, 0.08]} />
        <meshToonMaterial color={COLORS.chair} />
      </mesh>
      
      {/* Backrest support */}
      <mesh position={[0, 0.55, -0.18]} castShadow>
        <boxGeometry args={[0.1, 0.15, 0.06]} />
        <meshToonMaterial color={COLORS.chairDark} />
      </mesh>
      
      {/* Armrests */}
      {[-0.28, 0.28].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.55, -0.05]} castShadow>
            <boxGeometry args={[0.04, 0.08, 0.25]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[x, 0.6, -0.05]} castShadow>
            <boxGeometry args={[0.08, 0.02, 0.2]} />
            <meshToonMaterial color={COLORS.chairDark} />
          </mesh>
        </group>
      ))}
      
      {/* Gas lift */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshToonMaterial color="#222" />
      </mesh>
      
      {/* Base star */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 5]} />
        <meshToonMaterial color="#222" />
      </mesh>
      
      {/* Wheels với fake shadow */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        const x = Math.cos(angle) * 0.25
        const z = Math.sin(angle) * 0.25
        return (
          <group key={i}>
            {/* Wheel */}
            <mesh position={[x, 0.025, z]} castShadow>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshToonMaterial color="#111" />
            </mesh>
            {/* Fake contact shadow dưới mỗi bánh xe */}
            <mesh position={[x, 0.003, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.035, 12]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.25} />
            </mesh>
          </group>
        )
      })}
      
      {/* Fake shadow tổng thể dưới ghế */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export default Chair
