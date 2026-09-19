import { supabase, isSupabaseConfigured } from './supabaseClient'
import {
  personalInfo as defaultPersonalInfo,
  aboutMe as defaultAboutMe,
  skills as defaultSkills,
  projects as defaultProjects,
  experience as defaultExperience,
  education as defaultEducation,
} from '../data/portfolio'
import { playlist as defaultPlaylist } from '../data/playlist'

// LocalStorage cache keys for offline edits / local fallback
const STORAGE_KEYS = {
  PROJECTS: 'portfolio_local_projects',
  SKILLS: 'portfolio_local_skills',
  PLAYLIST: 'portfolio_local_playlist',
  PROFILE: 'portfolio_local_profile',
  GUESTBOOK: 'portfolio_local_guestbook',
  GAME_SCORES: 'portfolio_local_scores',
}

const getStored = (key, fallback) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch (e) {
    console.warn('LocalStorage read error:', e)
    return fallback
  }
}

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('LocalStorage write error:', e)
  }
}

// ==========================================
// 1. PROJECTS
// ==========================================
export const dataService = {
  async getProjects() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })

        if (!error && data && data.length > 0) {
          // Normalize Supabase format to app project schema
          return data.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            descriptionEn: p.description_en || p.description,
            fullDescription: p.full_description || p.description,
            fullDescriptionEn: p.full_description_en || p.description_en,
            image: p.image,
            tags: p.tags || [],
            features: p.features || [],
            featuresEn: p.features_en || [],
            role: p.role || 'Full-stack Developer',
            team: p.team || '1 thành viên',
            teamEn: p.team_en || '1 member',
            duration: p.duration || '',
            durationEn: p.duration_en || '',
            github: p.github,
            demo: p.demo,
            featured: p.featured ?? true,
            sort_order: p.sort_order ?? 0,
          }))
        }
      } catch (err) {
        console.warn('Supabase getProjects error, falling back:', err)
      }
    }

    return getStored(STORAGE_KEYS.PROJECTS, defaultProjects)
  },

  async saveProject(project) {
    if (isSupabaseConfigured() && supabase) {
      const payload = {
        title: project.title,
        description: project.description,
        description_en: project.descriptionEn,
        full_description: project.fullDescription,
        full_description_en: project.fullDescriptionEn,
        image: project.image,
        tags: project.tags,
        features: project.features,
        features_en: project.featuresEn,
        role: project.role,
        team: project.team,
        team_en: project.teamEn,
        duration: project.duration,
        duration_en: project.durationEn,
        github: project.github,
        demo: project.demo,
        featured: project.featured,
        sort_order: project.sort_order ?? 0,
      }

      if (project.id && typeof project.id === 'number' && project.id > 100) {
        const { data, error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', project.id)
          .select()
        if (!error) return data[0]
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert([payload])
          .select()
        if (!error) return data[0]
      }
    }

    // Local fallback update
    const current = getStored(STORAGE_KEYS.PROJECTS, defaultProjects)
    let updated
    if (project.id) {
      updated = current.map((p) => (p.id === project.id ? { ...p, ...project } : p))
    } else {
      const newId = Date.now()
      updated = [...current, { ...project, id: newId }]
    }
    setStored(STORAGE_KEYS.PROJECTS, updated)
    return project
  },

  async deleteProject(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id)
      } catch (e) {
        console.warn('Supabase delete error:', e)
      }
    }
    const current = getStored(STORAGE_KEYS.PROJECTS, defaultProjects)
    const updated = current.filter((p) => p.id !== id)
    setStored(STORAGE_KEYS.PROJECTS, updated)
    return true
  },

  // ==========================================
  // 2. SKILLS
  // ==========================================
  async getSkills() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true })

        if (!error && data && data.length > 0) {
          const grouped = { frontend: [], backend: [], tools: [] }
          data.forEach((s) => {
            if (grouped[s.category]) {
              grouped[s.category].push({
                id: s.id,
                name: s.name,
                level: s.level,
                icon: s.icon,
              })
            }
          })
          return grouped
        }
      } catch (err) {
        console.warn('Supabase getSkills error, falling back:', err)
      }
    }

    return getStored(STORAGE_KEYS.SKILLS, defaultSkills)
  },

  async saveSkillCategory(category, skillItems) {
    if (isSupabaseConfigured() && supabase) {
      try {
        // Simple replace for category
        await supabase.from('skills').delete().eq('category', category)
        const rows = skillItems.map((item, idx) => ({
          category,
          name: item.name,
          level: item.level,
          icon: item.icon || null,
          sort_order: idx,
        }))
        await supabase.from('skills').insert(rows)
      } catch (e) {
        console.warn('Supabase skill update error:', e)
      }
    }
    const current = getStored(STORAGE_KEYS.SKILLS, defaultSkills)
    const updated = { ...current, [category]: skillItems }
    setStored(STORAGE_KEYS.SKILLS, updated)
    return updated
  },

  // ==========================================
  // 3. PLAYLIST
  // ==========================================
  async getPlaylist() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('playlist')
          .select('*')
          .order('sort_order', { ascending: true })

        if (!error && data && data.length > 0) {
          return data.map((t) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            src: t.src,
            duration: t.duration || '3:30',
            coverUrl: t.cover_url,
          }))
        }
      } catch (err) {
        console.warn('Supabase getPlaylist error, falling back:', err)
      }
    }

    return getStored(STORAGE_KEYS.PLAYLIST, defaultPlaylist)
  },

  async savePlaylist(songs) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('playlist').delete().neq('id', -1)
        const rows = songs.map((s, idx) => ({
          title: s.title,
          artist: s.artist,
          src: s.src,
          duration: s.duration,
          cover_url: s.coverUrl || null,
          sort_order: idx,
        }))
        await supabase.from('playlist').insert(rows)
      } catch (e) {
        console.warn('Supabase playlist save error:', e)
      }
    }
    setStored(STORAGE_KEYS.PLAYLIST, songs)
    return songs
  },

  // ==========================================
  // 4. PROFILE & BIO
  // ==========================================
  async getProfile() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1)
        if (!error && data && data.length > 0) {
          const p = data[0]
          return {
            personalInfo: {
              name: p.name,
              title: p.title_vi,
              titleEn: p.title_en,
              tagline: p.tagline_vi,
              taglineEn: p.tagline_en,
              email: p.email,
              phone: p.phone,
              github: p.github,
              linkedin: p.linkedin,
              website: p.website,
              location: p.location_vi,
              locationEn: p.location_en,
            },
            aboutMe: {
              intro: p.intro_vi,
              introEn: p.intro_en,
              description: p.description_vi,
              descriptionEn: p.description_en,
              highlights: defaultAboutMe.highlights,
              highlightsEn: defaultAboutMe.highlightsEn,
            },
          }
        }
      } catch (e) {
        console.warn('Supabase getProfile error:', e)
      }
    }

    const stored = getStored(STORAGE_KEYS.PROFILE, null)
    if (stored) return stored

    return {
      personalInfo: defaultPersonalInfo,
      aboutMe: defaultAboutMe,
    }
  },

  async saveProfile(profileData) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          name: profileData.personalInfo.name,
          title_vi: profileData.personalInfo.title,
          title_en: profileData.personalInfo.titleEn,
          tagline_vi: profileData.personalInfo.tagline,
          tagline_en: profileData.personalInfo.taglineEn,
          email: profileData.personalInfo.email,
          phone: profileData.personalInfo.phone,
          github: profileData.personalInfo.github,
          linkedin: profileData.personalInfo.linkedin,
          website: profileData.personalInfo.website,
          location_vi: profileData.personalInfo.location,
          location_en: profileData.personalInfo.locationEn,
          intro_vi: profileData.aboutMe.intro,
          intro_en: profileData.aboutMe.introEn,
          description_vi: profileData.aboutMe.description,
          description_en: profileData.aboutMe.descriptionEn,
          updated_at: new Date().toISOString(),
        }

        const { data: existing } = await supabase.from('profiles').select('id').limit(1)
        if (existing && existing.length > 0) {
          await supabase.from('profiles').update(payload).eq('id', existing[0].id)
        } else {
          await supabase.from('profiles').insert([payload])
        }
      } catch (e) {
        console.warn('Supabase profile save error:', e)
      }
    }
    setStored(STORAGE_KEYS.PROFILE, profileData)
    return profileData
  },

  // ==========================================
  // 5. GUESTBOOK / STICKY NOTES
  // ==========================================
  async getGuestbookNotes() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && data) return data
      } catch (e) {
        console.warn('Supabase guestbook error:', e)
      }
    }

    // Default sample sticky notes
    const defaultNotes = [
      {
        id: 1,
        author_name: 'Minh Hoàng',
        message: 'Căn phòng 3D quá đẹp và sáng tạo! Chúc Nghĩa ngày càng thành công nhé 🚀',
        color: '#fef08a',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        is_approved: true,
      },
      {
        id: 2,
        author_name: 'Sarah',
        message: 'Love the cozy lofi vibes and the retro games on TV! Great job! ✨',
        color: '#bae6fd',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        is_approved: true,
      },
      {
        id: 3,
        author_name: 'Khánh Duy',
        message: 'Game Snake nghiện thật sự, đã phá kỷ lục 120 điểm rồi nha 😎',
        color: '#fbcfe8',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        is_approved: true,
      },
    ]

    return getStored(STORAGE_KEYS.GUESTBOOK, defaultNotes)
  },

  async addGuestbookNote(note) {
    const newNote = {
      author_name: note.authorName || 'Ẩn danh',
      message: note.message,
      color: note.color || '#fef08a',
      is_approved: true,
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('guestbook').insert([newNote]).select()
        if (!error && data) return data[0]
      } catch (e) {
        console.warn('Supabase add guestbook error:', e)
      }
    }

    const current = getStored(STORAGE_KEYS.GUESTBOOK, [])
    const updated = [{ ...newNote, id: Date.now() }, ...current]
    setStored(STORAGE_KEYS.GUESTBOOK, updated)
    return updated[0]
  },

  async deleteGuestbookNote(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('guestbook').delete().eq('id', id)
      } catch (e) {
        console.warn('Supabase delete guestbook error:', e)
      }
    }
    const current = getStored(STORAGE_KEYS.GUESTBOOK, [])
    const updated = current.filter((n) => n.id !== id)
    setStored(STORAGE_KEYS.GUESTBOOK, updated)
    return true
  },

  // ==========================================
  // 6. GAME LEADERBOARD
  // ==========================================
  async getGameLeaderboard(gameName) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('game_scores')
          .select('*')
          .eq('game_name', gameName)
          .order('score', { ascending: false })
          .limit(10)

        if (!error && data) return data
      } catch (e) {
        console.warn('Supabase game scores error:', e)
      }
    }

    const allScores = getStored(STORAGE_KEYS.GAME_SCORES, {
      snake: [
        { player_name: 'PixelKing', score: 140, created_at: new Date().toISOString() },
        { player_name: 'Nghia Le', score: 95, created_at: new Date().toISOString() },
        { player_name: 'Guest99', score: 60, created_at: new Date().toISOString() },
      ],
      tetris: [
        { player_name: 'RetroFan', score: 12400, created_at: new Date().toISOString() },
        { player_name: 'Nghia Le', score: 8500, created_at: new Date().toISOString() },
      ],
      pong: [
        { player_name: 'Champion', score: 15, created_at: new Date().toISOString() },
        { player_name: 'HUFLIT_Dev', score: 11, created_at: new Date().toISOString() },
      ],
      dino: [
        { player_name: 'T-Rex Master', score: 980, created_at: new Date().toISOString() },
        { player_name: 'Runner', score: 620, created_at: new Date().toISOString() },
      ],
    })

    return allScores[gameName] || []
  },

  async submitGameScore(gameName, playerName, score) {
    const entry = {
      game_name: gameName,
      player_name: playerName || 'Player',
      score: Number(score),
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('game_scores').insert([entry]).select()
        if (!error && data) return data[0]
      } catch (e) {
        console.warn('Supabase submit score error:', e)
      }
    }

    const allScores = getStored(STORAGE_KEYS.GAME_SCORES, {})
    const currentList = allScores[gameName] || []
    const updatedList = [...currentList, entry].sort((a, b) => b.score - a.score).slice(0, 10)
    allScores[gameName] = updatedList
    setStored(STORAGE_KEYS.GAME_SCORES, allScores)
    return entry
  },
}

export default dataService
