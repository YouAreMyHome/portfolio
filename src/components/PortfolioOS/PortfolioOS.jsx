/**
 * Portfolio OS - Main Component
 * 
 * Windows 95 inspired portfolio operating system
 */

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IMAGES } from '../../data/images'
import { 
  Monitor, FolderOpen, Terminal, FileText, Trash2,
  Palette, Server, Wrench, Star, Square, FolderSearch, Info,
  User, Sparkles, Mail, Github, Linkedin, MapPin,
  Power, Volume2, LayoutGrid
} from 'lucide-react'
import { DESKTOP_ICONS, RECYCLED_PROJECTS, TERMINAL_COMMANDS, TERMINAL_WELCOME, OS_THEME } from './osConfig'
import { personalInfo, aboutMe, skills, projects } from '../../data/portfolio'
import './PortfolioOS.css'

// Icon mapping for desktop icons (Lucide React)
const ICON_MAP = {
  'my-computer': <Monitor size={32} />,
  'my-projects': <FolderOpen size={32} />,
  'terminal': <Terminal size={32} />,
  'about-me': <FileText size={32} />,
  'recycle-bin': <Trash2 size={32} />,
}

// Small icons for taskbar/menus
const ICON_MAP_SMALL = {
  'my-computer': <Monitor size={16} />,
  'my-projects': <FolderOpen size={16} />,
  'terminal': <Terminal size={16} />,
  'about-me': <FileText size={16} />,
  'recycle-bin': <Trash2 size={16} />,
}

