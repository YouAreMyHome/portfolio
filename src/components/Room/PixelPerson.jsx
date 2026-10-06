import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import { useSounds } from '../../utils/useSounds'
import useStore from '../../store/useStore'

// ─── Curated High-End Aesthetic Palette (Japandi / Streetwear Developer) ────────
const C = {
  // Hair & Brows – layered espresso & obsidian
  hairDeep:     '#18181B',
  hairBase:     '#24201D',
  hairMid:      '#362E28',
  hairLight:    '#4A3F37',

  // Skin tones – warm, healthy, glowing tone
  skin:         '#E5A377',
  skinSoft:     '#EDA97F',
  skinShadow:   '#CB885E',
  skinEar:      '#D68E63',
  lip:          '#C96B5B',
  blush:        '#FB7185',

  // Eyes – deep expressive sapphire anime aesthetic
  eyeWhite:     '#FDFEFE',
  eyeShadow:    '#E2E8F0',
  eyeRim:       '#0F172A',
  eyeIrisTop:   '#1E293B',
  eyeIrisMid:   '#2563EB',
  eyeIrisLight: '#38BDF8',
  eyeHighlight: '#FFFFFF',

  // Inner shirt – organic cotton off-white / oat milk
  shirtCream:   '#F8F6F0',
  shirtRib:     '#ECE6DA',
  shirtShadow:  '#DDD5C5',

  // Outer Flannel – Premium French Navy & Royal Indigo check
  flannelNavy:  '#1E3A8A',
  flannelBlue:  '#2563EB',
  flannelDark:  '#172554',
  flannelSlate: '#334155',
  flannelOat:   '#E2D9C8',
  buttonSilver: '#94A3B8',
  penSilver:    '#CBD5E1',

  // Pants – Selvedge indigo raw denim
  pantsDenim:   '#223249',
  pantsDark:    '#172230',
  pantsCuff:    '#4B5E76',
  beltLeather:  '#3E2723',
  beltBuckle:   '#D4AF37',

  // Retro High-Top Sneakers (Air Jordan 1 Chicago / Royal Aesthetic)
  shoeSoleWhite:'#FFFFFF',
  shoeMidsole:  '#F1F5F9',
  shoeBlack:    '#0F172A',
  shoeRed:      '#DC2626',
  shoeLace:     '#FFFFFF',
}

// ─── Scenario Configurations (Sáng, Chiều, Mưa, Đêm) ───────────────────────────
const SCENARIOS = {
  morning: {
    position: [0.75, 0.007, 0.65],
    rotationY: 0.15,
    greetingKey: 'scenario.morning.greet',
    dialogues: [
      'scenario.morning.m0',
      'scenario.morning.m1',
      'scenario.morning.m2',
      'scenario.morning.m3',
    ],
    sound: 'charHappy',
    expression: 'happy',
  },
  sunset: {
    position: [0.82, 0.007, 0.50],
    rotationY: -Math.PI * 0.50, // Kneeling beside Cat at [0.3, 0.007, 0.5]
    greetingKey: 'scenario.sunset.greet',
    dialogues: [
      'scenario.sunset.m0',
      'scenario.sunset.m1',
      'scenario.sunset.m2',
      'scenario.sunset.m3',
    ],
    sound: 'meow',
    expression: 'happy',
  },
  rainy: {
    position: [-0.85, 0.007, -2.15],
    rotationY: -Math.PI * 0.78, // Facing directly at Window at [-2, 1.8, -3.9] clear of desk
    greetingKey: 'scenario.rainy.greet',
    dialogues: [
      'scenario.rainy.m0',
      'scenario.rainy.m1',
      'scenario.rainy.m2',
      'scenario.rainy.m3',
    ],
    sound: 'charPop',
    expression: 'neutral',
  },
  night: {
    bedsidePos: [-2.05, 0.007, 1.55],
    bedsideRotY: Math.PI * 0.5,
    bedSleepPos: [-2.585, 0.455, 1.86],
    bedSleepRot: [-Math.PI / 2, 0, Math.PI / 2],
    greetingKey: 'scenario.night.greet',
    dialogues: [
      'scenario.night.m0',
      'scenario.night.m1',
      'scenario.night.m2',
      'scenario.night.m3',
    ],
    sound: 'charTired',
    expression: 'sleeping',
  },
}

// Cache vật liệu chia sẻ (Flyweight pattern)
const _voxelMatCache = new Map()
function getVoxelMaterial(color, roughness = 0.65, metalness = 0.04, transparent = false, opacity = 1) {
  const key = `${color}_${roughness}_${metalness}_${transparent}_${opacity}`
  let mat = _voxelMatCache.get(key)
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      transparent,
      opacity,
    })
    _voxelMatCache.set(key, mat)
  }
  return mat
}

// ─── Reusable Optimized Voxel Helper ──────────────────────────────────────────
function Voxel({
  position = [0, 0, 0],
  args = [0.1, 0.1, 0.1],
  color = '#FFFFFF',
  rotation = [0, 0, 0],
  radius = 0.008,
  smoothness = 2,
  roughness = 0.65,
  metalness = 0.04,
  transparent = false,
  opacity = 1,
  castShadow = false,
  receiveShadow = false,
}) {
  const material = getVoxelMaterial(color, roughness, metalness, transparent, opacity)

  if (radius && radius > 0.02) {
    return (
      <RoundedBox
        position={position}
        args={args}
        rotation={rotation}
        radius={radius}
        smoothness={smoothness}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={material}
      />
    )
  }

  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      material={material}
    >
      <boxGeometry args={args} />
    </mesh>
  )
}

// ─── Intelligent Speech Bubble (Auto Camera-Oriented via Billboard) ────────────
function SpeechBubble({ visible, message }) {
  const bubbleRef = useRef()
  const floatRef  = useRef()
  const scaleRef  = useRef(0)

  useFrame((state, delta) => {
    if (!bubbleRef.current) return

    const target = visible ? 1 : 0
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 12)
    const s = scaleRef.current
    bubbleRef.current.scale.set(s, s, s)
    bubbleRef.current.visible = s > 0.005

    if (floatRef.current && s > 0.005) {
      floatRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 0.018
    }
  })

  const borderMat   = { color: '#2B2520', roughness: 0.5, metalness: 0.08 }
  const fillMat     = { color: '#FFFDF7', roughness: 0.25, metalness: 0.02 }
  const shadowMat   = { color: '#0C0A09', transparent: true, opacity: 0.22, roughness: 1 }
  const glossMat    = { color: '#FFFFFF', transparent: true, opacity: 0.55, roughness: 0.05 }
  const warmLineMat = { color: '#D4B996', transparent: true, opacity: 0.35, roughness: 0.5 }

  return (
    <Billboard position={[0, 1.55, 0.08]} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group ref={bubbleRef} scale={0} frustumCulled={false}>
        <group ref={floatRef}>
          {/* Soft Drop Shadow */}
          <RoundedBox args={[1.36, 0.82, 0.03]} radius={0.12} smoothness={3} position={[0.025, -0.025, -0.04]}>
            <meshStandardMaterial {...shadowMat} />
          </RoundedBox>

          {/* Outer Border Layer */}
          <RoundedBox args={[1.32, 0.78, 0.09]} radius={0.11} smoothness={3} position={[0, 0, 0]}>
            <meshStandardMaterial {...borderMat} />
          </RoundedBox>

          {/* Inner Cream Bubble Body */}
          <RoundedBox args={[1.24, 0.70, 0.085]} radius={0.09} smoothness={3} position={[0, 0, 0.008]}>
            <meshStandardMaterial {...fillMat} />
          </RoundedBox>

          {/* Top Gloss Highlight Strip */}
          <RoundedBox args={[0.58, 0.045, 0.015]} radius={0.02} smoothness={2} position={[-0.15, 0.265, 0.055]}>
            <meshStandardMaterial {...glossMat} />
          </RoundedBox>
          <RoundedBox args={[0.08, 0.035, 0.015]} radius={0.015} smoothness={2} position={[-0.48, 0.255, 0.055]}>
            <meshStandardMaterial {...glossMat} />
          </RoundedBox>

          {/* Subtle Bottom Warm Shadow Line */}
          <RoundedBox args={[1.0, 0.035, 0.01]} radius={0.016} smoothness={2} position={[0, -0.275, 0.053]}>
            <meshStandardMaterial {...warmLineMat} />
          </RoundedBox>

          {/* Tail */}
          <RoundedBox args={[0.16, 0.14, 0.075]} radius={0.025} smoothness={2} position={[0.18, -0.42, 0.002]} rotation={[0, 0, -0.42]}>
            <meshStandardMaterial {...borderMat} />
          </RoundedBox>
          <RoundedBox args={[0.13, 0.11, 0.07]} radius={0.02} smoothness={2} position={[0.18, -0.42, 0.009]} rotation={[0, 0, -0.42]}>
            <meshStandardMaterial {...fillMat} />
          </RoundedBox>

          {/* Crisp Text */}
          <Text
            renderOrder={105}
            position={[0, 0.012, 0.06]}
            fontSize={0.08}
            color="#241B12"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.08}
            lineHeight={1.45}
            letterSpacing={0.006}
            overflowWrap="break-word"
            material-depthTest={false}
            material-depthWrite={false}
          >
            {message}
          </Text>
        </group>
      </group>
    </Billboard>
  )
}

