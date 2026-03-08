import { useTexture } from '@react-three/drei'
import { COLORS } from './colors'
import InteractiveObject from './InteractiveObject'
import DigitalGallery from './DigitalGallery'
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

/**
 * LightSwitch - Công tắc đèn treo tường
 * Click để bật/tắt String Lights
 */
function LightSwitch({ position, isOn, onToggle }) {
  return (
    <InteractiveObject name="lightswitch" onClick={onToggle}>
      <group position={position} rotation={[0, Math.PI / 2, 0]}>
        {/* Backplate - Mặt nền công tắc */}
        <mesh>
          <boxGeometry args={[0.08, 0.12, 0.015]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
        </mesh>
        
        {/* Viền */}
        <mesh position={[0, 0, 0.008]}>
          <boxGeometry args={[0.065, 0.105, 0.003]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.4} />
        </mesh>
        
        {/* Switch toggle area */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.04, 0.07, 0.008]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.5} />
        </mesh>
        
        {/* Toggle switch - nghiêng lên/xuống tùy trạng thái */}
        <group position={[0, 0, 0.018]} rotation={[isOn ? -0.4 : 0.4, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.025, 0.04, 0.012]} />
            <meshStandardMaterial 
              color={isOn ? '#4ade80' : '#94a3b8'} 
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        </group>
        
        {/* Indicator light nhỏ */}
        <mesh position={[0, -0.045, 0.012]}>
          <sphereGeometry args={[0.006, 8, 8]} />
          <meshStandardMaterial 
            color={isOn ? '#22c55e' : '#334155'}
            emissive={isOn ? '#22c55e' : '#000000'}
            emissiveIntensity={isOn ? 1 : 0}
            toneMapped={false}
          />
        </mesh>
        
        {/* Glow when on */}
        {isOn && (
          <pointLight 
            position={[0, 0, 0.05]} 
            intensity={0.1} 
            distance={0.3} 
            color="#22c55e"
          />
        )}
      </group>
    </InteractiveObject>
  )
}

/**
 * Polaroid - Ảnh polaroid/frame treo tường
 * Click để phóng to xem ảnh
 */
function Polaroid({ 
  position, 
  rotation = [0, 0, 0], 
  tilt = 0, 
  imagePath,
  allImages,          // full gallery array — for lightbox navigation
  size = [0.14, 0.14],        // Kích thước ảnh [width, height]
  frameSize = [0.18, 0.22],   // Kích thước frame [width, height]
  frameColor = "#f5f5f0"      // Màu frame
}) {
  const openPolaroid = useStore((state) => state.openPolaroid)
  const texture = useTexture(imagePath)
  
  const handleClick = () => {
    const gallery = allImages ?? [imagePath]
    const idx     = gallery.indexOf(imagePath)
    openPolaroid(gallery, idx < 0 ? 0 : idx)
  }
  
  // Tính offset Y cho ảnh trong frame (polaroid style có phần trắng dưới)
  const isPolaroidStyle = frameSize[1] > frameSize[0] * 1.1
  const photoOffsetY = isPolaroidStyle ? 0.015 : 0
  
  return (
    <InteractiveObject name="polaroid" onClick={handleClick}>
      <group position={position} rotation={rotation}>
        <group rotation={[0, 0, tilt]}>
          {/* Frame */}
          <mesh castShadow>
            <boxGeometry args={[frameSize[0], frameSize[1], 0.012]} />
            <meshStandardMaterial color={frameColor} roughness={0.9} />
          </mesh>
          {/* Photo area */}
          <mesh position={[0, photoOffsetY, 0.007]}>
            <planeGeometry args={size} />
            <meshBasicMaterial map={texture} />
          </mesh>
        </group>
      </group>
    </InteractiveObject>
  )
}

// Tất cả ảnh polaroid trong phòng — lightbox có thể di chuyển giữa các ảnh
const ALL_POLAROIDS = [
  '/assets/img/polaroid1.jpg',
  '/assets/img/polaroid2.jpg',
  '/assets/img/frame1.jpg',
]

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
      
      {/* Small Frame - Ảnh từ /assets/img/frame1.jpg */}
      <Polaroid 
        position={[-3.5, 2.2, -3.88]}
        rotation={[0, 0, 0]}
        tilt={0}
        imagePath="/assets/img/frame1.jpg"
        allImages={ALL_POLAROIDS}
        size={[0.2, 0.25]}
        frameSize={[0.25, 0.3]}
        frameColor="#4A3520"
      />
      
      {/* ========================================= */}
      {/* TƯỜNG TRÁI (X = -3.88) - Left Wall */}
      {/* Đã có: PlanBoard(Z=0.5), Bed(Z≈1.5) */}
      {/* ========================================= */}
      
      {/* Light Switch - Công tắc bật/tắt String Lights */}
      {/* Đặt ngang chiều cao giường, bên trái giường (phía đầu giường) */}
      <LightSwitch 
        position={[-3.88, 0.6, 2.6]} 
        isOn={stringLightsOn} 
        onToggle={toggleStringLights} 
      />
      
      {/* String lights / Fairy lights - CAO trên tường, dọc theo Z (Y=2.6) */}
      <group>
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
      </group>
      
      {/* Digital Gallery - Khung tranh điện tử tương tác */}
      {/* GÓC SAU TRÁI tường (Z = -3), xa PlanBoard */}
      <DigitalGallery 
        position={[-3.88, 1.6, -3]} 
        rotation={[0, Math.PI / 2, 0]}
        size={[0.5, 0.65]}
        autoSlide={true}
        slideInterval={8000}
      />
      
      {/* Polaroid 1 - Ảnh từ /assets/img/polaroid1.jpg */}
      <Polaroid 
        position={[-3.88, 2.2, -1.8]}
        rotation={[0, Math.PI / 2, 0]}
        tilt={0.08}
        imagePath="/assets/img/polaroid1.jpg"
        allImages={ALL_POLAROIDS}
      />
      
      {/* Polaroid 2 - Ảnh từ /assets/img/polaroid2.jpg */}
      <Polaroid 
        position={[-3.88, 2.0, -1.5]}
        rotation={[0, Math.PI / 2, 0]}
        tilt={-0.1}
        imagePath="/assets/img/polaroid2.jpg"
        allImages={ALL_POLAROIDS}
      />
    </group>
  )
}

export default WallDecorations
