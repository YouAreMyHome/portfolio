import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

// Bảng màu lấy từ ảnh Pixel Art mẫu
const PIXEL_CAT_COLORS = {
  furDark: '#4B5563',   // Xám xanh đậm (Lưng/Đầu)
  furLight: '#9CA3AF',  // Xám sáng (Highlight)
  white: '#F3F4F6',     // Trắng (Mõm, Chân, Bụng)
  nose: '#F472B6',      // Hồng (Mũi)
  innerEar: '#FBCFE8',  // Hồng nhạt (Trong tai)
  closedEye: '#1F2937'  // Màu mắt nhắm
}

// Component Zzz bubble
function ZzzBubble({ delay = 0, basePosition = [0, 0, 0] }) {
  const ref = useRef()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime + delay
    if (ref.current) {
      // Float up and fade
      const cycle = (t * 0.5) % 3 // 3 second cycle
      ref.current.position.y = basePosition[1] + cycle * 0.15
      ref.current.position.x = basePosition[0] + Math.sin(t * 2) * 0.02
      
      // Fade in then out
      const opacity = cycle < 0.5 ? cycle * 2 : cycle > 2.5 ? (3 - cycle) * 2 : 1
      ref.current.material.opacity = opacity * 0.8
      
      // Scale up as it rises
      const scale = 0.03 + cycle * 0.01
      ref.current.scale.set(scale, scale, scale)
    }
  })
  
  return (
    <Text
      ref={ref}
      position={basePosition}
      fontSize={1}
      color="#a855f7"
      anchorX="center"
      anchorY="middle"
      material-transparent
      material-opacity={0.8}
    >
      z
    </Text>
  )
}

function Cat(props) {
  const groupRef = useRef()
  const breathRef = useRef()

  // Tạo vật liệu (Materials)
  const materials = useMemo(() => ({
    fur: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.furDark }),
    white: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.white }),
    nose: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.nose }),
    innerEar: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.innerEar }),
    eye: new THREE.MeshBasicMaterial({ color: PIXEL_CAT_COLORS.closedEye }),
  }), [])

  useFrame((state) => {
    // Hiệu ứng thở: Phồng lên xẹp xuống rất chậm
    const t = state.clock.elapsedTime
    if (breathRef.current) {
      breathRef.current.scale.y = 1 + Math.sin(t * 1.5) * 0.03
      breathRef.current.position.y = Math.sin(t * 1.5) * 0.005
    }
  })

  // Hàm render khối hộp pixel nhanh
  const Voxel = ({ position, args, material, rotation = [0, 0, 0] }) => (
    <RoundedBox 
      position={position} 
      args={args} 
      rotation={rotation} 
      radius={0.02} // Bo góc cực nhẹ để bắt sáng đẹp hơn
      smoothness={4} 
      castShadow 
      receiveShadow
    >
      <primitive object={material} />
    </RoundedBox>
  )

  return (
    <group ref={groupRef} {...props}>
      <group ref={breathRef}>
        
        {/* === 1. PHẦN THÂN (BODY) - Nằm cuộn tròn === */}
        <group position={[0, 0.12, -0.1]}>
            {/* Lưng chính */}
            <Voxel position={[0, 0, 0]} args={[0.35, 0.22, 0.4]} material={materials.fur} />
            {/* Phần hông/đùi sau cuộn lại */}
            <Voxel position={[0.18, -0.05, 0.1]} args={[0.1, 0.12, 0.2]} material={materials.fur} />
            {/* Bụng trắng (lấp ló bên dưới) */}
            <Voxel position={[-0.05, -0.08, 0]} args={[0.25, 0.05, 0.3]} material={materials.white} />
        </group>

        {/* === 2. PHẦN ĐẦU (HEAD) === */}
        <group position={[0, 0.16, 0.22]} rotation={[0.1, 0, 0]}> {/* Đầu hơi cúi */}
            {/* Hộp sọ xám */}
            <Voxel position={[0, 0.05, 0]} args={[0.28, 0.24, 0.24]} material={materials.fur} />
            
            {/* Mõm trắng (Đặc trưng của mèo trong ảnh) */}
            <Voxel position={[0, -0.04, 0.13]} args={[0.16, 0.08, 0.04]} material={materials.white} />
            
            {/* Mũi hồng */}
            <Voxel position={[0, -0.02, 0.155]} args={[0.04, 0.03, 0.02]} material={materials.nose} />

            {/* Mắt nhắm (Hai vệt ngang) */}
            <Voxel position={[-0.07, 0.02, 0.125]} args={[0.06, 0.01, 0.01]} rotation={[0, 0, 0.1]} material={materials.eye} />
            <Voxel position={[0.07, 0.02, 0.125]} args={[0.06, 0.01, 0.01]} rotation={[0, 0, -0.1]} material={materials.eye} />

            {/* Tai trái */}
            <group position={[-0.09, 0.18, 0]}>
                <Voxel position={[0, 0, 0]} args={[0.08, 0.08, 0.04]} material={materials.fur} /> {/* Gốc tai */}
                <Voxel position={[0, 0.06, 0]} args={[0.04, 0.04, 0.04]} material={materials.fur} /> {/* Chóp tai */}
                <Voxel position={[0, 0, 0.025]} args={[0.04, 0.04, 0.01]} material={materials.innerEar} /> {/* Trong tai */}
            </group>

            {/* Tai phải */}
            <group position={[0.09, 0.18, 0]}>
                <Voxel position={[0, 0, 0]} args={[0.08, 0.08, 0.04]} material={materials.fur} />
                <Voxel position={[0, 0.06, 0]} args={[0.04, 0.04, 0.04]} material={materials.fur} />
                <Voxel position={[0, 0, 0.025]} args={[0.04, 0.04, 0.01]} material={materials.innerEar} />
            </group>
        </group>

        {/* === 3. CHÂN TRẮNG (PAWS) - Đặt phía trước === */}
        <group position={[0, 0.05, 0.38]}>
            {/* Chân trái */}
            <Voxel position={[-0.06, 0, 0]} args={[0.1, 0.08, 0.12]} material={materials.white} />
            {/* Chân phải */}
            <Voxel position={[0.06, 0, 0]} args={[0.1, 0.08, 0.12]} material={materials.white} />
        </group>

        {/* === 4. ĐUÔI (TAIL) - Cuộn bên hông === */}
        <group position={[0.2, 0.05, -0.1]}>
            {/* Đuôi gồm các đốt nhỏ ghép lại thành đường cong */}
            <Voxel position={[0, 0, 0]} args={[0.06, 0.06, 0.2]} rotation={[0, 0.5, 0]} material={materials.fur} />
            <Voxel position={[0.05, 0, 0.15]} args={[0.06, 0.06, 0.15]} rotation={[0, 1.5, 0]} material={materials.fur} />
             {/* Chóp đuôi trắng (nếu thích giống ảnh) */}
            <Voxel position={[0.02, 0, 0.25]} args={[0.05, 0.05, 0.08]} rotation={[0, 2, 0]} material={materials.white} />
        </group>

      </group>
      
      {/* === 5. BONG BÓNG ZZZ - Hiệu ứng ngủ === */}
      <group position={[0.15, 0.35, 0.25]}>
        <ZzzBubble delay={0} basePosition={[0, 0, 0]} />
        <ZzzBubble delay={1} basePosition={[0.08, 0.05, 0]} />
        <ZzzBubble delay={2} basePosition={[0.16, 0.1, 0]} />
      </group>
    </group>
  )
}

export default Cat