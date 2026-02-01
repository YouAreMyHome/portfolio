import { useProgress } from '@react-three/drei'
import { useEffect, useState, useRef } from 'react'
import { Home, Armchair, Monitor, Bed, Leaf, Cat, Hand, FolderKanban, Sparkles, Mail, Gamepad2 } from 'lucide-react'
import { useSounds } from '../../utils/useSounds'
import './LoadingScreen.css'

/**
 * LoadingScreen - Màn hình loading đẹp với welcome message
 */
function LoadingScreen() {
  const { progress, active, loaded, total } = useProgress()
  const { playSuccess, playWhoosh } = useSounds()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [hideAll, setHideAll] = useState(false)
  const [loadingText, setLoadingText] = useState('Khởi tạo...')
  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const playedSuccessRef = useRef(false)
  
  // Tính target progress - nếu không có assets thì dùng fake progress
  const hasAssets = total > 0
  const realProgress = hasAssets ? progress : 0
  
  // Animate progress smoothly với fake loading nếu không có assets
  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      
      setDisplayProgress(prev => {
        let targetProgress
        
        if (hasAssets) {
          // Có assets thực - dùng progress từ drei
          targetProgress = Math.min(100, Math.max(0, realProgress))
        } else {
          // Không có assets - fake progress trong 2.5 giây
          targetProgress = Math.min(100, (elapsed / 2500) * 100)
        }
        
        const diff = targetProgress - prev
        const step = Math.max(0.3, Math.abs(diff) * 0.1)
        
        if (Math.abs(diff) < 0.3) {
          return targetProgress
        }
        
        return prev + (diff > 0 ? step : -step)
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [realProgress, hasAssets])
  
  // Update loading text based on progress
  useEffect(() => {
    if (displayProgress < 15) {
      setLoadingText('Khởi tạo phòng...')
    } else if (displayProgress < 30) {
      setLoadingText('Đang tải nội thất...')
    } else if (displayProgress < 50) {
      setLoadingText('Thiết lập ánh sáng...')
    } else if (displayProgress < 70) {
      setLoadingText('Trang trí phòng...')
    } else if (displayProgress < 90) {
      setLoadingText('Hoàn thiện chi tiết...')
    } else {
      setLoadingText('Sẵn sàng!')
    }
  }, [displayProgress])
  
  // Check if fully loaded
  const isLoaded = displayProgress >= 99
  
  useEffect(() => {
    if (isLoaded && !showWelcome) {
      // Play success sound when loaded
      if (!playedSuccessRef.current) {
        playedSuccessRef.current = true
        playSuccess()
      }
      // Show welcome message after loading
      const welcomeTimer = setTimeout(() => setShowWelcome(true), 400)
      // Hide all after welcome animation
      const hideTimer = setTimeout(() => setHideAll(true), 5000)
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
