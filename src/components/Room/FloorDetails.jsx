import { COLORS } from './colors'

/**
 * FloorDetails - Các chi tiết nhỏ trên sàn và thảm
 * Tạo cảm giác có người ở thật
 */
function FloorDetails() {
  return (
    <group>
      {/* === Cables from desk === */}
      <group position={[-2, 0.02, -1.5]}>
        {/* Cable 1 */}
        <mesh rotation={[-Math.PI / 2, 0, 0.3]}>
          <boxGeometry args={[0.6, 0.015, 0.015]} />
          <meshToonMaterial color="#333" />
        </mesh>
        {/* Cable 2 */}
        <mesh position={[0.2, 0, 0.1]} rotation={[-Math.PI / 2, 0, -0.2]}>
          <boxGeometry args={[0.4, 0.012, 0.012]} />
          <meshToonMaterial color="#1a1a1a" />
        </mesh>
      </group>
      
      {/* === Items on rug (thảm cao 0.045) === */}
      
      {/* Magazine/book on floor */}
      <group position={[0.6, 0.05, 0.3]} rotation={[0, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 0.015, 0.24]} />
          <meshToonMaterial color="#3b82f6" />
        </mesh>
      </group>
      
      {/* Controller on rug */}
      <mesh position={[0.2, 0.05, 0.8]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.025, 0.06]} />
        <meshToonMaterial color="#2D2D2D" />
      </mesh>
      
      {/* Slippers near bed */}
      <group position={[-2.2, 0.02, 2.8]}>
        {/* Left slipper */}
        <mesh position={[0, 0, 0]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 0.12]} />
          <meshToonMaterial color="#f472b6" />
        </mesh>
        {/* Right slipper */}
        <mesh position={[0.1, 0, 0.05]} rotation={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 0.12]} />
          <meshToonMaterial color="#f472b6" />
        </mesh>
      </group>
      
      {/* Small rug near TV (TV now at X=1, Z=-3.6) */}
      <mesh position={[1, 0.012, -2.8]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.02, 0.45]} />
        <meshToonMaterial color="#d4a574" />
      </mesh>
      
      {/* === Corner details === */}
      
      {/* Backpack near desk */}
      <group position={[-3.2, 0, -1.8]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.25, 0.3, 0.15]} />
          <meshToonMaterial color="#1e3a5f" />
        </mesh>
        {/* Straps */}
        <mesh position={[0.08, 0.25, 0.08]} castShadow>
          <boxGeometry args={[0.03, 0.15, 0.02]} />
          <meshToonMaterial color="#1e3a5f" />
        </mesh>
        <mesh position={[-0.08, 0.25, 0.08]} castShadow>
          <boxGeometry args={[0.03, 0.15, 0.02]} />
          <meshToonMaterial color="#1e3a5f" />
        </mesh>
      </group>
      
      {/* Cardboard box near shelf */}
      <group position={[3.2, 0, -2.8]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.25, 0.2, 0.22]} />
          <meshToonMaterial color="#c9a066" />
        </mesh>
        {/* Box tape */}
        <mesh position={[0, 0.205, 0]}>
          <boxGeometry args={[0.27, 0.01, 0.07]} />
          <meshToonMaterial color="#d4a574" />
        </mesh>
      </group>
    </group>
  )
}

export default FloorDetails
