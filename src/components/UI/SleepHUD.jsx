import React, { useState, useEffect } from 'react'
import { Moon, Sun, Sparkles, Wind, Thermometer, BedDouble, Lightbulb, BellRing } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'
import './SleepHUD.css'

export default function SleepHUD() {
  const isNightMode = useStore((state) => state.isNightMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isCharacterSleeping = useStore((state) => state.isCharacterSleeping)
  const setLightingPreset = useStore((state) => state.setLightingPreset)
  const wakeUpCharacter = useStore((state) => state.wakeUpCharacter)
  const hasEnteredRoom = useStore((state) => state.hasEnteredRoom)
  const showWelcome = useStore((state) => state.showWelcome)
  const activePanel = useStore((state) => state.activePanel)
  const showPhotoMode = useStore((state) => state.showPhotoMode)
  const deskLampOn = useStore((state) => state.deskLampOn)
  const toggleDeskLamp = useStore((state) => state.toggleDeskLamp)

  const { playClick, playSound } = useSounds()
  const { t, i18n } = useTranslation()
  const isVi = i18n.language === 'vi'

  const [simulatedTime, setSimulatedTime] = useState('23:45')
  const [breathWave, setBreathWave] = useState(0)

  const isNight = isNightMode || lightingPreset === 'night'

  // Night clock simulator and rhythmic breathing wave
  useEffect(() => {
    if (!isNight) return

    const timer = setInterval(() => {
      const now = new Date()
      const hours = String((now.getHours() + 12) % 24).padStart(2, '0')
      const mins = String(now.getMinutes()).padStart(2, '0')
      setSimulatedTime(`${hours}:${mins}`)
    }, 1000)

    const breathTimer = setInterval(() => {
      setBreathWave((prev) => (prev + 1) % 100)
    }, 50)

    return () => {
      clearInterval(timer)
      clearInterval(breathTimer)
    }
  }, [isNight])

  // Don't render if not night mode or if in modal/loading
  if (!isNight || !hasEnteredRoom || showWelcome || activePanel || showPhotoMode) {
    return null
  }

  const handleWakeUp = () => {
    playClick()
    playSound('charHappy')
    wakeUpCharacter()
    // Smoothly transition lighting to morning
    setTimeout(() => {
      setLightingPreset('morning')
    }, 400)
  }

  return (
    <aside aria-label={isVi ? 'Giao diện giấc ngủ' : 'Sleep Interface'} className="sleep-hud-card">
      {/* Glow highlight */}
      <div className="sleep-hud-glow" />

      {/* Header bar */}
      <div className="sleep-hud-header">
        <div className="sleep-hud-title-wrap">
          <div className="sleep-moon-icon-box">
            <Moon size={16} className="sleep-moon-icon" />
          </div>
          <div>
            <h3 className="sleep-hud-title">
              {isVi ? 'Chế Độ Giấc Ngủ' : 'Deep Sleep Mode'}
            </h3>
            <span className="sleep-hud-subtitle">
              {isCharacterSleeping
                ? (isVi ? 'Nhân vật đang yên giấc trên giường' : 'Character is sleeping soundly on bed')
                : (isVi ? 'Đang chuẩn bị lên giường ngủ...' : 'Preparing to sleep on bed...')}
            </span>
          </div>
        </div>

        <div className="sleep-status-badge">
          <span className="sleep-pulse-dot" />
          <span className="sleep-badge-text">
            {isCharacterSleeping ? (isVi ? 'Ngủ say' : 'Asleep') : (isVi ? 'Buồn ngủ' : 'Drowsy')}
          </span>
        </div>
      </div>

      {/* Interactive Environment & Vitals Grid */}
      <div className="sleep-hud-metrics">
        {/* Metric 1: Breathing */}
        <div className="sleep-metric-item">
          <div className="metric-icon-box">
            <Wind size={14} className="metric-icon breath" />
          </div>
          <div className="metric-info">
            <span className="metric-label">{isVi ? 'Nhịp thở' : 'Breathing'}</span>
            <span className="metric-val">12 bpm • {isVi ? 'Êm ái' : 'Calm'}</span>
          </div>
          {/* Animated breath bar */}
          <div className="metric-bar-track">
            <div
              className="metric-bar-fill"
              style={{ width: `${Math.sin(breathWave * 0.1) * 35 + 50}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Room Temp & Ambient */}
        <div className="sleep-metric-item">
          <div className="metric-icon-box">
            <Thermometer size={14} className="metric-icon temp" />
          </div>
          <div className="metric-info">
            <span className="metric-label">{isVi ? 'Nhiệt độ phòng' : 'Room Temp'}</span>
            <span className="metric-val">24°C • {isVi ? 'Dịu mát' : 'Cozy'}</span>
          </div>
        </div>

        {/* Metric 3: Bed & Duvet State */}
        <div className="sleep-metric-item full-width">
          <div className="metric-icon-box">
            <BedDouble size={14} className="metric-icon bed" />
          </div>
          <div className="metric-info">
            <span className="metric-label">{isVi ? 'Tương tác giường' : 'Bed Interaction'}</span>
            <span className="metric-val">
              {isCharacterSleeping
                ? (isVi ? 'Chăn bông đã đắp kín • Gối lún êm ái' : 'Duvet tucked warmly • Pillow indented')
                : (isVi ? 'Chăn gối đang chờ nhân vật...' : 'Bed ready for sleep...')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sleep-hud-actions">
        {/* Wake Up Button */}
        <button
          className="sleep-btn wake-btn"
          onClick={handleWakeUp}
          title={isVi ? 'Đánh thức nhân vật dậy' : 'Wake up character'}
        >
          <Sparkles size={15} className="btn-icon" />
          <span>{isVi ? 'Đánh thức dậy' : 'Wake Up'}</span>
        </button>

        {/* Switch to Morning Button */}
        <button
          className="sleep-btn morning-btn"
          onClick={() => {
            playClick()
            setLightingPreset('morning')
          }}
          title={isVi ? 'Chuyển sang Buổi sáng' : 'Switch to Morning'}
        >
          <Sun size={15} className="btn-icon" />
          <span>{isVi ? 'Chào Buổi Sáng' : 'Morning'}</span>
        </button>

        {/* Night Light Toggle */}
        <button
          className={`sleep-btn light-btn ${deskLampOn ? 'active' : ''}`}
          onClick={() => {
            playClick()
            toggleDeskLamp()
          }}
          title={isVi ? 'Bật/Tắt đèn phụ' : 'Toggle Lamp'}
        >
          <Lightbulb size={15} className="btn-icon" />
          <span>{deskLampOn ? (isVi ? 'Đèn Bật' : 'Lamp On') : (isVi ? 'Đèn Tắt' : 'Lamp Off')}</span>
        </button>
      </div>
    </aside>
  )
}
