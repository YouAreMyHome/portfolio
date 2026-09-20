import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './colors'
import useStore from '../../store/useStore'

/**
 * Bed - Giường ngủ bệt Japandi cao cấp & Tủ đầu giường tiện nghi
 * - Khung giường gỗ sồi bo viền, đầu giường bọc nệm múi dọc
 * - Nệm ngủ êm ái, gối tựa phân tầng, chăn bông bồng bềnh và dải chăn len Terracotta
 * - Tủ đầu giường đầy đủ phụ kiện: ly thủy tinh, sổ tay, điện thoại tương tác và đèn ngủ vật lý IES
 */
function Bed() {
  const phoneRef = useRef()
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isNight = isNightMode || lightingPreset === 'night'

  const oakWood = '#b08053'
  const oakDark = '#8a5e38'
  const brassColor = '#d4af37'

  // Phone notification pulse
  useFrame((state) => {
    if (phoneRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5
      phoneRef.current.material.emissiveIntensity = pulse * 0.8
    }
  })

  return (
    <group position={[-2.8, 0, 1.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* ── 1. KHUNG GIƯỜNG GỖ BỆT JAPANDI (Platform Bed Frame) ── */}
      <group position={[0, 0, 0]}>
        {/* Khung sàn bệt gỗ sồi bo góc mềm */}
        <RoundedBox
          args={[1.68, 0.22, 2.16]}
          radius={0.03}
          smoothness={4}
          position={[0, 0.11, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={oakWood} roughness={0.65} metalness={0.04} />
        </RoundedBox>

        {/* Chân giường gỗ tròn bọc đồng đáy */}
        {[
          [-0.72, -0.96],
          [0.72, -0.96],
          [-0.72, 0.96],
          [0.72, 0.96],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.045, 0]} castShadow>
              <cylinderGeometry args={[0.032, 0.038, 0.09, 12]} />
              <meshStandardMaterial color={oakDark} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.012, 0]} castShadow>
              <cylinderGeometry args={[0.034, 0.038, 0.024, 12]} />
              <meshStandardMaterial color={brassColor} metalness={0.88} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* ── 2. ĐẦU GIƯỜNG BỌC NỆM MÚI DỌC (Upholstered Slatted Headboard) ── */}
        <group position={[0, 0.72, -1.04]}>
          {/* Khung gỗ viền đầu giường */}
          <RoundedBox args={[1.68, 0.75, 0.08]} radius={0.02} smoothness={4} castShadow>
            <meshStandardMaterial color={oakDark} roughness={0.6} metalness={0.04} />
          </RoundedBox>

          {/* Các múi đệm nỉ êm ái bọc vải linen màu kem ấm */}
          {[-0.6, -0.36, -0.12, 0.12, 0.36, 0.6].map((x, i) => (
            <RoundedBox
              key={i}
              args={[0.22, 0.65, 0.04]}
              radius={0.015}
              smoothness={4}
              position={[x, 0, 0.04]}
              castShadow
            >
              <meshStandardMaterial color="#ece5db" roughness={0.88} />
            </RoundedBox>
          ))}
        </group>

        {/* ── 3. NỆM LÒ XO DÀY DẶN (Plush Mattress) ── */}
        <RoundedBox
          args={[1.52, 0.2, 1.98]}
          radius={0.04}
          smoothness={4}
          position={[0, 0.29, 0.04]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#f7f5f0" roughness={0.92} />
        </RoundedBox>

        {/* Drap nệm chun ôm khít viền */}
        <RoundedBox
          args={[1.53, 0.08, 1.99]}
          radius={0.03}
          smoothness={4}
          position={[0, 0.23, 0.04]}
        >
          <meshStandardMaterial color="#eae4d8" roughness={0.9} />
        </RoundedBox>

        {/* ── 4. BỘ GỐI PHÂN TẦNG (Layered Cushions) ── */}
        {/* 2 gối ngủ chính có độ phồng êm */}
        {[-0.38, 0.38].map((x, idx) => (
          <group key={idx} position={[x, 0.45, -0.68]} rotation={[-0.15, 0, 0]}>
            <RoundedBox args={[0.54, 0.13, 0.38]} radius={0.045} smoothness={4} castShadow>
              <meshStandardMaterial color="#ffffff" roughness={0.9} />
            </RoundedBox>
            {/* Lõm nhẹ ở giữa gối do trọng lượng */}
            <mesh position={[0, 0.065, 0]}>
              <circleGeometry args={[0.1, 16]} rotation={[-Math.PI / 2, 0, 0]} />
              <meshBasicMaterial color="#f1eee7" opacity={0.3} transparent />
            </mesh>
          </group>
        ))}

        {/* 2 gối tựa trang trí nhỏ hơn màu xám ấm phía trước */}
        {[-0.32, 0.32].map((x, idx) => (
          <group key={idx} position={[x, 0.49, -0.48]} rotation={[-0.3, 0, idx === 0 ? 0.08 : -0.08]}>
            <RoundedBox args={[0.42, 0.1, 0.28]} radius={0.035} smoothness={4} castShadow>
              <meshStandardMaterial color={idx === 0 ? '#d4cbbe' : '#c9beb0'} roughness={0.88} />
            </RoundedBox>
          </group>
        ))}

        {/* ── 5. CHĂN BÔNG CHÍNH (Fluffy Duvet with Folds) ── */}
        <group position={[0, 0.44, 0.34]}>
          {/* Thân chăn chính phủ dày có nếp gấp */}
          <RoundedBox
            args={[1.44, 0.12, 1.34]}
            radius={0.05}
            smoothness={4}
            position={[0, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color="#cf7f7f" roughness={0.85} />
          </RoundedBox>

          {/* Mép gập ngược phía trên lộ lớp lót lụa mềm mại */}
          <RoundedBox
            args={[1.42, 0.08, 0.26]}
            radius={0.03}
            smoothness={4}
            position={[0, 0.05, -0.62]}
            castShadow
          >
            <meshStandardMaterial color="#fcf8f2" roughness={0.92} />
          </RoundedBox>

          {/* ── 6. DẢI CHĂN LEN TRANG TRÍ (Terracotta Waffle Throw Runner) ── */}
          <group position={[0, 0.062, 0.4]}>
            {/* Dải chăn vắt ngang đuôi giường */}
            <RoundedBox args={[1.45, 0.035, 0.46]} radius={0.015} smoothness={4} castShadow>
              <meshStandardMaterial color="#b85842" roughness={0.92} />
            </RoundedBox>
            {/* Vân dệt nổi nhẹ (Waffle Weave) */}
            {[-0.16, 0, 0.16].map((z, widx) => (
              <mesh key={widx} position={[0, 0.019, z]}>
                <boxGeometry args={[1.44, 0.003, 0.02]} />
                <meshStandardMaterial color="#9c4530" roughness={0.95} />
              </mesh>
            ))}
            {/* Tua rua len ở hai bên sườn (Fringes) */}
            {[-0.725, 0.725].map((fx, fidx) => (
              <group key={fidx} position={[fx, -0.04, 0]}>
                {[...Array(9)].map((_, fi) => (
                  <mesh key={fi} position={[0, 0, -0.2 + fi * 0.05]}>
                    <cylinderGeometry args={[0.003, 0.003, 0.07, 6]} />
                    <meshStandardMaterial color="#b85842" roughness={0.9} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        </group>
      </group>

      {/* ── 7. TỦ ĐẦU GIƯỜNG (Nightstand with Full Styling) ── */}
      <group position={[1.15, 0, -0.6]}>
        {/* Thân tủ gỗ sồi */}
        <RoundedBox
          args={[0.48, 0.46, 0.46]}
          radius={0.02}
          smoothness={4}
          position={[0, 0.28, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={oakWood} roughness={0.62} metalness={0.04} />
        </RoundedBox>

        {/* 4 chân tủ thanh thoát có bọc đồng */}
        {[
          [-0.18, -0.18],
          [0.18, -0.18],
          [-0.18, 0.18],
          [0.18, 0.18],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.04, z]} castShadow>
            <cylinderGeometry args={[0.012, 0.016, 0.08, 8]} />
            <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.25} />
          </mesh>
        ))}

        {/* Ngăn kéo có viền */}
        <mesh position={[0, 0.36, 0.235]} castShadow>
          <boxGeometry args={[0.42, 0.16, 0.015]} />
          <meshStandardMaterial color={oakDark} roughness={0.65} />
        </mesh>
        {/* Tay nắm núm tròn đồng thau (Brass Knob) */}
        <mesh position={[0, 0.36, 0.25]} castShadow>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshStandardMaterial color={brassColor} metalness={0.92} roughness={0.2} />
        </mesh>

        {/* ── Đồ vật trên mặt tủ đầu giường ── */}

        {/* A. Đèn ngủ vật lý IES có chao (Shaded Table Lamp) */}
        <group position={[-0.08, 0.51, -0.06]}>
          {/* Chân đế kim loại vàng đồng */}
          <mesh position={[0, 0.012, 0]} castShadow>
            <cylinderGeometry args={[0.048, 0.054, 0.024, 16]} />
            <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.22} />
          </mesh>
          {/* Trục thân đèn mạ vàng thanh mảnh */}
          <mesh position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.18, 10]} />
            <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.22} />
          </mesh>
          {/* Chao đèn vải linen hình côn cụt */}
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.13, 0.17, 24, 1, true]} />
            <meshStandardMaterial
              color={isNight ? '#fef3c7' : '#f8fafc'}
              emissive={isNight ? '#fde68a' : '#000000'}
              emissiveIntensity={isNight ? 0.35 : 0}
              side={2}
              roughness={0.7}
            />
          </mesh>
          {/* Đỉnh chao đèn mạ vàng */}
          <mesh position={[0, 0.33, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Chiếu sáng vật lý IES: Hắt xuống mặt bàn và hắt nhẹ lên trần */}
          <spotLight
            position={[0, 0.18, 0]}
            angle={Math.PI / 2.5}
            penumbra={0.85}
            intensity={isNight ? 0.8 : 0}
            color="#fed7aa"
            distance={1.4}
            decay={2}
          />
          <spotLight
            position={[0, 0.28, 0]}
            rotation={[-Math.PI, 0, 0]}
            angle={Math.PI / 3.2}
            penumbra={0.9}
            intensity={isNight ? 0.3 : 0}
            color="#fef08a"
            distance={1.8}
            decay={2}
          />
        </group>

        {/* B. Ly nước thủy tinh trong suốt (Glass of Water) */}
        <group position={[0.13, 0.51, -0.1]}>
          {/* Đế lót ly bằng gỗ bần */}
          <mesh position={[0, 0.004, 0]} receiveShadow>
            <cylinderGeometry args={[0.034, 0.034, 0.008, 16]} />
            <meshStandardMaterial color="#c29b68" roughness={0.85} />
          </mesh>
          {/* Thân ly thủy tinh có khúc xạ ánh sáng */}
          <mesh position={[0, 0.038, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.02, 0.065, 14, 1, true]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.08}
              metalness={0.1}
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
          {/* Nước bên trong ly */}
          <mesh position={[0, 0.032, 0]}>
            <cylinderGeometry args={[0.022, 0.018, 0.048, 12]} />
            <meshStandardMaterial
              color="#dbeafe"
              roughness={0.08}
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* C. Cuốn sổ tay bọc da (Leather Notebook with Bookmark) */}
        <group position={[0.08, 0.51, 0.1]} rotation={[0, 0.22, 0]}>
          <RoundedBox args={[0.14, 0.016, 0.19]} radius={0.004} smoothness={4} castShadow>
            <meshStandardMaterial color="#451a03" roughness={0.7} />
          </RoundedBox>
          <mesh position={[0.004, 0, 0]}>
            <boxGeometry args={[0.13, 0.013, 0.18]} />
            <meshStandardMaterial color="#fefce8" roughness={0.9} />
          </mesh>
          {/* Dải ruy băng bookmark màu đỏ mận thò ra mép sổ */}
          <mesh position={[0.02, 0.009, 0.105]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.008, 0.035]} />
            <meshStandardMaterial color="#e11d48" roughness={0.4} side={2} />
          </mesh>
        </group>

        {/* D. Điện thoại thông minh tương tác (Interactive Smartphone) */}
        <mesh
          ref={phoneRef}
          position={[-0.08, 0.52, 0.12]}
          rotation={[-Math.PI / 2, 0, 0.25]}
          castShadow
        >
          <boxGeometry args={[0.085, 0.165, 0.009]} />
          <meshStandardMaterial color="#0f172a" emissive="#00ff00" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  )
}

export default Bed
