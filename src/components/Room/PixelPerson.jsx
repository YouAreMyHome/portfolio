import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import { useSounds } from '../../utils/useSounds'

// ─── Color Palette ─────────────────────────────────────────────────────────────
const C = {
  // Hair
  hairBlack: '#1A1A1A',
  hairDark:  '#2D2416',
  // Skin
  skin:      '#D4956A',
  skinDark:  '#B87D55',
  // Eyes / face
  eyeColor:  '#1a1a2e',
  eyeWhite:  '#F9FAFB',
  noseTip:   '#C07858',
  // Inner shirt – cream
  shirtCream: '#F5F0E8',
  shirtLine:  '#DDD5C0',
  // Flannel plaid outer shirt (blue + dark gray checkered)
  flannelBlue: '#2563EB',
  flannelAlt:  '#1D4ED8',
  flannelDark: '#1E3A5F',
  flannelGray: '#374151',
  // Pants
  pants:     '#1F2937',
  pantsDark: '#111827',
  // Shoes – Jordan high
  shoeBlack: '#0F172A',
  shoeWhite: '#F9FAFB',
  shoeRed:   '#DC2626',
  shoeSole:  '#F1F5F9',
}

// ─── Interaction data ──────────────────────────────────────────────────────────
const INTERACTIONS = [
  { messageKey: 'pixelPerson.m0', expression: 'happy',   behavior: 'bounce',  sound: 'charHappy', dismissDelay: 3500, moodDuration: 2000 },
  { messageKey: 'pixelPerson.m1', expression: 'neutral', behavior: 'nod',     sound: 'charPop',   dismissDelay: 3500, moodDuration: 1500 },
  { messageKey: 'pixelPerson.m2', expression: 'neutral', behavior: 'sway',    sound: 'charPop',   dismissDelay: 4000, moodDuration: 1500 },
  { messageKey: 'pixelPerson.m3', expression: 'neutral', behavior: 'nod',     sound: 'charPop',   dismissDelay: 3500, moodDuration: 1500 },
  { messageKey: 'pixelPerson.m4', expression: 'shy',     behavior: 'droop',   sound: 'charShy',   dismissDelay: 4000, moodDuration: 3000 },
  { messageKey: 'pixelPerson.m5', expression: 'tired',   behavior: 'sway',    sound: 'charTired', dismissDelay: 3500, moodDuration: 3000 },
  { messageKey: 'pixelPerson.m6', expression: 'angry',   behavior: 'tremble', sound: 'charAngry', dismissDelay: 3000, moodDuration: 2500 },
  { messageKey: 'pixelPerson.m7', expression: 'happy',   behavior: 'bounce',  sound: 'charHappy', dismissDelay: 3500, moodDuration: 2000 },
]

