import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useStore from '../../store/useStore'

/**
 * SceneLighting - Dynamic lighting với Day/Night mode
 * 
 * Day Mode: Warm sunlight, bright ambient
 * Night Mode: Cool moonlight, dim ambient, screen glow
 */
function SceneLighting() {
  const isNightMode = useStore((state) => state.isNightMode)
  
  const ambientRef = useRef()
  const directionalRef = useRef()
  const windowLightRef = useRef()
  const rimLightRef = useRef()
  
  // Smooth transition between day/night
  useFrame(() => {
    const targetAmbient = isNightMode ? 0.15 : 0.55
    const targetDirectional = isNightMode ? 0.3 : 1.8
    const targetWindow = isNightMode ? 0.2 : 0.7
    
    if (ambientRef.current) {
      ambientRef.current.intensity += (targetAmbient - ambientRef.current.intensity) * 0.05
    }
    if (directionalRef.current) {
      directionalRef.current.intensity += (targetDirectional - directionalRef.current.intensity) * 0.05
    }
    if (windowLightRef.current) {
      windowLightRef.current.intensity += (targetWindow - windowLightRef.current.intensity) * 0.05
    }
  })
  
  return (
    <>
      {/* Ambient - nền sáng hơn ban ngày */}
      <ambientLight 
        ref={ambientRef}
        intensity={isNightMode ? 0.15 : 0.55} 
        color={isNightMode ? "#4a5568" : "#fffbf0"} 
      />
      
      {/* Directional - ánh nắng chính từ hướng cửa sổ */}
      <directionalLight 
        ref={directionalRef}
        position={[-5, 12, 8]} 
        intensity={isNightMode ? 0.3 : 1.8}
        color={isNightMode ? "#a0aec0" : "#fff8e7"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0003}
        shadow-normalBias={0.01}
        shadow-radius={3}
      />
      
      {/* Fill light từ cửa sổ - mạnh hơn ban ngày */}
      <pointLight 
        ref={windowLightRef}
        position={[-2, 2.5, -2]} 
        intensity={isNightMode ? 0.2 : 0.7} 
        color={isNightMode ? "#667eea" : "#fff5dc"}
        distance={8}
      />
      
      {/* Rim light cho depth */}
      <pointLight 
        ref={rimLightRef}
        position={[5, 3, 5]} 
        intensity={isNightMode ? 0.15 : 0.3} 
        color={isNightMode ? "#a78bfa" : "#ffeedd"}
      />
      
      {/* Night mode: Screen glow lights */}
      {isNightMode && (
        <>
          {/* PC monitors glow */}
          <pointLight 
            position={[-2.5, 1, -2.8]} 
            intensity={0.4} 
            color="#4ade80"
            distance={2}
          />
          {/* TV glow */}
          <pointLight 
            position={[3, 1, 0]} 
            intensity={0.3} 
            color="#a855f7"
            distance={2}
          />
          {/* Phone notification */}
          <pointLight 
            position={[-1.8, 0.6, 2.5]} 
            intensity={0.2} 
            color="#3b82f6"
            distance={1}
          />
        </>
      )}
    </>
  )
}

export default SceneLighting
