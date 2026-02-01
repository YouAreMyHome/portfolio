import { useEffect } from 'react'
import useStore from '../../store/useStore'
import './TVGame.css'

/**
 * TVGameOverlay - Minimal HUD for TV game mode
 * 
 * Shows only a small hint overlay, game is rendered on the TV itself
 */

function TVGameOverlay() {
  const activePanel = useStore((state) => state.activePanel)
  const closePanel = useStore((state) => state.closePanel)
  const isNightMode = useStore((state) => state.isNightMode)
  
  const isVisible = activePanel === 'playground'
  
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
    <div className={`tv-game-hud ${isNightMode ? 'dark' : ''}`}>
      {/* Controls hint */}
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
      
      {/* Exit button */}
      <button className="tv-exit-btn" onClick={closePanel}>
        ✕ Exit
      </button>
    </div>
  )
}

export default TVGameOverlay
