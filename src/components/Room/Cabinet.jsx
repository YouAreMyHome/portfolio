import { COLORS } from './colors'

/**
 * Cabinet - Tủ ngăn kéo góc tường phải
 */
function Cabinet() {
  return (
    <group position={[3.2, 0, -3.2]}>
      {/* Main cabinet frame */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.85, 1.05, 0.55]} />
        <meshToonMaterial color={COLORS.cabinet} />
      </mesh>
      
      {/* Cabinet top */}
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[0.9, 0.03, 0.6]} />
        <meshToonMaterial color="#D4A060" />
      </mesh>
      
      {/* Decorative items on top */}
      <group position={[0, 1.07, 0]}>
        {/* Small plant */}
        <mesh position={[-0.25, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.1, 6]} />
          <meshToonMaterial color="#D2691E" />
        </mesh>
        <mesh position={[-0.25, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshToonMaterial color={COLORS.plant} />
        </mesh>
        
        {/* Photo frame */}
        <mesh position={[0.2, 0.08, 0]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.15, 0.02]} />
          <meshToonMaterial color="#5A4A3A" />
        </mesh>
        <mesh position={[0.2, 0.08, 0.012]} rotation={[0, 0.2, 0]}>
          <planeGeometry args={[0.09, 0.12]} />
          <meshBasicMaterial color="#87CEEB" />
        </mesh>
      </group>
      
      {/* Cabinet legs */}
      {[[-0.35, -0.2], [0.35, -0.2], [-0.35, 0.2], [0.35, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.03, z]} castShadow>
          <boxGeometry args={[0.05, 0.06, 0.05]} />
          <meshToonMaterial color="#8B6914" />
        </mesh>
      ))}
      
      {/* Drawers with different sizes */}
      {[
        { y: 0.18, h: 0.22 },
        { y: 0.48, h: 0.22 },
        { y: 0.78, h: 0.22 }
      ].map(({ y, h }, i) => (
        <group key={i}>
          {/* Drawer front */}
          <mesh position={[0, y, 0.28]}>
            <boxGeometry args={[0.73, h, 0.02]} />
            <meshToonMaterial color="#B8954C" />
          </mesh>
          {/* Drawer groove */}
          <mesh position={[0, y, 0.29]}>
            <boxGeometry args={[0.65, h - 0.06, 0.01]} />
            <meshToonMaterial color="#A8854C" />
          </mesh>
          {/* Handle */}
          <mesh position={[0, y, 0.3]}>
            <boxGeometry args={[0.18, 0.025, 0.02]} />
            <meshToonMaterial color="#C9A066" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default Cabinet
