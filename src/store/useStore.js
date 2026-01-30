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
  
  // Actions
  setActivePanel: (panel) => set({ 
    activePanel: panel,
    isZoomed: panel !== null 
  }),
  
  closePanel: () => set({ 
    activePanel: null,
    isZoomed: false 
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraZoom: (zoom) => set({ cameraZoom: zoom }),
  
  // Theme toggle (Window interaction)
  toggleNightMode: () => set((state) => ({ isNightMode: !state.isNightMode })),
  
  setHoveredObject: (obj) => set({ hoveredObject: obj }),
  
  // Cat Easter Egg
  clickCat: () => {
    const clicks = get().catClicks + 1
    set({ catClicks: clicks })
    if (clicks >= 5) {
      set({ showEasterEgg: true })
      // Reset after 3 seconds
      setTimeout(() => set({ showEasterEgg: false, catClicks: 0 }), 3000)
    }
  },
  
  resetEasterEgg: () => set({ showEasterEgg: false, catClicks: 0 }),
}))

export default useStore
