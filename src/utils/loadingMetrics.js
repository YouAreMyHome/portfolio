function canUsePerformance() {
  return typeof window !== 'undefined' && !!window.performance
}

export function mark(metricName) {
  if (!canUsePerformance()) return
  window.performance.mark(metricName)
}

export function measure(name, startMark, endMark) {
  if (!canUsePerformance()) return 0

  try {
    window.performance.measure(name, startMark, endMark)
    const entries = window.performance.getEntriesByName(name)
    const latest = entries[entries.length - 1]
    return latest ? Math.round(latest.duration) : 0
  } catch {
    return 0
  }
}

export function clearLoadingMarks() {
  if (!canUsePerformance()) return

  const markNames = [
    'loading:start',
    'loading:preload-start',
    'loading:preload-done',
    'loading:first-frame',
    'loading:ui-hidden',
  ]

  markNames.forEach((markName) => {
    window.performance.clearMarks(markName)
  })

  const measureNames = [
    'loading:preload',
    'loading:wait-first-frame',
    'loading:total',
  ]

  measureNames.forEach((measureName) => {
    window.performance.clearMeasures(measureName)
  })
}
