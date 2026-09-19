import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Sparkles,
  Volume2,
  VolumeX,
  Globe,
  Compass,
  MousePointer,
  RotateCw,
  Headphones,
  ArrowRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { useSounds, useSoundStore } from '../../utils/useSounds'
import './WelcomeScreen.css'

/**
 * StarField Component — Bầu trời sao nhấp nháy với sao băng
 */
function StarField({ depthOffset = { x: 0, y: 0 } }) {
  const stars = useMemo(() => {
    return Array.from({ length: 65 }, (_, i) => ({
      id: i,
      left: `${(i * 17.3 + 5.7) % 100}%`,
      top: `${(i * 23.7 + 3.2) % 65}%`,
      size: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1.2,
      duration: 2 + (i % 5) * 0.8,
      delay: (i % 8) * 0.4,
      opacity: 0.35 + (i % 6) * 0.12,
    }))
  }, [])

  return (
    <div
      className="welcome-stars-layer"
      style={{
        transform: `translate3d(${depthOffset.x * 12}px, ${depthOffset.y * 8}px, 0)`,
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="welcome-star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
          }}
        />
      ))}
      <div className="shooting-star shooting-star-1" />
      <div className="shooting-star shooting-star-2" />
    </div>
  )
}

/**
 * MoonGlow Component — Mặt trăng phát sáng tỏa halo
 */
function MoonGlow({ depthOffset = { x: 0, y: 0 } }) {
  return (
    <div
      className="welcome-moon-layer"
      style={{
        transform: `translate3d(${depthOffset.x * 18}px, ${depthOffset.y * 14}px, 0)`,
      }}
    >
      <div className="welcome-moon-halo" />
      <div className="welcome-moon-orb">
        <div className="welcome-moon-crater crater-1" />
        <div className="welcome-moon-crater crater-2" />
        <div className="welcome-moon-crater crater-3" />
      </div>
    </div>
  )
}

/**
 * Handcrafted SVG Cloud Components — Organic Puffy Cumulus Shapes
 */