// ─── Speech Bubble ──────────────────────────────────────────────────────────────
function SpeechBubble({ visible, message }) {
  const bubbleRef = useRef()
  const floatRef  = useRef()
  const scaleRef  = useRef(0)

  useFrame((state, delta) => {
    if (!bubbleRef.current) return
    // Pop in / out
    const target = visible ? 1 : 0
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * 10)
    const s = scaleRef.current
    bubbleRef.current.scale.set(s, s, s)
    bubbleRef.current.visible = s > 0.01
    // Gentle floating bob
    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.014
    }
  })

  // Shared material props
  const borderMat   = { color: '#3D3530', roughness: 0.55, metalness: 0.06 }
  const fillMat     = { color: '#FFFBEF', roughness: 0.30, metalness: 0.0 }
  const shadowMat   = { color: '#1A120A', transparent: true, opacity: 0.18, roughness: 1 }
  const glossMat    = { color: '#FFFFFF', transparent: true, opacity: 0.52, roughness: 0.08 }
  const depthLineMat= { color: '#C8A87A', transparent: true, opacity: 0.28, roughness: 0.6 }

  return (
    <group ref={bubbleRef} position={[0.1, 1.65, -0.52]} rotation={[-0.42, 0, 0]} scale={0} frustumCulled={false}>
      <group ref={floatRef}>

        {/* ── 1. Soft drop shadow ── */}
        <RoundedBox args={[1.24, 0.82, 0.04]} radius={0.115} smoothness={8} position={[0.022, -0.022, -0.044]}>
          <meshStandardMaterial {...shadowMat} />
        </RoundedBox>

        {/* ── 2. Outer border layer ── */}
        <RoundedBox args={[1.21, 0.79, 0.122]} radius={0.106} smoothness={10} position={[0, 0, 0]}>
          <meshStandardMaterial {...borderMat} />
        </RoundedBox>

        {/* ── 3. Main cream body ── */}
        <RoundedBox args={[1.13, 0.71, 0.112]} radius={0.092} smoothness={10} position={[0, 0, 0.008]}>
          <meshStandardMaterial {...fillMat} />
        </RoundedBox>

        {/* ── 4. Gloss highlight strip top-centre ── */}
        <RoundedBox args={[0.58, 0.052, 0.018]} radius={0.022} smoothness={6} position={[-0.10, 0.268, 0.072]}>
          <meshStandardMaterial {...glossMat} />
        </RoundedBox>
        {/* Small gloss oval – top-left corner */}
        <RoundedBox args={[0.096, 0.038, 0.015]} radius={0.016} smoothness={6} position={[-0.46, 0.256, 0.072]}>
          <meshStandardMaterial {...glossMat} />
        </RoundedBox>

        {/* ── 5. Bottom inner-shadow strip (adds bowl depth) ── */}
        <RoundedBox args={[0.96, 0.048, 0.010]} radius={0.020} smoothness={6} position={[0, -0.278, 0.070]}>
          <meshStandardMaterial {...depthLineMat} />
        </RoundedBox>

        {/* ── 6. Tail – 3 stepped segments tapering to a point ── */}
        {/* Segment 1 – base */}
        <RoundedBox args={[0.188, 0.165, 0.095]} radius={0.028} smoothness={6}
          position={[0.300, -0.428, 0.002]} rotation={[0, 0, -0.40]}>
          <meshStandardMaterial {...borderMat} />
        </RoundedBox>
        <RoundedBox args={[0.164, 0.142, 0.086]} radius={0.022} smoothness={6}
          position={[0.300, -0.428, 0.012]} rotation={[0, 0, -0.40]}>
          <meshStandardMaterial {...fillMat} />
        </RoundedBox>

        {/* Segment 2 – middle */}
        <RoundedBox args={[0.130, 0.115, 0.078]} radius={0.020} smoothness={6}
          position={[0.364, -0.518, 0.000]} rotation={[0, 0, -0.40]}>
          <meshStandardMaterial {...borderMat} />
        </RoundedBox>
        <RoundedBox args={[0.106, 0.092, 0.068]} radius={0.016} smoothness={6}
          position={[0.364, -0.518, 0.009]} rotation={[0, 0, -0.40]}>
          <meshStandardMaterial {...fillMat} />
        </RoundedBox>

        {/* Segment 3 – tip */}
        <RoundedBox args={[0.078, 0.068, 0.058]} radius={0.014} smoothness={6}
          position={[0.420, -0.596, -0.002]} rotation={[0, 0, -0.40]}>
          <meshStandardMaterial {...borderMat} />
        </RoundedBox>
        <RoundedBox args={[0.050, 0.044, 0.046]} radius={0.010} smoothness={6}
          position={[0.420, -0.596, 0.006]} rotation={[0, 0, -0.40]}>
          <meshStandardMaterial {...fillMat} />
        </RoundedBox>

        {/* ── 7. Text – padded safely inside inner body ── */}
        {/* inner body width=1.13 → usable text width = 1.13 - 2×0.175 = 0.78 */}
        <Text
          renderOrder={102}
          position={[0, 0.008, 0.074]}
          fontSize={0.082}
          color="#292116"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.78}
          lineHeight={1.55}
          letterSpacing={0.006}
          overflowWrap="break-word"
          font={undefined}
          material-depthTest={false}
          material-depthWrite={false}
        >
          {message}
        </Text>

      </group>
    </group>
  )
}

