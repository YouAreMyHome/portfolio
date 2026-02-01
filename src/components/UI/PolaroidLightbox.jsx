import { X } from 'lucide-react'
import useStore from '../../store/useStore'
import './PolaroidLightbox.css'

/**
 * PolaroidLightbox - Hiển thị ảnh phóng to khi click vào Polaroid
 */
function PolaroidLightbox() {
  const polaroidImage = useStore((state) => state.polaroidImage)
  const closePolaroid = useStore((state) => state.closePolaroid)
  
  if (!polaroidImage) return null
  
  return (
    <div className="polaroid-lightbox" onClick={closePolaroid}>
      <div className="polaroid-lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="polaroid-close" onClick={closePolaroid}>
          <X size={24} />
        </button>
        
        {/* Polaroid frame */}
        <div className="polaroid-frame">
          <img 
            src={polaroidImage} 
            alt="Polaroid" 
            className="polaroid-image"
          />
          <div className="polaroid-caption">
            📸 Click anywhere to close
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolaroidLightbox
