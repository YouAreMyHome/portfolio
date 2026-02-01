import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import useStore from '../../store/useStore'

/**
 * InteractiveObject - Wrapper cho các đồ vật có thể tương tác
 * 
 * Features:
 * - Hover effect: subtle Y lift (không scale để tránh bị tường che)
 * - Click handler: mở panel tương ứng
 * - Cursor change on hover
 * - Disabled when another panel is active
 */
function InteractiveObject({ 
  children, 
  name,
  panelId,
  onClick,
  hoverLift = 0.08, // Lift lên nhẹ thay vì scale
  ...props 
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const baseY = useRef(0)
  const setHoveredObject = useStore((state) => state.setHoveredObject)
  const setActivePanel = useStore((state) => state.setActivePanel)
  const activePanel = useStore((state) => state.activePanel)
  
  // Vô hiệu hóa tất cả khi có bất kỳ panel nào đang active
  const isDisabled = activePanel !== null
  
  // Store original Y position
  useEffect(() => {
    if (groupRef.current) {
      baseY.current = groupRef.current.position.y
    }
  }, [])
  
  // Reset hover state khi bị disabled
  useEffect(() => {
    if (isDisabled && hovered) {
      setHovered(false)
      setHoveredObject(null)
      document.body.style.cursor = 'auto'
    }
  }, [isDisabled, hovered, setHoveredObject])
  
  // Smooth lift animation (thay vì scale)
  useFrame(() => {
    if (groupRef.current) {
      const targetY = hovered && !isDisabled ? baseY.current + hoverLift : baseY.current
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.15
    }
  })
  
  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    setHovered(true)
    setHoveredObject(name)
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    setHovered(false)
    setHoveredObject(null)
    document.body.style.cursor = 'auto'
  }
  
  const handleClick = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    if (onClick) {
      onClick()
    } else if (panelId) {
      setActivePanel(panelId)
    }
  }
  
  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      {...props}
    >
      {children}
    </group>
  )
}

export default InteractiveObject