// ─── Voxel helper ───────────────────────────────────────────────────────────────
function Voxel({ position, args, color, rotation = [0, 0, 0] }) {
  return (
    <RoundedBox
      position={position}
      args={args}
      rotation={rotation}
      radius={0.015}
      smoothness={3}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} />
    </RoundedBox>
  )
}

// ─── Face Expressions ───────────────────────────────────────────────────────────
// Renders eyes + mouth + optional extras per expression.
// All face features sit at z≈0.122–0.135 (proud of the head surface)
function FaceFeatures({ expression = 'neutral', blinking = false }) {
  const eyeZ = 0.118  // eye white depth
  const irisZ = 0.126 // iris depth (protrudes slightly past eye whites)

  // ── Eye whites – always the same ──
  const eyeWhites = (
    <>
      <Voxel position={[-0.075, 0.870, eyeZ]} args={[0.065, 0.046, 0.016]} color={C.eyeWhite} />
      <Voxel position={[ 0.055, 0.870, eyeZ]} args={[0.065, 0.046, 0.016]} color={C.eyeWhite} />
    </>
  )

  // ── Nose – always the same ──
  const nose = <Voxel position={[0.01, 0.835, 0.126]} args={[0.04, 0.05, 0.03]} color={C.noseTip} />

  let iris  = null
  let mouth = null
  let extras = null

  switch (expression) {
    // ── Happy / Relieved ────────────────────────────────────────────────────────
    case 'happy':
      iris = (
        <>
          <Voxel position={[-0.075, 0.869, irisZ]} args={[0.038, 0.036, 0.013]} color={C.eyeColor} />
          <Voxel position={[ 0.055, 0.869, irisZ]} args={[0.038, 0.036, 0.013]} color={C.eyeColor} />
          {/* Sparkle dots */}
          <Voxel position={[-0.062, 0.875, irisZ+0.005]} args={[0.012, 0.012, 0.008]} color="#FFFFFF" />
          <Voxel position={[ 0.068, 0.875, irisZ+0.005]} args={[0.012, 0.012, 0.008]} color="#FFFFFF" />
        </>
      )
      mouth = (
        <>
          {/* Wide smile – flat centre + raised corners */}
          <Voxel position={[ 0,      0.806, 0.124]} args={[0.052, 0.018, 0.011]} color={C.skinDark} />
          <Voxel position={[-0.035, 0.812, 0.124]} args={[0.016, 0.026, 0.011]} color={C.skinDark} />
          <Voxel position={[ 0.035, 0.812, 0.124]} args={[0.016, 0.026, 0.011]} color={C.skinDark} />
        </>
      )
      break

    // ── Shy / Flustered ─────────────────────────────────────────────────────────
    case 'shy':
      iris = (
        <>
          {/* Iris looking down */}
          <Voxel position={[-0.065, 0.857, irisZ]} args={[0.036, 0.030, 0.013]} color={C.eyeColor} />
          <Voxel position={[ 0.060, 0.857, irisZ]} args={[0.036, 0.030, 0.013]} color={C.eyeColor} />
        </>
      )
      mouth = <Voxel position={[0, 0.805, 0.123]} args={[0.046, 0.020, 0.011]} color={C.skinDark} />
      extras = (
        <>
          {/* Blush */}
          <Voxel position={[-0.095, 0.843, 0.102]} args={[0.056, 0.040, 0.010]} color="#F9A8D4" />
          <Voxel position={[ 0.095, 0.843, 0.102]} args={[0.056, 0.040, 0.010]} color="#F9A8D4" />
        </>
      )
      break

    // ── Tired / Sleepy ──────────────────────────────────────────────────────────
    case 'tired':
      iris = (
        <>
          {/* Iris near bottom of eye white */}
          <Voxel position={[-0.060, 0.855, irisZ]} args={[0.038, 0.026, 0.013]} color={C.eyeColor} />
          <Voxel position={[ 0.065, 0.855, irisZ]} args={[0.038, 0.026, 0.013]} color={C.eyeColor} />
        </>
      )
      mouth = (
        <>
          {/* Slight frown – flat centre + drooping corners */}
          <Voxel position={[ 0,      0.806, 0.123]} args={[0.050, 0.018, 0.011]} color={C.skinDark} />
          <Voxel position={[-0.033,  0.800, 0.123]} args={[0.016, 0.022, 0.011]} color={C.skinDark} />
          <Voxel position={[ 0.033,  0.800, 0.123]} args={[0.016, 0.022, 0.011]} color={C.skinDark} />
        </>
      )
      extras = (
        <>
          {/* Heavy eyelids – skin bar covering top ~40% of each eye */}
          <Voxel position={[-0.075, 0.883, eyeZ+0.004]} args={[0.068, 0.022, 0.019]} color={C.skin} />
          <Voxel position={[ 0.055, 0.883, eyeZ+0.004]} args={[0.068, 0.022, 0.019]} color={C.skin} />
        </>
      )
      break

    // ── Angry ───────────────────────────────────────────────────────────────────
    case 'angry':
      iris = (
        <>
          <Voxel position={[-0.060, 0.864, irisZ]} args={[0.038, 0.030, 0.013]} color={C.eyeColor} />
          <Voxel position={[ 0.070, 0.864, irisZ]} args={[0.038, 0.030, 0.013]} color={C.eyeColor} />
        </>
      )
      mouth = (
        <>
          {/* Frown – flat + downward corners */}
          <Voxel position={[ 0,      0.806, 0.123]} args={[0.050, 0.018, 0.011]} color={C.skinDark} />
          <Voxel position={[-0.033, 0.799, 0.123]}  args={[0.016, 0.024, 0.011]} color={C.skinDark} />
          <Voxel position={[ 0.033, 0.799, 0.123]}  args={[0.016, 0.024, 0.011]} color={C.skinDark} />
        </>
      )
      extras = (
        <>
          {/* Furrowed brows – angled inward */}
          <Voxel position={[-0.070, 0.906, eyeZ+0.010]} args={[0.074, 0.022, 0.018]} color={C.hairBlack} rotation={[0, 0,  0.32]} />
          <Voxel position={[ 0.054, 0.906, eyeZ+0.010]} args={[0.074, 0.022, 0.018]} color={C.hairBlack} rotation={[0, 0, -0.32]} />
          {/* Squinting eyelid bar */}
          <Voxel position={[-0.075, 0.879, eyeZ+0.004]} args={[0.068, 0.018, 0.019]} color={C.skin} />
          <Voxel position={[ 0.055, 0.879, eyeZ+0.004]} args={[0.068, 0.018, 0.019]} color={C.skin} />
        </>
      )
      break

    // ── Neutral (default / pensive) ─────────────────────────────────────────────
    default:
      iris = (
        <>
          <Voxel position={[-0.060, 0.865, irisZ]} args={[0.038, 0.035, 0.013]} color={C.eyeColor} />
          <Voxel position={[ 0.070, 0.865, irisZ]} args={[0.038, 0.035, 0.013]} color={C.eyeColor} />
        </>
      )
      mouth = <Voxel position={[0, 0.805, 0.123]} args={[0.070, 0.018, 0.011]} color={C.skinDark} />
      break
  }

  return (
    <>
      {eyeWhites}
      {nose}
      {iris}
      {mouth}
      {extras}
      {blinking && (
        <>
          <Voxel position={[-0.075, 0.870, eyeZ + 0.014]} args={[0.068, 0.052, 0.022]} color={C.skin} />
          <Voxel position={[ 0.055, 0.870, eyeZ + 0.014]} args={[0.068, 0.052, 0.022]} color={C.skin} />
        </>
      )}
    </>
  )
}

