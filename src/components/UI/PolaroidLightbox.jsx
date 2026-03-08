import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import useStore from '../../store/useStore'
import './PolaroidLightbox.css'

/**
 * PolaroidLightbox — Gallery với prev/next, keyboard ← →, touch swipe
 */
function PolaroidLightbox() {
  const polaroidImages = useStore((s) => s.polaroidImages)
  const polaroidIndex  = useStore((s) => s.polaroidIndex)
  const closePolaroid  = useStore((s) => s.closePolaroid)
  const prevPolaroid   = useStore((s) => s.prevPolaroid)
  const nextPolaroid   = useStore((s) => s.nextPolaroid)

  // Trigger re-mount animation on index change
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState('') // 'left' | 'right'

  const touchStartX = useRef(0)
  const isOpen = polaroidImages.length > 0
  const total  = polaroidImages.length
  const src    = polaroidImages[polaroidIndex] ?? null

  const goNext = () => {
    if (total < 2) return
    setSlideDir('left')
    setAnimKey((k) => k + 1)
    nextPolaroid()
  }
  const goPrev = () => {
    if (total < 2) return
    setSlideDir('right')
    setAnimKey((k) => k + 1)
    prevPolaroid()
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      if (e.key === 'Escape')     closePolaroid()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, total]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen || !src) return null

  return (
    <div
      className="polaroid-lightbox"
      onClick={closePolaroid}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev()
      }}
    >
      {/* Counter badge */}
      {total > 1 && (
        <div className="polaroid-counter" onClick={(e) => e.stopPropagation()}>
          {polaroidIndex + 1} / {total}
        </div>
      )}

      {/* Close */}
      <button
        className="polaroid-close"
        onClick={(e) => { e.stopPropagation(); closePolaroid() }}
        aria-label="Đóng"
      >
        <X size={22} />
      </button>

      {/* Prev arrow */}
      {total > 1 && (
        <button
          className="polaroid-nav polaroid-nav-prev"
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          aria-label="Ảnh trước"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Polaroid frame */}
      <div
        key={animKey}
        className={`polaroid-lightbox-content polaroid-slide-${slideDir || 'in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="polaroid-frame">
          <img src={src} alt={`Ảnh ${polaroidIndex + 1}`} className="polaroid-image" />
          <div className="polaroid-caption">
            {total > 1
              ? `📸 ${polaroidIndex + 1} / ${total} · vuốt hoặc ← → để xem`
              : '📸 Click để đóng'}
          </div>
        </div>
      </div>

      {/* Next arrow */}
      {total > 1 && (
        <button
          className="polaroid-nav polaroid-nav-next"
          onClick={(e) => { e.stopPropagation(); goNext() }}
          aria-label="Ảnh tiếp"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  )
}

export default PolaroidLightbox
