import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'

// Bảng màu lấy từ ảnh Pixel Art mẫu
const PIXEL_CAT_COLORS = {
  furDark: '#4B5563',   // Xám xanh đậm (Lưng/Đầu)
  furLight: '#9CA3AF',  // Xám sáng (Highlight)
  white: '#F3F4F6',     // Trắng (Mõm, Chân, Bụng)
  nose: '#F472B6',      // Hồng (Mũi)
  innerEar: '#FBCFE8',  // Hồng nhạt (Trong tai)
  closedEye: '#1F2937'  // Màu mắt nhắm
}

// Component Zzz bubble khi mèo ngủ
function ZzzBubble({ delay = 0, basePosition = [0, 0, 0] }) {
  const ref = useRef()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime + delay
    if (ref.current) {
      const cycle = (t * 0.5) % 3
      ref.current.position.y = basePosition[1] + cycle * 0.16
      ref.current.position.x = basePosition[0] + Math.sin(t * 1.8) * 0.02
      
      const opacity = cycle < 0.4 ? cycle * 2.5 : cycle > 2.4 ? (3 - cycle) * 1.6 : 1
      ref.current.material.opacity = opacity * 0.75
      
      const scale = 0.03 + cycle * 0.012
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
  const bodyRef = useRef()
  const spineRef = useRef()
  const headRef = useRef()
  const leftEarRef = useRef()
  const rightEarRef = useRef()
  const tailBaseRef = useRef()
  const tailMidRef = useRef()
  const tailTipRef = useRef()
  const lastMeowRef = useRef(0)

  const characterAction = useStore((state) => state.characterAction)
  const { playSound } = useSounds()

  const isBeingPet = characterAction === 'petting_cat'

  // Vật liệu tối ưu
  const materials = useMemo(() => ({
    fur: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.furDark, roughness: 0.8 }),
    white: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.white, roughness: 0.75 }),
    nose: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.nose, roughness: 0.4 }),
    innerEar: new THREE.MeshStandardMaterial({ color: PIXEL_CAT_COLORS.innerEar, roughness: 0.5 }),
    eye: new THREE.MeshBasicMaterial({ color: PIXEL_CAT_COLORS.closedEye }),
    happyEye: new THREE.MeshBasicMaterial({ color: '#f43f5e' }),
  }), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (isBeingPet) {
      // ─── CHU KỲ VUỐT VE TƯƠNG TÁC ĐỒNG BỘ (Synced Petting Cycle: T = 2.4s) ───
      const petCycle = (t * 0.416) % 1.0 // 0 -> 1 tương ứng chu kỳ tay người vuốt từ đầu xuống đuôi

      // 1. Phản xạ đầu mèo: Nâng đầu lên dụi vào bàn tay khi tay ở vùng đầu (petCycle < 0.35)
      if (headRef.current) {
        const headNudge = Math.sin(Math.max(0, 1 - petCycle * 2.8) * Math.PI)
        const targetHeadX = -0.22 - headNudge * 0.14
        const targetHeadZ = 0.10 + Math.sin(t * 3.5) * 0.04
        const targetHeadY = Math.sin(t * 2.2) * 0.06

        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetHeadX, delta * 9)
        headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetHeadZ, delta * 8)
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetHeadY, delta * 7)
      }

      // 2. Tai mèo: Cụp nhẹ và giật rung nhè nhẹ khi sướng
      if (leftEarRef.current && rightEarRef.current) {
        const earTwitch = Math.sin(t * 14.0) * 0.03
        leftEarRef.current.rotation.z = THREE.MathUtils.lerp(leftEarRef.current.rotation.z, -0.15 + earTwitch, delta * 8)
        rightEarRef.current.rotation.z = THREE.MathUtils.lerp(rightEarRef.current.rotation.z, 0.15 - earTwitch, delta * 8)
      }

      // 3. Phản xạ cột sống (Spine Arch Wave): Lưng mèo gồ lên đón bàn tay vuốt qua (petCycle 0.2 -> 0.75)
      if (spineRef.current) {
        const spineWave = Math.sin(Math.max(0, Math.min(1, (petCycle - 0.15) / 0.55)) * Math.PI)
        const targetSpineY = spineWave * 0.038
        const targetSpineRotX = Math.sin(petCycle * Math.PI * 2) * 0.06
        spineRef.current.position.y = THREE.MathUtils.lerp(spineRef.current.position.y, targetSpineY, delta * 9)
        spineRef.current.rotation.x = THREE.MathUtils.lerp(spineRef.current.rotation.x, targetSpineRotX, delta * 8)
      }

      // 4. Đuôi mèo: Chuyển động sóng uốn lượn 3 tầng (Multi-harmonic serpentine wave)
      const tailWave1 = Math.sin(t * 4.5)
      const tailWave2 = Math.cos(t * 4.5)
      if (tailBaseRef.current) {
        tailBaseRef.current.rotation.y = THREE.MathUtils.lerp(tailBaseRef.current.rotation.y, tailWave1 * 0.45, delta * 10)
        tailBaseRef.current.rotation.x = THREE.MathUtils.lerp(tailBaseRef.current.rotation.x, -0.32 + tailWave2 * 0.12, delta * 8)
      }
      if (tailMidRef.current) {
        tailMidRef.current.rotation.y = THREE.MathUtils.lerp(tailMidRef.current.rotation.y, Math.sin(t * 4.5 + 0.8) * 0.5, delta * 12)
        tailMidRef.current.rotation.z = THREE.MathUtils.lerp(tailMidRef.current.rotation.z, Math.cos(t * 4.5) * 0.25, delta * 10)
      }
      if (tailTipRef.current) {
        tailTipRef.current.rotation.y = THREE.MathUtils.lerp(tailTipRef.current.rotation.y, Math.sin(t * 4.5 + 1.6) * 0.65, delta * 14)
      }

      // 5. Tiếng gừ gừ (Purring resonance): rung lồng ngực tần số cao biên độ cực nhỏ
      if (breathRef.current) {
        const purrVibe = Math.sin(t * 26.0) * 0.012
        breathRef.current.scale.y = 1 + purrVibe + Math.sin(t * 3.0) * 0.02
        breathRef.current.position.y = Math.sin(t * 26.0) * 0.002
      }

      // 6. Phát tiếng meow ngọt ngào chu kỳ ~5s
      const now = Date.now()
      if (now - lastMeowRef.current > 4800) {
        lastMeowRef.current = now
        playSound('meow')
      }
    } else {
      // ─── TRẠNG THÁI NẰM NGỦ BÌNH YÊN (Resting / Sleeping) ───
      if (headRef.current) {
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0.08, delta * 4)
        headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0, delta * 4)
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, delta * 4)
      }
      if (leftEarRef.current && rightEarRef.current) {
        leftEarRef.current.rotation.z = THREE.MathUtils.lerp(leftEarRef.current.rotation.z, 0, delta * 4)
        rightEarRef.current.rotation.z = THREE.MathUtils.lerp(rightEarRef.current.rotation.z, 0, delta * 4)
      }
      if (spineRef.current) {
        spineRef.current.position.y = THREE.MathUtils.lerp(spineRef.current.position.y, 0, delta * 5)
        spineRef.current.rotation.x = THREE.MathUtils.lerp(spineRef.current.rotation.x, 0, delta * 5)
      }
      if (tailBaseRef.current) {
        tailBaseRef.current.rotation.y = THREE.MathUtils.lerp(tailBaseRef.current.rotation.y, Math.sin(t * 1.0) * 0.08, delta * 3)
        tailBaseRef.current.rotation.x = THREE.MathUtils.lerp(tailBaseRef.current.rotation.x, 0, delta * 4)
      }
      if (tailMidRef.current) {
        tailMidRef.current.rotation.y = THREE.MathUtils.lerp(tailMidRef.current.rotation.y, 0, delta * 4)
        tailMidRef.current.rotation.z = THREE.MathUtils.lerp(tailMidRef.current.rotation.z, 0, delta * 4)
      }
      if (tailTipRef.current) {
        tailTipRef.current.rotation.y = THREE.MathUtils.lerp(tailTipRef.current.rotation.y, 0, delta * 4)
      }
      if (breathRef.current) {
        breathRef.current.scale.y = 1 + Math.sin(t * 1.6) * 0.035
        breathRef.current.position.y = Math.sin(t * 1.6) * 0.004
      }
    }
  })

  // Hàm render khối hộp pixel nhanh
  const Voxel = ({ position, args, material, rotation = [0, 0, 0] }) => (
    <RoundedBox 
      position={position} 
      args={args} 
      rotation={rotation} 
      radius={0.02}
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
        
        {/* === 1. PHẦN THÂN (BODY) - Nằm cuộn tròn có khớp sống lưng linh hoạt === */}
        <group ref={bodyRef} position={[0, 0.12, -0.1]}>
          <group ref={spineRef}>
            {/* Lưng & Khung thân chính */}
            <Voxel position={[0, 0, 0]} args={[0.35, 0.22, 0.4]} material={materials.fur} />
            <Voxel position={[0.18, -0.05, 0.1]} args={[0.1, 0.12, 0.2]} material={materials.fur} />
            {/* Bụng trắng */}
            <Voxel position={[-0.05, -0.08, 0]} args={[0.25, 0.05, 0.3]} material={materials.white} />
          </group>
        </group>

        {/* === 2. PHẦN ĐẦU (HEAD) - Tương tác ngước lên dụi tay === */}
        <group ref={headRef} position={[0, 0.16, 0.22]} rotation={[0.08, 0, 0]}>
            <Voxel position={[0, 0.05, 0]} args={[0.28, 0.24, 0.24]} material={materials.fur} />
            <Voxel position={[0, -0.04, 0.13]} args={[0.16, 0.08, 0.04]} material={materials.white} />
            <Voxel position={[0, -0.02, 0.155]} args={[0.04, 0.03, 0.02]} material={materials.nose} />

            {/* Mắt mèo: Cong hình cánh cung vui sướng khi được vuốt ve */}
            {isBeingPet ? (
              <>
                <Voxel position={[-0.07, 0.025, 0.126]} args={[0.055, 0.015, 0.01]} rotation={[0, 0, 0.25]} material={materials.happyEye} />
                <Voxel position={[ 0.07, 0.025, 0.126]} args={[0.055, 0.015, 0.01]} rotation={[0, 0, -0.25]} material={materials.happyEye} />
              </>
            ) : (
              <>
                <Voxel position={[-0.07, 0.02, 0.125]} args={[0.06, 0.01, 0.01]} rotation={[0, 0, 0.1]} material={materials.eye} />
                <Voxel position={[ 0.07, 0.02, 0.125]} args={[0.06, 0.01, 0.01]} rotation={[0, 0, -0.1]} material={materials.eye} />
              </>
            )}

            {/* Tai trái có khớp rung */}
            <group ref={leftEarRef} position={[-0.09, 0.18, 0]}>
                <Voxel position={[0, 0, 0]} args={[0.08, 0.08, 0.04]} material={materials.fur} />
                <Voxel position={[0, 0.06, 0]} args={[0.04, 0.04, 0.04]} material={materials.fur} />
                <Voxel position={[0, 0, 0.025]} args={[0.04, 0.04, 0.01]} material={materials.innerEar} />
            </group>

            {/* Tai phải có khớp rung */}
            <group ref={rightEarRef} position={[0.09, 0.18, 0]}>
                <Voxel position={[0, 0, 0]} args={[0.08, 0.08, 0.04]} material={materials.fur} />
                <Voxel position={[0, 0.06, 0]} args={[0.04, 0.04, 0.04]} material={materials.fur} />
                <Voxel position={[0, 0, 0.025]} args={[0.04, 0.04, 0.01]} material={materials.innerEar} />
            </group>
        </group>

        {/* === 3. CHÂN TRẮNG (PAWS) === */}
        <group position={[0, 0.05, 0.38]}>
            <Voxel position={[-0.06, 0, 0]} args={[0.1, 0.08, 0.12]} material={materials.white} />
            <Voxel position={[ 0.06, 0, 0]} args={[0.1, 0.08, 0.12]} material={materials.white} />
        </group>

        {/* === 4. ĐUÔI (TAIL) - Khớp nối 3 tầng uốn lượn mềm mại === */}
        <group ref={tailBaseRef} position={[0.2, 0.05, -0.1]}>
            <Voxel position={[0, 0, 0]} args={[0.06, 0.06, 0.14]} rotation={[0, 0.4, 0]} material={materials.fur} />
            <group ref={tailMidRef} position={[0.04, 0.01, 0.11]}>
              <Voxel position={[0, 0, 0]} args={[0.055, 0.055, 0.14]} rotation={[0, 0.8, 0]} material={materials.fur} />
              <group ref={tailTipRef} position={[0.03, 0.01, 0.10]}>
                <Voxel position={[0, 0, 0]} args={[0.05, 0.05, 0.09]} rotation={[0, 0.9, 0]} material={materials.white} />
              </group>
            </group>
        </group>

      </group>
      
      {/* === 5. HIỆU ỨNG TƯƠNG TÁC (Zzz khi ngủ, Trái tim ♥ & Nốt nhạc ♪ khi được vuốt ve) === */}
      {isBeingPet ? (
        <group position={[0.05, 0.42, 0.2]}>
          <PurrFloatingEffects />
        </group>
      ) : (
        <group position={[0.15, 0.35, 0.25]}>
          <ZzzBubble delay={0} basePosition={[0, 0, 0]} />
          <ZzzBubble delay={1} basePosition={[0.08, 0.05, 0]} />
          <ZzzBubble delay={2} basePosition={[0.16, 0.1, 0]} />
        </group>
      )}
    </group>
  )
}

