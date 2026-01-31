import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import useStore from '../../store/useStore'

function CameraController() {
  const { camera, controls } = useThree()
  const activePanel = useStore((state) => state.activePanel)

  useEffect(() => {
    if (!controls) return

    // Default room view
    let targetPos = new THREE.Vector3(10, 10, 10)
    let targetLookAt = new THREE.Vector3(0, 0.5, 0)
    let targetZoom = 80

    if (activePanel === 'playground') {
      // Zoom to TV for Snake Game
      // TV Position: [1, 1.0, -3.6]
      // We want to be directly in front or slightly above/isometric but VERY close.
      // Since it's Orthographic, position direction matters, not distance.
      // But we can shift the camera target to center the TV.

      targetLookAt.set(1, 1.0, -3.6)

      // Keep isometric angle but centered on TV
      targetPos.set(10 + 1, 10 + 1, 10 - 3.6)

      // Zoom in significantly
      targetZoom = 350

      // Disable user controls while playing?
      // controls.enabled = false // Maybe? But we want them to be able to exit.
      // For now, let's keep enabled but maybe restrict?
    } else {
       // Reset to default
       targetPos.set(10, 10, 10)
       targetLookAt.set(0, 0.5, 0)
       targetZoom = 80

       // Re-enable controls if we disabled them
       // controls.enabled = true
    }

    // Kill any running tweens to avoid conflicts
    gsap.killTweensOf(camera.position)
    gsap.killTweensOf(camera)
    gsap.killTweensOf(controls.target)

    // Animate Camera Position
    gsap.to(camera.position, {
      duration: 1.5,
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      ease: 'power3.inOut',
    })

    // Animate Zoom
    gsap.to(camera, {
        zoom: targetZoom,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => {
          camera.updateProjectionMatrix()
        }
    })

    // Animate Controls Target
    gsap.to(controls.target, {
      duration: 1.5,
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      ease: 'power3.inOut',
      onUpdate: () => controls.update()
    })

  }, [activePanel, camera, controls])

  return null
}

export default CameraController
