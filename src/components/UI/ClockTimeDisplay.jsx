import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore'
import './ClockTime.css'

function ClockTimeDisplay() {
  const showClockTime = useStore((state) => state.showClockTime)
  const [time, setTime] = useState(new Date())
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (!showClockTime) return
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [showClockTime])

  if (!showClockTime) return null

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  const days = t('clock.days', { returnObjects: true })
  const dayName = Array.isArray(days)
    ? days[time.getDay()]
    : time.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long' })

  const dateStr =
    i18n.language === 'vi'
      ? `${dayName}, ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`
      : time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <aside className="clock-time-overlay" role="status" aria-live="polite">
      <div className="clock-time-badge">
        <span className="clock-time-icon">🕒</span>
        <div className="clock-time-digits">
          <span className="clock-hours">{hours}</span>
          <span className="clock-separator">:</span>
          <span className="clock-minutes">{minutes}</span>
          <span className="clock-seconds">{seconds}</span>
        </div>
        <span className="clock-divider">•</span>
        <span className="clock-date">{dateStr}</span>
      </div>
    </aside>
  )
}

export default ClockTimeDisplay
