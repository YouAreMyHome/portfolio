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
  const dayName = Array.isArray(days) ? days[time.getDay()] : time.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long' })
  
  const dateStr = i18n.language === 'vi'
    ? `${dayName}, ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`
    : time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  
  return (
    <div className="clock-time-overlay">
      <div className="clock-time-card">
        <div className="clock-time-main">
          <span className="clock-hours">{hours}</span>
          <span className="clock-separator">:</span>
          <span className="clock-minutes">{minutes}</span>
          <span className="clock-seconds">{seconds}</span>
        </div>
        <div className="clock-date">{dateStr}</div>
      </div>
    </div>
  )
}

export default ClockTimeDisplay
