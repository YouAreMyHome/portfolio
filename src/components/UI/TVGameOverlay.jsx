import { useEffect, useState, useCallback, useRef } from 'react'
import useStore from '../../store/useStore'
import './TVGame.css'

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * DPadButton — single directional button with pointer-down/up for continuous hold
 */
function DPadButton({ label, keyCode, simulateKey, className }) {
  const held = useRef(false)

  const press = useCallback((e) => {
    e.preventDefault()
    if (held.current) return
    held.current = true
    simulateKey(keyCode, 'down')
  }, [keyCode, simulateKey])

  const release = useCallback(() => {
    if (!held.current) return
    held.current = false
    simulateKey(keyCode, 'up')
  }, [keyCode, simulateKey])

  return (
    <button
      className={`dpad-btn ${className}`}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={label}
    >
      {label}
    </button>
  )
}

/**
 * ActionButton — tap-only (no hold): fires keydown + keyup quickly
 */
function ActionButton({ label, keyCode, simulateKey, className }) {
  const onTap = useCallback((e) => {
    e.preventDefault()
    simulateKey(keyCode, 'down')
    setTimeout(() => simulateKey(keyCode, 'up'), 60)
  }, [keyCode, simulateKey])

  return (
    <button
      className={`action-btn ${className}`}
      onPointerDown={onTap}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={label}
    >
      {label}
    </button>
  )
}

/**
 * TVGameOverlay — HUD + D-pad for mobile
 *
 * D-pad layout (bottom-left):
 *        [↑]
 *   [←] [·] [→]     [A]  [B]
 *        [↓]
 *
 * Key mapping:
 *   ↑ ArrowUp  (snake up / tetris rotate)
 *   ↓ ArrowDown (snake down / tetris soft-drop)
 *   ← ArrowLeft  ← ArrowRight
 *   A  Space  (jump/start/hard-drop)
 *   B  P      (pause)
 */
function TVGameOverlay() {
  const activePanel = useStore((state) => state.activePanel)
  const closePanel  = useStore((state) => state.closePanel)
  const isNightMode = useStore((state) => state.isNightMode)
  const [showTouch, setShowTouch] = useState(false)

  const isVisible = activePanel === 'playground'

  useEffect(() => { setShowTouch(isTouchDevice()) }, [])

  const simulateKey = useCallback((key, type = 'down') => {
    const event = new KeyboardEvent(type === 'down' ? 'keydown' : 'keyup', {
      key,
      code: key === ' ' ? 'Space' : `Key${key.replace('Arrow', '')}`,
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)
  }, [])

  // ESC to close
  useEffect(() => {
    if (!isVisible) return
    const onKey = (e) => { if (e.key === 'Escape') closePanel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isVisible, closePanel])

  if (!isVisible) return null

  return (
    <>
      {/* ── Desktop: keyboard hint bar ── */}
      {!showTouch && (
        <div className={`tv-game-hud ${isNightMode ? 'dark' : ''}`}>
          <div className="tv-game-controls">
            <div className="control-hint">
              <span className="key">↑↓←→</span> / <span className="key">WASD</span>
            </div>
            <div className="control-hint">
              <span className="key">SPACE</span> Action
            </div>
            <div className="control-hint">
              <span className="key">P</span> Pause
            </div>
            <div className="control-hint">
              <span className="key">ESC</span> Exit
            </div>
          </div>
          <button className="tv-exit-btn" onClick={closePanel}>✕ Exit</button>
        </div>
      )}

      {/* ── Mobile: D-pad + action buttons ── */}
      {showTouch && (
        <div className="mobile-game-ui">
          {/* Exit */}
          <button className="touch-exit-btn" onClick={closePanel} aria-label="Thoát">✕</button>

          {/* D-pad (bottom-left) */}
          <div className="dpad-wrapper" onContextMenu={(e) => e.preventDefault()}>
            <DPadButton label="↑" keyCode="ArrowUp"    simulateKey={simulateKey} className="dpad-up"    />
            <DPadButton label="←" keyCode="ArrowLeft"  simulateKey={simulateKey} className="dpad-left"  />
            <div className="dpad-center" aria-hidden="true" />
            <DPadButton label="→" keyCode="ArrowRight" simulateKey={simulateKey} className="dpad-right" />
            <DPadButton label="↓" keyCode="ArrowDown"  simulateKey={simulateKey} className="dpad-down"  />
          </div>

          {/* Action buttons (bottom-right) */}
          <div className="action-wrapper">
            <ActionButton label="P"  keyCode="p" simulateKey={simulateKey} className="action-pause" />
            <ActionButton label="A"  keyCode=" " simulateKey={simulateKey} className="action-a"     />
          </div>
        </div>
      )}
    </>
  )
}

export default TVGameOverlay
