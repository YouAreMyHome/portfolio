import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { Analytics } from '@vercel/analytics/react'
import { track } from '@vercel/analytics'
import { Hand, RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary, WebGLErrorBoundary } from './components/UI/ErrorBoundary'
import Room from './components/Room/Room'
import SceneLighting from './components/Room/SceneLighting'
import CameraController from './components/Room/CameraController'
import PostProcessingEffects from './components/Room/PostProcessingEffects'
import HUD from './components/UI/HUD'
import ConstructionHUD from './components/UI/ConstructionHUD'
import ClockTimeDisplay from './components/UI/ClockTimeDisplay'
import TransitionOverlay from './components/UI/TransitionOverlay'
import useStore from './store/useStore'
import { useSounds } from './utils/useSounds'
import { useMobile, getGraphicsSettings } from './utils/useMobile'
import { IMAGES } from './data/images'
import { preloadImages } from './utils/preloadImages'
import { clearLoadingMarks, mark, measure } from './utils/loadingMetrics'
import { eventBus, APP_EVENTS } from './utils/eventBus'

// Lazy load UI overlay components
const PanelOverlay = lazy(() => import('./components/UI/PanelOverlay'))
const TVGameOverlay = lazy(() => import('./components/UI/TVGameOverlay'))
const KanbanOverlay = lazy(() => import('./components/UI/KanbanOverlay'))
const MusicPlayer = lazy(() => import('./components/UI/MusicPlayer'))
const PolaroidLightbox = lazy(() => import('./components/UI/PolaroidLightbox'))
const GuestbookOverlay = lazy(() => import('./components/UI/GuestbookOverlay'))
const LeaderboardOverlay = lazy(() => import('./components/UI/LeaderboardOverlay'))
const PhotoMode = lazy(() => import('./components/UI/PhotoMode'))
const AdminIndex = lazy(() => import('./components/Admin/index'))

/**
 * THE DEV'S PIXEL ROOM
 * 
 * Portfolio cá nhân dạng Isometric 3D Room
 * - Bảng màu nền thống nhất 100% giữa HTML Body, Container Div và Three.js Canvas
 */
const AMBIENT_BG_COLORS = {
  morning: '#eee9e0',
  sunset: '#2a110a',
  rainy: '#18202d',
  night: '#090d16',
}

// Background color controller component
function BackgroundController() {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)

  useEffect(() => {
    document.body.style.transition = 'background-color 0.6s ease'
    const preset = isNightMode ? 'night' : (lightingPreset || 'morning')
    document.body.style.backgroundColor = AMBIENT_BG_COLORS[preset] || AMBIENT_BG_COLORS.morning
  }, [isNightMode, lightingPreset])

  return null
}

// Sound system connector - connects Web Audio and Analytics via AppEventBus
function SoundSystem() {
  const { playSound } = useSounds()

  useEffect(() => {
    const unsubAudio = eventBus.on(APP_EVENTS.AUDIO_PLAY, (name) => {
      playSound(name)
    })
    const unsubAnalytics = eventBus.on(APP_EVENTS.ANALYTICS_TRACK, ({ name, properties }) => {
      try {
        track(name, properties)
      } catch {}
    })
    return () => {
      unsubAudio()
      unsubAnalytics()
    }
  }, [playSound])

  return null
}

// Dynamic scene background mượt mà đồng bộ 100% với body
function SmoothSceneBackground({ targetColor }) {
  const { scene } = useThree()
  const targetColorObj = useRef(new THREE.Color(targetColor))

  useEffect(() => {
    targetColorObj.current.set(targetColor)
  }, [targetColor])

  useFrame((_, delta) => {
    if (scene.background && scene.background.isColor) {
      scene.background.lerp(targetColorObj.current, 1 - Math.exp(-3.5 * delta))
    }
  })

  return <color attach="background" args={[targetColor]} />
}

// Scene component - chứa tất cả 3D elements
function Scene({ isNightMode, graphics = {} }) {
  const controlsRef = useRef()
  // Disable controls when viewing TV (boolean selector prevents re-rendering Scene on other panels)
  const controlsEnabled = useStore((state) => state.activePanel !== 'playground')
  const isSceneReady = useStore((state) => state.isSceneReady)
  const setSceneReady = useStore((state) => state.setSceneReady)
  const lightingPreset = useStore((state) => state.lightingPreset)

  // Bắt tín hiệu frame đầu tiên render xong
  useFrame(() => {
    if (!isSceneReady) {
      mark('loading:first-frame')
      setSceneReady()
    }
  })

  const {
    postProcessing = true,
  } = graphics

  const activePreset = isNightMode ? 'night' : (lightingPreset || 'morning')
  const sceneBgColor = AMBIENT_BG_COLORS[activePreset] || AMBIENT_BG_COLORS.morning

  return (
    <>
      {/* Dynamic scene background chuyển màu nhung mượt mà */}
      <SmoothSceneBackground targetColor={sceneBgColor} />

      <Suspense fallback={null}>
        {/* Dynamic Lighting */}
        <SceneLighting />

        {/* Room */}
        <Room graphics={graphics} />

        {/* Camera Controller - animate camera for TV view */}
        <CameraController controlsRef={controlsRef} />

        {/* OrbitControls - Quán tính xoay mượt mà chuẩn Awwwards */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.075}
          minZoom={40}
          maxZoom={150}
          minAzimuthAngle={-Math.PI / 2.8}
          maxAzimuthAngle={Math.PI / 2.8}
          minPolarAngle={Math.PI / 7}
          maxPolarAngle={Math.PI / 2.3}
          rotateSpeed={0.8}
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

        {/* Post-processing Effects */}
        {postProcessing && (
          <PostProcessingEffects graphics={graphics} />
        )}
      </Suspense>
    </>
  )
}

function AppContent() {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
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

  // Smart idle: dừng render loop khi tab trình duyệt bị ẩn
  const [isTabHidden, setIsTabHidden] = useState(() => typeof document !== 'undefined' && document.hidden)

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

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

  const activePreset = isNightMode ? 'night' : (lightingPreset || 'morning')
  const currentBgColor = AMBIENT_BG_COLORS[activePreset] || AMBIENT_BG_COLORS.morning

  return (
    <div className="w-full h-full" style={{
      backgroundColor: currentBgColor,
      transition: 'background-color 0.6s ease'
    }}>
      <BackgroundController />
      <SoundSystem />
      <WebGLErrorBoundary>
        <Canvas
          frameloop={isTabHidden ? 'never' : 'always'}
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
          onCreated={({ camera }) => {
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

        {/* Guestbook Sticky Notes Overlay */}
        <GuestbookOverlay />

        {/* Arcade Leaderboard Overlay */}
        <LeaderboardOverlay />

        {/* Polaroid Camera Photo Mode */}
        <PhotoMode />

        {/* Admin CMS Portal */}
        <AdminIndex />
      </Suspense>

      {/* Architectural Procedural Genesis HUD */}
      <ConstructionHUD />

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
  const hasEnteredRoom = useStore((state) => state.hasEnteredRoom)
  const showWelcome = useStore((state) => state.showWelcome)
  const { t } = useTranslation()

  useEffect(() => {
    if (!hasEnteredRoom || showWelcome) return
    const timer = setTimeout(() => setShow(false), 4000)
    return () => clearTimeout(timer)
  }, [hasEnteredRoom, showWelcome])

  if (!show || !hasEnteredRoom || showWelcome) return null

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
