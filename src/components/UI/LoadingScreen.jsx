import { useProgress } from '@react-three/drei'
import { useEffect, useState, useRef } from 'react'
import { Terminal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSounds } from '../../utils/useSounds'
import useStore from '../../store/useStore'
import './LoadingScreen.css'

/**
 * LoadingScreen — Màn hình loading chính xác
 *
 * Logic progress 3 giai đoạn:
 *  1. 0 → 85%  : fake staged animation trong khi scene đang khởi tạo
 *  2. 85 → 100%: chỉ xảy ra khi isSceneReady = true (frame đầu tiên render)
 *  3. Tối thiểu hiển thị 1.5s để tránh flash trên máy nhanh
 */

const MIN_DISPLAY_MS = 1500 // Tối thiểu hiển thị loading

function LoadingScreen() {
  const { progress, loaded, total } = useProgress()
  const isSceneReady = useStore((state) => state.isSceneReady)
  const { playSuccess } = useSounds()

  const { t } = useTranslation()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [hideAll, setHideAll] = useState(false)
  const [loadingStageKey, setLoadingStageKey] = useState('s0')

  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const playedSuccessRef = useRef(false)

  // Có assets drei thực (GLTF, texture…) hay không
  const hasRealAssets = total > 0

  // ── Animate progress ─────────────────────────────────────────────────────
  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const minPassed = elapsed >= MIN_DISPLAY_MS

      setDisplayProgress(prev => {
        let target

        if (hasRealAssets) {
          // Có assets thực: theo drei progress, nhưng giữ ≤95% cho đến khi scene sẵn sàng
          target = (isSceneReady && minPassed) ? 100 : Math.min(95, progress)
        } else {
          // Scene procedural (không có assets): fake staged progress
          //  0–0.8s  : 0  → 40%  (khởi tạo nhanh)
          //  0.8–2s  : 40 → 72%  (setup Three.js, compile shaders)
          //  2–3.5s  : 72 → 85%  (chờ scene render — cap ở đây)
          //  khi isSceneReady + minPassed → 100%
          const t = elapsed / 1000 // giây
          let fakeBase
          if (t < 0.8) {
            fakeBase = (t / 0.8) * 40
          } else if (t < 2) {
            fakeBase = 40 + ((t - 0.8) / 1.2) * 32
          } else {
            fakeBase = 72 + Math.min(13, ((t - 2) / 1.5) * 13)
          }

          target = (isSceneReady && minPassed) ? 100 : Math.min(85, fakeBase)
        }

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
  }, [isSceneReady, hasRealAssets, progress])

  // ── Loading text theo elapsed time (tự nhiên hơn theo %): ────────────────
  useEffect(() => {
    if (displayProgress < 20) {
      setLoadingStageKey('s0')
    } else if (displayProgress < 38) {
      setLoadingStageKey('s20')
    } else if (displayProgress < 56) {
      setLoadingStageKey('s38')
    } else if (displayProgress < 72) {
      setLoadingStageKey('s56')
    } else if (displayProgress < 86) {
      setLoadingStageKey('s72')
    } else if (displayProgress < 99) {
      setLoadingStageKey('s86')
    } else {
      setLoadingStageKey('s100')
    }
  }, [displayProgress])

  // ── Kết thúc loading khi xong ────────────────────────────────────────────
  const isLoaded = displayProgress >= 99

  useEffect(() => {
    if (isLoaded) {
      if (!playedSuccessRef.current) {
        playedSuccessRef.current = true
        playSuccess()
      }
      const hideTimer = setTimeout(() => setHideAll(true), 450)
      return () => {
        clearTimeout(hideTimer)
      }
    }
  }, [isLoaded, playSuccess])
  
  if (hideAll) return null
  
  const roundedProgress = Math.round(displayProgress)
  
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
                style={{ width: `${roundedProgress}%` }}
              >
                <div className="loading-progress-scan"></div>
              </div>
              <span className="loading-progress-percent">{roundedProgress}%_COMPLETE</span>
            </div>
          </div>

          <div className="loading-meta">
            <span>{hasRealAssets ? `${loaded}/${total}_ASSETS` : 'SECTOR_01_MAP'}</span>
            <div>
              <span className="loading-live-dot">●</span>
              <span>STATUS: ONLINE</span>
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
