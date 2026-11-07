import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import useStore from '../../store/useStore'
import * as THREE from 'three'

/**
 * CameraController - Điều khiển chuyển động Camera Điện ảnh (Cinematic Camera Choreography)
 * 
 * Tính năng chuẩn Awwwards:
 * 1. Multi-View Dolly Zoom: Lướt máy quay êm ái vào từng khu vực tương tác (PC Desk, TV Arcade, Ghế, Giường)
 * 2. Dynamic Mouse Parallax: Căn phòng "thở" nhẹ nhàng theo con trỏ chuột khi ở góc nhìn toàn cảnh
 * 3. Zero GC Allocation: Tái sử dụng Vector3 đệm theo tiêu chuẩn WebGL hiệu năng cao
 */

// Easing function - ease in out cubic (khởi đầu êm ái, chuyển động mượt mà, giảm tốc tinh tế)
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Animation duration (ms)
const ANIMATION_DURATION = 750

// Điểm ngắm và vị trí camera cho từng phân khu trong phòng
const CAMERA_VIEWS = {
  default: {
    position: new THREE.Vector3(10, 10, 10),
    target: new THREE.Vector3(0, 0.5, 0),
    zoom: 95,
  },
  playground: {
    position: new THREE.Vector3(1, 1.2, 3),
    target: new THREE.Vector3(1, 1.2, -3.6),
    zoom: 350,
  },
  projects: {
    // Zoom áp sát khu vực bàn làm việc và dual monitor PC
    position: new THREE.Vector3(-1.35, 1.55, -1.05),
    target: new THREE.Vector3(-2.45, 1.15, -2.45),
    zoom: 220,
  },
  about: {
    // Focus vào khu vực ghế làm việc và góc thư giãn
    position: new THREE.Vector3(3.5, 3.2, 3.5),
    target: new THREE.Vector3(-1.4, 0.8, -1.2),
    zoom: 125,
  },
  contact: {
    // Focus vào khu vực giường ngủ ấm áp
    position: new THREE.Vector3(2.5, 3.5, 4.2),
    target: new THREE.Vector3(-2.2, 0.6, 1.8),
    zoom: 125,
  },
}

// Static zero-allocation buffer objects
const _tempCamTarget = new THREE.Vector3()
const _parallaxTarget = new THREE.Vector3()

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
    endZoom: 80,
  })

  // Lưu trạng thái trước khi zoom để khôi phục chính xác
  const savedCameraState = useRef({
    position: CAMERA_VIEWS.default.position.clone(),
    target: CAMERA_VIEWS.default.target.clone(),
    zoom: CAMERA_VIEWS.default.zoom,
  })

  // Parallax offset mềm mại
  const parallaxOffset = useRef(new THREE.Vector3())

  // Cú máy mở đầu điện ảnh (Cinematic Intro Fly-in khi căn phòng được xây cất từ hư vô)
  useEffect(() => {
    const targetZoom = camera.zoom || 95
    camera.zoom = targetZoom * 0.72
    camera.position.set(13.5, 14.5, 13.5)
    camera.updateProjectionMatrix()

    gsap.to(camera.position, {
      x: CAMERA_VIEWS.default.position.x,
      y: CAMERA_VIEWS.default.position.y,
      z: CAMERA_VIEWS.default.position.z,
      duration: 2.45,
      ease: 'power2.out',
    })

    gsap.to(camera, {
      zoom: targetZoom,
      duration: 2.45,
      ease: 'power2.out',
      onUpdate: () => camera.updateProjectionMatrix(),
    })
  }, [camera])

  // Bắt đầu hoạt ảnh chuyển góc khi activePanel thay đổi
  useEffect(() => {
    const anim = animationRef.current

    // Ghi nhận vị trí hiện thời làm điểm xuất phát
    anim.startPosition.copy(camera.position)
    anim.startZoom = camera.zoom
    if (controlsRef.current) {
      anim.startTarget.copy(controlsRef.current.target)
    }

    const targetView = CAMERA_VIEWS[activePanel]

    if (targetView) {
      // Nếu trước đó đang ở default view thì lưu lại góc nhìn của người dùng
      if (!anim.isAnimating && activePanel !== null) {
        savedCameraState.current = {
          position: camera.position.clone(),
          target: controlsRef.current ? controlsRef.current.target.clone() : CAMERA_VIEWS.default.target.clone(),
          zoom: camera.zoom,
        }
      }

      anim.endPosition.copy(targetView.position)
      anim.endTarget.copy(targetView.target)
      anim.endZoom = targetView.zoom
    } else {
      // Khôi phục về vị trí tổng quan
      const restore = savedCameraState.current || CAMERA_VIEWS.default
      anim.endPosition.copy(restore.position)
      anim.endTarget.copy(restore.target)
      anim.endZoom = restore.zoom
    }

    anim.startTime = performance.now()
    anim.isAnimating = true
  }, [activePanel, camera, controlsRef])

  // Frame Loop: Animation nội suy và Mouse Parallax
  useFrame((state, delta) => {
    const anim = animationRef.current

    if (anim.isAnimating) {
      const elapsed = performance.now() - anim.startTime
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
      const easedProgress = easeInOutCubic(progress)

      // Nội suy vị trí camera
      camera.position.lerpVectors(anim.startPosition, anim.endPosition, easedProgress)

      // Nội suy độ phóng đại trực giao (Orthographic Zoom)
      camera.zoom = anim.startZoom + (anim.endZoom - anim.startZoom) * easedProgress
      camera.updateProjectionMatrix()

      // Nội suy tâm nhìn của OrbitControls
      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(anim.startTarget, anim.endTarget, easedProgress)
        controlsRef.current.update()
      }

      if (progress >= 1) {
        anim.isAnimating = false
      }
      return
    }

    // ── DYNAMIC MOUSE PARALLAX (Hiệu ứng căn phòng thở theo con trỏ chuột) ──
    // Chỉ kích hoạt khi đang ở góc nhìn toàn cảnh (activePanel === null) và người dùng không chủ động kéo chuột
    if (!activePanel && controlsRef.current && controlsRef.current.state === -1) {
      const px = state.pointer.x
      const py = state.pointer.y

      // Tính mục tiêu trôi vi mô (±0.3 unit trong không gian 3D)
      _parallaxTarget.set(px * 0.25, -py * 0.16, -px * 0.25)

      // Damping theo hàm mũ không phụ thuộc tốc độ khung hình
      const factor = 1 - Math.exp(-3.5 * delta)
      parallaxOffset.current.lerp(_parallaxTarget, factor)

      // Dịch chuyển nhẹ tâm nhìn OrbitControls
      _tempCamTarget.copy(CAMERA_VIEWS.default.target).add(parallaxOffset.current)
      controlsRef.current.target.lerp(_tempCamTarget, factor)
      controlsRef.current.update()
    }
  })

  return null
}

export default CameraController
