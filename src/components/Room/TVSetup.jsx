import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { COLORS } from './colors'
import * as THREE from 'three'

function TVSetup(props) {
  const screenRef = useRef()
  const lightRef = useRef()
  const consoleLedRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Animation màu sắc
    const hue = (t * 0.05) % 1
    if (screenRef.current) screenRef.current.material.emissive.setHSL(hue, 0.6, 0.2)
    if (lightRef.current) lightRef.current.color.setHSL(hue, 0.8, 0.5)
    if (consoleLedRef.current) consoleLedRef.current.intensity = 0.5 + Math.sin(t * 3) * 0.5
  })
  
  return (
    <group position={[1, 0, -3.6]} {...props}>
      
      {/* --- KỆ TIVI (Giữ nguyên) --- */}
      <group position={[0, 0.18, 0]}>
         <RoundedBox args={[1.4, 0.35, 0.35]} radius={0.02} castShadow receiveShadow>
             <meshToonMaterial color={COLORS.cabinet || '#5d4037'} />
         </RoundedBox>
         {[-0.6, 0.6].map((x, i) => (
             <mesh key={i} position={[x, -0.2, 0]}>
                 <cylinderGeometry args={[0.02, 0.015, 0.1, 8]} />
                 <meshToonMaterial color="#333" />
             </mesh>
         ))}
         <mesh position={[0, 0, 0.18]}>
             <boxGeometry args={[1.3, 0.3, 0.01]} />
             <meshToonMaterial color={COLORS.cabinet} />
         </mesh>
         {[-0.3, 0.3].map((x, i) => (
             <mesh key={i} position={[x, 0.1, 0.19]}>
                 <boxGeometry args={[0.1, 0.01, 0.01]} />
                 <meshStandardMaterial color="#ffd700" />
             </mesh>
         ))}
      </group>

      {/* --- NEXT-GEN CONSOLE (Đã chỉnh vị trí & kích thước) --- */}
      {/* Đẩy sang trái x = -0.5, Hạ thấp xuống y = 0.48 để nằm trên mặt kệ */}
      <group position={[-0.5, 0.48, 0.05]} rotation={[0, 0.2, 0]}>
         {/* Giảm kích thước xuống một chút cho hợp lý (args cũ 0.35 -> 0.28) */}
         <RoundedBox args={[0.035, 0.28, 0.22]} radius={0.005} castShadow>
             <meshStandardMaterial color="#111" roughness={0.2} />
         </RoundedBox>
         {/* Ốp trắng 2 bên */}
         <group>
             <mesh position={[-0.02, 0, 0]} rotation={[0, 0, 0.05]}>
                 <boxGeometry args={[0.008, 0.29, 0.23]} />
                 <meshStandardMaterial color="#eee" />
             </mesh>
             <mesh position={[0.02, 0, 0]} rotation={[0, 0, -0.05]}>
                 <boxGeometry args={[0.008, 0.29, 0.23]} />
                 <meshStandardMaterial color="#eee" />
             </mesh>
         </group>
         <pointLight ref={consoleLedRef} position={[0, 0.1, 0.1]} distance={0.4} color="#3b82f6" />
      </group>

      {/* --- LOA (Đã chỉnh vị trí) --- */}
      {/* Đẩy sang phải x = 0.5 */}
      <group position={[0.5, 0.45, 0.05]}>
          <RoundedBox args={[0.15, 0.2, 0.15]} radius={0.01} castShadow>
              <meshToonMaterial color="#222" />
          </RoundedBox>
          <mesh position={[0, 0, 0.08]}>
              <circleGeometry args={[0.05, 32]} />
              <meshBasicMaterial color="#333" />
          </mesh>
      </group>

      {/* --- TV SET (Treo cao hơn) --- */}
      {/* Nâng Y từ 0.75 -> 1.0 để hở khoảng trống bên dưới */}
      <group position={[0, 1.0, 0]}>
         
         {/* Ambilight */}
         <pointLight ref={lightRef} position={[0, 0, -0.2]} intensity={1} distance={3} decay={2} />

         {/* Bỏ chân đế TV cũ, thay bằng Wall Mount (Giá treo tường) cho hiện đại */}
         <mesh position={[0, 0, -0.04]}>
             <boxGeometry args={[0.4, 0.2, 0.05]} />
             <meshStandardMaterial color="#111" />
         </mesh>

         {/* TV Frame */}
         <RoundedBox args={[1.2, 0.7, 0.04]} radius={0.02} castShadow>
            <meshStandardMaterial color="#111" roughness={0.5} />
         </RoundedBox>

         {/* Screen */}
         <mesh ref={screenRef} position={[0, 0, 0.021]}>
            <planeGeometry args={[1.15, 0.65]} />
            <meshStandardMaterial 
                color="#000" 
                emissive="#ffffff"
                emissiveIntensity={0.5}
                toneMapped={false}
            />
         </mesh>

         {/* Nội dung TV */}
         <group position={[0, 0, 0.022]}>
             <mesh position={[-0.3, 0.05, 0]}>
                 <planeGeometry args={[0.4, 0.4]} />
                 <meshBasicMaterial color="#ef4444" />
             </mesh>
             {[0.2, 0.05, -0.1].map((y, i) => (
                 <mesh key={i} position={[0.3, y, 0]}>
                     <planeGeometry args={[0.4, 0.1]} />
                     <meshBasicMaterial color="#64748b" />
                 </mesh>
             ))}
             <mesh position={[0, -0.25, 0]}>
                 <planeGeometry args={[1, 0.02]} />
                 <meshBasicMaterial color="#333" />
             </mesh>
         </group>

      </group>

    </group>
  )
}

export default TVSetup