// Hiệu ứng trái tim và nốt nhạc bay lên uyển chuyển khi được vuốt ve
function PurrFloatingEffects() {
  const pRef1 = useRef()
  const pRef2 = useRef()
  const pRef3 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pRef1.current) {
      const c = (t * 0.75) % 2.0
      pRef1.current.position.y = c * 0.28
      pRef1.current.position.x = Math.sin(t * 2.8) * 0.05
      pRef1.current.material.opacity = c < 0.35 ? c * 2.8 : (2.0 - c) * 0.65
      const s = 0.05 + c * 0.025
      pRef1.current.scale.set(s, s, s)
    }
    if (pRef2.current) {
      const c = (t * 0.75 + 0.9) % 2.0
      pRef2.current.position.y = c * 0.28
      pRef2.current.position.x = -0.06 + Math.cos(t * 2.8) * 0.05
      pRef2.current.material.opacity = c < 0.35 ? c * 2.8 : (2.0 - c) * 0.65
      const s = 0.045 + c * 0.022
      pRef2.current.scale.set(s, s, s)
    }
    if (pRef3.current) {
      const c = (t * 0.75 + 1.45) % 2.0
      pRef3.current.position.y = c * 0.30
      pRef3.current.position.x = 0.04 + Math.sin(t * 3.2 + 1.0) * 0.04
      pRef3.current.material.opacity = c < 0.35 ? c * 2.8 : (2.0 - c) * 0.65
      const s = 0.04 + c * 0.02
      pRef3.current.scale.set(s, s, s)
    }
  })

  return (
    <>
      <Text ref={pRef1} fontSize={1} color="#f43f5e" anchorX="center" anchorY="middle" material-transparent material-opacity={0}>
        ♥
      </Text>
      <Text ref={pRef2} fontSize={1.1} color="#fb7185" anchorX="center" anchorY="middle" material-transparent material-opacity={0}>
        ♪
      </Text>
      <Text ref={pRef3} fontSize={0.9} color="#ec4899" anchorX="center" anchorY="middle" material-transparent material-opacity={0}>
        ♥
      </Text>
    </>
  )
}

export default Cat