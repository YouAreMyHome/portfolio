import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Code,
  Check,
  X,
  Sparkles,
} from 'lucide-react'
import dataService from '../../services/dataService'
import { useSounds } from '../../utils/useSounds'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const { playClick, playSuccess } = useSounds()

  const loadProjects = async () => {
    setLoading(true)
    const data = await dataService.getProjects()
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleOpenCreate = () => {
    playClick()
    setIsNew(true)
    setEditingProject({
      title: '',
      description: '',
      descriptionEn: '',
      fullDescription: '',
      fullDescriptionEn: '',
      image: '',
      tags: [],
      features: [],
      role: 'Full-stack Developer',
      team: '1 thành viên',
      duration: '',
      github: '',
      demo: '',
      featured: true,
    })
  }

  const handleOpenEdit = (project) => {
    playClick()
    setIsNew(false)
    setEditingProject({ ...project })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    playClick()

    await dataService.saveProject(editingProject)
    playSuccess()
    setEditingProject(null)
    loadProjects()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return
    playClick()
    await dataService.deleteProject(id)
    playSuccess()
    loadProjects()
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-200">
            Danh sách Dự án ({projects.length})
          </h3>
          <p className="text-xs text-slate-400">
            Quản lý các sản phẩm hiển thị trong Portfolio OS và trên PC của căn phòng
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus size={16} />
          <span>Thêm Dự án Mới</span>
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
          Đang tải dữ liệu dự án...
        </div>
      ) : projects.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          Chưa có dự án nào. Hãy bấm "Thêm Dự án Mới" để bắt đầu!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-white line-clamp-1">{p.title}</h4>
                  {p.featured && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0">
                      <Star size={10} />
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {p.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(p.tags || []).slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white"
                      title="GitHub"
                    >
                      <Code size={15} />
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white"
                      title="Demo"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Project */}
      {editingProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="font-bold text-base text-white">
                {isNew ? 'Thêm Dự án Mới' : 'Chỉnh sửa Dự án'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tên Dự án *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  placeholder="Ví dụ: 3D Portfolio Room"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Mô tả ngắn (Tiếng Việt) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Mô tả ngắn (English)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.descriptionEn || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, descriptionEn: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tech Tags (cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={(editingProject.tags || []).join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React, Three.js, Node.js, Tailwind"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.demo || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, demo: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Hình ảnh Dự án (URL Cloudinary / Supabase)
                </label>
                <input
                  type="text"
                  value={editingProject.image || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, image: e.target.value })
                  }
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingProject.featured || false}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
                />
                <label htmlFor="featured" className="text-slate-300 font-semibold cursor-pointer">
                  Đánh dấu là Dự án Nổi Bật (Featured)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/25"
                >
                  Lưu Dự án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
