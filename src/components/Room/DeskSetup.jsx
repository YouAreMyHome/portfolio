import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS } from './colors'

/**
 * Create realistic monitor screen texture with static content
 * Only redraws occasionally for cursor blink effect
 */
function useMonitorTexture(type) {
  const canvasRef = useRef(null)
  const textureRef = useRef(null)
  const lastDrawRef = useRef(0)
  const blinkStateRef = useRef(true)
  
  const { canvas, texture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 320
    
    const tex = new THREE.CanvasTexture(cvs)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.colorSpace = THREE.SRGBColorSpace
    
    return { canvas: cvs, texture: tex }
  }, [])
  
  canvasRef.current = canvas
  textureRef.current = texture
  
  // Initial draw
  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (type === 'code') {
      drawCodeEditor(ctx, true)
    } else {
      drawBrowser(ctx)
    }
    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  }, [type])
  
  useEffect(() => {
    return () => {
      texture.dispose()
    }
  }, [texture])

  // Only update cursor blink every 500ms for code editor
  useFrame((state) => {
    if (!canvasRef.current || !textureRef.current) return
    if (type !== 'code') return // Browser is static
    
    const now = state.clock.elapsedTime * 1000
    if (now - lastDrawRef.current < 500) return
    
    lastDrawRef.current = now
    blinkStateRef.current = !blinkStateRef.current
    
    const ctx = canvasRef.current.getContext('2d')
    drawCodeEditor(ctx, blinkStateRef.current)
    textureRef.current.needsUpdate = true
  })
  
  return texture
}

/**
 * Draw VS Code style editor
 */
