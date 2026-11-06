import { useRef, memo } from 'react'
import * as THREE from 'three'
import { ContactShadows } from '@react-three/drei'
import InteractiveObject from './InteractiveObject'
import useStore from '../../store/useStore'

// Import all room components
import Walls from './Walls'
import Floor from './Floor'
import Window from './Window'
import DeskSetup from './DeskSetup'
import Chair from './Chair'
import Cabinet from './Cabinet'
import Shelf from './Shelf'
import Clock from './Clock'
import TVSetup from './TVSetup'
import Bed from './Bed'
import Plant from './Plant'
import Cat from './Cat'
import PlanBoard from './PlanBoard'
import WallDecorations from './WallDecorations'
import FloorDetails from './FloorDetails'
import RecordPlayer from './RecordPlayer'
import PixelPerson from './PixelPerson'
import VolumetricAtmosphere from './VolumetricAtmosphere'

// Flyweight Geometries & Materials for Room level fixtures
const deskLampHitGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3)
const deskLampHitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
const guestbookPlaneGeo = new THREE.PlaneGeometry(0.2, 0.2)
const guestbookPinGeo = new THREE.SphereGeometry(0.014, 8, 8)
const guestbookNoteMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.7 })
const guestbookPinMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.2, metalness: 0.4 })

/**
 * Room Component - Căn phòng 3D Pixel Diorama bóng bẩy
 * Tối ưu hóa: Không subscribe store toàn cục để tránh re-render toàn bộ 20 child items
 */
function Room({ graphics = {} }) {
  const roomRef = useRef()

  const handleWindowClick = () => {
    const cycle = { morning: 'sunset', sunset: 'rainy', rainy: 'night', night: 'morning' }
    const state = useStore.getState()
    const current = state.isNightMode ? 'night' : state.lightingPreset || 'morning'
    const next = cycle[current] || 'sunset'
    state.setLightingPreset(next)
  }

  const handleToggleDeskLamp = () => useStore.getState().toggleDeskLamp()
  const handleToggleClockTime = () => useStore.getState().toggleClockTime()
  const handleOpenGuestbook = () => useStore.getState().openGuestbook()
  const handleToggleRecordPlayer = () => useStore.getState().toggleRecordPlayer()
  const handleClickCat = () => useStore.getState().clickCat()

  const {
    contactShadows = true,
    contactShadowFramesMain = 1,
    contactShadowFramesRug = 1,
    contactShadowResolutionMain = 512,
    contactShadowResolutionRug = 256,
  } = graphics

  return (
    <group ref={roomRef}>
      {/* Structure */}
      <Walls />
      <Floor />

      {/* Hiệu ứng không khí: Luồng sáng, hơi nước cà phê, mưa */}
      <VolumetricAtmosphere />

      {/* Window - Chuyển đổi linh hoạt 4 khung cảnh ánh sáng */}
      <InteractiveObject name="window" onClick={handleWindowClick} hoverLift={0.02}>
        <Window />
      </InteractiveObject>

      {/* PC Setup - Projects */}
      <InteractiveObject name="pc" panelId="projects">
        <DeskSetup />
      </InteractiveObject>

      {/* Đèn bàn làm việc tương tác (Click vào khu vực đèn để bật/tắt) */}
      <InteractiveObject name="desklamp" onClick={handleToggleDeskLamp} hoverLift={0.02}>
        <mesh position={[-2.45, 1.1, -2.4]} visible={false} geometry={deskLampHitGeo} material={deskLampHitMat} />
      </InteractiveObject>

      {/* Chair - About Me */}
      <InteractiveObject name="chair" panelId="about">
        <Chair />
      </InteractiveObject>

      <Cabinet />
      <Shelf />

      {/* Clock - Show current time */}
      <InteractiveObject name="clock" onClick={handleToggleClockTime} hoverLift={0.05}>
        <Clock />
      </InteractiveObject>

      {/* TV - Playground (Arcade Retro) */}
      <InteractiveObject name="tv" panelId="playground">
        <TVSetup />
      </InteractiveObject>

      {/* Bed - Contact */}
      <InteractiveObject name="bed" panelId="contact">
        <Bed />
      </InteractiveObject>

      {/* Plan Board - Kanban (Trello-style) */}
      <PlanBoard />

      {/* Mẩu giấy nhớ ghim trên tường cạnh bảng - Click mở Guestbook */}
      <InteractiveObject name="guestbook" onClick={handleOpenGuestbook} hoverLift={0.04}>
        <group position={[-3.88, 1.35, 1.05]}>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow geometry={guestbookPlaneGeo} material={guestbookNoteMat} />
          <mesh position={[0.006, 0.07, 0]} rotation={[0, 0, 0]} geometry={guestbookPinGeo} material={guestbookPinMat} />
        </group>
      </InteractiveObject>

      {/* Decorations */}
      <Plant position={[-3.3, 0, 3.2]} variant="bush" />
      <Plant position={[2.25, 0, -3.38]} variant="tropical" />
      <WallDecorations />
      <FloorDetails />

      {/* Record Player - Music */}
      <InteractiveObject name="recordplayer" onClick={handleToggleRecordPlayer} hoverLift={0.05}>
        <RecordPlayer position={[-0.3, 0, -3.6]} />
      </InteractiveObject>

      {/* Cat - Easter Egg */}
      <InteractiveObject name="cat" onClick={handleClickCat} hoverLift={0.12}>
        <Cat position={[0.3, 0.007, 0.5]} scale={0.8} />
      </InteractiveObject>

      {/* Pixel Person - Chủ phòng (Tự động di chuyển và diễn hoạt theo kịch bản Sáng, Chiều, Mưa, Đêm) */}
      <PixelPerson />

      {/* Contact shadows (Ground AO mềm mại, bổ trợ tiếp xúc kẽ chân đồ vật) */}
      {contactShadows && (
        <>
          <ContactShadows
            position={[0, -0.375, 0]}
            opacity={0.32}
            scale={10.5}
            blur={2.2}
            far={0.6}
            resolution={contactShadowResolutionMain}
            color="#261a12"
            frames={contactShadowFramesMain}
          />

          <ContactShadows
            position={[0, 0.0072, 0.3]}
            opacity={0.20}
            scale={3.6}
            blur={1.4}
            far={0.4}
            resolution={contactShadowResolutionRug}
            color="#261a12"
            frames={contactShadowFramesRug}
          />
        </>
      )}
    </group>
  )
}

export default memo(Room)
