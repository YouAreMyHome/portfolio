import { useRef, useEffect, useState, memo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ContactShadows } from '@react-three/drei'
import InteractiveObject from './InteractiveObject'
import useStore from '../../store/useStore'
import { emitSound } from '../../utils/eventBus'

// Import all room architectural & diorama components
import ConstructionBlueprint from './ConstructionBlueprint'
import HolographicScaffold from './HolographicScaffold'
import ConstructionParticles from './ConstructionParticles'
import LaserScanPlane from './LaserScanPlane'
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
 * Room Component - Căn phòng 3D Pixel Diorama ĐƯỢC XÂY TỪ HƯ VÔ (Procedural Construction from Void)
 * Đẳng cấp Awwwards-tier WebGL Architecture:
 * 1. Void & Ghost Scaffold: Lưới toạ độ Blueprint & Khung dây ma trận 3D hiển thị toàn bộ hình bóng phòng
 * 2. Volumetric Laser Slicing: Mặt phẳng laser và hạt năng lượng quét từ sàn lên trần (Y: 0 -> 3.2m)
 * 3. Móng & Lát Sàn: Móng bê tông trồi lên, 16 nan ván sàn gỗ gối sóng thác đổ, thảm cuộn mở bung ra
 * 4. Tường & Cửa Sổ: Vách tường mọc đùn từ chân móng theo tia laser, cửa sổ khoét vách đón nắng
 * 5. Lắp Ráp Cơ Học: Chân kim loại cắm sàn -> Mặt bàn & nệm giường hạ xuống ăn khớp -> Đèn LED khởi động
 * 6. Trang Trí & Cây Cối: Ghim kệ sách, tranh lên tường; cây xanh bung nở tán lá trong chậu
 * 7. Sinh Khí & Cư Dân: Mèo vươn vai trên thảm, Pixel Person hạ cánh chuẩn xác, bắt đầu thở idle
 * 8. Hoàn Thiện: Toàn bộ khung wireframe và tia laser tan biến, mở thẳng vào tương tác tự do 100%!
 */
function Room({ graphics = {} }) {
  const roomRef = useRef()

  // References cho các cấu kiện công nghệ thi công
  const blueprintRef = useRef()
  const scaffoldRef = useRef()
  const particlesRef = useRef()
  const laserPlaneRef = useRef()

  // References cho từng cụm kiến trúc nội thất
  const floorRef = useRef()
  const wallsRef = useRef()
  const windowGroupRef = useRef()
  const bedGroupRef = useRef()
  const deskGroupRef = useRef()
  const cabinetGroupRef = useRef()
  const tvGroupRef = useRef()
  const wallDecorGroupRef = useRef()
  const floorDecorGroupRef = useRef()
  const catGroupRef = useRef()
  const personGroupRef = useRef()
  const atmosphereGroupRef = useRef()
  const shadowsGroupRef = useRef()

  // Quản lý hiển thị của các tầng công nghệ thi công
  const [showConstructionFX, setShowConstructionFX] = useState(true)
  // Chỉ kích hoạt nướng bóng tiếp xúc sau khi nội thất đã hạ cánh vững chãi (triệt tiêu lag frame 1)
  const [bakeShadows, setBakeShadows] = useState(false)

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

  // ── MASTER PROCEDURAL CONSTRUCTION TIMELINE (GSAP) ──
  useEffect(() => {
    // 1. Trạng thái ban đầu: Các khối đặc chưa vật chất hóa
    if (laserPlaneRef.current) {
      laserPlaneRef.current.position.y = 0.01
    }
    if (windowGroupRef.current) {
      windowGroupRef.current.scale.set(0.001, 0.001, 0.001)
    }
    if (bedGroupRef.current) {
      bedGroupRef.current.scale.set(0.001, 0.001, 0.001)
      bedGroupRef.current.position.y = 0.6
    }
    if (deskGroupRef.current) {
      deskGroupRef.current.scale.set(0.001, 0.001, 0.001)
      deskGroupRef.current.position.y = 0.65
    }
    if (cabinetGroupRef.current) {
      cabinetGroupRef.current.scale.set(0.001, 0.001, 0.001)
      cabinetGroupRef.current.position.y = 0.45
    }
    if (tvGroupRef.current) {
      tvGroupRef.current.scale.set(0.001, 0.001, 0.001)
      tvGroupRef.current.position.y = 0.45
    }
    if (wallDecorGroupRef.current) {
      wallDecorGroupRef.current.scale.set(0.001, 0.001, 0.001)
    }
    if (floorDecorGroupRef.current) {
      floorDecorGroupRef.current.scale.set(0.001, 0.001, 0.001)
    }
    if (catGroupRef.current) {
      catGroupRef.current.scale.set(0.001, 0.001, 0.001)
    }
    if (personGroupRef.current) {
      personGroupRef.current.scale.set(0.001, 0.001, 0.001)
      personGroupRef.current.position.y = 1.9
    }
    if (shadowsGroupRef.current) {
      shadowsGroupRef.current.scale.set(0.001, 0.001, 0.001)
    }
    if (atmosphereGroupRef.current) {
      atmosphereGroupRef.current.scale.set(0.001, 0.001, 0.001)
    }

    // 2. Tạo Master Timeline phối khí thi công toàn bộ căn phòng
    const masterTl = gsap.timeline({
      delay: 0.05,
      onComplete: () => {
        // Tự động mở thẳng vào căn phòng, sẵn sàng tương tác 100%
        useStore.getState().enterRoom()
        useStore.getState().completeWelcomeExit()
        setShowConstructionFX(false)
        emitSound('click')
      },
    })

    // [0.1s - 1.9s] Mặt phẳng Laser quét toàn phòng từ Y=0 lên Y=3.2m
    if (laserPlaneRef.current) {
      masterTl.to(
        laserPlaneRef.current.position,
        {
          y: 3.2,
          duration: 1.8,
          ease: 'power1.inOut',
        },
        0.12
      ).to(
        laserPlaneRef.current.scale,
        {
          x: 0.001,
          y: 0.001,
          z: 0.001,
          duration: 0.25,
          ease: 'power2.in',
        },
        1.92
      )
    }

    // [0.65s] Cửa sổ kính khoét vách tường trái đón ánh nắng
    if (windowGroupRef.current) {
      masterTl.to(
        windowGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.48, ease: 'back.out(1.6)' },
        0.65
      )
    }

    // [0.78s] Khung giường & Nệm Japandi hạ cánh ăn khớp vào góc phòng
    if (bedGroupRef.current) {
      masterTl.to(
        bedGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.58, ease: 'back.out(1.6)' },
        0.78
      ).to(
        bedGroupRef.current.position,
        { y: 0, duration: 0.58, ease: 'bounce.out' },
        0.78
      )
    }

    // [0.95s] Bàn PC, Ghế công thái học & Màn hình cắm chân xuống sàn gỗ
    if (deskGroupRef.current) {
      masterTl.to(
        deskGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.5)' },
        0.95
      ).to(
        deskGroupRef.current.position,
        { y: 0, duration: 0.6, ease: 'bounce.out' },
        0.95
      )
    }

    // [1.12s] Tủ ngăn kéo & Kệ TV trượt vào vị trí sát tường
    if (cabinetGroupRef.current) {
      masterTl.to(
        cabinetGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.48, ease: 'back.out(1.6)' },
        1.12
      ).to(
        cabinetGroupRef.current.position,
        { y: 0, duration: 0.48, ease: 'power2.out' },
        1.12
      )
    }
    if (tvGroupRef.current) {
      masterTl.to(
        tvGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.52, ease: 'back.out(1.6)' },
        1.22
      ).to(
        tvGroupRef.current.position,
        { y: 0, duration: 0.52, ease: 'power2.out' },
        1.22
      )
    }

    // [1.38s] Đồ trang trí trên tường (kệ sách, đồng hồ, bảng ghim, tranh) ghim vào vách
    if (wallDecorGroupRef.current) {
      masterTl.to(
        wallDecorGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.52, ease: 'back.out(2.0)' },
        1.38
      )
    }

    // [1.55s] Phụ kiện sàn, cây xanh bung nở tán lá, máy đĩa than
    if (floorDecorGroupRef.current) {
      masterTl.to(
        floorDecorGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.55, ease: 'back.out(1.8)' },
        1.55
      )
    }
    if (atmosphereGroupRef.current) {
      masterTl.to(
        atmosphereGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.55, ease: 'power2.out' },
        1.55
      )
    }

    // [1.75s] Mèo con vươn vai xuất hiện trên thảm
    if (catGroupRef.current) {
      masterTl.to(
        catGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.48, ease: 'back.out(2.2)' },
        1.75
      )
    }

    // [1.92s] Nhân vật Pixel Person từ trên nhẹ nhàng hạ cánh xuống giữa phòng
    if (personGroupRef.current) {
      masterTl.to(
        personGroupRef.current.position,
        { y: 0, duration: 0.65, ease: 'bounce.out' },
        1.92
      ).to(
        personGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.45, ease: 'power2.out' },
        1.92
      )
    }

    // [1.95s - 2.35s] Khung dây ma trận (Holographic Scaffold) hòa tan vào các khối đặc
    if (scaffoldRef.current) {
      masterTl.to(
        scaffoldRef.current.scale,
        { x: 0.001, y: 0.001, z: 0.001, duration: 0.42, ease: 'power2.in' },
        1.95
      )
    }

    // [2.05s] Kích hoạt nướng bóng tiếp xúc khi toàn bộ nội thất đã yên vị trên sàn (loại bỏ nghẽn frame 1)
    masterTl.call(() => setBakeShadows(true), [], 2.05)
    if (shadowsGroupRef.current) {
      masterTl.to(
        shadowsGroupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 0.55, ease: 'power2.out' },
        2.05
      )
    }

    // [2.12s] Lưới Blueprint & Hệ hạt năng lượng mờ dần tan biến
    if (blueprintRef.current) {
      masterTl.to(
        blueprintRef.current.scale,
        { x: 0.001, y: 0.001, z: 0.001, duration: 0.42, ease: 'power2.in' },
        2.12
      )
    }
    if (particlesRef.current) {
      masterTl.to(
        particlesRef.current.scale,
        { x: 0.001, y: 0.001, z: 0.001, duration: 0.38, ease: 'power2.in' },
        2.15
      )
    }

    return () => {
      masterTl.kill()
    }
  }, [])

  return (
    <group ref={roomRef}>
      {/* ── 0. CÁC TẦNG CÔNG NGHỆ THI CÔNG KIẾN TRÚC TỪ HƯ VÔ ── */}
      {showConstructionFX && (
        <>
          {/* Lưới toạ độ Blueprint & 4 Cột Laser góc phòng */}
          <ConstructionBlueprint ref={blueprintRef} />

          {/* Khung dây ma trận 3D (Holographic Ghost Wireframe) toàn bộ căn phòng */}
          <HolographicScaffold ref={scaffoldRef} />

          {/* Mặt phẳng Laser quét toàn phòng (Volumetric Laser Slicing Plane) */}
          <LaserScanPlane ref={laserPlaneRef} />

          {/* Hệ hạt năng lượng / tia lửa thi công (Assembly Sparks) */}
          <ConstructionParticles ref={particlesRef} />
        </>
      )}

      {/* ── 1. SÀN NHÀ: Móng bê tông đùn lên & 16 nan ván sàn gỗ lát nối tiếp nhau ── */}
      <Floor ref={floorRef} />

      {/* ── 2. TƯỜNG PHÒNG: Đùn cao từ sàn lên trần kèm tia Laser Scan thi công ── */}
      <Walls ref={wallsRef} />

      {/* ── 3. CỬA SỔ (Window) ── */}
      <group ref={windowGroupRef}>
        <InteractiveObject name="window" onClick={handleWindowClick} hoverLift={0.02}>
          <Window />
        </InteractiveObject>
      </group>

      {/* ── 4. GIƯỜNG NGỦ BỆT JAPANDI & TỦ ĐẦU GIƯỜNG (Bed) ── */}
      <group ref={bedGroupRef}>
        <InteractiveObject name="bed" panelId="contact">
          <Bed />
        </InteractiveObject>
      </group>

      {/* ── 5. BÀN LÀM VIỆC PC & GHẾ CÔNG THÁI HỌC (Desk Setup & Chair) ── */}
      <group ref={deskGroupRef}>
        <InteractiveObject name="pc" panelId="projects">
          <DeskSetup />
        </InteractiveObject>

        <InteractiveObject name="desklamp" onClick={handleToggleDeskLamp} hoverLift={0.02}>
          <mesh position={[-2.45, 1.1, -2.4]} visible={false} geometry={deskLampHitGeo} material={deskLampHitMat} />
        </InteractiveObject>

        <InteractiveObject name="chair" panelId="about">
          <Chair />
        </InteractiveObject>
      </group>

      {/* ── 6. TỦ NGĂN KÉO (Cabinet) ── */}
      <group ref={cabinetGroupRef}>
        <Cabinet />
      </group>

      {/* ── 7. KỆ TV (TV Setup) ── */}
      <group ref={tvGroupRef}>
        <InteractiveObject name="tv" panelId="playground">
          <TVSetup />
        </InteractiveObject>
      </group>

      {/* ── 8. ĐỒ TRANG TRÍ TREO TƯỜNG (Wall Decorations) ── */}
      <group ref={wallDecorGroupRef}>
        <Shelf />

        <InteractiveObject name="clock" onClick={handleToggleClockTime} hoverLift={0.05}>
          <Clock />
        </InteractiveObject>

        <PlanBoard />

        <InteractiveObject name="guestbook" onClick={handleOpenGuestbook} hoverLift={0.04}>
          <group position={[-3.88, 1.35, 1.05]}>
            <mesh rotation={[0, Math.PI / 2, 0]} castShadow geometry={guestbookPlaneGeo} material={guestbookNoteMat} />
            <mesh position={[0.006, 0.07, 0]} rotation={[0, 0, 0]} geometry={guestbookPinGeo} material={guestbookPinMat} />
          </group>
        </InteractiveObject>

        <WallDecorations />
      </group>

      {/* ── 9. PHỤ KIỆN SÀN & CÂY XANH (Floor Details & Plants) ── */}
      <group ref={floorDecorGroupRef}>
        <Plant position={[-3.3, 0, 3.2]} variant="bush" />
        <Plant position={[2.25, 0, -3.38]} variant="tropical" />
        <FloorDetails />

        <InteractiveObject name="recordplayer" onClick={handleToggleRecordPlayer} hoverLift={0.05}>
          <RecordPlayer position={[-0.3, 0, -3.6]} />
        </InteractiveObject>
      </group>

      {/* ── 10. MÈO CƯNG (Cat) ── */}
      <group ref={catGroupRef}>
        <InteractiveObject name="cat" onClick={handleClickCat} hoverLift={0.12}>
          <Cat position={[0.3, 0.007, 0.5]} scale={0.8} />
        </InteractiveObject>
      </group>

      {/* ── 11. NHÂN VẬT PIXEL PERSON ── */}
      <group ref={personGroupRef}>
        <InteractiveObject name="person" hoverLift={0.04}>
          <PixelPerson />
        </InteractiveObject>
      </group>

      {/* ── 12. HIỆU ỨNG KHÔNG KHÍ (Atmosphere) ── */}
      <group ref={atmosphereGroupRef}>
        <VolumetricAtmosphere />
      </group>

      {/* ── 13. BÓNG TIẾP XÚC (Contact Shadows - Nướng khi nội thất đã hạ cánh) ── */}
      {contactShadows && bakeShadows && (
        <group ref={shadowsGroupRef}>
          {/* Floor Level Contact AO */}
          <ContactShadows
            position={[0, 0.002, 0]}
            opacity={0.38}
            scale={8.2}
            blur={1.8}
            far={0.9}
            resolution={contactShadowResolutionMain}
            color="#1f140c"
            frames={contactShadowFramesMain}
          />

          {/* Rug Level Contact AO */}
          <ContactShadows
            position={[0, 0.0075, 0.3]}
            opacity={0.25}
            scale={3.6}
            blur={1.4}
            far={0.4}
            resolution={contactShadowResolutionRug}
            color="#241a12"
            frames={contactShadowFramesRug}
          />

          {/* Diorama Plinth Ground AO */}
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
        </group>
      )}
    </group>
  )
}

export default memo(Room)
