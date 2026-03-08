import useStore from '../../store/useStore'
import './TransitionOverlay.css'

/**
 * TransitionOverlay — che màn hình khi Three.js recompile shader
 *
 * Phase machine (tổng ~640–800ms tùy frame rate thiết bị):
 *   'covering'  → CSS fade-in 260ms    (overlay hiện ra)
 *   flip isNightMode → sau 280ms        (Three.js bắt đầu recompile)
 *   waitForRender → 8 rAF frames        (scale theo GPU, ~67–267ms)
 *   'revealing' → CSS fade-out 360ms   (overlay biến mất)
 *   'idle'      → unmount
 */
function TransitionOverlay() {
  const transitionPhase = useStore((s) => s.transitionPhase)
  const transitionTarget = useStore((s) => s.transitionTarget)

  if (transitionPhase === 'idle') return null

  const isNight = transitionTarget === 'night'

  return (
    <div
      className={`scene-transition-overlay ${transitionPhase} ${transitionTarget}`}
      aria-hidden="true"
    >
      <div className="scene-transition-content">
        <div className="scene-transition-icon">
          {isNight ? '🌙' : '☀️'}
        </div>
        <div className="scene-transition-label">
          {isNight ? 'Night Mode' : 'Day Mode'}
        </div>
      </div>
    </div>
  )
}

export default TransitionOverlay