// ─── Refined Eyes with Catchlight Speculars ─────────────────────────────────────
function Eye({ side, expression, isBlinking }) {
  const x = side === 'left' ? -0.062 : 0.062
  const eyeWidth = 0.054
  const eyeHeight = 0.058
  const baseZ = 0.114

  if (isBlinking) {
    return (
      <group position={[x, 0.905, baseZ + 0.003]}>
        <Voxel args={[eyeWidth + 0.01, 0.014, 0.008]} color={C.eyeRim} radius={0.004} />
        <Voxel position={[0, -0.01, -0.002]} args={[eyeWidth, 0.024, 0.006]} color={C.skinShadow} radius={0.003} />
      </group>
    )
  }

  if (expression === 'sleeping') {
    return (
      <group position={[x, 0.900, baseZ + 0.003]}>
        {/* Vòng cung lông mi nhắm mắt ngủ bình yên */}
        <Voxel position={[0, 0.008, 0.002]} args={[eyeWidth + 0.008, 0.014, 0.008]} color={C.eyeRim} radius={0.005} />
        {/* Đuôi mí mắt uốn cong thanh thoát */}
        <Voxel
          position={[side === 'left' ? -0.024 : 0.024, 0.014, 0.002]}
          args={[0.012, 0.012, 0.008]}
          color={C.eyeRim}
          radius={0.004}
        />
        {/* Nếp gấp mí mắt ngủ êm đềm */}
        <Voxel position={[0, 0.022, 0.001]} args={[eyeWidth * 0.8, 0.008, 0.006]} color={C.skinShadow} radius={0.003} />
        {/* Bóng mờ mắt thư giãn */}
        <Voxel position={[0, -0.008, -0.001]} args={[eyeWidth, 0.016, 0.006]} color={C.skinShadow} opacity={0.4} transparent radius={0.003} />
        {/* Má ửng hồng ngủ say ấm áp */}
        <Voxel position={[0, -0.018, -0.001]} args={[eyeWidth * 0.9, 0.014, 0.006]} color={C.blush} opacity={0.65} transparent radius={0.004} />
      </group>
    )
  }

  if (expression === 'happy') {
    return (
      <group position={[x, 0.905, baseZ + 0.003]}>
        <Voxel position={[0, 0.01, 0]} args={[eyeWidth + 0.008, 0.016, 0.008]} color={C.eyeRim} radius={0.005} />
        <Voxel position={[side === 'left' ? -0.024 : 0.024, 0.002, 0]} args={[0.012, 0.018, 0.008]} color={C.eyeRim} radius={0.004} />
        <Voxel position={[side === 'left' ? 0.024 : -0.024, 0.002, 0]} args={[0.012, 0.018, 0.008]} color={C.eyeRim} radius={0.004} />
        <Voxel position={[0, -0.012, -0.001]} args={[eyeWidth * 0.8, 0.014, 0.006]} color={C.blush} opacity={0.65} transparent radius={0.003} />
      </group>
    )
  }

  if (expression === 'tired') {
    return (
      <group position={[x, 0.903, baseZ]}>
        <Voxel position={[0, 0.014, 0.004]} args={[eyeWidth + 0.008, 0.026, 0.008]} color={C.skinShadow} radius={0.003} />
        <Voxel position={[0, 0.024, 0.005]} args={[eyeWidth + 0.01, 0.012, 0.008]} color={C.eyeRim} radius={0.004} />
        <Voxel position={[0, -0.008, 0.001]} args={[eyeWidth, 0.034, 0.006]} color={C.eyeWhite} radius={0.004} />
        <Voxel position={[0, -0.008, 0.003]} args={[0.032, 0.026, 0.006]} color={C.eyeIrisTop} radius={0.003} />
        <Voxel position={[side === 'left' ? 0.007 : -0.007, -0.006, 0.005]} args={[0.009, 0.009, 0.004]} color={C.eyeHighlight} radius={0.002} />
      </group>
    )
  }

  return (
    <group position={[x, 0.905, baseZ]}>
      <Voxel position={[0, 0.028, 0.003]} args={[eyeWidth + 0.006, 0.012, 0.007]} color={C.eyeRim} radius={0.004} />
      <Voxel position={[0, 0, 0.001]} args={[eyeWidth, eyeHeight, 0.006]} color={C.eyeWhite} radius={0.004} />
      <Voxel position={[0, 0.018, 0.002]} args={[eyeWidth, 0.012, 0.006]} color={C.eyeShadow} opacity={0.6} transparent radius={0.002} />
      <Voxel position={[0, -0.002, 0.003]} args={[0.036, 0.044, 0.006]} color={C.eyeIrisTop} radius={0.004} />
      <Voxel position={[0, -0.012, 0.004]} args={[0.032, 0.020, 0.006]} color={C.eyeIrisMid} radius={0.003} />
      <Voxel position={[0, -0.018, 0.004]} args={[0.022, 0.008, 0.006]} color={C.eyeIrisLight} radius={0.002} />
      <Voxel position={[-0.008, 0.009, 0.006]} args={[0.013, 0.013, 0.005]} color={C.eyeHighlight} radius={0.003} />
      <Voxel position={[0.009, -0.013, 0.006]} args={[0.007, 0.007, 0.004]} color={C.eyeHighlight} radius={0.002} />
    </group>
  )
}

// ─── Eyebrows ──────────────────────────────────────────────────────────────────
function Eyebrow({ side, expression }) {
  const x = side === 'left' ? -0.062 : 0.062
  const z = 0.116
  let y = 0.948
  let rotZ = 0
  let width = 0.052

  if (expression === 'happy') {
    y = 0.954
    rotZ = side === 'left' ? -0.08 : 0.08
  } else if (expression === 'tired') {
    y = 0.944
    rotZ = side === 'left' ? -0.18 : 0.18
  } else if (expression === 'sleeping') {
    y = 0.942
    rotZ = side === 'left' ? 0.02 : -0.02
  }

  return (
    <group position={[x, y, z]} rotation={[0, 0, rotZ]}>
      <Voxel args={[width, 0.013, 0.007]} color={C.hairDeep} radius={0.004} />
      <Voxel
        position={[side === 'left' ? -0.018 : 0.018, 0.003, 0]}
        args={[0.018, 0.011, 0.007]}
        color={C.hairDeep}
        radius={0.003}
      />
    </group>
  )
}

// ─── Mouth & Facial Extras (Blush, Smile) ──────────────────────────────────────
function MouthAndFeatures({ expression }) {
  const z = 0.116

  if (expression === 'sleeping') {
    return (
      <group>
        <Voxel position={[-0.096, 0.875, z - 0.001]} args={[0.046, 0.022, 0.005]} color={C.blush} opacity={0.65} transparent radius={0.006} />
        <Voxel position={[ 0.096, 0.875, z - 0.001]} args={[0.046, 0.022, 0.005]} color={C.blush} opacity={0.65} transparent radius={0.006} />
        <Voxel position={[0, 0.838, z]} args={[0.042, 0.010, 0.006]} color={C.lip} radius={0.003} />
      </group>
    )
  }

  if (expression === 'happy') {
    return (
      <group>
        <Voxel position={[-0.096, 0.884, z - 0.001]} args={[0.046, 0.024, 0.005]} color={C.blush} opacity={0.75} transparent radius={0.006} />
        <Voxel position={[ 0.096, 0.884, z - 0.001]} args={[0.046, 0.024, 0.005]} color={C.blush} opacity={0.75} transparent radius={0.006} />
        <Voxel position={[0, 0.842, z]} args={[0.064, 0.024, 0.007]} color={C.eyeRim} radius={0.005} />
        <Voxel position={[0, 0.849, z + 0.002]} args={[0.048, 0.009, 0.005]} color="#FFFFFF" radius={0.003} />
        <Voxel position={[0, 0.837, z + 0.002]} args={[0.040, 0.010, 0.005]} color={C.lip} radius={0.003} />
      </group>
    )
  }

  if (expression === 'tired') {
    return (
      <group>
        <Voxel position={[0, 0.842, z]} args={[0.048, 0.012, 0.006]} color={C.skinShadow} radius={0.004} />
        <Voxel position={[-0.022, 0.838, z]} args={[0.012, 0.014, 0.006]} color={C.skinShadow} radius={0.003} />
        <Voxel position={[0.105, 0.942, z]} args={[0.018, 0.028, 0.007]} color="#38BDF8" opacity={0.85} transparent radius={0.005} />
      </group>
    )
  }

  return (
    <group>
      <Voxel position={[-0.094, 0.880, z - 0.001]} args={[0.040, 0.020, 0.005]} color={C.blush} opacity={0.45} transparent radius={0.005} />
      <Voxel position={[ 0.094, 0.880, z - 0.001]} args={[0.040, 0.020, 0.005]} color={C.blush} opacity={0.45} transparent radius={0.005} />
      <Voxel position={[0.004, 0.842, z]} args={[0.052, 0.013, 0.006]} color={C.lip} radius={0.004} />
      <Voxel position={[0.028, 0.846, z]} args={[0.012, 0.016, 0.006]} color={C.lip} radius={0.003} />
    </group>
  )
}

// ─── Nose & 3D Ears ────────────────────────────────────────────────────────────
function NoseAndEars() {
  return (
    <group>
      <Voxel position={[0, 0.874, 0.117]} args={[0.022, 0.028, 0.014]} color={C.skinShadow} radius={0.005} />
      <Voxel position={[0, 0.866, 0.121]} args={[0.026, 0.018, 0.016]} color={C.skin} radius={0.005} />

      {/* Left Ear */}
      <group position={[-0.122, 0.898, 0.006]}>
        <Voxel args={[0.024, 0.068, 0.052]} color={C.skin} radius={0.006} />
        <Voxel position={[-0.004, 0.002, 0.004]} args={[0.018, 0.044, 0.032]} color={C.skinEar} radius={0.004} />
      </group>

      {/* Right Ear */}
      <group position={[0.122, 0.898, 0.006]}>
        <Voxel args={[0.024, 0.068, 0.052]} color={C.skin} radius={0.006} />
        <Voxel position={[0.004, 0.002, 0.004]} args={[0.018, 0.044, 0.032]} color={C.skinEar} radius={0.004} />
      </group>
    </group>
  )
}

// ─── Head Component ────────────────────────────────────────────────────────────
function Head({ expression = 'neutral', isBlinking = false }) {
  return (
    <group>
      <Voxel position={[0, 0.895, 0.006]} args={[0.224, 0.222, 0.212]} color={C.skin} radius={0.022} />
      <Voxel position={[0, 0.804, 0.024]} args={[0.165, 0.045, 0.155]} color={C.skin} radius={0.014} />
      <Voxel position={[0, 0.758, 0.008]} args={[0.095, 0.068, 0.095]} color={C.skinShadow} radius={0.012} />

      <NoseAndEars />
      <Eye side="left"  expression={expression} isBlinking={isBlinking} />
      <Eye side="right" expression={expression} isBlinking={isBlinking} />
      <Eyebrow side="left"  expression={expression} />
      <Eyebrow side="right" expression={expression} />
      <MouthAndFeatures expression={expression} />
    </group>
  )
}

