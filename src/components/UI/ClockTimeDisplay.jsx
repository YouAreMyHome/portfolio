import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import './ClockTime.css'

/**
 * ClockTimeDisplay - Hiển thị thời gian hiện tại khi click vào đồng hồ
 */
function ClockTimeDisplay() {
  const showClockTime = useStore((state) => state.showClockTime)
  const [time, setTime] = useState(new Date())
  
  useEffect(() => {
    if (!showClockTime) return
    
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [showClockTime])
  
  if (!showClockTime) return null
  
  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')
  
  const day = time.getDate()
  const month = time.getMonth() + 1
  const year = time.getFullYear()
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const dayName = dayNames[time.getDay()]
  
  return (
    <div className="clock-time-overlay">
      <div className="clock-time-card">
        <div className="clock-time-main">
          <span className="clock-hours">{hours}</span>
          <span className="clock-separator">:</span>
          <span className="clock-minutes">{minutes}</span>
          <span className="clock-seconds">{seconds}</span>
        </div>
        <div className="clock-date">
          {dayName}, {day}/{month}/{year}
        </div>
      </div>
    </div>
  )
}

export default ClockTimeDisplay
