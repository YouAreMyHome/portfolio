import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../store/useStore'

/**
 * RecordPlayer - Hi-Fi Walnut & Brass Turntable Console (Japandi / Mid-Century Modern)
 * Features:
 * - Oiled solid walnut plinth & console with vinyl storage shelf below
 * - Real vinyl records stored vertically with colorful spines
 * - Acrylic dust cover with physical glass transmission & hinge
 * - Precision aluminum & champagne brass tonearm with counterweight & cartridge
 * - Spun aluminum platter with grooved vinyl disc and rotating center label
 * - Leaning vinyl album cover jacket with artistic graphic
 * - Interactive: Click to toggle music playback, spinning vinyl, and floating musical notes
 */
// Flyweight Geometries & Materials cho RecordPlayer
const sharedAlbumSpineGeo = new THREE.BoxGeometry(0.022, 0.31, 0.008)
const sharedAlbumBodyGeo = new THREE.BoxGeometry(0.02, 0.31, 0.3)
const sharedAlbumLabelGeo = new THREE.PlaneGeometry(0.012, 0.18)
const sharedGrooveGeos = [0.045, 0.065, 0.085, 0.105, 0.12].map(
  (r) => new THREE.TorusGeometry(r, 0.0008, 4, 32)
)
const sharedGrooveMat = new THREE.MeshBasicMaterial({ color: '#1f2327', transparent: true, opacity: 0.5 })
const sharedConsoleLegGeo = new THREE.CylinderGeometry(0.016, 0.01, 0.12, 10)
const sharedConsoleFerruleGeo = new THREE.CylinderGeometry(0.011, 0.009, 0.025, 10)
const consoleLegMat = new THREE.MeshStandardMaterial({ color: '#56341a', roughness: 0.7 })
const consoleFerruleMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.85, roughness: 0.25 })

// Acrylic Glass Material cao cấp có Clearcoat
const acrylicLidMat = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  opacity: 0.24,
  transparent: true,
  roughness: 0.04,
  metalness: 0.08,
  clearcoat: 0.9,
  clearcoatRoughness: 0.05,
  depthWrite: false,
})

