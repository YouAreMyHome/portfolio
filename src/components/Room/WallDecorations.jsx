import { useEffect, useState, memo } from 'react'
import * as THREE from 'three'
import { COLORS } from './colors'
import InteractiveObject from './InteractiveObject'
import DigitalGallery from './DigitalGallery'
import useStore from '../../store/useStore'
import { IMAGES } from '../../data/images'
import { POLAROID_STORIES } from '../../data/polaroidData'
import { emitSound } from '../../utils/eventBus'

/**
 * WallDecorations - Tranh, poster và hệ thống đèn trang trí nghệ thuật trên tường
 * 
 * LAYOUT TƯỜNG SAU (Z = -3.90), nhìn từ trong phòng:
 * X: -4 --- -2(Window) --- 0(Clock) --- 1(TV) --- 2.8(Shelf) --- 4
 * 
 * LAYOUT TƯỜNG TRÁI (X = -3.88), nhìn từ trong phòng:
 * Z: -4 --- -3(DigitalGallery + ArtSconce) --- -2.5 --- -1 --- 0.5(PlanBoard) --- 1.5(Bed) --- 2.6(LightSwitch) --- 4
 */

// ── Shared Flyweight Geometries for Architectural Lighting Suite ──

// Catenary Fairy Lights Cable Curve & Tube
const cableCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, -2.20),
  new THREE.Vector3(0, -0.05, -1.85),
  new THREE.Vector3(0, -0.08, -1.52),
  new THREE.Vector3(0, -0.05, -1.18),
  new THREE.Vector3(0, 0, -0.85),
  new THREE.Vector3(0, -0.05, -0.50),
  new THREE.Vector3(0, -0.08, -0.15),
  new THREE.Vector3(0, -0.05, 0.20),
  new THREE.Vector3(0, 0, 0.55),
  new THREE.Vector3(0, -0.05, 0.90),
  new THREE.Vector3(0, -0.08, 1.25),
  new THREE.Vector3(0, -0.05, 1.60),
  new THREE.Vector3(0, 0, 1.95),
])
const festoonCableGeo = new THREE.TubeGeometry(cableCurve, 64, 0.0022, 6, false)

// Wall Anchor Pegs
const wallPegFlangeGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.005, 12)
const wallPegShaftGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.048, 10)
const wallPegPinGeo = new THREE.SphereGeometry(0.005, 8, 8)

// Edison Bulb Fixtures
const bulbDropCordUnitGeo = new THREE.CylinderGeometry(0.0012, 0.0012, 1, 6)
const bulbCollarGeo = new THREE.CylinderGeometry(0.0075, 0.0075, 0.008, 10)
const bulbSocketGeo = new THREE.CylinderGeometry(0.0095, 0.0085, 0.016, 12)
const bulbFilamentGeo = new THREE.CylinderGeometry(0.0009, 0.0009, 0.022, 6)
const bulbGlassGlobeGeo = new THREE.SphereGeometry(0.022, 16, 14)
const bulbGlassTeardropGeo = new THREE.SphereGeometry(0.020, 16, 14)

// Hanging Keepsakes (Clothespins & Cards)
const clothespinGeo = new THREE.BoxGeometry(0.006, 0.024, 0.008)
const miniPhotoCardGeo = new THREE.BoxGeometry(0.072, 0.092, 0.002)

// Nordic Art Gallery Sconce (Picture Light)
const sconceCanopyGeo = new THREE.CylinderGeometry(0.034, 0.034, 0.012, 16)
const sconceArmGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.16, 8)
const sconceHoodGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.44, 16)
const sconceEndCapGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.012, 12)
const sconceDiffuserGeo = new THREE.BoxGeometry(0.015, 0.003, 0.40)

// Architectural Light Switch
const switchPlateGeo = new THREE.BoxGeometry(0.082, 0.13, 0.012)
const switchWoodGeo = new THREE.BoxGeometry(0.068, 0.116, 0.004)
const switchScrewGeo = new THREE.CylinderGeometry(0.0025, 0.0025, 0.003, 8)
const switchBezelGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.006, 12)
const switchToggleGeo = new THREE.CylinderGeometry(0.003, 0.0045, 0.030, 8)
const switchToggleTipGeo = new THREE.SphereGeometry(0.005, 8, 8)
const switchIndicatorGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.004, 10)