function drawCodeEditor(ctx, showCursor) {
  const W = 512, H = 320
  
  // Background
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(0, 0, W, H)
  
  // Activity bar (left)
  ctx.fillStyle = '#333333'
  ctx.fillRect(0, 0, 35, H)
  
  // Activity bar icons (VS Code style)
  const icons = ['◇', '○', '⌥', '▸', '□']
  ctx.font = '14px Consolas, monospace'
  icons.forEach((icon, i) => {
    ctx.fillText(icon, 10, 30 + i * 35)
  })
  
  // Sidebar (file explorer)
  ctx.fillStyle = '#252526'
  ctx.fillRect(35, 0, 100, H)
  
  // File tree
  ctx.fillStyle = '#cccccc'
  ctx.font = '10px Consolas, monospace'
  const files = ['▼ src', '  ◇ App.jsx', '  ◇ index.js', '  ▼ components', '    ◇ Room.jsx', '◇ package.json']
  files.forEach((file, i) => {
    ctx.fillStyle = i === 1 ? '#ffffff' : '#cccccc'
    ctx.fillText(file, 42, 25 + i * 16)
  })
  
  // Tab bar
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(135, 0, W - 135, 28)
  
  // Active tab
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(135, 0, 80, 28)
  ctx.fillStyle = '#ffffff'
  ctx.fillText('◇ App.jsx', 145, 18)
  
  // Editor content - actual code
  ctx.fillStyle = '#1e1e1e'
  ctx.fillRect(135, 28, W - 135, H - 28)
  
  // Line numbers
  ctx.fillStyle = '#858585'
  ctx.font = '11px Consolas, monospace'
  for (let i = 1; i <= 18; i++) {
    ctx.fillText(i.toString().padStart(2), 142, 42 + i * 15)
  }
  
  // Code content with syntax highlighting
  const codeLines = [
    { text: 'import', color: '#c586c0' },
    { text: ' { useState } ', color: '#9cdcfe' },
    { text: 'from', color: '#c586c0' },
    { text: " 'react'", color: '#ce9178' },
    { text: '', color: '' },
    { text: 'function ', color: '#c586c0' },
    { text: 'App', color: '#dcdcaa' },
    { text: '() {', color: '#d4d4d4' },
    { text: '  const ', color: '#c586c0' },
    { text: '[count, setCount]', color: '#9cdcfe' },
    { text: ' = useState(', color: '#d4d4d4' },
    { text: '0', color: '#b5cea8' },
    { text: ')', color: '#d4d4d4' },
    { text: '', color: '' },
    { text: '  return (', color: '#d4d4d4' },
    { text: '    <div className=', color: '#569cd6' },
    { text: '"app"', color: '#ce9178' },
    { text: '>', color: '#569cd6' },
  ]
  
  let y = 42
  codeLines.forEach((line, i) => {
    if (line.text) {
      ctx.fillStyle = line.color
      ctx.fillText(line.text, 168, y + i * 15)
    }
  })
  
  // Blinking cursor - now controlled by showCursor parameter
  if (showCursor) {
    ctx.fillStyle = '#aeafad'
    ctx.fillRect(168 + 8 * 10, 42 + 8 * 15 - 11, 2, 14)
  }
  
  // Minimap (right side)
  ctx.fillStyle = '#252526'
  ctx.fillRect(W - 40, 28, 40, H - 28)
  
  // Minimap lines (static pattern)
  const minimapWidths = [18, 25, 12, 30, 15, 22, 28, 10, 20, 14, 26, 18, 22, 30, 12, 24, 16, 28, 20, 14, 25, 18, 22, 30, 15, 20, 28, 12, 24, 18]
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.12})`
    ctx.fillRect(W - 38, 35 + i * 8, minimapWidths[i], 2)
  }
  
  // Status bar
  ctx.fillStyle = '#007acc'
  ctx.fillRect(0, H - 22, W, 22)
  ctx.fillStyle = '#ffffff'
  ctx.font = '10px sans-serif'
  ctx.fillText('🔀 main  ✓ Ln 8, Col 25  UTF-8  JavaScript React', 10, H - 8)
  
  // Scanlines effect (subtle)
  ctx.fillStyle = 'rgba(0,0,0,0.03)'
  for (let y = 0; y < H; y += 2) {
    ctx.fillRect(0, y, W, 1)
  }
}

/**
 * Draw Browser/Design view (static - no animation)
 */
function drawBrowser(ctx) {
  const W = 512, H = 320
  
  // Browser chrome
  ctx.fillStyle = '#f1f3f4'
  ctx.fillRect(0, 0, W, 50)
  
  // Tab
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(8, 8, 140, 30, 8)
  ctx.fill()
  
  ctx.fillStyle = '#333'
  ctx.font = '11px sans-serif'
  ctx.fillText('🌐 letrongnghia.me', 20, 28)
  
  // Address bar
  ctx.fillStyle = '#e8eaed'
  ctx.beginPath()
  ctx.roundRect(160, 12, 280, 26, 13)
  ctx.fill()
  
  ctx.fillStyle = '#5f6368'
  ctx.font = '11px sans-serif'
  ctx.fillText('🔒 https://letrongnghia.me', 175, 30)
  
  // Browser buttons
  ctx.fillStyle = '#5f6368'
  ctx.font = '16px sans-serif'
  ctx.fillText('← → ⟳', 455, 30)
  
  // Page content - Hero section
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 50, W, H - 50)
  
  // Gradient overlay
  const gradient = ctx.createLinearGradient(0, 50, 0, H)
  gradient.addColorStop(0, '#0f172a')
  gradient.addColorStop(1, '#1e293b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 50, W, H - 50)
  
  // Static decorative particles (no animation)
  ctx.fillStyle = 'rgba(74, 222, 128, 0.3)'
  const particlePositions = [
    { x: 60, y: 100 }, { x: 140, y: 85 }, { x: 220, y: 110 },
    { x: 300, y: 90 }, { x: 380, y: 105 }, { x: 450, y: 95 }
  ]
  particlePositions.forEach((p, i) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3 + (i % 3), 0, Math.PI * 2)
    ctx.fill()
  })
  
  // Avatar
  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(80, 130, 35, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1e293b'
  ctx.font = '30px sans-serif'
  ctx.fillText('👨‍💻', 57, 142)
  
  // Text content
  ctx.fillStyle = '#f8fafc'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText("Hi, I'm Nghia 👋", 140, 110)
  
  ctx.fillStyle = '#94a3b8'
  ctx.font = '12px sans-serif'
  ctx.fillText('Full-stack Developer', 140, 135)
  ctx.fillText('Building web experiences with React & Node.js', 140, 155)
  
  // CTA Buttons
  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.roundRect(140, 175, 100, 30, 6)
  ctx.fill()
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 11px sans-serif'
  ctx.fillText('View Projects', 158, 194)
  
  ctx.strokeStyle = '#4ade80'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(255, 175, 80, 30, 6)
  ctx.stroke()
  ctx.fillStyle = '#4ade80'
  ctx.fillText('Contact', 275, 194)
  
  // Cards section
  ctx.fillStyle = '#1e293b'
  const cardY = 230
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.roundRect(20 + i * 160, cardY, 145, 70, 8)
    ctx.fill()
    
    ctx.fillStyle = ['#f87171', '#fbbf24', '#60a5fa'][i]
    ctx.fillRect(20 + i * 160, cardY, 145, 25)
    
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.fillText(['🚀 Project 1', '🎨 Project 2', '⚡ Project 3'][i], 30 + i * 160, cardY + 50)
  }
  
  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.02)'
  for (let y = 0; y < H; y += 2) {
    ctx.fillRect(0, y, W, 1)
  }
}

/**
 * Monitor Component - Realistic with animated screen
 */
const Monitor = ({ type, position, rotation, onClick }) => {
  const screenTexture = useMonitorTexture(type)
  const glowColor = type === 'code' ? '#4ade80' : '#60a5fa'

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {/* Screen light emission */}
      <pointLight 
        color={glowColor} 
        intensity={0.3} 
        distance={1.2} 
        decay={2} 
        position={[0, 0, 0.3]} 
      />
      
      {/* Ambient screen glow */}
      <rectAreaLight
        color={glowColor}
        intensity={0.5}
        width={0.6}
        height={0.35}
        position={[0, 0, 0.1]}
      />

      {/* Monitor bezel - outer frame */}
      <RoundedBox args={[0.72, 0.44, 0.025]} radius={0.008} smoothness={4} castShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.8} />
      </RoundedBox>
      
      {/* Inner bezel */}
      <mesh position={[0, 0, 0.013]}>
        <boxGeometry args={[0.69, 0.41, 0.002]} />
        <meshStandardMaterial color="#151515" roughness={0.5} />
      </mesh>

      {/* Screen panel with texture */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[0.67, 0.39]} />
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>
      
      {/* Screen emissive layer (bloom effect) */}
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[0.67, 0.39]} />
        <meshStandardMaterial 
          transparent
          opacity={0.15}
          emissive={glowColor}
          emissiveIntensity={0.3}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      
      {/* Glass reflection layer */}
      <mesh position={[0, 0, 0.019]}>
        <planeGeometry args={[0.67, 0.39]} />
        <meshPhysicalMaterial 
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0}
          reflectivity={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          depthWrite={false}
        />
      </mesh>
      
      {/* Power LED */}
      <mesh position={[0.3, -0.19, 0.014]}>
        <circleGeometry args={[0.004, 16]} />
        <meshBasicMaterial color="#4ade80" toneMapped={false} />
      </mesh>

      {/* Monitor stand - neck */}
      <group position={[0, -0.27, -0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.12, 0.03]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Stand base */}
        <mesh position={[0, -0.07, 0.04]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.18, 0.008, 0.12]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.7} />
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