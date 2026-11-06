export const createLoadingSlice = (set) => ({
  isSceneReady: false, // true when first 3D frame has rendered
  isCriticalAssetsReady: false,
  criticalAssetsTotal: 0,
  criticalAssetsLoaded: 0,
  criticalAssetsFailed: 0,
  loadingStartedAt: 0,
  loadingMinDisplayMs: 1500,
  loadingMetrics: null,

  startLoadingSession: ({ total = 0, minDisplayMs = 1500 } = {}) =>
    set({
      isCriticalAssetsReady: false,
      criticalAssetsTotal: total,
      criticalAssetsLoaded: 0,
      criticalAssetsFailed: 0,
      loadingStartedAt: Date.now(),
      loadingMinDisplayMs: minDisplayMs,
    }),

  setCriticalAssetsTotal: (total) => set({ criticalAssetsTotal: Math.max(0, total) }),

  markCriticalAssetLoaded: () =>
    set((state) => ({
      criticalAssetsLoaded: Math.min(state.criticalAssetsTotal, state.criticalAssetsLoaded + 1),
    })),

  markCriticalAssetFailed: () =>
    set((state) => ({
      criticalAssetsFailed: Math.min(state.criticalAssetsTotal, state.criticalAssetsFailed + 1),
    })),

  setCriticalAssetsReady: (ready) => set({ isCriticalAssetsReady: !!ready }),

  setLoadingMetrics: (metricsOrUpdater) =>
    set((state) => ({
      loadingMetrics:
        typeof metricsOrUpdater === 'function'
          ? metricsOrUpdater(state.loadingMetrics)
          : metricsOrUpdater,
    })),

  setSceneReady: () => set({ isSceneReady: true }),

  resetLoadingState: () =>
    set({
      isSceneReady: false,
      isCriticalAssetsReady: false,
      criticalAssetsTotal: 0,
      criticalAssetsLoaded: 0,
      criticalAssetsFailed: 0,
      loadingStartedAt: 0,
      loadingMinDisplayMs: 1500,
      loadingMetrics: null,
    }),
})

