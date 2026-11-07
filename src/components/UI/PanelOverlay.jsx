import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'
import { Cat, PartyPopper } from 'lucide-react'
import { PortfolioOS } from '../PortfolioOS'
import {
  ProjectsPanel,
  SkillsPanel,
  BooksPanel,
  AboutPanel,
  ContactPanel,
} from '../Panels'
import './Panels.css'

/**
 * PanelOverlay - Modal manager for Portfolio panels
 * Uses Compound / Container-Presenter design pattern.
 * Seamless Camera-to-OS transition delay (Henry Heffernan style)
 */
function PanelOverlay() {
  const activePanel = useStore((state) => state.activePanel)
  const closePanel = useStore((state) => state.closePanel)
  const showEasterEgg = useStore((state) => state.showEasterEgg)
  const isNightMode = useStore((state) => state.isNightMode)
  const { playClick } = useSounds()
  const [osReady, setOsReady] = useState(false)

  // Đợi camera Dolly Zoom áp sát vào màn hình PC trước khi hiển thị PortfolioOS
  useEffect(() => {
    if (activePanel === 'projects') {
      const timer = setTimeout(() => setOsReady(true), 320)
      return () => clearTimeout(timer)
    } else {
      setOsReady(false)
    }
  }, [activePanel])

  // TVGameOverlay handles 'playground'
  if (activePanel === 'playground') return null

  // Portfolio OS for projects - renders sau nhịp zoom máy quay điện ảnh
  if (activePanel === 'projects') {
    if (!osReady) return null
    return <PortfolioOS onExit={closePanel} />
  }

  if (!activePanel && !showEasterEgg) return null

  const handleClose = () => {
    playClick()
    closePanel()
  }

  // Easter Egg display
  if (showEasterEgg) {
    return (
      <div className="easter-egg-overlay">
        <div className="easter-egg-content">
          <span className="easter-egg-emoji">
            <Cat size={64} />
          </span>
          <p>
            Meow! You found me!{' '}
            <PartyPopper size={20} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </p>
        </div>
      </div>
    )
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'skills':
        return <SkillsPanel />
      case 'contact':
        return <ContactPanel />
      case 'about':
        return <AboutPanel />
      case 'blog':
        return <BooksPanel />
      default:
        return null
    }
  }

  return (
    <div className="panel-overlay" onClick={handleClose}>
      <div
        className={`panel-container ${isNightMode ? 'dark' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="panel-close" onClick={handleClose} aria-label="Close">
          ×
        </button>
        <div className="panel-scroll-content">{renderPanel()}</div>
      </div>
    </div>
  )
}

export default PanelOverlay
