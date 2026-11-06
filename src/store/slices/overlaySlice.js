import { emitSound, emitAnalytics } from '../../utils/eventBus'

export const createOverlaySlice = (set, get) => ({
  // Interactive Overlays
  showGuestbook: false,
  showLeaderboard: false,
  activeLeaderboardGame: 'snake',
  showPhotoMode: false,
  showAdmin: false,
  showKanbanBoard: false,

  // Easter Egg
  catClicks: 0,
  showEasterEgg: false,

  // Record Player & Music
  isRecordPlaying: false,
  showMusicPlayer: false,

  // Polaroid lightbox (gallery)
  polaroidImages: [],
  polaroidIndex: 0,

  // Guestbook
  openGuestbook: () => {
    emitSound('click')
    set({ showGuestbook: true })
  },
  closeGuestbook: () => set({ showGuestbook: false }),

  // Leaderboard
  openLeaderboard: (game = 'snake') => {
    emitSound('click')
    set({ showLeaderboard: true, activeLeaderboardGame: game })
  },
  closeLeaderboard: () => set({ showLeaderboard: false }),

  // Photo Mode
  openPhotoMode: () => {
    emitSound('click')
    set({ showPhotoMode: true })
  },
  closePhotoMode: () => set({ showPhotoMode: false }),

  // Admin Dashboard
  openAdmin: () => set({ showAdmin: true }),
  closeAdmin: () => set({ showAdmin: false }),

  // Kanban Board
  toggleKanbanBoard: () => {
    const { showKanbanBoard } = get()
    emitSound('click')
    set({ showKanbanBoard: !showKanbanBoard })
  },
  closeKanbanBoard: () => set({ showKanbanBoard: false }),

  // Cat Easter Egg
  clickCat: () => {
    const { catClicks } = get()
    const clicks = catClicks + 1
    emitSound('meow')
    set({ catClicks: clicks })

    if (clicks >= 5) {
      emitSound('easterEgg')
      emitAnalytics('easter_egg_found')
      set({ showEasterEgg: true })
      setTimeout(() => set({ showEasterEgg: false, catClicks: 0 }), 3000)
    }
  },
  resetEasterEgg: () => set({ showEasterEgg: false, catClicks: 0 }),

  // Record Player controls
  setRecordPlaying: (playing) => set({ isRecordPlaying: playing }),
  setShowMusicPlayer: (show) => set({ showMusicPlayer: show }),
  toggleRecordPlayer: () => {
    const { showMusicPlayer } = get()
    emitSound('click')
    if (!showMusicPlayer) emitAnalytics('music_player_open')
    set({ showMusicPlayer: !showMusicPlayer })
  },

  // Polaroid gallery
  openPolaroid: (images, startIndex = 0) => {
    emitSound('click')
    const arr = Array.isArray(images) ? images : [images]
    emitAnalytics('polaroid_open', { count: arr.length })
    set({
      polaroidImages: arr,
      polaroidIndex: Math.max(0, Math.min(startIndex, arr.length - 1)),
    })
  },
  closePolaroid: () => set({ polaroidImages: [], polaroidIndex: 0 }),
  prevPolaroid: () =>
    set((state) => ({
      polaroidIndex:
        (state.polaroidIndex - 1 + state.polaroidImages.length) %
        state.polaroidImages.length,
    })),
  nextPolaroid: () =>
    set((state) => ({
      polaroidIndex: (state.polaroidIndex + 1) % state.polaroidImages.length,
    })),
})

