import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Medal, Gamepad2, Flame, RotateCcw } from 'lucide-react'
import useStore from '../../store/useStore'
import dataService from '../../services/dataService'
import { useSounds } from '../../utils/useSounds'

const GAMES = [
  { id: 'snake', name: 'Snake' },
  { id: 'tetris', name: 'Tetris' },
  { id: 'pong', name: 'Pong' },
  { id: 'dino', name: 'Dino Run' },
]

export default function LeaderboardOverlay() {
  const showLeaderboard = useStore((state) => state.showLeaderboard)
  const closeLeaderboard = useStore((state) => state.closeLeaderboard)
  const activeLeaderboardGame = useStore((state) => state.activeLeaderboardGame)
  const { playClick } = useSounds()

  const [currentGame, setCurrentGame] = useState(activeLeaderboardGame || 'snake')
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeLeaderboardGame) {
      setCurrentGame(activeLeaderboardGame)
    }
  }, [activeLeaderboardGame])

  useEffect(() => {
    if (!showLeaderboard) return
    let active = true
    setLoading(true)

    dataService.getGameLeaderboard(currentGame).then((data) => {
      if (active) {
        setScores(data || [])
        setLoading(false)
      }
    })

    return () => {
      active = false
    }
  }, [showLeaderboard, currentGame])

  if (!showLeaderboard) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border-2 border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-950/50 overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg">
                <Trophy size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide text-yellow-400 flex items-center gap-2">
                  Bảng Xếp Hạng Arcade Retro
                </h2>
                <p className="text-xs text-slate-400">
                  Top 10 cao thủ các mini game trên TV
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClick()
                closeLeaderboard()
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Game Tabs */}
          <div className="flex p-2 bg-slate-950/40 border-b border-slate-800 gap-1.5">
            {GAMES.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  playClick()
                  setCurrentGame(g.id)
                }}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  currentGame === g.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Gamepad2 size={14} />
                <span>{g.name}</span>
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="p-4 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                Đang tải bảng xếp hạng...
              </div>
            ) : scores.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm">
                <Medal size={32} className="mb-2 text-slate-600" />
                Chưa có kỷ lục nào được ghi nhận. Hãy chơi game và tạo kỷ lục đầu tiên!
              </div>
            ) : (
              <div className="space-y-2">
                {scores.map((item, index) => {
                  const isTop1 = index === 0
                  const isTop2 = index === 1
                  const isTop3 = index === 2

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isTop1
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : isTop2
                          ? 'bg-slate-400/10 border-slate-400/30 text-slate-300'
                          : isTop3
                          ? 'bg-amber-700/10 border-amber-700/30 text-amber-500'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isTop1
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                              : isTop2
                              ? 'bg-slate-300 text-slate-950'
                              : isTop3
                              ? 'bg-amber-600 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-semibold text-sm truncate max-w-[160px]">
                          {item.player_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-black tracking-wider text-right font-mono">
                          {item.score?.toLocaleString()}
                        </span>
                        {isTop1 && <Flame size={16} className="text-amber-400 animate-bounce" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Bấm vào TV trong phòng để chơi game</span>
            <span className="text-[11px] text-purple-400">Tự động cập nhật</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