// ─── Body Parts ──────────────────────────────────────────────────────────────────
// Jordan high-top shoe (one foot)
function Shoe({ side }) {
  const x = side === 'left' ? -0.075 : 0.075
  return (
    <group position={[x, 0, 0]}>
      {/* Chunky sole */}
      <Voxel position={[0, 0.025, 0.01]} args={[0.12, 0.05, 0.22]} color={C.shoeSole} />
      {/* Main shoe body */}
      <Voxel position={[0, 0.085, 0.01]} args={[0.11, 0.09, 0.20]} color={C.shoeBlack} />
      {/* White ankle cap */}
      <Voxel position={[0, 0.14, -0.06]} args={[0.11, 0.06, 0.06]} color={C.shoeWhite} />
      {/* Red Nike-ish swoosh accent */}
      <Voxel position={[0.057, 0.09, 0.02]} args={[0.01, 0.04, 0.14]} color={C.shoeRed} />
      {/* Toe box white patch */}
      <Voxel position={[0, 0.065, 0.105]} args={[0.10, 0.06, 0.025]} color={C.shoeWhite} />
    </group>
  )
}

// Pants leg
function PantsLeg({ side }) {
  const x = side === 'left' ? -0.075 : 0.075
  return (
    <group position={[x, 0, 0]}>
      {/* Lower leg */}
      <Voxel position={[0, 0.18, 0]} args={[0.10, 0.14, 0.10]} color={C.pants} />
      {/* Upper leg */}
      <Voxel position={[0, 0.34, 0]} args={[0.11, 0.16, 0.11]} color={C.pants} />
    </group>
  )
}

