import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import TVScreen from './TVScreen'
import useStore from '../../store/useStore'

/**
 * TVSetup - Entertainment Console & Smart TV (Japandi / Modern Hi-Fi Media Bench)
 * Features:
 * - Solid oak TV bench with fluted tambour detail & tapered brass-capped legs reaching y=0
 * - Heavy-duty titanium-finish desktop pedestal stand firmly grounding the TV onto the cabinet
 * - Sleek soundbar, Next-Gen PS5 console, and Hi-Fi studio monitor speaker
 * - Ambilight bias lighting with zero unnatural detached ground shadows
 */
function TVSetup(props) {
  const lightRefLeft = useRef()
  const lightRefRight = useRef()
  const haloRef = useRef()
  const consoleLedRef = useRef()

  // Check if game is active
  const activePanel = useStore((state) => state.activePanel)
  const isGameActive = activePanel === 'playground'

  const lightingPreset = useStore((state) => state.lightingPreset)
  const isNightMode = useStore((state) => state.isNightMode)
  const isNight = isNightMode || lightingPreset === 'night'

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Ambilight color animation
    const targetIntensity = !isNight && !isGameActive ? 0.0 : isGameActive ? 0.45 : 0.28
    const currentColor = new THREE.Color()

    if (!isGameActive) {
      const hue = (t * 0.035) % 1
      currentColor.setHSL(hue, 0.75, 0.55)
    } else {
      currentColor.setHex(0x4ade80)
    }

    ;[lightRefLeft, lightRefRight].forEach((ref) => {
      if (ref.current) {
        ref.current.intensity = THREE.MathUtils.lerp(ref.current.intensity, targetIntensity, 0.1)
        ref.current.color.lerp(currentColor, 0.1)
      }
    })

    if (haloRef.current) {
      haloRef.current.material.color.lerp(currentColor, 0.1)
      haloRef.current.material.opacity = THREE.MathUtils.lerp(
        haloRef.current.material.opacity,
        isNight || isGameActive ? 0.22 : 0.0,
        0.1
      )
    }

    if (consoleLedRef.current) {
      const targetLed = isNight ? 0.35 + Math.sin(t * 3) * 0.15 : 0.12
      consoleLedRef.current.intensity = targetLed
    }
  })

  const oakWood = '#b8895b'
  const oakDark = '#8a623c'
  const brassColor = '#d4af37'
  const titaniumBlack = '#1a1d20'

  return (
    <group position={[1, 0, -3.6]} {...props}>
      {/* ── 1. KỆ TIVI GỖ SỒI BẮC ÂU (Solid Oak Low TV Media Console) ── */}
      <group position={[0, 0, 0]}>
        {/* 4 Chân gỗ côn bọc đế đồng thau đặt vững vàng trên sàn (y = 0.00 đến y = 0.12) */}
        {[
          [-0.64, -0.14],
          [0.64, -0.14],
          [-0.64, 0.14],
          [0.64, 0.14],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            {/* Chụp đế đồng thau chạm sàn (y: 0 đến 0.03) */}
            <mesh position={[0, 0.015, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.015, 0.03, 10]} />
              <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Thân chân gỗ sồi vuốt thon (y: 0.03 đến 0.12) */}
            <mesh position={[0, 0.075, 0]} castShadow>
              <cylinderGeometry args={[0.024, 0.018, 0.09, 10]} />
              <meshStandardMaterial color={oakDark} roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Thân tủ chính (y = 0.12 đến 0.44, tâm tại 0.28) */}
        <RoundedBox args={[1.46, 0.32, 0.4]} radius={0.016} smoothness={4} position={[0, 0.28, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={oakWood} roughness={0.65} metalness={0.04} />
        </RoundedBox>

        {/* Mặt trên bàn vát cạnh (tại y = 0.44) */}
        <RoundedBox args={[1.48, 0.018, 0.42]} radius={0.008} smoothness={4} position={[0, 0.44, 0]} receiveShadow>
          <meshStandardMaterial color={oakDark} roughness={0.55} metalness={0.05} />
        </RoundedBox>

        {/* Cánh cửa tủ kiểu Nan Sọc (Fluted Tambour Accents) */}
        <mesh position={[-0.42, 0.28, 0.202]}>
          <planeGeometry args={[0.54, 0.26]} />
          <meshStandardMaterial color={oakDark} roughness={0.7} />
        </mesh>
        <mesh position={[0.42, 0.28, 0.202]}>
          <planeGeometry args={[0.54, 0.26]} />
          <meshStandardMaterial color={oakDark} roughness={0.7} />
        </mesh>

        {/* Hộc mở trung tâm cho Media Player */}
        <mesh position={[0, 0.28, 0.02]}>
          <boxGeometry args={[0.32, 0.22, 0.38]} />
          <meshStandardMaterial color="#1f1a16" roughness={0.9} />
        </mesh>

        {/* Tay nắm kim loại đồng thau cao cấp */}
        {[-0.38, 0.38].map((x, i) => (
          <mesh key={i} position={[x, 0.32, 0.21]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color={brassColor} metalness={0.88} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* ── 2. CHÂN ĐẾ TIVI ĐẶT BÀN (Heavy-Duty Titanium Pedestal TV Stand) ── */}
      {/* Đế kim loại nguyên khối đặt phẳng trên mặt kệ tivi (y = 0.45) */}
      <group position={[0, 0.45, 0]}>
        <RoundedBox args={[0.46, 0.014, 0.22]} radius={0.006} smoothness={4} position={[0, 0.007, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={titaniumBlack} metalness={0.85} roughness={0.25} />
        </RoundedBox>
        {/* Trụ đứng kim loại nâng đỡ TV vững chãi */}
        <mesh position={[0, 0.22, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.44, 0.05]} />
          <meshStandardMaterial color={titaniumBlack} metalness={0.88} roughness={0.2} />
        </mesh>
        {/* Ngàm VESA kim loại bắt vào lưng TV */}
        <mesh position={[0, 0.46, -0.035]}>
          <boxGeometry args={[0.3, 0.18, 0.02]} />
          <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 3. DÀN LOA SOUNDBAR TRUNG TÂM DƯỚI TV (y = 0.47) ── */}
      <group position={[0, 0.47, 0.08]}>
        <RoundedBox args={[0.68, 0.042, 0.075]} radius={0.008} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#18181b" roughness={0.82} metalness={0.15} />
        </RoundedBox>
        {/* Lưới vải âm thanh mặt trước */}
        <mesh position={[0, 0, 0.039]}>
          <planeGeometry args={[0.66, 0.036]} />
          <meshStandardMaterial color="#27272a" roughness={0.95} />
        </mesh>
        {/* Đèn LED trạng thái nhỏ ở giữa */}
        <mesh position={[0, 0, 0.04]}>
          <circleGeometry args={[0.003, 8]} />
          <meshBasicMaterial color={isGameActive ? '#4ade80' : '#38bdf8'} />
        </mesh>
      </group>

      {/* ── 4. NEXT-GEN PS5 CONSOLE (Đặt trên kệ bên trái, y = 0.45) ── */}
      <group position={[-0.52, 0.60, 0.03]} rotation={[0, 0.15, 0]}>
        {/* Lõi đen bóng */}
        <RoundedBox args={[0.038, 0.29, 0.22]} radius={0.006} smoothness={4} castShadow>
          <meshStandardMaterial color="#09090b" roughness={0.15} metalness={0.4} />
        </RoundedBox>
        {/* Cánh ốp trắng khí động học */}
        <mesh position={[-0.022, 0, 0]} rotation={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[0.007, 0.3, 0.23]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0.022, 0, 0]} rotation={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[0.007, 0.3, 0.23]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Đế đỡ tròn màu đen */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.065, 0.065, 0.012, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.7} />
        </mesh>
        <pointLight ref={consoleLedRef} position={[0, 0.1, 0.1]} distance={0.45} color="#3b82f6" />
      </group>

      {/* ── 5. LOA STUDIO MONITOR (Đặt trên kệ bên phải, y = 0.45) ── */}
      <group position={[0.54, 0.56, 0.03]}>
        <RoundedBox args={[0.16, 0.22, 0.16]} radius={0.012} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#18181b" roughness={0.65} metalness={0.1} />
        </RoundedBox>
        {/* Loa Bass (Woofer) màu vàng sợi kevlar */}
        <mesh position={[0, -0.03, 0.082]}>
          <circleGeometry args={[0.044, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.35} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.03, 0.084]}>
          <circleGeometry args={[0.018, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        {/* Loa Treble (Tweeter) vòm lụa đen */}
        <mesh position={[0, 0.058, 0.082]}>
          <circleGeometry args={[0.02, 18]} />
          <meshStandardMaterial color="#27272a" roughness={0.4} />
        </mesh>
      </group>

      {/* ── 6. TV SET (Gắn chắc trên chân đế, tâm tại y = 0.96) ── */}
      <group position={[0, 0.96, 0]}>
        {/* Ambilight vật lý: Dải sáng ngang 16:9 tạo quầng sáng chữ nhật theo khung TV */}
        <pointLight ref={lightRefLeft} position={[-0.38, 0, -0.05]} intensity={0} distance={1.4} decay={2} />
        <pointLight ref={lightRefRight} position={[0.38, 0, -0.05]} intensity={0} distance={1.4} decay={2} />

        {/* Quầng sáng tản mờ chữ nhật (Bias Lighting Glow Halo) */}
        <mesh ref={haloRef} position={[0, 0, -0.046]}>
          <planeGeometry args={[1.52, 0.96]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Khung viền TV siêu mỏng (Ultra-slim Bezel) */}
        <RoundedBox args={[1.22, 0.72, 0.035]} radius={0.014} smoothness={4} receiveShadow>
          <meshStandardMaterial color="#0a0a0c" roughness={0.25} metalness={0.8} />
        </RoundedBox>

        {/* Viền kim loại sâm-panh cạnh dưới TV */}
        <mesh position={[0, -0.355, 0.018]}>
          <boxGeometry args={[1.22, 0.008, 0.004]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Screen - TVScreen component */}
        <group position={[0, 0, 0.02]}>
          <TVScreen isActive={isGameActive} />
        </group>
      </group>
    </group>
  )
}

export default TVSetup