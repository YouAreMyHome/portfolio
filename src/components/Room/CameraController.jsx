import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import useStore from '../../store/useStore'
import * as THREE from 'three'

/**
 * CameraController - Điều khiển camera khi xem TV/Game
 * 
 * Sử dụng duration-based animation với easing function mượt mà
 */

// Easing function - ease out cubic (mượt và tự nhiên)
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

// Animation duration (ms)
const ANIMATION_DURATION = 600

// Camera positions
const CAMERA_VIEWS = {
  default: {
    position: new THREE.Vector3(10, 10, 10),
    target: new THREE.Vector3(0, 0.5, 0),
    zoom: 80
  },
  tv: {
    // TV screen ở khoảng y = 2.0 (group y=1.0 + TV offset y=1.0)
    // Camera hạ xuống ngang tầm TV
    position: new THREE.Vector3(1, 1.2, 3),
    target: new THREE.Vector3(1, 1.2, -3.6),
    zoom: 350
  }
}

function CameraController({ controlsRef }) {
  const { camera } = useThree()
  const activePanel = useStore((state) => state.activePanel)
  
  // Animation state
  const animationRef = useRef({
    isAnimating: false,
    startTime: 0,
    startPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    startZoom: 80,
    endPosition: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    endZoom: 80
  })
  
  // Store original camera state when entering TV view
  const savedCameraState = useRef({
    position: CAMERA_VIEWS.default.position.clone(),
    target: CAMERA_VIEWS.default.target.clone(),
    zoom: CAMERA_VIEWS.default.zoom
  })
  
  // Start animation when activePanel changes
  useEffect(() => {
    const anim = animationRef.current
    
    // Capture current state as start
    anim.startPosition.copy(camera.position)
    anim.startZoom = camera.zoom
    if (controlsRef.current) {
      anim.startTarget.copy(controlsRef.current.target)
    }
    
    if (activePanel === 'playground') {
      // Save current state before moving
      savedCameraState.current = {
        position: camera.position.clone(),
        target: controlsRef.current ? 
          controlsRef.current.target.clone() : 
          CAMERA_VIEWS.default.target.clone(),
        zoom: camera.zoom
      }
      
      // Set end to TV view
      anim.endPosition.copy(CAMERA_VIEWS.tv.position)
      anim.endTarget.copy(CAMERA_VIEWS.tv.target)
      anim.endZoom = CAMERA_VIEWS.tv.zoom
    } else if (savedCameraState.current) {
      // Restore to saved state
      anim.endPosition.copy(savedCameraState.current.position)
      anim.endTarget.copy(savedCameraState.current.target)
      anim.endZoom = savedCameraState.current.zoom
    }
    
    // Start animation
    anim.startTime = performance.now()
    anim.isAnimating = true
  }, [activePanel, camera, controlsRef])
  
  // Animate camera
  useFrame(() => {
    const anim = animationRef.current
    if (!anim.isAnimating) return
    
    const elapsed = performance.now() - anim.startTime
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
    const easedProgress = easeOutCubic(progress)
    
    // Interpolate position
    camera.position.lerpVectors(anim.startPosition, anim.endPosition, easedProgress)
    
    // Interpolate zoom
    camera.zoom = anim.startZoom + (anim.endZoom - anim.startZoom) * easedProgress
    camera.updateProjectionMatrix()
    
    // Interpolate OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(anim.startTarget, anim.endTarget, easedProgress)
      controlsRef.current.update()
    }
    
    // Check if animation is done
    if (progress >= 1) {
      anim.isAnimating = false
    }
  })
  
  return null
}

export default CameraController
