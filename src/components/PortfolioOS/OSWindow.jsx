import React, { useState, useEffect, useRef } from 'react'

/**
 * OSWindow - Windows 95 style Window Component
 * Handles drag, resize, minimize, maximize, and z-index focus.
 */
export default function OSWindow({
  id,
  title,
  icon,
  children,
  position,
  size,
  isActive,
  isMinimized,
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDrag,
}) {
  const windowRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Mouse drag start
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
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
      y: touch.clientY - position.y,
    })
    onFocus()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      onDrag(id, {
        x: Math.max(0, e.clientX - dragOffset.x),
        y: Math.max(0, e.clientY - dragOffset.y),
      })
    }

    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      onDrag(id, {
        x: Math.max(0, touch.clientX - dragOffset.x),
        y: Math.max(0, touch.clientY - dragOffset.y),
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
          <button className="window-control" onClick={onMinimize}>
            _
          </button>
          <button className="window-control" onClick={onMaximize}>
            {isMaximized ? '❐' : '□'}
          </button>
          <button className="window-control" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