// ========== WINDOW COMPONENT ==========
function Window({ id, title, icon, children, position, size, isActive, isMinimized, isMaximized, onClose, onMinimize, onMaximize, onFocus, onDrag }) {
  const windowRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Mouse drag start
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    onFocus()
  }
  
  // Touch drag start
  const handleTouchStart = (e) => {
    if (e.target.closest('.window-controls')) return
    const touch = e.touches[0]
    setIsDragging(true)
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    })
    onFocus()
  }
  
  useEffect(() => {
    if (!isDragging) return
    
    const handleMouseMove = (e) => {
      onDrag(id, {
        x: Math.max(0, e.clientX - dragOffset.x),
        y: Math.max(0, e.clientY - dragOffset.y)
      })
    }
    
    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      onDrag(id, {
        x: Math.max(0, touch.clientX - dragOffset.x),
        y: Math.max(0, touch.clientY - dragOffset.y)
      })
    }
    
    const handleEnd = () => setIsDragging(false)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleEnd)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, dragOffset, id, onDrag])
  
  if (isMinimized) return null
  
  return (
    <div 
      ref={windowRef}
      className={`os-window ${isMaximized ? 'maximized' : ''}`}
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 40px)' : size.height,
        zIndex: isActive ? 200 : 100,
      }}
      onClick={onFocus}
    >
      <div 
        className={`window-titlebar ${isActive ? '' : 'inactive'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <span className="window-icon">{icon}</span>
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button className="window-control" onClick={onMinimize}>_</button>
          <button className="window-control" onClick={onMaximize}>{isMaximized ? '❐' : '□'}</button>
          <button className="window-control" onClick={onClose}>×</button>
        </div>
      </div>
      {children}
    </div>
  )
}

// ========== TERMINAL APP ==========
function TerminalApp() {
  const [history, setHistory] = useState([{ type: 'success', content: TERMINAL_WELCOME }])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showHack, setShowHack] = useState(false)
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])
  
  const executeCommand = (cmd) => {
    const parts = cmd.trim().split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
    
    // Add to history
    setHistory(prev => [...prev, { type: 'input', content: `nghia@portfolio:~$ ${cmd}` }])
    
    if (!command) return
    
    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)
    
    const handler = TERMINAL_COMMANDS[command]
    if (handler) {
      const result = handler.execute(args)
      
      if (result.type === 'clear') {
        setHistory([])
      } else if (result.type === 'matrix') {
        setShowMatrix(true)
        setTimeout(() => setShowMatrix(false), 5000)
      } else if (result.type === 'hack') {
        setShowHack(true)
        setTimeout(() => setShowHack(false), 3000)
      } else {
        setHistory(prev => [...prev, result])
      }
    } else {
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: `Command not found: ${command}. Type 'help' for available commands.`
      }])
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Simple autocomplete
      const commands = Object.keys(TERMINAL_COMMANDS)
      const match = commands.find(c => c.startsWith(input))
      if (match) setInput(match)
    }
  }
  
  return (
    <div className="window-content terminal-content" onClick={() => inputRef.current?.focus()}>
      {showMatrix && (
        <div className="matrix-overlay">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="matrix-column"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {'01'.repeat(50).split('').map((c, j) => (
                <span key={j} style={{ opacity: Math.random() }}>{Math.random() > 0.5 ? '1' : '0'}</span>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {showHack && (
        <div className="hack-overlay">
          <div className="hack-text">
            ACCESS GRANTED<br/>
            Welcome back, {personalInfo.name}<br/>
            <br/>
            System unlocked<br/>
            <br/>
            Just kidding, this is just a portfolio
          </div>
        </div>
      )}
      
      <div className="terminal-output" ref={outputRef}>
        {history.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.content}
          </div>
        ))}
      </div>
      <div className="terminal-input-line">
        <span className="terminal-prompt">nghia@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}

// ========== SKILLS APP (MY COMPUTER) ==========
function SkillsApp() {
  const categories = [
    { key: 'frontend', label: 'Frontend', icon: <Palette size={16} /> },
    { key: 'backend', label: 'Backend', icon: <Server size={16} /> },
    { key: 'tools', label: 'Tools', icon: <Wrench size={16} /> },
  ]
  
  return (
    <>
      <div className="window-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="window-content">
        <div className="skills-content">
          <div className="skills-header">
            <span style={{ fontSize: 32 }}><Monitor /></span>
            <h2>My Computer - Technical Skills</h2>
          </div>
          
          {categories.map(cat => (
            <div key={cat.key} className="skill-category">
              <h3>{cat.icon} {cat.label}</h3>
              {skills[cat.key]?.map(skill => (
                <div key={skill.name} className="skill-row">
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-bar-container">
                    <div 
                      className="skill-bar-fill" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="skill-level">{skill.level}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="window-statusbar">
        <span className="statusbar-item">{Object.values(skills).flat().length} skills</span>
        <span className="statusbar-item">Ready</span>
      </div>
    </>
  )
}

// ========== PROJECTS APP ==========
function ProjectsApp() {
  const [selectedProject, setSelectedProject] = useState(null)
  const { i18n } = useTranslation()
  const lf = (vi, en) => i18n.language === 'en' && en ? en : vi
  
  return (
    <>
      <div className="window-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="projects-toolbar">
        <button className="toolbar-btn"><FolderOpen size={14} /> Open</button>
        <button className="toolbar-btn"><FolderSearch size={14} /> Find</button>
        <button className="toolbar-btn"><Info size={14} /> Details</button>
      </div>
      <div className="window-content">
        <div className="projects-content">
          <div className="projects-list">
            {projects.map(project => (
              <div 
                key={project.id}
                className={`project-item ${selectedProject === project.id ? 'selected' : ''}`}
                onClick={() => setSelectedProject(project.id)}
                onDoubleClick={() => project.demo && window.open(project.demo, '_blank')}
              >
                <span className="project-icon">{project.featured ? <Star size={20} /> : <Square size={20} />}</span>
                <div className="project-info">
                  <h4>{project.title}</h4>
                  <p>{lf(project.description, project.descriptionEn)}</p>
                  <div className="project-tags">
                    {project.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="window-statusbar">
        <span className="statusbar-item">{projects.length} projects</span>
        <span className="statusbar-item">{selectedProject ? lf('Double-click để mở demo', 'Double-click to open demo') : lf('Chọn một dự án', 'Select a project')}</span>
      </div>
    </>
  )
}

// ========== ABOUT APP ==========
function AboutApp() {
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const { i18n } = useTranslation()
  const lf = (vi, en) => i18n.language === 'en' && en ? en : vi
  
  return (
    <div className="window-content">
      <div className="about-content">
        <div className="about-header">
          <img 
            src={IMAGES.avatar}
            alt={personalInfo.name} 
            className="about-avatar clickable" 
            onClick={() => setShowAvatarModal(true)}
            title="Click to view full image"
          />
          <div className="about-name">
            <h2>{personalInfo.name}</h2>
            <p>{lf(personalInfo.title, personalInfo.titleEn)}</p>
            <p style={{ color: '#000080' }}>{lf(personalInfo.tagline, personalInfo.taglineEn)}</p>
          </div>
        </div>
        
        <div className="about-section">
          <h3><User size={16} /> {lf('Giới thiệu', 'About')}</h3>
          <p>{lf(aboutMe.intro, aboutMe.introEn)}</p>
          <p>{lf(aboutMe.description, aboutMe.descriptionEn)}</p>
        </div>
        
        <div className="about-section">
          <h3><Sparkles size={16} /> {lf('Điểm nổi bật', 'Highlights')}</h3>
          <ul className="about-list">
            {(lf(aboutMe.highlights, aboutMe.highlightsEn) || aboutMe.highlights).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
        
        <div className="about-section">
          <h3><Mail size={16} /> {lf('Liên hệ', 'Contact')}</h3>
          <p><Mail size={14} /> Email: <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></p>
          <p><Github size={14} /> GitHub: <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">{personalInfo.github}</a></p>
          <p><Linkedin size={14} /> LinkedIn: <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></p>
          <p><MapPin size={14} /> {lf('Vị trí', 'Location')}: {lf(personalInfo.location, personalInfo.locationEn)}</p>
        </div>
      </div>
      
      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="avatar-modal-close" onClick={() => setShowAvatarModal(false)}>×</button>
            <img 
              src={IMAGES.avatar}
              alt={personalInfo.name}
              className="avatar-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ========== RECYCLE BIN APP ==========
function RecycleApp() {
  const { i18n } = useTranslation()
  const lf = (vi, en) => i18n.language === 'en' && en ? en : vi
  return (
    <>
      <div className="window-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="window-content">
        <div className="recycle-content">
          <p style={{ padding: '10px', color: '#666', fontSize: 12 }}>
            {lf('Những dự án không may mắn... nhưng đã cho mình nhiều bài học!', "These projects didn't make it... but we learned from them!")}
          </p>
          {RECYCLED_PROJECTS.map(item => (
            <div key={item.id} className="recycle-item">
              <span className="recycle-icon"><FileText size={20} /></span>
              <div className="recycle-info">
                <div className="filename">{item.name}</div>
                <div className="reason">{lf(item.reason, item.reasonEn)}</div>
                <div className="date">{lf('Xóa:', 'Deleted:')} {item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="window-statusbar">
        <span className="statusbar-item">{RECYCLED_PROJECTS.length} items</span>
        <span className="statusbar-item">{lf('Ít nhất mình đã thử!', 'At least we tried!')}</span>
      </div>
    </>
  )
}

// ========== MAIN PORTFOLIO OS COMPONENT ==========
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
  
  const openApp = useCallback((appId) => {
    setShowStartMenu(false)
    
    // Check if already open
    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized)
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
        x: 100 + (windows.length * 30) % 200, 
        y: 50 + (windows.length * 30) % 150 
      },
      isMinimized: false,
      isMaximized: false,
    }
    
    setWindows(prev => [...prev, newWindow])
    setActiveWindowId(newWindow.id)
  }, [windows])
  
  const closeWindow = useCallback((windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId))
    if (activeWindowId === windowId) {
      setActiveWindowId(windows.length > 1 ? windows[windows.length - 2]?.id : null)
    }
  }, [activeWindowId, windows])
  
  const minimizeWindow = useCallback((windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ))
  }, [])
  
  const maximizeWindow = useCallback((windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }, [])
  
  const focusWindow = useCallback((windowId) => {
    setActiveWindowId(windowId)
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ))
  }, [])
  
  const dragWindow = useCallback((windowId, newPosition) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, position: newPosition } : w
    ))
  }, [])
  
  const handleIconDoubleClick = (icon) => {
    openApp(icon.app)
  }
  
  // Detect touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])
  
  // Handle icon tap/click - on mobile single tap opens, on desktop double-click opens
  const handleIconClick = (e, icon) => {
    e.stopPropagation()
    if (isTouchDevice) {
      // On touch: first tap selects, second tap opens
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
      case 'skills': return <SkillsApp />
      case 'projects': return <ProjectsApp />
      case 'terminal': return <TerminalApp />
      case 'about': return <AboutApp />
      case 'recycle': return <RecycleApp />
      default: return null
    }
  }
  
  return (
    <div className="portfolio-os" onClick={() => setShowStartMenu(false)}>
      {/* Desktop */}
      <div className="os-desktop" onClick={() => setSelectedIcon(null)}>
        {DESKTOP_ICONS.map(icon => (
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
      {windows.map(win => (
        <Window
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
        </Window>
      ))}
      
      {/* Start Menu */}
      {showStartMenu && (
        <div className="start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-header">
            Portfolio<br/>OS
          </div>
          <div className="start-menu-items">
            {DESKTOP_ICONS.map(icon => (
              <div
                key={icon.id}
                className="start-menu-item"
                onClick={() => openApp(icon.app)}
              >
                <span className="menu-icon">{ICON_MAP_SMALL[icon.id] || icon.icon}</span>
                <span>{icon.name}</span>
              </div>
            ))}
            <div className="start-menu-divider" />
            <div className="start-menu-item" onClick={onExit}>
              <span className="menu-icon"><Power size={16} /></span>
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
          <span className="start-icon"><LayoutGrid size={16} /></span>
          Start
        </button>
        
        <div className="taskbar-items">
          {windows.map(win => (
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
          <span><Volume2 size={16} /></span>
          <span className="tray-time">
            {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PortfolioOS
