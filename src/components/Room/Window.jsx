import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../store/useStore'

/**
 * Creates high-resolution procedural scenery texture for the window vista.
 * Perfectly bounded to the window opening - 100% immune to bleeding/clipping bugs.
 */
function createSceneryTexture(preset) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 680
  const ctx = canvas.getContext('2d')
  const W = 512
  const H = 680

  if (preset === 'morning') {
    // 1. Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65)
    sky.addColorStop(0, '#38bdf8')
    sky.addColorStop(0.5, '#7dd3fc')
    sky.addColorStop(1, '#e0f2fe')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // 2. Radiant Morning Sun with atmospheric aura
    const sunGrad = ctx.createRadialGradient(370, 140, 10, 370, 140, 120)
    sunGrad.addColorStop(0, '#ffffff')
    sunGrad.addColorStop(0.2, '#fef08a')
    sunGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.4)')
    sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)')
    ctx.fillStyle = sunGrad
    ctx.beginPath()
    ctx.arc(370, 140, 120, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#fffbeb'
    ctx.beginPath()
    ctx.arc(370, 140, 32, 0, Math.PI * 2)
    ctx.fill()

    // 3. Fluffy clouds
    const drawCloud = (cx, cy, scale) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
      ctx.beginPath()
      ctx.arc(cx, cy, 28 * scale, 0, Math.PI * 2)
      ctx.arc(cx + 26 * scale, cy - 8 * scale, 22 * scale, 0, Math.PI * 2)
      ctx.arc(cx - 24 * scale, cy - 4 * scale, 20 * scale, 0, Math.PI * 2)
      ctx.arc(cx + 46 * scale, cy + 4 * scale, 18 * scale, 0, Math.PI * 2)
      ctx.fill()
    }
    drawCloud(130, 160, 1.1)
    drawCloud(240, 110, 0.8)

    // 4. Distant mountain silhouette (soft hazy periwinkle)
    ctx.fillStyle = '#93c5fd'
    ctx.beginPath()
    ctx.moveTo(0, 420)
    ctx.lineTo(80, 340)
    ctx.lineTo(180, 390)
    ctx.lineTo(310, 310)
    ctx.lineTo(440, 370)
    ctx.lineTo(512, 330)
    ctx.lineTo(512, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()

    // 5. Middle rolling hill (sage green)
    ctx.fillStyle = '#4ade80'
    ctx.beginPath()
    ctx.moveTo(0, 440)
    ctx.bezierCurveTo(120, 380, 240, 460, 380, 400)
    ctx.bezierCurveTo(450, 370, 490, 380, 512, 395)
    ctx.lineTo(512, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()

    // 6. Foreground lush rolling hill (emerald green)
    ctx.fillStyle = '#16a34a'
    ctx.beginPath()
    ctx.moveTo(0, 490)
    ctx.bezierCurveTo(140, 450, 280, 510, 420, 460)
    ctx.bezierCurveTo(470, 440, 500, 450, 512, 465)
    ctx.lineTo(512, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()

    // 7. Stylized pine trees on the ridge
    ctx.fillStyle = '#15803d'
    const treePoints = [60, 110, 170, 310, 360, 430, 470]
    treePoints.forEach((tx) => {
      const ty = 470 + Math.sin(tx * 0.05) * 15
      ctx.beginPath()
      ctx.moveTo(tx, ty - 26)
      ctx.lineTo(tx - 10, ty)
      ctx.lineTo(tx + 10, ty)
      ctx.closePath()
      ctx.fill()
    })
  } else if (preset === 'sunset') {
    // Sunset sky
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.7)
    sky.addColorStop(0, '#581c87')
    sky.addColorStop(0.35, '#c026d3')
    sky.addColorStop(0.7, '#ea580c')
    sky.addColorStop(1, '#fef08a')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Warm Sun
    const sunGrad = ctx.createRadialGradient(200, 320, 10, 200, 320, 140)
    sunGrad.addColorStop(0, '#fffbeb')
    sunGrad.addColorStop(0.3, '#fb923c')
    sunGrad.addColorStop(0.7, 'rgba(251, 146, 60, 0.4)')
    sunGrad.addColorStop(1, 'rgba(251, 146, 60, 0)')
    ctx.fillStyle = sunGrad
    ctx.beginPath()
    ctx.arc(200, 320, 140, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.arc(200, 320, 40, 0, Math.PI * 2)
    ctx.fill()

    // Sunset mountains
    ctx.fillStyle = '#6b21a8'
    ctx.beginPath()
    ctx.moveTo(0, 410)
    ctx.lineTo(110, 330)
    ctx.lineTo(240, 400)
    ctx.lineTo(390, 320)
    ctx.lineTo(512, 380)
    ctx.lineTo(512, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()

    // Foreground ridge
    ctx.fillStyle = '#3b0764'
    ctx.beginPath()
    ctx.moveTo(0, 470)
    ctx.bezierCurveTo(160, 420, 320, 500, 512, 440)
    ctx.lineTo(512, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()
  } else if (preset === 'rainy') {
    // Rainy overcast sky
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#334155')
    sky.addColorStop(0.6, '#475569')
    sky.addColorStop(1, '#64748b')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Moody rain clouds
    ctx.fillStyle = 'rgba(30, 41, 59, 0.65)'
    ctx.beginPath()
    ctx.arc(150, 120, 80, 0, Math.PI * 2)
    ctx.arc(260, 100, 95, 0, Math.PI * 2)
    ctx.arc(380, 120, 85, 0, Math.PI * 2)
    ctx.fill()

    // Misty mountain
    ctx.fillStyle = '#334155'
    ctx.beginPath()
    ctx.moveTo(0, 440)
    ctx.bezierCurveTo(150, 390, 320, 450, 512, 410)
    ctx.lineTo(512, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()

    // Dark foreground
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.moveTo(0, 500)
    ctx.bezierCurveTo(180, 460, 340, 530, 512, 480)
    ctx.lineTo(512, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    ctx.fill()

    // Rain streaks on glass
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)'
    ctx.lineWidth = 2
    for (let r = 0; r < 35; r++) {
      const rx = (r * 37) % W
      const ry = (r * 47) % (H - 120) + 50
      ctx.beginPath()
      ctx.moveTo(rx, ry)
      ctx.lineTo(rx - 8, ry + 36)
      ctx.stroke()
    }
  } else {
    // Night sky
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#030712')
    sky.addColorStop(0.5, '#0f172a')
    sky.addColorStop(1, '#1e1b4b')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Crescent Moon with soft celestial glow
    const moonGrad = ctx.createRadialGradient(380, 140, 10, 380, 140, 80)
    moonGrad.addColorStop(0, 'rgba(254, 249, 195, 0.35)')
    moonGrad.addColorStop(1, 'rgba(254, 249, 195, 0)')
    ctx.fillStyle = moonGrad
    ctx.beginPath()
    ctx.arc(380, 140, 80, 0, Math.PI * 2)
    ctx.fill()

    // Crescent moon body
    ctx.fillStyle = '#fef9c3'
    ctx.beginPath()
    ctx.arc(380, 140, 26, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.arc(372, 134, 23, 0, Math.PI * 2)
    ctx.fill()

    // Stars
    ctx.fillStyle = '#ffffff'
    const starCoords = [
      [70, 80], [120, 140], [210, 60], [290, 110], [180, 170],
      [80, 230], [260, 220], [330, 70], [450, 160], [430, 80]
    ]
    starCoords.forEach(([sx, sy]) => {
      ctx.beginPath()
      ctx.arc(sx, sy, 2.2, 0, Math.PI * 2)
      ctx.fill()
    })

    // City skyline
    const buildings = [
      [30, 220, 50], [90, 290, 60], [160, 210, 50], [220, 340, 70],
      [300, 250, 60], [370, 310, 65], [445, 230, 55]
    ]
    ctx.fillStyle = '#090d16'
    buildings.forEach(([bx, bh, bw]) => {
      ctx.fillRect(bx, H - bh, bw, bh)
    })

    // Glowing windows
    ctx.fillStyle = '#fef08a'
    buildings.forEach(([bx, bh, bw]) => {
      for (let wy = H - bh + 25; wy < H - 40; wy += 28) {
        for (let wx = bx + 10; wx < bx + bw - 10; wx += 16) {
          if ((wx + wy) % 5 !== 0) {
            ctx.fillRect(wx, wy, 8, 12)
          }
        }
      }
    })
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

// ─── Animated Raindrops on Glass Pane (Rainy Preset) ─────────────────────────
function RainGlassDrops() {
  const dropsRef = useRef()
  const drops = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      x: (((i * 37) % 100 - 50) / 100) * 1.08,
      speed: 0.35 + ((i * 19) % 50) / 70,
      offset: (i * 0.23) % 2.0,
      length: 0.04 + ((i * 13) % 40) / 500,
      width: 0.0035 + (i % 3) * 0.0012,
      opacity: 0.35 + ((i * 7) % 40) / 100,
    }))
  }, [])

  useFrame((state) => {
    if (!dropsRef.current) return
    const t = state.clock.elapsedTime
    dropsRef.current.children.forEach((mesh, i) => {
      const d = drops[i]
      if (!d) return
      const cycle = (t * d.speed + d.offset) % 2.2
      // Slides down from top of window Y=0.76 to bottom Y=-0.72
      mesh.position.y = 0.76 - cycle * 0.68
      mesh.material.opacity =
        cycle < 0.2
          ? (cycle / 0.2) * d.opacity
          : cycle > 1.9
          ? ((2.2 - cycle) / 0.3) * d.opacity
          : d.opacity
    })
  })

  return (
    <group ref={dropsRef} position={[0, 0.04, 0.046]}>
      {drops.map((d, i) => (
        <mesh key={i} position={[d.x, 0, 0]}>
          <planeGeometry args={[d.width, d.length]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Window - Scandinavian Casement Window with Atmospheric Scenic Vista
 * - 100% contained canvas scenery texture that can never bleed onto the room walls
 * - Realistic double-hung glass with reflection
 * - Dynamic animated raindrops and condensation mist in rainy weather
 * - Natural oak window sill with potted jade succulent resting flush on the surface
 */
function Window() {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const activePreset = isNightMode ? 'night' : lightingPreset || 'morning'

  // Procedural scenic vista texture
  const sceneryTexture = useMemo(() => {
    return createSceneryTexture(activePreset)
  }, [activePreset])

  return (
    <group position={[-2, 1.8, -3.9]} rotation={[0, 0, 0]}>
      {/* ── 1. HỐC CỬA SỔ TRẮNG TRANG NHÃ (Wall Recess Trim) ── */}
      <mesh position={[0, 0.04, 0.015]}>
        <boxGeometry args={[1.32, 1.68, 0.04]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.85} />
      </mesh>

      {/* ── 2. TRANH PHONG CẢNH THIÊN NHIÊN HOÀN HẢO (100% Inset Scenic Backdrop) ── */}
      <mesh position={[0, 0.04, 0.038]}>
        <planeGeometry args={[1.18, 1.52]} />
        <meshBasicMaterial map={sceneryTexture} toneMapped={false} />
      </mesh>

      {/* ── 3. MẶT KÍNH CỬA SỔ TRONG SUỐT NHẸ NHÀNG (Lightweight Standard Glass Pane) ── */}
      <mesh position={[0, 0.04, 0.045]}>
        <planeGeometry args={[1.18, 1.52]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.4}
          metalness={0.02}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* ── 3B. VẾT NƯỚC MƯA CHẢY TRÊN KÍNH & HƠI NƯỚC CÀ PHÊ (Rainy Weather Dynamics) ── */}
      {activePreset === 'rainy' && (
        <>
          <RainGlassDrops />
          {/* Mảng sương mờ ngưng tụ nơi nhân vật đứng ngắm mưa cầm tách cà phê nóng */}
          <mesh position={[-0.18, -0.28, 0.047]}>
            <planeGeometry args={[0.52, 0.38]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0.14} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* ── 4. KHUNG GỖ CỬA SỔ SƠN TRẮNG BẮC ÂU (Moulded Window Casement) ── */}
      {/* Khung viền ngoài - Đỉnh */}
      <RoundedBox args={[1.34, 0.055, 0.06]} radius={0.008} smoothness={4} position={[0, 0.81, 0.065]}>
        <meshStandardMaterial color="#f8fafc" roughness={0.65} />
      </RoundedBox>

      {/* Khung viền ngoài - Hai bên */}
      {[-0.60, 0.60].map((wx, wi) => (
        <RoundedBox key={wi} args={[0.055, 1.56, 0.06]} radius={0.008} smoothness={4} position={[wx, 0.04, 0.065]}>
          <meshStandardMaterial color="#f8fafc" roughness={0.65} />
        </RoundedBox>
      ))}

      {/* Đố chia khung giữa chữ thập (Window Mullion Cross) */}
      <mesh position={[0, 0.04, 0.062]}>
        <boxGeometry args={[0.03, 1.52, 0.028]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.04, 0.062]}>
        <boxGeometry args={[1.18, 0.03, 0.028]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>

      {/* ── 5. BỆ CỬA SỔ GỖ SỒI CHÂN THỰC (Oak Window Sill) ── */}
      <RoundedBox args={[1.42, 0.045, 0.16]} radius={0.01} smoothness={4} position={[0, -0.73, 0.09]} receiveShadow>
        <meshStandardMaterial color="#b38455" roughness={0.55} metalness={0.04} />
      </RoundedBox>

      {/* ── 6. CHẬU SEN ĐÁ ĐẶT KHÍT TRÊN MẶT BỆ (Top of sill = -0.7075) ── */}
      <group position={[0.36, -0.7075, 0.1]}>
        {/* Chậu đất nung Terracotta (đáy chạm chính xác mặt bệ cửa sổ) */}
        <mesh position={[0, 0.028, 0]}>
          <cylinderGeometry args={[0.034, 0.024, 0.056, 16]} />
          <meshStandardMaterial color="#c26344" roughness={0.7} />
        </mesh>
        {/* Đĩa lót gốm */}
        <mesh position={[0, 0.004, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.008, 16]} />
          <meshStandardMaterial color="#a84e32" roughness={0.75} />
        </mesh>
        {/* Đất */}
        <mesh position={[0, 0.052, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.008, 12]} />
          <meshStandardMaterial color="#2d1b10" roughness={0.95} />
        </mesh>
        {/* Cây sen đá xanh ngọc mọng nước */}
        <mesh position={[0, 0.078, 0]}>
          <dodecahedronGeometry args={[0.028]} />
          <meshStandardMaterial color="#16a34a" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

export default Window
