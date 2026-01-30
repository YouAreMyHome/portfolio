import { COLORS } from './colors'

/**
 * Shelf - Kệ sách trên tường sau (bên phải cửa sổ)
 */
function Shelf() {
  return (
    <group position={[2.8, 2, -3.90]}>
      {/* Shelf board - thu nhỏ lại */}
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.05, 0.25]} />
        <meshToonMaterial color={COLORS.desk} />
      </mesh>
      
      {/* Shelf edge detail */}
      <mesh position={[0, -0.02, 0.11]}>
        <boxGeometry args={[1.0, 0.02, 0.02]} />
        <meshToonMaterial color={COLORS.deskDark} />
      </mesh>
      
      {/* Brackets */}
      {[-0.38, 0.38].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.08, -0.08]} castShadow>
            <boxGeometry args={[0.04, 0.12, 0.04]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[x, -0.12, 0]} castShadow>
            <boxGeometry args={[0.04, 0.04, 0.15]} />
            <meshToonMaterial color="#333" />
          </mesh>
        </group>
      ))}
      
      {/* Books with varied styles */}
      {[
        { x: -0.35, w: 0.07, h: 0.18, color: '#e74c3c' },
        { x: -0.26, w: 0.05, h: 0.15, color: '#3498db' },
        { x: -0.18, w: 0.08, h: 0.2, color: '#2ecc71' },
        { x: -0.08, w: 0.06, h: 0.16, color: '#9b59b6' },
        { x: 0.0, w: 0.07, h: 0.17, color: '#f39c12' },
        { x: 0.09, w: 0.06, h: 0.14, color: '#1abc9c' },
      ].map(({ x, w, h, color }, i) => (
        <mesh key={i} position={[x, 0.025 + h/2, 0]} castShadow>
          <boxGeometry args={[w, h, 0.14]} />
          <meshToonMaterial color={color} />
        </mesh>
      ))}
      
      {/* Leaning book */}
      <mesh position={[0.22, 0.08, 0.02]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.06, 0.16, 0.12]} />
        <meshToonMaterial color="#34495e" />
      </mesh>
      
      {/* Small trophy/figurine */}
      <mesh position={[0.38, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.028, 0.06, 8]} />
        <meshToonMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.38, 0.11, 0]} castShadow>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshToonMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}

export default Shelf
