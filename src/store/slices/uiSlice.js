import { emitSound, emitAnalytics } from '../../utils/eventBus'

export const createUISlice = (set, get) => ({
  activePanel: null, // 'projects', 'skills', 'playground', 'contact', 'about', 'blog'
  isLoading: false,
  showWelcome: false,
  hasEnteredRoom: false,
  cameraZoom: 80,
  isZoomed: false,
  hoveredObject: null,
  showClockTime: false,

  setActivePanel: (panel) => {
    if (panel) {
      emitSound('panelOpen')
      emitAnalytics('panel_open', { panel })
    }
    set({
      activePanel: panel,
      isZoomed: panel !== null,
    })
  },

  closePanel: () => {
    emitSound('panelClose')
    set({
      activePanel: null,
      isZoomed: false,
    })
  },

  setShowWelcome: (show) => set({ showWelcome: show }),

  enterRoom: () => {
    emitSound('panelOpen')
    set({ hasEnteredRoom: true })
  },

  completeWelcomeExit: () => set({ showWelcome: false }),

  setLoading: (loading) => set({ isLoading: loading }),

  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraZoom: (zoom) => set({ cameraZoom: zoom }),

  setHoveredObject: (obj) => set({ hoveredObject: obj }),

  toggleClockTime: () => {
    const { showClockTime } = get()
    emitSound('click')
    set({ showClockTime: !showClockTime })
    if (!showClockTime) {
      setTimeout(() => set({ showClockTime: false }), 3000)
    }
  },
})

