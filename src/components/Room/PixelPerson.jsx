import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import { useSounds } from '../../utils/useSounds'

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

  // Pants – Selvedge dark raw denim
  pantsDenim:   '#1A2230',
  pantsDark:    '#111827',
  pantsCuff:    '#2E3848',
  beltLeather:  '#3E2723',
  beltBuckle:   '#D4AF37',

  // Retro High-Top Sneakers (Air Jordan 1 Chicago / Royal Aesthetic)
  shoeSoleWhite:'#FFFFFF',
  shoeMidsole:  '#F1F5F9',
  shoeBlack:    '#0F172A',
  shoeRed:      '#DC2626',
  shoeLace:     '#FFFFFF',
}

// ─── Interaction Data ──────────────────────────────────────────────────────────
const INTERACTIONS = [
  { messageKey: 'pixelPerson.m0', expression: 'happy',   behavior: 'bounce',  sound: 'charHappy', dismissDelay: 3800, moodDuration: 2200 },
  { messageKey: 'pixelPerson.m1', expression: 'neutral', behavior: 'nod',     sound: 'charPop',   dismissDelay: 3600, moodDuration: 1600 },
  { messageKey: 'pixelPerson.m2', expression: 'neutral', behavior: 'sway',    sound: 'charPop',   dismissDelay: 4000, moodDuration: 1600 },
  { messageKey: 'pixelPerson.m3', expression: 'neutral', behavior: 'nod',     sound: 'charPop',   dismissDelay: 3600, moodDuration: 1600 },
  { messageKey: 'pixelPerson.m4', expression: 'shy',     behavior: 'droop',   sound: 'charShy',   dismissDelay: 4200, moodDuration: 3000 },
  { messageKey: 'pixelPerson.m5', expression: 'tired',   behavior: 'sway',    sound: 'charTired', dismissDelay: 3800, moodDuration: 3000 },
  { messageKey: 'pixelPerson.m6', expression: 'angry',   behavior: 'tremble', sound: 'charAngry', dismissDelay: 3200, moodDuration: 2500 },
  { messageKey: 'pixelPerson.m7', expression: 'happy',   behavior: 'bounce',  sound: 'charHappy', dismissDelay: 3800, moodDuration: 2200 },
]

// ─── Reusable Rounded Voxel Helper ──────────────────────────────────────────────
function Voxel({
  position = [0, 0, 0],
  args = [0.1, 0.1, 0.1],
  color = '#FFFFFF',
  rotation = [0, 0, 0],
  radius = 0.008,
  smoothness = 4,
  roughness = 0.65,
  metalness = 0.04,
  transparent = false,
  opacity = 1,
}) {
  return (
    <RoundedBox
      position={position}
      args={args}
      rotation={rotation}
      radius={radius}
      smoothness={smoothness}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        transparent={transparent}
        opacity={opacity}
      />
    </RoundedBox>
  )
}

