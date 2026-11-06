import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createUISlice } from './slices/uiSlice'
import { createThemeSlice } from './slices/themeSlice'
import { createCharacterSlice } from './slices/characterSlice'
import { createLoadingSlice } from './slices/loadingSlice'
import { createOverlaySlice } from './slices/overlaySlice'

/**
 * Zustand Store - Modular Slice Architecture
 * 
 * Slices:
 * - uiSlice: Panel overlays, welcome screen, camera & navigation
 * - themeSlice: Lighting presets, day/night cycles, shaders, lamp
 * - characterSlice: Character autonomous behavior, sleeping, bed interaction
 * - loadingSlice: Critical asset preloading, session progress, metrics
 * - overlaySlice: Guestbook, leaderboard, photo mode, kanban, polaroid, audio player
 * 
 * Persisted (localStorage):
 * - isNightMode, stringLightsOn, lightingPreset, retroPixelMode, deskLampOn
 */
const useStore = create(
  persist(
    (set, get) => ({
      ...createUISlice(set, get),
      ...createThemeSlice(set, get),
      ...createCharacterSlice(set, get),
      ...createLoadingSlice(set, get),
      ...createOverlaySlice(set, get),

      // Deprecated backwards-compatibility connector (now handled via AppEventBus)
      onSoundTrigger: null,
      setSoundTrigger: (_callback) => {},
    }),
    {
      name: 'nghia-room-prefs',
      partialize: (state) => ({
        isNightMode: state.isNightMode,
        stringLightsOn: state.stringLightsOn,
        lightingPreset: state.lightingPreset,
        retroPixelMode: state.retroPixelMode,
        deskLampOn: state.deskLampOn,
      }),
    }
  )
)

export default useStore
