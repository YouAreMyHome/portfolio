import { useEffect, useRef, useState } from 'react'
import {
  Volume2,
  VolumeX,
  Move,
  ZoomIn,
  MousePointer,
  Sun,
  Sunset,
  CloudRain,
  Moon,
  ChevronDown,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { useSounds, useSoundStore } from '../../utils/useSounds'
import './HUD.css'

/**
 * HUD - Heads Up Display (Redesigned)
 * Clean, minimal HUD with only essential controls:
 * - Lighting presets
 * - Language toggle
 * - Sound toggle
 */
function HUD({ isTouchDevice = false }) {
  const hoveredObject = useStore((state) => state.hoveredObject)
  const isNightMode = useStore((state) => state.isNightMode)
  const isRecordPlaying = useStore((state) => state.isRecordPlaying)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const setLightingPreset = useStore((state) => state.setLightingPreset)
  const hasEnteredRoom = useStore((state) => state.hasEnteredRoom)
  const showWelcome = useStore((state) => state.showWelcome)

  const { isMuted, toggleMute } = useSoundStore()
  const { playHover, playClick } = useSounds()
  const prevHovered = useRef(null)
  const { t, i18n } = useTranslation()

  const [presetOpen, setPresetOpen] = useState(false)
  const presetRef = useRef(null)

  const currentLang = (i18n.language || 'vi').startsWith('vi') ? 'vi' : 'en'
  const isVI = currentLang === 'vi'

  const toggleLanguage = () => {
    const next = isVI ? 'en' : 'vi'
    i18n.changeLanguage(next)
    playClick()
  }

  // Close preset dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (presetRef.current && !presetRef.current.contains(e.target)) {
        setPresetOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        return t('hud.hover.pc')
      case 'board':
        return t('hud.hover.board')
      case 'planboard':
        return t('hud.hover.planboard')
      case 'tv':
        return t('hud.hover.tv')
      case 'bed':
        return t('hud.hover.bed')
      case 'chair':
        return t('hud.hover.chair')
      case 'window':
        return isNightMode
          ? t('hud.hover.window_night')
          : t('hud.hover.window_day')
      case 'cat':
        return t('hud.hover.cat')
      case 'recordplayer':
        return isRecordPlaying
          ? t('hud.hover.record_playing')
          : t('hud.hover.record_idle')
      case 'clock':
        return t('hud.hover.clock')
      case 'books':
        return t('hud.hover.books')
      case 'polaroid':
        return t('hud.hover.polaroid')
      case 'lightswitch':
        return t('hud.hover.lightswitch')
      default:
        return null
    }
  }

  const hoverText = getHoverText()
  const activePreset = isNightMode ? 'night' : lightingPreset || 'morning'
  const isDark = isNightMode || activePreset === 'rainy' || activePreset === 'sunset'

  const presetList = [
    { id: 'morning', label: t('hud.preset.morning', 'Morning'), emoji: '☀️', icon: Sun },
    { id: 'sunset', label: t('hud.preset.sunset', 'Sunset'), emoji: '🌇', icon: Sunset },
    { id: 'rainy', label: t('hud.preset.rainy', 'Rainy'), emoji: '🌧️', icon: CloudRain },
    { id: 'night', label: t('hud.preset.night', 'Night'), emoji: '🌙', icon: Moon },
  ]

  const currentPreset = presetList.find((p) => p.id === activePreset) || presetList[0]

  if (showWelcome || !hasEnteredRoom) return null

  return (
    <>
      {/* Hover tooltip */}
      {hoverText && (
        <div className={`hud-tooltip ${isDark ? 'dark' : ''}`}>
          <span className="hud-tooltip-dot" />
          {hoverText}
        </div>
      )}

      {/* Top-left branding */}
      <div className={`hud-brand ${isDark ? 'dark' : ''}`}>
        <span className="hud-brand-name">{t('hud.title')}</span>
        <span className="hud-brand-mood">
          {currentPreset.emoji} {currentPreset.label}
        </span>
      </div>

      {/* Top-right controls — clean & minimal */}
      <div className={`hud-controls ${isDark ? 'dark' : ''}`}>
        {/* Ambient Preset Picker */}
        <div className="hud-preset-wrapper" ref={presetRef}>
          <button
            className={`hud-btn hud-preset-trigger ${presetOpen ? 'active' : ''}`}
            onClick={() => {
              playClick()
              setPresetOpen(!presetOpen)
            }}
            aria-label="Change lighting"
            title={currentPreset.label}
          >
            <currentPreset.icon size={16} />
            <ChevronDown size={12} className={`hud-chevron ${presetOpen ? 'open' : ''}`} />
          </button>

          {presetOpen && (
            <div className="hud-preset-dropdown">
              {presetList.map((p) => {
                const Icon = p.icon
                const isActive = activePreset === p.id
                return (
                  <button
                    key={p.id}
                    className={`hud-preset-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      playClick()
                      setLightingPreset(p.id)
                      setPresetOpen(false)
                    }}
                  >
                    <Icon size={14} />
                    <span>{p.label}</span>
                    {isActive && <span className="hud-preset-check">✓</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Language toggle */}
        <button
          className="hud-btn hud-lang"
          onClick={toggleLanguage}
          title={isVI ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          aria-label="Toggle language"
        >
          <span className="hud-lang-flag">{isVI ? '🇻🇳' : '🇬🇧'}</span>
          <span className="hud-lang-code">{isVI ? 'VI' : 'EN'}</span>
        </button>

        {/* Sound toggle */}
        <button
          className="hud-btn hud-sound"
          onClick={() => {
            playClick()
            toggleMute()
          }}
          title={isMuted ? t('hud.sound.on') : t('hud.sound.off')}
          aria-label="Toggle sound"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Bottom-left instructions — desktop only */}
      {!isTouchDevice && (
        <div className={`hud-hints ${isDark ? 'dark' : ''}`}>
          <div className="hud-hint">
            <Move size={12} />
            <span>{t('hud.instructions.drag')}</span>
          </div>
          <div className="hud-hint">
            <ZoomIn size={12} />
            <span>{t('hud.instructions.scroll')}</span>
          </div>
          <div className="hud-hint">
            <MousePointer size={12} />
            <span>{t('hud.instructions.click')}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default HUD
