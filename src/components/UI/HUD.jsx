import { useEffect, useRef } from 'react'
import { Volume2, VolumeX, Move, ZoomIn, MousePointer } from 'lucide-react'
import useStore from '../../store/useStore'
import { useSounds, useSoundStore } from '../../utils/useSounds'
import './HUD.css'

/**
 * HUD - Heads Up Display
 * Hiển thị thông tin hover và hướng dẫn
 */
function HUD({ isTouchDevice = false }) {
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
        return 'Xem Projects của mình'
      case 'board':
        return 'Kỹ năng & Công nghệ'
      case 'tv':
        return 'Chơi game thư giãn'
      case 'bed':
        return 'Liên hệ với mình'
      case 'chair':
        return 'Tìm hiểu về mình'
      case 'window':
        return isNightMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'
      case 'cat':
        return 'Meo meo~'
      case 'recordplayer':
        return isRecordPlaying ? 'Đang phát nhạc...' : 'Nghe nhạc cùng mình'
      case 'clock':
        return 'Xem giờ hiện tại'
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
        <span className="hud-title">Nghia's Room</span>
        <span className="hud-subtitle">
          {isNightMode ? 'Night mode' : 'Day mode'}
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
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      
      {/* Instructions - hide on touch devices */}
      {!isTouchDevice && (
        <div className={`hud-instructions ${isNightMode ? 'dark' : ''}`}>
          <span><Move size={14} /> Kéo để xoay</span>
          <span><ZoomIn size={14} /> Cuộn để zoom</span>
          <span><MousePointer size={14} /> Nhấn vào vật thể</span>
        </div>
      )}
    </>
  )
}

export default HUD