// Torso with inner shirt + flannel outer
function Torso() {
  return (
    <group>
      {/* Inner cream shirt – main body */}
      <Voxel position={[0, 0.58, 0]} args={[0.20, 0.22, 0.13]} color={C.shirtCream} />
      {/* Flannel outer shirt – left panel */}
      <Voxel position={[-0.105, 0.58, 0]} args={[0.07, 0.21, 0.135]} color={C.flannelBlue} />
      {/* Flannel right panel */}
      <Voxel position={[0.105, 0.58, 0]} args={[0.07, 0.21, 0.135]} color={C.flannelAlt} />
      {/* Flannel plaid cross lines (dark) */}
      <Voxel position={[-0.105, 0.63, 0]} args={[0.07, 0.025, 0.14]} color={C.flannelDark} />
      <Voxel position={[-0.105, 0.52, 0]} args={[0.07, 0.025, 0.14]} color={C.flannelDark} />
      <Voxel position={[0.105, 0.63, 0]} args={[0.07, 0.025, 0.14]} color={C.flannelDark} />
      <Voxel position={[0.105, 0.52, 0]} args={[0.07, 0.025, 0.14]} color={C.flannelDark} />
      {/* Shirt collar (cream, folded out) */}
      <Voxel position={[-0.06, 0.71, 0.03]} args={[0.07, 0.04, 0.10]} color={C.shirtCream} rotation={[0.3, 0.15, 0.1]} />
      <Voxel position={[0.06, 0.71, 0.03]}  args={[0.07, 0.04, 0.10]} color={C.shirtCream} rotation={[0.3, -0.15, -0.1]} />
      {/* Hip/waist connector */}
      <Voxel position={[0, 0.455, 0]} args={[0.21, 0.07, 0.125]} color={C.pants} />
    </group>
  )
}

