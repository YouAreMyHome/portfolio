import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { track } from '@vercel/analytics'

/**
 * Zustand Store - Phase 3: Interaction & Logic
 * 
 * Navigation Map:
 * - PC → Projects
 * - Board → Skills  
 * - TV → Playground
 * - Bed/Phone → Contact
 * - Window → Theme Toggle
 * - Cat → Easter Egg
 *
 * Persisted (localStorage):
 * - isNightMode    : ghi nhớ chế độ sáng/tối sau reload
 * - stringLightsOn : ghi nhớ trạng thái đèn dây
 */

const useStore = create(
  persist(
    (set, get) => ({
  // UI State
  activePanel: null, // 'projects', 'skills', 'playground', 'contact', 'about'
  isLoading: false,
  isSceneReady: false, // true khi frame 3D đầu tiên đã render xong
  cameraZoom: 80,
  isZoomed: false,

  // Scene transition (che overlay khi Three.js recompile shader)
  // 'idle' | 'covering' | 'revealing'
  transitionPhase: 'idle',
  transitionTarget: 'night', // 'night' | 'day' — hướng chuyển đổi
  
  // Theme
  isNightMode: false,
  
  // Interaction State
  hoveredObject: null,
  
  // Easter Egg
  catClicks: 0,
  showEasterEgg: false,
  
  // Record Player
  isRecordPlaying: false,
  showMusicPlayer: false,
  
  // Clock time display
  showClockTime: false,
  
  // String lights
  stringLightsOn: false,
  
  // Kanban Board overlay
  showKanbanBoard: false,
  
  // Polaroid lightbox (gallery)
  polaroidImages: [],   // mảng tất cả ảnh trong gallery
  polaroidIndex: 0,     // index ảnh đang xem
  
  // Sound callback (set by App component)
  onSoundTrigger: null,
  setSoundTrigger: (callback) => set({ onSoundTrigger: callback }),
  
  // Record Player controls
  setRecordPlaying: (playing) => set({ isRecordPlaying: playing }),
  setShowMusicPlayer: (show) => set({ showMusicPlayer: show }),
  
  // Clock time toggle
  toggleClockTime: () => {
    const { showClockTime, onSoundTrigger } = get()
    if (onSoundTrigger) onSoundTrigger('click')
    set({ showClockTime: !showClockTime })
    // Auto hide after 3 seconds
    if (!showClockTime) {
      setTimeout(() => set({ showClockTime: false }), 3000)
    }
  },
  
  // String lights toggle
  toggleStringLights: () => {
    const { stringLightsOn, onSoundTrigger } = get()
    if (onSoundTrigger) onSoundTrigger('click')
    set({ stringLightsOn: !stringLightsOn })
  },
  
  // Kanban Board toggle
  toggleKanbanBoard: () => {
    const { showKanbanBoard, onSoundTrigger } = get()
    if (onSoundTrigger) onSoundTrigger('click')
    set({ showKanbanBoard: !showKanbanBoard })
  },
  
  closeKanbanBoard: () => set({ showKanbanBoard: false }),
  
  // Polaroid gallery
  openPolaroid: (images, startIndex = 0) => {
    const { onSoundTrigger } = get()
    if (onSoundTrigger) onSoundTrigger('click')
    // Accept single string or array
    const arr = Array.isArray(images) ? images : [images]
    track('polaroid_open', { count: arr.length })
    set({ polaroidImages: arr, polaroidIndex: Math.max(0, Math.min(startIndex, arr.length - 1)) })
  },
  closePolaroid: () => set({ polaroidImages: [], polaroidIndex: 0 }),
  prevPolaroid: () => set((state) => ({
    polaroidIndex: (state.polaroidIndex - 1 + state.polaroidImages.length) % state.polaroidImages.length,
  })),
  nextPolaroid: () => set((state) => ({
    polaroidIndex: (state.polaroidIndex + 1) % state.polaroidImages.length,
  })),
  
  // Actions
  setActivePanel: (panel) => {
    const { onSoundTrigger } = get()
    if (panel && onSoundTrigger) onSoundTrigger('panelOpen')
    if (panel) track('panel_open', { panel })
    set({ 
      activePanel: panel,
      isZoomed: panel !== null 
    })
  },
  
  closePanel: () => {
    const { onSoundTrigger } = get()
    if (onSoundTrigger) onSoundTrigger('panelClose')
    set({ 
      activePanel: null,
      isZoomed: false 
    })
  },
  
  setLoading: (loading) => set({ isLoading: loading }),

  setSceneReady: () => set({ isSceneReady: true }),
  
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraZoom: (zoom) => set({ cameraZoom: zoom }),
  
  // Theme toggle — dùng overlay che khuất khi Three.js recompile shader
  toggleNightMode: () => {
    const { isNightMode, onSoundTrigger, transitionPhase } = get()
    if (transitionPhase !== 'idle') return  // debounce — chờ transition xong
    if (onSoundTrigger) {
      onSoundTrigger(isNightMode ? 'dayMode' : 'nightMode')
    }
    const nextMode = !isNightMode
    track('theme_toggle', { theme: nextMode ? 'night' : 'day' })

    // Phase 1 — 'covering': overlay fade-in (CSS 260ms)
    // Dùng setTimeout cố định > CSS duration để đảm bảo overlay đã visible
    // ở mọi frame rate (60fps / 120fps / 30fps đều an toàn)
    set({ transitionPhase: 'covering', transitionTarget: nextMode ? 'night' : 'day' })

    setTimeout(() => {
      // Phase 2 — flip mode khi overlay đang hoàn toàn che khuất scene
      // Three.js bắt đầu recompile shaders tại đây
      set({ isNightMode: nextMode })

      // Phase 3 — đợi Three.js render xong frame mới (rAF-aligned)
      // Mỗi rAF = 1 render cycle thực tế, tự động scale theo frame rate thiết bị
      let frames = 0
      const waitForRender = () => {
        frames++
        if (frames < 8) {
          // 8 frames: ~133ms @60fps | ~267ms @30fps | ~67ms @120fps
          requestAnimationFrame(waitForRender)
        } else {
          // Scene mới đã render đủ frame — bắt đầu fade-out
          set({ transitionPhase: 'revealing' })
          // Phase 4 — 'idle' sau khi CSS fade-out hoàn tất (360ms)
          setTimeout(() => set({ transitionPhase: 'idle' }), 360)
        }
      }
      requestAnimationFrame(waitForRender)
    }, 280) // 280ms > 260ms CSS fade-in → overlay chắc chắn opaque
  },
  
  setHoveredObject: (obj) => set({ hoveredObject: obj }),
  
  // Cat Easter Egg
  clickCat: () => {
    const { catClicks, onSoundTrigger } = get()
    const clicks = catClicks + 1
    
    // Play meow sound
    if (onSoundTrigger) onSoundTrigger('meow')
    
    set({ catClicks: clicks })
    if (clicks >= 5) {
      if (onSoundTrigger) onSoundTrigger('easterEgg')
      track('easter_egg_found')
      set({ showEasterEgg: true })
      // Reset after 3 seconds
      setTimeout(() => set({ showEasterEgg: false, catClicks: 0 }), 3000)
    }
  },
  
  resetEasterEgg: () => set({ showEasterEgg: false, catClicks: 0 }),
  
  // Record Player toggle - show/hide music player
  toggleRecordPlayer: () => {
    const { onSoundTrigger, showMusicPlayer } = get()
    if (onSoundTrigger) onSoundTrigger('click')
    if (!showMusicPlayer) track('music_player_open')
    set({ showMusicPlayer: !showMusicPlayer })
  },
    }),
    {
      name: 'nghia-room-prefs',   // localStorage key
      // Chỉ persist những field cần ghi nhớ, bỏ qua transient state
      partialize: (state) => ({
        isNightMode: state.isNightMode,
        stringLightsOn: state.stringLightsOn,
      }),
    }
  )
)

export default useStore