// ─── Layered Aesthetic Haircut ─────────────────────────────────────────────────
function Hair() {
  return (
    <group>
      <Voxel position={[0, 1.012, 0.008]} args={[0.234, 0.068, 0.220]} color={C.hairDeep} radius={0.02} />
      <Voxel position={[-0.01, 1.036, 0.046]} args={[0.208, 0.054, 0.142]} color={C.hairBase} radius={0.018} />
      <Voxel position={[-0.04, 1.054, 0.058]} args={[0.132, 0.038, 0.108]} color={C.hairMid} radius={0.016} />
      <Voxel position={[-0.02, 1.066, 0.064]} args={[0.078, 0.024, 0.068]} color={C.hairLight} radius={0.012} />

      <Voxel position={[-0.064, 0.978, 0.106]} args={[0.076, 0.052, 0.032]} color={C.hairDeep} radius={0.01} />
      <Voxel position={[ 0.012, 0.984, 0.108]} args={[0.086, 0.044, 0.030]} color={C.hairBase} radius={0.01} />
      <Voxel position={[ 0.076, 0.990, 0.104]} args={[0.054, 0.036, 0.028]} color={C.hairDeep} radius={0.01} />
      <Voxel position={[-0.032, 0.962, 0.114]} args={[0.036, 0.028, 0.018]} color={C.hairMid} radius={0.008} />

      <Voxel position={[-0.118, 0.966, 0.008]} args={[0.034, 0.115, 0.205]} color={C.hairDeep} radius={0.012} />
      <Voxel position={[-0.120, 0.925, 0.032]} args={[0.022, 0.054, 0.048]} color={C.hairBase} radius={0.008} />
      <Voxel position={[ 0.118, 0.966, 0.008]} args={[0.034, 0.115, 0.205]} color={C.hairDeep} radius={0.012} />
      <Voxel position={[ 0.120, 0.925, 0.032]} args={[0.022, 0.054, 0.048]} color={C.hairBase} radius={0.008} />

      <Voxel position={[0, 0.952, -0.104]} args={[0.222, 0.145, 0.034]} color={C.hairDeep} radius={0.014} />
      <Voxel position={[0, 0.875, -0.098]} args={[0.182, 0.065, 0.028]} color={C.hairBase} radius={0.01} />
    </group>
  )
}

