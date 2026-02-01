import { create } from 'zustand'

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
 */

const useStore = create((set, get) => ({
  // UI State
  activePanel: null, // 'projects', 'skills', 'playground', 'contact', 'about'
  isLoading: false,
  
  // Camera State  
  cameraTarget: [0, 1.5, 0],
  cameraZoom: 80,
  isZoomed: false,
  
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
  
  // Polaroid lightbox
  polaroidImage: null, // null hoặc URL ảnh đang xem
  
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
  
  // Polaroid lightbox
  openPolaroid: (imageUrl) => {
    const { onSoundTrigger } = get()
    if (onSoundTrigger) onSoundTrigger('click')
    set({ polaroidImage: imageUrl })
  },
  
  closePolaroid: () => set({ polaroidImage: null }),
  
  // Actions
  setActivePanel: (panel) => {
    const { onSoundTrigger } = get()
    if (panel && onSoundTrigger) onSoundTrigger('panelOpen')
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
  
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraZoom: (zoom) => set({ cameraZoom: zoom }),
  
  // Theme toggle (Window interaction)
  toggleNightMode: () => {
    const { isNightMode, onSoundTrigger } = get()
    if (onSoundTrigger) {
      onSoundTrigger(isNightMode ? 'dayMode' : 'nightMode')
    }
    set({ isNightMode: !isNightMode })
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
    set({ showMusicPlayer: !showMusicPlayer })
  },
}))

export default useStore
