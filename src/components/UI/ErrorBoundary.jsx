import { Component } from 'react'
import { RefreshCw, Home, AlertTriangle, Cpu } from 'lucide-react'
import './ErrorBoundary.css'

/**
 * ErrorBoundary — Retro BSOD style error screen
 *
 * Bắt mọi lỗi React/WebGL không xử lý được và hiển thị
 * màn hình lỗi thay vì màn hình trắng/crash.
 *
 * Variants:
 *  - default  : lỗi JS/React tổng quát → giao diện BSOD xanh đậm
 *  - webgl    : lỗi Canvas/WebGL       → giao diện dark + pixel green
 */

const ERROR_MESSAGES = [
  'undefined is not a function (obviously)',
  'Cannot read properties of undefined',
  'Maximum update depth exceeded',
  'WebGL context lost. Please try again.',
  'Out of memory. Have you tried turning it off and on again?',
]

const DEV_TIPS = [
  'Hãy thử tắt đi bật lại 🔄',
  'Đã thử xóa cache chưa? 🗑️',
  'Có lẽ browser không hỗ trợ WebGL 2.0',
  'Thử dùng Chrome hoặc Firefox mới nhất',
  'Đây không phải lỗi của bạn... hoặc là? 👀',
]

function CountdownBar({ seconds, onDone }) {
  const [remaining, setRemaining] = React.useState(seconds)

  React.useEffect(() => {
    if (remaining <= 0) {
      onDone()
      return
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, onDone])

  const pct = ((seconds - remaining) / seconds) * 100

  return (
    <div className="error-progress-wrapper">
      <p className="error-progress-label">
        Tự động tải lại sau {remaining}s...
      </p>
      <div className="error-progress-bar">
        <div className="error-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// Cần import React thủ công vì dùng React.useState trong function component nằm trong file này
import React from 'react'

// ─── Fallback UI ────────────────────────────────────────────────────────────

function ErrorFallback({ error, errorInfo, isWebGL, onReset }) {
  const [autoReload] = React.useState(!isWebGL)
  const tipIdx = React.useMemo(
    () => Math.floor(Math.random() * DEV_TIPS.length),
    []
  )

  const handleReload = () => window.location.reload()
  const handleHome = () => { window.location.href = '/' }

  const errorName = error?.name || 'UnknownError'
  const errorMsg =
    error?.message ||
    ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]

  return (
    <div className={`error-screen${isWebGL ? ' webgl-error' : ''}`}>
      <div className="error-content">
        {/* Sad face */}
        <span className="error-sad-face" role="img" aria-label="sad face">
          {isWebGL ? '⚠️' : ':('} 
        </span>

        {/* Title */}
        <h1 className="error-title">
          {isWebGL
            ? 'WEBGL_CONTEXT_LOST'
            : 'YOUR_PC_RAN_INTO_A_PROBLEM'}
        </h1>

        <div className="error-divider" />

        {/* Body */}
        <div className="error-body">
          <p>
            {isWebGL
              ? 'Trình duyệt của bạn không thể khởi tạo WebGL để render phòng 3D.'
              : 'Một lỗi không mong đợi đã xảy ra và trang web phải dừng lại.'}
          </p>
          <p>💡 {DEV_TIPS[tipIdx]}</p>
        </div>

        {/* Error detail */}
        <div className="error-code-block">
          <span className="error-code-label">Error Detail</span>
          <span className="error-code-text">
            {errorName}: {errorMsg}
          </span>
          {errorInfo?.componentStack && (
            <>
              <br />
              <span style={{ opacity: 0.6, fontSize: '0.85em' }}>
                {errorInfo.componentStack.trim().split('\n').slice(0, 4).join('\n')}
              </span>
            </>
          )}
          <span className="error-cursor" />
        </div>

        {/* Countdown auto-reload (chỉ cho lỗi thường, không tự reload cho WebGL) */}
        {autoReload && (
          <CountdownBar seconds={10} onDone={handleReload} />
        )}

        {/* Action buttons */}
        <div className="error-actions">
          <button className="error-btn error-btn-primary" onClick={handleReload}>
            <RefreshCw size={14} />
            Tải lại trang
          </button>

          {onReset && (
            <button className="error-btn error-btn-secondary" onClick={onReset}>
              <Cpu size={14} />
              Thử lại
            </button>
          )}

          <button className="error-btn error-btn-secondary" onClick={handleHome}>
            <Home size={14} />
            Về trang chủ
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="error-footer">
        <div>Nghia&apos;s Room v1.0</div>
        <div>Stop code: {errorName.toUpperCase().replace(/\s/g, '_')}</div>
        <div>© {new Date().getFullYear()}</div>
      </div>
    </div>
  )
}

// ─── Error Boundary Class ────────────────────────────────────────────────────

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Log để debug (chỉ dev)
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const isWebGL =
        this.props.webgl ||
        this.state.error?.message?.toLowerCase().includes('webgl') ||
        this.state.error?.message?.toLowerCase().includes('context')

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          isWebGL={isWebGL}
          onReset={this.props.resetable ? this.handleReset : null}
        />
      )
    }

    return this.props.children
  }
}

// ─── WebGL specific boundary (wrapper tiện lợi) ──────────────────────────────

export function WebGLErrorBoundary({ children }) {
  return (
    <ErrorBoundary webgl resetable>
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