function RecordPlayer({ position = [-0.3, 0.35, -3.6] }) {
  const groupRef = useRef()
  const discRef = useRef()
  const armRef = useRef()
  const lidRef = useRef()
  const isPlaying = useStore((state) => state.isRecordPlaying)

  // Smooth frame animations with Delta-timed exponential damping
  useFrame((state, delta) => {
    // Disc rotation
    if (discRef.current && isPlaying) {
      discRef.current.rotation.y += delta * 1.8
    }

    // Tonearm smooth cueing with exponential damping
    if (armRef.current) {
      const targetArmAngle = isPlaying ? -0.32 : 0.18
      const armFactor = 1 - Math.exp(-4.5 * delta)
      armRef.current.rotation.y += (targetArmAngle - armRef.current.rotation.y) * armFactor
    }

    // Dust cover smooth tilt with exponential damping
    if (lidRef.current) {
      const targetLidAngle = isPlaying ? -0.85 : 0
      const lidFactor = 1 - Math.exp(-5 * delta)
      lidRef.current.rotation.x += (targetLidAngle - lidRef.current.rotation.x) * lidFactor
    }
  })

  // Material palette - Warm American Walnut & Champagne Brass
  const walnutWood = '#724929'
  const walnutDark = '#56341a'
  const walnutWarm = '#8b5934'
  const champagneBrass = '#d4af37'
  const brassMuted = '#b8972e'
  const brushedSteel = '#888d92'

  return (
    <group ref={groupRef} position={position}>
      {/* ========================================================================= */}
      {/* 1. MID-CENTURY AUDIO CONSOLE / STAND                                       */}
      {/* ========================================================================= */}
      <group position={[0, -0.35, 0]}>
        {/* Main console body - Walnut carcass */}
        <RoundedBox args={[0.56, 0.58, 0.42]} radius={0.015} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color={walnutWood} roughness={0.68} metalness={0.05} />
        </RoundedBox>

        {/* Inner cavity for vinyl record storage */}
        <mesh position={[0, -0.05, 0.02]}>
          <boxGeometry args={[0.48, 0.36, 0.38]} />
          <meshStandardMaterial color={walnutDark} roughness={0.9} />
        </mesh>

        {/* Shelf divider */}
        <mesh position={[0, 0.13, 0.02]}>
          <boxGeometry args={[0.48, 0.015, 0.37]} />
          <meshStandardMaterial color={walnutWarm} roughness={0.7} />
        </mesh>

        {/* Small top compartment drawer face */}
        <mesh position={[0, 0.19, 0.211]} castShadow>
          <planeGeometry args={[0.46, 0.09]} />
          <meshStandardMaterial color={walnutWarm} roughness={0.65} />
        </mesh>
        {/* Minimalist brass pull tab */}
        <mesh position={[0, 0.19, 0.218]} castShadow>
          <boxGeometry args={[0.06, 0.008, 0.012]} />
          <meshStandardMaterial color={champagneBrass} metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Row of vertical Vinyl Records in the lower shelf */}
        <group position={[-0.2, -0.06, 0.05]}>
          {[
            { color: '#c0392b', title: '#f1c40f', offset: 0 },
            { color: '#2980b9', title: '#ecf0f1', offset: 0.03 },
            { color: '#27ae60', title: '#e67e22', offset: 0.06 },
            { color: '#8e44ad', title: '#f39c12', offset: 0.09 },
            { color: '#d35400', title: '#ecf0f1', offset: 0.12 },
            { color: '#16a085', title: '#ffffff', offset: 0.15 },
            { color: '#2c3e50', title: '#e74c3c', offset: 0.18 },
            { color: '#e67e22', title: '#2c3e50', offset: 0.21 },
            { color: '#7f8c8d', title: '#f1c40f', offset: 0.24 },
            { color: '#c0392b', title: '#ffffff', offset: 0.27 },
            { color: '#1f2937', title: '#38bdf8', offset: 0.30 },
            { color: '#b45309', title: '#fef08a', offset: 0.33 },
          ].map((album, idx) => (
            <group key={idx} position={[album.offset, 0, 0]} rotation={[0, 0, idx === 11 ? -0.08 : 0]}>
              {/* Record spine */}
              <mesh castShadow position={[0, 0, 0.15]} geometry={sharedAlbumSpineGeo}>
                <meshStandardMaterial color={album.color} roughness={0.7} />
              </mesh>
              {/* Record body sleeve */}
              <mesh castShadow position={[0, 0, 0]} geometry={sharedAlbumBodyGeo}>
                <meshStandardMaterial color={album.color} roughness={0.65} />
              </mesh>
              {/* Spine text graphic bar */}
              <mesh position={[0, 0, 0.155]} geometry={sharedAlbumLabelGeo}>
                <meshStandardMaterial color={album.title} roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>

        {/* 4 Tapered Mid-Century Wooden Legs with Brass Ferrules */}
        {[
          [-0.22, -0.15, -0.15, 0.15],
          [0.22, -0.15, 0.15, 0.15],
          [-0.22, 0.15, -0.15, -0.15],
          [0.22, 0.15, 0.15, -0.15],
        ].map(([x, z, rotX, rotZ], i) => (
          <group key={i} position={[x, -0.32, z]} rotation={[rotZ * 0.5, 0, rotX * 0.5]}>
            {/* Wooden leg */}
            <mesh castShadow position={[0, -0.05, 0]} geometry={sharedConsoleLegGeo} material={consoleLegMat} />
            {/* Brass foot ferrule cap */}
            <mesh position={[0, -0.105, 0]} geometry={sharedConsoleFerruleGeo} material={consoleFerruleMat} />
          </group>
        ))}

      </group>

      {/* ========================================================================= */}
      {/* 2. HI-FI TURNTABLE DECK                                                    */}
      {/* ========================================================================= */}
      <group position={[0, 0.025, 0]}>
        {/* Plinth (Chassis) - Walnut with beveled edges */}
        <RoundedBox args={[0.5, 0.055, 0.38]} radius={0.012} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color={walnutWood} roughness={0.55} metalness={0.08} />
        </RoundedBox>

        {/* Brushed aluminum top plate insert */}
        <mesh position={[0, 0.0285, 0]} receiveShadow>
          <boxGeometry args={[0.47, 0.002, 0.35]} />
          <meshStandardMaterial color="#22252a" roughness={0.45} metalness={0.6} />
        </mesh>

        {/* Brass corner accent trims */}
        {[
          [-0.24, -0.18],
          [0.24, -0.18],
          [-0.24, 0.18],
          [0.24, 0.18],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.015, z]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.03, 12]} />
            <meshStandardMaterial color={champagneBrass} metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Turntable Platter - Heavy die-cast metal */}
        <group position={[-0.04, 0.032, 0.01]}>
          {/* Sub-platter */}
          <mesh castShadow position={[0, 0.008, 0]}>
            <cylinderGeometry args={[0.138, 0.14, 0.014, 48]} />
            <meshStandardMaterial color="#b0b5bc" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Rubber/Cork Slipmat */}
          <mesh position={[0, 0.016, 0]} receiveShadow>
            <cylinderGeometry args={[0.132, 0.132, 0.003, 40]} />
            <meshStandardMaterial color="#1a1c1e" roughness={0.92} metalness={0.05} />
          </mesh>

          {/* Brass Spindle */}
          <mesh position={[0, 0.024, 0]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.022, 16]} />
            <meshStandardMaterial color={champagneBrass} metalness={0.95} roughness={0.15} />
          </mesh>

          {/* === ROTATING VINYL DISC === */}
          <group ref={discRef} position={[0, 0.019, 0]}>
            {/* Main 12" Vinyl Disc */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.125, 0.125, 0.0035, 48]} />
              <meshStandardMaterial color="#0c0d0e" roughness={0.28} metalness={0.35} />
            </mesh>

            {/* Micro-grooves visual rings */}
            {sharedGrooveGeos.map((geo, i) => (
              <mesh key={i} position={[0, 0.002, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={geo} material={sharedGrooveMat} />
            ))}

            {/* Center Record Paper Label (Warm Red & Gold) */}
            <mesh position={[0, 0.0022, 0]}>
              <cylinderGeometry args={[0.034, 0.034, 0.001, 32]} />
              <meshStandardMaterial
                color={isPlaying ? '#b91c1c' : '#c2410c'}
                roughness={0.6}
              />
            </mesh>
            <mesh position={[0, 0.0028, 0]}>
              <torusGeometry args={[0.026, 0.0025, 8, 32]} />
              <meshStandardMaterial color={champagneBrass} metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* ===================================================================== */}
        {/* TONEARM ASSEMBLY                                                      */}
        {/* ===================================================================== */}
        <group position={[0.165, 0.035, -0.09]}>
          {/* Heavy Brass Tonearm Base & Gimbal */}
          <mesh castShadow position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.022, 0.025, 0.024, 18]} />
            <meshStandardMaterial color={champagneBrass} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Cueing lever */}
          <mesh position={[-0.018, 0.025, 0.01]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.0018, 0.0018, 0.022, 8]} />
            <meshStandardMaterial color={brushedSteel} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Pivoting Tonearm Wand */}
          <group ref={armRef} position={[0, 0.032, 0]}>
            {/* Gimbal bearing ring */}
            <mesh castShadow>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshStandardMaterial color={champagneBrass} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Rear Counterweight */}
            <mesh castShadow position={[0.05, 0, -0.02]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.016, 0.016, 0.03, 18]} />
              <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Counterweight calibration ring */}
            <mesh position={[0.066, 0, -0.02]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.0162, 0.0162, 0.004, 18]} />
              <meshStandardMaterial color={champagneBrass} metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Curved Aluminum Arm Wand (S-shaped or curved) */}
            <mesh castShadow position={[-0.08, 0.002, 0.05]} rotation={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.0032, 0.0032, 0.19, 12]} />
              <meshStandardMaterial color={brushedSteel} metalness={0.85} roughness={0.2} />
            </mesh>

            {/* Premium Gold Headshell & Cartridge */}
            <group position={[-0.175, -0.006, 0.095]} rotation={[0, 0.35, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.028, 0.009, 0.016]} />
                <meshStandardMaterial color={champagneBrass} metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Phono cartridge body */}
              <mesh position={[-0.005, -0.008, 0]}>
                <boxGeometry args={[0.018, 0.012, 0.014]} />
                <meshStandardMaterial color="#1e293b" roughness={0.4} />
              </mesh>
              {/* Stylus cantilever */}
              <mesh position={[-0.012, -0.016, 0]} rotation={[0.25, 0, 0]}>
                <coneGeometry args={[0.0018, 0.008, 4]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ===================================================================== */}
        {/* CONTROLS & SWITCHES                                                   */}
        {/* ===================================================================== */}
        {/* Power / Start Button */}
        <group position={[-0.18, 0.033, 0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.018, 0.01, 16]} />
            <meshStandardMaterial
              color={isPlaying ? '#10b981' : '#64748b'}
              metalness={0.6}
              roughness={0.3}
              emissive={isPlaying ? '#10b981' : '#000000'}
              emissiveIntensity={isPlaying ? 0.6 : 0}
            />
          </mesh>
          {/* LED Ring Glow */}
          <mesh position={[0, 0.006, 0]}>
            <torusGeometry args={[0.018, 0.002, 8, 16]} />
            <meshBasicMaterial color={isPlaying ? '#34d399' : '#334155'} />
          </mesh>
        </group>

        {/* Speed Selector (33 / 45 RPM) */}
        <group position={[-0.11, 0.033, 0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.012, 0.013, 0.012, 14]} />
            <meshStandardMaterial color={champagneBrass} metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.007, 0]}>
            <boxGeometry args={[0.002, 0.004, 0.018]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        </group>

        {/* Volume & Pitch Rotary Dials */}
        <group position={[0.18, 0.033, 0.12]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.015, 0.016, 0.014, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* White indicator notch */}
          <mesh position={[0, 0.008, 0.01]}>
            <boxGeometry args={[0.002, 0.003, 0.006]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* ===================================================================== */}
        {/* ACRYLIC DUST COVER ENCLOSURE (With transmission & hinge)               */}
        {/* ===================================================================== */}
        <group position={[0, 0.03, -0.17]}>
          {/* Dual Brass Hinges at the back */}
          {[-0.16, 0.16].map((hx, idx) => (
            <mesh key={idx} position={[hx, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.006, 0.006, 0.024, 12]} />
              <meshStandardMaterial color={champagneBrass} metalness={0.85} roughness={0.25} />
            </mesh>
          ))}

          {/* Pivoting lid assembly */}
          <group ref={lidRef} position={[0, 0.015, 0]}>
            {/* Top flat pane */}
            <mesh position={[0, 0.07, 0.18]} material={acrylicLidMat}>
              <boxGeometry args={[0.49, 0.004, 0.36]} />
            </mesh>
            {/* Front vertical pane */}
            <mesh position={[0, 0.035, 0.358]} material={acrylicLidMat}>
              <boxGeometry args={[0.49, 0.07, 0.004]} />
            </mesh>
            {/* Left vertical pane */}
            <mesh position={[-0.243, 0.035, 0.18]} material={acrylicLidMat}>
              <boxGeometry args={[0.004, 0.07, 0.356]} />
            </mesh>
            {/* Right vertical pane */}
            <mesh position={[0.243, 0.035, 0.18]} material={acrylicLidMat}>
              <boxGeometry args={[0.004, 0.07, 0.356]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 3. VIBRANT FLOATING MUSIC NOTES (when playing)                             */}
      {/* ========================================================================= */}
      {isPlaying && (
        <group position={[0, 0.1, 0]}>
          <FloatingMusicNote position={[-0.12, 0.15, 0.08]} delay={0} color="#a855f7" />
          <FloatingMusicNote position={[0.08, 0.2, 0.02]} delay={0.8} color="#ec4899" />
          <FloatingMusicNote position={[0.18, 0.12, -0.06]} delay={1.6} color="#3b82f6" />
          <FloatingMusicNote position={[-0.04, 0.26, 0.1]} delay={2.4} color="#f59e0b" />
        </group>
      )}
    </group>
  )
}

// Floating animated music note (with musical note shape & glow)
function FloatingMusicNote({ position, delay, color }) {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      const cycle = (time * 0.45) % 3

      // Float upward with subtle horizontal swaying
      ref.current.position.y = position[1] + cycle * 0.2
      ref.current.position.x = position[0] + Math.sin(time * 2.2) * 0.035
      ref.current.position.z = position[2] + Math.cos(time * 1.8) * 0.025
      ref.current.rotation.z = Math.sin(time * 2.5) * 0.25

      // Smooth fade in and out
      const opacity = cycle < 0.35 ? cycle / 0.35 : cycle > 2.4 ? (3 - cycle) / 0.6 : 1
      ref.current.children[0].material.opacity = opacity * 0.85
      if (ref.current.children[1]) {
        ref.current.children[1].material.opacity = opacity * 0.85
      }
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Note Head */}
      <mesh rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* Note Stem */}
      <mesh position={[0.014, 0.025, 0]}>
        <cylinderGeometry args={[0.0022, 0.0022, 0.048, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

export default RecordPlayer
