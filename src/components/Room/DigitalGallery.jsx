import { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import InteractiveObject from './InteractiveObject'

/**
 * DigitalGallery - Khung tranh điện tử tương tác
 * 
 * Features:
 * - Click để chuyển ảnh
 * - Tự động slideshow
 * - Hiệu ứng chuyển ảnh mượt
 * - Phát sáng như màn hình điện tử
 * - Viền LED khi đang active
 * 
 * Để thêm ảnh: chỉ cần copy ảnh vào thư mục public/assets/gallery/
 * Hỗ trợ: jpg, jpeg, png, gif, webp
 */

// Tự động lấy tất cả ảnh từ thư mục gallery (Vite import.meta.glob)
const galleryModules = import.meta.glob('/public/assets/gallery/*.{jpg,jpeg,png,gif,webp}', { 
  eager: true,
  query: '?url',
  import: 'default'
})

// Convert to array of paths (remove /public prefix for runtime)
const GALLERY_IMAGES = Object.keys(galleryModules)
  .sort() // Sắp xếp theo tên file
  .map(path => path.replace('/public', ''))

// Fallback colors nếu không có ảnh
const FALLBACK_COLORS = [
  '#1e3a5f',
  '#2d1b4e', 
  '#1a3d2e',
  '#3d2b1a',
  '#3d1a2b',
]

function DigitalGallery({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  size = [0.5, 0.65],
  autoSlide = true,
  slideInterval = 8000, // 8 giây
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [texturesLoaded, setTexturesLoaded] = useState(false)
  const frameRef = useRef()
  const screenRef = useRef()
  const glowRef = useRef()
  
  // Load textures
  const textures = useTexture(GALLERY_IMAGES, (loadedTextures) => {
    // Configure textures
    const textureArray = Array.isArray(loadedTextures) ? loadedTextures : [loadedTextures]
    textureArray.forEach(tex => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
    })
    setTexturesLoaded(true)
  })
  
  const textureArray = useMemo(() => {
    return Array.isArray(textures) ? textures : [textures]
  }, [textures])
  
  // Auto slideshow
  useEffect(() => {
    if (!autoSlide || !texturesLoaded) return
    
    const interval = setInterval(() => {
      nextImage()
    }, slideInterval)
    
    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, texturesLoaded, currentIndex])
  
  // Chuyển ảnh tiếp theo
  const nextImage = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % textureArray.length)
      setIsTransitioning(false)
    }, 300)
  }
  
  // Animation cho glow effect
  useFrame((state) => {
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9
      glowRef.current.material.opacity = isHovered ? 0.6 : pulse * 0.3
    }
    
    if (screenRef.current) {
      // Slight emissive pulse
      const emissivePulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 + 0.95
      screenRef.current.material.emissiveIntensity = emissivePulse * (isHovered ? 0.5 : 0.3)
    }
  })
  
  const [frameWidth, frameHeight] = size
  const screenWidth = frameWidth - 0.08
  const screenHeight = frameHeight - 0.08
  
  // Get current texture or use fallback
  const currentTexture = texturesLoaded && textureArray[currentIndex] 
    ? textureArray[currentIndex] 
    : null
  
  return (
    <InteractiveObject 
      name="digitalgallery" 
      onClick={nextImage}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <group position={position} rotation={rotation}>
        {/* Frame - Khung màu tối */}
        <mesh ref={frameRef} castShadow>
          <boxGeometry args={[frameWidth, frameHeight, 0.04]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
        
        {/* LED Strip viền - Glowing border */}
        <mesh ref={glowRef} position={[0, 0, 0.021]}>
          <planeGeometry args={[frameWidth - 0.02, frameHeight - 0.02]} />
          <meshBasicMaterial 
            color="#00ffff"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        
        {/* Inner bezel - Viền trong */}
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[screenWidth + 0.02, screenHeight + 0.02, 0.01]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        
        {/* Screen - Màn hình chính */}
        <mesh 
          ref={screenRef} 
          position={[0, 0, 0.03]}
          scale={isTransitioning ? [0.98, 0.98, 1] : [1, 1, 1]}
        >
          <planeGeometry args={[screenWidth, screenHeight]} />
          {currentTexture ? (
            <meshStandardMaterial 
              map={currentTexture}
              emissive="#ffffff"
              emissiveMap={currentTexture}
              emissiveIntensity={0.3}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial 
              color={FALLBACK_COLORS[currentIndex % FALLBACK_COLORS.length]}
              emissive={FALLBACK_COLORS[currentIndex % FALLBACK_COLORS.length]}
              emissiveIntensity={0.3}
              toneMapped={false}
            />
          )}
        </mesh>
        
        {/* Screen reflection overlay */}
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[screenWidth, screenHeight]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={isHovered ? 0.08 : 0.03}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
        
        {/* Navigation indicator dots */}
        <group position={[0, -screenHeight/2 - 0.03, 0.033]}>
          {textureArray.map((_, idx) => (
            <mesh key={idx} position={[(idx - (textureArray.length - 1) / 2) * 0.04, 0, 0]}>
              <circleGeometry args={[0.008, 8]} />
              <meshBasicMaterial 
                color={idx === currentIndex ? '#00ffff' : '#333333'}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
        
        {/* Ambient light from screen */}
        <pointLight 
          position={[0, 0, 0.15]} 
          intensity={isHovered ? 0.4 : 0.2} 
          distance={1.5} 
          color="#87CEEB"
        />
      </group>
    </InteractiveObject>
  )
}

export default DigitalGallery
