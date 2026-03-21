import { useEffect, useState, useRef } from 'react'
import { Terminal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { track } from '@vercel/analytics'
import { useSounds } from '../../utils/useSounds'
import useStore from '../../store/useStore'
import { mark, measure } from '../../utils/loadingMetrics'
import './LoadingScreen.css'

/**
 * LoadingScreen — Màn hình loading chính xác
 *
 * Logic progress:
 *  1. Theo dõi assets critical đã settle (loaded hoặc failed)
 *  2. Chờ frame scene đầu tiên render xong
 *  3. Chỉ complete khi qua min display time để tránh flash
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
  const { playSuccess } = useSounds()

  const { t } = useTranslation()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [hideAll, setHideAll] = useState(false)
  const [loadingStageKey, setLoadingStageKey] = useState('s0')

  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const playedSuccessRef = useRef(false)

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

      setDisplayProgress(prev => {
        const isReadyToComplete = isSceneReady && isCriticalAssetsReady && minPassed
        const target = isReadyToComplete ? 100 : Math.min(99, stepProgress)

        const diff = target - prev
        if (Math.abs(diff) < 0.15) return target

        // Mượt khi tiến, nhanh khi nhảy lên 100
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

  // ── Loading text theo elapsed time (tự nhiên hơn theo %): ────────────────
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

  // ── Kết thúc loading khi xong ────────────────────────────────────────────
  const isLoaded = displayProgress >= 99

  useEffect(() => {
    if (isLoaded) {
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
      const hideTimer = setTimeout(() => setHideAll(true), 450)
      return () => {
        clearTimeout(hideTimer)
      }
    }
  }, [
    isLoaded,
    playSuccess,
    setLoadingMetrics,
    criticalAssetsFailed,
    criticalAssetsTotal,
  ])
  
  if (hideAll) return null
  
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
    <div className="loading-screen">
      <div className="loading-background"></div>
      <div className="loading-gradient"></div>
      <div className="loading-scanlines"></div>
      <div className="loading-vignette"></div>
      <div className="loading-glow loading-glow-left"></div>
      <div className="loading-glow loading-glow-right"></div>

      <div className="loading-branding">
        <span className="loading-kicker">INTERACTIVE_3D_PORTFOLIO</span>
        <h1 className="loading-logo">NGHIA&apos;S_ROOM</h1>
      </div>

      <div className="loading-content">
        <div className="loading-status">
          <Terminal size={14} />
          <p>{t(`loading.stages.${loadingStageKey}`)}</p>
        </div>

        <div className="loading-divider"></div>

        <div className="loading-progress-wrap">
          <div className="loading-progress-frame">
            <div className="loading-progress-track">
              <div
                className="loading-progress-fill"
                style={{ width: `${Math.max(0, Math.min(100, displayProgress))}%` }}
              >
                <div className="loading-progress-scan"></div>
              </div>
              <span className="loading-progress-percent">{roundedProgress}%_COMPLETE</span>
            </div>
          </div>

          <div className="loading-meta">
            <span>{`${visibleCompletedSteps}/${totalSteps}_PIPELINE_STEPS`}</span>
            <div>
              <span className="loading-live-dot">●</span>
              <span>{hasFailures ? `STATUS: FALLBACK_${criticalAssetsFailed}` : 'STATUS: ONLINE'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="loading-tech-footer">
        <div className="loading-breadcrumbs">
          <span>ROLE: SOFTWARE_DEV</span>
          <span>/</span>
          <span>STACK: REACT_THREEJS</span>
          <span>/</span>
          <span className="active">MODE: INTERACTIVE</span>
        </div>
        <div className="loading-signature">
          <span></span>
          <p>©2026 NGHIA&apos;S ROOM</p>
          <span></span>
        </div>
      </div>

      <div className="loading-tips">
        <p>Đợi Mình tải tài nguyên 1 xíu nhee...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
