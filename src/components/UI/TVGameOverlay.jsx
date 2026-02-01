import { useEffect, useState, useCallback, useRef } from 'react'
import useStore from '../../store/useStore'
import './TVGame.css'

/**
 * Check if device is touch-capable
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * TVGameOverlay - Minimal HUD for TV game mode
 * 
 * Mobile: Swipe gestures + tap to action
 * Desktop: Keyboard controls hint
 */

function TVGameOverlay() {
  const activePanel = useStore((state) => state.activePanel)
  const closePanel = useStore((state) => state.closePanel)
  const isNightMode = useStore((state) => state.isNightMode)
  const [showTouch, setShowTouch] = useState(false)
  const [lastSwipe, setLastSwipe] = useState(null)
  
  // Touch tracking refs
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const swipeThreshold = 30 // minimum distance for swipe
  
  const isVisible = activePanel === 'playground'
  
  // Check for touch device
  useEffect(() => {
    setShowTouch(isTouchDevice())
  }, [])
  
  // Simulate key press
  const simulateKey = useCallback((key, type = 'down') => {
    const event = new KeyboardEvent(type === 'down' ? 'keydown' : 'keyup', {
      key: key,
      code: key === ' ' ? 'Space' : `Key${key.toUpperCase()}`,
      bubbles: true,
      cancelable: true
    })
    window.dispatchEvent(event)
  }, [])
  
  // Handle touch gestures on the entire screen
  useEffect(() => {
    if (!isVisible || !showTouch) return
    
    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }
    }
    
    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time
      
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      
      // Quick tap = action (Space/Enter)
      if (absX < 10 && absY < 10 && deltaTime < 200) {
        simulateKey(' ', 'down')
        setTimeout(() => simulateKey(' ', 'up'), 50)
        setLastSwipe('TAP')
        setTimeout(() => setLastSwipe(null), 300)
        return
      }
      
      // Swipe detection
      if (absX > swipeThreshold || absY > swipeThreshold) {
        let direction = null
        
        if (absX > absY) {
          // Horizontal swipe
          direction = deltaX > 0 ? 'ArrowRight' : 'ArrowLeft'
          setLastSwipe(deltaX > 0 ? '→' : '←')
        } else {
          // Vertical swipe
          direction = deltaY > 0 ? 'ArrowDown' : 'ArrowUp'
          setLastSwipe(deltaY > 0 ? '↓' : '↑')
        }
        
        if (direction) {
          simulateKey(direction, 'down')
          setTimeout(() => simulateKey(direction, 'up'), 50)
          setTimeout(() => setLastSwipe(null), 300)
        }
      }
    }
    
    // Add listeners to document for full-screen gestures
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isVisible, showTouch, simulateKey])
  
  // Handle escape key to close
  useEffect(() => {
    if (!isVisible) return
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePanel()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, closePanel])
  
  if (!isVisible) return null
  
  return (
    <>
      {/* Desktop HUD */}
      {!showTouch && (
        <div className={`tv-game-hud ${isNightMode ? 'dark' : ''}`}>
          <div className="tv-game-controls">
            <div className="control-hint">
              <span className="key">↑↓←→</span> or <span className="key">WASD</span> Move
            </div>
            <div className="control-hint">
              <span className="key">SPACE</span> Start / Pause
            </div>
            <div className="control-hint">
              <span className="key">ESC</span> Exit Game
            </div>
          </div>
          <button className="tv-exit-btn" onClick={closePanel}>
            ✕ Exit
          </button>
        </div>
      )}
      
      {/* Mobile Touch UI - Gesture based */}
      {showTouch && (
        <>
          {/* Swipe indicator */}
          {lastSwipe && (
            <div className="swipe-indicator">
              {lastSwipe}
            </div>
          )}
          
          {/* Touch hint - shows briefly */}
          <div className="touch-gesture-hint">
            <div className="gesture-icon">↑</div>
            <div className="gesture-text">
              <span>Vuốt để di chuyển</span>
              <span>Chạm để bắt đầu/nhảy</span>
            </div>
          </div>
          
          {/* Exit button - always visible */}
          <button className="touch-exit-btn" onClick={closePanel}>
            ✕
          </button>
        </>
      )}
    </>
  )
}

export default TVGameOverlay