// ── Shared Flyweight Materials ──
const brassHardwareMat = new THREE.MeshStandardMaterial({
  color: '#c5a059',
  metalness: 0.88,
  roughness: 0.26,
})
const turnedOakMat = new THREE.MeshStandardMaterial({
  color: '#9b714f',
  roughness: 0.68,
})
const darkWalnutMat = new THREE.MeshStandardMaterial({
  color: '#2b1b11',
  roughness: 0.72,
})
const braidedCordMat = new THREE.MeshStandardMaterial({
  color: '#1a1f26',
  roughness: 0.85,
})
const matteSlateMat = new THREE.MeshStandardMaterial({
  color: '#1a1e24',
  roughness: 0.42,
  metalness: 0.25,
})
const clothespinMat = new THREE.MeshStandardMaterial({
  color: '#d4b996',
  roughness: 0.75,
})
const kraftPaperMat = new THREE.MeshStandardMaterial({
  color: '#e8dcbe',
  roughness: 0.88,
})

// ── Festoon Lights Layout Data ──
const WALL_PEGS = [
  { z: -2.20 },
  { z: -0.85 },
  { z: 0.55 },
  { z: 1.95 },
]

const BULB_DATA = [
  // Span 1: Peg (-2.20) to Peg (-0.85)
  { z: -1.79, yOffset: -0.058, drop: 0.08, type: 'edison' },
  { z: -1.37, yOffset: -0.072, drop: 0.11, type: 'globe' },
  { z: -0.96, yOffset: -0.015, drop: 0.07, type: 'edison' },

  // Span 2: Peg (-0.85) to Peg (0.55)
  { z: -0.54, yOffset: -0.044, drop: 0.08, type: 'globe' },
  { z: -0.13, yOffset: -0.080, drop: 0.12, type: 'edison' },
  { z: 0.29, yOffset: -0.036, drop: 0.07, type: 'globe' },

  // Span 3: Peg (0.55) to Peg (1.95)
  { z: 0.70, yOffset: -0.016, drop: 0.08, type: 'edison' },
  { z: 1.12, yOffset: -0.074, drop: 0.11, type: 'globe' },
  { z: 1.54, yOffset: -0.058, drop: 0.08, type: 'edison' },
]

const MEMORY_CARDS = [
  { z: -1.05, yOffset: -0.032, tilt: 0.08, type: 'sketch' },
  { z: 0.45, yOffset: -0.022, tilt: -0.06, type: 'polaroid' },
]

/**
 * LightSwitch - Công tắc kiến trúc phong cách Bắc Âu (Architectural Toggle Switch)
 * Thân kim loại đen mờ, ốp gỗ óc chó thủ công, cần gạt đồng thau knurled và vòng LED báo trạng thái
 */
