import { COLORS } from './colors'
import InteractiveObject from './InteractiveObject'
import useStore from '../../store/useStore'

/**
 * WallDecorations - Tranh, poster và decorations trên 2 tường hiển thị
 * 
 * LAYOUT TƯờNG SAU (Z = -3.90), nhìn từ trong phòng:
 * X: -4 --- -2(Window) --- 0(Clock) --- 1(TV) --- 2.8(Shelf) --- 4
 * 
 * LAYOUT TƯờNG TRÁI (X = -3.88), nhìn từ trong phòng:
 * Z: -4 --- -2.5 --- -1 --- 0.5(PlanBoard) --- 1.5(Bed) --- 3 --- 4
 */
function WallDecorations() {
  const stringLightsOn = useStore((state) => state.stringLightsOn)
  const toggleStringLights = useStore((state) => state.toggleStringLights)
  return (
    <group>
      {/* ========================================= */}
      {/* TƯờNG SAU (Z = -3.90) - Back Wall */}
      {/* Đã có: Window(X=-2), Clock(X=0), TV(X=1), Shelf(X=2.8) */}
      {/* => Chỉ đặt ở góc trái xa (X < -3) */}
      {/* ========================================= */}
      
      {/* Small decorative items góc trái - cạnh Window */}
      <group position={[-3.5, 2.2, -3.90]}>
        {/* Small frame */}
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.3, 0.02]} />
          <meshToonMaterial color="#4A3520" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[0.2, 0.25]} />
          <meshBasicMaterial color="#87CEEB" />
        </mesh>
      </group>
      
      {/* ========================================= */}
      {/* TƯỜNG TRÁI (X = -3.88) - Left Wall */}
      {/* Đã có: PlanBoard(Z=0.5), Bed(Z≈1.5) */}
      {/* ========================================= */}
      
      {/* String lights / Fairy lights - CAO trên tường, dọc theo Z (Y=2.6) */}
      <InteractiveObject name="stringlights" onClick={toggleStringLights}>
        <group position={[-3.85, 2.6, 0]}>
          {/* Wire - dây treo ngang theo Z */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.008, 0.008, 3.5]} />
            <meshToonMaterial color="#222" />
          </mesh>
          
          {/* Các bóng đèn treo dọc dây */}
          {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((z, i) => (
            <group key={i} position={[0, 0, z]}>
              {/* Dây treo xuống */}
              <mesh position={[0, -0.06, 0]}>
                <boxGeometry args={[0.003, 0.12, 0.003]} />
                <meshToonMaterial color="#222" />
              </mesh>
              {/* Bóng đèn */}
              <mesh position={[0, -0.14, 0]} castShadow>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshStandardMaterial 
                  color={stringLightsOn ? ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'][i] : '#666'}
                  emissive={stringLightsOn ? ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'][i] : '#000'}
                  emissiveIntensity={stringLightsOn ? 0.8 : 0}
                  toneMapped={false}
                />
              </mesh>
              {/* Ánh sáng nhỏ từ mỗi bóng */}
              {stringLightsOn && (
                <pointLight 
                  position={[0, -0.14, 0]} 
                  intensity={0.15} 
                  distance={0.8} 
                  color={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6'][i]}
                />
              )}
            </group>
          ))}
        </group>
      </InteractiveObject>
      
      {/* Large poster - GÓC SAU TRÁI tường (Z = -3), xa PlanBoard */}
      <InteractiveObject name="poster" panelId="instagram">
        <group position={[-3.88, 1.6, -3]} rotation={[0, Math.PI / 2, 0]}>
          {/* Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.65, 0.03]} />
            <meshToonMaterial color="#4A3520" />
          </mesh>
          {/* Canvas */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.42, 0.57]} />
            <meshToonMaterial color="#1e3a5f" />
          </mesh>
          {/* Abstract art - geometric shapes */}
          <mesh position={[-0.06, 0.1, 0.025]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0.08, -0.06, 0.025]}>
            <planeGeometry args={[0.1, 0.1]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[-0.02, -0.16, 0.025]}>
            <planeGeometry args={[0.14, 0.05]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>
      </InteractiveObject>
      
      {/* Small polaroid - GÓC SAU (Z = -2), giữa poster và PlanBoard */}
      <InteractiveObject name="polaroid1" panelId="playground">
        <group position={[-3.88, 2.2, -1.8]} rotation={[0, Math.PI / 2, 0]}>
          <group rotation={[0, 0, 0.08]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.2, 0.008]} />
              <meshToonMaterial color="#f5f5f0" />
            </mesh>
            <mesh position={[0, 0.018, 0.005]}>
              <planeGeometry args={[0.12, 0.12]} />
              <meshBasicMaterial color="#87CEEB" />
            </mesh>
          </group>
        </group>
      </InteractiveObject>
      
      {/* Another polaroid */}
      <InteractiveObject name="polaroid2" panelId="playground">
        <group position={[-3.88, 2.0, -1.5]} rotation={[0, Math.PI / 2, 0]}>
          <group rotation={[0, 0, -0.1]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 0.2, 0.008]} />
              <meshToonMaterial color="#f5f5f0" />
            </mesh>
            <mesh position={[0, 0.018, 0.005]}>
              <planeGeometry args={[0.12, 0.12]} />
              <meshBasicMaterial color="#fecaca" />
            </mesh>
          </group>
        </group>
      </InteractiveObject>
    </group>
  )
}

export default WallDecorations
