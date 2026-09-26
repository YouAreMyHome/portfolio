import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../store/useStore'
import { useMobile } from '../../utils/useMobile'

// Đối tượng tạm dùng chung (Zero Allocation - Không tạo rác GC mỗi frame)
const _tempColor = new THREE.Color()
const _tempVec3 = new THREE.Vector3()

/**
 * SceneLighting - Hệ thống chiếu sáng & đổ bóng vật lý chuẩn quang học (Physical Optical Lighting)
 * - Tọa độ nguồn sáng chuẩn hóa theo vị trí ô cửa sổ (Window X=-2, Y=1.8, Z=-3.9)
 * - Góc ngả bóng (shadow angle) và độ mềm (penumbra) tuân theo vật lý quang học từng thời điểm
 * - Cân bằng tỷ lệ ánh sáng Key : Fill : Ambient (3:1) giúp bóng trong trẻo, không bị đen chết
 * - Triệt tiêu shadow acne & peter-panning với shadow-normalBias và shadow-bias chuẩn xác
 */
function SceneLighting() {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const deskLampOn = useStore((state) => state.deskLampOn)
  const stringLightsOn = useStore((state) => state.stringLightsOn)
  const { isMobile } = useMobile()

  const ambientRef = useRef()
  const directionalRef = useRef()
  const targetRef = useRef()
  const windowLightRef = useRef()
  const windowTargetRef = useRef()
  const rimLightRef = useRef()
  const deskLampRef = useRef()

  // Bảng cấu hình quang học chuẩn vật lý cho 4 preset (Mặt trời & Bầu trời rọi qua cửa sổ)
  const PRESET_CONFIGS = {
    morning: {
      // Nắng sớm ban mai: Mặt trời trên cao bên ngoài cửa sổ rọi xiên tự nhiên, bóng đổ vừa vặn sắc sảo
      ambient: { intensity: 0.74, color: '#fbf9f4' },
      directional: {
        intensity: 1.45,
        color: '#fff8eb',
        pos: [-2.6, 6.8, -6.8],
        target: [-0.6, 0.3, -0.6],
        shadowRadius: 2.2,
        shadowBias: -0.00012,
        shadowNormalBias: 0.028,
      },
      window: { intensity: 0.36, color: '#e0f2fe' },
      rim: { intensity: 0.20, color: '#fef3c7' },
    },
    sunset: {
      // Hoàng hôn: Mặt trời hạ thấp sát chân trời, tạo vệt nắng vàng cam dài (cinematic golden hour)
      ambient: { intensity: 0.60, color: '#fed7aa' },
      directional: {
        intensity: 1.30,
        color: '#fb923c',
        pos: [-3.6, 3.8, -7.5],
        target: [0.0, 0.2, 0.3],
        shadowRadius: 3.2,
        shadowBias: -0.0001,
        shadowNormalBias: 0.032,
      },
      window: { intensity: 0.40, color: '#ea580c' },
      rim: { intensity: 0.28, color: '#f43f5e' },
    },
    rainy: {
      // Ngày mưa/U ám: Mây mù dày đặc che khuất mặt trời, ánh sáng tán xạ mềm, bóng mờ ảo
      ambient: { intensity: 0.68, color: '#64748b' },
      directional: {
        intensity: 0.30,
        color: '#94a3b8',
        pos: [-2.5, 7.5, -6.5],
        target: [-0.5, 0.4, -0.5],
        shadowRadius: 7.0,
        shadowBias: -0.0001,
        shadowNormalBias: 0.025,
      },
      window: { intensity: 0.16, color: '#60a5fa' },
      rim: { intensity: 0.14, color: '#cbd5e1' },
    },
    night: {
      // Ban đêm: Ánh trăng dịu êm rọi qua cửa sổ, phòng tối ấm cúng để các nguồn sáng nội thất nổi bật
      ambient: { intensity: 0.32, color: '#0f172a' },
      directional: {
        intensity: 0.20,
        color: '#7dd3fc',
        pos: [-2.2, 6.5, -7.0],
        target: [-0.6, 0.3, -0.6],
        shadowRadius: 4.5,
        shadowBias: -0.0001,
        shadowNormalBias: 0.025,
      },
      window: { intensity: 0.08, color: '#38bdf8' },
      rim: { intensity: 0.18, color: '#818cf8' },
    },
  }

  const activePreset = isNightMode ? 'night' : lightingPreset || 'morning'
  const isNight = activePreset === 'night'
  const targetConfig = PRESET_CONFIGS[activePreset] || PRESET_CONFIGS.morning

  // Khởi tạo target cho DirectionalLight và Window SpotLight
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

  // Chuyển đổi mượt mà giữa các trạng thái ánh sáng (Zero GC)
  useFrame((_, delta) => {
    const factor = Math.min(1, delta * 4)

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetConfig.ambient.intensity,
        factor
      )
      _tempColor.set(targetConfig.ambient.color)
      ambientRef.current.color.lerp(_tempColor, factor)
    }

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

    if (windowLightRef.current) {
      windowLightRef.current.intensity = THREE.MathUtils.lerp(
        windowLightRef.current.intensity,
        targetConfig.window.intensity,
        factor
      )
      _tempColor.set(targetConfig.window.color)
      windowLightRef.current.color.lerp(_tempColor, factor)
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        targetConfig.rim.intensity,
        factor
      )
      _tempColor.set(targetConfig.rim.color)
      rimLightRef.current.color.lerp(_tempColor, factor)
    }

    if (deskLampRef.current) {
      const targetLamp = deskLampOn ? 0.85 : 0.0
      deskLampRef.current.intensity = THREE.MathUtils.lerp(
        deskLampRef.current.intensity,
        targetLamp,
        Math.min(1, delta * 8)
      )
    }
  })

  const shadowMapResolution = isMobile ? [1024, 1024] : [2048, 2048]

  return (
    <>
      {/* Target object để directionalLight hướng tới trung tâm khu vực tương tác */}
      <object3D ref={targetRef} position={[-0.8, 0.3, -0.5]} />

      {/* Target object để window spotLight rọi tỏa xiên vào sàn phòng */}
      <object3D ref={windowTargetRef} position={[-0.8, 0.6, -1.2]} />

      {/* ── 1. Ambient Light tự nhiên, giữ cho vùng bóng râm trong trẻo và bảo toàn chi tiết PBR ── */}
      <ambientLight
        ref={ambientRef}
        intensity={targetConfig.ambient.intensity}
        color={targetConfig.ambient.color}
      />

      {/* ── 2. Key Directional Light: Nắng mặt trời/mặt trăng rọi qua cửa sổ chuẩn vật lý ── */}
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

      {/* ── 3. Window Portal Skylight: Ánh sáng tán xạ từ vòm trời rọi vào phòng qua ô cửa sổ
               Sử dụng SpotLight hướng vào TRONG phòng, triệt tiêu hoàn toàn quầng chói phản chiếu
               lên mặt kính và đố chữ thập của khung cửa sổ ── */}
      <spotLight
        ref={windowLightRef}
        position={[-2.0, 1.85, -3.8]}
        intensity={targetConfig.window.intensity}
        color={targetConfig.window.color}
        distance={7.0}
        angle={Math.PI / 2.5}
        penumbra={1.0}
        decay={2}
      />

      {/* ── 4. Rim Light: Ánh sáng ngược tôn nổi khối 3D Isometric ── */}
      <pointLight
        ref={rimLightRef}
        position={[6, 4.5, 6]}
        intensity={targetConfig.rim.intensity}
        color={targetConfig.rim.color}
      />

      {/* ── 5. Đèn bàn làm việc tương tác (Ấm áp, dịu mắt) ── */}
      <pointLight
        ref={deskLampRef}
        position={[-2.4, 1.25, -2.1]}
        intensity={deskLampOn ? 0.85 : 0}
        color="#fef3c7"
        distance={2.8}
        decay={2}
      />

      {/* ── 6. Đèn LED ban đêm: Ánh sáng khuếch tán từ màn hình PC ── */}
      {isNight && (
        <pointLight
          position={[-2.4, 1.1, -2.6]}
          intensity={0.25}
          color="#38bdf8"
          distance={2.0}
          decay={2}
        />
      )}

      {/* ── 7. Đèn dây trang trí ấm áp khi bật ── */}
      {stringLightsOn && (
        <pointLight
          position={[-3.8, 2.4, 0]}
          intensity={0.45}
          color="#fef08a"
          distance={3.5}
          decay={2}
        />
      )}
    </>
  )
}

export default SceneLighting
