import { useProgress } from '@react-three/drei'
import { useEffect, useState, useRef } from 'react'
import { Home, Armchair, Monitor, Bed, Leaf, Cat, Hand, FolderKanban, Sparkles, Mail, Gamepad2 } from 'lucide-react'
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
  const { progress, active, loaded, total } = useProgress()
  const isSceneReady = useStore((state) => state.isSceneReady)
  const { playSuccess, playWhoosh } = useSounds()

  const [displayProgress, setDisplayProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [hideAll, setHideAll] = useState(false)
  const [loadingText, setLoadingText] = useState('Khởi tạo phòng...')

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
      setLoadingText('Khởi tạo phòng...')
    } else if (displayProgress < 38) {
      setLoadingText('Đang tải nội thất...')
    } else if (displayProgress < 56) {
      setLoadingText('Thiết lập ánh sáng...')
    } else if (displayProgress < 72) {
      setLoadingText('Trang trí phòng...')
    } else if (displayProgress < 86) {
      setLoadingText('Biên dịch shader...')
    } else if (displayProgress < 99) {
      setLoadingText('Render frame đầu tiên...')
    } else {
      setLoadingText('Sẵn sàng! 🎉')
    }
  }, [displayProgress])

  // ── Chuyển sang welcome screen khi xong ──────────────────────────────────
  const isLoaded = displayProgress >= 99

  useEffect(() => {
    if (isLoaded && !showWelcome) {
      if (!playedSuccessRef.current) {
        playedSuccessRef.current = true
        playSuccess()
      }
      const welcomeTimer = setTimeout(() => setShowWelcome(true), 350)
      const hideTimer    = setTimeout(() => setHideAll(true), 5000)
      return () => {
        clearTimeout(welcomeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [isLoaded, showWelcome, playSuccess])
  
  if (hideAll) return null
  
  const roundedProgress = Math.round(displayProgress)
  
  return (
    <div className={`loading-screen ${showWelcome ? 'welcome-mode' : ''}`}>
      {/* Animated Background */}
      <div className="loading-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>
      
      {/* Loading State */}
      {!showWelcome && (
        <div className="loading-content">
          {/* Pixel Art Room Icon */}
          <div className="loading-icon-container">
            <div className="loading-icon"><Home size={48} /></div>
            <div className="loading-icon-glow"></div>
          </div>
          
          <h1 className="loading-title">Nghia's Room</h1>
          <p className="loading-subtitle">Interactive 3D Portfolio</p>
          
          {/* Progress Section */}
          <div className="loading-progress">
            <div className="loading-bar-container">
              <div 
                className="loading-bar" 
                style={{ width: `${roundedProgress}%` }}
              />
              <div className="loading-bar-shine"></div>
            </div>
            
            <div className="loading-info">
              <span className="loading-text">{loadingText}</span>
              <span className="loading-percent">{roundedProgress}%</span>
            </div>

            {/* Asset counter — chỉ hiện khi có assets drei thực */}
            {hasRealAssets && total > 0 && (
              <div className="loading-asset-info">
                <span className="loading-asset-count">{loaded}/{total} assets</span>
              </div>
            )}
          </div>
          
          {/* Loading Items Animation */}
          <div className="loading-items">
            <span className={roundedProgress >= 20 ? 'loaded' : ''}><Armchair size={20} /></span>
            <span className={roundedProgress >= 40 ? 'loaded' : ''}><Monitor size={20} /></span>
            <span className={roundedProgress >= 60 ? 'loaded' : ''}><Bed size={20} /></span>
            <span className={roundedProgress >= 80 ? 'loaded' : ''}><Leaf size={20} /></span>
            <span className={roundedProgress >= 100 ? 'loaded' : ''}><Cat size={20} /></span>
          </div>
        </div>
      )}
      
      {/* Welcome State */}
      {showWelcome && (
        <div className="welcome-content show">
          <div className="welcome-emoji"><Hand size={48} /></div>
          <h1 className="welcome-title">Chào mừng đến với</h1>
          <h2 className="welcome-name">Nghia's Room</h2>
          <p className="welcome-hint">Click vào các vật thể để khám phá!</p>
          <div className="welcome-icons">
            <span title="Projects"><FolderKanban size={24} /></span>
            <span title="Skills"><Sparkles size={24} /></span>
            <span title="Contact"><Mail size={24} /></span>
            <span title="Play"><Gamepad2 size={24} /></span>
          </div>
          <button className="welcome-enter" onClick={() => {
            playWhoosh()
            setHideAll(true)
          }}>
            Vào phòng →
          </button>
        </div>
      )}
      
      <div className="loading-tips">
        <p>{showWelcome ? 'Nhấn "Vào phòng" hoặc đợi...' : 'Đang tải trải nghiệm 3D...'}</p>
      </div>
      
      {/* Footer */}
      <div className="loading-footer">
        <span>Made with ❤️ by Nghia</span>
      </div>
    </div>
  )
}

export default LoadingScreen
