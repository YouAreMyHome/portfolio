import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import {
  Sparkles,
  Volume2,
  VolumeX,
  Globe,
  ArrowRight,
  Cpu,
  Terminal,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { track } from '@vercel/analytics'
import { useSounds, useSoundStore } from '../../utils/useSounds'
import useStore from '../../store/useStore'
import { mark, measure } from '../../utils/loadingMetrics'
import './LoadingScreen.css'

/**
 * Cinematic Entrance Portal (Hợp nhất Loading & Welcome thành 1 luồng điện ảnh duy nhất)
 * - Giai đoạn 1: Geometry Loading — Khối Isometric Blueprint Cube lắp ráp với radar laser scan
 * - Giai đoạn 2: Portal Ready — Morphing mượt mà sang Nút "Bước vào phòng" với hào quang thở
 * - Giai đoạn 3: Shutter Reveal — Hai cánh rèm rạp hát trượt mở đưa thẳng vào phòng 3D
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
  const hasEnteredRoom = useStore((state) => state.hasEnteredRoom)
  const enterRoom = useStore((state) => state.enterRoom)
  const completeWelcomeExit = useStore((state) => state.completeWelcomeExit)

  const { isMuted, toggleMute } = useSoundStore()
  const { playClick, playSuccess } = useSounds()
  const { t, i18n } = useTranslation()

  // Các giai đoạn: 'loading' | 'ready' | 'entering'
  const [phase, setPhase] = useState('loading')
  const [displayProgress, setDisplayProgress] = useState(0)
  const [hideAll, setHideAll] = useState(false)
  const [loadingStageKey, setLoadingStageKey] = useState('s0')

  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const hasRecordedMetricsRef = useRef(false)

  // Bầu trời sao vi mô
  const ambientStars = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: `${(i * 21.7 + 7.3) % 94}%`,
      top: `${(i * 18.5 + 5.2) % 88}%`,
      size: i % 3 === 0 ? 2 : 1.2,
      delay: (i % 5) * 0.4,
      duration: 2.2 + (i % 3) * 0.8,
    }))
  }, [])

  useEffect(() => {
    if (loadingStartedAt > 0) {
      startTimeRef.current = loadingStartedAt
    }
  }, [loadingStartedAt])

  // ── Animate progress mượt mà với Exponential Damping ─────────────────────
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
        if (Math.abs(diff) < 0.1) return target

        const speed = target >= 99 ? 0.16 : 0.08
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

  // ── Cập nhật trạng thái kỹ thuật ──────────────────────────────────────────
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

  // ── Chuyển đổi sang trạng thái Ready (Morphing to Enter Button) ───────────
  useEffect(() => {
    if (phase === 'loading' && displayProgress >= 99.5) {
      setPhase('ready')

      if (!hasRecordedMetricsRef.current) {
        hasRecordedMetricsRef.current = true
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
      }
    }
  }, [
    phase,
    displayProgress,
    criticalAssetsFailed,
    criticalAssetsTotal,
    setLoadingMetrics,
  ])

  // ── Xử lý khi nhấn "Bước vào phòng" ───────────────────────────────────────
  const handleEnter = useCallback(() => {
    if (phase !== 'ready') return
    playClick()
    playSuccess()
    setPhase('entering')

    const enterTimer = setTimeout(() => {
      enterRoom()
      completeWelcomeExit()
    }, 450)

    const hideTimer = setTimeout(() => {
      setHideAll(true)
    }, 850)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(hideTimer)
    }
  }, [phase, playClick, playSuccess, enterRoom, completeWelcomeExit])

  // Phím tắt bàn phím: Nhấn Space hoặc Enter để vào phòng ngay
  useEffect(() => {
    if (phase !== 'ready') return

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handleEnter()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, handleEnter])

  // Đổi ngôn ngữ nhanh
  const toggleLanguage = () => {
    playClick()
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

  if (hasEnteredRoom || hideAll) return null

  const roundedProgress = Math.round(displayProgress)
  const formattedPercent = String(roundedProgress).padStart(2, '0')
  const isReady = phase === 'ready'
  const isEntering = phase === 'entering'

  return (
    <div
      className={`portal-root ${isReady ? 'portal-ready' : ''} ${isEntering ? 'portal-entering' : ''}`}
      aria-label="Cinematic Entrance Portal"
    >
      {/* ── Hai cánh Shutter rèm rạp hát trượt mở khi người dùng bước vào ── */}
      <div className="portal-shutter shutter-top" />
      <div className="portal-shutter shutter-bottom" />

      {/* Lưới kiến trúc Isometric Blueprint & Halo */}
      <div className="portal-grid-backdrop" />
      <div className="portal-vignette" />
      <div className="portal-center-halo" />

      {/* Ánh sao vi mô lấp lánh */}
      <div className="portal-stars">
        {ambientStars.map((s) => (
          <span
            key={s.id}
            className="p-star"
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

      {/* ── BỐ CỤC CHÍNH (Thoáng đãng 100%, không đóng hộp) ── */}
      <div className="portal-content">
        {/* Top Header Bar */}
        <header className="portal-top-bar">
          <div className="brand-badge">
            <span className="brand-dot" />
            <span className="brand-title">THE DEV&apos;S PIXEL ROOM</span>
            <span className="brand-divider">/</span>
            <span className="brand-sub">NGHIA.DEV &apos;26</span>
          </div>

          <div className="portal-top-controls">
            {/* Quick Language Toggle */}
            <button
              className="portal-control-btn"
              onClick={toggleLanguage}
              title={i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              <Globe size={13} />
              <span>{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Quick Audio Mute Toggle */}
            <button
              className={`portal-control-btn ${isMuted ? 'muted' : ''}`}
              onClick={() => {
                playClick()
                toggleMute()
              }}
              title={isMuted ? t('welcome.sound_hint') : 'Mute Sound'}
            >
              {isMuted ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} className="text-amber-400" />}
            </button>

            {/* System Status Pill */}
            <div className="system-chip">
              <Cpu size={12} className="text-amber-400" />
              <span>60 FPS</span>
            </div>
          </div>
        </header>

        {/* ── CENTER STAGE: Voxel Blueprint & Morphing Enter Button ── */}
        <main className="portal-center-stage">
          {/* Isometric Voxel Blueprint Cube Assembly */}
          <div className={`portal-cube-assembly ${isReady ? 'ready' : ''}`}>
            <div className="cube-scan-ray" />
            
            <svg
              className="cube-vector"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sàn phòng isometric */}
              <polygon
                points="60,30 100,52 60,74 20,52"
                className="cube-poly poly-floor"
              />
              <line x1="40" y1="41" x2="80" y2="63" className="grid-subline" />
              <line x1="80" y1="41" x2="40" y2="63" className="grid-subline" />

              {/* Tường trái isometric */}
              <polygon
                points="20,52 60,74 60,110 20,88"
                className="cube-poly poly-left"
              />
              <line x1="40" y1="63" x2="40" y2="99" className="grid-subline" />
              <line x1="20" y1="70" x2="60" y2="92" className="grid-subline" />

              {/* Tường phải isometric */}
              <polygon
                points="60,74 100,52 100,88 60,110"
                className="cube-poly poly-right"
              />
              <line x1="80" y1="63" x2="80" y2="99" className="grid-subline" />
              <line x1="60" y1="92" x2="100" y2="70" className="grid-subline" />

              {/* Khối Voxel cốt lõi trung tâm */}
              <polygon
                points="60,42 76,51 60,60 44,51"
                className="voxel-face voxel-t"
              />
              <polygon
                points="44,51 60,60 60,74 44,65"
                className="voxel-face voxel-l"
              />
              <polygon
                points="60,60 76,51 76,65 60,74"
                className="voxel-face voxel-r"
              />

              {/* Các điểm nút tọa độ */}
              <circle cx="60" cy="30" r="2.2" className="anchor-dot" />
              <circle cx="100" cy="52" r="2.2" className="anchor-dot" />
              <circle cx="60" cy="74" r="2.2" className="anchor-dot" />
              <circle cx="20" cy="52" r="2.2" className="anchor-dot" />
              <circle cx="60" cy="110" r="2.2" className="anchor-dot" />
            </svg>
          </div>

          {/* GIAI ĐOẠN 1: Precision Counter khi đang tải */}
          {!isReady && (
            <div className="loader-indicator-area">
              <div className="large-percent-readout">
                <span className="digits">{formattedPercent}</span>
                <span className="symbol">%</span>
              </div>

              <div className="status-terminal-badge">
                <Terminal size={13} className="text-amber-400" />
                <span>{t(`loading.stages.${loadingStageKey}`)}</span>
              </div>
            </div>
          )}

          {/* GIAI ĐOẠN 2: Hero Enter Portal Button khi đã tải xong */}
          {isReady && (
            <div className="enter-portal-area">
              <button
                className="hero-enter-button"
                onClick={handleEnter}
                autoFocus
              >
                {/* Vòng hào quang thở nhấp nháy */}
                <span className="button-aura-ring" />
                <span className="button-aura-ring ring-delay" />

                <span className="btn-content-wrap">
                  <Sparkles size={16} className="text-amber-300" />
                  <span className="btn-label-text">
                    {t('welcome.enter', 'BƯỚC VÀO KHÔNG GIAN')}
                  </span>
                  <ArrowRight size={16} className="arrow-icon" />
                </span>
              </button>

              {/* Dòng hướng dẫn tương tác vi mô */}
              <div className="micro-navigation-hints">
                <span>{t('welcome.hint', 'Kéo để xoay 360° • Cuộn để zoom • Click để tương tác')}</span>
              </div>

              {/* Dòng phím tắt nhẹ nhàng */}
              <div className="keyboard-shortcut-hint">
                <span>PRESS [ SPACE ] OR [ ENTER ]</span>
              </div>
            </div>
          )}
        </main>

        {/* ── Bottom Bar: Hairline Progress & Footer Tag ── */}
        <footer className="portal-bottom-bar">
          {/* Hairline Progress Track (siêu mỏng 2px) */}
          <div className="hairline-meter-track">
            <div
              className="hairline-meter-fill"
              style={{ width: `${Math.max(0, Math.min(100, displayProgress))}%` }}
            >
              <div className="hairline-laser-beacon" />
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="portal-footer-meta">
            <span className="meta-sub">
              {isReady
                ? t('welcome.tagline', 'Khám phá không gian sáng tạo của một lập trình viên')
                : t('loading.tip', 'Đang dựng khung phòng kiến trúc 3D...')}
            </span>
            <span className="meta-engine">INTERACTIVE 3D EXPERIENCE</span>
          </div>
        </footer>
      </div>

      {/* Hiệu ứng bừng sáng ấm áp khi bước qua cổng vào phòng */}
      <div className={`portal-transition-flash ${isEntering ? 'flash-active' : ''}`} />
    </div>
  )
}

export default LoadingScreen
