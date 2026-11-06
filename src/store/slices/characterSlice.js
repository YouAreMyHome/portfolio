import { emitSound } from '../../utils/eventBus'

export const createCharacterSlice = (set) => ({
  // Character & Environment Interactivity System
  characterAction: 'walking', // 'walking' | 'stretching' | 'petting_cat' | 'drinking_coffee' | 'sitting_bed' | 'sleeping' | 'idle'
  setCharacterAction: (action) => set({ characterAction: action }),

  isCharacterSleeping: false,
  setIsCharacterSleeping: (sleeping) => set({ isCharacterSleeping: sleeping }),

  // Bed Physical Interaction Stage
  // 'none' | 'settle_bedside' | 'sit_at_bed' | 'swing_legs_in' | 'recline_to_pillow' | 'sleeping' | 'wake_stir' | 'wake_sit' | 'wake_swing_legs' | 'wake_stand'
  bedStage: 'none',
  setBedStage: (stage) => set({ bedStage: stage }),

  wakeUpTrigger: 0,
  wakeUpCharacter: () => {
    emitSound('charHappy')
    set((state) => ({ wakeUpTrigger: state.wakeUpTrigger + 1 }))
  },
})

