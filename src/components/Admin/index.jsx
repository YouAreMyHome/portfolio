import React, { useState, useEffect } from 'react'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient'
import useStore from '../../store/useStore'

export default function AdminIndex() {
  const showAdmin = useStore((state) => state.showAdmin)
  const [currentUser, setCurrentUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if session exists in sessionStorage (for local passcode) or Supabase
    const localAuth = sessionStorage.getItem('portfolio_admin_session')
    if (localAuth) {
      setCurrentUser(JSON.parse(localAuth))
      setCheckingAuth(false)
      return
    }

    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUser(session.user)
        }
        setCheckingAuth(false)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user || null)
      })

      return () => subscription.unsubscribe()
    } else {
      setCheckingAuth(false)
    }
  }, [])

  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    sessionStorage.setItem('portfolio_admin_session', JSON.stringify(user))
  }

  const handleLogout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut()
    }
    sessionStorage.removeItem('portfolio_admin_session')
    setCurrentUser(null)
  }

  // Check if URL is /admin or showAdmin in store is true
  const isUrlAdmin = window.location.pathname.startsWith('/admin')
  if (!showAdmin && !isUrlAdmin) return null

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-slate-400 text-xs font-mono">
        Đang xác thực bảo mật...
      </div>
    )
  }

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return <AdminLayout onLogout={handleLogout} />
}
