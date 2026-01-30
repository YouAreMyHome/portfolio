import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { COLORS } from './colors' // Giả sử bạn có file này

const GAMING_COLORS = {
  primary: '#1a1a1a',   // Da đen nhám
  accent: '#ef4444',    // Đỏ Racing (hoặc xanh neon)
  metal: '#2d2d2d',     // Kim loại tối màu
  wheels: '#000000'
}

function GamingChair(props) {
  // Ref để có thể animate xoay ghế nếu thích
  const chairRef = useRef()

  return (
    <group 
      ref={chairRef} 
      position={[-1.8, 0, -1.2]} 
      rotation={[0, Math.PI / 4 + 0.2, 0]} 
      {...props}
    >
      
      {/* --- PHẦN TRÊN (UPPER BODY) --- */}
      {/* Group này chứa Đệm + Lưng + Tay vịn */}
      <group position={[0, 0, 0]}>
        
        {/* 1. ĐỆM NGỒI (SEAT) */}
        <group position={[0, 0.48, 0]}>
            {/* Đệm chính */}
            <RoundedBox args={[0.5, 0.08, 0.52]} radius={0.02} castShadow>
                <meshStandardMaterial color={GAMING_COLORS.primary} roughness={0.7} />
            </RoundedBox>
            
            {/* Viền đệm 2 bên (Side Bolsters) - Tạo cảm giác ghế đua */}
            <mesh position={[-0.22, 0.04, 0]} rotation={[0, 0, 0.2]} castShadow>
                <boxGeometry args={[0.1, 0.06, 0.5]} />
                <meshStandardMaterial color={GAMING_COLORS.accent} />
            </mesh>
             <mesh position={[0.22, 0.04, 0]} rotation={[0, 0, -0.2]} castShadow>
                <boxGeometry args={[0.1, 0.06, 0.5]} />
                <meshStandardMaterial color={GAMING_COLORS.accent} />
            </mesh>
        </group>

        {/* 2. LƯNG GHẾ (BACKREST) */}
        <group position={[0, 0.85, -0.22]} rotation={[-0.1, 0, 0]}> {/* Hơi ngả ra sau */}
            {/* Lưng chính */}
            <RoundedBox args={[0.45, 0.8, 0.06]} radius={0.02} castShadow>
                 <meshStandardMaterial color={GAMING_COLORS.primary} />
            </RoundedBox>
            
            {/* Cánh ôm lưng (Wings) - Phần vai */}
            <group position={[0, 0.2, 0.02]}>
                 <mesh position={[-0.24, 0, 0.05]} rotation={[0, 0.3, 0]}>
                    <boxGeometry args={[0.12, 0.3, 0.04]} />
                    <meshStandardMaterial color={GAMING_COLORS.accent} />
                 </mesh>
                 <mesh position={[0.24, 0, 0.05]} rotation={[0, -0.3, 0]}>
                    <boxGeometry args={[0.12, 0.3, 0.04]} />
                    <meshStandardMaterial color={GAMING_COLORS.accent} />
                 </mesh>
            </group>

            {/* Gối đầu (Headrest Pillow) */}
            <mesh position={[0, 0.28, 0.06]} castShadow>
                 <boxGeometry args={[0.25, 0.12, 0.06]} />
                 <meshStandardMaterial color={GAMING_COLORS.accent} />
            </mesh>
            {/* Dây đai gối */}
             <mesh position={[0, 0.28, 0.031]}>
                 <boxGeometry args={[0.26, 0.02, 0.01]} />
                 <meshBasicMaterial color="#111" />
            </mesh>

            {/* Gối lưng (Lumbar Support) */}
             <mesh position={[0, -0.15, 0.05]} castShadow>
                 <boxGeometry args={[0.3, 0.15, 0.05]} />
                 <meshStandardMaterial color={GAMING_COLORS.primary} />
            </mesh>
        </group>

        {/* 3. TAY VỊN (ARMRESTS - 4D Style) */}
        {[-0.28, 0.28].map((x, i) => (
            <group key={i} position={[x, 0.65, -0.05]}>
                {/* Trục đứng */}
                <mesh position={[0, -0.1, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.25]} />
                    <meshStandardMaterial color={GAMING_COLORS.metal} />
                </mesh>
                {/* Bề mặt tì tay (Mềm) */}
                <RoundedBox args={[0.08, 0.03, 0.24]} radius={0.01} castShadow>
                     <meshStandardMaterial color="#333" roughness={0.9} />
                </RoundedBox>
            </group>
        ))}

        {/* Khớp nối dưới đáy ghế */}
        <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.3]} />
            <meshStandardMaterial color={GAMING_COLORS.metal} />
        </mesh>
      </group>

      {/* --- PHẦN DƯỚI (BASE & WHEELS) --- */}
      
      {/* Gas Lift (Trục Piston) */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Ốp che bụi piston */}
       <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.15, 8]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Chân hình sao (Star Base) - Làm chân rời nhìn xịn hơn khối tròn */}
      <group position={[0, 0.08, 0]}>
          {[0, 1, 2, 3, 4].map((i) => (
              <group key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
                  {/* Chân ghế vát cạnh */}
                  <mesh position={[0.15, 0, 0]} castShadow>
                      <boxGeometry args={[0.3, 0.04, 0.05]} />
                      <meshStandardMaterial color={GAMING_COLORS.metal} />
                  </mesh>
                  
                  {/* BÁNH XE (WHEELS) */}
                  <group position={[0.3, -0.05, 0]}>
                       {/* Trục bánh */}
                       <mesh position={[0, 0.03, 0]}>
                           <cylinderGeometry args={[0.015, 0.015, 0.04]} />
                           <meshStandardMaterial color="#111" />
                       </mesh>
                       {/* Bánh xe đôi */}
                       <mesh position={[0, 0, 0.015]} rotation={[Math.PI/2, 0, 0]}>
                           <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
                           <meshStandardMaterial color={GAMING_COLORS.wheels} />
                       </mesh>
                        <mesh position={[0, 0, -0.015]} rotation={[Math.PI/2, 0, 0]}>
                           <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
                           <meshStandardMaterial color={GAMING_COLORS.wheels} />
                       </mesh>
                       {/* Bóng đổ giả dưới bánh */}
                        <mesh position={[0, -0.024, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                           <circleGeometry args={[0.04, 12]} />
                           <meshBasicMaterial color="#000" transparent opacity={0.3} />
                        </mesh>
                  </group>
              </group>
          ))}
      </group>

    </group>
  )
}

export default GamingChair