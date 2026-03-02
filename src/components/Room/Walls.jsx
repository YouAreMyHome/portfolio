import { COLORS } from './colors'

/**
 * Walls - Tường phòng với chi tiết crown molding và baseboard
 */
function Walls() {
  return (
    <group>
      {/* Back Wall (Z = -4) */}
      <mesh castShadow position={[0, 1.5, -4]}>
        <boxGeometry args={[8, 3, 0.1]} />
        <meshToonMaterial color={COLORS.wall} />
      </mesh>
      
      {/* Left Wall (X = -4) */}
      <mesh castShadow position={[-4, 1.5, 0]}>
        <boxGeometry args={[0.1, 3, 8]} />
        <meshToonMaterial color={COLORS.wallDark} />
      </mesh>
      
      {/* Crown molding - Back */}
      <mesh castShadow position={[0, 2.95, -3.93]}>
        <boxGeometry args={[8, 0.08, 0.08]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Crown molding - Left */}
      <mesh castShadow position={[-3.93, 2.95, 0]}>
        <boxGeometry args={[0.08, 0.08, 8]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Baseboard - Back */}
      <mesh castShadow position={[0, 0.08, -3.93]}>
        <boxGeometry args={[8, 0.15, 0.08]} />
        <meshToonMaterial color="#6B5344" />
      </mesh>
      
      {/* Baseboard - Left */}
      <mesh castShadow position={[-3.93, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.15, 8]} />
        <meshToonMaterial color="#6B5344" />
      </mesh>
    </group>
  )
}

export default Walls