// Arm
function Arm({ side }) {
  const x = side === 'left' ? -0.16 : 0.16
  const flannelColor = side === 'left' ? C.flannelBlue : C.flannelAlt
  return (
    <group position={[x, 0, 0]}>
      {/* Upper arm */}
      <Voxel position={[0, 0.61, 0]} args={[0.08, 0.16, 0.10]} color={flannelColor} />
      {/* Plaid line on upper arm */}
      <Voxel position={[0, 0.64, 0]} args={[0.082, 0.02, 0.105]} color={C.flannelDark} />
      {/* Forearm (slightly rolled up) */}
      <Voxel position={[0, 0.46, 0]} args={[0.075, 0.14, 0.09]} color={flannelColor} />
      {/* Rolled-up cuff */}
      <Voxel position={[0, 0.395, 0]} args={[0.08, 0.03, 0.095]} color={C.flannelGray} />
      {/* Hand */}
      <Voxel position={[0, 0.345, 0.01]} args={[0.07, 0.08, 0.08]} color={C.skin} />
    </group>
  )
}

// Head – expression-aware
function Head({ expression = 'neutral', blinking = false }) {
  return (
    <group>
      {/* Head base */}
      <Voxel position={[0, 0.855, 0.01]} args={[0.225, 0.22, 0.215]} color={C.skin} />
      {/* Cheek shadows */}
      <Voxel position={[-0.09, 0.845, 0.07]} args={[0.05, 0.09, 0.04]} color={C.skinDark} />
      <Voxel position={[0.09,  0.845, 0.07]} args={[0.05, 0.09, 0.04]} color={C.skinDark} />
      {/* Neck */}
      <Voxel position={[0, 0.738, 0.005]} args={[0.09, 0.06, 0.09]} color={C.skin} />
      {/* Dynamic face features */}
      <FaceFeatures expression={expression} blinking={blinking} />
    </group>
  )
}

