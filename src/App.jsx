import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { OrbitControls, SoftShadows } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Analytics } from '@vercel/analytics/react'
import { Hand, RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary, WebGLErrorBoundary } from './components/UI/ErrorBoundary'
import Room from './components/Room/Room'
import SceneLighting from './components/Room/SceneLighting'
import CameraController from './components/Room/CameraController'
import HUD from './components/UI/HUD'
import LoadingScreen from './components/UI/LoadingScreen'
import ClockTimeDisplay from './components/UI/ClockTimeDisplay'
import TransitionOverlay from './components/UI/TransitionOverlay'
import useStore from './store/useStore'
import { useSounds } from './utils/useSounds'
import { useMobile, getGraphicsSettings } from './utils/useMobile'

// Lazy load UI overlay components
const PanelOverlay = lazy(() => import('./components/UI/PanelOverlay'))
const TVGameOverlay = lazy(() => import('./components/UI/TVGameOverlay'))
const KanbanOverlay = lazy(() => import('./components/UI/KanbanOverlay'))
const MusicPlayer = lazy(() => import('./components/UI/MusicPlayer'))
const PolaroidLightbox = lazy(() => import('./components/UI/PolaroidLightbox'))

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
  const isSceneReady = useStore((state) => state.isSceneReady)
  const setSceneReady = useStore((state) => state.setSceneReady)

  // Bắt tín hiệu frame đầu tiên render xong
  useFrame(() => {
    if (!isSceneReady) setSceneReady()
  })
  
  // Disable controls when viewing TV
  const controlsEnabled = activePanel !== 'playground'
  
  // Default graphics settings
  const {
    softShadows = true,
    postProcessing = true,
    shadowSamples = 16,
    shadowSize = 25,
    composerMultisampling = 4,
    bloomIntensity = 0.35
  } = graphics
  
  return (
    <>
      {/* Dynamic scene background */}
      <color attach="background" args={[isNightMode ? '#0f172a' : '#f0f0f0']} />
      
      {/* Soft Shadows - conditional for mobile */}
      {softShadows && <SoftShadows size={shadowSize} samples={shadowSamples} focus={0.5} />}
      
      <Suspense fallback={null}>
        {/* Dynamic Lighting */}
        <SceneLighting />
        
        {/* Room */}
        <Room graphics={graphics} />
        
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
          <EffectComposer multisampling={composerMultisampling}>
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

function AppContent() {
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
      <WebGLErrorBoundary>
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
      </WebGLErrorBoundary>
      
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
      
      {/* Scene Transition Overlay — chạy khi toggle day/night */}
      <TransitionOverlay />

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
  const { t } = useTranslation()
  
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 4000)
    return () => clearTimeout(timer)
  }, [])
  
  if (!show) return null
  
  return (
    <div className="mobile-touch-hint">
      <div className="touch-hint-content">
        <span className="touch-icon"><Hand size={20} /></span>
        <span>{t('app.touch_interact')}</span>
        <span className="touch-icon rotate"><RotateCw size={20} /></span>
        <span>{t('app.swipe_rotate')}</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary resetable>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
