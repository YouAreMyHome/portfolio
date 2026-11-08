import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import useStore from '../../store/useStore'
import * as THREE from 'three'
import { cameraState } from '../../utils/cameraState'

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

/**
 * Tính toán độ phóng đại trực giao (Orthographic Zoom) thích ứng hoàn hảo cho mọi tỉ lệ màn hình:
 * - Desktop (width >= 1024, aspect >= 1.25): Giữ nguyên baseZoom chuẩn
 * - Tablet (aspect 0.65 - 1.25): Co giãn theo chiều ngang để không bị cắt cạnh phòng
 * - Mobile Portrait (aspect < 0.65, màn hình hẹp như iPhone): 
 *   Phòng 8x8m có đường chéo hiển thị ~10.2m, zoom = width / 10.0 (khoảng 36-43)
 *   giúp toàn bộ khối diorama nổi trọn vẹn trong khung nhìn với viền thở cân đối.
 */
function calculateResponsiveZoom(baseZoom, width, height) {
  if (!width || !height) return baseZoom
  const aspect = width / height

  if (aspect < 0.65) {
    // Mobile dọc hẹp (iPhone 375-430px)
    const fitZoom = width / 10.0
    const ratio = fitZoom / 95
    return Math.max(32, Math.round(baseZoom * ratio))
  } else if (aspect < 1.0) {
    // Tablet dọc / màn hình gập
    const fitZoom = width / 10.8
    const ratio = fitZoom / 95
    return Math.max(46, Math.round(baseZoom * ratio))
  } else if (aspect < 1.3) {
    // Màn hình vuông / Tablet ngang
    const fitZoom = width / 12.0
    const ratio = Math.min(1.0, fitZoom / 95)
    return Math.max(60, Math.round(baseZoom * ratio))
  }
  return baseZoom
}

function CameraController({ controlsRef }) {
  const { camera, size } = useThree()
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

  // Parallax offset mềm mại & base target tham chiếu
  const parallaxOffset = useRef(new THREE.Vector3())
  const parallaxBaseTarget = useRef(new THREE.Vector3().copy(CAMERA_VIEWS.default.target))
  const isParallaxBaseCaptured = useRef(false)
  const isTouchDevice = useRef(
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0))
  )

  // Cú máy mở đầu điện ảnh (Cinematic Intro Fly-in khi căn phòng được xây cất từ hư vô)
  useEffect(() => {
    const targetZoom = calculateResponsiveZoom(CAMERA_VIEWS.default.zoom, size.width, size.height)
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
  }, [camera, size.width, size.height])

  // Lắng nghe thay đổi kích thước cửa sổ (xoay ngang/dọc điện thoại) khi đang ở góc nhìn toàn cảnh
  useEffect(() => {
    if (activePanel !== null || animationRef.current.isAnimating) return
    const idealZoom = calculateResponsiveZoom(CAMERA_VIEWS.default.zoom, size.width, size.height)

    gsap.to(camera, {
      zoom: idealZoom,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => camera.updateProjectionMatrix(),
    })
    savedCameraState.current.zoom = idealZoom
  }, [size.width, size.height, activePanel, camera])

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
      anim.endZoom = calculateResponsiveZoom(targetView.zoom, size.width, size.height)
    } else {
      // Khôi phục về vị trí tổng quan với zoom responsive thích ứng
      const restore = savedCameraState.current || CAMERA_VIEWS.default
      const defaultResponsiveZoom = calculateResponsiveZoom(CAMERA_VIEWS.default.zoom, size.width, size.height)
      anim.endPosition.copy(restore.position)
      anim.endTarget.copy(restore.target)
      anim.endZoom = defaultResponsiveZoom
    }

    anim.startTime = performance.now()
    anim.isAnimating = true
  }, [activePanel, camera, controlsRef, size.width, size.height])

  // Frame Loop: Animation nội suy và Mouse Parallax
  useFrame((state, delta) => {
    const anim = animationRef.current

    if (anim.isAnimating) {
      isParallaxBaseCaptured.current = false
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
      }

      if (progress >= 1) {
        anim.isAnimating = false
        if (controlsRef.current) {
          parallaxBaseTarget.current.copy(controlsRef.current.target)
          isParallaxBaseCaptured.current = true
        }
      }
      return
    }

    // ── DYNAMIC MOUSE PARALLAX (Hiệu ứng căn phòng thở theo con trỏ chuột) ──
      // Chỉ kích hoạt khi:
      // 1. Ở góc nhìn toàn cảnh (activePanel === null)
      // 2. Không phải thiết bị cảm ứng (tránh bị kéo theo vị trí ngón tay vừa chạm)
      // 3. Người dùng KHÔNG đang tương tác hoặc vừa lắc/xoay camera (chờ quán tính OrbitControls tắt hẳn >= 600ms)
      // 4. OrbitControls đang ở trạng thái nghỉ (state === -1)
      if (
        !activePanel &&
        !isTouchDevice.current &&
        controlsRef.current &&
        !cameraState.isInteracting &&
        controlsRef.current.state === -1
      ) {
        const timeSinceLastAction = performance.now() - cameraState.lastInteractionTime
        if (timeSinceLastAction < 600) {
          // Đang trong thời gian OrbitControls giảm tốc quán tính, không can thiệp để tránh xung đột giật hình
          isParallaxBaseCaptured.current = false
          return
        }

        // Ghi nhận tâm ngắm tĩnh làm điểm tựa thở tự nhiên
        if (!isParallaxBaseCaptured.current) {
          parallaxBaseTarget.current.copy(controlsRef.current.target)
          isParallaxBaseCaptured.current = true
        }

        const px = state.pointer.x
        const py = state.pointer.y

        // Tính mục tiêu trôi vi mô (±0.22 unit trong không gian 3D)
        _parallaxTarget.set(px * 0.22, -py * 0.14, -px * 0.22)

        // Damping theo hàm mũ không phụ thuộc tốc độ khung hình
        const factor = 1 - Math.exp(-3.0 * delta)
        parallaxOffset.current.lerp(_parallaxTarget, factor)

        // Dịch chuyển nhẹ tâm nhìn OrbitControls quanh điểm ngắm hiện tại
        _tempCamTarget.copy(parallaxBaseTarget.current).add(parallaxOffset.current)
        controlsRef.current.target.lerp(_tempCamTarget, factor)
        // Lưu ý: Không gọi controlsRef.current.update() ở đây vì OrbitControls đã tự gọi trong useFrame riêng!
      } else {
        isParallaxBaseCaptured.current = false
      }
    })

  return null
}

export default CameraController
