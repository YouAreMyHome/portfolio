import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import { useSounds, useSoundStore } from '../../utils/useSounds'
import './HUD.css'

/**
 * HUD - Heads Up Display
 * Hiển thị thông tin hover và hướng dẫn
 */
function HUD() {
  const hoveredObject = useStore((state) => state.hoveredObject)
  const isNightMode = useStore((state) => state.isNightMode)
  const isRecordPlaying = useStore((state) => state.isRecordPlaying)
  const { isMuted, toggleMute } = useSoundStore()
  const { playHover, playClick } = useSounds()
  const prevHovered = useRef(null)
  
  // Play hover sound when hovering new object
  useEffect(() => {
    if (hoveredObject && hoveredObject !== prevHovered.current) {
      playHover()
    }
    prevHovered.current = hoveredObject
  }, [hoveredObject, playHover])
  
  const getHoverText = () => {
    switch (hoveredObject) {
      case 'pc':
        return '💻 Xem Projects'
      case 'board':
        return '📋 Xem Skills'
      case 'tv':
        return '🎮 Playground'
      case 'bed':
        return '📬 Liên hệ'
      case 'chair':
        return '🪑 Về tôi'
      case 'window':
        return isNightMode ? '☀️ Bật chế độ ngày' : '🌙 Bật chế độ đêm'
      case 'cat':
        return '🐱 Meow!'
      case 'recordplayer':
        return isRecordPlaying ? '🎵 Đang phát nhạc' : '🎵 Mở Music Player'
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
      <div className={`hud-corner ${isNightMode ? 'dark' : ''}`}>
        <span className="hud-title">Nghia&apos;s Room</span>
        <span className="hud-subtitle">
          {isNightMode ? '🌙 Chế độ đêm' : '☀️ Chế độ ngày'}
        </span>
      </div>
      
      {/* Sound toggle */}
      <button 
        className={`hud-sound-toggle ${isNightMode ? 'dark-mode' : ''}`}
        onClick={() => {
          playClick()
          toggleMute()
        }}
        title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      
      {/* Instructions */}
      <div className={`hud-instructions ${isNightMode ? 'dark' : ''}`}>
        <span>🖱️ Kéo để xoay</span>
        <span>🔍 Cuộn để zoom</span>
        <span>👆 Nhấn vào vật thể</span>
      </div>
    </>
  )
}

export default HUD
