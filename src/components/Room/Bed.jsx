import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { COLORS } from './colors'

/**
 * Bed - Giường với nightstand và phone notification
 * Contact trigger
 */
function Bed() {
  const phoneRef = useRef()
  
  // Phone notification pulse
  useFrame((state) => {
    if (phoneRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5
      phoneRef.current.material.emissiveIntensity = pulse * 0.8
    }
  })
  
  return (
    <group position={[-2.8, 0, 1.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* Bed Frame - song song tường trái */}
      <mesh  position={[0, 0.2, 0]}>
        <boxGeometry args={[1.6, 0.4, 2.1]} />
        <meshToonMaterial color={COLORS.desk} />
      </mesh>
      
      {/* Bed frame border */}
      <mesh  position={[0, 0.42, 0]}>
        <boxGeometry args={[1.65, 0.03, 2.15]} />
        <meshToonMaterial color={COLORS.deskDark} />
      </mesh>
      
      {/* Mattress */}
      <mesh  position={[0, 0.48, 0]}>
        <boxGeometry args={[1.5, 0.12, 2]} />
        <meshToonMaterial color={COLORS.bed} />
      </mesh>
      
      {/* Blanket - main */}
      <mesh  position={[0, 0.56, 0.35]}>
        <boxGeometry args={[1.35, 0.06, 1.1]} />
        <meshToonMaterial color={COLORS.bedSheet} />
      </mesh>
      
      {/* Blanket fold */}
      <mesh  position={[0, 0.58, -0.15]}>
        <boxGeometry args={[1.3, 0.05, 0.3]} />
        <meshToonMaterial color="#E890A0" />
      </mesh>
      
      {/* Pillow 1 */}
      <mesh  position={[-0.3, 0.58, -0.7]}>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Pillow 2 */}
      <mesh  position={[0.3, 0.58, -0.7]}>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshToonMaterial color={COLORS.white} />
      </mesh>
      
      {/* Headboard */}
      <mesh  position={[0, 0.75, -1]}>
        <boxGeometry args={[1.6, 0.65, 0.1]} />
        <meshToonMaterial color={COLORS.deskDark} />
      </mesh>
      
      {/* Headboard detail panel */}
      <mesh  position={[0, 0.78, -0.94]}>
        <boxGeometry args={[1.4, 0.45, 0.02]} />
        <meshToonMaterial color={COLORS.desk} />
      </mesh>
      
      {/* Bed legs */}
      {[[-0.7, -0.95], [0.7, -0.95], [-0.7, 0.95], [0.7, 0.95]].map(([x, z], i) => (
        <mesh  key={i} position={[x, 0.05, z]}>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshToonMaterial color={COLORS.deskDark} />
        </mesh>
      ))}
      
      {/* Nightstand - cạnh giường, góc tường */}
      {/* ================= TỦ ĐẦU GIƯỜNG (NIGHTSTAND) ================= */}
      {/* Logic Tọa độ:
          X = 1.1: (Giường rộng 1.6 -> mép là 0.8) + (Khe hở 0.05) + (Tủ rộng 0.5 -> tâm là 0.25) = 1.1
          Z = -0.6: Để tủ ngang hàng với gối đầu
      */}
      <group position={[1.1, 0, -0.6]}> 
        
        {/* Thân tủ */}
        <mesh  position={[0, 0.25, 0]} >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshToonMaterial color={COLORS.desk || '#8d6e63'} />
        </mesh>

        {/* Ngăn kéo */}
        <mesh  position={[0, 0.35, 0.26]}>
          <boxGeometry args={[0.4, 0.15, 0.02]} />
          <meshToonMaterial color={COLORS.deskDark || '#5d4037'} />
        </mesh>
        {/* Tay nắm */}
        <mesh  position={[0, 0.35, 0.28]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* --- ĐỒ VẬT TRÊN TỦ --- */}
        
        {/* Đèn ngủ (Lamp) */}
        <group position={[0, 0.5, -0.1]}>
          {/* Chân đèn */}
          <mesh  position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.02, 0.05, 0.1]} />
            <meshToonMaterial color="#333" />
          </mesh>
          {/* Chao đèn */}
          <mesh  position={[0, 0.25, 0]}>
            <coneGeometry args={[0.15, 0.2, 32, 1, true]} />
            <meshToonMaterial color="#ffeb3b" side={2} /> 
          </mesh>
          {/* Bóng đèn phát sáng */}
          <pointLight position={[0, 0.15, 0]} intensity={0.8} distance={2} color="#ffeb3b" />
        </group>

        {/* Điện thoại (Phone) */}
        <mesh
          ref={phoneRef} 
          position={[0.1, 0.51, 0.1]} 
          rotation={[-Math.PI/2, 0, 0.3]} // Xoay nhẹ cho tự nhiên
        >
          <boxGeometry args={[0.12, 0.22, 0.01]} />
          <meshStandardMaterial color="#111" emissive="#00ff00" emissiveIntensity={0.5} />
        </mesh>

      </group>
    </group>
  )
}

export default Bed
