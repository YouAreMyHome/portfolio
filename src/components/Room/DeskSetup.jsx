import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './colors'

/**
 * Monitor Component - Tách riêng để tái sử dụng
 * @param {string} type - 'code' | 'design'
 */
const Monitor = ({ type, position, rotation, onClick }) => {
  const screenColor = type === 'code' ? '#1e1e1e' : '#ffffff'
  const glowColor = type === 'code' ? '#4ade80' : '#60a5fa' // Xanh lá vs Xanh dương

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
       {/* 1. Màn hình phát sáng hắt xuống bàn (Realism trick) */}
       <pointLight 
          color={glowColor} 
          intensity={0.5} 
          distance={1.5} 
          decay={2} 
          position={[0, 0, 0.2]} 
       />

      {/* 2. Khung màn hình siêu mỏng (Borderless) */}
      <RoundedBox args={[0.7, 0.42, 0.03]} radius={0.01} smoothness={4} castShadow>
        <meshStandardMaterial color="#111" roughness={0.6} />
      </RoundedBox>

      {/* 3. Tấm nền hiển thị (Emissive mạnh để Bloom hoạt động) */}
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[0.68, 0.4]} />
        <meshStandardMaterial 
          color={screenColor}
          emissive={glowColor}
          emissiveIntensity={type === 'code' ? 0.15 : 0.3} // Code tối hơn, Web sáng hơn
          toneMapped={false} // Giữ màu tươi
        />
      </mesh>

      {/* 4. Nội dung giả lập (Fake UI chi tiết hơn) */}
      <group position={[0, 0, 0.02]}>
        {type === 'code' ? (
          // Giao diện VS Code
          <>
            {/* Sidebar trái */}
            <mesh position={[-0.31, 0, 0]}>
              <planeGeometry args={[0.04, 0.4]} />
              <meshBasicMaterial color="#333" />
            </mesh>
            {/* Dòng code random */}
            {Array.from({ length: 12 }).map((_, i) => (
              <mesh key={i} position={[-0.1 + Math.random() * 0.05, 0.15 - i * 0.03, 0]}>
                <planeGeometry args={[0.2 + Math.random() * 0.2, 0.015]} />
                <meshBasicMaterial color={Math.random() > 0.7 ? '#facc15' : '#64748b'} transparent opacity={0.6} />
              </mesh>
            ))}
          </>
        ) : (
          // Giao diện Browser/Design
          <>
            {/* Thanh địa chỉ trình duyệt */}
            <mesh position={[0, 0.16, 0]}>
               <planeGeometry args={[0.64, 0.04]} />
               <meshBasicMaterial color="#f1f5f9" />
            </mesh>
            {/* Các thẻ nội dung (Grid) */}
            <group position={[0, -0.05, 0]}>
               <mesh position={[-0.15, 0, 0]}><planeGeometry args={[0.2, 0.2]} /><meshBasicMaterial color="#f87171" /></mesh>
               <mesh position={[0.15, 0, 0]}><planeGeometry args={[0.2, 0.2]} /><meshBasicMaterial color="#fbbf24" /></mesh>
            </group>
          </>
        )}
      </group>

      {/* 5. Chân đế Monitor (Ergonomic Stand) */}
      <group position={[0, -0.25, 0]}>
        <mesh position={[0, 0, -0.05]}>
           <cylinderGeometry args={[0.015, 0.015, 0.25]} />
           <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, -0.12, 0]} rotation={[0.1, 0, 0]}>
           <boxGeometry args={[0.15, 0.01, 0.15]} />
           <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * DeskSetup 3.0
 */
function DeskSetup({ onProjectClick }) {
  const rgbRef = useRef()
  
  // Chiều cao bàn mới (Tăng từ 0.4 lên 0.75 chuẩn bàn làm việc thực tế)
  const DESK_HEIGHT = 0.75 
  const LEG_HEIGHT = 0.73 // Chân bàn
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (rgbRef.current) {
        rgbRef.current.color.setHSL((t * 0.1) % 1, 0.8, 0.5)
    }
  })
  
  return (
    <group position={[-2.8, 0, -2.5]} rotation={[0, Math.PI / 4, 0]}>
      
      {/* --- MẶT BÀN & CHÂN (NÂNG CAO) --- */}
      <group position={[0, DESK_HEIGHT, 0]}>
          {/* Mặt bàn */}
          <RoundedBox args={[2.2, 0.06, 1.1]} radius={0.02} smoothness={4} castShadow receiveShadow>
            <meshToonMaterial color={COLORS.desk || '#d4a574'} />
          </RoundedBox>
          
          {/* Desk Mat (Thảm chuột) */}
          <mesh position={[0, 0.031, 0.2]} receiveShadow>
             <boxGeometry args={[1.4, 0.01, 0.6]} />
             <meshStandardMaterial color="#27272a" roughness={0.9} />
          </mesh>

          {/* --- CÁC ĐỒ VẬT TRÊN BÀN (Đặt bên trong group này thì sẽ tự nâng theo bàn) --- */}
          
          {/* Monitors */}
          <Monitor 
            type="code" 
            position={[-0.45, 0.35, -0.2]} 
            rotation={[0, 0.15, 0]} 
            onClick={onProjectClick} 
          />
          <Monitor 
            type="design" 
            position={[0.45, 0.35, -0.2]} 
            rotation={[0, -0.15, 0]} 
          />

          {/* PC Tower */}
          <group position={[0.85, 0.3, 0.2]}>
             <RoundedBox args={[0.22, 0.55, 0.55]} radius={0.01} castShadow>
                 <meshStandardMaterial color="#111" metalness={0.6} roughness={0.2} />
             </RoundedBox>
             {/* Kính cường lực & RGB */}
             <mesh position={[-0.111, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
                 <planeGeometry args={[0.45, 0.45]} />
                 <meshStandardMaterial color="#000" transparent opacity={0.2} />
             </mesh>
             <pointLight ref={rgbRef} position={[0, 0, 0]} distance={0.8} intensity={2} />
          </group>

          {/* Keyboard & Mouse */}
          <group position={[0, 0.04, 0.25]}>
            <RoundedBox args={[0.45, 0.02, 0.15]} radius={0.01} castShadow>
                <meshStandardMaterial color="#1f2937" />
            </RoundedBox>
            {/* Keycaps fake */}
            <mesh position={[0, 0.015, 0]}>
                 <planeGeometry args={[0.42, 0.12]} />
                 <meshStandardMaterial color="#374151" />
            </mesh>
          </group>
          
          <group position={[0.4, 0.04, 0.25]}>
             <RoundedBox args={[0.07, 0.035, 0.11]} radius={0.02} castShadow>
                 <meshStandardMaterial color="#fff" />
             </RoundedBox>
          </group>

      </group>
      
      {/* Chân bàn (Dài hơn) */}
      {[[-0.9, -0.4], [-0.9, 0.4], [0.9, -0.4], [0.9, 0.4]].map(([x, z], i) => (
        // Y = LEG_HEIGHT / 2 (để chân chạm đất)
        <mesh key={i} position={[x, LEG_HEIGHT / 2, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.025, LEG_HEIGHT, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}

    </group>
  )
}

export default DeskSetup