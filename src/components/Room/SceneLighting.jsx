import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../store/useStore'

/**
 * SceneLighting - Hệ thống chiếu sáng chuẩn Diorama 3D
 * - Góc chiếu dốc đứng từ hướng cửa sổ, bóng đổ gọn gàng ngay dưới chân đồ vật
 * - Ambient sáng ấm mềm mại, shadow transparent không bao giờ bị đen kịt hay loang lổ
 * - Loại bỏ hoàn toàn shadow acne với shadow-normalBias chuẩn
 */
function SceneLighting() {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const deskLampOn = useStore((state) => state.deskLampOn)
  const stringLightsOn = useStore((state) => state.stringLightsOn)

  const ambientRef = useRef()
  const directionalRef = useRef()
  const windowLightRef = useRef()
  const rimLightRef = useRef()
  const deskLampRef = useRef()

  // Cấu hình chuẩn cho 4 preset với góc chiếu dốc đứng Y=15 để bóng đổ gọn gàng
  const PRESET_CONFIGS = {
    morning: {
      ambient: { intensity: 0.85, color: '#fcfaf4' },
      // Chiếu từ phía trên cửa sổ xuống (X=-3, Y=16, Z=-3) -> bóng đổ ngắn, gọn, tinh tế
      directional: { intensity: 1.45, color: '#fffdf5', pos: [-3, 16, -3] },
      window: { intensity: 0.35, color: '#fff7ed' },
      rim: { intensity: 0.25, color: '#fef3c7' },
    },
    sunset: {
      ambient: { intensity: 0.72, color: '#fed7aa' },
      directional: { intensity: 1.35, color: '#fb923c', pos: [-5, 13, -4] },
      window: { intensity: 0.55, color: '#f97316' },
      rim: { intensity: 0.35, color: '#f43f5e' },
    },
    rainy: {
      ambient: { intensity: 0.68, color: '#e2e8f0' },
      directional: { intensity: 0.75, color: '#94a3b8', pos: [-3, 16, -3] },
      window: { intensity: 0.3, color: '#60a5fa' },
      rim: { intensity: 0.18, color: '#cbd5e1' },
    },
    night: {
      ambient: { intensity: 0.78, color: '#384d6b' },
      directional: { intensity: 0.85, color: '#9bc2f5', pos: [-2.5, 12, -3.5] },
      window: { intensity: 0.55, color: '#7dd3fc' },
      rim: { intensity: 0.35, color: '#818cf8' },
    },
  }

  const activePreset = isNightMode ? 'night' : lightingPreset || 'morning'
  const isNight = activePreset === 'night'
  const targetConfig = PRESET_CONFIGS[activePreset] || PRESET_CONFIGS.morning

  // Chuyển đổi mượt mà giữa các trạng thái
  useFrame(() => {
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetConfig.ambient.intensity,
        0.08
      )
      ambientRef.current.color.lerp(new THREE.Color(targetConfig.ambient.color), 0.08)
    }

    if (directionalRef.current) {
      directionalRef.current.intensity = THREE.MathUtils.lerp(
        directionalRef.current.intensity,
        targetConfig.directional.intensity,
        0.08
      )
      directionalRef.current.color.lerp(new THREE.Color(targetConfig.directional.color), 0.08)
      directionalRef.current.position.lerp(new THREE.Vector3(...targetConfig.directional.pos), 0.05)
    }

    if (windowLightRef.current) {
      windowLightRef.current.intensity = THREE.MathUtils.lerp(
        windowLightRef.current.intensity,
        targetConfig.window.intensity,
        0.08
      )
      windowLightRef.current.color.lerp(new THREE.Color(targetConfig.window.color), 0.08)
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        targetConfig.rim.intensity,
        0.08
      )
      rimLightRef.current.color.lerp(new THREE.Color(targetConfig.rim.color), 0.08)
    }

    if (deskLampRef.current) {
      const targetLamp = deskLampOn ? 1.2 : 0.0
      deskLampRef.current.intensity = THREE.MathUtils.lerp(
        deskLampRef.current.intensity,
        targetLamp,
        0.15
      )
    }
  })

  return (
    <>
      {/* ── 1. Ambient Light ấm sáng, giữ cho phần bóng luôn trong và dễ nhìn ── */}
      <ambientLight
        ref={ambientRef}
        intensity={targetConfig.ambient.intensity}
        color={targetConfig.ambient.color}
      />

      {/* ── 2. Directional Light chính (Góc đứng Y=16, bóng đổ gọn gàng, zero noise) ── */}
      <directionalLight
        ref={directionalRef}
        position={targetConfig.directional.pos}
        intensity={targetConfig.directional.intensity}
        color={targetConfig.directional.color}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0001}
        shadow-normalBias={0.035}
        shadow-radius={2}
      />

      {/* ── 3. Fill Light nhẹ nhàng từ phía cửa sổ ── */}
      <pointLight
        ref={windowLightRef}
        position={[-2, 2.8, -2.5]}
        intensity={targetConfig.window.intensity}
        color={targetConfig.window.color}
        distance={7}
      />

      {/* ── 4. Rim Light làm nổi bật khối 3D Isometric ── */}
      <pointLight
        ref={rimLightRef}
        position={[6, 5, 6]}
        intensity={targetConfig.rim.intensity}
        color={targetConfig.rim.color}
      />

      {/* ── 5. Đèn bàn làm việc tương tác ── */}
      <pointLight
        ref={deskLampRef}
        position={[-2.4, 1.2, -2.2]}
        intensity={deskLampOn ? 1.2 : 0}
        color="#fef08a"
        distance={3.5}
        decay={2}
      />

      {/* ── 6. Đèn LED ban đêm: Ánh sáng màn hình PC dịu nhẹ khuếch tán ── */}
      {isNight && (
        <pointLight
          position={[-2.4, 1.1, -2.6]}
          intensity={0.2}
          color="#38bdf8"
          distance={1.8}
          decay={2}
        />
      )}

      {/* ── 7. Đèn dây trang trí nếu người dùng bật ── */}
      {stringLightsOn && (
        <pointLight
          position={[-3.8, 2.4, 0]}
          intensity={0.4}
          color="#fef08a"
          distance={3.5}
        />
      )}
    </>
  )
}

export default SceneLighting
