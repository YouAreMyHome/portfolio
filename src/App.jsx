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
import { IMAGES } from './data/images'
import { preloadImages } from './utils/preloadImages'
import { clearLoadingMarks, mark, measure } from './utils/loadingMetrics'

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
    if (!isSceneReady) {
      mark('loading:first-frame')
      setSceneReady()
    }
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
  const isSceneReady = useStore((state) => state.isSceneReady)
  const isCriticalAssetsReady = useStore((state) => state.isCriticalAssetsReady)
  const startLoadingSession = useStore((state) => state.startLoadingSession)
  const setCriticalAssetsTotal = useStore((state) => state.setCriticalAssetsTotal)
  const markCriticalAssetLoaded = useStore((state) => state.markCriticalAssetLoaded)
  const markCriticalAssetFailed = useStore((state) => state.markCriticalAssetFailed)
  const setCriticalAssetsReady = useStore((state) => state.setCriticalAssetsReady)
  const setLoadingMetrics = useStore((state) => state.setLoadingMetrics)
  const { isMobile, isTablet, isTouchDevice } = useMobile()
  const graphics = getGraphicsSettings(isMobile, isTablet)

  useEffect(() => {
    const connectionType = navigator.connection?.effectiveType || '4g'
    const saveData = navigator.connection?.saveData
    const minDisplayMs = (saveData || connectionType === '2g' || connectionType === 'slow-2g') ? 1800 : 1200

    const criticalAssets = [
      ...IMAGES.gallery,
      IMAGES.polaroid1,
      IMAGES.polaroid2,
      IMAGES.frame1,
    ]

    const uniqueAssets = [...new Set(criticalAssets.filter(Boolean))]

    clearLoadingMarks()
    mark('loading:start')
    mark('loading:preload-start')

    startLoadingSession({ total: uniqueAssets.length, minDisplayMs })
    setCriticalAssetsTotal(uniqueAssets.length)

    let cancelled = false

    const runPreload = async () => {
      await preloadImages(uniqueAssets, {
        timeoutMs: isMobile ? 4000 : 3000,
        retries: 2,
        onAssetSettled: (result) => {
          if (cancelled) return
          if (result.ok) {
            markCriticalAssetLoaded()
          } else {
            markCriticalAssetFailed()
          }
        },
      })

      if (!cancelled) {
        mark('loading:preload-done')
        // Failed assets vẫn được phép vào app vì component có fallback material.
        setCriticalAssetsReady(true)
      }
    }

    runPreload()

    return () => {
      cancelled = true
    }
  }, [
    isMobile,
    startLoadingSession,
    setCriticalAssetsTotal,
    markCriticalAssetLoaded,
    markCriticalAssetFailed,
    setCriticalAssetsReady,
    setLoadingMetrics,
  ])

  useEffect(() => {
    if (!isSceneReady || !isCriticalAssetsReady) return

    const preloadMs = measure('loading:preload', 'loading:preload-start', 'loading:preload-done')
    const waitFrameMs = measure('loading:wait-first-frame', 'loading:preload-done', 'loading:first-frame')

    setLoadingMetrics((prev) => ({
      ...(prev || {}),
      preloadMs,
      waitFrameMs,
    }))
  }, [isSceneReady, isCriticalAssetsReady, setLoadingMetrics])

  useEffect(() => {
    if (!isSceneReady || !isCriticalAssetsReady) return

    // Warm up lazy chunks để giảm dead-click khi mở panel lần đầu.
    import('./components/UI/PanelOverlay')
    import('./components/UI/TVGameOverlay')
    import('./components/UI/KanbanOverlay')
    import('./components/UI/MusicPlayer')
    import('./components/UI/PolaroidLightbox')
  }, [isSceneReady, isCriticalAssetsReady])
  
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
      
      <Suspense fallback={<OverlayFallback />}>
        {/* HTML Overlay Panels */}
        <PanelOverlay />
        
        {/* TV Game Overlay - Retro game console */}
        <TVGameOverlay />
        
        {/* Kanban Board Overlay */}
        <KanbanOverlay />
      </Suspense>
      
      {/* HUD */}
      <HUD isTouchDevice={isTouchDevice} />
      
      <Suspense fallback={<OverlayFallback />}>
        {/* Music Player - Spotify style, background playback */}
        <MusicPlayer />
      </Suspense>
      
      {/* Clock Time Display */}
      <ClockTimeDisplay />
      
      {/* Scene Transition Overlay — chạy khi toggle day/night */}
      <TransitionOverlay />

      {/* Loading Screen */}
      <LoadingScreen />
      
      <Suspense fallback={<OverlayFallback />}>
        {/* Polaroid Lightbox */}
        <PolaroidLightbox />
      </Suspense>
      
      {/* Mobile touch hint */}
      {isTouchDevice && <MobileTouchHint />}
      
      {/* Vercel Analytics */}
      <Analytics />
    </div>
  )
}

function OverlayFallback() {
  return (
    <div style={{
      position: 'fixed',
      right: 12,
      bottom: 12,
      zIndex: 80,
      fontSize: 12,
      color: '#94a3b8',
      background: 'rgba(2, 6, 23, 0.65)',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      padding: '6px 10px',
      borderRadius: 8,
      pointerEvents: 'none',
    }}>
      Loading UI...
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