// ─── Torso (Layered Flannel Overshirt + Ribbed Tee + Lapel Collar) ──────────────
function Torso() {
  return (
    <group>
      <Voxel position={[0, 0.582, 0.002]} args={[0.198, 0.245, 0.134]} color={C.shirtCream} radius={0.012} />
      <Voxel position={[0, 0.708, 0.015]} args={[0.125, 0.028, 0.105]} color={C.shirtRib} radius={0.008} />

      <Voxel position={[-0.088, 0.578, 0.012]} args={[0.058, 0.248, 0.136]} color={C.flannelNavy} radius={0.014} />
      <Voxel position={[-0.088, 0.635, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[-0.088, 0.525, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[-0.088, 0.580, 0.015]} args={[0.059, 0.009, 0.138]} color={C.flannelOat} opacity={0.8} transparent radius={0.004} />

      <Voxel position={[ 0.088, 0.578, 0.012]} args={[0.058, 0.248, 0.136]} color={C.flannelBlue} radius={0.014} />
      <Voxel position={[ 0.088, 0.635, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[ 0.088, 0.525, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[ 0.088, 0.580, 0.015]} args={[0.059, 0.009, 0.138]} color={C.flannelOat} opacity={0.8} transparent radius={0.004} />

      <Voxel position={[0, 0.578, -0.068]} args={[0.226, 0.248, 0.024]} color={C.flannelNavy} radius={0.012} />
      <Voxel position={[0, 0.635, -0.069]} args={[0.227, 0.026, 0.025]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[0, 0.525, -0.069]} args={[0.227, 0.026, 0.025]} color={C.flannelDark} radius={0.008} />

      <Voxel
        position={[-0.068, 0.704, 0.052]}
        args={[0.058, 0.046, 0.085]}
        color={C.flannelNavy}
        rotation={[0.28, 0.18, 0.12]}
        radius={0.008}
      />
      <Voxel
        position={[ 0.068, 0.704, 0.052]}
        args={[0.058, 0.046, 0.085]}
        color={C.flannelNavy}
        rotation={[0.28, -0.18, -0.12]}
        radius={0.008}
      />

      <Voxel position={[-0.085, 0.605, 0.082]} args={[0.042, 0.048, 0.010]} color={C.flannelDark} radius={0.004} />
      <Voxel position={[-0.082, 0.622, 0.088]} args={[0.008, 0.028, 0.006]} color={C.penSilver} metalness={0.85} roughness={0.2} radius={0.002} />

      <Voxel position={[0, 0.448, 0.002]} args={[0.218, 0.038, 0.136]} color={C.beltLeather} radius={0.006} />
      <Voxel position={[0, 0.448, 0.071]} args={[0.042, 0.032, 0.008]} color={C.beltBuckle} metalness={0.8} roughness={0.25} radius={0.004} />

      {/* Selvedge Denim Pelvis / Hips (Đũng & hông quần jeans liền mạch) */}
      <Voxel position={[0, 0.412, 0.002]} args={[0.212, 0.046, 0.134]} color={C.pantsDenim} radius={0.010} />
      <Voxel position={[0, 0.386, 0.002]} args={[0.188, 0.032, 0.124]} color={C.pantsDark} radius={0.008} />
    </group>
  )
}

// ─── Arms with Shoulder Joints, Articulated Elbows & Rolled Cuffs ─────────────
function Arm({ side, activePreset, forearmRef }) {
  const isLeft = side === 'left'
  const x = isLeft ? -0.158 : 0.158
  const baseColor = isLeft ? C.flannelNavy : C.flannelBlue

  return (
    <group position={[x, 0, 0]}>
      {/* Shoulder Cap Pivot at Y = 0.672 */}
      <Voxel position={[0, 0.672, 0]} args={[0.074, 0.068, 0.118]} color={baseColor} radius={0.016} />

      {/* Upper Arm Sleeve */}
      <Voxel position={[0, 0.585, 0]} args={[0.068, 0.138, 0.108]} color={baseColor} radius={0.014} />
      <Voxel position={[0, 0.612, 0]} args={[0.070, 0.022, 0.110]} color={C.flannelDark} radius={0.006} />

      {/* Forearm & Hand with Articulated Elbow Joint at Y = 0.516 */}
      <group ref={forearmRef} position={[0, 0.516, 0]}>
        <group position={[0, -0.516, 0]}>
          {/* Forearm (Rolled-up Sleeve) */}
          <Voxel position={[0, 0.472, 0]} args={[0.064, 0.115, 0.098]} color={baseColor} radius={0.012} />
          <Voxel position={[0, 0.418, 0]} args={[0.072, 0.032, 0.106]} color={C.flannelOat} radius={0.006} />

          {/* Exposed Wrist Skin */}
          <Voxel position={[0, 0.384, 0]} args={[0.054, 0.042, 0.082]} color={C.skin} radius={0.008} />

          {/* Detailed Hand with Relaxed Finger Curl & Thumb */}
          <Voxel position={[0, 0.328, 0.006]} args={[0.056, 0.082, 0.076]} color={C.skin} radius={0.012} />
          <Voxel
            position={[isLeft ? 0.026 : -0.026, 0.338, 0.030]}
            args={[0.018, 0.042, 0.026]}
            color={C.skin}
            rotation={[0.2, 0, isLeft ? -0.2 : 0.2]}
            radius={0.006}
          />

          {/* Hand Props (Solidly positioned inside hand coordinates) */}
          {!isLeft && activePreset === 'rainy' && <CoffeeMugHand />}
          {isLeft && activePreset === 'morning' && <WaterBottleHand />}
        </group>
      </group>
    </group>
  )
}

// ─── Articulated Upper Leg (Thigh: Hip to Knee Joint) ─────────────────────────
function Thigh() {
  return (
    <group position={[0, 0, 0]}>
      {/* Upper Thigh Denim - seamlessly connects with Torso pelvis */}
      <Voxel position={[0, -0.073, 0]} args={[0.096, 0.145, 0.118]} color={C.pantsDenim} radius={0.014} />
    </group>
  )
}

// ─── Articulated Lower Leg (Knee Joint Pivot: Calf, Rolled Cuff & Retro High-Tops) ──
function CalfAndShoe({ side }) {
  const isLeft = side === 'left'

  return (
    <group position={[0, 0, 0]}>
      {/* Lower Leg Denim */}
      <Voxel position={[0, -0.066, 0]} args={[0.088, 0.148, 0.110]} color={C.pantsDenim} radius={0.012} />
      {/* Selvedge Rolled Pinroll Cuff */}
      <Voxel position={[0, -0.148, 0]} args={[0.094, 0.036, 0.116]} color={C.pantsCuff} radius={0.006} />

      {/* Iconic Retro High-Top Sneakers (Air Jordan 1 Voxel Style) */}
      {/* 1. Black Outsole Grip */}
      <Voxel position={[0, -0.280, 0.010]} args={[0.108, 0.020, 0.222]} color={C.shoeBlack} radius={0.006} />

      {/* 2. Sculpted White Midsole */}
      <Voxel position={[0, -0.258, 0.010]} args={[0.106, 0.028, 0.220]} color={C.shoeSoleWhite} radius={0.008} />

      {/* 3. Toe Box Base (White Leather) */}
      <Voxel position={[0, -0.232, 0.074]} args={[0.094, 0.038, 0.084]} color={C.shoeSoleWhite} radius={0.008} />
      <Voxel position={[0, -0.238, 0.102]} args={[0.098, 0.028, 0.034]} color={C.shoeBlack} radius={0.006} />

      {/* 4. Ankle Collar High-Top (Iconic Crimson Red) */}
      <Voxel position={[0, -0.186, -0.040]} args={[0.098, 0.095, 0.114]} color={C.shoeRed} radius={0.012} />
      <Voxel position={[0, -0.152, -0.040]} args={[0.102, 0.026, 0.104]} color={C.shoeBlack} radius={0.006} />

      {/* 5. Side Quarter & Swoosh Accent */}
      <Voxel position={[0, -0.226, -0.006]} args={[0.098, 0.048, 0.096]} color={C.shoeSoleWhite} radius={0.008} />
      <Voxel
        position={[isLeft ? -0.051 : 0.051, -0.218, -0.014]}
        args={[0.006, 0.026, 0.108]}
        color={C.shoeBlack}
        radius={0.003}
      />

      {/* 6. Tongue & Clean White Criss-Cross Laces */}
      <Voxel position={[0, -0.206, 0.030]} args={[0.072, 0.065, 0.036]} color={C.shoeSoleWhite} radius={0.006} />
      <Voxel position={[0, -0.218, 0.046]} args={[0.068, 0.010, 0.014]} color={C.shoeLace} radius={0.003} />
      <Voxel position={[0, -0.198, 0.040]} args={[0.064, 0.010, 0.014]} color={C.shoeLace} radius={0.003} />
    </group>
  )
}

// ─── Scenario Hand Props ────────────────────────────────────────────────────────
function CoffeeMugHand() {
  const steamRef = useRef()

  useFrame((state) => {
    if (steamRef.current) {
      const t = state.clock.elapsedTime
      steamRef.current.children.forEach((puff, idx) => {
        const cycle = (t * 0.85 + idx * 0.32) % 1.4
        puff.position.y = 0.048 + cycle * 0.12
        // Fluid turbulent curl noise
        puff.position.x = Math.sin(t * 2.4 + idx * 1.6) * 0.014 + Math.cos(t * 1.5 + idx) * 0.006
        puff.position.z = Math.cos(t * 2.0 + idx * 1.4) * 0.008
        const s = 0.007 + cycle * 0.015
        puff.scale.set(s, s * 1.25, s)
        puff.material.opacity = Math.max(0, (1 - cycle / 1.4) * 0.42)
      })
    }
  })

  return (
    <group position={[0, 0.32, 0.07]}>
      {/* Ceramic Mug Body - Warm Speckled Terracotta */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.027, 0.023, 0.062, 16]} />
        <meshStandardMaterial color="#c26344" roughness={0.55} metalness={0.08} />
      </mesh>
      {/* Cream Glaze Rim Strip */}
      <mesh position={[0, 0.029, 0]}>
        <cylinderGeometry args={[0.0275, 0.0275, 0.006, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.4} />
      </mesh>
      {/* Dark Espresso Liquid with Golden Crema Ring */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.006, 16]} />
        <meshStandardMaterial color="#221510" roughness={0.2} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.026, 0]}>
        <torusGeometry args={[0.021, 0.002, 6, 16]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#92400e" roughness={0.3} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.030, 0.002, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.014, 0.038, 0.011]} />
        <meshStandardMaterial color="#c26344" roughness={0.55} />
      </mesh>
      {/* 4 Multi-stage Fluid Steam Puffs */}
      <group ref={steamRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.045, 0]}>
            <sphereGeometry args={[1, 7, 7]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function WaterBottleHand() {
  return (
    <group position={[0, 0.32, 0.06]}>
      {/* Frosted Translucent Bottle Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.023, 0.023, 0.078, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.78}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      {/* Liquid core inside */}
      <mesh position={[0, -0.008, 0]}>
        <cylinderGeometry args={[0.020, 0.020, 0.055, 12]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.65} roughness={0.15} />
      </mesh>
      {/* Stainless Sport Cap & Loop */}
      <mesh position={[0, 0.046, 0]}>
        <cylinderGeometry args={[0.016, 0.018, 0.016, 14]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.057, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.008, 0.0025, 6, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
    </group>
  )
}

// ─── Floating Scenario Visual Effects (Billboard Upright in 3D Space) ───────────
function FloatingHearts() {
  const hRef1 = useRef()
  const hRef2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (hRef1.current) {
      const c1 = (t * 0.7) % 2.2
      hRef1.current.position.y = 0.5 + c1 * 0.2
      hRef1.current.position.x = Math.sin(t * 2) * 0.03
      hRef1.current.material.opacity = c1 < 0.4 ? c1 * 2 : (2.2 - c1) * 0.6
      const s1 = 0.04 + c1 * 0.015
      hRef1.current.scale.set(s1, s1, s1)
    }
    if (hRef2.current) {
      const c2 = (t * 0.7 + 1.1) % 2.2
      hRef2.current.position.y = 0.5 + c2 * 0.2
      hRef2.current.position.x = -0.06 + Math.cos(t * 2) * 0.03
      hRef2.current.material.opacity = c2 < 0.4 ? c2 * 2 : (2.2 - c2) * 0.6
      const s2 = 0.035 + c2 * 0.012
      hRef2.current.scale.set(s2, s2, s2)
    }
  })

  // Anchored in space between character and cat
  return (
    <Billboard position={[0.3, 0.2, 0.5]} follow={true}>
      <Text ref={hRef1} fontSize={1} color="#f43f5e" anchorX="center" anchorY="middle" material-transparent material-opacity={0}>
        ♥
      </Text>
      <Text ref={hRef2} fontSize={1.1} color="#fb7185" anchorX="center" anchorY="middle" material-transparent material-opacity={0}>
        ♥
      </Text>
    </Billboard>
  )
}

function FloatingZzz({ headPosRef }) {
  const zRef1 = useRef()
  const zRef2 = useRef()
  const billRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (billRef.current && headPosRef?.current) {
      billRef.current.position.copy(headPosRef.current)
      billRef.current.position.y += 0.25
    }

    if (zRef1.current) {
      const c1 = (t * 0.6) % 2.5
      zRef1.current.position.y = c1 * 0.22
      zRef1.current.position.x = 0.08 + Math.sin(t * 1.5) * 0.03
      zRef1.current.material.opacity = c1 < 0.4 ? c1 * 2 : (2.5 - c1) * 0.5
      const s1 = 0.045 + c1 * 0.015
      zRef1.current.scale.set(s1, s1, s1)
    }
    if (zRef2.current) {
      const c2 = (t * 0.6 + 1.25) % 2.5
      zRef2.current.position.y = c2 * 0.22
      zRef2.current.position.x = -0.06 + Math.cos(t * 1.5) * 0.03
      zRef2.current.material.opacity = c2 < 0.4 ? c2 * 2 : (2.5 - c2) * 0.5
      const s2 = 0.04 + c2 * 0.015
      zRef2.current.scale.set(s2, s2, s2)
    }
  })

  return (
    <Billboard ref={billRef} follow={true}>
      <Text ref={zRef1} fontSize={1} color="#c084fc" anchorX="center" anchorY="middle" material-transparent material-opacity={0}>
        z
      </Text>
      <Text ref={zRef2} fontSize={1.2} color="#a855f7" anchorX="center" anchorY="middle" material-transparent material-opacity={0}>
        Z
      </Text>
    </Billboard>
  )
}

// ─── Room Obstacle-Free Waypoint Navigation Graph ──────────────────────────────
const ROOM_WAYPOINTS = {
  bedSleep:    [-2.585, 0.455, 1.86],
  bedside:     [-2.05, 0.007, 1.55],
  hallwayWest: [-1.15, 0.007, 0.70], // Safe corridor between bed corner & desk
  centerRug:   [ 0.15, 0.007, 0.60], // Central living area on rug
  morning:     [ 0.75, 0.007, 0.65], // Sunny morning spot
  sunset:      [ 0.82, 0.007, 0.50], // Sunset spot beside cat
  windowHall:  [-0.45, 0.007, -0.90],// Corridor between desk & record player to window
  rainy:       [-0.85, 0.007, -2.15],// Standing by window
}

function computeNavPath(startPos, targetKey) {
  const targetPos = ROOM_WAYPOINTS[targetKey] || ROOM_WAYPOINTS.morning
  const dist2D = (p1, p2) => Math.hypot(p1[0] - p2[0], p1[2] - p2[2])

  // Find nearest start waypoint node
  const nodes = ['bedside', 'hallwayWest', 'centerRug', 'morning', 'sunset', 'windowHall', 'rainy']
  let nearestStart = 'centerRug'
  let minDist = 9999
  for (const n of nodes) {
    const d = dist2D(startPos, ROOM_WAYPOINTS[n])
    if (d < minDist) {
      minDist = d
      nearestStart = n
    }
  }

  if (nearestStart === targetKey) {
    return [new THREE.Vector3(...targetPos)]
  }

  // Pre-mapped collision-free paths in room
  const graph = {
    bedside:     ['hallwayWest'],
    hallwayWest: ['bedside', 'centerRug', 'windowHall'],
    centerRug:   ['hallwayWest', 'morning', 'sunset', 'windowHall'],
    morning:     ['centerRug', 'sunset'],
    sunset:      ['centerRug', 'morning'],
    windowHall:  ['hallwayWest', 'centerRug', 'rainy'],
    rainy:       ['windowHall'],
  }

  // BFS search
  const queue = [[nearestStart]]
  const visited = new Set([nearestStart])
  let found = null

  while (queue.length > 0) {
    const path = queue.shift()
    const tail = path[path.length - 1]
    if (tail === targetKey) {
      found = path
      break
    }
    for (const nxt of (graph[tail] || [])) {
      if (!visited.has(nxt)) {
        visited.add(nxt)
        queue.push([...path, nxt])
      }
    }
  }

  const res = []
  if (found) {
    for (let i = 1; i < found.length; i++) {
      res.push(new THREE.Vector3(...ROOM_WAYPOINTS[found[i]]))
    }
  } else {
    res.push(new THREE.Vector3(...targetPos))
  }
  return res
}

// ─── Pre-computed Quaternions for Seamless Bed Transitions (No Gimbal Lock) ──
const _qSitBed = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 0.5, 0, 'XYZ'))
const _qSleep  = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, Math.PI / 2, 'XYZ'))
const _qTemp   = new THREE.Quaternion()

