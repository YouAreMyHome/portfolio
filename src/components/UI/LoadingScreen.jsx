import { useEffect, useState, useRef, useMemo } from 'react'
import { Sparkles, Compass, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { track } from '@vercel/analytics'
import { useSounds } from '../../utils/useSounds'
import useStore from '../../store/useStore'
import { mark, measure } from '../../utils/loadingMetrics'
import './LoadingScreen.css'

/**
 * LoadingScreen — Màn hình loading đồng bộ hoàn toàn với Welcome Screen
 * Phong cách: Game Main Menu Prelude (Bầu trời đêm, card kính mờ, thanh progress neon vàng/tím)
 */
function LoadingScreen() {
  const isSceneReady = useStore((state) => state.isSceneReady)
  const isCriticalAssetsReady = useStore((state) => state.isCriticalAssetsReady)
  const criticalAssetsTotal = useStore((state) => state.criticalAssetsTotal)
  const criticalAssetsLoaded = useStore((state) => state.criticalAssetsLoaded)
  const criticalAssetsFailed = useStore((state) => state.criticalAssetsFailed)
  const loadingStartedAt = useStore((state) => state.loadingStartedAt)
  const loadingMinDisplayMs = useStore((state) => state.loadingMinDisplayMs)
  const setLoadingMetrics = useStore((state) => state.setLoadingMetrics)
  const setShowWelcome = useStore((state) => state.setShowWelcome)
  const hasEnteredRoom = useStore((state) => state.hasEnteredRoom)
  const { playSuccess } = useSounds()

  const { t } = useTranslation()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [hideAll, setHideAll] = useState(false)
  const [loadingStageKey, setLoadingStageKey] = useState('s0')

  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const playedSuccessRef = useRef(false)
  const hasCompletedRef = useRef(false)

  // Ambient stars for the night sky backdrop
  const ambientStars = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${(i * 21.7 + 7.3) % 96}%`,
      top: `${(i * 19.3 + 4.5) % 85}%`,
      size: i % 4 === 0 ? 2.5 : 1.5,
      delay: (i % 6) * 0.5,
      duration: 2.2 + (i % 4) * 0.7,
    }))
  }, [])

  useEffect(() => {
    if (loadingStartedAt > 0) {
      startTimeRef.current = loadingStartedAt
    }
  }, [loadingStartedAt])

  // ── Animate progress ─────────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const minPassed = elapsed >= loadingMinDisplayMs
      const settledAssets = criticalAssetsLoaded + criticalAssetsFailed
      const totalSteps = Math.max(1, criticalAssetsTotal + 2)
      const completedSteps =
        settledAssets +
        (isSceneReady ? 1 : 0) +
        (minPassed ? 1 : 0)
      const stepProgress = (Math.min(totalSteps, completedSteps) / totalSteps) * 100

      setDisplayProgress((prev) => {
        const isReadyToComplete = isSceneReady && isCriticalAssetsReady && minPassed
        const target = isReadyToComplete ? 100 : Math.min(99, stepProgress)

        const diff = target - prev
        if (Math.abs(diff) < 0.15) return target

        const speed = target >= 99 ? 0.18 : 0.09
        return prev + diff * speed
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [
    isSceneReady,
    isCriticalAssetsReady,
    criticalAssetsTotal,
    criticalAssetsLoaded,
    criticalAssetsFailed,
    loadingMinDisplayMs,
  ])

  // ── Loading text theo elapsed time ────────────────────────────────────────
  useEffect(() => {
    const settledAssets = criticalAssetsLoaded + criticalAssetsFailed
    const settledRatio = criticalAssetsTotal > 0 ? settledAssets / criticalAssetsTotal : 0

    if (criticalAssetsFailed > 0 && settledRatio >= 1) {
      setLoadingStageKey('sFallback')
      return
    }

    if (settledRatio < 0.15) {
      setLoadingStageKey('s0')
    } else if (settledRatio < 0.35) {
      setLoadingStageKey('s20')
    } else if (settledRatio < 0.55) {
      setLoadingStageKey('s38')
    } else if (settledRatio < 0.75) {
      setLoadingStageKey('s56')
    } else if (settledRatio < 1) {
      setLoadingStageKey('s72')
    } else if (!isSceneReady || !isCriticalAssetsReady) {
      setLoadingStageKey('s86')
    } else {
      setLoadingStageKey('s100')
    }
  }, [criticalAssetsLoaded, criticalAssetsFailed, criticalAssetsTotal, isSceneReady, isCriticalAssetsReady])

  // ── Kết thúc loading: Fade out & dissolve vào WelcomeScreen ─────────────
  const isLoaded = displayProgress >= 99

  useEffect(() => {
    if (hasEnteredRoom || hasCompletedRef.current) return

    if (isLoaded) {
      hasCompletedRef.current = true

      if (!playedSuccessRef.current) {
        playedSuccessRef.current = true
        mark('loading:ui-hidden')

        const totalMs = measure('loading:total', 'loading:start', 'loading:ui-hidden')
        const preloadMs = measure('loading:preload', 'loading:preload-start', 'loading:preload-done')
        const waitFrameMs = measure('loading:wait-first-frame', 'loading:preload-done', 'loading:first-frame')

        setLoadingMetrics((prev) => ({
          ...(prev || {}),
          totalMs,
          preloadMs,
          waitFrameMs,
          failedAssets: criticalAssetsFailed,
          totalAssets: criticalAssetsTotal,
        }))

        track('loading_completed', {
          total_ms: totalMs,
          preload_ms: preloadMs,
          wait_first_frame_ms: waitFrameMs,
          critical_failed: criticalAssetsFailed,
          critical_total: criticalAssetsTotal,
        })

        playSuccess()
      }

      // Kích hoạt WelcomeScreen sẵn sàng bên dưới và bắt đầu dissolve LoadingScreen
      setShowWelcome(true)
      setIsFadingOut(true)

      const hideTimer = setTimeout(() => {
        setHideAll(true)
      }, 750)

      return () => {
        clearTimeout(hideTimer)
      }
    }
  }, [
    isLoaded,
    hasEnteredRoom,
    criticalAssetsFailed,
    criticalAssetsTotal,
  ])

  if (hasEnteredRoom || hideAll) return null

  const roundedProgress = Math.round(displayProgress)
  const settledAssets = criticalAssetsLoaded + criticalAssetsFailed
  const hasFailures = criticalAssetsFailed > 0
  const elapsed = Date.now() - startTimeRef.current
  const minPassed = elapsed >= loadingMinDisplayMs
  const totalSteps = Math.max(1, criticalAssetsTotal + 2)
  const actualCompletedSteps = Math.min(
    totalSteps,
    settledAssets + (isSceneReady ? 1 : 0) + (minPassed ? 1 : 0)
  )
  const visibleCompletedSteps = Math.min(
    actualCompletedSteps,
    Math.max(0, Math.round((roundedProgress / 100) * totalSteps))
  )

  return (
    <div className={`loading-screen ${isFadingOut ? 'loading-screen-fading' : ''}`}>
      {/* Cùng bầu trời đêm với WelcomeScreen */}
      <div className="loading-sky-gradient" />
      <div className="loading-scanlines" />
      <div className="loading-vignette" />

      {/* Sao nhấp nháy nền */}
      <div className="loading-stars-layer">
        {ambientStars.map((s) => (
          <span
            key={s.id}
            className="loading-star"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Ánh trăng halo sau card */}
      <div className="loading-center-halo" />

      {/* Card Loading đồng bộ với Game Hero Card */}
      <div className="loading-card">
        {/* Góc bracket kiểu game */}
        <div className="card-corner corner-tl" />
        <div className="card-corner corner-tr" />
        <div className="card-corner corner-bl" />
        <div className="card-corner corner-br" />

        {/* Top badge */}
        <div className="loading-badge">
          <Sparkles size={13} className="loading-badge-icon" />
          <span>{t('loading.status_readying', 'INITIALIZING SPACE')}</span>
        </div>

        {/* Brand Title giống Welcome Screen */}
        <h1 className="loading-title">
          <span className="title-highlight">NGHIA&apos;S</span>
          <span className="title-sub">ROOM</span>
        </h1>

        <p className="loading-subtitle">
          {t('loading.subtitle', 'Interactive 3D Portfolio')}
        </p>

        {/* Status indicator */}
        <div className="loading-stage-pill">
          <span className="loading-stage-dot" />
          <span className="loading-stage-text">
            {t(`loading.stages.${loadingStageKey}`)}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="loading-bar-wrap">
          <div className="loading-bar-track">
            <div
              className="loading-bar-fill"
              style={{ width: `${Math.max(0, Math.min(100, displayProgress))}%` }}
            >
              <div className="loading-bar-glow-tip" />
              <div className="loading-bar-shimmer" />
            </div>
          </div>

          <div className="loading-meta-row">
            <span className="loading-meta-steps">
              {`${visibleCompletedSteps}/${totalSteps} STEPS`}
            </span>
            <span className="loading-meta-percent">
              {roundedProgress}%
            </span>
          </div>
        </div>

        {/* Cozy Tip */}
        <p className="loading-cozy-tip">
          {t('loading.tip', 'Đang chuẩn bị căn phòng ấm cúng cho bạn...')}
        </p>
      </div>

      {/* Ambient Footer */}
      <div className="loading-footer-brand">
        <span>EST. 2026</span>
        <span>•</span>
        <span>THREE.JS &amp; REACT</span>
        <span>•</span>
        <span>{hasFailures ? `FALLBACK (${criticalAssetsFailed})` : 'READYING SYSTEM'}</span>
      </div>
    </div>
  )
}

export default LoadingScreen
