import React, { useState } from 'react'
import { Lock, Mail, KeyRound, Sparkles, ArrowRight, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'
import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const closeAdmin = useStore((state) => state.closeAdmin)
  const { playClick, playSuccess } = useSounds()

  const isConfigured = isSupabaseConfigured()
  const fallbackCode = import.meta.env.VITE_ADMIN_PASSCODE || 'admin123'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    playClick()

    try {
      if (isConfigured && supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (authError) {
          setError(authError.message || 'Email hoặc mật khẩu không đúng')
          setLoading(false)
          return
        }
        playSuccess()
        onLoginSuccess(data.user)
      } else {
        // Fallback passcode login
        if (passcode.trim() === fallbackCode) {
          playSuccess()
          onLoginSuccess({ email: 'admin@portfolio.local', role: 'admin' })
        } else {
          setError(`Mã bảo mật không đúng (Mặc định: ${fallbackCode})`)
        }
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-indigo-950/60 overflow-hidden">
        {/* Nút thoát về phòng */}
        <button
          onClick={() => {
            playClick()
            closeAdmin()
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-4">
            <Lock size={26} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Quản Trị Căn Phòng 3D
            <Sparkles size={16} className="text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isConfigured
              ? 'Đăng nhập qua tài khoản Supabase Quản trị viên'
              : 'Đang dùng chế độ Fallback Passcode'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {isConfigured ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Quản trị
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mã bảo mật Quản trị (Passcode)
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={`Nhập passcode (mặc định: ${fallbackCode})`}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                * Gợi ý: Khi chưa điền `VITE_SUPABASE_URL`, nhập mã <b>admin123</b> để vào quản trị.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>{loading ? 'Đang xác thực...' : 'Đăng nhập Quản trị'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
