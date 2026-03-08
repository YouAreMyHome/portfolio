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
  const icons = ['â—‡', 'â—‹', 'âŒ¥', 'â–¸', 'â–¡']
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
  const files = ['â–¼ src', '  â—‡ App.jsx', '  â—‡ index.js', '  â–¼ components', '    â—‡ Room.jsx', 'â—‡ package.json']
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
  ctx.fillText('â—‡ App.jsx', 145, 18)
  
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
  ctx.fillText('ðŸ”€ main  âœ“ Ln 8, Col 25  UTF-8  JavaScript React', 10, H - 8)
  
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
  ctx.fillText('ðŸŒ letrongnghia.me', 20, 28)
  
  // Address bar
  ctx.fillStyle = '#e8eaed'
  ctx.beginPath()
  ctx.roundRect(160, 12, 280, 26, 13)
  ctx.fill()
  
  ctx.fillStyle = '#5f6368'
  ctx.font = '11px sans-serif'
  ctx.fillText('ðŸ”’ https://letrongnghia.me', 175, 30)
  
  // Browser buttons
  ctx.fillStyle = '#5f6368'
  ctx.font = '16px sans-serif'
  ctx.fillText('â† â†’ âŸ³', 455, 30)
  
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
  ctx.fillText('ðŸ‘¨â€ðŸ’»', 57, 142)
  
  // Text content
  ctx.fillStyle = '#f8fafc'
  ctx.font = 'bold 22px sans-serif'
  ctx.fillText("Hi, I'm Nghia ðŸ‘‹", 140, 110)
  
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
    ctx.fillText(['ðŸš€ Project 1', 'ðŸŽ¨ Project 2', 'âš¡ Project 3'][i], 30 + i * 160, cardY + 50)
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
const Monitor = ({ type, position, rotation, onClick, noStand = false }) => {
  const screenTexture = useMonitorTexture(type)
  const glowColor = type === 'code' ? '#4ade80' : '#60a5fa'

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {/* Screen light emission */}
      <pointLight 
        color={glowColor} 
        intensity={0.08} 
        distance={0.8} 
        decay={2} 
        position={[0, 0, 0.3]} 
      />
      
      {/* Ambient screen glow */}
      <rectAreaLight
        color={glowColor}
        intensity={0.12}
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
          emissiveIntensity={0.08}
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

      {/* Monitor stand â€” áº©n khi arm-mounted */}
      {!noStand && (
        <group position={[0, -0.27, -0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.05, 0.12, 0.03]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.07, 0.04]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.008, 0.12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/**
 * DeskSetup â€” Modern PC Corner
 * Dark walnut desk Â· VESA monitor arm Â· PC tower on floor Â· Hairpin legs
 */
function DeskSetup({ onProjectClick }) {
  const pcRgbRef  = useRef()
  const kbRgbRef  = useRef()

  const DESK_H = 0.76   // Y-center cá»§a máº·t bÃ n (dÃ y 0.05 â†’ top táº¡i +0.025)
  const LEG_H  = 0.74

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pcRgbRef.current)  pcRgbRef.current.color.setHSL((t * 0.12) % 1, 0.95, 0.5)
    if (kbRgbRef.current)  kbRgbRef.current.color.setHSL((t * 0.12 + 0.33) % 1, 0.85, 0.5)
  })
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pcRgbRef.current)  pcRgbRef.current.color.setHSL((t * 0.12) % 1, 0.95, 0.5)
    if (kbRgbRef.current)  kbRgbRef.current.color.setHSL((t * 0.12 + 0.33) % 1, 0.85, 0.5)
  })

  return (
    <group position={[-2.8, 0, -2.5]} rotation={[0, Math.PI / 4, 0]}>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          PC TOWER â€” sÃ n nhÃ  bÃªn pháº£i bÃ n
          Chiá»u cao 0.54, Ä‘áº·t ngay cáº¡nh chÃ¢n bÃ n pháº£i
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <group position={[1.08, 0, 0.08]}>
        {/* ThÃ¢n case ATX */}
        <RoundedBox args={[0.23, 0.52, 0.48]} radius={0.014} smoothness={4} castShadow position={[0, 0.26, 0]}>
          <meshStandardMaterial color="#0c0c12" metalness={0.5} roughness={0.3} />
        </RoundedBox>

        {/* Tempered glass side panel (máº·t nhÃ¬n tá»« camera) */}
        <mesh position={[-0.117, 0.26, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.44, 0.46]} />
          <meshPhysicalMaterial color="#06060e" transparent opacity={0.5} roughness={0.04} transmission={0.25} />
        </mesh>

        {/* Front mesh panel */}
        <mesh position={[0.117, 0.26, 0]}>
          <boxGeometry args={[0.003, 0.48, 0.44]} />
          <meshStandardMaterial color="#12121a" roughness={0.88} />
        </mesh>

        {/* RGB front strip */}
        <mesh position={[0.119, 0.07, 0]}>
          <planeGeometry args={[0.42, 0.016]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.92} />
        </mesh>

        {/* Ventilation slots top */}
        {[-0.14, -0.05, 0.04, 0.13].map((z, i) => (
          <mesh key={i} position={[0, 0.525, z]}>
            <boxGeometry args={[0.18, 0.003, 0.014]} />
            <meshStandardMaterial color="#1a1a22" />
          </mesh>
        ))}

        {/* Power button + LED ring */}
        <mesh position={[0.119, 0.46, 0.15]}>
          <circleGeometry args={[0.011, 12]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
        <mesh position={[0.119, 0.46, 0.15]}>
          <ringGeometry args={[0.013, 0.016, 12]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.7} />
        </mesh>

        {/* Logo kháº¯c trÃªn kÃ­nh */}
        <mesh position={[-0.118, 0.28, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.038, 0.038]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.55} />
        </mesh>

        {/* RGB internal glow */}
        <pointLight ref={pcRgbRef} position={[-0.05, 0.26, 0]} distance={0.5} intensity={0.6} />

        {/* Rubber feet */}
        {[[-0.09, -0.13], [0.09, -0.13], [-0.09, 0.13], [0.09, 0.13]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.007, z]}>
            <cylinderGeometry args={[0.011, 0.013, 0.013, 8]} />
            <meshStandardMaterial color="#0a0a0e" />
          </mesh>
        ))}
      </group>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Máº¶T BÃ€N + Äá»’ Váº¬T
          Má»i thá»© bÃªn trong tá»± nÃ¢ng theo DESK_H
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <group position={[0, DESK_H, 0]}>

        {/* Máº·t bÃ n dark walnut */}
        <RoundedBox args={[2.3, 0.05, 1.1]} radius={0.013} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#1c1008" roughness={0.58} />
        </RoundedBox>
        {/* Grain highlight */}
        <mesh position={[0, 0.026, 0]}>
          <boxGeometry args={[2.28, 0.001, 1.08]} />
          <meshStandardMaterial color="#2a180c" roughness={0.72} />
        </mesh>
        {/* Cáº¡nh trÆ°á»›c accent strip */}
        <mesh position={[0, -0.003, 0.548]}>
          <boxGeometry args={[2.27, 0.044, 0.005]} />
          <meshStandardMaterial color="#0f0804" roughness={0.35} />
        </mesh>
        {/* Cable channel sau */}
        <mesh position={[0.1, 0.008, -0.505]}>
          <boxGeometry args={[1.5, 0.024, 0.036]} />
          <meshStandardMaterial color="#080808" roughness={0.96} />
        </mesh>

        {/* Desk mat lá»›n */}
        <mesh position={[-0.02, 0.027, 0.19]} receiveShadow>
          <boxGeometry args={[1.55, 0.005, 0.66]} />
          <meshStandardMaterial color="#141418" roughness={0.95} />
        </mesh>
        {/* Logo nhá» gÃ³c mat */}
        <mesh position={[0.66, 0.0295, 0.42]}>
          <planeGeometry args={[0.05, 0.011]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
        </mesh>

        {/* â”€â”€ MONITOR ARM (VESA dual) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <group position={[0.06, 0.027, -0.43]}>
          {/* Clamp bÃ n */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.052, 0.04, 0.052]} />
            <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.3} />
          </mesh>
          {/* Trá»¥ Ä‘á»©ng */}
          <mesh position={[0, 0.31, 0]} castShadow>
            <cylinderGeometry args={[0.013, 0.015, 0.62, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.18} />
          </mesh>
          {/* Khá»›p Ä‘á»‰nh */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.019, 10, 10]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* CÃ¡nh tay trÃ¡i */}
          <group position={[-0.24, 0.59, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.48, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Drop-down VESA trÃ¡i */}
            <mesh position={[-0.16, -0.07, 0.06]}>
              <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
          {/* CÃ¡nh tay pháº£i */}
          <group position={[0.24, 0.59, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.48, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.16, -0.07, 0.06]}>
              <cylinderGeometry args={[0.006, 0.006, 0.14, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* â”€â”€ MONITORS (arm-mounted, khÃ´ng stand) â”€â”€ */}
        <Monitor
          type="code"
          position={[-0.44, 0.44, -0.27]}
          rotation={[0, 0.13, 0]}
          onClick={onProjectClick}
          noStand
        />
        <Monitor
          type="design"
          position={[0.50, 0.44, -0.27]}
          rotation={[0, -0.13, 0]}
          noStand
        />

        {/* â”€â”€ KEYBOARD (mechanical, per-key RGB) â”€â”€ */}
        <group position={[0, 0.036, 0.25]}>
          <RoundedBox args={[0.46, 0.022, 0.165]} radius={0.012} smoothness={4} castShadow>
            <meshStandardMaterial color="#0f172a" metalness={0.1} roughness={0.72} />
          </RoundedBox>
          {[
            { z: -0.055, count: 13 },
            { z: -0.022, count: 14 },
            { z:  0.011, count: 13 },
            { z:  0.044, count: 12 },
          ].flatMap(({ z, count }, ri) =>
            Array.from({ length: count }, (_, ki) => (
              <mesh key={`r${ri}k${ki}`} position={[-0.188 + ki * 0.03, 0.02, z]} castShadow>
                <boxGeometry args={[0.024, 0.012, 0.022]} />
                <meshStandardMaterial color={ri === 0 ? '#374151' : ri % 2 === 0 ? '#1e2a3a' : '#263244'} />
              </mesh>
            ))
          )}
          {/* Spacebar */}
          <mesh position={[0, 0.02, 0.064]}>
            <boxGeometry args={[0.16, 0.012, 0.022]} />
            <meshStandardMaterial color="#1e2a3a" />
          </mesh>
          {/* RGB underglow */}
          <pointLight ref={kbRgbRef} intensity={0.2} distance={0.3} position={[0, -0.008, 0.04]} />
        </group>

        {/* â”€â”€ MOUSE (ergonomic) â”€â”€ */}
        <group position={[0.36, 0.04, 0.25]}>
          <RoundedBox args={[0.062, 0.03, 0.105]} radius={0.018} smoothness={6} castShadow>
            <meshStandardMaterial color="#0c0c12" roughness={0.35} metalness={0.2} />
          </RoundedBox>
          {/* NÃºt trÃ¡i */}
          <mesh position={[-0.015, 0.016, -0.022]}>
            <boxGeometry args={[0.025, 0.004, 0.052]} />
            <meshStandardMaterial color="#1a1a1e" />
          </mesh>
          {/* NÃºt pháº£i */}
          <mesh position={[0.015, 0.016, -0.022]}>
            <boxGeometry args={[0.025, 0.004, 0.052]} />
            <meshStandardMaterial color="#181820" />
          </mesh>
          {/* Scroll wheel */}
          <mesh position={[0, 0.018, -0.014]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.02, 10]} />
            <meshStandardMaterial color="#2d2d35" />
          </mesh>
          {/* RGB underglow */}
          <mesh position={[0, -0.012, 0.026]}>
            <boxGeometry args={[0.059, 0.002, 0.072]} />
            <meshBasicMaterial color="#6366f1" transparent opacity={0.5} />
          </mesh>
        </group>

        {/* â”€â”€ LOA TRÃI (Studio monitor, hÆ°á»›ng ra phÃ­a trÆ°á»›c) â”€â”€ */}
        <group position={[-0.88, 0.125, -0.18]}>
          <RoundedBox args={[0.088, 0.2, 0.12]} radius={0.01} castShadow>
            <meshStandardMaterial color="#0a0a0c" roughness={0.62} metalness={0.1} />
          </RoundedBox>
          {/* Front face tweeter */}
          <mesh position={[0, 0.064, 0.061]}>
            <circleGeometry args={[0.014, 16]} />
            <meshStandardMaterial color="#1a1a1e" />
          </mesh>
          <mesh position={[0, 0.064, 0.062]}>
            <circleGeometry args={[0.006, 12]} />
            <meshStandardMaterial color="#0d0d10" />
          </mesh>
          {/* Woofer surround */}
          <mesh position={[0, -0.026, 0.061]}>
            <ringGeometry args={[0.022, 0.034, 22]} />
            <meshStandardMaterial color="#1a1a1e" />
          </mesh>
          <mesh position={[0, -0.026, 0.062]}>
            <circleGeometry args={[0.022, 22]} />
            <meshStandardMaterial color="#1e1e24" />
          </mesh>
          {/* Badge vÃ ng */}
          <mesh position={[0, 0.088, 0.062]}>
            <boxGeometry args={[0.038, 0.007, 0.001]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
          </mesh>
          {/* Power LED */}
          <mesh position={[0.027, 0.088, 0.062]}>
            <circleGeometry args={[0.003, 8]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* â”€â”€ LOA PHáº¢I â”€â”€ */}
        <group position={[0.68, 0.125, -0.18]}>
          <RoundedBox args={[0.088, 0.2, 0.12]} radius={0.01} castShadow>
            <meshStandardMaterial color="#0a0a0c" roughness={0.62} metalness={0.1} />
          </RoundedBox>
          <mesh position={[0, 0.064, 0.061]}>
            <circleGeometry args={[0.014, 16]} />
            <meshStandardMaterial color="#1a1a1e" />
          </mesh>
          <mesh position={[0, 0.064, 0.062]}>
            <circleGeometry args={[0.006, 12]} />
            <meshStandardMaterial color="#0d0d10" />
          </mesh>
          <mesh position={[0, -0.026, 0.061]}>
            <ringGeometry args={[0.022, 0.034, 22]} />
            <meshStandardMaterial color="#1a1a1e" />
          </mesh>
          <mesh position={[0, -0.026, 0.062]}>
            <circleGeometry args={[0.022, 22]} />
            <meshStandardMaterial color="#1e1e24" />
          </mesh>
          <mesh position={[0, 0.088, 0.062]}>
            <boxGeometry args={[0.038, 0.007, 0.001]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
          </mesh>
        </group>

        {/* â”€â”€ ÄÃˆN BÃ€N LED BAR â”€â”€ */}
        <group position={[-0.08, 0.025, -0.40]}>
          {/* Äáº¿ trÃ²n */}
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.036, 0.043, 0.022, 14]} />
            <meshStandardMaterial color="#0f172a" metalness={0.76} roughness={0.28} />
          </mesh>
          {/* Cá»™t Ä‘á»©ng */}
          <mesh position={[0, 0.245, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.011, 0.46, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.82} roughness={0.2} />
          </mesh>
          {/* Khá»›p trÃªn */}
          <mesh position={[0, 0.465, 0]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.78} roughness={0.22} />
          </mesh>
          {/* Arm ngáº¯n cháº¿ch ra phÃ­a trÆ°á»›c */}
          <group position={[0.08, 0.465, 0.04]} rotation={[-0.3, 0, 0]}>
            <mesh position={[0, 0, 0.085]}>
              <cylinderGeometry args={[0.007, 0.007, 0.18, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* LED bar */}
            <group position={[0, 0, 0.19]} rotation={[0.5, 0, 0]}>
              <RoundedBox args={[0.28, 0.02, 0.03]} radius={0.006} castShadow>
                <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.2} />
              </RoundedBox>
              {/* Dáº£i LED áº¥m */}
              <mesh position={[0, -0.011, 0]}>
                <boxGeometry args={[0.26, 0.003, 0.026]} />
                <meshBasicMaterial color="#fff8e1" />
              </mesh>
              <pointLight color="#fff5cc" intensity={0.6} distance={1.2} decay={2} position={[0, -0.05, 0.08]} />
            </group>
          </group>
        </group>

        {/* â”€â”€ LY CÃ€ PHÃŠ â”€â”€ */}
        <group position={[0.82, 0.024, 0.34]}>
          {/* ÄÄ©a lÃ³t */}
          <mesh position={[0, 0.007, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.042, 0.012, 18]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.22} />
          </mesh>
          {/* ThÃ¢n ly */}
          <mesh position={[0, 0.054, 0]} castShadow>
            <cylinderGeometry args={[0.019, 0.016, 0.062, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.22} />
          </mesh>
          {/* CÃ  phÃª */}
          <mesh position={[0, 0.083, 0]}>
            <cylinderGeometry args={[0.017, 0.017, 0.003, 14]} />
            <meshStandardMaterial color="#1a0800" roughness={0.78} />
          </mesh>
          {/* Quai */}
          <mesh position={[0.028, 0.054, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.011, 0.003, 6, 14, Math.PI]} />
            <meshStandardMaterial color="#e8edf2" roughness={0.28} />
          </mesh>
          {/* Steam */}
          <mesh position={[-0.003, 0.108, 0]} rotation={[0, 0, 0.14]}>
            <cylinderGeometry args={[0.001, 0.0015, 0.022, 4]} />
            <meshStandardMaterial color="#cbd5e1" transparent opacity={0.3} />
          </mesh>
        </group>

        {/* â”€â”€ LAPTOP (Ä‘Ã³ng, trÃªn laptop stand nhÃ´m) â”€â”€ */}
        <group position={[-0.87, 0.025, 0.1]}>
          {/* Stand bar trÆ°á»›c */}
          <mesh position={[0, 0.022, 0.038]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.21, 0.007, 0.055]} />
            <meshStandardMaterial color="#2d3748" metalness={0.74} roughness={0.2} />
          </mesh>
          {/* Stand bar sau */}
          <mesh position={[0, 0.022, -0.04]} rotation={[0.42, 0, 0]} castShadow>
            <boxGeometry args={[0.21, 0.007, 0.065]} />
            <meshStandardMaterial color="#2d3748" metalness={0.74} roughness={0.2} />
          </mesh>
          {/* Laptop body */}
          <group position={[0, 0.048, -0.016]} rotation={[-0.07, 0, 0]}>
            <RoundedBox args={[0.23, 0.012, 0.165]} radius={0.009} smoothness={4} castShadow>
              <meshStandardMaterial color="#8fa3b8" metalness={0.82} roughness={0.1} />
            </RoundedBox>
            {/* Apple-style logo */}
            <mesh position={[0, 0.007, -0.008]}>
              <circleGeometry args={[0.013, 14]} />
              <meshStandardMaterial color="#6b8299" metalness={0.9} roughness={0.04} />
            </mesh>
          </group>
        </group>

      </group>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          CHÃ‚N BÃ€N â€” Hairpin legs (2 thanh má»—i chÃ¢n)
          â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {[[-1.02, -0.42], [-1.02, 0.42], [1.02, -0.42], [1.02, 0.42]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, LEG_H / 2, 0.026]} rotation={[0.05, 0, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.007, LEG_H, 7]} />
            <meshStandardMaterial color="#0f172a" metalness={0.88} roughness={0.12} />
          </mesh>
          <mesh position={[0, LEG_H / 2, -0.026]} rotation={[-0.05, 0, 0]} castShadow>
            <cylinderGeometry args={[0.009, 0.007, LEG_H, 7]} />
            <meshStandardMaterial color="#0f172a" metalness={0.88} roughness={0.12} />
          </mesh>
          {/* Thanh ngang ná»‘i Ä‘Ã¡y */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.007, 0.007, 0.062]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      ))}

    </group>
  )
}

export default DeskSetup
