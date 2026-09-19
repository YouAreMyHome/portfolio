import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Pin, Sparkles, MessageSquareHeart } from 'lucide-react'
import useStore from '../../store/useStore'
import dataService from '../../services/dataService'
import { useSounds } from '../../utils/useSounds'

const NOTE_COLORS = [
  { label: 'Vàng nắng', bg: '#fef08a', text: '#713f12', border: '#fde047' },
  { label: 'Xanh lam', bg: '#bae6fd', text: '#0c4a6e', border: '#7dd3fc' },
  { label: 'Hồng phấn', bg: '#fbcfe8', text: '#831843', border: '#f472b6' },
  { label: 'Xanh bạc hà', bg: '#bbf7d0', text: '#14532d', border: '#86efac' },
  { label: 'Tím mộng mơ', bg: '#e9d5ff', text: '#581c87', border: '#c084fc' },
]

export default function GuestbookOverlay() {
  const showGuestbook = useStore((state) => state.showGuestbook)
  const closeGuestbook = useStore((state) => state.closeGuestbook)
  const { playClick, playSuccess } = useSounds()

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [message, setMessage] = useState('')
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].bg)
  const [submitting, setSubmitting] = useState(false)

  // Load notes khi mở overlay
  useEffect(() => {
    if (!showGuestbook) return
    let active = true
    setLoading(true)

    dataService.getGuestbookNotes().then((data) => {
      if (active) {
        setNotes(data || [])
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [showGuestbook])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || submitting) return

    setSubmitting(true)
    playClick()

    try {
      const newNote = await dataService.addGuestbookNote({
        authorName: authorName.trim() || 'Khách ghé thăm',
        message: message.trim(),
        color: selectedColor,
      })

      if (newNote) {
        setNotes((prev) => [newNote, ...prev])
        setMessage('')
        playSuccess()
      }
    } catch (err) {
      console.error('Lỗi khi gửi lưu bút:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!showGuestbook) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border-2 border-amber-600/40 rounded-2xl shadow-2xl shadow-amber-950/40 overflow-hidden font-sans text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                <MessageSquareHeart size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide text-amber-300 flex items-center gap-2">
                  Bảng Lưu Bút Căn Phòng Pixel
                  <Sparkles size={16} className="text-amber-400 animate-pulse" />
                </h2>
                <p className="text-xs text-slate-400">
                  Hãy để lại một mảnh giấy nhớ pixel gửi lời chào hoặc lời chúc nhé!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClick()
                closeGuestbook()
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form để lại giấy nhớ */}
          <div className="p-4 bg-slate-950/40 border-b border-slate-800/80">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  placeholder="Tên của bạn..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  maxLength={30}
                  className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 flex-1 min-w-[140px]"
                />

                {/* Chọn màu giấy */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-800/60 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-400 px-1">Màu giấy:</span>
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.bg}
                      type="button"
                      onClick={() => setSelectedColor(c.bg)}
                      className={`w-5 h-5 rounded-full transition-transform ${
                        selectedColor === c.bg ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.bg }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Viết lời nhắn hoặc lời chúc của bạn (tối đa 150 ký tự)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={150}
                  required
                  className="flex-1 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
                >
                  <Send size={15} />
                  <span>Dán lên</span>
                </button>
              </div>
            </form>
          </div>

          {/* Khu vực bảng ghim các Sticky Notes */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-900 to-slate-950">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                Đang tải các mẩu giấy nhớ...
              </div>
            ) : notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm">
                <Pin size={32} className="mb-2 text-slate-600" />
                Chưa có giấy nhớ nào. Hãy là người đầu tiên để lại lời nhắn nhé!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {notes.map((note, index) => {
                  const rotation = (index % 5 - 2) * 1.5 // Nghiêng ngẫu nhiên nhẹ -3deg -> +3deg
                  return (
                    <motion.div
                      key={note.id || index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.04 }}
                      style={{
                        backgroundColor: note.color || '#fef08a',
                        transform: `rotate(${rotation}deg)`,
                      }}
                      className="p-4 rounded-xl shadow-lg border border-black/10 text-slate-800 relative flex flex-col justify-between min-h-[140px] hover:scale-105 hover:z-10 transition-transform duration-200"
                    >
                      {/* Đinh ghim đỏ phía trên */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-md border-2 border-red-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-200" />
                      </div>

                      <p className="text-sm font-medium mt-2 leading-relaxed text-slate-900 whitespace-pre-wrap">
                        {note.message}
                      </p>

                      <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-xs text-slate-700">
                        <span className="font-bold truncate max-w-[120px]">
                          ~ {note.author_name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(note.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
