import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { OrbitControls, SoftShadows } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom, Vignette } from '@react-three/postprocessing'
import Room from './components/Room/Room'
import SceneLighting from './components/Room/SceneLighting'
import PanelOverlay from './components/UI/PanelOverlay'
import HUD from './components/UI/HUD'
import LoadingScreen from './components/UI/LoadingScreen'
import useStore from './store/useStore'
import { useSounds } from './utils/useSounds'

/**
 * THE DEV'S PIXEL ROOM - Phase 4: Polish
 * 
 * Portfolio cá nhân dạng Isometric 3D Room
 * - Click objects để mở panels
 * - Window toggle day/night với smooth transition
 * - Cat easter egg
 * - Sound effects
 */

// Background color controller component
function BackgroundController() {
  const isNightMode = useStore((state) => state.isNightMode)
  
  useEffect(() => {
    // Smooth transition cho body background
    document.body.style.transition = 'background-color 0.5s ease'
    document.body.style.backgroundColor = isNightMode ? '#0f172a' : '#f0f0f0'
  }, [isNightMode])
  
  return null
}

// Sound system connector
function SoundSystem() {
  const setSoundTrigger = useStore((state) => state.setSoundTrigger)
  const { playSound } = useSounds()
  
  useEffect(() => {
    setSoundTrigger(playSound)
  }, [setSoundTrigger, playSound])
  
  return null
}

function App() {
  const isNightMode = useStore((state) => state.isNightMode)
  
  return (
    <div className="w-full h-full" style={{ 
      backgroundColor: isNightMode ? '#0f172a' : '#f0f0f0',
      transition: 'background-color 0.5s ease'
    }}>
      <BackgroundController />
      <SoundSystem />
      <Canvas
        orthographic
        camera={{ 
          position: [10, 10, 10], 
          zoom: 80,
          near: 0.1,
          far: 100
        }}
        shadows="soft"
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(0, 0, 0)
        }}
      >
        {/* Dynamic scene background */}
        <color attach="background" args={[isNightMode ? '#0f172a' : '#f0f0f0']} />
        
        {/* Soft Shadows - làm mềm bóng đổ */}
        <SoftShadows size={25} samples={16} focus={0.5} />
        
        <Suspense fallback={null}>
          {/* Dynamic Lighting */}
          <SceneLighting />
          
          {/* Room */}
          <Room />
          
          {/* OrbitControls - giới hạn góc xoay */}
          <OrbitControls 
            enableDamping
            dampingFactor={0.05}
            minZoom={40}
            maxZoom={150}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.5}
            enablePan={true}
            panSpeed={0.5}
            target={[0, 0.5, 0]}
          />
          
          {/* Post-processing Effects */}
          <EffectComposer>
            {/* Ambient Occlusion - bóng đổ góc khuất */}
            <N8AO
              aoRadius={0.5}
              intensity={isNightMode ? 2 : 1.5}
              aoSamples={16}
              denoiseSamples={8}
              distanceFalloff={0.5}
              color={isNightMode ? "#000022" : "#000000"}
            />
            
            {/* Bloom - phát sáng cho cửa sổ, màn hình và đèn */}
            <Bloom 
              intensity={isNightMode ? 0.5 : 0.35}
              luminanceThreshold={1.0}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.6}
            />
            
            {/* Vignette - tối góc để tập trung */}
            <Vignette 
              offset={0.35}
              darkness={isNightMode ? 0.5 : 0.3}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      {/* HTML Overlay Panels */}
      <PanelOverlay />
      
      {/* HUD */}
      <HUD />
      
      {/* Loading Screen */}
      <LoadingScreen />
    </div>
  )
}

export default App
