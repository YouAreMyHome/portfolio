/**
 * Portfolio OS - Main Desktop Coordinator
 * Windows 95 inspired portfolio operating system
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Monitor,
  FolderOpen,
  Terminal,
  FileText,
  Trash2,
  Sliders,
  Power,
  Volume2,
  LayoutGrid,
} from 'lucide-react'
import { DESKTOP_ICONS } from './osConfig'
import useStore from '../../store/useStore'
import OSWindow from './OSWindow'
import TerminalApp from './apps/TerminalApp'
import SkillsApp from './apps/SkillsApp'
import ProjectsApp from './apps/ProjectsApp'
import AboutApp from './apps/AboutApp'
import RecycleApp from './apps/RecycleApp'
import './PortfolioOS.css'

// Icon mapping for desktop icons (Lucide React)
const ICON_MAP = {
  'my-computer': <Monitor size={32} />,
  'my-projects': <FolderOpen size={32} />,
  terminal: <Terminal size={32} />,
  'about-me': <FileText size={32} />,
  'recycle-bin': <Trash2 size={32} />,
  'admin-console': <Sliders size={32} />,
}

// Small icons for taskbar/menus
const ICON_MAP_SMALL = {
  'my-computer': <Monitor size={16} />,
  'my-projects': <FolderOpen size={16} />,
  terminal: <Terminal size={16} />,
  'about-me': <FileText size={16} />,
  'recycle-bin': <Trash2 size={16} />,
  'admin-console': <Sliders size={16} />,
}

function PortfolioOS({ onExit }) {
  const [windows, setWindows] = useState([])
  const [activeWindowId, setActiveWindowId] = useState(null)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Window counter for unique IDs
  const windowCounter = useRef(0)

  const openApp = useCallback(
    (appId) => {
      setShowStartMenu(false)

      // Check if already open
      const existingWindow = windows.find((w) => w.appId === appId && !w.isMinimized)
      if (existingWindow) {
        setActiveWindowId(existingWindow.id)
        return
      }

      // App configurations
      const appConfigs = {
        skills: { title: 'My Computer', icon: '▣', size: { width: 500, height: 450 } },
        projects: { title: 'My Projects', icon: '□', size: { width: 550, height: 450 } },
        terminal: { title: 'Terminal', icon: '■', size: { width: 650, height: 400 } },
        about: { title: 'About Me.txt', icon: '≡', size: { width: 450, height: 400 } },
        recycle: { title: 'Recycle Bin', icon: '✘', size: { width: 450, height: 380 } },
      }

      const config = appConfigs[appId]
      if (!config) return

      const newWindow = {
        id: `window-${++windowCounter.current}`,
        appId,
        ...config,
        position: {
          x: 100 + ((windows.length * 30) % 200),
          y: 50 + ((windows.length * 30) % 150),
        },
        isMinimized: false,
        isMaximized: false,
      }

      setWindows((prev) => [...prev, newWindow])
      setActiveWindowId(newWindow.id)
    },
    [windows]
  )

  const closeWindow = useCallback(
    (windowId) => {
      setWindows((prev) => prev.filter((w) => w.id !== windowId))
      if (activeWindowId === windowId) {
        setActiveWindowId(windows.length > 1 ? windows[windows.length - 2]?.id : null)
      }
    },
    [activeWindowId, windows]
  )

  const minimizeWindow = useCallback((windowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    )
  }, [])

  const maximizeWindow = useCallback((windowId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w))
    )
  }, [])

  const focusWindow = useCallback((windowId) => {
    setActiveWindowId(windowId)
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: false } : w))
    )
  }, [])

  const dragWindow = useCallback((windowId, newPosition) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, position: newPosition } : w))
    )
  }, [])

  const openAdmin = useStore((state) => state.openAdmin)

  const handleIconDoubleClick = (icon) => {
    if (icon.app === 'admin') {
      openAdmin()
      return
    }
    openApp(icon.app)
  }

  // Detect touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleIconClick = (e, icon) => {
    e.stopPropagation()
    if (isTouchDevice) {
      if (selectedIcon === icon.id) {
        handleIconDoubleClick(icon)
      } else {
        setSelectedIcon(icon.id)
      }
    } else {
      setSelectedIcon(icon.id)
    }
  }

  const renderWindowContent = (appId) => {
    switch (appId) {
      case 'skills':
        return <SkillsApp />
      case 'projects':
        return <ProjectsApp />
      case 'terminal':
        return <TerminalApp />
      case 'about':
        return <AboutApp />
      case 'recycle':
        return <RecycleApp />
      default:
        return null
    }
  }

  return (
    <div className="portfolio-os" onClick={() => setShowStartMenu(false)}>
      {/* Desktop */}
      <div className="os-desktop" onClick={() => setSelectedIcon(null)}>
        {DESKTOP_ICONS.map((icon) => (
          <div
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
            onClick={(e) => handleIconClick(e, icon)}
            onDoubleClick={() => handleIconDoubleClick(icon)}
          >
            <span className="icon-image">{ICON_MAP[icon.id] || icon.icon}</span>
            <span className="icon-name">{icon.name}</span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <OSWindow
          key={win.id}
          id={win.id}
          title={win.title}
          icon={win.icon}
          position={win.position}
          size={win.size}
          isActive={activeWindowId === win.id}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => maximizeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          onDrag={dragWindow}
        >
          {renderWindowContent(win.appId)}
        </OSWindow>
      ))}

      {/* Start Menu */}
      {showStartMenu && (
        <div className="start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-header">
            Portfolio
            <br />
            OS
          </div>
          <div className="start-menu-items">
            {DESKTOP_ICONS.map((icon) => (
              <div key={icon.id} className="start-menu-item" onClick={() => openApp(icon.app)}>
                <span className="menu-icon">{ICON_MAP_SMALL[icon.id] || icon.icon}</span>
                <span>{icon.name}</span>
              </div>
            ))}
            <div className="start-menu-divider" />
            <div className="start-menu-item" onClick={onExit}>
              <span className="menu-icon">
                <Power size={16} />
              </span>
              <span>Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="os-taskbar">
        <button
          className="start-button"
          onClick={(e) => {
            e.stopPropagation()
            setShowStartMenu(!showStartMenu)
          }}
        >
          <span className="start-icon">
            <LayoutGrid size={16} />
          </span>
          Start
        </button>

        <div className="taskbar-items">
          {windows.map((win) => (
            <div
              key={win.id}
              className={`taskbar-item ${activeWindowId === win.id && !win.isMinimized ? 'active' : ''}`}
              onClick={() => focusWindow(win.id)}
            >
              <span className="task-icon">{win.icon}</span>
              <span>{win.title}</span>
            </div>
          ))}
        </div>

        <div className="system-tray">
          <span>
            <Volume2 size={16} />
          </span>
          <span className="tray-time">
            {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PortfolioOS
