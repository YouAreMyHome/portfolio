import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/* ─────────────────────────────────────────────────────────────────
   TROPICAL PLANT  –  Bird-of-Paradise / Strelitzia
   Lá to bản phẳng, xoè tán rộng, cong drooping ở đầu lá
   Dùng gần TV (góc phải)
───────────────────────────────────────────────────────────────── */
function TropicalPlant() {
  const crownRef = useRef()

  useFrame(({ clock }) => {
    if (!crownRef.current) return
    const t = clock.elapsedTime
    crownRef.current.rotation.z = Math.sin(t * 0.50) * 0.018
    crownRef.current.rotation.x = Math.sin(t * 0.38 + 0.9) * 0.013
  })

  // Leaf data: [ry = spin around Y, tilt = lean outward (rad), len, width, color]
  // Arranged like a real Bird-of-Paradise fan
  const DEEP   = '#1a5c1a'
  const MID    = '#2d7d2d'
  const BRIGHT = '#3da63d'
  const YOUNG  = '#70c040'
  const VEIN   = '#58d040'

  const leafData = [
    { ry: 0.00,            tilt: 0.52, len: 0.56, w: 0.064, c: DEEP   },
    { ry: Math.PI * 0.28,  tilt: 0.40, len: 0.62, w: 0.072, c: MID    }, // biggest
    { ry: Math.PI * 0.60,  tilt: 0.55, len: 0.52, w: 0.060, c: DEEP   },
    { ry: Math.PI * 0.88,  tilt: 0.45, len: 0.58, w: 0.068, c: BRIGHT },
    { ry: Math.PI * 1.18,  tilt: 0.50, len: 0.54, w: 0.062, c: MID    },
    { ry: Math.PI * 1.50,  tilt: 0.48, len: 0.60, w: 0.070, c: DEEP   },
    { ry: Math.PI * 1.80,  tilt: 0.22, len: 0.46, w: 0.044, c: YOUNG  }, // upright new growth
  ]

  return (
    <group>
      {/* ── Saucer ── */}
      <mesh position={[0, 0.018, 0]} receiveShadow>
        <cylinderGeometry args={[0.200, 0.178, 0.036, 12]} />
        <meshToonMaterial color="#c86040" />
      </mesh>

      {/* ── Pot body (tall terracotta) ── */}
      <mesh position={[0, 0.230, 0]} castShadow>
        <cylinderGeometry args={[0.150, 0.096, 0.390, 12]} />
        <meshToonMaterial color="#c15a34" />
      </mesh>

      {/* Darkened lower band */}
      <mesh position={[0, 0.108, 0]}>
        <cylinderGeometry args={[0.148, 0.096, 0.148, 12]} />
        <meshToonMaterial color="#a84828" />
      </mesh>

      {/* ── Pot rim ── */}
      <mesh position={[0, 0.437, 0]} castShadow>
        <cylinderGeometry args={[0.162, 0.152, 0.030, 12]} />
        <meshToonMaterial color="#a04020" />
      </mesh>

      {/* ── Dark soil ── */}
      <mesh position={[0, 0.446, 0]}>
        <cylinderGeometry args={[0.142, 0.142, 0.020, 12]} />
        <meshToonMaterial color="#1e0c04" />
      </mesh>

      {/* Pebbles on soil */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 + 0.4
        return (
          <mesh key={i} position={[Math.cos(a) * 0.075, 0.462, Math.sin(a) * 0.075]}>
            <sphereGeometry args={[0.016, 5, 5]} />
            <meshToonMaterial color="#b89870" />
          </mesh>
        )
      })}

      {/* ── Short woody trunk ── */}
      <mesh position={[0, 0.600, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.030, 0.330, 7]} />
        <meshToonMaterial color="#4a2a14" />
      </mesh>
      {/* Trunk bark texture ring */}
      <mesh position={[0, 0.520, 0]}>
        <cylinderGeometry args={[0.031, 0.028, 0.040, 7]} />
        <meshToonMaterial color="#3a1e0c" />
      </mesh>

      {/* ── Crown of arching leaves ── */}
      <group ref={crownRef} position={[0, 0.760, 0]}>
        {leafData.map(({ ry, tilt, len, w, c }, i) => (
          <group key={i} rotation={[0, ry, 0]}>
            {/* Petiole (thin leaf stem) */}
            <group rotation={[tilt * 0.55, 0, 0]}>
              <mesh position={[0, len * 0.08, 0]} castShadow>
                <cylinderGeometry args={[0.006, 0.009, len * 0.22, 5]} />
                <meshToonMaterial color="#2a5a14" />
              </mesh>
            </group>

            {/* Leaf – lower half: straight up-outward */}
            <group rotation={[tilt, 0, 0]}>
              <mesh position={[0, len * 0.28, 0]} castShadow>
                <boxGeometry args={[w, len * 0.52, 0.006]} />
                <meshToonMaterial color={c} side={2} />
              </mesh>
              {/* Midrib lower */}
              <mesh position={[0, len * 0.28, 0.007]}>
                <boxGeometry args={[0.006, len * 0.50, 0.003]} />
                <meshToonMaterial color={VEIN} />
              </mesh>

              {/* Leaf – upper droop: tip bends further outward */}
              <group position={[0, len * 0.54, 0]} rotation={[0.42, 0, 0]}>
                <mesh position={[0, len * 0.20, 0]} castShadow>
                  <boxGeometry args={[w * 0.72, len * 0.42, 0.006]} />
                  <meshToonMaterial color={c} side={2} />
                </mesh>
                {/* Midrib upper */}
                <mesh position={[0, len * 0.20, 0.007]}>
                  <boxGeometry args={[0.005, len * 0.40, 0.003]} />
                  <meshToonMaterial color={VEIN} />
                </mesh>
              </group>
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────────
   BUSH PLANT  –  cây bụi tròn dễ thương với hoa
   Dùng gần giường (góc trái)
───────────────────────────────────────────────────────────────── */
function BushPlant() {
  const leavesRef = useRef()

  useFrame(({ clock }) => {
    if (!leavesRef.current) return
    const t = clock.elapsedTime
    leavesRef.current.rotation.z = Math.sin(t * 0.88 + 0.5) * 0.026
    leavesRef.current.rotation.x = Math.sin(t * 0.62 + 2.0) * 0.018
  })

  const G1 = '#4caf50'  // bright green
  const G2 = '#66bb6a'  // lighter green
  const G3 = '#388e3c'  // darker green
  const G4 = '#81c784'  // pale highlight green

  // Leaf sphere clusters [position, radius, color]
  const clusters = [
    { p: [ 0.00,  0.14,  0.00], r: 0.160, c: G1 },
    { p: [-0.11,  0.10,  0.04], r: 0.110, c: G3 },
    { p: [ 0.12,  0.09,  0.02], r: 0.100, c: G2 },
    { p: [ 0.04,  0.09, -0.10], r: 0.100, c: G3 },
    { p: [-0.06,  0.09, -0.09], r: 0.090, c: G1 },
    { p: [ 0.07,  0.25,  0.02], r: 0.070, c: G4 },
    { p: [-0.05,  0.24, -0.03], r: 0.065, c: G2 },
    { p: [ 0.00,  0.29,  0.01], r: 0.055, c: G4 },
  ]

  // Cute flowers [position]
  const flowers = [
    { p: [ 0.09,  0.31,  0.05] },
    { p: [-0.07,  0.29, -0.06] },
    { p: [ 0.01,  0.34,  0.08] },
    { p: [-0.10,  0.24,  0.08] },
  ]

  return (
    <group>
      {/* ── Saucer (mint) ── */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.175, 0.158, 0.030, 12]} />
        <meshToonMaterial color="#a8d8b0" />
      </mesh>

      {/* ── Pot body (cream white) ── */}
      <mesh position={[0, 0.156, 0]} castShadow>
        <cylinderGeometry args={[0.135, 0.104, 0.256, 12]} />
        <meshToonMaterial color="#f0ede6" />
      </mesh>

      {/* Mint decorative stripe */}
      <mesh position={[0, 0.108, 0]}>
        <cylinderGeometry args={[0.137, 0.120, 0.044, 12]} />
        <meshToonMaterial color="#a8d8b0" />
      </mesh>

      {/* Second thin accent stripe */}
      <mesh position={[0, 0.195, 0]}>
        <cylinderGeometry args={[0.1365, 0.131, 0.014, 12]} />
        <meshToonMaterial color="#c8e6c9" />
      </mesh>

      {/* ── Pot rim ── */}
      <mesh position={[0, 0.292, 0]} castShadow>
        <cylinderGeometry args={[0.147, 0.137, 0.026, 12]} />
        <meshToonMaterial color="#e0ddd4" />
      </mesh>

      {/* ── Pebble soil layer ── */}
      <mesh position={[0, 0.300, 0]}>
        <cylinderGeometry args={[0.127, 0.127, 0.018, 12]} />
        <meshToonMaterial color="#b0a490" />
      </mesh>

      {/* Individual pebbles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.068, 0.314, Math.sin(a) * 0.068]}>
            <sphereGeometry args={[0.016, 5, 5]} />
            <meshToonMaterial color={i % 2 === 0 ? '#c8b8a8' : '#a09080'} />
          </mesh>
        )
      })}

      {/* ── Leaf clusters + flowers with sway ── */}
      <group ref={leavesRef} position={[0, 0.30, 0]}>
        {clusters.map(({ p, r, c }, i) => (
          <mesh key={i} position={p} castShadow>
            <sphereGeometry args={[r, 8, 8]} />
            <meshToonMaterial color={c} />
          </mesh>
        ))}

        {/* Cute small flowers */}
        {flowers.map(({ p }, i) => (
          <group key={i} position={p}>
            {/* Pink petal blob */}
            <mesh castShadow>
              <sphereGeometry args={[0.026, 6, 6]} />
              <meshToonMaterial color="#ffb3c6" />
            </mesh>
            {/* Yellow centre */}
            <mesh position={[0, 0.021, 0]}>
              <sphereGeometry args={[0.013, 5, 5]} />
              <meshToonMaterial color="#ffd54f" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
   variant: 'tropical' (near TV, right corner)
            'bush'     (near bed, left corner)
───────────────────────────────────────────────────────────────── */
function Plant({ position, variant = 'tropical' }) {
  return (
    <group position={position}>
      {variant === 'tropical' ? <TropicalPlant /> : <BushPlant />}
    </group>
  )
}

export default Plant