function LightSwitch({ position, isOn, onToggle }) {
  const handleClick = () => {
    emitSound('click')
    if (onToggle) onToggle()
  }

  return (
    <InteractiveObject name="lightswitch" onClick={handleClick}>
      <group position={position} rotation={[0, Math.PI / 2, 0]}>
        {/* Mặt đế kim loại đen mờ cao cấp */}
        <mesh geometry={switchPlateGeo} material={matteSlateMat} />

        {/* Ốp gỗ óc chó sẫm màu thủ công */}
        <mesh position={[0, 0, 0.007]} geometry={switchWoodGeo} material={darkWalnutMat} />

        {/* 4 đinh ốc đồng thau lục giác ở 4 góc */}
        <mesh position={[-0.028, 0.051, 0.009]} rotation={[Math.PI / 2, 0, 0]} geometry={switchScrewGeo} material={brassHardwareMat} />
        <mesh position={[0.028, 0.051, 0.009]} rotation={[Math.PI / 2, 0, 0]} geometry={switchScrewGeo} material={brassHardwareMat} />
        <mesh position={[-0.028, -0.051, 0.009]} rotation={[Math.PI / 2, 0, 0]} geometry={switchScrewGeo} material={brassHardwareMat} />
        <mesh position={[0.028, -0.051, 0.009]} rotation={[Math.PI / 2, 0, 0]} geometry={switchScrewGeo} material={brassHardwareMat} />

        {/* Vành đế đồng thau tiện tròn */}
        <mesh position={[0, 0.008, 0.009]} rotation={[Math.PI / 2, 0, 0]} geometry={switchBezelGeo} material={brassHardwareMat} />

        {/* Cần gạt toggle switch đồng thau (Gạt lên khi BẬT, gạt xuống khi TẮT) */}
        <group position={[0, 0.008, 0.012]} rotation={[isOn ? -0.42 : 0.42, 0, 0]}>
          <mesh position={[0, 0.014, 0.004]} rotation={[0.3, 0, 0]} geometry={switchToggleGeo} material={brassHardwareMat} />
          <mesh position={[0, 0.027, 0.008]} geometry={switchToggleTipGeo} material={brassHardwareMat} />
        </group>

        {/* Đèn chỉ báo vi tinh thể (Xanh ngọc khi bật, hổ phách dịu khi tắt) */}
        <mesh position={[0, -0.038, 0.009]} rotation={[Math.PI / 2, 0, 0]} geometry={switchIndicatorGeo}>
          <meshStandardMaterial
            color={isOn ? '#34d399' : '#f59e0b'}
            emissive={isOn ? '#10b981' : '#d97706'}
            emissiveIntensity={isOn ? 1.6 : 0.8}
            toneMapped={false}
          />
        </mesh>
      </group>
    </InteractiveObject>
  )
}

/**
 * NordicArtSconce - Đèn rọi tranh gắn tường (Architectural Picture Light)
 * Bố trí tinh tế phía trên Khung tranh điện tử Digital Gallery
 */
function NordicArtSconce({ position, isLit }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Nắp gắn tường tròn bằng đồng thau phay xước */}
      <mesh position={[0, 0, 0.006]} rotation={[Math.PI / 2, 0, 0]} geometry={sconceCanopyGeo} material={brassHardwareMat} />

      {/* Cặp tay vươn thanh mảnh vươn ra khỏi tường */}
      <mesh position={[-0.07, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} geometry={sconceArmGeo} material={brassHardwareMat} />
      <mesh position={[0.07, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} geometry={sconceArmGeo} material={brassHardwareMat} />

      {/* Chao đèn hình trụ ngang đen mờ sang trọng */}
      <mesh position={[0, 0, 0.16]} rotation={[0, 0, Math.PI / 2]} geometry={sconceHoodGeo} material={matteSlateMat} />

      {/* Khóa đầu chao đèn bằng đồng thau tiện rãnh */}
      <mesh position={[-0.22, 0, 0.16]} rotation={[0, 0, Math.PI / 2]} geometry={sconceEndCapGeo} material={brassHardwareMat} />
      <mesh position={[0.22, 0, 0.16]} rotation={[0, 0, Math.PI / 2]} geometry={sconceEndCapGeo} material={brassHardwareMat} />

      {/* Tấm tán quang mica mờ ấm áp hướng xuống tranh */}
      <mesh position={[0, -0.012, 0.16]} geometry={sconceDiffuserGeo}>
        <meshStandardMaterial
          color={isLit ? '#fffbeb' : '#f1f5f9'}
          emissive={isLit ? '#fff7ed' : '#000000'}
          emissiveIntensity={isLit ? 1.4 : 0}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Luồng sáng rọi mềm chiếu vào tác phẩm nghệ thuật bên dưới */}
      {isLit && (
        <pointLight
          position={[0, -0.06, 0.18]}
          intensity={0.20}
          distance={1.6}
          decay={2.0}
          color="#fffbeb"
        />
      )}
    </group>
  )
}

