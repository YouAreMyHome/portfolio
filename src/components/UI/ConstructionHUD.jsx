import { useState, useEffect } from 'react'

/**
 * ConstructionHUD - Lớp HUD giao diện kiến trúc kỹ thuật số (Minimalist Cyber CAD Overlay)
 * Mang đến trải nghiệm công nghệ điện ảnh chuẩn Awwwards:
 * - Hiển thị các thông số toạ độ, tỷ lệ kích thước công trình CAD
 * - Dòng log trạng thái thi công nhảy trực tiếp theo từng giai đoạn thời gian thực
 * - Thanh tiến độ phần trăm (0% -> 100%)
 * - Tự động fade-out thanh lịch khi căn phòng hoàn thiện
 */
export default function ConstructionHUD({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stageText, setStageText] = useState('INITIALIZING ARCHITECTURAL BLUEPRINT MATRIX...')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    const startTime = performance.now()
    const DURATION = 2350 // Khớp với toàn bộ thời gian xây dựng căn phòng

    const stages = [
      { time: 0, text: 'INITIALIZING BLUEPRINT MATRIX & 8X8M BOUNDS...' },
      { time: 0.15, text: 'EXTRUDING CONCRETE PLINTH & FOUNDATION BED...' },
      { time: 0.35, text: 'LAYING 16 OAK TIMBER PLANKS IN CASCADE WAVE...' },
      { time: 0.65, text: 'LASER SINTERING WALL PANELS & WINDOW SLICING...' },
      { time: 1.05, text: 'ASSEMBLING PC DESK, DUAL MONITORS & JAPANDI BED...' },
      { time: 1.45, text: 'CABINET, TV CONSOLE & WALL SHELVING MOUNTED...' },
      { time: 1.85, text: 'BOTANICAL GROWTH, VINYL TURNTABLE & CAT SPAWNED...' },
      { time: 2.15, text: 'PIXEL PERSON TOUCHDOWN // FINALIZING ROOM...' },
      { time: 2.35, text: 'CONSTRUCTION COMPLETE // ENTERING ROOM...' },
    ]

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime
      const p = Math.min(100, Math.floor((elapsed / DURATION) * 100))
      setProgress(p)

      // Cập nhật stage text
      const currentSec = elapsed / 1000
      for (let i = stages.length - 1; i >= 0; i--) {
        if (currentSec >= stages[i].time) {
          setStageText(stages[i].text)
          break
        }
      }

      if (elapsed >= DURATION) {
        clearInterval(interval)
        setIsDone(true)
        if (onComplete) onComplete()
      }
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-500 font-mono select-none ${
        isDone ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* ── TOP-LEFT: Architectural Engine Specs ── */}
      <div className="absolute top-6 left-6 flex flex-col gap-1 text-[11px] text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          <span className="font-semibold tracking-wider text-cyan-200">ARCHITECTURAL ENGINE // PROTOCOL: GENESIS</span>
        </div>
        <div className="text-cyan-500/80 text-[10px] pl-4">
          BOUNDS: 8.0M x 8.0M x 3.0M | GRID STEP: 0.5M | RENDER: WEBGL PBR
        </div>
      </div>

      {/* ── TOP-RIGHT: Live Coordinate Reticle ── */}
      <div className="absolute top-6 right-6 text-right text-[11px] text-cyan-400/80">
        <div className="tracking-widest text-cyan-300">DIORAMA ISO // 45°</div>
        <div className="text-[10px] text-cyan-500/70 font-mono">
          CAMERA: ORTHO [10, 10, 10]
        </div>
      </div>

      {/* ── BOTTOM-LEFT: Real-Time Construction Log ── */}
      <div className="absolute bottom-6 left-6 max-w-lg">
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-lg px-4 py-2.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <div className="text-[10px] uppercase text-cyan-400 font-semibold tracking-wider mb-1 flex items-center justify-between">
            <span>Active Construction Process</span>
            <span className="text-cyan-200 font-bold">{progress}%</span>
          </div>
          <div className="text-xs text-white tracking-wide font-mono flex items-center gap-2">
            <span className="text-cyan-400">&gt;</span>
            <span className="truncate">{stageText}</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM-RIGHT: Precision Progress Bar & Cad Ticks ── */}
      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1.5">
        <div className="text-[10px] text-cyan-300/80 tracking-widest uppercase">
          STRUCTURAL ASSEMBLY: <span className="text-cyan-200 font-bold">{progress}%</span>
        </div>
        <div className="w-48 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-cyan-500/30">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-sky-300 transition-all duration-75 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1 text-[8px] text-cyan-500/60 font-mono tracking-tighter">
          <span>|---</span>
          <span>----</span>
          <span>----</span>
          <span>---|</span>
        </div>
      </div>
    </div>
  )
}

