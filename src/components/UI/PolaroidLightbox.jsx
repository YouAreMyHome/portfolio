import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { 
  X, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, RotateCw, 
  Maximize2, Minimize2, Info, 
  Download, Share2, Check, 
  Calendar, MapPin, Camera, 
  Sparkles, Layers, BookOpen, 
  CornerDownRight 
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'
import { normalizePolaroidItem } from '../../data/polaroidData'
import './PolaroidLightbox.css'

/**
 * PolaroidLightbox — Hệ thống xem ảnh kỷ niệm chuẩn Studio
 * 
 * Tính năng cao cấp:
 * - Khung Polaroid chân thực với hiệu ứng 3D Parallax Tilt theo chuột
 * - Thanh công cụ Glassmorphism (Zoom 1x-2.5x, Xoay 90°, Toàn màn hình, Tải ảnh, Copy link)
 * - Bảng Ký Ức & Câu Chuyện (Story Drawer) chi tiết song ngữ VI/EN
 * - Dải phim thu nhỏ (Interactive Filmstrip) chuyển ảnh tức thì
 * - Phím tắt đầy đủ (←, →, +, -, R, I, F, Esc) & Touch swipe mượt mà
 * - Hiệu ứng âm thanh chân thực & Thông báo Toast phản hồi
 */
function PolaroidLightbox() {
  const polaroidImages = useStore((s) => s.polaroidImages)
  const polaroidIndex  = useStore((s) => s.polaroidIndex)
  const closePolaroid  = useStore((s) => s.closePolaroid)
  const prevPolaroid   = useStore((s) => s.prevPolaroid)
  const nextPolaroid   = useStore((s) => s.nextPolaroid)
  const openPolaroid   = useStore((s) => s.openPolaroid)

  const { t, i18n } = useTranslation()
  const { playSound } = useSounds()
  const play = useCallback((name) => {
    try {
      playSound?.(name)
    } catch {}
  }, [playSound])
  const lang = i18n.language || 'vi'

  // Ref & State
  const containerRef = useRef(null)
  const filmstripRef = useRef(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState('') // 'left' | 'right' | 'in'
  
  // Interactive View Controls
  const [zoomLevel, setZoomLevel] = useState(1) // 1x, 1.6x, 2.4x
  const [rotationDeg, setRotationDeg] = useState(0) // 0, 90, 180, 270
  const [showInfo, setShowInfo] = useState(false)
  const [showFilmstrip, setShowFilmstrip] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  
  // 3D Parallax Tilt on Mouse Move
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 })
  // Pan state when zoomed in
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const isOpen = polaroidImages.length > 0
  const total = polaroidImages.length

  // Chuẩn hóa danh sách ảnh thành Item phong phú
  const galleryItems = useMemo(() => {
    return polaroidImages.map((raw, idx) => normalizePolaroidItem(raw, idx))
  }, [polaroidImages])

  const currentItem = galleryItems[polaroidIndex] || galleryItems[0] || null

  // Reset transform khi chuyển ảnh
  const resetTransforms = useCallback(() => {
    setZoomLevel(1)
    setRotationDeg(0)
    setPan({ x: 0, y: 0 })
    setCardTilt({ rx: 0, ry: 0 })
  }, [])

  // Toast notification helper
  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev))
    }, 2400)
  }, [])

  // Điều hướng chuyển ảnh
  const handleNext = useCallback(() => {
    if (total < 2) return
    play('click')
    setSlideDir('left')
    setAnimKey((k) => k + 1)
    resetTransforms()
    nextPolaroid()
  }, [total, nextPolaroid, play, resetTransforms])

  const handlePrev = useCallback(() => {
    if (total < 2) return
    play('click')
    setSlideDir('right')
    setAnimKey((k) => k + 1)
    resetTransforms()
    prevPolaroid()
  }, [total, prevPolaroid, play, resetTransforms])

  const handleJumpTo = useCallback((index) => {
    if (index === polaroidIndex) return
    play('click')
    setSlideDir(index > polaroidIndex ? 'left' : 'right')
    setAnimKey((k) => k + 1)
    resetTransforms()
    openPolaroid(polaroidImages, index)
  }, [polaroidIndex, polaroidImages, openPolaroid, play, resetTransforms])

  const handleClose = useCallback(() => {
    play('panelClose')
    resetTransforms()
    closePolaroid()
  }, [closePolaroid, play, resetTransforms])

  // Zoom controls
  const handleZoomIn = () => {
    play('click')
    setZoomLevel((z) => Math.min(2.5, Number((z + 0.5).toFixed(1))))
  }

  const handleZoomOut = () => {
    play('click')
    setZoomLevel((z) => {
      const next = Math.max(1, Number((z - 0.5).toFixed(1)))
      if (next === 1) setPan({ x: 0, y: 0 })
      return next
    })
  }

  const handleResetZoom = () => {
    play('click')
    resetTransforms()
  }

  const handleRotate = () => {
    play('click')
    setRotationDeg((r) => (r + 90) % 360)
  }

  const toggleInfo = () => {
    play('click')
    setShowInfo((prev) => !prev)
  }

  const toggleFullscreen = () => {
    play('click')
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Tải ảnh về máy
  const handleDownload = async () => {
    if (!currentItem?.src) return
    play('click')
    showToast(t('polaroid.downloading'))
    try {
      const response = await fetch(currentItem.src, { mode: 'cors' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `polaroid_${currentItem.id || polaroidIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      // Fallback mở tab mới nếu fetch blob bị giới hạn
      window.open(currentItem.src, '_blank')
    }
  }

  // Sao chép liên kết ảnh
  const handleShare = () => {
    if (!currentItem?.src) return
    play('click')
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentItem.src)
      showToast(t('polaroid.copied'))
    } else {
      showToast(currentItem.src)
    }
  }

  // 3D Parallax Tilt theo chuột (chỉ áp dụng khi không zoom)
  const handleMouseMove = (e) => {
    if (zoomLevel > 1) {
      // Đang zoom: xử lý pan drag nếu đang giữ chuột
      if (isDragging.current) {
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
        dragStart.current = { x: e.clientX, y: e.clientY }
      }
      return
    }

    const { innerWidth: w, innerHeight: h } = window
    const xRatio = (e.clientX - w / 2) / (w / 2)
    const yRatio = (e.clientY - h / 2) / (h / 2)
    // Giới hạn góc nghiêng nhẹ nhàng 4 độ tạo cảm giác cầm ảnh trên tay
    setCardTilt({
      rx: -yRatio * 5,
      ry: xRatio * 6,
    })
  }

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      isDragging.current = true
      dragStart.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    if (!isOpen) return

    const onKey = (e) => {
      // Nếu đang focus trong input thì bỏ qua
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handlePrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNext()
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
        case '_':
          e.preventDefault()
          handleZoomOut()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          handleRotate()
          break
        case 'i':
        case 'I':
          e.preventDefault()
          toggleInfo()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'Escape':
          e.preventDefault()
          if (showInfo) {
            setShowInfo(false)
          } else {
            handleClose()
          }
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, showInfo, handlePrev, handleNext, handleClose])

  // Tự động cuộn thumbnail filmstrip tới ảnh đang active
  useEffect(() => {
    if (filmstripRef.current) {
      const activeEl = filmstripRef.current.querySelector('.filmstrip-thumb.active')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [polaroidIndex])

  // Lắng nghe thay đổi Fullscreen API
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  if (!isOpen || !currentItem) return null

  const titleText = (currentItem.title?.[lang] || currentItem.title?.vi || 'Kỷ niệm').normalize('NFC')
  const subtitleText = (currentItem.subtitle?.[lang] || currentItem.subtitle?.vi || '').normalize('NFC')
  const noteText = (currentItem.note?.[lang] || currentItem.note?.vi || '').normalize('NFC')
  const locationText = (currentItem.location?.[lang] || currentItem.location?.vi || '').normalize('NFC')
  const categoryText = (currentItem.category?.[lang] || currentItem.category?.vi || 'Kỷ niệm').normalize('NFC')

  return (
    <div
      ref={containerRef}
      className="polaroid-lightbox"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        const dy = e.changedTouches[0].clientY - touchStartY.current
        if (Math.abs(dx) > 45 && Math.abs(dy) < 60) {
          dx < 0 ? handleNext() : handlePrev()
        }
      }}
    >
      {/* ── 1. AMBIENT BACKDROP GLOW (Màu sáng mềm lấy cảm hứng từ ảnh) ── */}
      <div 
        className="polaroid-backdrop-glow"
        style={{
          '--tape-accent': currentItem.tapeColor || '#f6bd60',
        }}
      />

      {/* ── 2. TOP COMMAND BAR (Thanh công cụ Glassmorphism nổi) ── */}
      <header className="polaroid-topbar" onClick={(e) => e.stopPropagation()}>
        {/* Counter & Category Pill */}
        <div className="polaroid-badge-group">
          <div className="polaroid-counter-badge">
            <Camera size={14} className="icon-camera" />
            <span className="counter-text">{polaroidIndex + 1} / {total}</span>
          </div>
          <span className="polaroid-tag-badge">
            <Sparkles size={12} />
            {categoryText}
          </span>
        </div>

        {/* Action Button Strip */}
        <div className="polaroid-actions">
          {/* Zoom In */}
          <button
            className={`action-btn ${zoomLevel > 1 ? 'active' : ''}`}
            onClick={zoomLevel >= 2.4 ? handleResetZoom : handleZoomIn}
            title={zoomLevel >= 2.4 ? t('polaroid.reset_zoom') : t('polaroid.zoom_in')}
          >
            {zoomLevel >= 2.4 ? <Minimize2 size={18} /> : <ZoomIn size={18} />}
            <span className="btn-label">{zoomLevel}x</span>
          </button>

          {/* Zoom Out */}
          {zoomLevel > 1 && (
            <button
              className="action-btn"
              onClick={handleZoomOut}
              title={t('polaroid.zoom_out')}
            >
              <ZoomOut size={18} />
            </button>
          )}

          {/* Rotate */}
          <button
            className="action-btn"
            onClick={handleRotate}
            title={t('polaroid.rotate')}
          >
            <RotateCw size={18} />
          </button>

          {/* Story / Info Toggle */}
          <button
            className={`action-btn ${showInfo ? 'active' : ''}`}
            onClick={toggleInfo}
            title={t('polaroid.info')}
          >
            <Info size={18} />
            <span className="btn-label-desktop">{t('polaroid.read_story')}</span>
          </button>

          {/* Download Original */}
          <button
            className="action-btn"
            onClick={handleDownload}
            title={t('polaroid.download')}
          >
            <Download size={18} />
          </button>

          {/* Copy Link / Share */}
          <button
            className="action-btn"
            onClick={handleShare}
            title={t('polaroid.share')}
          >
            <Share2 size={18} />
          </button>

          {/* Fullscreen */}
          <button
            className="action-btn hide-on-mobile"
            onClick={toggleFullscreen}
            title={isFullscreen ? t('polaroid.exit_fullscreen') : t('polaroid.fullscreen')}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* Close */}
          <button
            className="action-btn close-btn"
            onClick={handleClose}
            title={t('polaroid.close')}
            aria-label={t('polaroid.close')}
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* ── 3. MAIN STAGE (Vùng hiển thị thẻ ảnh trung tâm) ── */}
      <main 
        className="polaroid-stage"
        onClick={(e) => {
          // Click ra ngoài thẻ để đóng lightbox
          if (e.target.classList.contains('polaroid-stage')) {
            handleClose()
          }
        }}
      >
        {/* Navigation Arrow: Prev */}
        {total > 1 && (
          <button
            className="polaroid-nav-btn nav-prev"
            onClick={(e) => { e.stopPropagation(); handlePrev() }}
            title={t('polaroid.prev')}
            aria-label={t('polaroid.prev')}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Polaroid Card Container */}
        <div
          key={animKey}
          className={`polaroid-card-wrapper polaroid-slide-${slideDir || 'in'} ${zoomLevel > 1 ? 'is-zoomed' : ''}`}
          style={{
            transform: zoomLevel > 1
              ? `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px) rotate(${rotationDeg}deg)`
              : `perspective(1200px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg) rotate(${currentItem.rotation || 0}deg)`,
            cursor: zoomLevel > 1 ? (isDragging.current ? 'grabbing' : 'grab') : 'default',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="polaroid-card">
            {/* Washi Tape Accent trên đỉnh thẻ */}
            <div 
              className="polaroid-card-tape" 
              style={{ backgroundColor: currentItem.tapeColor || '#f6bd60' }}
            />

            {/* Photo Inset Frame */}
            <div className="polaroid-photo-frame">
              <img
                src={currentItem.src}
                alt={titleText}
                className="polaroid-photo-img"
                draggable={false}
                onDoubleClick={() => {
                  if (zoomLevel === 1) handleZoomIn()
                  else handleResetZoom()
                }}
              />
              
              {/* Subtle vintage photo gloss glare */}
              <div className="polaroid-photo-glare" />
            </div>

            {/* Polaroid Bottom Chin — Chú thích viết tay & Logo hoài niệm */}
            <footer className="polaroid-card-footer">
              <div className="polaroid-caption-block">
                <h3 className="polaroid-caption-title">{titleText}</h3>
                {subtitleText && <p className="polaroid-caption-sub">{subtitleText}</p>}
              </div>

              <div className="polaroid-footer-meta">
                <span className="polaroid-date-stamp">
                  <Calendar size={11} /> {currentItem.date}
                </span>

                <button 
                  className="polaroid-story-trigger"
                  onClick={toggleInfo}
                  title={t('polaroid.info')}
                >
                  <BookOpen size={12} />
                  <span>{showInfo ? 'Ẩn câu chuyện' : 'Xem câu chuyện'}</span>
                </button>
              </div>
            </footer>
          </div>
        </div>

        {/* Navigation Arrow: Next */}
        {total > 1 && (
          <button
            className="polaroid-nav-btn nav-next"
            onClick={(e) => { e.stopPropagation(); handleNext() }}
            title={t('polaroid.next')}
            aria-label={t('polaroid.next')}
          >
            <ChevronRight size={28} />
          </button>
        )}
      </main>

      {/* ── 4. STORY & DETAIL DRAWER (Bảng Ký Ức & Thông Tin Chi Tiết) ── */}
      <aside 
        className={`polaroid-story-drawer ${showInfo ? 'open' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-kicker">
              <Sparkles size={13} className="text-amber" />
              {t('polaroid.story_title')}
            </span>
            <h2 className="drawer-heading">{titleText}</h2>
          </div>
          <button 
            className="drawer-close-btn"
            onClick={() => setShowInfo(false)}
            aria-label="Đóng bảng thông tin"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Heartfelt Note Paragraph */}
          {noteText && (
            <div className="drawer-section story-note-box">
              <CornerDownRight size={16} className="note-quote-icon" />
              <p className="story-note-text">{noteText}</p>
            </div>
          )}

          {/* Structured Metadata Grid */}
          <div className="drawer-meta-grid">
            {/* Thời gian */}
            <div className="meta-card">
              <div className="meta-card-icon"><Calendar size={16} /></div>
              <div className="meta-card-content">
                <span className="meta-label">{t('polaroid.date')}</span>
                <span className="meta-value">{currentItem.date}</span>
              </div>
            </div>

            {/* Địa điểm */}
            {locationText && (
              <div className="meta-card">
                <div className="meta-card-icon"><MapPin size={16} /></div>
                <div className="meta-card-content">
                  <span className="meta-label">{t('polaroid.location')}</span>
                  <span className="meta-value">{locationText}</span>
                </div>
              </div>
            )}

            {/* Chủ đề */}
            <div className="meta-card">
              <div className="meta-card-icon"><Sparkles size={16} /></div>
              <div className="meta-card-content">
                <span className="meta-label">{t('polaroid.category')}</span>
                <span className="meta-value">{categoryText}</span>
              </div>
            </div>

            {/* Camera / Filter Tone */}
            {currentItem.camera && (
              <div className="meta-card">
                <div className="meta-card-icon"><Camera size={16} /></div>
                <div className="meta-card-content">
                  <span className="meta-label">{t('polaroid.camera')}</span>
                  <span className="meta-value">{currentItem.camera}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions inside Drawer */}
          <div className="drawer-quick-actions">
            <button className="drawer-action-btn primary" onClick={handleDownload}>
              <Download size={16} />
              <span>{t('polaroid.download')}</span>
            </button>
            <button className="drawer-action-btn" onClick={handleShare}>
              <Share2 size={16} />
              <span>{t('polaroid.share')}</span>
            </button>
          </div>
        </div>

        <div className="drawer-footer-hint">
          <span>{t('polaroid.keyboard_hint')}</span>
        </div>
      </aside>

      {/* ── 5. BOTTOM FILMSTRIP (Dải phim Thumbnail trực quan) ── */}
      {total > 1 && showFilmstrip && (
        <footer className="polaroid-filmstrip-bar" onClick={(e) => e.stopPropagation()}>
          <div className="filmstrip-scroll" ref={filmstripRef}>
            {galleryItems.map((item, idx) => {
              const isActive = idx === polaroidIndex
              return (
                <button
                  key={item.id || idx}
                  className={`filmstrip-thumb ${isActive ? 'active' : ''}`}
                  onClick={() => handleJumpTo(idx)}
                  title={`${idx + 1}. ${item.title?.[lang] || item.title?.vi || ''}`}
                >
                  <div className="thumb-polaroid-frame">
                    <img src={item.src} alt="" className="thumb-img" loading="lazy" />
                    <span className="thumb-idx">{idx + 1}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </footer>
      )}

      {/* ── 6. FLOATING TOAST NOTIFICATION ── */}
      {toastMsg && (
        <div className="polaroid-toast">
          <Check size={16} className="toast-check" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  )
}

export default PolaroidLightbox