// ─── Intelligent Speech Bubble (Auto Camera-Oriented via Billboard) ────────────
function SpeechBubble({ visible, message }) {
  const bubbleRef = useRef()
  const floatRef  = useRef()
  const scaleRef  = useRef(0)

  useFrame((state, delta) => {
    if (!bubbleRef.current) return

    // Elastic pop in / out scale
    const target = visible ? 1 : 0
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 12)
    const s = scaleRef.current
    bubbleRef.current.scale.set(s, s, s)
    bubbleRef.current.visible = s > 0.005

    // Floating micro-bob
    if (floatRef.current && s > 0.005) {
      floatRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 0.018
    }
  })

  // Shared bubble materials
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
          <RoundedBox args={[1.32, 0.78, 0.03]} radius={0.12} smoothness={8} position={[0.025, -0.025, -0.04]}>
            <meshStandardMaterial {...shadowMat} />
          </RoundedBox>

          {/* Outer Border Layer */}
          <RoundedBox args={[1.28, 0.74, 0.09]} radius={0.11} smoothness={10} position={[0, 0, 0]}>
            <meshStandardMaterial {...borderMat} />
          </RoundedBox>

          {/* Inner Cream Bubble Body */}
          <RoundedBox args={[1.20, 0.66, 0.085]} radius={0.09} smoothness={10} position={[0, 0, 0.008]}>
            <meshStandardMaterial {...fillMat} />
          </RoundedBox>

          {/* Top Gloss Highlight Strip */}
          <RoundedBox args={[0.58, 0.045, 0.015]} radius={0.02} smoothness={6} position={[-0.15, 0.245, 0.055]}>
            <meshStandardMaterial {...glossMat} />
          </RoundedBox>
          <RoundedBox args={[0.08, 0.035, 0.015]} radius={0.015} smoothness={6} position={[-0.48, 0.235, 0.055]}>
            <meshStandardMaterial {...glossMat} />
          </RoundedBox>

          {/* Subtle Bottom Warm Shadow Line */}
          <RoundedBox args={[0.96, 0.035, 0.01]} radius={0.016} smoothness={6} position={[0, -0.255, 0.053]}>
            <meshStandardMaterial {...warmLineMat} />
          </RoundedBox>

          {/* Tail – Smooth stepped pointer pointing down to host */}
          <RoundedBox args={[0.16, 0.14, 0.075]} radius={0.025} smoothness={6} position={[0.18, -0.40, 0.002]} rotation={[0, 0, -0.42]}>
            <meshStandardMaterial {...borderMat} />
          </RoundedBox>
          <RoundedBox args={[0.13, 0.11, 0.07]} radius={0.02} smoothness={6} position={[0.18, -0.40, 0.009]} rotation={[0, 0, -0.42]}>
            <meshStandardMaterial {...fillMat} />
          </RoundedBox>

          <RoundedBox args={[0.10, 0.09, 0.06]} radius={0.018} smoothness={6} position={[0.24, -0.48, 0.001]} rotation={[0, 0, -0.42]}>
            <meshStandardMaterial {...borderMat} />
          </RoundedBox>
          <RoundedBox args={[0.075, 0.07, 0.055]} radius={0.014} smoothness={6} position={[0.24, -0.48, 0.007]} rotation={[0, 0, -0.42]}>
            <meshStandardMaterial {...fillMat} />
          </RoundedBox>

          {/* Crisp Text with High Legibility */}
          <Text
            renderOrder={105}
            position={[0, 0.012, 0.06]}
            fontSize={0.082}
            color="#241B12"
            anchorX="center"
            anchorY="middle"
            maxWidth={0.96}
            lineHeight={1.52}
            letterSpacing={0.008}
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