function CloudSVG1({ className = '', gradientId = 'cgb1' }) {
  return (
    <svg viewBox="0 0 240 85" className={`cloud-svg ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#cbd5e1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d="M 30,75 C 13.4,75 0,61.6 0,45 C 0,29.5 11.8,16.8 27,15.2 C 32.5,6.5 42,0 53,0 C 66,0 77,8 81.5,19.5 C 87,14.5 94.5,11.5 103,11.5 C 119,11.5 132,23 134.5,38.5 C 140.5,34 148,31 156,31 C 172,31 185.5,43 187.5,58.5 C 191.5,56.5 196,55 201,55 C 214,55 225,64 225,75 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M 30,75 C 13.4,75 0,61.6 0,45 C 0,29.5 11.8,16.8 27,15.2 C 32.5,6.5 42,0 53,0 C 66,0 77,8 81.5,19.5 C 87,14.5 94.5,11.5 103,11.5 C 119,11.5 132,23 134.5,38.5 C 140.5,34 148,31 156,31 C 172,31 185.5,43 187.5,58.5 C 191.5,56.5 196,55 201,55 C 214,55 225,64 225,75"
        stroke="rgba(255, 255, 255, 0.28)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}

function CloudSVG2({ className = '', gradientId = 'cgb2' }) {
  return (
    <svg viewBox="0 0 310 90" className={`cloud-svg ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#cbd5e1" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d="M 35,85 C 15.7,85 0,69.3 0,50 C 0,31.8 13.9,16.8 31.8,15.2 C 38,6.2 48,0 60,0 C 74,0 86,8.7 91,21.5 C 97.5,16 106,12.5 115.5,12.5 C 132.5,12.5 146.5,24 149.5,39.5 C 156,35 164,32 173,32 C 190,32 204.5,44 207.5,60 C 213,57 219,55 226,55 C 241,55 254,66 256.5,80 C 261,78 266,77 271,77 C 285,77 296,84 298,85 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M 35,85 C 15.7,85 0,69.3 0,50 C 0,31.8 13.9,16.8 31.8,15.2 C 38,6.2 48,0 60,0 C 74,0 86,8.7 91,21.5 C 97.5,16 106,12.5 115.5,12.5 C 132.5,12.5 146.5,24 149.5,39.5 C 156,35 164,32 173,32 C 190,32 204.5,44 207.5,60 C 213,57 219,55 226,55 C 241,55 254,66 256.5,80 C 261,78 266,77 271,77"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}

function CloudSVG3({ className = '', gradientId = 'cgb3' }) {
  return (
    <svg viewBox="0 0 200 65" className={`cloud-svg ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#94a3b8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1e293b" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d="M 25,60 C 11.2,60 0,48.8 0,35 C 0,22.2 9.5,11.5 22,10.2 C 27,4.2 35.5,0 45,0 C 56.5,0 66.5,6.5 71,16 C 76.5,11.5 84,8.5 92,8.5 C 107.5,8.5 120,20 122,34.5 C 127.5,30.5 134.5,28 142,28 C 156.5,28 168.5,38.5 170.5,52.5 C 174,51 178,50 182,50 C 192,50 200,55 200,60 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M 25,60 C 11.2,60 0,48.8 0,35 C 0,22.2 9.5,11.5 22,10.2 C 27,4.2 35.5,0 45,0 C 56.5,0 66.5,6.5 71,16 C 76.5,11.5 84,8.5 92,8.5 C 107.5,8.5 120,20 122,34.5 C 127.5,30.5 134.5,28 142,28 C 156.5,28 168.5,38.5 170.5,52.5"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}

/**
 * CloudLayer Component — Các đám mây trôi parallax 2 tầng bằng SVG hữu cơ
 */
function CloudLayer({ depthOffset = { x: 0, y: 0 } }) {
  return (
    <>
      {/* Back slow cloud layer */}
      <div
        className="welcome-cloud-layer cloud-layer-back"
        style={{
          transform: `translate3d(${depthOffset.x * 24}px, ${depthOffset.y * 16}px, 0)`,
        }}
      >
        <div className="cloud-track track-slow">
          <div className="cloud-group">
            <CloudSVG1 className="cloud-item-1" gradientId="cgb1" />
            <CloudSVG2 className="cloud-item-2" gradientId="cgb2" />
            <CloudSVG3 className="cloud-item-3" gradientId="cgb3" />
          </div>
          <div className="cloud-group">
            <CloudSVG1 className="cloud-item-1" gradientId="cgb4" />
            <CloudSVG2 className="cloud-item-2" gradientId="cgb5" />
            <CloudSVG3 className="cloud-item-3" gradientId="cgb6" />
          </div>
        </div>
      </div>

      {/* Front faster cloud layer */}
      <div
        className="welcome-cloud-layer cloud-layer-front"
        style={{
          transform: `translate3d(${depthOffset.x * 36}px, ${depthOffset.y * 22}px, 0)`,
        }}
      >
        <div className="cloud-track track-fast">
          <div className="cloud-group">
            <CloudSVG2 className="cloud-item-4" gradientId="cgf1" />
            <CloudSVG1 className="cloud-item-5" gradientId="cgf2" />
          </div>
          <div className="cloud-group">
            <CloudSVG2 className="cloud-item-4" gradientId="cgf3" />
            <CloudSVG1 className="cloud-item-5" gradientId="cgf4" />
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * CitySkyline Component — Thành phố đêm 3 tầng với cửa sổ Nghia's Room ấm áp
 */
function CitySkyline({ depthOffset = { x: 0, y: 0 } }) {
  return (
    <div className="welcome-skyline-wrapper">
      {/* 1. Far Skyline */}
      <div
        className="skyline-layer skyline-far"
        style={{
          transform: `translate3d(${depthOffset.x * 32}px, ${depthOffset.y * 18}px, 0)`,
        }}
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="skyline-svg">
          <path
            d="M0,320 L0,180 L40,180 L40,140 L70,140 L70,210 L120,210 L120,110 L150,110 L150,220 L190,220 L190,160 L240,160 L240,90 L270,90 L270,230 L320,230 L320,130 L370,130 L370,240 L430,240 L430,70 L460,70 L460,200 L510,200 L510,150 L560,150 L560,250 L620,250 L620,100 L660,100 L660,220 L720,220 L720,80 L760,80 L760,190 L810,190 L810,130 L870,130 L870,240 L930,240 L930,90 L970,90 L970,210 L1030,210 L1030,120 L1080,120 L1080,230 L1140,230 L1140,60 L1180,60 L1180,200 L1240,200 L1240,140 L1300,140 L1300,220 L1360,220 L1360,110 L1400,110 L1400,190 L1440,190 L1440,320 Z"
            fill="#121638"
          />
        </svg>
        {/* Radio antenna beacons */}
        <div className="skyline-beacon beacon-1" />
        <div className="skyline-beacon beacon-2" />
        <div className="skyline-beacon beacon-3" />
      </div>

      {/* 2. Mid Skyline with scattered lit windows */}
      <div
        className="skyline-layer skyline-mid"
        style={{
          transform: `translate3d(${depthOffset.x * 52}px, ${depthOffset.y * 28}px, 0)`,
        }}
      >
        <svg viewBox="0 0 1440 280" preserveAspectRatio="none" className="skyline-svg">
          <path
            d="M0,280 L0,150 L60,150 L60,100 L110,100 L110,170 L170,170 L170,80 L230,80 L230,190 L290,190 L290,120 L350,120 L350,210 L410,210 L410,60 L480,60 L480,180 L540,180 L540,110 L600,110 L600,200 L680,200 L680,90 L750,90 L750,210 L820,210 L820,130 L890,130 L890,70 L950,70 L950,190 L1020,190 L1020,100 L1090,100 L1090,210 L1160,210 L1160,80 L1230,80 L1230,180 L1310,180 L1310,120 L1380,120 L1380,190 L1440,190 L1440,280 Z"
            fill="#0c102a"
          />
        </svg>
        {/* Mid layer glowing windows */}
        <div className="mid-windows-group">
          <span className="win win-cyan" style={{ left: '16%', bottom: '38%' }} />
          <span className="win win-yellow" style={{ left: '18%', bottom: '45%' }} />
          <span className="win win-yellow" style={{ left: '32%', bottom: '40%' }} />
          <span className="win win-purple" style={{ left: '46%', bottom: '58%' }} />
          <span className="win win-yellow" style={{ left: '49%', bottom: '52%' }} />
          <span className="win win-cyan" style={{ left: '65%', bottom: '42%' }} />
          <span className="win win-yellow" style={{ left: '80%', bottom: '48%' }} />
          <span className="win win-pink" style={{ left: '84%', bottom: '56%' }} />
        </div>
      </div>

      {/* 3. Foreground Skyline with Nghia's Room Window */}
      <div
        className="skyline-layer skyline-fore"
        style={{
          transform: `translate3d(${depthOffset.x * 72}px, ${depthOffset.y * 38}px, 0)`,
        }}
      >
        <div className="fore-buildings-container">
          {/* Building Left */}
          <div className="fore-bldg bldg-1">
            <div className="rooftop-antenna" />
            <div className="window-grid">
              <span className="f-win" />
              <span className="f-win lit-warm" />
              <span className="f-win" />
              <span className="f-win lit-cool" />
            </div>
          </div>

          {/* Building 2 */}
          <div className="fore-bldg bldg-2">
            <div className="rooftop-water-tank" />
            <div className="window-grid">
              <span className="f-win lit-warm" />
              <span className="f-win" />
              <span className="f-win" />
              <span className="f-win lit-warm" />
            </div>
          </div>

          {/* Central Hero Building — NGHIA'S ROOM */}
          <div className="fore-bldg bldg-hero">
            <div className="hero-rooftop-accent">
              <div className="mini-dish" />
              <span className="room-indicator-badge">
                <span className="indicator-dot" />
                ROOM 404
              </span>
            </div>

            {/* Special Nghia's Room glowing window */}
            <div className="nghia-room-window" title="Nghia's Room">
              <div className="nghia-room-glow" />
              <div className="nghia-room-interior">
                {/* Silhouette inside: monitor + lamp + desk plant */}
                <div className="interior-silhouette">
                  <div className="interior-lamp" />
                  <div className="interior-screen" />
                  <div className="interior-plant" />
                </div>
              </div>
              <div className="nghia-room-label">
                <span>NGHIA&apos;S ROOM</span>
              </div>
            </div>

            <div className="window-grid hero-grid">
              <span className="f-win" />
              <span className="f-win lit-cool" />
              <span className="f-win lit-warm" />
              <span className="f-win" />
            </div>
          </div>

          {/* Building 4 */}
          <div className="fore-bldg bldg-4">
            <div className="rooftop-railing" />
            <div className="window-grid">
              <span className="f-win lit-cool" />
              <span className="f-win" />
              <span className="f-win lit-warm" />
              <span className="f-win" />
            </div>
          </div>

          {/* Building Right */}
          <div className="fore-bldg bldg-5">
            <div className="window-grid">
              <span className="f-win" />
              <span className="f-win lit-warm" />
              <span className="f-win lit-warm" />
              <span className="f-win" />
            </div>
          </div>
        </div>

        {/* Ambient street fog along baseline */}
        <div className="street-fog-gradient" />
      </div>
    </div>
  )
}

/**
 * FloatingParticles Component — Hạt sáng lơ lửng / đom đóm
 */
function FloatingParticles({ depthOffset = { x: 0, y: 0 } }) {
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 19.3 + 8.2) % 94}%`,
      bottom: `${(i * 14.5 + 5) % 65}%`,
      size: 2.5 + (i % 4) * 1.5,
      duration: 6 + (i % 6) * 1.8,
      delay: (i % 7) * 0.7,
      color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#38bdf8' : '#f472b6',
    }))
  }, [])

  return (
    <div
      className="welcome-particles-layer"
      style={{
        transform: `translate3d(${depthOffset.x * 85}px, ${depthOffset.y * 45}px, 0)`,
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="welcome-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * WelcomeHero Component — Giao diện chính Main Menu kiểu Game
 */
function WelcomeHero({ onEnter, isExiting, depthOffset = { x: 0, y: 0 } }) {
  const { t, i18n } = useTranslation()
  const { isMuted, toggleMute } = useSoundStore()
  const { playClick, playHover } = useSounds()

  const isVI = (i18n.language || 'vi').startsWith('vi')

  const toggleLanguage = () => {
    playClick()
    const nextLang = isVI ? 'en' : 'vi'
    i18n.changeLanguage(nextLang)
  }

  return (
    <div
      className="welcome-hero-container"
      style={{
        transform: `translate3d(${depthOffset.x * -16}px, ${depthOffset.y * -10}px, 0)`,
      }}
    >
      {/* Top Quick Controls: Sound & Language */}
      <div className="welcome-top-bar">
        <div className="welcome-badge">
          <Sparkles size={13} className="welcome-badge-icon" />
          <span>INTERACTIVE 3D EXPERIENCE</span>
        </div>

        <div className="welcome-quick-actions">
          <button
            type="button"
            className="welcome-tool-btn"
            onClick={toggleLanguage}
            onMouseEnter={playHover}
            title={i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe size={14} />
            <span className="tool-btn-label">{i18n.language === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          <button
            type="button"
            className="welcome-tool-btn"
            onClick={() => {
              playClick()
              toggleMute()
            }}
            onMouseEnter={playHover}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Title Card */}
      <div className="welcome-card">
        {/* Game Corner Accents */}
        <div className="card-corner corner-tl" />
        <div className="card-corner corner-tr" />
        <div className="card-corner corner-bl" />
        <div className="card-corner corner-br" />

        <div className="welcome-kicker-row">
          <span className="kicker-line" />
          <span className="welcome-kicker">{t('welcome.greeting')}</span>
          <span className="kicker-line" />
        </div>

        <h1 className="welcome-title">
          <span className="title-highlight">NGHIA&apos;S</span>
          <span className="title-sub">ROOM</span>
        </h1>

        <p className="welcome-subtitle">
          {t('welcome.tagline', 'Khám phá không gian sáng tạo của một lập trình viên')}
        </p>

        {/* Start Button */}
        <div className="welcome-cta-wrap">
          <button
            type="button"
            className={`welcome-cta-btn ${isExiting ? 'btn-exiting' : ''}`}
            onClick={onEnter}
            onMouseEnter={playHover}
            disabled={isExiting}
          >
            <span className="cta-glow-backdrop" />
            <span className="cta-border-pulse" />
            <span className="cta-content">
              <Compass size={18} className="cta-compass-icon" />
              <span className="cta-text">{t('welcome.enter')}</span>
              <ArrowRight size={16} className="cta-arrow-icon" />
            </span>
          </button>
          <span className="cta-press-hint">PRESS START TO EXPLORE</span>
        </div>

        {/* Feature badges */}
        <div className="welcome-feature-row">
          <div className="feature-item">
            <MousePointer size={13} />
            <span>{t('welcome.hint', 'Click vật thể để khám phá')}</span>
          </div>
          <div className="feature-divider">•</div>
          <div className="feature-item">
            <RotateCw size={13} />
            <span>360° Rotate</span>
          </div>
          <div className="feature-divider">•</div>
          <div className="feature-item">
            <Headphones size={13} />
            <span>Audio On</span>
          </div>
        </div>
      </div>

      {/* Bottom version watermark */}
      <div className="welcome-footer-info">
        <span>EST. 2026</span>
        <span>•</span>
        <span>THREE.JS &amp; REACT</span>
        <span>•</span>
        <span>DEV PORTFOLIO</span>
      </div>
    </div>
  )
}

/**
 * WelcomeScreen Main Orchestrator
 */
export default function WelcomeScreen() {
  const showWelcome = useStore((state) => state.showWelcome)
  const hasEnteredRoom = useStore((state) => state.hasEnteredRoom)
  const enterRoom = useStore((state) => state.enterRoom)
  const completeWelcomeExit = useStore((state) => state.completeWelcomeExit)
  const { playSuccess, playClick } = useSounds()

  const [exitPhase, setExitPhase] = useState('idle') // 'idle' | 'zooming' | 'flaring' | 'dissolving'
  const [depthOffset, setDepthOffset] = useState({ x: 0, y: 0 })

  // Mouse tracking with smooth lerp
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseCurrentRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)
  const lastMouseMoveTimeRef = useRef(Date.now())

  // Handle Mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      lastMouseMoveTimeRef.current = Date.now()
      const { innerWidth, innerHeight } = window
      // Normalize -0.5 to 0.5
      const normX = (e.clientX / innerWidth) - 0.5
      const normY = (e.clientY / innerHeight) - 0.5
      mouseTargetRef.current = { x: normX, y: normY }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Smooth render loop
    const updateParallax = () => {
      const now = Date.now()
      // If mouse idle > 2.5s, add a gentle subtle auto-drift
      const isIdle = now - lastMouseMoveTimeRef.current > 2500
      let targetX = mouseTargetRef.current.x
      let targetY = mouseTargetRef.current.y

      if (isIdle) {
        const time = now * 0.0008
        targetX += Math.sin(time) * 0.12
        targetY += Math.cos(time * 0.8) * 0.08
      }

      // Smooth interpolation (lerp)
      const lerpFactor = 0.06
      mouseCurrentRef.current.x += (targetX - mouseCurrentRef.current.x) * lerpFactor
      mouseCurrentRef.current.y += (targetY - mouseCurrentRef.current.y) * lerpFactor

      setDepthOffset({
        x: mouseCurrentRef.current.x,
        y: mouseCurrentRef.current.y,
      })

      animationFrameRef.current = requestAnimationFrame(updateParallax)
    }

    animationFrameRef.current = requestAnimationFrame(updateParallax)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Keyboard shortcut: Press Enter or Space to enter room
  useEffect(() => {
    if (!showWelcome || exitPhase !== 'idle') return

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleEnter()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showWelcome, exitPhase])

  const handleEnter = () => {
    if (exitPhase !== 'idle') return
    playClick()
    playSuccess()

    // Phase 1: Zoom in towards Nghia's room window
    setExitPhase('zooming')

    // Phase 2: Warm golden light flares up from window and blankets viewport
    const flareTimer = setTimeout(() => {
      setExitPhase('flaring')
    }, 450)

    // Phase 3: At peak flare, activate 3D room underneath
    const enterRoomTimer = setTimeout(() => {
      enterRoom()
      // Phase 4: Dissolve the flare over the 3D room
      setExitPhase('dissolving')
    }, 750)

    // Phase 5: Clean unmount after flare has completely dissolved into the room
    const cleanupTimer = setTimeout(() => {
      completeWelcomeExit()
    }, 1350)

    return () => {
      clearTimeout(flareTimer)
      clearTimeout(enterRoomTimer)
      clearTimeout(cleanupTimer)
    }
  }

  if (!showWelcome || (hasEnteredRoom && exitPhase === 'idle')) return null

  const isExiting = exitPhase !== 'idle'

  return (
    <div
      className={`welcome-screen-root ${isExiting ? 'welcome-screen-exiting' : ''} phase-${exitPhase}`}
      aria-label="Welcome Screen"
    >
      {/* Background Deep Sky Gradient */}
      <div className="welcome-sky-gradient" />

      {/* Atmospheric Vignette & Scanlines */}
      <div className="welcome-vignette" />
      <div className="welcome-scanlines" />

      {/* Parallax Scene Elements */}
      <div className="welcome-scene-layers">
        {/* Layer 1: Stars */}
        <StarField depthOffset={depthOffset} />

        {/* Layer 2: Moon with halo glow */}
        <MoonGlow depthOffset={depthOffset} />

        {/* Layer 3: Drifting Clouds */}
        <CloudLayer depthOffset={depthOffset} />

        {/* Layer 4: City Skyline with Nghia's Room window */}
        <CitySkyline depthOffset={depthOffset} />

        {/* Layer 5: Floating dust motes / fireflies */}
        <FloatingParticles depthOffset={depthOffset} />
      </div>

      {/* Foreground Hero UI */}
      <WelcomeHero
        onEnter={handleEnter}
        isExiting={isExiting}
        depthOffset={depthOffset}
      />

      {/* Cinematic Golden Light Flare on entering Nghia's room */}
      <div className={`welcome-transition-flare ${exitPhase === 'flaring' ? 'flare-active' : ''} ${exitPhase === 'dissolving' ? 'flare-dissolving' : ''}`} />
    </div>
  )
}
