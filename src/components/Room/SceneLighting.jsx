import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../store/useStore'
import { useMobile } from '../../utils/useMobile'

// Shared temporary math objects (Zero Allocation - GC-free)
const _tempColor = new THREE.Color()
const _tempVec3 = new THREE.Vector3()

/**
 * SceneLighting - Hệ thống thiết kế chiếu sáng nội thất kiến trúc chuyên nghiệp (Architectural Lighting Suite)
 * 
 * Thiết kế theo 4 phân lớp ánh sáng chuẩn kiến trúc (Architectural Lighting Layers):
 * 1. Ambient & Infill Layer: Bầu không khí nhung lam huyền ảo (Velvet Midnight), triệt tiêu tối đen,
 *    giữ mọi chi tiết sàn gỗ, tường, đồ vật rõ nét và trong trẻo.
 * 2. Natural Key & Rim Layer: Ánh trăng bàng bạc / Nắng ban mai xuyên cửa sổ với vệt bóng mềm tự nhiên.
 * 3. Interior Focal & Accent Lights:
 *    - Đèn ngủ IES đầu giường (2700K Warm Golden Beacon)
 *    - Đèn LED hắt chân giường phong cách Japandi (Floating Bed Amber Underglow)
 *    - Đèn hắt tường sau màn hình máy tính (Dual Monitor Bias Lighting - Lo-fi Cyan)
 *    - Đèn gầm bàn làm việc (Under-desk Cyber Glow)
 *    - Đèn bàn làm việc tương tác (Desk Task Light)
 *    - Đèn dây trang trí gắn tường (Dreamy Fairy Lights)
 *    - Đèn rọi tranh & bảng kỹ năng (Art Wall Downlight Accent)
 * 4. Room Center Diffuse Bounce: Ánh sáng tán xạ phản hồi từ sàn gỗ và thảm len kem ấm áp.
 */