// ─── Refined Eyes with Catchlight Speculars & Natural Depth ─────────────────────
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

  // 1. Happy Crescent Eyes
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

  // 2. Tired / Sleepy Eyes
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

  // 3. Shy / Sweet Looking Down
  if (expression === 'shy') {
    return (
      <group position={[x, 0.902, baseZ]}>
        <Voxel position={[0, 0.026, 0.003]} args={[eyeWidth + 0.006, 0.012, 0.007]} color={C.eyeRim} radius={0.004} />
        <Voxel position={[0, 0, 0.001]} args={[eyeWidth, eyeHeight, 0.006]} color={C.eyeWhite} radius={0.004} />
        <Voxel position={[side === 'left' ? 0.004 : -0.004, -0.01, 0.003]} args={[0.034, 0.034, 0.006]} color={C.eyeIrisTop} radius={0.004} />
        <Voxel position={[side === 'left' ? 0.004 : -0.004, -0.014, 0.004]} args={[0.030, 0.016, 0.006]} color={C.eyeIrisMid} radius={0.003} />
        <Voxel position={[side === 'left' ? -0.004 : 0.004, -0.006, 0.006]} args={[0.014, 0.014, 0.005]} color={C.eyeHighlight} radius={0.003} />
        <Voxel position={[side === 'left' ? 0.008 : -0.008, -0.018, 0.006]} args={[0.008, 0.008, 0.004]} color={C.eyeHighlight} radius={0.002} />
      </group>
    )
  }

  // 4. Angry / Determined Sharp Eyes
  if (expression === 'angry') {
    return (
      <group position={[x, 0.905, baseZ]}>
        <Voxel position={[0, 0.024, 0.004]} args={[eyeWidth + 0.008, 0.016, 0.008]} color={C.skinShadow} radius={0.003} />
        <Voxel position={[0, 0.029, 0.005]} args={[eyeWidth + 0.01, 0.012, 0.008]} color={C.eyeRim} radius={0.004} />
        <Voxel position={[0, -0.004, 0.001]} args={[eyeWidth, eyeHeight * 0.85, 0.006]} color={C.eyeWhite} radius={0.004} />
        <Voxel position={[side === 'left' ? 0.006 : -0.006, -0.004, 0.003]} args={[0.034, 0.034, 0.006]} color={C.eyeIrisTop} radius={0.003} />
        <Voxel position={[side === 'left' ? 0.002 : -0.002, 0.002, 0.005]} args={[0.011, 0.011, 0.004]} color={C.eyeHighlight} radius={0.002} />
      </group>
    )
  }

  // 5. Default / Neutral – Clean, Handsome & Expressive
  return (
    <group position={[x, 0.905, baseZ]}>
      {/* Top Eyelash/Rim */}
      <Voxel position={[0, 0.028, 0.003]} args={[eyeWidth + 0.006, 0.012, 0.007]} color={C.eyeRim} radius={0.004} />

      {/* Sclera (Eye White) */}
      <Voxel position={[0, 0, 0.001]} args={[eyeWidth, eyeHeight, 0.006]} color={C.eyeWhite} radius={0.004} />

      {/* Eye Shadow on upper sclera for depth */}
      <Voxel position={[0, 0.018, 0.002]} args={[eyeWidth, 0.012, 0.006]} color={C.eyeShadow} opacity={0.6} transparent radius={0.002} />

      {/* Iris – Dual Tone Sapphire */}
      <Voxel position={[0, -0.002, 0.003]} args={[0.036, 0.044, 0.006]} color={C.eyeIrisTop} radius={0.004} />
      <Voxel position={[0, -0.012, 0.004]} args={[0.032, 0.020, 0.006]} color={C.eyeIrisMid} radius={0.003} />
      <Voxel position={[0, -0.018, 0.004]} args={[0.022, 0.008, 0.006]} color={C.eyeIrisLight} radius={0.002} />

      {/* Double Specular Catchlights (Primary & Secondary reflection) */}
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

  if (expression === 'angry') {
    y = 0.942
    rotZ = side === 'left' ? 0.28 : -0.28
  } else if (expression === 'shy') {
    y = 0.946
    rotZ = side === 'left' ? -0.16 : 0.16
  } else if (expression === 'happy') {
    y = 0.954
    rotZ = side === 'left' ? -0.08 : 0.08
  } else if (expression === 'tired') {
    y = 0.944
    rotZ = side === 'left' ? -0.18 : 0.18
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

// ─── Mouth & Facial Extras (Blush, Smile, Dimple) ──────────────────────────────
function MouthAndFeatures({ expression }) {
  const z = 0.116

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

  if (expression === 'shy') {
    return (
      <group>
        <Voxel position={[-0.094, 0.882, z - 0.001]} args={[0.054, 0.028, 0.005]} color={C.blush} opacity={0.88} transparent radius={0.006} />
        <Voxel position={[ 0.094, 0.882, z - 0.001]} args={[0.054, 0.028, 0.005]} color={C.blush} opacity={0.88} transparent radius={0.006} />
        <Voxel position={[0, 0.842, z]} args={[0.038, 0.013, 0.006]} color={C.lip} radius={0.004} />
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

  if (expression === 'angry') {
    return (
      <group>
        <Voxel position={[0, 0.842, z]} args={[0.056, 0.013, 0.006]} color={C.eyeRim} radius={0.004} />
        <Voxel position={[-0.025, 0.838, z]} args={[0.014, 0.016, 0.006]} color={C.eyeRim} radius={0.003} />
        <Voxel position={[ 0.025, 0.846, z]} args={[0.014, 0.014, 0.006]} color={C.eyeRim} radius={0.003} />
      </group>
    )
  }

  // Default / Neutral – Handsome subtle smirk with soft cheek warmth
  return (
    <group>
      <Voxel position={[-0.094, 0.880, z - 0.001]} args={[0.040, 0.020, 0.005]} color={C.blush} opacity={0.45} transparent radius={0.005} />
      <Voxel position={[ 0.094, 0.880, z - 0.001]} args={[0.040, 0.020, 0.005]} color={C.blush} opacity={0.45} transparent radius={0.005} />
      <Voxel position={[0.004, 0.842, z]} args={[0.052, 0.013, 0.006]} color={C.lip} radius={0.004} />
      <Voxel position={[0.028, 0.846, z]} args={[0.012, 0.016, 0.006]} color={C.lip} radius={0.003} />
    </group>
  )
}

// ─── Nose & Sculpted 3D Ears ───────────────────────────────────────────────────
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

// ─── Complete Head Component ───────────────────────────────────────────────────
function Head({ expression = 'neutral', isBlinking = false }) {
  return (
    <group>
      {/* Main Cranium / Skull Box */}
      <Voxel position={[0, 0.895, 0.006]} args={[0.224, 0.222, 0.212]} color={C.skin} radius={0.022} />

      {/* Jawline & Chin Sculpting */}
      <Voxel position={[0, 0.804, 0.024]} args={[0.165, 0.045, 0.155]} color={C.skin} radius={0.014} />

      {/* Neck */}
      <Voxel position={[0, 0.758, 0.008]} args={[0.095, 0.068, 0.095]} color={C.skinShadow} radius={0.012} />

      {/* 3D Ears & Nose */}
      <NoseAndEars />

      {/* Eyes & Catchlights */}
      <Eye side="left"  expression={expression} isBlinking={isBlinking} />
      <Eye side="right" expression={expression} isBlinking={isBlinking} />

      {/* Eyebrows */}
      <Eyebrow side="left"  expression={expression} />
      <Eyebrow side="right" expression={expression} />

      {/* Dynamic Mouth & Features */}
      <MouthAndFeatures expression={expression} />
    </group>
  )
}

// ─── Layered Aesthetic Haircut (Textured Modern Crop / Wavy Quiff) ──────────────
function Hair() {
  return (
    <group>
      {/* 1. Main Top Crown Mass */}
      <Voxel position={[0, 1.012, 0.008]} args={[0.234, 0.068, 0.220]} color={C.hairDeep} radius={0.02} />

      {/* 2. Textured Front Quiff (Volume forward and up) */}
      <Voxel position={[-0.01, 1.036, 0.046]} args={[0.208, 0.054, 0.142]} color={C.hairBase} radius={0.018} />
      <Voxel position={[-0.04, 1.054, 0.058]} args={[0.132, 0.038, 0.108]} color={C.hairMid} radius={0.016} />
      <Voxel position={[-0.02, 1.066, 0.064]} args={[0.078, 0.024, 0.068]} color={C.hairLight} radius={0.012} />

      {/* 3. Textured Fringe / Bangs (Draping over forehead naturally) */}
      <Voxel position={[-0.064, 0.978, 0.106]} args={[0.076, 0.052, 0.032]} color={C.hairDeep} radius={0.01} />
      <Voxel position={[ 0.012, 0.984, 0.108]} args={[0.086, 0.044, 0.030]} color={C.hairBase} radius={0.01} />
      <Voxel position={[ 0.076, 0.990, 0.104]} args={[0.054, 0.036, 0.028]} color={C.hairDeep} radius={0.01} />
      <Voxel position={[-0.032, 0.962, 0.114]} args={[0.036, 0.028, 0.018]} color={C.hairMid} radius={0.008} />

      {/* 4. Side Fades / Sideburns */}
      <Voxel position={[-0.118, 0.966, 0.008]} args={[0.034, 0.115, 0.205]} color={C.hairDeep} radius={0.012} />
      <Voxel position={[-0.120, 0.925, 0.032]} args={[0.022, 0.054, 0.048]} color={C.hairBase} radius={0.008} />
      <Voxel position={[ 0.118, 0.966, 0.008]} args={[0.034, 0.115, 0.205]} color={C.hairDeep} radius={0.012} />
      <Voxel position={[ 0.120, 0.925, 0.032]} args={[0.022, 0.054, 0.048]} color={C.hairBase} radius={0.008} />

      {/* 5. Back Nape Taper */}
      <Voxel position={[0, 0.952, -0.104]} args={[0.222, 0.145, 0.034]} color={C.hairDeep} radius={0.014} />
      <Voxel position={[0, 0.875, -0.098]} args={[0.182, 0.065, 0.028]} color={C.hairBase} radius={0.01} />
    </group>
  )
}

// ─── Torso (Layered Flannel Overshirt + Ribbed Tee + Lapel Collar) ──────────────
function Torso() {
  return (
    <group>
      {/* 1. Inner White Ribbed Crewneck Tee */}
      <Voxel position={[0, 0.582, 0.002]} args={[0.198, 0.245, 0.134]} color={C.shirtCream} radius={0.012} />
      <Voxel position={[0, 0.708, 0.015]} args={[0.125, 0.028, 0.105]} color={C.shirtRib} radius={0.008} />

      {/* 2. Outer Heavy Flannel Shirt – Left & Right Panels (Open front style) */}
      <Voxel position={[-0.088, 0.578, 0.012]} args={[0.058, 0.248, 0.136]} color={C.flannelNavy} radius={0.014} />
      <Voxel position={[-0.088, 0.635, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[-0.088, 0.525, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[-0.088, 0.580, 0.015]} args={[0.059, 0.009, 0.138]} color={C.flannelOat} opacity={0.8} transparent radius={0.004} />

      <Voxel position={[ 0.088, 0.578, 0.012]} args={[0.058, 0.248, 0.136]} color={C.flannelBlue} radius={0.014} />
      <Voxel position={[ 0.088, 0.635, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[ 0.088, 0.525, 0.014]} args={[0.059, 0.026, 0.138]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[ 0.088, 0.580, 0.015]} args={[0.059, 0.009, 0.138]} color={C.flannelOat} opacity={0.8} transparent radius={0.004} />

      {/* 3. Back of Flannel Shirt */}
      <Voxel position={[0, 0.578, -0.068]} args={[0.226, 0.248, 0.024]} color={C.flannelNavy} radius={0.012} />
      <Voxel position={[0, 0.635, -0.069]} args={[0.227, 0.026, 0.025]} color={C.flannelDark} radius={0.008} />
      <Voxel position={[0, 0.525, -0.069]} args={[0.227, 0.026, 0.025]} color={C.flannelDark} radius={0.008} />

      {/* 4. Folded Flannel Collar (Realistic 3D Lapels) */}
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

      {/* 5. Chest Pocket & Metal Stylus Pen Clip */}
      <Voxel position={[-0.085, 0.605, 0.082]} args={[0.042, 0.048, 0.010]} color={C.flannelDark} radius={0.004} />
      <Voxel position={[-0.082, 0.622, 0.088]} args={[0.008, 0.028, 0.006]} color={C.penSilver} metalness={0.85} roughness={0.2} radius={0.002} />

      {/* 6. Leather Belt & Brass Buckle */}
      <Voxel position={[0, 0.448, 0.002]} args={[0.218, 0.038, 0.136]} color={C.beltLeather} radius={0.006} />
      <Voxel position={[0, 0.448, 0.071]} args={[0.042, 0.032, 0.008]} color={C.beltBuckle} metalness={0.8} roughness={0.25} radius={0.004} />
    </group>
  )
}

// ─── Arms with Shoulder Joints & Rolled Cuffs ──────────────────────────────────
function Arm({ side }) {
  const isLeft = side === 'left'
  const x = isLeft ? -0.158 : 0.158
  const baseColor = isLeft ? C.flannelNavy : C.flannelBlue

  return (
    <group position={[x, 0, 0]}>
      {/* Shoulder Cap Pivot */}
      <Voxel position={[0, 0.672, 0]} args={[0.074, 0.068, 0.118]} color={baseColor} radius={0.016} />

      {/* Upper Arm Sleeve */}
      <Voxel position={[0, 0.585, 0]} args={[0.068, 0.138, 0.108]} color={baseColor} radius={0.014} />
      <Voxel position={[0, 0.612, 0]} args={[0.070, 0.022, 0.110]} color={C.flannelDark} radius={0.006} />

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
    </group>
  )
}

// ─── Pants with Cuffed Ankle Hems ───────────────────────────────────────────────
function PantsLeg({ side }) {
  const isLeft = side === 'left'
  const x = isLeft ? -0.068 : 0.068

  return (
    <group position={[x, 0, 0]}>
      {/* Hip / Thigh Upper Leg */}
      <Voxel position={[0, 0.362, 0.002]} args={[0.096, 0.145, 0.118]} color={C.pantsDenim} radius={0.014} />
      {/* Lower Leg */}
      <Voxel position={[0, 0.224, 0.002]} args={[0.088, 0.148, 0.110]} color={C.pantsDenim} radius={0.012} />
      {/* Selvedge Rolled Pinroll Cuff */}
      <Voxel position={[0, 0.142, 0.002]} args={[0.094, 0.036, 0.116]} color={C.pantsCuff} radius={0.006} />
    </group>
  )
}

// ─── Iconic Retro High-Top Sneakers (Air Jordan 1 "Chicago" Voxel Style) ────────
function Shoe({ side }) {
  const isLeft = side === 'left'
  const x = isLeft ? -0.068 : 0.068

  return (
    <group position={[x, 0, 0]}>
      {/* 1. Black Outsole Grip */}
      <Voxel position={[0, 0.010, 0.012]} args={[0.108, 0.020, 0.222]} color={C.shoeBlack} radius={0.006} />

      {/* 2. Sculpted White Midsole */}
      <Voxel position={[0, 0.032, 0.012]} args={[0.106, 0.028, 0.220]} color={C.shoeSoleWhite} radius={0.008} />

      {/* 3. Toe Box Base (White Leather) */}
      <Voxel position={[0, 0.058, 0.076]} args={[0.094, 0.038, 0.084]} color={C.shoeSoleWhite} radius={0.008} />
      <Voxel position={[0, 0.052, 0.104]} args={[0.098, 0.028, 0.034]} color={C.shoeBlack} radius={0.006} />

      {/* 4. Ankle Collar High-Top (Iconic Crimson Red) */}
      <Voxel position={[0, 0.104, -0.038]} args={[0.098, 0.095, 0.114]} color={C.shoeRed} radius={0.012} />
      <Voxel position={[0, 0.138, -0.038]} args={[0.102, 0.026, 0.104]} color={C.shoeBlack} radius={0.006} />

      {/* 5. Side Quarter & Swoosh Accent */}
      <Voxel position={[0, 0.064, -0.004]} args={[0.098, 0.048, 0.096]} color={C.shoeSoleWhite} radius={0.008} />
      <Voxel
        position={[isLeft ? -0.051 : 0.051, 0.072, -0.012]}
        args={[0.006, 0.026, 0.108]}
        color={C.shoeBlack}
        radius={0.003}
      />

      {/* 6. Tongue & Clean White Criss-Cross Laces */}
      <Voxel position={[0, 0.084, 0.032]} args={[0.072, 0.065, 0.036]} color={C.shoeSoleWhite} radius={0.006} />
      <Voxel position={[0, 0.072, 0.048]} args={[0.068, 0.010, 0.014]} color={C.shoeLace} radius={0.003} />
      <Voxel position={[0, 0.092, 0.042]} args={[0.064, 0.010, 0.014]} color={C.shoeLace} radius={0.003} />
    </group>
  )
}

// ─── Main PixelPerson Component ────────────────────────────────────────────────
function PixelPerson({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0], ...props }) {
  const groupRef       = useRef()
  const upperBodyRef   = useRef()
  const headGroupRef   = useRef()
  const leftArmRef     = useRef()
  const rightArmRef    = useRef()
  const scaleSync      = useRef(typeof scale === 'number' ? scale : 1)

  const [interactionIndex, setInteractionIndex] = useState(-1)
  const indexRef               = useRef(-1)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [expression, setExpression] = useState('neutral')
  const [isBlinking, setIsBlinking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const behaviorRef            = useRef('nod')
  const behaviorIntensityRef   = useRef(1)
  const dismissTimer           = useRef(null)
  const moodTimer              = useRef(null)
  const blinkTimer             = useRef(null)
  const welcomeTimer           = useRef(null)

  const { t } = useTranslation()
  const { playSound } = useSounds()

  // Click / Tap Handler: cycles dialogue, changes expression, triggers sound
  const handleClick = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (welcomeTimer.current) clearTimeout(welcomeTimer.current)
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    if (moodTimer.current) clearTimeout(moodTimer.current)

    const next = (indexRef.current + 1) % INTERACTIONS.length
    indexRef.current = next
    setInteractionIndex(next)
    const interaction = INTERACTIONS[next]

    setBubbleVisible(true)
    playSound(interaction.sound)

    // Trigger snappy blink -> swap expression -> open eyes
    setIsBlinking(true)
    setTimeout(() => {
      setExpression(interaction.expression)
      behaviorRef.current = interaction.behavior
      behaviorIntensityRef.current = 0
      setTimeout(() => setIsBlinking(false), 90)
    }, 90)

    // Auto dismiss bubble & restore calm mood
    dismissTimer.current = setTimeout(() => {
      setBubbleVisible(false)
      moodTimer.current = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => {
          setExpression('neutral')
          behaviorRef.current = 'nod'
          behaviorIntensityRef.current = 0
          setTimeout(() => setIsBlinking(false), 90)
        }, 90)
      }, interaction.moodDuration)
    }, interaction.dismissDelay)
  }, [playSound])

  // Welcoming first visit popup after 1.8 seconds if not interacted
  useEffect(() => {
    welcomeTimer.current = setTimeout(() => {
      if (indexRef.current === -1) {
        indexRef.current = 0
        setInteractionIndex(0)
        setBubbleVisible(true)
        setExpression('happy')
        behaviorRef.current = 'bounce'
        behaviorIntensityRef.current = 0
        playSound('charHappy')

        dismissTimer.current = setTimeout(() => {
          setBubbleVisible(false)
          moodTimer.current = setTimeout(() => {
            setExpression('neutral')
            behaviorRef.current = 'nod'
            behaviorIntensityRef.current = 0
          }, 2000)
        }, 4000)
      }
    }, 1800)

    return () => {
      if (welcomeTimer.current) clearTimeout(welcomeTimer.current)
    }
  }, [playSound])

  // Periodic Natural Idle Blink (every 3.5 to 6s)
  useEffect(() => {
    let active = true
    const scheduleNextBlink = () => {
      const delay = 3500 + Math.random() * 2500
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
      if (moodTimer.current) clearTimeout(moodTimer.current)
    }
  }, [])

  // Cursor Hover Feedback
  const handlePointerOver = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setIsHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    setIsHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  // Dynamic Natural Multi-Angle Living Animation
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Smooth behavior intensity lerp
    behaviorIntensityRef.current = Math.min(1, behaviorIntensityRef.current + delta * 2.5)
    const i = behaviorIntensityRef.current

    // Base rhythmic natural breathing (ONLY acts on upper body; feet stay 100% grounded)
    const baseChestY = Math.sin(t * 1.5) * 0.005
    const baseArmZ   = Math.sin(t * 1.5) * 0.025
    const baseHeadZ  = Math.sin(t * 0.8) * 0.015

    let targetChestY = baseChestY
    let targetHeadX  = 0
    let targetHeadZ  = baseHeadZ
    let targetArmX   = Math.sin(t * 1.5) * 0.04
    let targetArmZ   = baseArmZ

    switch (behaviorRef.current) {
      case 'bounce':
        targetChestY = Math.sin(t * 5.0) * 0.018
        targetHeadX  = Math.sin(t * 5.0) * 0.04
        targetArmX   = Math.sin(t * 5.0) * 0.15
        targetArmZ   = 0.08 + Math.sin(t * 5.0) * 0.05
        break
      case 'sway':
        targetChestY = Math.sin(t * 1.0) * 0.004
        targetHeadZ  = Math.sin(t * 1.0) * 0.05
        targetArmX   = Math.sin(t * 1.0) * 0.06
        targetArmZ   = Math.cos(t * 1.0) * 0.04
        break
      case 'droop':
        targetChestY = Math.sin(t * 1.2) * 0.003
        targetHeadX  = 0.08
        targetHeadZ  = -0.04
        targetArmX   = -0.04
        targetArmZ   = 0.02
        break
      case 'tremble':
        targetChestY = Math.sin(t * 18.0) * 0.006
        targetHeadX  = Math.sin(t * 16.0) * 0.03
        targetHeadZ  = Math.sin(t * 18.0) * 0.04
        targetArmX   = Math.sin(t * 18.0) * 0.06
        break
      default:
        targetChestY = baseChestY
        targetHeadX  = Math.sin(t * 2.2) * 0.03
        break
    }

    // Apply upper body gentle breathing
    if (upperBodyRef.current) {
      upperBodyRef.current.position.y = THREE.MathUtils.lerp(
        upperBodyRef.current.position.y,
        targetChestY,
        delta * 6
      )
    }

    // Head tilt with gentle look-at damping
    if (headGroupRef.current) {
      headGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.z,
        targetHeadZ,
        delta * 5
      )
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.x,
        targetHeadX,
        delta * 5
      )
    }

    // Natural arm idle sway
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.x,
        targetArmX,
        delta * 4
      )
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        -targetArmX,
        delta * 4
      )
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.z,
        targetArmZ,
        delta * 4
      )
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        -targetArmZ,
        delta * 4
      )
    }
  })

  const currentMessage = interactionIndex >= 0 ? t(INTERACTIONS[interactionIndex].messageKey) : ''

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scaleSync.current}
      onClick={handleClick}
      onPointerDown={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      {...props}
    >
      {/* ── 1. Invisible Precise Raycast Hit-Box (Visible to raycaster, fully transparent on screen) ── */}
      <mesh position={[0, 0.65, 0.02]}>
        <cylinderGeometry args={[0.32, 0.32, 1.4, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ── 2. Feet & Retro Sneakers (Solidly grounded at y = 0, never clipping) ── */}
      <Shoe side="left" />
      <Shoe side="right" />

      {/* ── 3. Lower Body / Cuffed Denim Jeans ── */}
      <PantsLeg side="left" />
      <PantsLeg side="right" />

      {/* ── 4. Upper Body (Breathing group with Chest, Arms, Head) ── */}
      <group ref={upperBodyRef}>
        {/* Layered Flannel & Tee Torso */}
        <Torso />

        {/* Articulated Arms */}
        <group ref={leftArmRef}>
          <Arm side="left" />
        </group>
        <group ref={rightArmRef}>
          <Arm side="right" />
        </group>

        {/* Head & Hair with Expression & Blinking */}
        <group ref={headGroupRef}>
          <Head expression={expression} isBlinking={isBlinking} />
          <Hair />
        </group>
      </group>

      {/* ── 5. Intelligent Speech Bubble (Auto Camera-Oriented) ── */}
      <SpeechBubble visible={bubbleVisible} message={currentMessage} />
    </group>
  )
}

export default PixelPerson
