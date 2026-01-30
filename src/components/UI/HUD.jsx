import useStore from '../../store/useStore'
import './HUD.css'

/**
 * HUD - Heads Up Display
 * Hiển thị thông tin hover và hướng dẫn
 */
function HUD() {
  const hoveredObject = useStore((state) => state.hoveredObject)
  const isNightMode = useStore((state) => state.isNightMode)
  
  const getHoverText = () => {
    switch (hoveredObject) {
      case 'pc':
        return '💻 Click to view Projects'
      case 'board':
        return '📋 Click to view Skills'
      case 'tv':
        return '🎮 Click to view Playground'
      case 'bed':
        return '📱 Click to Contact'
      case 'window':
        return '🌙 Click to toggle Day/Night'
      case 'cat':
        return '🐱 Click me!'
      default:
        return null
    }
  }
  
  const hoverText = getHoverText()
  
  return (
    <>
      {/* Hover tooltip */}
      {hoverText && (
        <div className="hud-tooltip">
          {hoverText}
        </div>
      )}
      
      {/* Corner info */}
      <div className="hud-corner">
        <span className="hud-title">The Dev's Pixel Room</span>
        <span className="hud-subtitle">
          {isNightMode ? '🌙 Night Mode' : '☀️ Day Mode'}
        </span>
      </div>
      
      {/* Instructions */}
      <div className="hud-instructions">
        <span>🖱️ Drag to rotate</span>
        <span>🔍 Scroll to zoom</span>
        <span>👆 Click objects to explore</span>
      </div>
    </>
  )
}

export default HUD