/**
 * NordicFestoonLights - Hệ thống đèn dây Edison cổ điển kiểu Bắc Âu
 * Có chốt tiện gỗ sồi, dây bọc dù võng tự nhiên, 9 bóng Edison vintage, kẹp gỗ lưu bút
 */
function NordicFestoonLights({ position, isLit, stringLightsOn, isNight, onToggle }) {
  const handleClick = () => {
    emitSound('click')
    if (onToggle) onToggle()
  }

  return (
    <InteractiveObject name="festoon-lights" onClick={handleClick}>
      <group position={position}>
        {/* Dây bọc dù dệt sợi than củi uốn võng tự nhiên (Seamless Tube Geometry) */}
        <mesh geometry={festoonCableGeo} material={braidedCordMat} />

        {/* 4 Chốt tiện gỗ sồi & đồng cố định vào tường */}
        {WALL_PEGS.map((peg, i) => (
          <group key={`peg-${i}`} position={[0, 0, peg.z]}>
            <mesh position={[-0.038, 0, 0]} rotation={[0, 0, Math.PI / 2]} geometry={wallPegFlangeGeo} material={brassHardwareMat} />
            <mesh position={[-0.014, 0, 0]} rotation={[0, 0, Math.PI / 2]} geometry={wallPegShaftGeo} material={turnedOakMat} />
            <mesh position={[0.012, 0, 0]} geometry={wallPegPinGeo} material={brassHardwareMat} />
          </group>
        ))}

        {/* 9 Bóng đèn sợi đốt Edison phong cách Vintage */}
        {BULB_DATA.map((bulb, i) => {
          const yBase = bulb.yOffset - bulb.drop
          return (
            <group key={`bulb-${i}`}>
              {/* Dây thả kim loại/bọc vải thả xuống */}
              <mesh
                position={[0, bulb.yOffset - bulb.drop / 2, bulb.z]}
                scale={[1, bulb.drop, 1]}
                geometry={bulbDropCordUnitGeo}
                material={braidedCordMat}
              />

              {/* Vòng đệm tiện gỗ óc chó */}
              <mesh position={[0, yBase - 0.004, bulb.z]} geometry={bulbCollarGeo} material={darkWalnutMat} />

              {/* Đui đèn đồng thau phay xước */}
              <mesh position={[0, yBase - 0.014, bulb.z]} geometry={bulbSocketGeo} material={brassHardwareMat} />

              {/* Sợi đốt Vonfram (Tungsten) phát quang rực rỡ */}
              <mesh position={[0, yBase - 0.032, bulb.z]} geometry={bulbFilamentGeo}>
                <meshStandardMaterial
                  color={isLit ? '#fef08a' : '#475569'}
                  emissive={isLit ? '#fbbf24' : '#1e293b'}
                  emissiveIntensity={isLit ? (stringLightsOn ? 2.8 : isNight ? 1.8 : 1.2) : 0.08}
                  toneMapped={false}
                />
              </mesh>

              {/* Vỏ bóng thủy tinh hổ phách ấm áp */}
              <mesh
                position={[0, yBase - 0.032, bulb.z]}
                scale={bulb.type === 'edison' ? [0.9, 1.35, 0.9] : [1, 1, 1]}
                geometry={bulb.type === 'edison' ? bulbGlassTeardropGeo : bulbGlassGlobeGeo}
              >
                <meshStandardMaterial
                  color={isLit ? '#fffdf0' : '#f8fafc'}
                  emissive={isLit ? '#f59e0b' : '#fef3c7'}
                  emissiveIntensity={isLit ? (stringLightsOn ? 0.92 : isNight ? 0.65 : 0.40) : 0.04}
                  roughness={0.12}
                  metalness={0.05}
                  transparent
                  opacity={0.84}
                  toneMapped={false}
                />
              </mesh>
            </group>
          )
        })}

        {/* Kẹp gỗ treo ảnh kỷ niệm & note polaroid mini kẹp trên dây */}
        {MEMORY_CARDS.map((card, i) => (
          <group key={`card-${i}`} position={[0, card.yOffset, card.z]} rotation={[0, 0, card.tilt]}>
            <mesh position={[0, -0.008, 0]} geometry={clothespinGeo} material={clothespinMat} />
            <mesh position={[0.004, -0.055, 0]} geometry={miniPhotoCardGeo} material={kraftPaperMat} />
            <mesh position={[0.006, -0.048, 0]}>
              <circleGeometry args={[0.016, 16]} />
              <meshBasicMaterial color={card.type === 'sketch' ? '#e76f51' : '#2a9d8f'} />
            </mesh>
            <mesh position={[0.006, -0.070, 0]}>
              <planeGeometry args={[0.045, 0.016]} />
              <meshBasicMaterial color="#264653" />
            </mesh>
          </group>
        ))}

        {/* Soft Ambient Fairy Lights Wash - Phủ nhẹ nhàng vào lòng phòng, triệt tiêu hoàn toàn vệt cháy tròn sát tường */}
        {isLit && (
          <pointLight
            position={[0.42, -0.25, 0.0]}
            intensity={stringLightsOn ? 0.30 : 0.16}
            distance={4.2}
            decay={2.0}
            color="#fed7aa"
          />
        )}
      </group>
    </InteractiveObject>
  )
}

