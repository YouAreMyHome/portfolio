import { useRef, useState, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import useStore from '../../store/useStore'
import { cameraState } from '../../utils/cameraState'

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
  const velocityY = useRef(0)
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

  // Damped Spring Physics (Vật lý Lò xo Giảm chấn nảy nhẹ đàn hồi chuẩn Awwwards)
  useFrame((_, delta) => {
    if (!groupRef.current || !isMoving.current) return

    // Giới hạn delta an toàn để tránh nảy văng khi tab bị lag
    const dt = Math.min(delta, 0.05)
    const targetY = hovered && !isDisabled ? baseY.current + hoverLift : baseY.current
    const displacement = targetY - groupRef.current.position.y

    // Hệ số vật lý đàn hồi
    const springStiffness = 180
    const damping = 18

    // F = -k*x - c*v
    const springForce = displacement * springStiffness
    const dampingForce = -damping * velocityY.current
    const acceleration = springForce + dampingForce

    velocityY.current += acceleration * dt
    groupRef.current.position.y += velocityY.current * dt

    // Kiểm tra điểm dừng nghỉ tĩnh
    if (Math.abs(displacement) < 0.0002 && Math.abs(velocityY.current) < 0.001) {
      groupRef.current.position.y = targetY
      velocityY.current = 0
      isMoving.current = false // Đã dừng lại vị trí đích, ngắt useFrame tính toán
    }
  })

  const pointerDownPos = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    // Bỏ qua hover khi chuột đang bị nhấn giữ (đang drag/xoay camera) hoặc OrbitControls đang hoạt động
    if (e.nativeEvent?.buttons > 0 || cameraState.isInteracting) return
    if (hovered) return
    setHovered(true)
    isMoving.current = true
    setHoveredObject(name)
    document.body.style.cursor = 'pointer'
  }


  const handlePointerOut = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    if (!hovered) return
    setHovered(false)
    isMoving.current = true
    setHoveredObject(null)
    document.body.style.cursor = 'auto'
  }


  const handleClick = (e) => {
    e.stopPropagation()
    if (isDisabled) return
    // Nếu người dùng vừa kéo chuột (>6px) để xoay camera thì không kích hoạt click
    const dx = Math.abs(e.clientX - pointerDownPos.current.x)
    const dy = Math.abs(e.clientY - pointerDownPos.current.y)
    if (dx > 6 || dy > 6 || cameraState.isInteracting) return

    if (onClick) {
      onClick()
    } else if (panelId) {
      setActivePanel(panelId)
    }
  }


  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
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
