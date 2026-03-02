import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Move, ZoomIn, MousePointer, Map } from 'lucide-react'
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
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)
  
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
        return 'Khởi động máy tính'
      case 'board':
        return 'Kỹ năng & Công nghệ'
      case 'planboard':
        return 'Kế hoạch của mình'
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
        return 'Mấy giờ rồi tarr??'
      case 'books':
        return 'Mở Tủ Sách'
      case 'polaroid':
        return 'Xem ảnh kỷ niệm'
      case 'lightswitch':
        return 'Bật/Tắt đèn dây'
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
        <h1 className="hud-title" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>Nghia's Room</h1>
        <h2 className="hud-subtitle" style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
          {isNightMode ? 'Night mode' : 'Day mode'}
        </h2>
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
      
      {/* Navigation Menu */}
      <div className={`hud-navigation ${isNightMode ? 'dark' : ''}`}>
        <button className="nav-toggle" onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}>
          <Map size={20} /> <span className="nav-text">Điều hướng</span>
        </button>
        <div className={`nav-menu ${isNavMenuOpen ? 'open' : ''}`}>
          <div className="nav-item" onClick={() => useStore.getState().setActivePanel('projects')}>💻 Projects</div>
          <div className="nav-item" onClick={() => useStore.getState().setActivePanel('skills')}>🛠 Skills</div>
          <div className="nav-item" onClick={() => useStore.getState().setActivePanel('about')}>👨‍💻 About</div>
          <div className="nav-item" onClick={() => useStore.getState().setActivePanel('contact')}>📱 Contact</div>
          <div className="nav-item" onClick={() => useStore.getState().setActivePanel('blog')}>📚 Books</div>
        </div>
      </div>

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
