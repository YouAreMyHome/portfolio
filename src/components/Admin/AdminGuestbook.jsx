import React, { useState, useEffect } from 'react'
import { Trash2, MessageSquare, Pin, CheckCircle2, ShieldAlert } from 'lucide-react'
import dataService from '../../services/dataService'
import { useSounds } from '../../utils/useSounds'

export default function AdminGuestbook() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const { playClick, playSuccess } = useSounds()

  const loadNotes = async () => {
    setLoading(true)
    const data = await dataService.getGuestbookNotes()
    setNotes(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mẩu lưu bút này?')) return
    playClick()
    await dataService.deleteGuestbookNote(id)
    playSuccess()
    loadNotes()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Action Header */}
      <div>
        <h3 className="text-sm font-bold text-slate-200">
          Kiểm duyệt Lưu bút ({notes.length} lời nhắn)
        </h3>
        <p className="text-xs text-slate-400">
          Xem và kiểm duyệt các mảnh giấy nhớ do khách ghé thăm dán lên Plan Board
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-xs">Đang tải lưu bút...</div>
      ) : notes.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          Chưa có mẩu lưu bút nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              style={{ backgroundColor: note.color || '#fef08a' }}
              className="p-4 rounded-xl shadow-md border border-black/10 text-slate-900 relative flex flex-col justify-between min-h-[150px]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-xs">
                  {note.author_name || 'Khách ghé thăm'}
                </span>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1 text-slate-700 hover:text-rose-600 rounded hover:bg-black/10 transition"
                  title="Xóa mẩu giấy này"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="text-xs font-medium my-2 text-slate-800 whitespace-pre-wrap leading-relaxed">
                {note.message}
              </p>

              <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10px] text-slate-600 font-mono">
                <span>{new Date(note.created_at).toLocaleString('vi-VN')}</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 size={11} /> Hiển thị
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
