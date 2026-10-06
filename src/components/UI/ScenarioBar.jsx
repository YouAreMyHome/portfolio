import React, { useEffect, useState, useRef } from 'react'
import { Sun, Sunset, CloudRain, Moon, Play, Pause, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'
import './ScenarioBar.css'

const SCENARIOS = [
  { id: 'morning', icon: Sun, emoji: '☀️' },
  { id: 'sunset', icon: Sunset, emoji: '🌇' },
  { id: 'rainy', icon: CloudRain, emoji: '🌧️' },
  { id: 'night', icon: Moon, emoji: '🌙' },
]

const AUTO_INTERVAL_MS = 16000

export default function ScenarioBar() {
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isNightMode = useStore((state) => state.isNightMode)
  const setLightingPreset = useStore((state) => state.setLightingPreset)
  const isAutoScenarioRunning = useStore((state) => state.isAutoScenarioRunning)
  const toggleAutoScenario = useStore((state) => state.toggleAutoScenario)
  const activePanel = useStore((state) => state.activePanel)
  const hasEnteredRoom = useStore((state) => state.hasEnteredRoom)
  const showWelcome = useStore((state) => state.showWelcome)
  const showPhotoMode = useStore((state) => state.showPhotoMode)

  const { playClick } = useSounds()
  const { t } = useTranslation()

  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const progressIntervalRef = useRef(null)

  const currentPreset = isNightMode ? 'night' : lightingPreset || 'morning'

  // Auto cycle runner
  useEffect(() => {
    if (!isAutoScenarioRunning) {
      if (timerRef.current) clearInterval(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      setProgress(0)
      return
    }

    const startTime = Date.now()
    setProgress(0)

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const p = Math.min(100, (elapsed % AUTO_INTERVAL_MS) / (AUTO_INTERVAL_MS / 100))
      setProgress(p)
    }, 100)

    timerRef.current = setInterval(() => {
      const sequence = ['morning', 'sunset', 'rainy', 'night']
      const currentIndex = sequence.indexOf(useStore.getState().lightingPreset || 'morning')
      const nextPreset = sequence[(currentIndex + 1) % sequence.length]
      setLightingPreset(nextPreset)
    }, AUTO_INTERVAL_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [isAutoScenarioRunning, setLightingPreset])

  if (!hasEnteredRoom || showWelcome || activePanel || showPhotoMode) {
    return null
  }

  const isDark = isNightMode || currentPreset === 'night' || currentPreset === 'rainy'

  return (
    <div className={`scenario-bar-container ${isDark ? 'dark' : ''}`}>
      <div className="scenario-bar">
        {/* Scenario Buttons */}
        <div className="scenario-buttons" role="tablist" aria-label={t('scenario.title')}>
          {SCENARIOS.map((s) => {
            const Icon = s.icon
            const isActive = currentPreset === s.id
            const label = t(`scenario.${s.id}.label`)
            const action = t(`scenario.${s.id}.action`)

            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                className={`scenario-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  playClick()
                  setLightingPreset(s.id)
                }}
                title={`${label}: ${action}`}
              >
                <div className="scenario-icon-wrap">
                  <Icon size={16} className="scenario-icon" />
                </div>
                <div className="scenario-text-wrap">
                  <span className="scenario-label">{label}</span>
                  <span className="scenario-action-tag">{action}</span>
                </div>
                {isActive && <div className="scenario-active-dot" />}
              </button>
            )
          })}
        </div>

        {/* Separator */}
        <div className="scenario-divider" />

        {/* Auto Play / Pause Toggle Button */}
        <button
          className={`scenario-autoplay-btn ${isAutoScenarioRunning ? 'running' : ''}`}
          onClick={() => {
            playClick()
            toggleAutoScenario()
          }}
          title={isAutoScenarioRunning ? t('scenario.pause') : t('scenario.autoplay')}
          aria-label={isAutoScenarioRunning ? t('scenario.pause') : t('scenario.autoplay')}
        >
          {isAutoScenarioRunning ? (
            <Pause size={14} className="scenario-auto-icon" />
          ) : (
            <Play size={14} className="scenario-auto-icon" />
          )}
          <span className="scenario-auto-label">
            {isAutoScenarioRunning ? t('scenario.pause') : t('scenario.autoplay')}
          </span>
          {isAutoScenarioRunning && (
            <div className="scenario-progress-bar" style={{ width: `${progress}%` }} />
          )}
        </button>
      </div>

      {/* Floating active action banner */}
      <div className="scenario-status-pill">
        <Sparkles size={12} className="scenario-sparkle-icon" />
        <span className="scenario-status-prefix">{t('scenario.current')}</span>
        <span className="scenario-status-name">
          {t(`scenario.${currentPreset}.action`)}
        </span>
      </div>
    </div>
  )
}
