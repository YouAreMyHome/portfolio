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

/**
 * Room Component - Phase 3: Interaction & Logic
 * 
 * Navigation Map:
 * - PC → Projects
 * - Board → Skills
 * - TV → Playground  
 * - Bed/Phone → Contact
 * - Window → Theme Toggle
 * - Cat → Easter Egg
 */

function Room({ graphics = {} }) {
  const roomRef = useRef()
  const toggleNightMode = useStore((state) => state.toggleNightMode)
  const clickCat = useStore((state) => state.clickCat)
  const toggleRecordPlayer = useStore((state) => state.toggleRecordPlayer)
  const toggleClockTime = useStore((state) => state.toggleClockTime)

  const {
    contactShadows = true,
    contactShadowFramesMain = 120,
    contactShadowFramesRug = 80,
    contactShadowResolutionMain = 512,
    contactShadowResolutionRug = 256
  } = graphics

  return (
    <group ref={roomRef}>
      {/* Structure */}
      <Walls />
      <Floor />
      
      {/* Window - Theme Toggle */}
      <InteractiveObject name="window" onClick={toggleNightMode} hoverLift={0.02}>
        <Window />
      </InteractiveObject>
      
      {/* PC Setup - Projects */}
      <InteractiveObject name="pc" panelId="projects">
        <DeskSetup />
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
      
      {/* TV - Playground */}
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
      
      {/* Decorations */}
      {/* Bush plant – góc trái, gần giường */}
      <Plant position={[-3.3, 0, 3.2]} variant="bush" />
      {/* Tropical plant – góc phải, gần TV */}
      <Plant position={[2.5, 0, -3.2]} variant="tropical" />
      <WallDecorations />
      <FloorDetails />
      
      {/* Record Player - Music (bên trái TV với tủ riêng) */}
      <InteractiveObject name="recordplayer" onClick={toggleRecordPlayer} hoverLift={0.05}>
        <RecordPlayer position={[-0.3, 0.35, -3.6]} />
      </InteractiveObject>
      
      {/* Cat - Easter Egg (ngủ trên thảm giữa phòng) */}
      <InteractiveObject name="cat" onClick={clickCat} hoverLift={0.12}>
        <Cat position={[0.3, 0.05, 0.5]} scale={0.8} />
      </InteractiveObject>

      {/* Pixel Person - Owner avatar standing in room */}
      <PixelPerson 
  position={[1.6, 0, 1.2]} 
  rotation={[0, 0.185, 0]} 
/>
      
      {/* Contact shadows cập nhật hữu hạn để giảm GPU load. */}
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

          {/* Additional contact shadow on top of main rug */}
          <ContactShadows
            position={[0, 0.048, 0]}
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
