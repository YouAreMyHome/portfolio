import { COLORS } from './colors'

/**
 * Floor - Sàn gỗ chi tiết với wood planks và thảm
 */
function Floor() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshToonMaterial color={COLORS.floor} />
      </mesh>
      
      {/* Wood planks pattern - detailed */}
      {[...Array(16)].map((_, i) => (
        <mesh 
          key={i}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0.002, -3.75 + i * 0.5]}
        >
          <planeGeometry args={[8, 0.02]} />
          <meshToonMaterial color={COLORS.floorDark} />
        </mesh>
      ))}
      
      {/* Rug with border - giữa phòng - DÙNG BOX để có độ dày */}
      <group position={[0, 0, 0.3]}>
        {/* Rug base - có độ dày */}
        <mesh position={[0, 0.015, 0]} receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.03, 2.7]} />
          <meshToonMaterial color="#5BA3C0" />
        </mesh>
        {/* Rug inner layer */}
        <mesh position={[0, 0.032, 0]}>
          <boxGeometry args={[2.8, 0.01, 2.3]} />
          <meshToonMaterial color="#87CEEB" />
        </mesh>
        {/* Rug pattern center */}
        <mesh position={[0, 0.038, 0]}>
          <boxGeometry args={[2, 0.008, 1.5]} />
          <meshToonMaterial color="#A5D8E8" />
        </mesh>
      </group>
    </group>
  )
}

export default Floor
