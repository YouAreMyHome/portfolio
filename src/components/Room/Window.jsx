import { COLORS } from './colors'

/**
 * Window - Cửa sổ với view ngoài trời (tường sau)
 * Theme Toggle trigger - có vệt nắng chiếu vào phòng
 * Khung dày chunky theo phong cách Pixel Art
 */
function Window() {
  return (
    <group position={[-2, 1.8, -3.90]} rotation={[0, 0, 0]}>
      {/* Window recess / depth in wall */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.4, 1.9, 0.05]} />
        <meshToonMaterial color="#1a1a2a" />
      </mesh>
      
      {/* Sky background - PHÁT SÁNG MẠNH với Bloom */}
      <mesh position={[0, 0.1, 0.06]}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          emissive="#87CEEB"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      
      {/* Sun glow - rất sáng để Bloom catch */}
      <mesh position={[0.3, 0.5, 0.065]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial 
          color="#FFFEF0" 
          emissive="#FFD700"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      
      {/* Clouds */}
      <mesh position={[-0.25, 0.4, 0.07]}>
        <planeGeometry args={[0.3, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.05, 0.6, 0.07]}>
        <planeGeometry args={[0.25, 0.08]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.12, 0.5, 0.07]}>
        <planeGeometry args={[0.18, 0.07]} />
        <meshBasicMaterial color="#f8f8f8" />
      </mesh>
      
      {/* Distant hills/trees */}
      <group position={[0, -0.3, 0.07]}>
        {[[-0.4, 0.2], [-0.18, 0.28], [0.05, 0.22], [0.25, 0.32], [0.45, 0.24]].map(([x, h], i) => (
          <mesh key={i} position={[x, h/2 - 0.2, 0]}>
            <planeGeometry args={[0.22, h]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#7BC47F" : "#8FD694"} />
          </mesh>
        ))}
      </group>
      
      {/* === WINDOW FRAME - DÀY HƠN, CHUNKY PIXEL STYLE === */}
      {/* Top frame */}
      <mesh position={[0, 0.88, 0.1]} castShadow>
        <boxGeometry args={[1.5, 0.18, 0.12]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[0, -0.88, 0.1]} castShadow>
        <boxGeometry args={[1.5, 0.18, 0.12]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      {/* Left frame */}
      <mesh position={[-0.66, 0, 0.1]} castShadow>
        <boxGeometry args={[0.18, 1.58, 0.12]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      {/* Right frame */}
      <mesh position={[0.66, 0, 0.1]} castShadow>
        <boxGeometry args={[0.18, 1.58, 0.12]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Window cross bars - cũng dày hơn */}
      <mesh position={[0, 0, 0.13]}>
        <boxGeometry args={[1.14, 0.06, 0.04]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <boxGeometry args={[0.06, 1.58, 0.04]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Window sill - dày và nhô ra */}
      <mesh position={[0, -1.0, 0.2]} castShadow>
        <boxGeometry args={[1.7, 0.1, 0.28]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Tiny plant on sill */}
      <mesh position={[0.45, -0.85, 0.26]} castShadow>
        <cylinderGeometry args={[0.045, 0.035, 0.06, 8]} />
        <meshToonMaterial color="#d4a574" />
      </mesh>
      <mesh position={[0.45, -0.78, 0.26]} castShadow>
        <sphereGeometry args={[0.055, 8, 8]} />
        <meshToonMaterial color={COLORS.plant} />
      </mesh>
      
      {/* Light beam on floor - bóng khung cửa sổ */}
      <mesh 
        position={[-0.15, -1.78, 1.3]} 
        rotation={[-Math.PI / 2, 0, 0.08]}
      >
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial 
          color="#FFFACD" 
          transparent
          opacity={0.15}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}

export default Window
