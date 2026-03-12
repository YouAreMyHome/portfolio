import { useEffect, useRef } from 'react'
import { Volume2, VolumeX, Move, ZoomIn, MousePointer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const next = i18n.language === 'vi' ? 'en' : 'vi'
    i18n.changeLanguage(next)
  }
  
  // Play hover sound when hovering new object
  useEffect(() => {
    if (hoveredObject && hoveredObject !== prevHovered.current) {
      playHover()
    }
    prevHovered.current = hoveredObject
  }, [hoveredObject, playHover])
  
  const getHoverText = () => {
    switch (hoveredObject) {
      case 'pc':        return t('hud.hover.pc')
      case 'board':     return t('hud.hover.board')
      case 'planboard': return t('hud.hover.planboard')
      case 'tv':        return t('hud.hover.tv')
      case 'bed':       return t('hud.hover.bed')
      case 'chair':     return t('hud.hover.chair')
      case 'window':    return isNightMode ? t('hud.hover.window_night') : t('hud.hover.window_day')
      case 'cat':       return t('hud.hover.cat')
      case 'recordplayer': return isRecordPlaying ? t('hud.hover.record_playing') : t('hud.hover.record_idle')
      case 'clock':     return t('hud.hover.clock')
      case 'books':     return t('hud.hover.books')
      case 'polaroid':  return t('hud.hover.polaroid')
      case 'lightswitch': return t('hud.hover.lightswitch')
      default:          return null
    }
  }
  
  const hoverText = getHoverText()
  const isVI = i18n.language === 'vi'
  
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
        <span className="hud-title">{t('hud.title')}</span>
        <span className="hud-subtitle">
          {isNightMode ? t('hud.night') : t('hud.day')}
        </span>
      </div>
      
      {/* Top-right controls */}
      <div className={`hud-top-right ${isNightMode ? 'dark-mode' : ''}`}>
        {/* Language toggle */}
        <button
          className="hud-lang-toggle"
          onClick={toggleLanguage}
          title={isVI ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          aria-label="Toggle language"
        >
          <span className={isVI ? '' : 'active'}>EN</span>
          <span className="hud-lang-sep">|</span>
          <span className={isVI ? 'active' : ''}>VI</span>
        </button>

        {/* Sound toggle */}
        <button 
          className="hud-sound-toggle"
          onClick={() => {
            playClick()
            toggleMute()
          }}
          title={isMuted ? t('hud.sound.on') : t('hud.sound.off')}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      
      {/* Instructions - hide on touch devices */}
      {!isTouchDevice && (
        <div className={`hud-instructions ${isNightMode ? 'dark' : ''}`}>
          <span><Move size={14} /> {t('hud.instructions.drag')}</span>
          <span><ZoomIn size={14} /> {t('hud.instructions.scroll')}</span>
          <span><MousePointer size={14} /> {t('hud.instructions.click')}</span>
        </div>
      )}
    </>
  )
}

export default HUD