const _sharedTextureLoader = new THREE.TextureLoader()
_sharedTextureLoader.setCrossOrigin('anonymous')
const _polaroidTextureCache = new Map()

function useSafeTexture(url) {
  const [texture, setTexture] = useState(() => (url ? _polaroidTextureCache.get(url) || null : null))

  useEffect(() => {
    if (!url) {
      setTexture(null)
      return
    }

    let active = true
    if (_polaroidTextureCache.has(url)) {
      setTexture(_polaroidTextureCache.get(url))
      return
    }

    _sharedTextureLoader.load(
      url,
      (loadedTexture) => {
        if (!active) {
          loadedTexture.dispose()
          return
        }
        loadedTexture.colorSpace = THREE.SRGBColorSpace
        loadedTexture.minFilter = THREE.LinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.generateMipmaps = false
        _polaroidTextureCache.set(url, loadedTexture)
        loadedTexture.needsUpdate = true
        setTexture(loadedTexture)
      },
      undefined,
      (err) => {
        console.warn('[WallDecorations] Failed to load polaroid texture:', url, err)
        if (active) setTexture(null)
      }
    )

    return () => {
      active = false
    }
  }, [url])

  return texture
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
  allImages,
  size = [0.18, 0.18],
  frameSize = [0.22, 0.26],
  frameColor = "#f5f5f0",
  tapeColor = null,
}) {
  const openPolaroid = useStore((state) => state.openPolaroid)
  const texture = useSafeTexture(imagePath)

  const handleClick = () => {
    const gallery = allImages ?? ALL_POLAROIDS
    const idx = gallery.findIndex((item) => (typeof item === 'object' ? item.src : item) === imagePath)
    openPolaroid(gallery, idx < 0 ? 0 : idx)
  }

  const isPolaroidStyle = frameSize[1] > frameSize[0] * 1.1
  const photoOffsetY = isPolaroidStyle ? (frameSize[1] - size[1]) / 3 : 0

  return (
    <InteractiveObject name="polaroid" onClick={handleClick}>
      <group position={position} rotation={rotation}>
        <group rotation={[0, 0, tilt]}>
          {/* Frame */}
          <mesh>
            <boxGeometry args={[frameSize[0], frameSize[1], 0.012]} />
            <meshStandardMaterial color={frameColor} roughness={0.88} />
          </mesh>

          {/* Washi tape trang trí phía trên Polaroid */}
          {tapeColor && (
            <mesh position={[0, frameSize[1] / 2, 0.010]} rotation={[0, 0, tilt * 0.4]}>
              <boxGeometry args={[frameSize[0] * 0.42, 0.024, 0.003]} />
              <meshStandardMaterial
                color={tapeColor}
                roughness={0.65}
                transparent
                opacity={0.92}
              />
            </mesh>
          )}

          {/* Photo area */}
          <mesh position={[0, photoOffsetY, 0.009]}>
            <planeGeometry args={size} />
            {texture ? (
              <meshBasicMaterial
                key={texture.uuid}
                map={texture}
                toneMapped={false}
                side={THREE.DoubleSide}
              />
            ) : (
              <meshBasicMaterial color="#e2e8f0" />
            )}
          </mesh>

          {/* Minimalist modern art graphic if texture is loading or absent */}
          {!texture && (
            <group position={[0, photoOffsetY, 0.01]}>
              <mesh position={[0, 0.025, 0]}>
                <circleGeometry args={[size[0] * 0.28, 24]} />
                <meshBasicMaterial color="#e76f51" />
              </mesh>
              <mesh position={[0, -0.035, 0]}>
                <planeGeometry args={[size[0] * 0.65, size[1] * 0.28]} />
                <meshBasicMaterial color="#264653" />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </InteractiveObject>
  )
}

// Tất cả ảnh polaroid & gallery trong phòng — lightbox có thể di chuyển giữa các ảnh
const ALL_POLAROIDS = POLAROID_STORIES

function WallDecorations() {
  const stringLightsOn = useStore((state) => state.stringLightsOn)
  const toggleStringLights = useStore((state) => state.toggleStringLights)
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isNight = isNightMode || lightingPreset === 'night'
  const isLit = stringLightsOn || isNight || lightingPreset === 'sunset'

  return (
    <group>
      {/* ========================================= */}
      {/* TƯỜNG SAU (Z = -3.90) - Back Wall */}
      {/* ========================================= */}

      {/* Small Frame - Ảnh từ /assets/img/frame1.jpg */}
      <Polaroid
        position={[-3.5, 2.2, -3.88]}
        rotation={[0, 0, 0]}
        tilt={0}
        imagePath={IMAGES.frame1}
        allImages={ALL_POLAROIDS}
        size={[0.2, 0.25]}
        frameSize={[0.25, 0.3]}
        frameColor="#4A3520"
      />

      {/* ========================================= */}
      {/* TƯỜNG TRÁI (X = -3.88) - Left Wall */}
      {/* ========================================= */}

      {/* Light Switch - Công tắc gạt kiến trúc cao cấp */}
      {/* Đặt ngang chiều cao giường, phía đầu giường */}
      <LightSwitch
        position={[-3.88, 0.6, 2.6]}
        isOn={stringLightsOn}
        onToggle={toggleStringLights}
      />

      {/* Nordic Festoon Lights - Đèn dây Edison nghệ thuật Bắc Âu dọc tường trái */}
      <NordicFestoonLights
        position={[-3.84, 2.62, 0]}
        isLit={isLit}
        stringLightsOn={stringLightsOn}
        isNight={isNight}
        onToggle={toggleStringLights}
      />

      {/* Digital Gallery - Khung tranh điện tử tương tác */}
      <DigitalGallery
        position={[-3.88, 1.6, -3]}
        rotation={[0, Math.PI / 2, 0]}
        size={[0.5, 0.65]}
        autoSlide={true}
        slideInterval={8000}
      />

      {/* Nordic Art Sconce - Đèn rọi tranh thanh mảnh phía trên Digital Gallery */}
      <NordicArtSconce
        position={[-3.88, 2.18, -3.0]}
        isLit={isLit}
      />

      {/* Polaroid 1 - Ảnh từ /assets/img/polaroid1.jpg */}
      <Polaroid
        position={[-3.88, 2.22, -1.8]}
        rotation={[0, Math.PI / 2, 0]}
        tilt={0.06}
        imagePath={IMAGES.polaroid1}
        allImages={ALL_POLAROIDS}
        tapeColor="#f6bd60"
      />

      {/* Polaroid 2 - Ảnh từ /assets/img/polaroid2.jpg */}
      <Polaroid
        position={[-3.88, 1.96, -1.45]}
        rotation={[0, Math.PI / 2, 0]}
        tilt={-0.08}
        imagePath={IMAGES.polaroid2}
        allImages={ALL_POLAROIDS}
        tapeColor="#84a59d"
      />
    </group>
  )
}

export default memo(WallDecorations)
