import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { COLORS } from './colors'
import useStore from '../../store/useStore'

/**
 * RecordPlayer - Máy đĩa nghe nhạc vintage cao cấp
 * Thiết kế tinh xảo với chất liệu gỗ walnut và kim loại đồng
 * Click để mở Music Player panel
 */
function RecordPlayer({ position = [-0.5, 0.65, -3.6] }) {
  const groupRef = useRef()
  const discRef = useRef()
  const armRef = useRef()
  const isPlaying = useStore((state) => state.isRecordPlaying)
  const isNightMode = useStore((state) => state.isNightMode)
  
  // Animations
  useFrame((state, delta) => {
    // Rotate disc when playing
    if (discRef.current && isPlaying) {
      discRef.current.rotation.y += delta * 1.2
    }
    
    // Animate tonearm smoothly
    if (armRef.current) {
      const targetRotation = isPlaying ? -0.35 : 0.15
      armRef.current.rotation.y += (targetRotation - armRef.current.rotation.y) * 0.03
    }
  })
  
  // Colors
  const woodColor = '#5D4037'
  const woodDark = '#4E342E'
  const woodLight = '#8D6E63'
  const brassColor = '#D4AF37'
  const brassDark = '#B8860B'
  
  return (
    <group ref={groupRef} position={position}>
      {/* === CABINET/STAND === */}
      <group position={[0, -0.35, 0]}>
        {/* Main cabinet body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.6, 0.4]} />
          <meshToonMaterial color={woodColor} />
        </mesh>
        
        {/* Cabinet top surface */}
        <mesh castShadow position={[0, 0.305, 0]}>
          <boxGeometry args={[0.56, 0.02, 0.41]} />
          <meshToonMaterial color={woodDark} />
        </mesh>
        
        {/* Cabinet front panel with door */}
        <mesh position={[0, 0, 0.201]}>
          <boxGeometry args={[0.48, 0.52, 0.01]} />
          <meshToonMaterial color={woodLight} />
        </mesh>
        
        {/* Door handle */}
        <mesh castShadow position={[0.15, 0, 0.21]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
          <meshStandardMaterial color={brassColor} metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Cabinet legs */}
        {[[-0.22, -0.15], [0.22, -0.15], [-0.22, 0.15], [0.22, 0.15]].map(([x, z], i) => (
          <group key={i} position={[x, -0.32, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.025, 0.02, 0.06, 8]} />
              <meshToonMaterial color={woodDark} />
            </mesh>
            {/* Brass foot cap */}
            <mesh position={[0, -0.03, 0]}>
              <sphereGeometry args={[0.022, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={brassColor} metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        ))}
        
        {/* Decorative trim */}
        <mesh position={[0, 0.28, 0.2]}>
          <boxGeometry args={[0.52, 0.02, 0.02]} />
          <meshToonMaterial color={brassDark} />
        </mesh>
      </group>
      
      {/* === TURNTABLE UNIT === */}
      <group position={[0, 0.02, 0]}>
        {/* Turntable base - walnut wood */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.06, 0.36]} />
          <meshToonMaterial color={woodColor} />
        </mesh>
        
        {/* Top plate - dark matte */}
        <mesh position={[0, 0.032, 0]}>
          <boxGeometry args={[0.46, 0.01, 0.34]} />
          <meshToonMaterial color="#2a2a2a" />
        </mesh>
        
        {/* Rounded corners trim */}
        {[[-0.24, -0.18], [0.24, -0.18], [-0.24, 0.18], [0.24, 0.18]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.015, z]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
            <meshStandardMaterial color={brassColor} metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        
        {/* Platter - metal with rubber mat */}
        <mesh position={[0.02, 0.045, 0.02]}>
          <cylinderGeometry args={[0.13, 0.13, 0.015, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        
        {/* Platter rim highlight */}
        <mesh position={[0.02, 0.052, 0.02]}>
          <torusGeometry args={[0.125, 0.008, 8, 32]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
        </mesh>
        
        {/* === VINYL RECORD === */}
        <group ref={discRef} position={[0.02, 0.06, 0.02]}>
          {/* Main disc */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.003, 48]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.1} roughness={0.3} />
          </mesh>
          
          {/* Vinyl grooves - subtle rings */}
          {[0.04, 0.06, 0.08, 0.1].map((r, i) => (
            <mesh key={i} position={[0, 0.002, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[r, 0.001, 4, 48]} />
              <meshBasicMaterial color="#151515" transparent opacity={0.6} />
            </mesh>
          ))}
          
          {/* Center label */}
          <mesh position={[0, 0.0025, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.002, 24]} />
            <meshToonMaterial color={isPlaying ? "#c0392b" : "#e67e22"} />
          </mesh>
          
          {/* Label ring detail */}
          <mesh position={[0, 0.003, 0]}>
            <torusGeometry args={[0.022, 0.003, 8, 24]} />
            <meshToonMaterial color={isPlaying ? "#922b21" : "#d35400"} />
          </mesh>
          
          {/* Spindle hole */}
          <mesh position={[0, 0.003, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.005, 8]} />
            <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
        
        {/* Spindle */}
        <mesh position={[0.02, 0.055, 0.02]}>
          <cylinderGeometry args={[0.003, 0.003, 0.02, 8]} />
          <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* === TONEARM === */}
        <group ref={armRef} position={[0.18, 0.05, -0.1]} rotation={[0, 0.15, 0]}>
          {/* Tonearm base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.018, 0.022, 0.025, 12]} />
            <meshStandardMaterial color={brassColor} metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Tonearm vertical part */}
          <mesh castShadow position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.04, 8]} />
            <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Tonearm horizontal - curved */}
          <mesh castShadow position={[-0.09, 0.045, 0.06]} rotation={[0, 0.25, 0]}>
            <boxGeometry args={[0.2, 0.008, 0.008]} />
            <meshStandardMaterial color="#999" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Headshell */}
          <group position={[-0.19, 0.04, 0.11]}>
            <mesh castShadow>
              <boxGeometry args={[0.025, 0.012, 0.022]} />
              <meshStandardMaterial color="#666" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Cartridge */}
            <mesh position={[0, -0.01, 0]}>
              <boxGeometry args={[0.018, 0.015, 0.018]} />
              <meshToonMaterial color="#333" />
            </mesh>
            {/* Stylus */}
            <mesh position={[0, -0.022, 0.005]} rotation={[0.2, 0, 0]}>
              <coneGeometry args={[0.002, 0.012, 4]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
          
          {/* Counterweight */}
          <mesh castShadow position={[0.06, 0.045, -0.02]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.025, 12]} />
            <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
        
        {/* === CONTROLS === */}
        {/* Power/Start button */}
        <mesh position={[-0.16, 0.04, -0.12]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.012, 16]} />
          <meshStandardMaterial 
            color={isPlaying ? "#2ecc71" : "#7f8c8d"} 
            metalness={0.5} 
            roughness={0.3}
            emissive={isPlaying ? "#2ecc71" : "#000"}
            emissiveIntensity={isPlaying ? 0.5 : 0}
          />
        </mesh>
        
        {/* Speed selector */}
        <mesh position={[-0.08, 0.04, -0.12]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
          <meshStandardMaterial color={brassColor} metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Volume knob */}
        <mesh position={[0.16, 0.04, -0.12]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.015, 16]} />
          <meshStandardMaterial color="#333" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0.16, 0.05, -0.115]}>
          <boxGeometry args={[0.002, 0.008, 0.002]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
        
        {/* LED indicator */}
        <mesh position={[-0.2, 0.038, -0.12]}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshStandardMaterial 
            color={isPlaying ? "#4ade80" : "#444"} 
            emissive={isPlaying ? "#4ade80" : "#000"}
            emissiveIntensity={isPlaying ? 2 : 0}
          />
        </mesh>
      </group>
      
      {/* === DUST COVER === */}
      <mesh 
        castShadow 
        position={[0, isPlaying ? 0.18 : 0.08, isPlaying ? -0.12 : 0]} 
        rotation={[isPlaying ? 1.2 : 0, 0, 0]}
      >
        <boxGeometry args={[0.47, 0.002, 0.35]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.12}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      
      {/* Dust cover hinge */}
      <mesh position={[0, 0.055, -0.17]}>
        <boxGeometry args={[0.4, 0.008, 0.01]} />
        <meshStandardMaterial color={brassColor} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* === MUSIC VISUALIZATION === */}
      {isPlaying && (
        <group>
          <FloatingNote position={[-0.15, 0.25, 0.1]} delay={0} color="#a855f7" />
          <FloatingNote position={[0.1, 0.3, 0.05]} delay={0.7} color="#ec4899" />
          <FloatingNote position={[0.2, 0.22, -0.05]} delay={1.4} color="#3b82f6" />
          <FloatingNote position={[-0.05, 0.35, 0.12]} delay={2.1} color="#22d3ee" />
        </group>
      )}
    </group>
  )
}

// Floating music note with smooth animation
function FloatingNote({ position, delay, color }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.elapsedTime + delay
      const cycle = (time * 0.5) % 3
      
      // Float upward and fade
      ref.current.position.y = position[1] + cycle * 0.15
      ref.current.position.x = position[0] + Math.sin(time * 2) * 0.03
      ref.current.rotation.z = Math.sin(time * 3) * 0.3
      
      // Fade in and out
      const opacity = cycle < 0.3 ? cycle / 0.3 : 
                      cycle > 2.5 ? (3 - cycle) / 0.5 : 1
      ref.current.material.opacity = opacity * 0.8
    }
  })
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.018, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  )
}

export default RecordPlayer
