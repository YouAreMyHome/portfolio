import React, { useState, useEffect } from 'react'
import {
  Save,
  Download,
  Database,
  User,
  Info,
  ExternalLink,
  RefreshCw,
  Check,
} from 'lucide-react'
import dataService from '../../services/dataService'
import { isSupabaseConfigured } from '../../services/supabaseClient'
import { useSounds } from '../../utils/useSounds'

export default function AdminSettings() {
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const { playClick, playSuccess } = useSounds()
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    dataService.getProfile().then((data) => {
      if (data) setProfile(data)
    })
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!profile) return
    playClick()
    setSaving(true)

    await dataService.saveProfile(profile)
    playSuccess()
    setSaving(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleExportBackup = async () => {
    playClick()
    const projects = await dataService.getProjects()
    const skills = await dataService.getSkills()
    const playlist = await dataService.getPlaylist()
    const guestbook = await dataService.getGuestbookNotes()
    const prof = await dataService.getProfile()

    const fullBackup = {
      exportedAt: new Date().toISOString(),
      profile: prof,
      projects,
      skills,
      playlist,
      guestbook,
    }

    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `portfolio-backup-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    playSuccess()
  }

  if (!profile) {
    return <div className="text-slate-400 text-xs">Đang tải cấu hình...</div>
  }

  const { personalInfo, aboutMe } = profile

  return (
    <div className="space-y-8 max-w-3xl font-sans text-xs">
      {/* ── 1. Cấu hình thông tin cá nhân ── */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Thông tin Cá nhân & Giới thiệu
            </h3>
            <p className="text-xs text-slate-400">
              Cập nhật thông tin hiển thị tại panel Giới thiệu (About Me) và Liên hệ
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            {savedSuccess ? <Check size={15} /> : <Save size={15} />}
            <span>{savedSuccess ? 'Đã lưu!' : saving ? 'Đang lưu...' : 'Lưu Thông Tin'}</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Họ và Tên</label>
              <input
                type="text"
                required
                value={personalInfo.name || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personalInfo: { ...personalInfo, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={personalInfo.email || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personalInfo: { ...personalInfo, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={personalInfo.phone || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personalInfo: { ...personalInfo, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">GitHub URL</label>
              <input
                type="url"
                value={personalInfo.github || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personalInfo: { ...personalInfo, github: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={personalInfo.linkedin || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personalInfo: { ...personalInfo, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Vị trí / Địa chỉ</label>
              <input
                type="text"
                value={personalInfo.location || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    personalInfo: { ...personalInfo, location: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Slogan / Tagline</label>
            <input
              type="text"
              value={personalInfo.tagline || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  personalInfo: { ...personalInfo, tagline: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Đoạn giới thiệu bản thân (Bio)
            </label>
            <textarea
              rows={4}
              value={aboutMe.description || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  aboutMe: { ...aboutMe, description: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white leading-relaxed"
            />
          </div>
        </div>
      </form>

      {/* ── 2. Sao lưu và Khôi phục dữ liệu ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Sao lưu & Dữ liệu</h4>
          <p className="text-slate-400 mt-0.5">
            Tải về toàn bộ dữ liệu dự án dưới dạng file JSON để lưu trữ dự phòng
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2 shadow transition"
          >
            <Download size={15} />
            <span>Xuất toàn bộ dữ liệu (JSON)</span>
          </button>
        </div>
      </div>

      {/* ── 3. Hướng dẫn kết nối Supabase ── */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <Database size={16} />
          <span>Hướng dẫn kích hoạt Supabase Cloud</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Hiện tại website đang tự động lưu trữ dữ liệu an toàn ở chế độ dự phòng. Để đồng bộ dữ liệu đám mây qua nhiều thiết bị:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
          <li>
            Tạo dự án miễn phí tại{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 underline font-semibold"
            >
              supabase.com
            </a>
          </li>
          <li>
            Mở <b>SQL Editor</b> trong Supabase Dashboard và dán toàn bộ nội dung file{' '}
            <code className="text-amber-300 font-mono">src/data/schema.sql</code> để tạo bảng
          </li>
          <li>
            Thêm biến môi trường <code className="text-amber-300 font-mono">VITE_SUPABASE_URL</code>{' '}
            và <code className="text-amber-300 font-mono">VITE_SUPABASE_ANON_KEY</code> vào file{' '}
            <code className="text-amber-300 font-mono">.env</code> hoặc cấu hình trên Vercel.
          </li>
        </ol>
      </div>
    </div>
  )
}
