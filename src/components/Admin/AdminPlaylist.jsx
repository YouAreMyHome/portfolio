import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, Play, Pause, Music2, ExternalLink } from 'lucide-react'
import dataService from '../../services/dataService'
import { useSounds } from '../../utils/useSounds'

export default function AdminPlaylist() {
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [playingId, setPlayingId] = useState(null)
  const [audioObj, setAudioObj] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newArtist, setNewArtist] = useState('')
  const [newSrc, setNewSrc] = useState('')
  const [newDuration, setNewDuration] = useState('3:45')

  const { playClick, playSuccess } = useSounds()

  const loadPlaylist = async () => {
    setLoading(true)
    const data = await dataService.getPlaylist()
    setPlaylist(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadPlaylist()
    return () => {
      if (audioObj) audioObj.pause()
    }
  }, [])

  const handleTogglePreview = (song) => {
    playClick()
    if (playingId === song.id) {
      if (audioObj) audioObj.pause()
      setPlayingId(null)
      setAudioObj(null)
    } else {
      if (audioObj) audioObj.pause()
      const a = new Audio(song.src)
      a.play().catch((e) => console.warn('Audio play error:', e))
      a.onended = () => setPlayingId(null)
      setAudioObj(a)
      setPlayingId(song.id)
    }
  }

  const handleDeleteSong = (idx) => {
    playClick()
    const updated = [...playlist]
    updated.splice(idx, 1)
    setPlaylist(updated)
  }

  const handleAddSong = (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newSrc.trim()) return
    playClick()

    const newSong = {
      id: Date.now(),
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Nghệ sĩ',
      src: newSrc.trim(),
      duration: newDuration.trim() || '3:30',
    }

    setPlaylist([...playlist, newSong])
    setNewTitle('')
    setNewArtist('')
    setNewSrc('')
    setNewDuration('3:45')
  }

  const handleSavePlaylist = async () => {
    playClick()
    setSaving(true)
    await dataService.savePlaylist(playlist)
    playSuccess()
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200">
            Danh sách phát Nhạc ({playlist.length} bài hát)
          </h3>
          <p className="text-xs text-slate-400">
            Quản lý nhạc nền phát từ máy đĩa than (Record Player) trong phòng
          </p>
        </div>

        <button
          onClick={handleSavePlaylist}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
        >
          <Save size={15} />
          <span>{saving ? 'Đang lưu...' : 'Lưu Danh Sách'}</span>
        </button>
      </div>

      {/* Songs List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-xs">Đang tải playlist...</div>
        ) : playlist.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Chưa có bài hát nào trong playlist.
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.map((song, idx) => {
              const isCurrentPlaying = playingId === song.id
              return (
                <div
                  key={song.id || idx}
                  className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTogglePreview(song)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                        isCurrentPlaying
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-700 text-white hover:bg-indigo-600'
                      }`}
                      title={isCurrentPlaying ? 'Dừng phát' : 'Nghe thử'}
                    >
                      {isCurrentPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>

                    <div>
                      <h4 className="font-bold text-white text-xs">{song.title}</h4>
                      <p className="text-[11px] text-slate-400">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-slate-400 text-[11px]">
                      {song.duration}
                    </span>

                    <button
                      onClick={() => handleDeleteSong(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700"
                      title="Xóa bài hát"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add Song Form */}
        <form onSubmit={handleAddSong} className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Music2 size={14} className="text-indigo-400" />
            <span>Thêm bài hát mới</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Tên bài hát *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Ca sĩ / Nghệ sĩ *"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-3">
            <input
              type="url"
              required
              placeholder="Đường dẫn file MP3 (URL Cloudinary) *"
              value={newSrc}
              onChange={(e) => setNewSrc(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Thời lượng (3:45)"
              value={newDuration}
              onChange={(e) => setNewDuration(e.target.value)}
              className="w-24 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white text-center"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
            >
              <Plus size={15} />
              <span>Thêm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
