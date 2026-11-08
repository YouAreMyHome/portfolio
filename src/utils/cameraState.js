/**
 * cameraState.js - Trạng thái tương tác máy quay dùng chung cho toàn bộ ứng dụng
 * 
 * Mục tiêu chuẩn WebGL 60 FPS:
 * 1. Zero GC Allocation: Không sinh rác bộ nhớ
 * 2. Zero React Re-renders: Quản lý cờ trạng thái trực tiếp, không kích hoạt re-render React DOM
 * 3. Đồng bộ tương tác giữa OrbitControls, CameraController và InteractiveObject
 */

export const cameraState = {
  // Đang trong thao tác xoay / kéo / zoom của người dùng
  isInteracting: false,
  // Thời điểm cuối cùng phát sinh chuyển động (để chờ OrbitControls quán tính dừng hẳn)
  lastInteractionTime: 0,
}

export function setCameraInteracting(interacting) {
  cameraState.isInteracting = interacting
  cameraState.lastInteractionTime = performance.now()
}

export function updateCameraInteractionTime() {
  cameraState.lastInteractionTime = performance.now()
}