function SceneLighting() {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const deskLampOn = useStore((state) => state.deskLampOn)
  const stringLightsOn = useStore((state) => state.stringLightsOn)
  const { isMobile } = useMobile()

  // References cho từng nguồn sáng kiến trúc
  const ambientRef = useRef()
  const directionalRef = useRef()
  const targetRef = useRef()
  const windowLightRef = useRef()
  const windowTargetRef = useRef()
  const rimLightRef = useRef()
  const deskLampRef = useRef()
  const monitorBiasRef = useRef()
  const bedsideLampRef = useRef()
  const bedUnderglowRef = useRef()
  const roomBounceRef = useRef()
  const stringLightsRef = useRef()
  const artWallAccentRef = useRef()
  const underDeskRef = useRef()

  // ── Bảng cấu hình quang học 4 kịch bản ánh sáng (Master Optical Profiles) ──
  const PRESET_CONFIGS = {
    morning: {
      ambient: { intensity: 0.36, color: '#fbf6ef' }, // Cân bằng mềm mại, giữ độ sâu bóng đổ chân thực
      directional: {
        intensity: 1.08, // Nắng ban mai ấm áp tự nhiên, triệt tiêu hiện tượng cháy sáng sàn gỗ
        color: '#fff1d6',
        pos: [-2.6, 6.8, -6.8],
        target: [-0.6, 0.3, -0.6],
        shadowRadius: 2.2,
        shadowBias: -0.00012,
        shadowNormalBias: 0.028,
      },
      window: { intensity: 0.32, color: '#e0f2fe' },
      rim: { intensity: 0.20, color: '#fef3c7' },
      monitorBias: { intensity: 0.25, color: '#38bdf8' },
      bedsideLamp: { intensity: 0.25, color: '#fef08a' },
      bedUnderglow: { intensity: 0.0, color: '#fbbf24' },
      roomBounce: { intensity: 0.10, color: '#fed7aa' },
      stringLights: { intensity: 0.15, color: '#fef08a' },
      artAccent: { intensity: 0.20, color: '#fef3c7' },
      underDesk: { intensity: 0.10, color: '#06b6d4' },
    },
    sunset: {
      ambient: { intensity: 0.38, color: '#fed7aa' },
      directional: {
        intensity: 1.12,
        color: '#fb923c',
        pos: [-3.6, 3.8, -7.5],
        target: [0.0, 0.2, 0.3],
        shadowRadius: 3.2,
        shadowBias: -0.0001,
        shadowNormalBias: 0.032,
      },
      window: { intensity: 0.40, color: '#ea580c' },
      rim: { intensity: 0.28, color: '#f43f5e' },
      monitorBias: { intensity: 0.65, color: '#818cf8' },
      bedsideLamp: { intensity: 0.85, color: '#fde68a' },
      bedUnderglow: { intensity: 0.45, color: '#fbbf24' },
      roomBounce: { intensity: 0.22, color: '#fed7aa' },
      stringLights: { intensity: 0.70, color: '#fef08a' },
      artAccent: { intensity: 0.35, color: '#fed7aa' },
      underDesk: { intensity: 0.30, color: '#06b6d4' },
    },
    rainy: {
      ambient: { intensity: 0.52, color: '#68778d' },
      directional: {
        intensity: 0.38,
        color: '#94a3b8',
        pos: [-2.5, 7.5, -6.5],
        target: [-0.5, 0.4, -0.5],
        shadowRadius: 7.0,
        shadowBias: -0.0001,
        shadowNormalBias: 0.025,
      },
      window: { intensity: 0.28, color: '#60a5fa' },
      rim: { intensity: 0.20, color: '#cbd5e1' },
      monitorBias: { intensity: 0.75, color: '#38bdf8' },
      bedsideLamp: { intensity: 0.75, color: '#fde68a' },
      bedUnderglow: { intensity: 0.35, color: '#fbbf24' },
      roomBounce: { intensity: 0.20, color: '#93c5fd' },
      stringLights: { intensity: 0.60, color: '#fef08a' },
      artAccent: { intensity: 0.30, color: '#fde68a' },
      underDesk: { intensity: 0.35, color: '#06b6d4' },
    },
    night: {
      ambient: { intensity: 0.62, color: '#252844' }, // Ánh sáng nhung lam huyền ảo vừa vặn
      directional: {
        intensity: 0.38,
        color: '#93c5fd', // Ánh trăng bàng bạc tự nhiên xuyên cửa sổ
        pos: [-2.6, 6.5, -6.8],
        target: [-0.6, 0.3, -0.6],
        shadowRadius: 5.0,
        shadowBias: -0.0001,
        shadowNormalBias: 0.032,
      },
      window: { intensity: 0.50, color: '#60a5fa' },
      rim: { intensity: 0.28, color: '#a5b4fc' },
      monitorBias: { intensity: 0.85, color: '#38bdf8' },
      bedsideLamp: { intensity: 0.48, color: '#f59e0b' },
      bedUnderglow: { intensity: 0.55, color: '#f59e0b' },
      roomBounce: { intensity: 0.36, color: '#fed7aa' },
      stringLights: { intensity: 0.35, color: '#fbbf24' },
      artAccent: { intensity: 0.28, color: '#fef3c7' },
      underDesk: { intensity: 0.38, color: '#06b6d4' },
    },
  }

  const activePreset = isNightMode ? 'night' : lightingPreset || 'morning'
  const isNight = activePreset === 'night'
  const targetConfig = PRESET_CONFIGS[activePreset] || PRESET_CONFIGS.morning

  // Setup directional and spot targets
  useEffect(() => {
    if (directionalRef.current && targetRef.current) {
      directionalRef.current.target = targetRef.current
      targetRef.current.position.set(-0.8, 0.3, -0.5)
      targetRef.current.updateMatrixWorld()
    }
    if (windowLightRef.current && windowTargetRef.current) {
      windowLightRef.current.target = windowTargetRef.current
      windowTargetRef.current.position.set(-0.8, 0.6, -1.2)
      windowTargetRef.current.updateMatrixWorld()
    }
  }, [])

  // Smooth frame loop transitions với Exponential Damping mượt mà (Framerate-independent)
  useFrame((_, delta) => {
    const factor = 1 - Math.exp(-2.6 * delta)
    const lampFactor = 1 - Math.exp(-6 * delta)

    // 1. Ambient Light
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetConfig.ambient.intensity,
        factor
      )
      _tempColor.set(targetConfig.ambient.color)
      ambientRef.current.color.lerp(_tempColor, factor)
    }

    // 2. Directional Key Light
    if (directionalRef.current) {
      directionalRef.current.intensity = THREE.MathUtils.lerp(
        directionalRef.current.intensity,
        targetConfig.directional.intensity,
        factor
      )
      _tempColor.set(targetConfig.directional.color)
      directionalRef.current.color.lerp(_tempColor, factor)
      _tempVec3.set(...targetConfig.directional.pos)
      directionalRef.current.position.lerp(_tempVec3, factor)

      if (directionalRef.current.shadow) {
        directionalRef.current.shadow.radius = THREE.MathUtils.lerp(
          directionalRef.current.shadow.radius || 1.8,
          targetConfig.directional.shadowRadius,
          factor
        )
      }
    }

    if (targetRef.current && targetConfig.directional.target) {
      _tempVec3.set(...targetConfig.directional.target)
      targetRef.current.position.lerp(_tempVec3, factor)
      targetRef.current.updateMatrixWorld()
    }

    // 3. Window Moonbeam / Sunlight Portal
    if (windowLightRef.current) {
      windowLightRef.current.intensity = THREE.MathUtils.lerp(
        windowLightRef.current.intensity,
        targetConfig.window.intensity,
        factor
      )
      _tempColor.set(targetConfig.window.color)
      windowLightRef.current.color.lerp(_tempColor, factor)
    }

    // 4. Rim Light
    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        targetConfig.rim.intensity,
        factor
      )
      _tempColor.set(targetConfig.rim.color)
      rimLightRef.current.color.lerp(_tempColor, factor)
    }

    // 5. Desk Task Lamp (Êm dịu như bóng đèn sợi đốt)
    if (deskLampRef.current) {
      const targetLamp = deskLampOn ? 1.25 : isNight ? 0.35 : 0.0
      deskLampRef.current.intensity = THREE.MathUtils.lerp(
        deskLampRef.current.intensity,
        targetLamp,
        lampFactor
      )
    }

    // 6. Monitor Bias Light
    if (monitorBiasRef.current) {
      monitorBiasRef.current.intensity = THREE.MathUtils.lerp(
        monitorBiasRef.current.intensity,
        targetConfig.monitorBias.intensity,
        factor
      )
      _tempColor.set(targetConfig.monitorBias.color)
      monitorBiasRef.current.color.lerp(_tempColor, factor)
    }

    // 7. Bedside Reading Lamp
    if (bedsideLampRef.current) {
      bedsideLampRef.current.intensity = THREE.MathUtils.lerp(
        bedsideLampRef.current.intensity,
        targetConfig.bedsideLamp.intensity,
        factor
      )
      _tempColor.set(targetConfig.bedsideLamp.color)
      bedsideLampRef.current.color.lerp(_tempColor, factor)
    }

    // 8. Floating Bed LED Underglow
    if (bedUnderglowRef.current) {
      bedUnderglowRef.current.intensity = THREE.MathUtils.lerp(
        bedUnderglowRef.current.intensity,
        targetConfig.bedUnderglow.intensity,
        factor
      )
      _tempColor.set(targetConfig.bedUnderglow.color)
      bedUnderglowRef.current.color.lerp(_tempColor, factor)
    }

    // 9. Room Center Diffuse Bounce
    if (roomBounceRef.current) {
      roomBounceRef.current.intensity = THREE.MathUtils.lerp(
        roomBounceRef.current.intensity,
        targetConfig.roomBounce.intensity,
        factor
      )
      _tempColor.set(targetConfig.roomBounce.color)
      roomBounceRef.current.color.lerp(_tempColor, factor)
    }

    // 10. String / Fairy Lights
    if (stringLightsRef.current) {
      const targetString = stringLightsOn ? 1.2 : targetConfig.stringLights.intensity
      stringLightsRef.current.intensity = THREE.MathUtils.lerp(
        stringLightsRef.current.intensity,
        targetString,
        factor
      )
      _tempColor.set(targetConfig.stringLights.color)
      stringLightsRef.current.color.lerp(_tempColor, factor)
    }

    // 11. Art Wall Accent Downlight
    if (artWallAccentRef.current) {
      artWallAccentRef.current.intensity = THREE.MathUtils.lerp(
        artWallAccentRef.current.intensity,
        targetConfig.artAccent.intensity,
        factor
      )
      _tempColor.set(targetConfig.artAccent.color)
      artWallAccentRef.current.color.lerp(_tempColor, factor)
    }

    // 12. Under-Desk Tech Glow
    if (underDeskRef.current) {
      underDeskRef.current.intensity = THREE.MathUtils.lerp(
        underDeskRef.current.intensity,
        targetConfig.underDesk.intensity,
        factor
      )
      _tempColor.set(targetConfig.underDesk.color)
      underDeskRef.current.color.lerp(_tempColor, factor)
    }
  })

  const shadowMapResolution = isMobile ? [512, 512] : [1024, 1024]

  return (
    <>
      {/* Directional & Window target objects */}
      <object3D ref={targetRef} position={[-0.8, 0.3, -0.5]} />
      <object3D ref={windowTargetRef} position={[-0.8, 0.6, -1.2]} />

      {/* ── 1. AMBIENT LIGHT (Bầu không khí nhung lam, giữ không gian trong trẻo, không đen chết) ── */}
      <ambientLight
        ref={ambientRef}
        intensity={targetConfig.ambient.intensity}
        color={targetConfig.ambient.color}
      />

      {/* ── 2. KEY DIRECTIONAL LIGHT (Mặt trời / Ánh trăng chuẩn vật lý rọi qua cửa sổ) ── */}
      <directionalLight
        ref={directionalRef}
        position={targetConfig.directional.pos}
        intensity={targetConfig.directional.intensity}
        color={targetConfig.directional.color}
        castShadow
        shadow-mapSize={shadowMapResolution}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={targetConfig.directional.shadowBias}
        shadow-normalBias={targetConfig.directional.shadowNormalBias}
        shadow-radius={targetConfig.directional.shadowRadius}
      />

      {/* ── 3. WINDOW PORTAL SKYLIGHT (Vệt trăng / Nắng vàng tỏa vào phòng) ── */}
      <spotLight
        ref={windowLightRef}
        position={[-2.0, 1.85, -3.8]}
        intensity={targetConfig.window.intensity}
        color={targetConfig.window.color}
        distance={9.0}
        angle={Math.PI / 2.6}
        penumbra={0.95}
        decay={1.6}
      />

      {/* ── 4. RIM LIGHT (Tôn khối Isometric 3D) ── */}
      <pointLight
        ref={rimLightRef}
        position={[6, 4.5, 6]}
        intensity={targetConfig.rim.intensity}
        color={targetConfig.rim.color}
      />

      {/* ── 5. ĐÈN BÀN LÀM VIỆC TƯƠNG TÁC (Ấm áp, soi sáng bàn phím & deskmat) ── */}
      <pointLight
        ref={deskLampRef}
        position={[-2.4, 1.25, -2.1]}
        intensity={deskLampOn ? 1.25 : isNight ? 0.35 : 0}
        color="#fef3c7"
        distance={3.5}
        decay={1.8}
      />

      {/* ── 6. DUAL MONITOR SCREEN BIAS LIGHTING (LED Cyan/Indigo hắt sau màn hình máy tính) ── */}
      <pointLight
        ref={monitorBiasRef}
        position={[-2.3, 1.35, -2.7]}
        intensity={targetConfig.monitorBias.intensity}
        color={targetConfig.monitorBias.color}
        distance={3.8}
        decay={1.8}
      />

      {/* ── 7. UNDER-DESK CYBER GLOW (Ánh sáng công nghệ gầm bàn PC) ── */}
      <pointLight
        ref={underDeskRef}
        position={[-2.4, 0.3, -2.4]}
        intensity={targetConfig.underDesk.intensity}
        color={targetConfig.underDesk.color}
        distance={2.4}
        decay={1.8}
      />

      {/* ── 8. BEDSIDE READING LAMP (Ngọn hải đăng ấm áp 2200K đầu giường) ── */}
      <pointLight
        ref={bedsideLampRef}
        position={[-3.4, 0.85, 0.35]}
        intensity={targetConfig.bedsideLamp.intensity}
        color={targetConfig.bedsideLamp.color}
        distance={4.0}
        decay={2.0}
      />

      {/* ── 9. FLOATING BED JAPANDI LED UNDERGLOW (Dải LED hổ phách hắt chân giường) ── */}
      <pointLight
        ref={bedUnderglowRef}
        position={[-2.8, 0.08, 1.5]}
        intensity={targetConfig.bedUnderglow.intensity}
        color={targetConfig.bedUnderglow.color}
        distance={3.2}
        decay={2.0}
      />

      {/* ── 10. ROOM CENTER DIFFUSE BOUNCE (Ánh sáng phản hồi từ sàn gỗ sồi & thảm len) ── */}
      <pointLight
        ref={roomBounceRef}
        position={[0.2, 1.4, 0.2]}
        intensity={targetConfig.roomBounce.intensity}
        color={targetConfig.roomBounce.color}
        distance={6.5}
        decay={1.8}
      />

      {/* ── 11. DREAMY FAIRY LIGHTS WALL WASH (Dải đèn dây phủ dịu vào lòng phòng, triệt tiêu vệt cháy tường) ── */}
      <pointLight
        ref={stringLightsRef}
        position={[-3.35, 2.3, 0]}
        intensity={stringLightsOn ? 0.65 : targetConfig.stringLights.intensity}
        color={targetConfig.stringLights.color}
        distance={4.8}
        decay={2.0}
      />

      {/* ── 12. ART WALL & PLAN BOARD DOWNLIGHT (Đèn rọi tranh & Bảng kỹ năng) ── */}
      <pointLight
        ref={artWallAccentRef}
        position={[-3.5, 2.4, 1.2]}
        intensity={targetConfig.artAccent.intensity}
        color={targetConfig.artAccent.color}
        distance={3.0}
        decay={2.0}
      />

      {/* ── 13. STUDIO ENVIRONMENT IBL (Phản xạ ánh sáng vi mô cho kim loại, kính, màn hình) ── */}
      <Environment resolution={256}>
        {/* Soft studio ceiling softbox */}
        <Lightformer
          form="rect"
          intensity={isNight ? 0.2 : 0.3}
          color={isNight ? '#60a5fa' : lightingPreset === 'sunset' ? '#fed7aa' : '#ffffff'}
          position={[0, 7, 0]}
          scale={[10, 10, 1]}
          target={[0, 0, 0]}
        />
        {/* Lateral rim highlight - tạo viền phản chiếu sắc nét cho case PC và mép kính */}
        <Lightformer
          form="rect"
          intensity={isNight ? 0.2 : 0.25}
          color={isNight ? '#38bdf8' : '#fef08a'}
          position={[-5, 4, -4]}
          scale={[6, 3, 1]}
        />
        {/* Soft fill reflection */}
        <Lightformer
          form="rect"
          intensity={isNight ? 0.15 : 0.2}
          color={isNight ? '#818cf8' : '#fed7aa'}
          position={[5, 3, 4]}
          scale={[6, 3, 1]}
        />
      </Environment>
    </>
  )
}

export default SceneLighting
