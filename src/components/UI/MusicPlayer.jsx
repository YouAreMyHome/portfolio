import { useState, useRef, useEffect, useCallback } from 'react'
import { Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { playlist } from '../../data/playlist'
import './MusicPlayer.css'

/**
 * MusicPlayer - Spotify-style mini player
 * Compact, mobile-optimized, background playback
 * Volume control for PC, auto-minimize when interacting with other objects
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
  const [isMuted, setIsMuted] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTouchDevice] = useState(() => 
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  )
  
  const audioRef = useRef(null)
  
  const track = playlist[currentTrack]
  const { t } = useTranslation()
  
  // Sync with store
  useEffect(() => {
    setRecordPlaying(isPlaying)
  }, [isPlaying, setRecordPlaying])
  
  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }, [])
  
  // Handle loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])
  
  // Handle track end - auto next
  const handleEnded = useCallback(() => {
    const nextIndex = currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    setCurrentTrack(nextIndex)
  }, [currentTrack])
  
  // Play/Pause - Let audio events handle state
  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => console.warn('Playback failed:', e))
      } else {
        audioRef.current.pause()
      }
    }
  }, [])
  
  // Previous track
  const prevTrack = useCallback(() => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
    } else {
      const newIndex = currentTrack > 0 ? currentTrack - 1 : playlist.length - 1
      setCurrentTrack(newIndex)
    }
  }, [currentTrack, currentTime])
  
  // Next track
  const nextTrack = useCallback(() => {
    const newIndex = currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    setCurrentTrack(newIndex)
  }, [currentTrack])
  
  // Select track
  const selectTrack = useCallback((index) => {
    setCurrentTrack(index)
    setIsPlaying(true)
    setShowPlaylist(false)
  }, [])
  
  // Seek - support both mouse and touch
  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const time = percent * duration
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [duration])
  
  // Mute toggle - uses device volume, just toggle muted
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }, [isMuted])
  
  // Volume change handler (for PC)
  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    // Auto unmute when adjusting volume
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
      if (audioRef.current) audioRef.current.muted = false
    }
  }, [isMuted])
  
  // Sync volume to audio element on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])
  
  // Auto-minimize when opening other panels/overlays
  useEffect(() => {
    if ((activePanel || showKanbanBoard) && showMusicPlayer && isPlaying) {
      setIsMinimized(true)
      setShowPlaylist(false)
    }
  }, [activePanel, showKanbanBoard, showMusicPlayer, isPlaying])
  
  // Restore player when panels close (optional - user can also click mini button)
  // useEffect(() => {
  //   if (!activePanel && !showKanbanBoard && isMinimized) {
  //     setIsMinimized(false)
  //   }
  // }, [activePanel, showKanbanBoard, isMinimized])
  
  // Auto-play on track change
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      // Reset states when changing track
      setCurrentTime(0)
      setDuration(0)
      audioRef.current.play().catch(e => console.warn('Playback failed:', e))
    }
  }, [currentTrack, isPlaying])
  
  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
  // Close player
  const closePlayer = () => {
    if (audioRef.current) audioRef.current.pause()
    setIsPlaying(false)
    setShowMusicPlayer(false)
    setShowPlaylist(false)
  }
  
  const progressPercent = (duration && duration > 0) ? (currentTime / duration) * 100 : 0
  
  if (!showMusicPlayer) return null
  
  // Minimized floating button
  if (isMinimized) {
    return (
      <>
        <audio
          ref={audioRef}
          src={track?.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <button 
          className={`sp-mini-btn ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsMinimized(false)}
          title={t('music.open')}
        >
          <Music size={20} />
          {isPlaying && (
            <div className="sp-mini-eq">
              <span></span><span></span><span></span>
            </div>
          )}
        </button>
      </>
    )
  }
  
  return (
    <>
      {/* Hidden Audio Element */}
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
      
      {/* Mini Player */}
      <div className={`spotify-player ${showPlaylist ? 'expanded' : ''}`}>
        {/* Top Section: Progress Bar + Time */}
        <div className="sp-progress-section">
          <div 
            className="sp-progress-wrapper" 
            onClick={handleSeek}
            onTouchStart={handleSeek}
            onTouchMove={handleSeek}
          >
            <div className="sp-progress-bg">
              <div 
                className="sp-progress-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="sp-progress-time">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Bottom Section: 3-Column Layout */}
        <div className="sp-content">
          {/* Left: Track Info */}
          <div className="sp-track-info" onClick={() => setShowPlaylist(!showPlaylist)}>
            <div className={`sp-album-art ${isPlaying ? 'playing' : ''}`}>
              <Music size={20} />
            </div>
            <div className="sp-track-text">
              <div className="sp-track-title">{track?.title || 'No track'}</div>
              <div className="sp-track-artist">{track?.artist || 'Unknown'}</div>
            </div>
          </div>
          
          {/* Center: Controls */}
          <div className="sp-controls">
            <button className="sp-btn sp-btn-nav" onClick={prevTrack} title="Previous">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button className="sp-btn sp-btn-play" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <button className="sp-btn sp-btn-nav" onClick={nextTrack} title="Next">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
          
          {/* Right: Actions */}
          <div className="sp-right">
            {/* Volume Control - PC only */}
            {!isTouchDevice && (
              <div className="sp-volume-control">
                <button 
                  className={`sp-btn sp-btn-action ${isMuted ? 'muted' : ''}`}
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    {isMuted || volume === 0 ? (
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    ) : volume < 0.5 ? (
                      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                    ) : (
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    )}
                  </svg>
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="sp-volume-slider"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                  style={{
                    background: `linear-gradient(to right, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>
            )}
            
            {/* Mute Toggle - Mobile only */}
            {isTouchDevice && (
              <button 
                className={`sp-btn sp-btn-action ${isMuted ? 'muted' : ''}`}
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {isMuted ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  )}
                </svg>
              </button>
            )}
            
            {/* Minimize button - PC only */}
            {!isTouchDevice && (
              <button 
                className="sp-btn sp-btn-action"
                onClick={() => setIsMinimized(true)}
                title={t('music.minimize')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
            )}
            
            {/* Playlist toggle - hidden on mobile (tap track info instead) */}
            <button 
              className={`sp-btn sp-btn-action sp-btn-playlist ${showPlaylist ? 'active' : ''}`} 
              onClick={() => setShowPlaylist(!showPlaylist)}
              title="Playlist"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </button>
            
            {/* Close */}
            <button className="sp-btn sp-btn-action" onClick={closePlayer} title="Close">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Playlist Panel */}
        {showPlaylist && (
          <div className="sp-playlist">
            <div className="sp-playlist-header">
              <span>{t('music.queue')}</span>
              <span className="sp-playlist-count">{t('music.tracks', { n: playlist.length })}</span>
            </div>
            <div className="sp-playlist-list">
              {playlist.map((item, index) => (
                <div 
                  key={item.id}
                  className={`sp-playlist-item ${index === currentTrack ? 'active' : ''}`}
                  onClick={() => selectTrack(index)}
                >
                  <div className="sp-item-num">
                    {index === currentTrack && isPlaying ? (
                      <div className="sp-eq-bars">
                        <span></span><span></span><span></span>
                      </div>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="sp-item-info">
                    <div className="sp-item-title">{item.title}</div>
                    <div className="sp-item-artist">{item.artist}</div>
                  </div>
                  <div className="sp-item-duration">{item.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MusicPlayer
