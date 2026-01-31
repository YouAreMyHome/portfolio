import { useThree, useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import useStore from '../../store/useStore'

function CameraController() {
  const { camera, controls } = useThree()
  const activePanel = useStore((state) => state.activePanel)

  useEffect(() => {
    if (!controls) return

    let targetPos = new THREE.Vector3(10, 10, 10) // Default position
    let targetLookAt = new THREE.Vector3(0, 0.5, 0) // Default target
    let targetZoom = 80 // Default zoom

    if (activePanel === 'playground') {
      // Zoom to TV
      // TV Position is roughly [1, 1.0, -3.6]
      // We want to look at the TV
      targetLookAt.set(1, 1.0, -3.6)

      // Move camera effectively "closer" (for shadows/lighting consistency)
      // but mainly we rely on zoom for Orthographic
      // Keeping the same vector direction [10, 10, 10] relative to target?
      // Ortho camera position defines the view direction.
      // Default: position=[10, 10, 10], lookAt=[0, 0, 0] -> Direction is from corner.

      // If we keep the isometric angle, we just shift position to align with TV
      // Vector from 0,0,0 to 10,10,10 is direction.
      // We want to center on [1, 1, -3.6].
      // So new pos = [1, 1, -3.6] + offset

      // However, for playing the game, maybe a straight-on view is better?
      // "Retro console" -> usually playing on screen.
      // Let's try to keep Isometric first, but zoom in A LOT.

      targetPos.set(10 + 1, 10 + 1, 10 - 3.6)
      targetZoom = 350
    } else {
       // Reset to default
       targetPos.set(10, 10, 10)
       targetLookAt.set(0, 0.5, 0)
       targetZoom = 80
    }

    // Animate Camera Position
    gsap.to(camera.position, {
      duration: 1.5,
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      ease: 'power3.inOut',
      // onUpdate is handled by controls? No, we need to update matrices
    })

    // Animate Zoom
    gsap.to(camera, {
        zoom: targetZoom,
        duration: 1.5,
        ease: 'power3.inOut',
        onUpdate: () => camera.updateProjectionMatrix()
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
