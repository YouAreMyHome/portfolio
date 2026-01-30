import { COLORS } from './colors'
import useStore from '../../store/useStore'

/**
 * Window - Cửa sổ với view ngoài trời (tường sau)
 * Theme Toggle trigger - có vệt nắng/ánh trăng chiếu vào phòng
 * Ban ngày: Mặt trời, mây, đồi xanh
 * Ban đêm: Trăng sáng, sao, skyline thành phố
 */
function Window() {
  const isNightMode = useStore((state) => state.isNightMode)
  
  return (
    <group position={[-2, 1.8, -3.90]} rotation={[0, 0, 0]}>
      {/* Window recess / depth in wall */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.4, 1.9, 0.05]} />
        <meshToonMaterial color={isNightMode ? "#0a0a15" : "#1a1a2a"} />
      </mesh>
      
      {/* === SKY BACKGROUND === */}
      <mesh position={[0, 0.1, 0.06]}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshStandardMaterial 
          color={isNightMode ? "#0f1729" : "#87CEEB"} 
          emissive={isNightMode ? "#1a1a3a" : "#87CEEB"}
          emissiveIntensity={isNightMode ? 0.3 : 1.5}
          toneMapped={false}
        />
      </mesh>
      
      {/* === DAY MODE: Sun & Clouds === */}
      {!isNightMode && (
        <>
          {/* Sun glow */}
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
        </>
      )}
      
      {/* === NIGHT MODE: Moon & Stars === */}
      {isNightMode && (
        <>
          {/* Moon - glowing */}
          <mesh position={[-0.25, 0.45, 0.065]}>
            <circleGeometry args={[0.14, 32]} />
            <meshStandardMaterial 
              color="#FFFEF5" 
              emissive="#E8E4D9"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
          
          {/* Moon craters (subtle) */}
          <mesh position={[-0.22, 0.48, 0.066]}>
            <circleGeometry args={[0.025, 16]} />
            <meshBasicMaterial color="#D4D0C5" transparent opacity={0.4} />
          </mesh>
          <mesh position={[-0.28, 0.42, 0.066]}>
            <circleGeometry args={[0.018, 16]} />
            <meshBasicMaterial color="#D4D0C5" transparent opacity={0.3} />
          </mesh>
          <mesh position={[-0.2, 0.4, 0.066]}>
            <circleGeometry args={[0.015, 16]} />
            <meshBasicMaterial color="#D4D0C5" transparent opacity={0.35} />
          </mesh>
          
          {/* Stars */}
          {[
            [0.35, 0.6, 0.025],
            [0.45, 0.35, 0.018],
            [0.2, 0.7, 0.02],
            [-0.45, 0.65, 0.015],
            [0.1, 0.55, 0.012],
            [-0.1, 0.7, 0.018],
            [0.38, 0.2, 0.015],
            [-0.35, 0.25, 0.012],
            [0.5, 0.55, 0.01],
            [-0.5, 0.45, 0.014],
            [0.25, 0.4, 0.01],
            [-0.4, 0.1, 0.012],
          ].map(([x, y, size], i) => (
            <mesh key={i} position={[x, y, 0.067]}>
              <circleGeometry args={[size, 8]} />
              <meshStandardMaterial 
                color="#FFFFFF" 
                emissive="#FFFFFF"
                emissiveIntensity={1.5}
                toneMapped={false}
              />
            </mesh>
          ))}
          
          {/* City skyline silhouette */}
          <group position={[0, -0.55, 0.068]}>
            {/* Buildings */}
            {[
              [-0.5, 0.18, 0.12],
              [-0.35, 0.28, 0.1],
              [-0.22, 0.2, 0.08],
              [-0.1, 0.35, 0.12],
              [0.05, 0.22, 0.1],
              [0.18, 0.3, 0.08],
              [0.28, 0.25, 0.1],
              [0.42, 0.32, 0.12],
              [0.55, 0.2, 0.1],
            ].map(([x, h, w], i) => (
              <mesh key={i} position={[x, h/2 - 0.1, 0]}>
                <planeGeometry args={[w, h]} />
                <meshBasicMaterial color="#0a0a15" />
              </mesh>
            ))}
            
            {/* Building windows (tiny lights) */}
            {[
              [-0.48, 0.02], [-0.52, 0.06],
              [-0.33, 0.08], [-0.37, 0.14],
              [-0.08, 0.1], [-0.12, 0.18], [-0.08, 0.22],
              [0.17, 0.08], [0.19, 0.16],
              [0.4, 0.06], [0.44, 0.14], [0.4, 0.2],
            ].map(([x, y], i) => (
              <mesh key={`light-${i}`} position={[x, y, 0.001]}>
                <planeGeometry args={[0.015, 0.02]} />
                <meshStandardMaterial 
                  color="#FFE4A0" 
                  emissive="#FFD070"
                  emissiveIntensity={0.8}
                />
              </mesh>
            ))}
          </group>
        </>
      )}
      
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
      
      {/* Light beam on floor - ánh sáng/trăng chiếu vào */}
      <mesh 
        position={[-0.15, -1.78, 1.3]} 
        rotation={[-Math.PI / 2, 0, 0.08]}
      >
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial 
          color={isNightMode ? "#B8C4E0" : "#FFFACD"} 
          transparent
          opacity={isNightMode ? 0.08 : 0.15}
          emissive={isNightMode ? "#8090B0" : "#FFD700"}
          emissiveIntensity={isNightMode ? 0.05 : 0.1}
        />
      </mesh>
    </group>
  )
}

export default Window