// Hair – voluminous black, slightly wavy on top
function Hair() {
  return (
    <group>
      {/* Main hair mass – top */}
      <Voxel position={[0,    0.975, 0.005]} args={[0.230, 0.115, 0.215]} color={C.hairBlack} />
      {/* Front puff – rises higher and slightly forward */}
      <Voxel position={[0.01, 1.045, 0.055]} args={[0.200, 0.07,  0.09]}  color={C.hairBlack} />
      {/* Wave bump left */}
      <Voxel position={[-0.06, 1.065, 0.04]} args={[0.09, 0.055, 0.08]}  color={C.hairDark} />
      {/* Wave bump right (asymmetric for natural look) */}
      <Voxel position={[0.07, 1.07, 0.04]}  args={[0.07, 0.05,  0.07]}  color={C.hairBlack} />
      {/* Side hair – left */}
      <Voxel position={[-0.125, 0.935, 0.005]} args={[0.045, 0.16, 0.20]} color={C.hairBlack} />
      {/* Side hair – right */}
      <Voxel position={[0.125, 0.935, 0.005]}  args={[0.045, 0.16, 0.20]} color={C.hairBlack} />
      {/* Back hair */}
      <Voxel position={[0, 0.910, -0.115]} args={[0.210, 0.18, 0.025]} color={C.hairDark} />
      {/* Hair front fringe */}
      <Voxel position={[0.02, 0.955, 0.10]}  args={[0.18, 0.04, 0.04]}  color={C.hairBlack} />
    </group>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────────
function PixelPerson({ position = [0, 0, 0], scale = 1, ...props }) {
  const groupRef  = useRef()
  const bodyRef   = useRef()
  const headRef   = useRef()
  const scaleSync = useRef(typeof scale === 'number' ? scale : 1)

  const [interactionIndex, setInteractionIndex] = useState(-1)
  const indexRef = useRef(-1)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [expression, setExpression] = useState('neutral')
  const [isBlinking, setIsBlinking] = useState(false)
  const behaviorRef = useRef('nod')
  const behaviorIntensityRef = useRef(1)
  const dismissTimer = useRef(null)
  const moodTimer = useRef(null)

  const { t } = useTranslation()
  const { playSound } = useSounds()

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    if (moodTimer.current) clearTimeout(moodTimer.current)

    const next = (indexRef.current + 1) % INTERACTIONS.length
    indexRef.current = next
    setInteractionIndex(next)
    const interaction = INTERACTIONS[next]

    setBubbleVisible(true)
    playSound(interaction.sound)

    // Blink → swap expression → open eyes
    setIsBlinking(true)
    setTimeout(() => {
      setExpression(interaction.expression)
      behaviorRef.current = interaction.behavior
      behaviorIntensityRef.current = 0
      setTimeout(() => setIsBlinking(false), 80)
    }, 80)

    dismissTimer.current = setTimeout(() => {
      setBubbleVisible(false)
      moodTimer.current = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => {
          setExpression('neutral')
          behaviorRef.current = 'nod'
          behaviorIntensityRef.current = 0
          setTimeout(() => setIsBlinking(false), 80)
        }, 80)
      }, interaction.moodDuration)
    }, interaction.dismissDelay)
  }, [playSound])

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      if (moodTimer.current) clearTimeout(moodTimer.current)
    }
  }, [])

  useFrame((state, delta) => {
    if (!bodyRef.current) return
    const t = state.clock.elapsedTime

    // Lerp behavior intensity toward 1 after a behavior change (transition ~0.5s)
    behaviorIntensityRef.current = Math.min(1, behaviorIntensityRef.current + delta * 2)
    const i = behaviorIntensityRef.current

    // Base breathing (nod) – always present
    const baseScaleY = 1 + Math.sin(t * 1.2) * 0.018
    const basePosY   = Math.sin(t * 1.2) * 0.004

    let targetScaleY = baseScaleY
    let targetPosY   = basePosY
    let targetHeadZ  = 0

    switch (behaviorRef.current) {
      case 'bounce':
        targetScaleY = 1 + Math.sin(t * 2.2) * 0.030
        targetPosY   = Math.sin(t * 2.2) * 0.008
        break
      case 'sway':
        targetScaleY = 1 + Math.sin(t * 0.8) * 0.012
        targetPosY   = Math.sin(t * 0.8) * 0.003
        targetHeadZ  = Math.sin(t * 0.8) * 0.04
        break
      case 'droop':
        targetScaleY = 1 + Math.sin(t * 1.0) * 0.010
        targetPosY   = Math.sin(t * 1.0) * 0.002
        targetHeadZ  = -0.06
        break
      case 'tremble':
        targetScaleY = 1 + Math.sin(t * 8) * 0.015
        targetPosY   = 0
        targetHeadZ  = Math.sin(t * 9) * 0.03
        break
      default: // nod — already set to base
        break
    }

    bodyRef.current.scale.y    = THREE.MathUtils.lerp(baseScaleY, targetScaleY, i)
    bodyRef.current.position.y = THREE.MathUtils.lerp(basePosY,   targetPosY,   i)

    if (headRef.current) {
      const goalZ = THREE.MathUtils.lerp(0, targetHeadZ, i)
      headRef.current.rotation.z = THREE.MathUtils.lerp(
        headRef.current.rotation.z, goalZ, delta * 3
      )
    }
  })

  const currentMessage = interactionIndex >= 0 ? t(INTERACTIONS[interactionIndex].messageKey) : ''

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scaleSync.current}
      onPointerDown={handleClick}
      {...props}
    >
      {/* Behavior / breathing group */}
      <group ref={bodyRef}>
        {/* Feet */}
        <Shoe side="left" />
        <Shoe side="right" />

        {/* Legs */}
        <PantsLeg side="left" />
        <PantsLeg side="right" />

        {/* Torso + collar */}
        <Torso />

        {/* Arms */}
        <Arm side="left" />
        <Arm side="right" />

        {/* Head + hair – separate group for Z-axis tilt */}
        <group ref={headRef}>
          <Head expression={expression} blinking={isBlinking} />
          <Hair />
        </group>

        {/* Speech bubble */}
        <SpeechBubble visible={bubbleVisible} message={currentMessage} />
      </group>
    </group>
  )
}

export default PixelPerson
