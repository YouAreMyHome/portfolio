import { useRef } from 'react'
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

/**
 * Room Component - Căn phòng 3D Pixel Diorama bóng bẩy
 *
 * Navigation Map:
 * - PC → Projects (Portfolio OS)
 * - Board → Skills
 * - TV → Playground (Arcade mini games)
 * - Bed/Phone → Contact
 * - Window → Preset Ánh sáng (Sáng, Hoàng hôn, Mưa, Đêm)
 * - Cat → Easter Egg
 * - Đèn bàn / Bảng ghim → Tương tác tiện ích
 */
function Room({ graphics = {} }) {
  const roomRef = useRef()
  const lightingPreset = useStore((state) => state.lightingPreset)
  const setLightingPreset = useStore((state) => state.setLightingPreset)
  const isNightMode = useStore((state) => state.isNightMode)

  const clickCat = useStore((state) => state.clickCat)
  const toggleRecordPlayer = useStore((state) => state.toggleRecordPlayer)
  const toggleClockTime = useStore((state) => state.toggleClockTime)
  const toggleDeskLamp = useStore((state) => state.toggleDeskLamp)
  const openGuestbook = useStore((state) => state.openGuestbook)

  const handleWindowClick = () => {
    const cycle = { morning: 'sunset', sunset: 'rainy', rainy: 'night', night: 'morning' }
    const current = isNightMode ? 'night' : lightingPreset || 'morning'
    const next = cycle[current] || 'sunset'
    setLightingPreset(next)
  }

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

      {/* Hiệu ứng không khí: Luồng sáng, hạt bụi bay, hơi nước cà phê, mưa */}
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
      <InteractiveObject name="desklamp" onClick={toggleDeskLamp} hoverLift={0.02}>
        <mesh position={[-2.45, 1.1, -2.4]} visible={false}>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </InteractiveObject>

      {/* Chair - About Me */}
      <InteractiveObject name="chair" panelId="about">
        <Chair />
      </InteractiveObject>

      <Cabinet />
      <Shelf />

      {/* Clock - Show current time */}
      <InteractiveObject name="clock" onClick={toggleClockTime} hoverLift={0.05}>
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

      {/* Plan Board - Skills */}
      <InteractiveObject name="board" panelId="skills">
        <PlanBoard />
      </InteractiveObject>

      {/* Mẩu giấy nhớ ghim trên tường cạnh bảng - Click mở Guestbook */}
      <InteractiveObject name="guestbook" onClick={openGuestbook} hoverLift={0.04}>
        <group position={[-3.88, 1.35, 1.05]}>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
            <planeGeometry args={[0.2, 0.2]} />
            <meshStandardMaterial color="#fef08a" roughness={0.7} />
          </mesh>
          <mesh position={[0.006, 0.07, 0]} rotation={[0, 0, 0]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.4} />
          </mesh>
        </group>
      </InteractiveObject>

      {/* Decorations */}
      <Plant position={[-3.3, 0, 3.2]} variant="bush" />
      <Plant position={[2.25, 0, -3.38]} variant="tropical" />
      <WallDecorations />
      <FloorDetails />

      {/* Record Player - Music */}
      <InteractiveObject name="recordplayer" onClick={toggleRecordPlayer} hoverLift={0.05}>
        <RecordPlayer position={[-0.3, 0.35, -3.6]} />
      </InteractiveObject>

      {/* Cat - Easter Egg */}
      <InteractiveObject name="cat" onClick={clickCat} hoverLift={0.12}>
        <Cat position={[0.3, 0.007, 0.5]} scale={0.8} />
      </InteractiveObject>

      {/* Pixel Person - Chủ phòng */}
      <PixelPerson position={[1.15, 0.007, 0.85]} rotation={[0, 0.12, 0]} />

      {/* Contact shadows */}
      {contactShadows && (
        <>
          <ContactShadows
            position={[0, 0.002, 0]}
            opacity={0.55}
            scale={20}
            blur={2}
            far={1.8}
            resolution={contactShadowResolutionMain}
            color="#000000"
            frames={contactShadowFramesMain}
          />

          <ContactShadows
            position={[0, 0.0075, 0]}
            opacity={0.35}
            scale={4}
            blur={1.5}
            far={0.8}
            resolution={contactShadowResolutionRug}
            color="#1a1a1a"
            frames={contactShadowFramesRug}
          />
        </>
      )}
    </group>
  )
}

export default Room
