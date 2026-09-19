import React, { useState, useEffect } from 'react'
import {
  FolderKanban,
  Wrench,
  Music,
  MessageSquare,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import useStore from '../../store/useStore'
import { isSupabaseConfigured } from '../../services/supabaseClient'
import { useSounds } from '../../utils/useSounds'

import AdminProjects from './AdminProjects'
import AdminSkills from './AdminSkills'
import AdminPlaylist from './AdminPlaylist'
import AdminGuestbook from './AdminGuestbook'
import AdminSettings from './AdminSettings'

const TABS = [
  { id: 'projects', label: 'Dự án', icon: FolderKanban },
  { id: 'skills', label: 'Kỹ năng', icon: Wrench },
  { id: 'playlist', label: 'Playlist Nhạc', icon: Music },
  { id: 'guestbook', label: 'Lưu bút & Sticky Notes', icon: MessageSquare },
  { id: 'settings', label: 'Hồ sơ & Cài đặt', icon: Settings },
]

export default function AdminLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState('projects')
  const closeAdmin = useStore((state) => state.closeAdmin)
  const { playClick } = useSounds()
  const isConnected = isSupabaseConfigured()

  return (
    <div className="fixed inset-0 z-[100] flex bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 backdrop-blur-xl">
        <div>
          {/* Logo / Title */}
          <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800/80 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide text-white">
                Admin Console
              </h1>
              <p className="text-[11px] text-slate-400">3D Pixel Room CMS</p>
            </div>
          </div>

          {/* Database connection badge */}
          <div className="mb-6 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center gap-2 text-xs">
            <Database size={14} className={isConnected ? 'text-emerald-400' : 'text-amber-400'} />
            <div className="flex-1 truncate">
              <span className="font-semibold block text-[11px] text-slate-300">
                {isConnected ? 'Supabase PostgreSQL' : 'Local Storage Mode'}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {isConnected ? 'Realtime Connected' : 'Chưa nhập Supabase key'}
              </span>
            </div>
            {isConnected ? (
              <CheckCircle2 size={14} className="text-emerald-400" />
            ) : (
              <AlertCircle size={14} className="text-amber-400" />
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClick()
                    setActiveTab(tab.id)
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => {
              playClick()
              closeAdmin()
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-800 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>Xem Căn phòng 3D</span>
            </span>
          </button>

          <button
            onClick={() => {
              playClick()
              if (onLogout) onLogout()
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut size={14} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-100">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => closeAdmin()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-600/25 transition"
            >
              Quay lại Portfolio
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'projects' && <AdminProjects />}
          {activeTab === 'skills' && <AdminSkills />}
          {activeTab === 'playlist' && <AdminPlaylist />}
          {activeTab === 'guestbook' && <AdminGuestbook />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  )
}
