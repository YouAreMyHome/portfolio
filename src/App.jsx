import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { OrbitControls, SoftShadows } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom, Vignette } from '@react-three/postprocessing'
import { Analytics } from '@vercel/analytics/react'
import { Hand, RotateCw } from 'lucide-react'
import Room from './components/Room/Room'
import SceneLighting from './components/Room/SceneLighting'
import CameraController from './components/Room/CameraController'
import PanelOverlay from './components/UI/PanelOverlay'
import TVGameOverlay from './components/UI/TVGameOverlay'
import KanbanOverlay from './components/UI/KanbanOverlay'
import HUD from './components/UI/HUD'
import LoadingScreen from './components/UI/LoadingScreen'
import MusicPlayer from './components/UI/MusicPlayer'
import ClockTimeDisplay from './components/UI/ClockTimeDisplay'
import PolaroidLightbox from './components/UI/PolaroidLightbox'
import useStore from './store/useStore'
import { useSounds } from './utils/useSounds'
import { useMobile, getGraphicsSettings } from './utils/useMobile'

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

// Scene component - chứa tất cả 3D elements
function Scene({ isNightMode, graphics = {} }) {
  const controlsRef = useRef()
  const activePanel = useStore((state) => state.activePanel)
  
  // Disable controls when viewing TV
  const controlsEnabled = activePanel !== 'playground'
  
  // Default graphics settings
  const {
    softShadows = true,
    postProcessing = true,
    aoSamples = 16,
    bloomIntensity = 0.35
  } = graphics
  
  return (
    <>
      {/* Dynamic scene background */}
      <color attach="background" args={[isNightMode ? '#0f172a' : '#f0f0f0']} />
      
      {/* Soft Shadows - conditional for mobile */}
      {softShadows && <SoftShadows size={25} samples={16} focus={0.5} />}
      
      <Suspense fallback={null}>
        {/* Dynamic Lighting */}
        <SceneLighting />
        
        {/* Room */}
        <Room />
        
        {/* Camera Controller - animate camera for TV view */}
        <CameraController controlsRef={controlsRef} />
        
        {/* OrbitControls - giới hạn góc xoay */}
        <OrbitControls 
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minZoom={40}
          maxZoom={150}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          enablePan={controlsEnabled}
          enableRotate={controlsEnabled}
          enableZoom={controlsEnabled}
          panSpeed={0.5}
          target={[0, 0.5, 0]}
          touches={{
            ONE: 1, // ROTATE
            TWO: 2  // DOLLY_PAN
          }}
        />
        
        {/* Post-processing Effects - conditional for mobile */}
        {postProcessing && (
          <EffectComposer>
            {/* Ambient Occlusion - bóng đổ góc khuất */}
            <N8AO
              aoRadius={0.5}
              intensity={isNightMode ? 2 : 1.5}
              aoSamples={aoSamples}
              denoiseSamples={8}
              distanceFalloff={0.5}
              color={isNightMode ? "#000022" : "#000000"}
            />
            
            {/* Bloom - phát sáng cho cửa sổ, màn hình và đèn */}
            <Bloom 
              intensity={isNightMode ? 0.5 : bloomIntensity}
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
        )}
      </Suspense>
    </>
  )
}

function App() {
  const isNightMode = useStore((state) => state.isNightMode)
  const { isMobile, isTablet, isTouchDevice } = useMobile()
  const graphics = getGraphicsSettings(isMobile, isTablet)
  
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
          zoom: graphics.zoom,
          near: 0.1,
          far: 100
        }}
        shadows={graphics.shadows ? "soft" : false}
        gl={{ 
          antialias: graphics.antialias,
          powerPreference: isMobile ? "low-power" : "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
        dpr={graphics.pixelRatio}
        onCreated={({ gl, camera }) => {
          camera.lookAt(0, 0, 0)
        }}
      >
        <Scene isNightMode={isNightMode} graphics={graphics} />
      </Canvas>
      
      {/* HTML Overlay Panels */}
      <PanelOverlay />
      
      {/* TV Game Overlay - Retro game console */}
      <TVGameOverlay />
      
      {/* Kanban Board Overlay */}
      <KanbanOverlay />
      
      {/* HUD */}
      <HUD isTouchDevice={isTouchDevice} />
      
      {/* Music Player - Spotify style, background playback */}
      <MusicPlayer />
      
      {/* Clock Time Display */}
      <ClockTimeDisplay />
      
      {/* Loading Screen */}
      <LoadingScreen />
      
      {/* Polaroid Lightbox */}
      <PolaroidLightbox />
      
      {/* Mobile touch hint */}
      {isTouchDevice && <MobileTouchHint />}
      
      {/* Vercel Analytics */}
      <Analytics />
    </div>
  )
}

/**
 * Mobile touch hint - shows briefly on first load
 */
function MobileTouchHint() {
  const [show, setShow] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4000)
    return () => clearTimeout(timer)
  }, [])
  
  if (!show) return null
  
  return (
    <div className="mobile-touch-hint">
      <div className="touch-hint-content">
        <span className="touch-icon"><Hand size={20} /></span>
        <span>Chạm để tương tác</span>
        <span className="touch-icon rotate"><RotateCw size={20} /></span>
        <span>Vuốt để xoay</span>
      </div>
    </div>
  )
}

export default App
