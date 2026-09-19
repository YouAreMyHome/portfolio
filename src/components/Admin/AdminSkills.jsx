import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Save, Wrench, Palette, Server } from 'lucide-react'
import dataService from '../../services/dataService'
import { useSounds } from '../../utils/useSounds'

const CATEGORIES = [
  { key: 'frontend', label: 'Frontend', icon: Palette },
  { key: 'backend', label: 'Backend', icon: Server },
  { key: 'tools', label: 'Công cụ (Tools)', icon: Wrench },
]

export default function AdminSkills() {
  const [skillsData, setSkillsData] = useState({ frontend: [], backend: [], tools: [] })
  const [activeCat, setActiveCat] = useState('frontend')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState(80)
  const { playClick, playSuccess } = useSounds()

  const loadSkills = async () => {
    setLoading(true)
    const data = await dataService.getSkills()
    setSkillsData(data || { frontend: [], backend: [], tools: [] })
    setLoading(false)
  }

  useEffect(() => {
    loadSkills()
  }, [])

  const handleLevelChange = (index, newLevel) => {
    const items = [...(skillsData[activeCat] || [])]
    items[index].level = Number(newLevel)
    setSkillsData({ ...skillsData, [activeCat]: items })
  }

  const handleDeleteSkill = (index) => {
    const items = [...(skillsData[activeCat] || [])]
    items.splice(index, 1)
    setSkillsData({ ...skillsData, [activeCat]: items })
  }

  const handleAddSkill = (e) => {
    e.preventDefault()
    if (!newSkillName.trim()) return
    playClick()

    const items = [...(skillsData[activeCat] || [])]
    items.push({
      name: newSkillName.trim(),
      level: Number(newSkillLevel),
    })

    setSkillsData({ ...skillsData, [activeCat]: items })
    setNewSkillName('')
    setNewSkillLevel(80)
  }

  const handleSaveCategory = async () => {
    playClick()
    setSaving(true)
    await dataService.saveSkillCategory(activeCat, skillsData[activeCat] || [])
    playSuccess()
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Quản lý Kỹ năng</h3>
          <p className="text-xs text-slate-400">
            Chỉnh sửa các kỹ năng và thanh tiến độ hiển thị trên Plan Board
          </p>
        </div>

        <button
          onClick={handleSaveCategory}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
        >
          <Save size={15} />
          <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex p-1.5 bg-slate-900 border border-slate-800 rounded-xl gap-2">
        {CATEGORIES.map((c) => {
          const Icon = c.icon
          const isActive = activeCat === c.key
          return (
            <button
              key={c.key}
              onClick={() => {
                playClick()
                setActiveCat(c.key)
              }}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={16} />
              <span>{c.label}</span>
            </button>
          )
        })}
      </div>

      {/* Skills list for current category */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-400 text-xs">Đang tải kỹ năng...</div>
        ) : (skillsData[activeCat] || []).length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Chưa có kỹ năng nào trong danh mục này.
          </div>
        ) : (
          <div className="space-y-4">
            {(skillsData[activeCat] || []).map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60"
              >
                <div className="w-32 truncate font-semibold text-xs text-white">
                  {skill.name}
                </div>

                {/* Progress bar and slider */}
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={skill.level}
                    onChange={(e) => handleLevelChange(idx, e.target.value)}
                    className="flex-1 accent-indigo-500 cursor-pointer"
                  />
                  <span className="w-10 text-right font-mono text-xs font-bold text-indigo-400">
                    {skill.level}%
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteSkill(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700"
                  title="Xóa kỹ năng"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add skill row */}
        <form onSubmit={handleAddSkill} className="pt-4 border-t border-slate-800 flex gap-3">
          <input
            type="text"
            placeholder="Tên kỹ năng mới (ví dụ: Next.js, Docker)..."
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex items-center gap-2 px-3 bg-slate-800 border border-slate-700 rounded-xl">
            <span className="text-xs text-slate-400">Mức độ:</span>
            <input
              type="number"
              min="10"
              max="100"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-14 bg-transparent text-xs text-white text-center focus:outline-none"
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
          >
            <Plus size={15} />
            <span>Thêm</span>
          </button>
        </form>
      </div>
    </div>
  )
}
