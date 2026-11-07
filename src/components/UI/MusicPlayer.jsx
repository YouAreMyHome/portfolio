import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Minimize2,
  Maximize2,
  X,
  Disc,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { playlist } from '../../data/playlist'
import './MusicPlayer.css'

/**
 * MusicPlayer - Lo-Fi Vinyl Turntable & Frosted Glassmorphism Audio Suite
 * - Realistic rotating vinyl record with tonearm mechanical animation
 * - Dynamic acoustic frequency equalizer bars
 * - Shuffle, Repeat-All, Repeat-One modes
 * - Interactive seek timeline with scrubbing & precision tooltip
 * - Inline horizontal volume control with percentage readout
 * - Floating Lo-Fi Pill capsule (Dynamic Island style) when minimized
 * - Keyboard shortcuts (Space: Play/Pause, M: Mute, Arrows: Seek/Track)
 */
function MusicPlayer() {
  const showMusicPlayer = useStore((state) => state.showMusicPlayer)
  const setShowMusicPlayer = useStore((state) => state.setShowMusicPlayer)
  const setRecordPlaying = useStore((state) => state.setRecordPlaying)
  const activePanel = useStore((state) => state.activePanel)
  const showKanbanBoard = useStore((state) => state.showKanbanBoard)

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('all') // 'off' | 'all' | 'one'
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [hoverSeekPercent, setHoverSeekPercent] = useState(null)

  const audioRef = useRef(null)
  const progressBarRef = useRef(null)
  const { t } = useTranslation()

  const track = playlist[currentTrack] || playlist[0]

  // Đồng bộ trạng thái chơi nhạc vào Zustand store để xoay đĩa than trong phòng 3D
  useEffect(() => {
    setRecordPlaying(isPlaying)
  }, [isPlaying, setRecordPlaying])

  // Cập nhật tiến trình thời gian
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && !isScrubbing) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [isScrubbing])

  // Cập nhật thời lượng file âm thanh
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  // Chuyển bài tiếp theo
  const nextTrack = useCallback(() => {
    if (isShuffle && playlist.length > 1) {
      let randIdx
      do {
        randIdx = Math.floor(Math.random() * playlist.length)
      } while (randIdx === currentTrack)
      setCurrentTrack(randIdx)
    } else {
      const nextIdx = currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
      setCurrentTrack(nextIdx)
    }
  }, [currentTrack, isShuffle])

  // Chuyển bài trước đó
  const prevTrack = useCallback(() => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    } else {
      const prevIdx = currentTrack > 0 ? currentTrack - 1 : playlist.length - 1
      setCurrentTrack(prevIdx)
    }
  }, [currentTrack, currentTime])

  // Xử lý khi hết bài hát
  const handleEnded = useCallback(() => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
      return
    }

    if (repeatMode === 'off' && currentTrack === playlist.length - 1 && !isShuffle) {
      setIsPlaying(false)
      return
    }

    nextTrack()
  }, [repeatMode, currentTrack, isShuffle, nextTrack])

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().catch((err) => console.warn('Audio playback prevented:', err))
    } else {
      audioRef.current.pause()
    }
  }, [])

  // Toggle Shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => !prev)
  }, [])

  // Cycle Repeat Mode: 'all' -> 'one' -> 'off'
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'all') return 'one'
      if (prev === 'one') return 'off'
      return 'all'
    })
  }, [])

  // Chọn bài cụ thể từ queue
  const selectTrack = useCallback((index) => {
    setCurrentTrack(index)
    setIsPlaying(true)
  }, [])

  // Tính toán thời gian seek từ vị trí chuột/chạm
  const getSeekTimeFromEvent = useCallback(
    (clientX) => {
      if (!progressBarRef.current || !duration) return 0
      const rect = progressBarRef.current.getBoundingClientRect()
      const clampedX = Math.max(0, Math.min(clientX - rect.left, rect.width))
      return (clampedX / rect.width) * duration
    },
    [duration]
  )

  // Bắt đầu kéo thanh tiến trình
  const handleSeekStart = (e) => {
    setIsScrubbing(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const seekTime = getSeekTimeFromEvent(clientX)
    setCurrentTime(seekTime)
  }

  // Đang kéo thanh tiến trình
  const handleSeekMove = useCallback(
    (e) => {
      if (!isScrubbing) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const seekTime = getSeekTimeFromEvent(clientX)
      setCurrentTime(seekTime)
    },
    [isScrubbing, getSeekTimeFromEvent]
  )

  // Kết thúc kéo thanh tiến trình
  const handleSeekEnd = useCallback(() => {
    if (isScrubbing && audioRef.current) {
      audioRef.current.currentTime = currentTime
      setIsScrubbing(false)
    }
  }, [isScrubbing, currentTime])

  useEffect(() => {
    if (isScrubbing) {
      window.addEventListener('mousemove', handleSeekMove)
      window.addEventListener('mouseup', handleSeekEnd)
      window.addEventListener('touchmove', handleSeekMove)
      window.addEventListener('touchend', handleSeekEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleSeekMove)
      window.removeEventListener('mouseup', handleSeekEnd)
      window.removeEventListener('touchmove', handleSeekMove)
      window.removeEventListener('touchend', handleSeekEnd)
    }
  }, [isScrubbing, handleSeekMove, handleSeekEnd])

  // Hover xem trước thời gian
  const handleProgressMouseMove = (e) => {
    if (!progressBarRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHoverSeekPercent(percent)
  }

  const handleProgressMouseLeave = () => {
    setHoverSeekPercent(null)
  }

  // Toggle Mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }, [isMuted])

  // Điều chỉnh âm lượng
  const handleVolumeChange = useCallback(
    (e) => {
      const newVol = parseFloat(e.target.value)
      setVolume(newVol)
      if (audioRef.current) {
        audioRef.current.volume = newVol
        if (newVol > 0 && isMuted) {
          audioRef.current.muted = false
          setIsMuted(false)
        }
      }
    },
    [isMuted]
  )

  // Đồng bộ volume khi mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Tự động phát khi đổi bài nếu đang ở trạng thái playing
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      setCurrentTime(0)
      setDuration(0)
      audioRef.current.play().catch(() => {})
    }
  }, [currentTrack, isPlaying])

  // Tự động thu nhỏ khi mở panel khác
  useEffect(() => {
    if ((activePanel || showKanbanBoard) && showMusicPlayer && isPlaying) {
      setIsMinimized(true)
      setShowPlaylist(false)
    }
  }, [activePanel, showKanbanBoard, showMusicPlayer, isPlaying])

  // Phím tắt bàn phím (Keyboard Shortcuts)
  useEffect(() => {
    if (!showMusicPlayer) return

    const handleKeyDown = (e) => {
      // Không bắt phím khi đang nhập form
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'KeyM') {
        e.preventDefault()
        toggleMute()
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        if (e.shiftKey) {
          nextTrack()
        } else if (audioRef.current) {
          audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5)
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        if (e.shiftKey) {
          prevTrack()
        } else if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showMusicPlayer, togglePlay, toggleMute, nextTrack, prevTrack, duration])

  // Định dạng thời gian mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const themeColor = track?.themeColor || '#f59e0b'

  if (!showMusicPlayer) return null

  // ── 1. FLOATING LO-FI PILL (Chế độ thu nhỏ Dynamic Island) ──
  if (isMinimized) {
    return (
      <>
        <audio
          ref={audioRef}
          src={track?.src}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div
          className={`lofi-pill-container ${isPlaying ? 'playing' : ''}`}
          style={{ '--theme-glow': themeColor }}
        >
          {/* Mini Vinyl Spinner */}
          <div
            className={`pill-vinyl ${isPlaying ? 'spinning' : ''}`}
            onClick={() => setIsMinimized(false)}
            title={t('music.open')}
          >
            <div className="pill-vinyl-center" style={{ background: themeColor }} />
          </div>

          {/* Marquee Track Info */}
          <div className="pill-info" onClick={() => setIsMinimized(false)}>
            <div className="pill-title">{track?.title}</div>
            <div className="pill-artist">{track?.artist}</div>
          </div>

          {/* Mini Visualizer Equalizer */}
          {isPlaying && (
            <div className="pill-eq" onClick={() => setIsMinimized(false)}>
              <span />
              <span />
              <span />
            </div>
          )}

          {/* Fast Controls */}
          <div className="pill-actions">
            <button
              className="pill-btn-play"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
            <button
              className="pill-btn-expand"
              onClick={() => setIsMinimized(false)}
              title={t('music.open')}
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── 2. FULL RETRO LO-FI TURNTABLE PLAYER (Chế độ mở đầy đủ) ──
  return (
    <>
      <audio
        ref={audioRef}
        src={track?.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div
        className={`lofi-player-card ${showPlaylist ? 'expanded' : ''}`}
        style={{ '--theme-glow': themeColor }}
      >
        {/* Ambient Top Glow Light */}
        <div className="player-ambient-light" />

        {/* ── Header: Tên phong cách + Nút Minimize & Close ── */}
        <div className="player-header">
          <div className="player-badge">
            <Sparkles size={12} className="text-amber-400" />
            <span>LO-FI VINYL STATION</span>
          </div>
          <div className="player-header-actions">
            <button
              className="p-head-btn"
              onClick={() => setIsMinimized(true)}
              title={t('music.minimize')}
            >
              <Minimize2 size={14} />
            </button>
            <button
              className="p-head-btn close"
              onClick={() => {
                if (audioRef.current) audioRef.current.pause()
                setIsPlaying(false)
                setShowMusicPlayer(false)
              }}
              title={t('music.close')}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Main Body: Vinyl Disc + Track Details ── */}
        <div className="player-body">
          {/* Vinyl Turntable Display */}
          <div className="turntable-deck">
            {/* The Black Vinyl Record */}
            <div
              className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}
              style={{
                boxShadow: isPlaying ? `0 0 28px ${themeColor}40` : 'none',
              }}
            >
              <div className="vinyl-groove g1" />
              <div className="vinyl-groove g2" />
              <div className="vinyl-groove g3" />
              <div className="vinyl-groove g4" />
              {/* Disc Center Label */}
              <div
                className="vinyl-center-label"
                style={{
                  background: track?.coverGradient || themeColor,
                }}
              >
                <div className="label-spindle" />
                <Disc size={16} className="text-white/60" />
              </div>
            </div>

            {/* Tonearm (Cần kim xoay gác lên đĩa khi play) */}
            <div className={`turntable-arm ${isPlaying ? 'active' : ''}`}>
              <div className="arm-base" />
              <div className="arm-lever" />
              <div className="arm-cartridge" />
            </div>
          </div>

          {/* Track Info & Genre Badge */}
          <div className="track-details-col">
            <div className="track-genre-tag">{track?.genre || 'Lo-Fi Chill'}</div>
            <h3 className="track-title" title={track?.title}>
              {track?.title || t('music.no_track')}
            </h3>
            <p className="track-artist">{track?.artist || t('music.unknown')}</p>

            {/* Live Audio Equalizer Waveform */}
            <div className="visualizer-container">
              <div className={`audio-visualizer ${isPlaying ? 'active' : ''}`}>
                <span style={{ '--bar-delay': '0.1s' }} />
                <span style={{ '--bar-delay': '0.35s' }} />
                <span style={{ '--bar-delay': '0.15s' }} />
                <span style={{ '--bar-delay': '0.5s' }} />
                <span style={{ '--bar-delay': '0.25s' }} />
                <span style={{ '--bar-delay': '0.4s' }} />
                <span style={{ '--bar-delay': '0.2s' }} />
              </div>
              <span className="live-indicator">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
            </div>
          </div>
        </div>

        {/* ── Progress Bar & Seek Timeline ── */}
        <div className="player-seek-section">
          <div
            ref={progressBarRef}
            className="seek-track-wrapper"
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
            onMouseMove={handleProgressMouseMove}
            onMouseLeave={handleProgressMouseLeave}
          >
            <div className="seek-track-bg">
              {/* Hover preview fill */}
              {hoverSeekPercent !== null && (
                <div
                  className="seek-hover-fill"
                  style={{ width: `${hoverSeekPercent * 100}%` }}
                />
              )}
              {/* Current Progress Fill */}
              <div
                className="seek-progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${themeColor}, #fbbf24)`,
                }}
              >
                <div className="seek-thumb" style={{ borderColor: themeColor }} />
              </div>
            </div>

            {/* Hover Timestamp Tooltip */}
            {hoverSeekPercent !== null && duration > 0 && (
              <div
                className="seek-tooltip"
                style={{ left: `${hoverSeekPercent * 100}%` }}
              >
                {formatTime(hoverSeekPercent * duration)}
              </div>
            )}
          </div>

          {/* Time Stamps */}
          <div className="seek-time-row">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : track?.duration || '--:--'}</span>
          </div>
        </div>

        {/* ── Control Toolbar: Shuffle, Prev, Play, Next, Repeat + Volume & Queue ── */}
        <div className="player-controls-row">
          {/* Left: Shuffle & Repeat */}
          <div className="ctrl-group left">
            <button
              className={`ctrl-btn ${isShuffle ? 'active text-amber-400' : ''}`}
              onClick={toggleShuffle}
              title={isShuffle ? t('music.shuffle_off') : t('music.shuffle_on')}
            >
              <Shuffle size={16} />
            </button>
            <button
              className={`ctrl-btn ${repeatMode !== 'off' ? 'active text-amber-400' : ''}`}
              onClick={cycleRepeatMode}
              title={
                repeatMode === 'one'
                  ? t('music.repeat_one')
                  : repeatMode === 'all'
                  ? t('music.repeat_all')
                  : t('music.repeat_off')
              }
            >
              {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          {/* Center: Main Navigation Buttons */}
          <div className="ctrl-group center">
            <button className="ctrl-btn-nav" onClick={prevTrack} title="Previous (←)">
              <SkipBack size={18} />
            </button>

            <button
              className="ctrl-btn-play-hero"
              onClick={togglePlay}
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              style={{
                boxShadow: isPlaying ? `0 0 24px ${themeColor}60` : '0 4px 16px rgba(0,0,0,0.4)',
                background: `linear-gradient(135deg, ${themeColor}, #f59e0b)`,
              }}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>

            <button className="ctrl-btn-nav" onClick={nextTrack} title="Next (→)">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Right: Volume Slider & Queue List Toggle */}
          <div className="ctrl-group right">
            {/* Integrated Inline Volume Control */}
            <div className="volume-widget">
              <button
                className="ctrl-btn"
                onClick={toggleMute}
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={16} className="text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider-bar"
                style={{
                  background: `linear-gradient(to right, ${themeColor} 0%, ${themeColor} ${
                    (isMuted ? 0 : volume) * 100
                  }%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) 100%)`,
                }}
              />
            </div>

            {/* Queue Toggle Button */}
            <button
              className={`ctrl-btn queue-btn ${showPlaylist ? 'active' : ''}`}
              onClick={() => setShowPlaylist(!showPlaylist)}
              title={t('music.queue')}
            >
              <ListMusic size={17} />
              <span className="queue-badge">{playlist.length}</span>
            </button>
          </div>
        </div>

        {/* ── Playlist Queue Drawer (Trượt mở mượt mà) ── */}
        {showPlaylist && (
          <div className="playlist-drawer">
            <div className="playlist-drawer-header">
              <span>{t('music.queue')}</span>
              <span className="text-white/40 text-xs">{t('music.tracks', { n: playlist.length })}</span>
            </div>
            <div className="playlist-scroll-list">
              {playlist.map((item, idx) => {
                const isCurrent = idx === currentTrack
                return (
                  <div
                    key={item.id}
                    className={`playlist-row ${isCurrent ? 'active' : ''}`}
                    onClick={() => selectTrack(idx)}
                  >
                    <div className="row-indicator">
                      {isCurrent && isPlaying ? (
                        <div className="row-mini-eq">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : (
                        <span className="row-index">{idx + 1}</span>
                      )}
                    </div>
                    <div className="row-info">
                      <div className="row-title" style={{ color: isCurrent ? themeColor : '#fff' }}>
                        {item.title}
                      </div>
                      <div className="row-artist">{item.artist}</div>
                    </div>
                    <div className="row-duration">{item.duration}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MusicPlayer