// ─── Main PixelPerson Component (Systematized Locomotion & Bed State Machine) ──
function PixelPerson({ scale = 1, ...props }) {
  const groupRef       = useRef()
  const upperBodyRef   = useRef()
  const headGroupRef   = useRef()
  const leftArmRef     = useRef()
  const leftForearmRef = useRef()
  const rightArmRef    = useRef()
  const rightForearmRef= useRef()
  const leftLegRef     = useRef()
  const leftKneeRef    = useRef()
  const rightLegRef    = useRef()
  const rightKneeRef   = useRef()
  const headWorldPos   = useRef(new THREE.Vector3())
  const scaleSync      = useRef(typeof scale === 'number' ? scale : 1)

  // Store connections
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isNightMode = useStore((state) => state.isNightMode)
  const setLightingPreset = useStore((state) => state.setLightingPreset)
  const setCharacterAction = useStore((state) => state.setCharacterAction)
  const setIsCharacterSleeping = useStore((state) => state.setIsCharacterSleeping)
  const wakeUpTrigger = useStore((state) => state.wakeUpTrigger)
  const activePreset = isNightMode ? 'night' : lightingPreset || 'morning'

  const [currentMessage, setCurrentMessage] = useState('')
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [expression, setExpression] = useState('happy')
  const [isBlinking, setIsBlinking] = useState(false)

  // Motion & Systematized Waypoint State Machine
  const currentPresetRef    = useRef(activePreset)
  const navQueueRef         = useRef([])
  const targetRotYRef       = useRef(SCENARIOS[activePreset]?.rotationY || 0.15)
  const isMovingRef         = useRef(false)
  const gaitPhaseRef        = useRef(0)
  const dialogueIndexRef    = useRef(-1)

  // Night State Sub-stages: 'idle' | 'night_yawn' | 'walk_to_bed' | 'sit_at_bed' | 'lie_down' | 'sleeping'
  const nightStageRef       = useRef(activePreset === 'night' ? 'sleeping' : 'idle')
  const nightTimerRef       = useRef(0)
  const isLyingInBedRef     = useRef(activePreset === 'night')

  // Wake Up Sub-stages: 'idle' | 'wake_stir' | 'wake_sit' | 'wake_stand'
  const wakeTimerRef        = useRef(0)

  const dismissTimer        = useRef(null)
  const blinkTimer          = useRef(null)
  const welcomeTimer        = useRef(null)

  const { t } = useTranslation()
  const { playSound } = useSounds()

  // Initialize position on mount
  useEffect(() => {
    const isNight = activePreset === 'night'
    const cfg = SCENARIOS[activePreset] || SCENARIOS.morning

    if (groupRef.current) {
      if (isNight) {
        groupRef.current.position.set(...cfg.bedSleepPos)
        groupRef.current.rotation.set(...cfg.bedSleepRot)
        nightStageRef.current = 'sleeping'
        isLyingInBedRef.current = true
        setIsCharacterSleeping(true)
        setCharacterAction('sleeping')
      } else {
        groupRef.current.position.set(...cfg.position)
        groupRef.current.rotation.set(0, cfg.rotationY, 0)
        isLyingInBedRef.current = false
        setIsCharacterSleeping(false)
        setCharacterAction('walking')
      }
    }

    if (isNight) {
      targetRotYRef.current = 0
    } else {
      targetRotYRef.current = cfg.rotationY
    }

    setExpression(cfg.expression)
  }, [])

  // Wake-up trigger from Sleep HUD or User Action
  const prevWakeUpTrigger = useRef(wakeUpTrigger)
  useEffect(() => {
    if (wakeUpTrigger > prevWakeUpTrigger.current) {
      prevWakeUpTrigger.current = wakeUpTrigger
      setIsCharacterSleeping(false)
      setExpression('happy')
      if (activePreset === 'night') {
        setLightingPreset('morning')
      }
    }
  }, [wakeUpTrigger, activePreset, setIsCharacterSleeping, setLightingPreset])

  // Watch for lightingPreset / time of day changes -> Trigger systematized transitions
  useEffect(() => {
    if (currentPresetRef.current !== activePreset) {
      currentPresetRef.current = activePreset
      const isNight = activePreset === 'night'
      const cfg = SCENARIOS[activePreset] || SCENARIOS.morning
      dialogueIndexRef.current = -1

      // Hide speech bubble during transitions
      setBubbleVisible(false)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)

      if (isNight) {
        // Start night sequence: start with yawn, then plan path to bedside
        nightStageRef.current = 'night_yawn'
        nightTimerRef.current = 0
        targetRotYRef.current = cfg.bedsideRotY
        setIsCharacterSleeping(false)
      } else {
        // Daytime / Evening target
        targetRotYRef.current = cfg.rotationY
        setIsCharacterSleeping(false)

        // If not lying in bed, plan path immediately
        if (!isLyingInBedRef.current && groupRef.current) {
          const curPos = groupRef.current.position
          navQueueRef.current = computeNavPath([curPos.x, curPos.y, curPos.z], activePreset)
        }
      }

      if (cfg.sound) playSound(cfg.sound)
    }
  }, [activePreset, playSound, setIsCharacterSleeping])

  // Welcome popup on initial visit after 2 seconds
  useEffect(() => {
    welcomeTimer.current = setTimeout(() => {
      if (dialogueIndexRef.current === -1 && !isMovingRef.current) {
        const cfg = SCENARIOS[activePreset] || SCENARIOS.morning
        setCurrentMessage(t(cfg.greetingKey))
        setBubbleVisible(true)
        if (cfg.sound) playSound(cfg.sound)

        dismissTimer.current = setTimeout(() => {
          setBubbleVisible(false)
        }, 4500)
      }
    }, 2000)

    return () => {
      if (welcomeTimer.current) clearTimeout(welcomeTimer.current)
    }
  }, [activePreset, playSound, t])

  // Periodic natural blink
  useEffect(() => {
    let active = true
    const scheduleNextBlink = () => {
      const delay = 3200 + Math.random() * 2600
      blinkTimer.current = setTimeout(() => {
        if (!active) return
        setIsBlinking(true)
        setTimeout(() => {
          if (!active) return
          setIsBlinking(false)
          scheduleNextBlink()
        }, 110)
      }, delay)
    }
    scheduleNextBlink()

    return () => {
      active = false
      if (blinkTimer.current) clearTimeout(blinkTimer.current)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [])

  // Click handler: Cycles through scenario dialogue & plays expressive sound
  const handleClick = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (welcomeTimer.current) clearTimeout(welcomeTimer.current)
    if (dismissTimer.current) clearTimeout(dismissTimer.current)

    const cfg = SCENARIOS[activePreset] || SCENARIOS.morning
    const dialogues = cfg.dialogues || []

    const nextIndex = (dialogueIndexRef.current + 1) % dialogues.length
    dialogueIndexRef.current = nextIndex
    const nextKey = dialogues[nextIndex]

    setCurrentMessage(t(nextKey))
    setBubbleVisible(true)

    // Sound effect
    if (cfg.sound) playSound(cfg.sound)

    // Expression flash
    setIsBlinking(true)
    setTimeout(() => {
      setExpression(cfg.expression)
      setIsBlinking(false)
    }, 90)

    dismissTimer.current = setTimeout(() => {
      setBubbleVisible(false)
    }, 4500)
  }, [activePreset, playSound, t])

  // Cursor Hover Feedback
  const handlePointerOver = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    document.body.style.cursor = 'auto'
  }, [])

  // ─── Systematized Motion State Machine in Frame Loop ────────────────────────
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const curPos = groupRef.current.position
    const clockTime = state.clock.elapsedTime

    // Track head world position for decoupled floating VFX
    if (headGroupRef.current) {
      headGroupRef.current.getWorldPosition(headWorldPos.current)
    }

    // ── CASE A: WAKING UP FROM BED (Smooth 4-Stage Biomechanical Awakening) ──
    if (isLyingInBedRef.current && activePreset !== 'night') {
      isMovingRef.current = false
      setIsCharacterSleeping(false)
      wakeTimerRef.current += delta
      const wt = wakeTimerRef.current
      setCharacterAction('sitting_bed')

      if (wt < 0.8) {
        // Giai đoạn 1: Cựa mình mở mắt, mỉm cười chào ngày mới
        setExpression('happy')
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = 0.08 + Math.sin(wt * 6) * 0.04
        }
      } else if (wt < 2.4) {
        // Giai đoạn 2: Nâng người ngồi dậy trên nệm (Quaternions slerp mượt mà từ nằm -> ngồi thẳng)
        const p = Math.min(1, (wt - 0.8) / 1.6)
        const s = p * p * (3 - 2 * p)

        curPos.x = -2.585
        curPos.y = THREE.MathUtils.lerp(0.455, 0.007, s)
        curPos.z = 1.86

        _qTemp.slerpQuaternions(_qSleep, _qSitBed, s)
        groupRef.current.quaternion.copy(_qTemp)

        // Hông gập từ 0 -> -1.45 đồng bộ khi thân người ngồi dậy, chân duỗi thẳng trên nệm
        const hipAngle = THREE.MathUtils.lerp(0, -1.45, s)
        if (leftLegRef.current) leftLegRef.current.rotation.x = hipAngle
        if (rightLegRef.current) rightLegRef.current.rotation.x = hipAngle
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = 0
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = 0

        // Hai tay chống xuống mặt nệm bên cạnh hông để đẩy người dậy
        const armAngle = THREE.MathUtils.lerp(-0.15, 0.22, s)
        const forearmAngle = THREE.MathUtils.lerp(-0.78, 0, s)
        if (leftArmRef.current) leftArmRef.current.rotation.x = armAngle
        if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle
        if (leftForearmRef.current) leftForearmRef.current.rotation.x = forearmAngle
        if (rightForearmRef.current) rightForearmRef.current.rotation.x = forearmAngle
      } else if (wt < 4.0) {
        // Giai đoạn 3: Trượt ra mép giường và đung đưa chân qua mép nệm (ngồi thõng chân bên mép giường)
        const p = Math.min(1, (wt - 2.4) / 1.6)
        const s = p * p * (3 - 2 * p)

        curPos.x = THREE.MathUtils.lerp(-2.585, -2.22, s)
        curPos.y = 0.007
        curPos.z = 1.86
        groupRef.current.rotation.set(0, Math.PI * 0.5, 0)

        // Hai chân thõng nhẹ nhàng qua mép nệm: đầu gối gập 0 -> 1.45
        const kneeAngle = THREE.MathUtils.lerp(0, 1.45, s)
        if (leftLegRef.current) leftLegRef.current.rotation.x = -1.45
        if (rightLegRef.current) rightLegRef.current.rotation.x = -1.45
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = kneeAngle
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = kneeAngle

        // Hai tay chuyển về đặt lên đùi
        const armAngle = THREE.MathUtils.lerp(0.22, -0.35, s)
        const forearmAngle = THREE.MathUtils.lerp(0, -0.28, s)
        if (leftArmRef.current) leftArmRef.current.rotation.x = armAngle
        if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle
        if (leftForearmRef.current) leftForearmRef.current.rotation.x = forearmAngle
        if (rightForearmRef.current) rightForearmRef.current.rotation.x = forearmAngle
      } else if (wt < 5.2) {
        // Giai đoạn 4: Chống tay, dồn trọng tâm đứng vững xuống sàn gỗ
        const p = Math.min(1, (wt - 4.0) / 1.2)
        const s = p * p * (3 - 2 * p)

        curPos.x = THREE.MathUtils.lerp(-2.22, -2.05, s)
        curPos.y = 0.007
        curPos.z = THREE.MathUtils.lerp(1.86, 1.55, s)

        const rotY = THREE.MathUtils.lerp(Math.PI * 0.5, 0.15, s)
        groupRef.current.rotation.set(0, rotY, 0)

        // Hông và đầu gối duỗi thẳng đứng vững
        const hipAngle = THREE.MathUtils.lerp(-1.45, 0, s)
        const kneeAngle = THREE.MathUtils.lerp(1.45, 0, s)
        if (leftLegRef.current) leftLegRef.current.rotation.x = hipAngle
        if (rightLegRef.current) rightLegRef.current.rotation.x = hipAngle
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = kneeAngle
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = kneeAngle

        const armAngle = THREE.MathUtils.lerp(-0.35, 0, s)
        const forearmAngle = THREE.MathUtils.lerp(-0.28, 0, s)
        if (leftArmRef.current) leftArmRef.current.rotation.x = armAngle
        if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle
        if (leftForearmRef.current) leftForearmRef.current.rotation.x = forearmAngle
        if (rightForearmRef.current) rightForearmRef.current.rotation.x = forearmAngle
      } else {
        // Đã đứng vững trên sàn phòng
        isLyingInBedRef.current = false
        wakeTimerRef.current = 0
        groupRef.current.rotation.set(0, 0.15, 0)
        curPos.y = 0.007
        if (leftLegRef.current) leftLegRef.current.rotation.x = 0
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = 0
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = 0

        // Tạo lộ trình tránh vật cản tới điểm kịch bản ban ngày
        navQueueRef.current = computeNavPath([curPos.x, curPos.y, curPos.z], activePreset)
      }
      return
    }

    // ── CASE B: NIGHT SEQUENCE (Yawn -> Walk to Bed -> Sit -> Swing Legs -> Recline -> Sleeping) ──
    if (activePreset === 'night') {
      const stage = nightStageRef.current

      if (stage === 'night_yawn') {
        nightTimerRef.current += delta
        setCharacterAction('idle')
        setExpression('tired')

        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -1.25, delta * 6)
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.42, delta * 6)
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -1.55, delta * 6)
        }
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, 0.18, delta * 4)
        }

        if (nightTimerRef.current > 1.8) {
          nightStageRef.current = 'walk_to_bed'
          nightTimerRef.current = 0
          navQueueRef.current = computeNavPath([curPos.x, curPos.y, curPos.z], 'bedside')
        }
        return
      }

      if (stage === 'walk_to_bed') {
        setCharacterAction('walking')
        setIsCharacterSleeping(false)

        if (navQueueRef.current.length > 0) {
          const currentWaypoint = navQueueRef.current[0]
          const dx = currentWaypoint.x - curPos.x
          const dz = currentWaypoint.z - curPos.z
          const dist = Math.hypot(dx, dz)

          if (dist > 0.08) {
            isMovingRef.current = true
            const moveSpeed = 1.25 // Bước chân chậm rãi, ngái ngủ về đêm
            const stepDist = Math.min(dist, moveSpeed * delta)
            curPos.x += (dx / dist) * stepDist
            curPos.z += (dz / dist) * stepDist

            const moveAngle = Math.atan2(dx, dz)
            let angleDiff = (moveAngle - groupRef.current.rotation.y) % (Math.PI * 2)
            if (angleDiff > Math.PI) angleDiff -= Math.PI * 2
            if (angleDiff < -Math.PI) angleDiff += Math.PI * 2
            groupRef.current.rotation.y += angleDiff * Math.min(1, delta * 12)

            const strideLength = 0.54
            gaitPhaseRef.current = (gaitPhaseRef.current + (stepDist / strideLength) * Math.PI * 2) % (Math.PI * 2)
            const phi = gaitPhaseRef.current

            const computeLeg = (phase) => {
              const sinP = Math.sin(phase)
              if (sinP > 0) {
                return { rotX: sinP * 0.44, kneeX: 0.08 }
              } else {
                const swingT = -sinP
                return { rotX: -swingT * 0.46, kneeX: swingT * 0.52 }
              }
            }

            const leftLegKine = computeLeg(phi)
            const rightLegKine = computeLeg((phi + Math.PI) % (Math.PI * 2))

            if (leftLegRef.current) leftLegRef.current.rotation.x = leftLegKine.rotX
            if (rightLegRef.current) rightLegRef.current.rotation.x = rightLegKine.rotX
            if (leftKneeRef.current) leftKneeRef.current.rotation.x = leftLegKine.kneeX
            if (rightKneeRef.current) rightKneeRef.current.rotation.x = rightLegKine.kneeX

            curPos.y = 0.007 + Math.abs(Math.sin(phi)) * 0.024
            if (upperBodyRef.current) {
              upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(upperBodyRef.current.rotation.x, 0.08, delta * 4)
              upperBodyRef.current.position.x = Math.sin(phi) * 0.014
            }
            if (headGroupRef.current) {
              headGroupRef.current.rotation.x = 0.12 + Math.abs(Math.sin(phi)) * 0.02
            }
          } else {
            navQueueRef.current.shift()
          }
        } else {
          // Đến cạnh giường -> Bắt đầu ngồi xuống êm ái
          nightStageRef.current = 'sit_at_bed'
          nightTimerRef.current = 0
          isMovingRef.current = false
          isLyingInBedRef.current = true
          setCurrentMessage(t('scenario.night.greet'))
          setBubbleVisible(true)
          playSound('charTired')
          if (dismissTimer.current) clearTimeout(dismissTimer.current)
          dismissTimer.current = setTimeout(() => setBubbleVisible(false), 3800)
        }
        return
      }

      if (stage === 'sit_at_bed') {
        isLyingInBedRef.current = true
        setCharacterAction('sitting_bed')
        setIsCharacterSleeping(false)
        nightTimerRef.current += delta
        const p = Math.min(1, nightTimerRef.current / 1.6)
        const s = p * p * (3 - 2 * p) // Hermite smoothstep

        // Ngồi êm ái xuống mép nệm: trượt từ vị trí cạnh giường tới mép nệm [-2.05, 0.007, 1.55] -> [-2.22, 0.007, 1.86]
        curPos.x = THREE.MathUtils.lerp(-2.05, -2.22, s)
        curPos.y = 0.007
        curPos.z = THREE.MathUtils.lerp(1.55, 1.86, s)

        const rotY = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI * 0.5, s)
        groupRef.current.rotation.set(0, rotY, 0)

        // Hông gập -1.45, đầu gối gập +1.45: bắp chân và giày thõng tự nhiên xuống mép giường
        const sitHipAngle = THREE.MathUtils.lerp(0, -1.45, s)
        const sitKneeAngle = THREE.MathUtils.lerp(0, 1.45, s)
        if (leftLegRef.current) leftLegRef.current.rotation.x = sitHipAngle
        if (rightLegRef.current) rightLegRef.current.rotation.x = sitHipAngle
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = sitKneeAngle
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = sitKneeAngle

        // Hai tay buông nghỉ trên đầu gối, thở dài buồn ngủ
        const armAngle = THREE.MathUtils.lerp(0, -0.35, s)
        const forearmAngle = THREE.MathUtils.lerp(0, -0.28, s)
        if (leftArmRef.current) leftArmRef.current.rotation.x = armAngle
        if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle
        if (leftForearmRef.current) leftForearmRef.current.rotation.x = forearmAngle
        if (rightForearmRef.current) rightForearmRef.current.rotation.x = forearmAngle

        if (upperBodyRef.current) upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.10, s)
        if (headGroupRef.current) headGroupRef.current.rotation.x = 0.16 + Math.sin(clockTime * 1.5) * 0.04
        setExpression('tired')

        if (nightTimerRef.current > 1.6) {
          nightStageRef.current = 'swing_legs_in'
          nightTimerRef.current = 0
        }
        return
      }

      if (stage === 'swing_legs_in') {
        isLyingInBedRef.current = true
        setCharacterAction('sitting_bed')
        nightTimerRef.current += delta
        const p = Math.min(1, nightTimerRef.current / 1.8)
        const s = p * p * (3 - 2 * p) // Hermite smoothstep

        // Dịch chuyển êm vào vị trí nằm trên nệm: [-2.22, 0.007, 1.86] -> [-2.585, 0.007, 1.86]
        curPos.x = THREE.MathUtils.lerp(-2.22, -2.585, s)
        curPos.y = 0.007
        curPos.z = 1.86
        groupRef.current.rotation.set(0, Math.PI * 0.5, 0)

        // Hai chân duỗi thẳng ra nệm: đầu gối mở từ 1.45 -> 0.0
        const kneeAngle = THREE.MathUtils.lerp(1.45, 0, s)
        if (leftLegRef.current) leftLegRef.current.rotation.x = -1.45
        if (rightLegRef.current) rightLegRef.current.rotation.x = -1.45
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = kneeAngle
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = kneeAngle

        // Hai tay chống xuống nệm bên cạnh hông để giữ thăng bằng
        const armAngle = THREE.MathUtils.lerp(-0.35, 0.22, s)
        const armZ = THREE.MathUtils.lerp(0, 0.15, s)
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = armAngle
          leftArmRef.current.rotation.z = armZ
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = armAngle
          rightArmRef.current.rotation.z = -armZ
        }
        if (leftForearmRef.current) leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(-0.28, 0, s)
        if (rightForearmRef.current) rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(-0.28, 0, s)

        if (upperBodyRef.current) upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(0.10, 0.08, s)

        if (nightTimerRef.current > 1.8) {
          nightStageRef.current = 'recline_to_pillow'
          nightTimerRef.current = 0
        }
        return
      }

      if (stage === 'recline_to_pillow') {
        isLyingInBedRef.current = true
        nightTimerRef.current += delta
        const p = Math.min(1, nightTimerRef.current / 2.2)
        const s = p * p * (3 - 2 * p)

        curPos.x = -2.585
        curPos.z = 1.86
        curPos.y = THREE.MathUtils.lerp(0.007, 0.455, s)

        // Slerp Quaternion 3D ngả lưng phẳng phiu về phía gối
        _qTemp.slerpQuaternions(_qSitBed, _qSleep, s)
        groupRef.current.quaternion.copy(_qTemp)

        // Khớp hông mở từ -1.45 -> 0.0 đồng tốc với độ ngả lưng: hai chân giữ nguyên trên mặt nệm
        const hipAngle = -1.45 * (1 - s)
        if (leftLegRef.current) leftLegRef.current.rotation.x = hipAngle
        if (rightLegRef.current) rightLegRef.current.rotation.x = hipAngle
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = 0
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = 0

        // Hai tay trượt dần từ mặt nệm lên trước ngực / mép chăn gập ngược
        const armAngle = THREE.MathUtils.lerp(0.22, -0.15, s)
        const forearmAngle = THREE.MathUtils.lerp(0, -0.78, s)
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = armAngle
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(0.15, 0.25, s)
          leftArmRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.08, s)
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = armAngle
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(-0.15, -0.25, s)
          rightArmRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.08, s)
        }
        if (leftForearmRef.current) {
          leftForearmRef.current.rotation.x = forearmAngle
          leftForearmRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.15, s)
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = forearmAngle
          rightForearmRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.15, s)
        }

        if (upperBodyRef.current) upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(0.08, 0, s)

        // Đầu tiếp xúc với gối êm
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = THREE.MathUtils.lerp(0.12, 0.08, s)
          headGroupRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.06, s)
        }

        // Chăn bông kéo lên và phồng dần ôm lấy thân người
        if (s > 0.4) {
          setIsCharacterSleeping(true)
        }
        if (s > 0.75) {
          setExpression('sleeping')
        }

        if (nightTimerRef.current > 2.2) {
          nightStageRef.current = 'sleeping'
        }
        return
      }

      if (stage === 'sleeping') {
        isLyingInBedRef.current = true
        curPos.x = -2.585
        curPos.y = 0.455 + Math.sin(clockTime * 1.4) * 0.005 // Nhịp thở êm ái cùng chăn bông
        curPos.z = 1.86
        groupRef.current.quaternion.copy(_qSleep)

        if (leftLegRef.current) leftLegRef.current.rotation.x = 0
        if (rightLegRef.current) rightLegRef.current.rotation.x = 0
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = 0
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = 0

        // Hai tay buông lơi tự nhiên, đặt nhẹ nhàng trên mép chăn gập ngược màu trắng ngà
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.15, delta * 6)
          leftArmRef.current.rotation.y = THREE.MathUtils.lerp(leftArmRef.current.rotation.y, 0.08, delta * 6)
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.25, delta * 6)
        }
        if (leftForearmRef.current) {
          leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.78, delta * 6)
          leftForearmRef.current.rotation.z = THREE.MathUtils.lerp(leftForearmRef.current.rotation.z, 0.15, delta * 6)
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.15, delta * 6)
          rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, -0.08, delta * 6)
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.25, delta * 6)
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.78, delta * 6)
          rightForearmRef.current.rotation.z = THREE.MathUtils.lerp(rightForearmRef.current.rotation.z, -0.15, delta * 6)
        }

        // Đầu gối êm ái trên gối trắng, nghiêng nhẹ bình yên
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, 0.08, delta * 4)
          headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, 0.06, delta * 4)
          headGroupRef.current.rotation.z = 0
        }

        setIsCharacterSleeping(true)
        setCharacterAction('sleeping')
        setExpression('sleeping')
        return
      }
    }

    // ── CASE C: DAYTIME / EVENING / RAINY WAYPOINT NAVIGATION & ACTIONS ──
    if (navQueueRef.current.length > 0) {
      // ── Traversing Waypoints ──
      const nextWaypoint = navQueueRef.current[0]
      const dx = nextWaypoint.x - curPos.x
      const dz = nextWaypoint.z - curPos.z
      const dist = Math.hypot(dx, dz)

      if (dist > 0.08) {
        isMovingRef.current = true
        setCharacterAction('walking')
        setIsCharacterSleeping(false)
        if (leftLegRef.current) leftLegRef.current.visible = true
        if (rightLegRef.current) rightLegRef.current.visible = true

        const moveSpeed = 1.55 // Active daytime walking pace
        const stepDist = Math.min(dist, moveSpeed * delta)
        curPos.x += (dx / dist) * stepDist
        curPos.z += (dz / dist) * stepDist

        // Heading alignment with exponential damping
        const moveAngle = Math.atan2(dx, dz)
        let angleDiff = (moveAngle - groupRef.current.rotation.y) % (Math.PI * 2)
        if (angleDiff > Math.PI) angleDiff -= Math.PI * 2
        if (angleDiff < -Math.PI) angleDiff += Math.PI * 2
        groupRef.current.rotation.y += angleDiff * Math.min(1, delta * 12)

        // Stride-synced phase accumulation (ZERO foot sliding!)
        const strideLength = 0.54
        gaitPhaseRef.current = (gaitPhaseRef.current + (stepDist / strideLength) * Math.PI * 2) % (Math.PI * 2)
        const phi = gaitPhaseRef.current

        // Dual-phase kinematics: stance pushes backward on floor, swing lifts in parabolic clearance arc
        const computeLeg = (phase) => {
          const sinP = Math.sin(phase)
          if (sinP > 0) {
            return { rotX: sinP * 0.44, kneeX: 0.08 }
          } else {
            const swingT = -sinP
            return { rotX: -swingT * 0.46, kneeX: swingT * 0.52 }
          }
        }

        const leftLegKine = computeLeg(phi)
        const rightLegKine = computeLeg((phi + Math.PI) % (Math.PI * 2))

        if (leftLegRef.current) leftLegRef.current.rotation.x = leftLegKine.rotX
        if (rightLegRef.current) rightLegRef.current.rotation.x = rightLegKine.rotX
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = leftLegKine.kneeX
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = rightLegKine.kneeX

        // Pelvis Bounding: 2 bounces per walk cycle with squash & stretch
        curPos.y = 0.007 + Math.abs(Math.sin(phi)) * 0.030

        // Pelvis lateral sway & torso counter-torsion
        const sway = Math.sin(phi) * 0.016
        if (upperBodyRef.current) {
          upperBodyRef.current.position.x = sway
          upperBodyRef.current.rotation.y = -Math.sin(phi) * 0.05
          upperBodyRef.current.rotation.z = Math.sin(phi) * 0.02
        }

        // Arm counter-swinging with prop stabilization
        const leftArmAmp = (activePreset === 'morning') ? 0.15 : 0.85
        const rightArmAmp = (activePreset === 'rainy') ? 0.15 : 0.85

        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = -Math.sin(phi) * 0.40 * leftArmAmp
          leftArmRef.current.rotation.z = 0.04
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = Math.sin(phi) * 0.40 * rightArmAmp
          rightArmRef.current.rotation.z = -0.04
        }
        if (leftForearmRef.current) {
          leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(
            leftForearmRef.current.rotation.x,
            activePreset === 'morning' ? -0.55 : 0,
            delta * 6
          )
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(
            rightForearmRef.current.rotation.x,
            activePreset === 'rainy' ? -0.65 : 0,
            delta * 6
          )
        }

        // Head bobbing with slight inertial lag
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = 0.03 + Math.abs(Math.sin(phi)) * 0.02
          headGroupRef.current.rotation.z = -Math.sin(phi) * 0.02
        }
      } else {
        // Reached this waypoint -> advance to next
        navQueueRef.current.shift()
      }
    } else {
      // ── Arrived at Destination: Scenario Actions ──
      if (isMovingRef.current) {
        isMovingRef.current = false
        const cfg = SCENARIOS[activePreset] || SCENARIOS.morning
        setCurrentMessage(t(cfg.greetingKey))
        setBubbleVisible(true)
        if (dismissTimer.current) clearTimeout(dismissTimer.current)
        dismissTimer.current = setTimeout(() => setBubbleVisible(false), 4500)
      }

      // Smoothly orient to final scenario heading
      let rotDiff = (targetRotYRef.current - groupRef.current.rotation.y) % (Math.PI * 2)
      if (rotDiff > Math.PI) rotDiff -= Math.PI * 2
      if (rotDiff < -Math.PI) rotDiff += Math.PI * 2
      groupRef.current.rotation.y += rotDiff * Math.min(1, delta * 6)

      // ── SCENARIO 1: CHIỀU (Sunset - Petting Cat with Reciprocal Interaction) ──
      if (activePreset === 'sunset') {
        setCharacterAction('petting_cat')
        setExpression('happy')

        // Ergonomic kneeling down on rug
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.007, delta * 4)
        if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, -1.40, delta * 4)
        if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -1.40, delta * 4)
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.lerp(leftKneeRef.current.rotation.x, 1.40, delta * 4)
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.lerp(rightKneeRef.current.rotation.x, 1.40, delta * 4)

        // Upper body leans forward comfortably towards cat
        if (upperBodyRef.current) {
          upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(upperBodyRef.current.rotation.x, 0.30, delta * 4)
          upperBodyRef.current.position.y = THREE.MathUtils.lerp(upperBodyRef.current.position.y, 0, delta * 4)
          upperBodyRef.current.position.x = 0
          upperBodyRef.current.rotation.y = THREE.MathUtils.lerp(upperBodyRef.current.rotation.y, 0, delta * 4)
        }

        // Head looks down lovingly at cat
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, 0.38, delta * 4)
          headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, -0.14, delta * 4)
          headGroupRef.current.rotation.z = THREE.MathUtils.lerp(headGroupRef.current.rotation.z, 0.05, delta * 4)
        }

        // Left hand rests grounded on left knee for anatomical balance
        if (leftArmRef.current) {
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.52, delta * 4)
          leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.12, delta * 4)
          leftArmRef.current.rotation.y = 0
        }
        if (leftForearmRef.current) {
          leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.28, delta * 4)
        }

        // Right arm executes 3D parametric petting arc (synced with Cat.jsx cycle T = 2.4s)
        const petCycle = (clockTime * 0.416) % 1.0 // 0 -> 1

        let targetArmX = -0.55
        let targetForearmX = -0.42
        let targetForearmZ = 0

        if (petCycle < 0.65) {
          // Stroke phase: Hand glides from crown of head down to base of spine
          const strokeProgress = petCycle / 0.65 // 0 -> 1
          targetArmX = -0.52 - strokeProgress * 0.26
          targetForearmX = -0.38 - Math.sin(strokeProgress * Math.PI) * 0.18
          targetForearmZ = (strokeProgress - 0.5) * 0.10
        } else {
          // Recovery phase: Hand lifts up gracefully in an arc over the fur
          const recoveryProgress = (petCycle - 0.65) / 0.35 // 0 -> 1
          const liftArc = Math.sin(recoveryProgress * Math.PI) * 0.15
          targetArmX = -0.78 + recoveryProgress * 0.26 - liftArc
          targetForearmX = -0.38 - liftArc * 1.2
          targetForearmZ = 0.05 * (1 - recoveryProgress)
        }

        if (rightArmRef.current) {
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetArmX, delta * 8)
          rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, 0.20, delta * 6)
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.18, delta * 6)
        }
        if (rightForearmRef.current) {
          rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, targetForearmX, delta * 8)
          rightForearmRef.current.rotation.z = THREE.MathUtils.lerp(rightForearmRef.current.rotation.z, targetForearmZ, delta * 6)
        }

      // ── SCENARIO 2: MƯA (Rainy - 5-Phase Coffee Ritual by the Window) ──
      } else if (activePreset === 'rainy') {
        setCharacterAction('drinking_coffee')

        // Stand upright facing rainy window with gentle contrapposto stance
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.007, delta * 6)
        if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0.04, delta * 6)
        if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -0.04, delta * 6)
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.lerp(leftKneeRef.current.rotation.x, 0, delta * 6)
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.lerp(rightKneeRef.current.rotation.x, 0, delta * 6)

        if (upperBodyRef.current) {
          upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(upperBodyRef.current.rotation.x, 0, delta * 4)
          upperBodyRef.current.position.y = Math.sin(clockTime * 1.2) * 0.004 // Peaceful chest breathing
          upperBodyRef.current.position.x = 0
          upperBodyRef.current.rotation.y = THREE.MathUtils.lerp(upperBodyRef.current.rotation.y, 0, delta * 4)
        }

        // 5-Phase Interactive Coffee Ritual (T = 12s)
        const cycle = clockTime % 12.0

        if (cycle < 3.2) {
          // Phase 1: Gazing out at raindrops, holding mug comfortably at chest
          setExpression('neutral')
          if (headGroupRef.current) {
            headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, -0.22, delta * 4)
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -0.06, delta * 4)
            headGroupRef.current.rotation.z = THREE.MathUtils.lerp(headGroupRef.current.rotation.z, 0, delta * 4)
          }
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.35, delta * 5)
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.15, delta * 5)
            rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, 0.15, delta * 5)
          }
          if (rightForearmRef.current) {
            rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.85, delta * 5)
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0.05, delta * 4)
            leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.04, delta * 4)
          }
        } else if (cycle < 4.8) {
          // Phase 2: Inhaling roasted aroma, lifts mug under nose, head tilts down
          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, 0.12, delta * 5)
            headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, -0.10, delta * 5)
          }
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.52, delta * 6)
          }
          if (rightForearmRef.current) {
            rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -1.20, delta * 6)
          }
        } else if (cycle < 7.5) {
          // Phase 3: Raising mug right to lips, head tilts back, eyes close to sip
          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -0.24, delta * 5)
            headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, -0.05, delta * 5)
          }
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.65, delta * 6)
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.12, delta * 6)
          }
          if (rightForearmRef.current) {
            rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -1.48, delta * 6)
          }
        } else if (cycle < 9.2) {
          // Phase 4: Lowering mug, exhaling warm breath, calm happy smile
          setExpression('happy')
          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, 0.02, delta * 4)
            headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, -0.15, delta * 4)
          }
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.25, delta * 4)
          }
          if (rightForearmRef.current) {
            rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.70, delta * 4)
          }
        } else {
          // Phase 5: Left hand raises forward, fingertips resting on window sill / pane
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.65, delta * 5)
            leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.16, delta * 5)
          }
          if (leftForearmRef.current) {
            leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.45, delta * 5)
          }
        }

      // ── SCENARIO 3: SÁNG (Morning - Full-Body Stretch & Water Hydration) ──
      } else {
        setCharacterAction('stretching')

        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.007, delta * 6)
        if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, delta * 6)
        if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, delta * 6)
        if (leftKneeRef.current) leftKneeRef.current.rotation.x = THREE.MathUtils.lerp(leftKneeRef.current.rotation.x, 0, delta * 6)
        if (rightKneeRef.current) rightKneeRef.current.rotation.x = THREE.MathUtils.lerp(rightKneeRef.current.rotation.x, 0, delta * 6)

        // Morning cycle: Stretch to the sun (0-3.5s) then drink water (3.5-6.5s)
        const cycle = clockTime % 7.0

        if (cycle < 3.5) {
          // Stretch Phase: Deep inhalation, heels elevate 0.02m (calf stretch), spine arches back, arms reach high
          setExpression('happy')
          const stretchT = cycle / 3.5
          const stretchPeak = Math.sin(stretchT * Math.PI)
          const microTremor = Math.sin(clockTime * 25.0) * 0.002 * (stretchT > 0.4 ? 1 : 0)

          groupRef.current.position.y = 0.007 + stretchPeak * 0.022 // Heels lift up

          if (upperBodyRef.current) {
            upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(upperBodyRef.current.rotation.x, -0.18 * stretchPeak, delta * 5)
            upperBodyRef.current.position.y = THREE.MathUtils.lerp(upperBodyRef.current.position.y, 0.015 * stretchPeak, delta * 5)
            upperBodyRef.current.position.x = 0
            upperBodyRef.current.rotation.y = 0
          }
          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -0.32 * stretchPeak, delta * 5)
            headGroupRef.current.rotation.y = 0
            headGroupRef.current.rotation.z = 0
          }
          if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -2.85 * stretchPeak + microTremor, delta * 6)
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -2.85 * stretchPeak - microTremor, delta * 6)
            leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.28 * stretchPeak, delta * 6)
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.28 * stretchPeak, delta * 6)
            leftArmRef.current.rotation.y = 0
            rightArmRef.current.rotation.y = 0
          }
          if (leftForearmRef.current && rightForearmRef.current) {
            leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.18 * stretchPeak, delta * 6)
            rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, -0.18 * stretchPeak, delta * 6)
          }
        } else if (cycle < 6.5) {
          // Drink Water Phase: Heels settle, left arm raises water bottle to sip
          groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0.007, delta * 6)

          if (upperBodyRef.current) {
            upperBodyRef.current.rotation.x = THREE.MathUtils.lerp(upperBodyRef.current.rotation.x, 0, delta * 4)
            upperBodyRef.current.position.y = THREE.MathUtils.lerp(upperBodyRef.current.position.y, 0, delta * 4)
          }
          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -0.18, delta * 5)
            headGroupRef.current.rotation.y = 0
            headGroupRef.current.rotation.z = 0
          }
          if (rightArmRef.current) {
            rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0.05, delta * 4)
            rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.05, delta * 4)
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.72, delta * 6)
            leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.16, delta * 6)
          }
          if (leftForearmRef.current) {
            leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -1.45, delta * 6)
          }
        } else {
          // Relaxed finish: lowers bottle, contented smile
          setExpression('happy')
          if (headGroupRef.current) {
            headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, 0, delta * 4)
          }
          if (leftArmRef.current) {
            leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.2, delta * 4)
          }
          if (leftForearmRef.current) {
            leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, -0.5, delta * 4)
          }
        }
      }
    }
  })

  return (
    <>
      <group
        ref={groupRef}
        scale={scaleSync.current}
        onClick={handleClick}
        onPointerDown={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        {...props}
      >
        {/* ── 1. Raycast Hit-Box ── */}
        <mesh position={[0, 0.65, 0.02]}>
          <cylinderGeometry args={[0.26, 0.28, 1.35, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* ── 2. Articulated Legs (Hips + Knees + Retro High-Tops) ── */}
        <group ref={leftLegRef} position={[-0.068, 0.435, 0.002]}>
          <Thigh side="left" />
          <group ref={leftKneeRef} position={[0, -0.145, 0]}>
            <CalfAndShoe side="left" />
          </group>
        </group>

        <group ref={rightLegRef} position={[0.068, 0.435, 0.002]}>
          <Thigh side="right" />
          <group ref={rightKneeRef} position={[0, -0.145, 0]}>
            <CalfAndShoe side="right" />
          </group>
        </group>

        {/* ── 3. Upper Body (Breathing group with Chest, Articulated Arms, Head) ── */}
        <group ref={upperBodyRef}>
          {/* Layered Flannel & Tee Torso */}
          <Torso />

          {/* Articulated Arms with Elbow Pivots (Container Offset Shoulder Pivots) */}
          <group ref={leftArmRef} position={[-0.158, 0.672, 0]}>
            <group position={[0.158, -0.672, 0]}>
              <Arm side="left" activePreset={activePreset} forearmRef={leftForearmRef} />
            </group>
          </group>
          <group ref={rightArmRef} position={[0.158, 0.672, 0]}>
            <group position={[-0.158, -0.672, 0]}>
              <Arm side="right" activePreset={activePreset} forearmRef={rightForearmRef} />
            </group>
          </group>

          {/* Head & Hair (Container Offset Neck Pivot) */}
          <group ref={headGroupRef} position={[0, 0.758, 0.008]}>
            <group position={[0, -0.758, -0.008]}>
              <Head expression={expression} isBlinking={isBlinking} />
              <Hair />
            </group>
          </group>
        </group>

        {/* ── 5. Intelligent Speech Bubble (Auto Camera-Oriented) ── */}
        <SpeechBubble visible={bubbleVisible} message={currentMessage} />
      </group>

      {/* ── 6. World-Space Decoupled Visual Effects ── */}
      {activePreset === 'sunset' && <FloatingHearts />}
      {activePreset === 'night' && <FloatingZzz headPosRef={headWorldPos} />}
    </>
  )
}

export default PixelPerson
