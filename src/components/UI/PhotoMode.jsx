import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Download, X, Sparkles, RefreshCw } from 'lucide-react'
import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'

export default function PhotoMode() {
  const showPhotoMode = useStore((state) => state.showPhotoMode)
  const closePhotoMode = useStore((state) => state.closePhotoMode)
  const lightingPreset = useStore((state) => state.lightingPreset)
  const isNightMode = useStore((state) => state.isNightMode)
  const { playClick, playSuccess } = useSounds()

  const [snapshotUrl, setSnapshotUrl] = useState(null)
  const [capturing, setCapturing] = useState(false)

  const capturePhoto = () => {
    setCapturing(true)
    playClick()

    // Lấy canvas WebGL của Three.js
    setTimeout(() => {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        try {
          const dataUrl = canvas.toDataURL('image/png')
          setSnapshotUrl(dataUrl)
          playSuccess()
        } catch (e) {
          console.error('Lỗi chụp canvas:', e)
        }
      }
      setCapturing(false)
    }, 200)
  }

  useEffect(() => {
    if (showPhotoMode) {
      capturePhoto()
    } else {
      setSnapshotUrl(null)
    }
  }, [showPhotoMode])

  const downloadPhoto = () => {
    if (!snapshotUrl) return
    playClick()

    // Vẽ vào canvas ảnh Polaroid hoàn chỉnh kèm khung và chữ ký
    const canvas = document.createElement('canvas')
    canvas.width = 900
    canvas.height = 1080
    const ctx = canvas.getContext('2d')

    // 1. Khung nền ảnh Polaroid trắng kem
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, 900, 1080)

    // Viền đổ bóng nhẹ bên ngoài
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, 896, 1076)

    // 2. Ảnh phòng 3D
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.drawImage(img, 45, 45, 810, 810)

      // 3. Chữ ký và thời gian kiểu viết tay cổ điển
      ctx.fillStyle = '#0f172a'
      ctx.font = 'bold 36px monospace'
      ctx.fillText("Nghia's Pixel Room", 50, 930)

      ctx.fillStyle = '#64748b'
      ctx.font = '22px monospace'
      const timeStr = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      ctx.fillText(`Recorded at ${timeStr} • Theme: ${lightingPreset || (isNightMode ? 'Night' : 'Day')}`, 50, 975)

      // Tải ảnh về
      const finalUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `pixel-room-${Date.now()}.png`
      link.href = finalUrl
      link.click()
    }
    img.src = snapshotUrl
  }

  if (!showPhotoMode) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-md w-full flex flex-col items-center"
        >
          {/* Nút đóng */}
          <button
            onClick={() => {
              playClick()
              closePhotoMode()
            }}
            className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-slate-800/80 rounded-full transition"
          >
            <X size={20} />
          </button>

          {/* Khung ảnh Polaroid Preview */}
          <div className="w-full bg-slate-50 p-4 pb-8 rounded-2xl shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
              {snapshotUrl ? (
                <img
                  src={snapshotUrl}
                  alt="Room Snapshot"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Đang chụp góc nhìn...
                </div>
              )}

              {capturing && (
                <div className="absolute inset-0 bg-white animate-flash" />
              )}
            </div>

            <div className="mt-4 px-2">
              <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-1.5">
                Nghia's Pixel Room
                <Sparkles size={14} className="text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {new Date().toLocaleDateString('vi-VN')} • Isometric 3D View
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={capturePhoto}
              disabled={capturing}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-700 shadow-lg transition"
            >
              <RefreshCw size={15} className={capturing ? 'animate-spin' : ''} />
              <span>Chụp lại</span>
            </button>

            <button
              onClick={downloadPhoto}
              disabled={!snapshotUrl || capturing}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25 transition"
            >
              <Download size={15} />
              <span>Tải ảnh Polaroid</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
