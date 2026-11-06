import { useRef, useState, useEffect, memo } from 'react'
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
 * - Idle throttling: không tính toán trong useFrame khi vật thể đã ở vị trí tĩnh
 */
function InteractiveObject({ 
  children, 
  name,
  panelId,
  onClick,
  hoverLift = 0.08,
  ...props 
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const baseY = useRef(0)
  const isMoving = useRef(false)
  const setHoveredObject = useStore((state) => state.setHoveredObject)
  const setActivePanel = useStore((state) => state.setActivePanel)
  const isPanelActive = useStore((state) => state.activePanel !== null)
  
  // Vô hiệu hóa tất cả khi có bất kỳ panel nào đang active
  const isDisabled = isPanelActive
  
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
      isMoving.current = true
      setHoveredObject(null)
      document.body.style.cursor = 'auto'
    }
  }, [isDisabled, hovered, setHoveredObject])
  
  // Smooth lift animation with Delta-timed Exponential Damping (Framerate-independent)
  useFrame((_, delta) => {
    if (!groupRef.current || !isMoving.current) return

    const targetY = hovered && !isDisabled ? baseY.current + hoverLift : baseY.current
    const diff = targetY - groupRef.current.position.y

    if (Math.abs(diff) > 0.0002) {
      const factor = 1 - Math.exp(-9 * delta)
      groupRef.current.position.y += diff * factor
    } else {
      groupRef.current.position.y = targetY
      isMoving.current = false // Đã dừng lại vị trí đích, ngắt useFrame tính toán
    }
  })
  
  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    setHovered(true)
    isMoving.current = true
    setHoveredObject(name)
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    setHovered(false)
    isMoving.current = true
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

export default memo(InteractiveObject)
