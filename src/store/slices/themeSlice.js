import { emitSound, emitAnalytics } from '../../utils/eventBus'

// Automatically detect initial ambient preset based on user local time
export const getInitialAmbientPreset = () => {
  try {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 16) return 'morning'
    if (hour >= 16 && hour < 19) return 'sunset'
    return 'night'
  } catch {
    return 'morning'
  }
}

const defaultAmbientPreset = getInitialAmbientPreset()

export const createThemeSlice = (set, get) => ({
  // Theme & Lighting Presets ('morning' | 'sunset' | 'rainy' | 'night')
  isNightMode: defaultAmbientPreset === 'night',
  lightingPreset: defaultAmbientPreset,
  retroPixelMode: false,
  deskLampOn: defaultAmbientPreset === 'night',
  stringLightsOn: false,

  // Scene transition
  transitionPhase: 'idle', // 'idle' | 'covering' | 'revealing'
  transitionTarget: 'night', // 'night' | 'day'

  // Auto Scenario Tour (24h Day-Night Cycle)
  isAutoScenarioRunning: false,

  toggleNightMode: () => {
    const { isNightMode, transitionPhase } = get()
    if (transitionPhase !== 'idle') return // debounce - wait until transition finishes

    emitSound(isNightMode ? 'dayMode' : 'nightMode')
    const nextMode = !isNightMode
    emitAnalytics('theme_toggle', { theme: nextMode ? 'night' : 'day' })

    // Phase 1 - covering: overlay fade-in
    set({ transitionPhase: 'covering', transitionTarget: nextMode ? 'night' : 'day' })

    setTimeout(() => {
      // Phase 2 - flip mode while overlay covers scene
      set({ isNightMode: nextMode })

      // Phase 3 - wait for Three.js render cycles
      let frames = 0
      const waitForRender = () => {
        frames++
        if (frames < 8) {
          requestAnimationFrame(waitForRender)
        } else {
          set({ transitionPhase: 'revealing' })
          setTimeout(() => set({ transitionPhase: 'idle' }), 360)
        }
      }
      requestAnimationFrame(waitForRender)
    }, 280)
  },

  setLightingPreset: (preset) => {
    emitSound('click')
    const isNight = preset === 'night'
    set({
      lightingPreset: preset,
      isNightMode: isNight,
    })
  },

  toggleRetroPixelMode: () => {
    emitSound('click')
    set((state) => ({ retroPixelMode: !state.retroPixelMode }))
  },

  toggleDeskLamp: () => {
    emitSound('click')
    set((state) => ({ deskLampOn: !state.deskLampOn }))
  },

  toggleStringLights: () => {
    emitSound('click')
    set((state) => ({ stringLightsOn: !state.stringLightsOn }))
  },

  toggleAutoScenario: () => {
    emitSound('click')
    set((state) => ({ isAutoScenarioRunning: !state.isAutoScenarioRunning }))
  },

  setAutoScenarioRunning: (running) => set({ isAutoScenarioRunning: running }),
})

