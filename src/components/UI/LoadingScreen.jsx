import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import './LoadingScreen.css'

/**
 * LoadingScreen - Màn hình loading với progress bar
 */
function LoadingScreen() {
  const { progress, active } = useProgress()
  const [show, setShow] = useState(true)
  
  useEffect(() => {
    if (!active && progress === 100) {
      // Delay hide để transition mượt
      const timer = setTimeout(() => setShow(false), 500)
      return () => clearTimeout(timer)
    }
  }, [active, progress])
  
  if (!show) return null
  
  return (
    <div className={`loading-screen ${!active ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-icon">🏠</div>
        <h1 className="loading-title">The Dev's Pixel Room</h1>
        <div className="loading-bar-container">
          <div 
            className="loading-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="loading-text">
          {progress < 100 ? 'Loading assets...' : 'Ready!'}
        </p>
        <p className="loading-percent">{Math.round(progress)}%</p>
      </div>
      
      <div className="loading-tips">
        <p>💡 Tip: Click on objects to explore!</p>
      </div>
    </div>
  )
}

export default LoadingScreen
