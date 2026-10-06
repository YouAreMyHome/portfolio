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
// Flyweight Assets cho Giường bệt Japandi
const bedLegGeo = new THREE.CylinderGeometry(0.032, 0.038, 0.09, 12)
const bedFerruleGeo = new THREE.CylinderGeometry(0.034, 0.038, 0.024, 12)
const bedLegMat = new THREE.MeshStandardMaterial({ color: '#8a5e38', roughness: 0.6 })
const bedBrassMat = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.88, roughness: 0.25 })
const headboardTuftMat = new THREE.MeshStandardMaterial({ color: '#ece5db', roughness: 0.88 })

function Bed() {
  const phoneRef = useRef()
  const duvetRef = useRef()
  const bodyMoundRef = useRef()
  const pillowLeftRef = useRef()
  const pillowRightRef = useRef()
  const cushionLeftRef = useRef()
  const mattressRef = useRef()

  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isCharacterSleeping = useStore((state) => state.isCharacterSleeping)
  const characterAction = useStore((state) => state.characterAction)
  const isNight = isNightMode || lightingPreset === 'night'

  const oakWood = '#b08053'
  const oakDark = '#8a5e38'
  const brassColor = '#d4af37'

  // Phone notification pulse & Bed Duvet / Mattress / Pillow Dynamic Reactivity
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const isSitting = characterAction === 'sitting_bed'
    const isSleeping = isCharacterSleeping || characterAction === 'sleeping'

    if (phoneRef.current) {
      if (isNight) {
        const pulse = Math.sin(t * 2.4) * 0.5 + 0.5
        phoneRef.current.material.emissive = new THREE.Color('#38bdf8')
        phoneRef.current.material.emissiveIntensity = 0.2 + pulse * 0.8
      } else {
        phoneRef.current.material.emissive = new THREE.Color('#22c55e')
        phoneRef.current.material.emissiveIntensity = 0.25
      }
    }

    // Dynamic Mattress Indentation under sitting / lying body weight
    if (mattressRef.current) {
      const targetMattressY = isSleeping ? 0.275 : isSitting ? 0.278 : 0.29
      const targetMattressRotX = isSitting ? 0.018 : 0
      mattressRef.current.position.y = THREE.MathUtils.lerp(mattressRef.current.position.y, targetMattressY, delta * 4)
      mattressRef.current.rotation.x = THREE.MathUtils.lerp(mattressRef.current.rotation.x, targetMattressRotX, delta * 4)
    }

    // Dynamic Bed Reaction when Character is Sleeping (Harmonic breathing & Duvet tuck)
    if (duvetRef.current) {
      // When sleeping: duvet pulls up neatly over body up to chest at z = 0.20, leaves head on pillow
      // When awake: duvet folds back down neatly towards the foot of the bed at z = 0.34
      const targetZ = isSleeping ? 0.20 : 0.34
      const targetScaleZ = isSleeping ? 1.12 : 0.98
      const targetY = isSleeping
        ? 0.468 + Math.sin(t * 1.4) * 0.005 // Synchronous harmonic breathing with character
        : 0.44

      duvetRef.current.position.z = THREE.MathUtils.lerp(duvetRef.current.position.z, targetZ, delta * 3.5)
      duvetRef.current.position.y = THREE.MathUtils.lerp(duvetRef.current.position.y, targetY, delta * 3.5)
      duvetRef.current.scale.z = THREE.MathUtils.lerp(duvetRef.current.scale.z, targetScaleZ, delta * 3.5)
    }

    // Dynamic 3D body mound under duvet (chăn phồng tự nhiên theo dáng người nằm bên dưới)
    if (bodyMoundRef.current) {
      const targetMoundScaleY = isSleeping ? 1.0 : 0.001
      bodyMoundRef.current.scale.y = THREE.MathUtils.lerp(bodyMoundRef.current.scale.y, targetMoundScaleY, delta * 3.5)
      bodyMoundRef.current.visible = bodyMoundRef.current.scale.y > 0.01
    }

    // Pillow indents smoothly under character's head on left side when sleeping
    const targetLeftPillowScaleY = isSleeping ? 0.68 : 1.0
    const targetLeftPillowY = isSleeping ? 0.425 : 0.45
    if (pillowLeftRef.current) {
      pillowLeftRef.current.scale.y = THREE.MathUtils.lerp(pillowLeftRef.current.scale.y, targetLeftPillowScaleY, delta * 4.0)
      pillowLeftRef.current.position.y = THREE.MathUtils.lerp(pillowLeftRef.current.position.y, targetLeftPillowY, delta * 4.0)
    }
    // Right pillow stays fluffy and uncompressed
    if (pillowRightRef.current) {
      pillowRightRef.current.scale.y = THREE.MathUtils.lerp(pillowRightRef.current.scale.y, 1.0, delta * 4.0)
      pillowRightRef.current.position.y = THREE.MathUtils.lerp(pillowRightRef.current.position.y, 0.45, delta * 4.0)
    }

    // Left decorative cushion neatly shifts back against headboard when sleeping so it doesn't crowd sleeper
    if (cushionLeftRef.current) {
      const targetCushionZ = isSleeping ? -0.78 : -0.48
      const targetCushionX = isSleeping ? -0.58 : -0.32
      const targetCushionY = isSleeping ? 0.52 : 0.49
      const targetCushionRotX = isSleeping ? -0.12 : -0.3
      cushionLeftRef.current.position.z = THREE.MathUtils.lerp(cushionLeftRef.current.position.z, targetCushionZ, delta * 3.5)
      cushionLeftRef.current.position.x = THREE.MathUtils.lerp(cushionLeftRef.current.position.x, targetCushionX, delta * 3.5)
      cushionLeftRef.current.position.y = THREE.MathUtils.lerp(cushionLeftRef.current.position.y, targetCushionY, delta * 3.5)
      cushionLeftRef.current.rotation.x = THREE.MathUtils.lerp(cushionLeftRef.current.rotation.x, targetCushionRotX, delta * 3.5)
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

        {/* Chân giường gỗ tròn bọc đồng đáy (Flyweight) */}
        {[
          [-0.72, -0.96],
          [0.72, -0.96],
          [-0.72, 0.96],
          [0.72, 0.96],
        ].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.045, 0]} castShadow geometry={bedLegGeo} material={bedLegMat} />
            <mesh position={[0, 0.012, 0]} castShadow geometry={bedFerruleGeo} material={bedBrassMat} />
          </group>
        ))}

        {/* ── Floating Bed Japandi LED Underglow (Dải sáng hắt chân giường) ── */}
        <pointLight
          position={[0, 0.04, 0]}
          intensity={isNight ? 0.75 : lightingPreset === 'sunset' ? 0.35 : 0}
          color="#fbbf24"
          distance={2.8}
          decay={1.8}
        />

        {/* ── 2. ĐẦU GIƯỜNG BỌC NỆM MÚI DỌC (Upholstered Slatted Headboard) ── */}
        <group position={[0, 0.72, -1.04]}>
          {/* Khung gỗ viền đầu giường */}
          <RoundedBox args={[1.68, 0.75, 0.08]} radius={0.02} smoothness={4} castShadow>
            <meshStandardMaterial color={oakDark} roughness={0.6} metalness={0.04} />
          </RoundedBox>

          {/* Các múi đệm nỉ êm ái bọc vải linen màu kem ấm (Flyweight) */}
          {[-0.6, -0.36, -0.12, 0.12, 0.36, 0.6].map((x, i) => (
            <RoundedBox
              key={i}
              args={[0.22, 0.65, 0.04]}
              radius={0.015}
              smoothness={4}
              position={[x, 0, 0.04]}
              castShadow
              material={headboardTuftMat}
            />
          ))}
        </group>

        {/* ── 3. NỆM LÒ XO DÀY DẶN (Plush Mattress có phản ứng đệm lún) ── */}
        <group ref={mattressRef} position={[0, 0.29, 0.04]}>
          <RoundedBox
            args={[1.52, 0.2, 1.98]}
            radius={0.04}
            smoothness={4}
            position={[0, 0, 0]}
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
            position={[0, -0.06, 0]}
          >
            <meshStandardMaterial color="#eae4d8" roughness={0.9} />
          </RoundedBox>
        </group>

        {/* ── 4. BỘ GỐI PHÂN TẦNG (Layered Cushions) ── */}
        {/* 2 gối ngủ chính có độ phồng êm */}
        <group ref={pillowLeftRef} position={[-0.38, 0.45, -0.68]} rotation={[-0.15, 0, 0]}>
          <RoundedBox args={[0.54, 0.13, 0.38]} radius={0.045} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </RoundedBox>
          {/* Lõm nhẹ ở giữa gối do trọng lượng */}
          <mesh position={[0, 0.065, 0]}>
            <circleGeometry args={[0.1, 16]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshBasicMaterial color="#f1eee7" opacity={0.3} transparent />
          </mesh>
        </group>

        <group ref={pillowRightRef} position={[0.38, 0.45, -0.68]} rotation={[-0.15, 0, 0]}>
          <RoundedBox args={[0.54, 0.13, 0.38]} radius={0.045} smoothness={4} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </RoundedBox>
          {/* Lõm nhẹ ở giữa gối do trọng lượng */}
          <mesh position={[0, 0.065, 0]}>
            <circleGeometry args={[0.1, 16]} rotation={[-Math.PI / 2, 0, 0]} />
            <meshBasicMaterial color="#f1eee7" opacity={0.3} transparent />
          </mesh>
        </group>

        {/* 2 gối tựa trang trí nhỏ hơn màu xám ấm phía trước */}
        <group ref={cushionLeftRef} position={[-0.32, 0.49, -0.48]} rotation={[-0.3, 0, 0.08]}>
          <RoundedBox args={[0.42, 0.1, 0.28]} radius={0.035} smoothness={4} castShadow>
            <meshStandardMaterial color="#d4cbbe" roughness={0.88} />
          </RoundedBox>
        </group>
        <group position={[0.32, 0.49, -0.48]} rotation={[-0.3, 0, -0.08]}>
          <RoundedBox args={[0.42, 0.1, 0.28]} radius={0.035} smoothness={4} castShadow>
            <meshStandardMaterial color="#c9beb0" roughness={0.88} />
          </RoundedBox>
        </group>

        {/* ── 5. CHĂN BÔNG CHÍNH (Fluffy Duvet with Dynamic Tuck & Body Mound) ── */}
        <group ref={duvetRef} position={[0, 0.44, 0.34]}>
          {/* Thân chăn chính phủ dày có nếp gấp */}
          <RoundedBox
            args={[1.44, 0.12, 1.34]}
            radius={0.05}
            smoothness={4}
            position={[0, 0, 0]}
            castShadow
            receiveShadow
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
            receiveShadow
          >
            <meshStandardMaterial color="#fcf8f2" roughness={0.92} />
          </RoundedBox>

          {/* Khối chăn phồng tự nhiên theo dáng người đang ngủ (Body Mound) */}
          <group ref={bodyMoundRef} position={[0, 0, 0]} scale={[1, 0.001, 1]}>
            {/* Phồng ngực & thân trên */}
            <RoundedBox
              args={[0.52, 0.11, 0.62]}
              radius={0.045}
              smoothness={4}
              position={[-0.38, 0.065, -0.30]}
              castShadow
            >
              <meshStandardMaterial color="#fcf8f2" roughness={0.92} />
            </RoundedBox>
            {/* Phồng hông & chân bao trọn vẹn đôi chân và gấu quần */}
            <RoundedBox
              args={[0.48, 0.095, 0.72]}
              radius={0.038}
              smoothness={4}
              position={[-0.38, 0.048, 0.28]}
              castShadow
            >
              <meshStandardMaterial color="#fcf8f2" roughness={0.92} />
            </RoundedBox>
            {/* Mép chăn lụa gấp ngược phồng uốn lượn ôm qua ngực người nằm */}
            <RoundedBox
              args={[0.54, 0.085, 0.26]}
              radius={0.03}
              smoothness={4}
              position={[-0.38, 0.088, -0.60]}
              castShadow
            >
              <meshStandardMaterial color="#fcf8f2" roughness={0.92} />
            </RoundedBox>
          </group>

          {/* ── 6. DẢI CHĂN LEN TRANG TRÍ (Terracotta Waffle Throw Runner) ── */}
          <group position={[0, 0.062, 0.4]}>
            {/* Dải chăn vắt ngang đuôi giường */}
            <RoundedBox args={[1.45, 0.035, 0.46]} radius={0.015} smoothness={4} castShadow receiveShadow>
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
          {/* Chao đèn vải linen hình côn cụt - Tỏa sáng ấm cúng chuẩn Bloom */}
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.085, 0.13, 0.17, 24, 1, true]} />
            <meshStandardMaterial
              color={isNight ? '#fef3c7' : '#f8fafc'}
              emissive={isNight ? '#fde68a' : lightingPreset === 'sunset' ? '#f59e0b' : '#000000'}
              emissiveIntensity={isNight ? 1.4 : lightingPreset === 'sunset' ? 0.75 : 0}
              toneMapped={false}
              side={2}
              roughness={0.7}
            />
          </mesh>
          {/* Đỉnh chao đèn mạ vàng */}
          <mesh position={[0, 0.33, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color={brassColor} metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Chiếu sáng 2700K tỏa ấm cúng quanh góc ngủ */}
          <pointLight
            position={[0, 0.24, 0]}
            intensity={isNight ? 1.15 : lightingPreset === 'sunset' ? 0.55 : lightingPreset === 'rainy' ? 0.45 : 0.1}
            color="#fde68a"
            distance={3.6}
            decay={1.8}
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
