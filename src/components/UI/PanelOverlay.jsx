import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'
import { useState } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'
import emailjs from '@emailjs/browser'
import { 
  Star, Code, ExternalLink,
  Palette, Server, Wrench,
  Briefcase, GraduationCap,
  Dice5, Music, Droplets, Timer,
  Mail, Github, Linkedin, MapPin,
  Cat, PartyPopper,
  BookOpen, Book, Sparkles, AlertTriangle
} from 'lucide-react'
import { personalInfo, aboutMe, skills, projects, experience, education } from '../../data/portfolio'
import { books } from '../../data/books'
import { PortfolioOS } from '../PortfolioOS'
import './Panels.css'

/**
 * Panel Overlay - Hiển thị nội dung portfolio
 * 
 * Panels:
 * - projects: Portfolio OS (Windows 95 style!)
 * - skills: Kỹ năng
 * - playground: Games/Demos
 * - contact: Liên hệ
 * - about: Giới thiệu
 */

// Projects Panel - Connected to portfolio.js
function ProjectsPanel({ isNightMode }) {
  return (
    <div className="panel-content">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className={`project-card ${project.featured ? 'featured' : ''}`}>
            <div className="project-header">
              <h3>{project.title}</h3>
              {project.featured && <span className="featured-badge"><Star size={14} /> Featured</span>}
            </div>
            <p>{project.description}</p>
            <div className="tech-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="project-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Code size={14} /> Code
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} /> Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Skills Panel - Connected to portfolio.js
function SkillsPanel({ isNightMode }) {
  const skillCategories = [
    { key: 'frontend', label: 'Frontend', icon: <Palette size={18} /> },
    { key: 'backend', label: 'Backend', icon: <Server size={18} /> },
    { key: 'tools', label: 'Tools', icon: <Wrench size={18} /> },
  ]
  
  return (
    <div className="panel-content">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skillCategories.map(({ key, label, icon }) => (
          <div key={key} className="skill-group">
            <h3>{icon} {label}</h3>
            <div className="skill-items">
              {skills[key]?.map((skill) => (
                <div key={skill.name} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="skill-level">{skill.level}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Books Panel - Hiển thị sách với jokes và memes
function BooksPanel({ isNightMode }) {
  const [selectedBook, setSelectedBook] = useState(null)
  
  const handleBookClick = (book) => {
    if (book.isRickRoll) {
      // Easter egg - Rick Roll!
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
    } else {
      setSelectedBook(book)
    }
  }
  
  const handleBack = () => {
    setSelectedBook(null)
  }
  
  // Hiển thị nội dung sách đã chọn
  if (selectedBook) {
    return (
      <div className="panel-content">
        <button className="book-back-btn" onClick={handleBack}>
          ← Quay lại kệ sách
        </button>
        <div className="book-content-view">
          <div className="book-cover-large" style={{ background: selectedBook.color }}>
            <Book size={48} />
          </div>
          <h2>{selectedBook.title}</h2>
          <div className="book-pages">
            {selectedBook.content.map((text, index) => (
              <div key={index} className="book-page">
                <span className="page-number">Trang {index + 1}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  // Hiển thị danh sách sách - trông như kệ sách thật
  return (
    <div className="panel-content">
      <h2><BookOpen size={24} style={{display: 'inline', verticalAlign: 'middle', marginRight: '8px'}} /> Tủ Sách</h2>
      <p className="panel-description">Bộ sưu tập sách lập trình của tôi 📚</p>
      
      <div className="books-grid">
        {books.map((book) => (
          <div 
            key={book.id} 
            className="book-card"
            onClick={() => handleBookClick(book)}
          >
            <div className="book-spine" style={{ background: book.color }}>
              <Book size={20} />
            </div>
            <div className="book-info">
              <h3>{book.title}</h3>
              <span className="book-type">
                <Sparkles size={14} /> {book.content.length} chapters
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// About Panel - Connected to portfolio.js
function AboutPanel({ isNightMode }) {
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const { playClick } = useSounds()

  const handleAvatarClick = () => {
    playClick()
    setShowAvatarModal(true)
  }

  const closeAvatarModal = () => {
    setShowAvatarModal(false)
  }

  return (
    <div className="panel-content">
      <h2>About Me</h2>
      <div className="about-header">
        <img 
          src="/assets/img/avatar.jpg" 
          alt={personalInfo.name}
          className="about-avatar clickable"
          onClick={handleAvatarClick}
        />
        <div className="about-info">
          <h3>{personalInfo.name}</h3>
          <p className="about-title">{personalInfo.title}</p>
          <p className="about-tagline">{personalInfo.tagline}</p>
        </div>
      </div>
      <p className="about-intro">{aboutMe.intro}</p>
      <p className="about-description">{aboutMe.description}</p>
      <div className="about-highlights">
        {aboutMe.highlights.map((highlight, i) => (
          <div key={i} className="highlight-item">{highlight}</div>
        ))}
      </div>
      
      {/* Experience */}
      <h3 className="section-title"><Briefcase size={18} /> Experience</h3>
      <div className="experience-list">
        {experience.map((exp) => (
          <div key={exp.id} className="experience-item">
            <div className="exp-header">
              <span className="exp-position">{exp.position}</span>
              <span className="exp-duration">{exp.duration}</span>
            </div>
            <span className="exp-company">{exp.company}</span>
            <p className="exp-description">{exp.description}</p>
          </div>
        ))}
      </div>
      
      {/* Education */}
      <h3 className="section-title"><GraduationCap size={18} /> Education</h3>
      <div className="education-list">
        {education.map((edu) => (
          <div key={edu.id} className="education-item">
            <div className="edu-header">
              <img 
                src="/assets/img/huflit-logo.png" 
                alt="HUFLIT Logo" 
                className="edu-logo"
              />
              <div className="edu-info">
                <span className="edu-school">{edu.school}</span>
                <span className="edu-degree">{edu.degree}</span>
                <span className="edu-duration">{edu.duration}</span>
              </div>
            </div>
            <p className="edu-description">{edu.description}</p>
            <div className="edu-details">
              {edu.gpa && <span className="edu-gpa">GPA: {edu.gpa}</span>}
              {edu.status && <span className="edu-status">{edu.status}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Avatar Modal - Portal to body for proper z-index on mobile */}
      {showAvatarModal && createPortal(
        <div className="avatar-modal-overlay" onClick={closeAvatarModal}>
          <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="avatar-modal-close" onClick={closeAvatarModal}>×</button>
            <img 
              src="/assets/img/avatar.jpg" 
              alt={personalInfo.name}
              className="avatar-modal-image"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// Playground Panel
function PlaygroundPanel({ isNightMode }) {
  const games = [
    { icon: <Dice5 size={24} />, name: 'Dice Roller', desc: 'Roll virtual dice' },
    { icon: <Music size={24} />, name: 'Music Visualizer', desc: 'Audio reactive visuals' },
    { icon: <Droplets size={24} />, name: 'Color Palette', desc: 'Generate color schemes' },
    { icon: <Timer size={24} />, name: 'Pomodoro Timer', desc: 'Focus timer' },
  ]
  
  return (
    <div className="panel-content">
      <h2>Playground</h2>
      <p className="panel-description">Fun experiments and mini-games</p>
      <div className="playground-grid">
        {games.map((game) => (
          <div key={game.name} className="playground-item">
            <span className="playground-icon">{game.icon}</span>
            <div className="playground-info">
              <span className="playground-name">{game.name}</span>
              <span className="playground-desc">{game.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Contact Panel - EmailJS form + social links
function ContactPanel({ isNightMode }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setStatus('sending')
    setErrorMsg('')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: personalInfo.email,
        },
        import.meta.env.VITE_EMAILJS_USER_ID
      )
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
      setErrorMsg('Gửi thất bại. Vui lòng thử lại sau hoặc liên hệ trực tiếp.')
    }
  }

  return (
    <div className="panel-content">
      <h2>Contact</h2>
      <p className="panel-description">Let&apos;s connect and build something awesome!</p>

      {/* Contact form */}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form-group">
          <label htmlFor="contact-name">Tên của bạn</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nguyen Van A"
            required
            disabled={status === 'sending'}
          />
        </div>

        <div className="contact-form-group">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="hello@example.com"
            required
            disabled={status === 'sending'}
          />
        </div>

        <div className="contact-form-group">
          <label htmlFor="contact-message">Tin nhắn</label>
          <textarea
            id="contact-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Chào Nghĩa, tôi muốn..."
            rows={4}
            required
            disabled={status === 'sending'}
          />
        </div>

        {status === 'success' && (
          <div className="contact-feedback contact-success">
            ✓ Đã gửi! Mình sẽ phản hồi sớm nhé 🎉
          </div>
        )}
        {status === 'error' && (
          <div className="contact-feedback contact-error">✗ {errorMsg}</div>
        )}

        <button
          type="submit"
          className="contact-send-btn"
          disabled={status === 'sending' || !form.name || !form.email || !form.message}
        >
          {status === 'sending' ? (
            <><span className="contact-spinner" aria-hidden="true" /> Đang gửi...</>
          ) : (
            <><Mail size={16} /> Gửi tin nhắn</>
          )}
        </button>
      </form>

      <div className="contact-divider">hoặc liên hệ qua</div>

      <div className="contact-links">
        <a href={`mailto:${personalInfo.email}`} className="contact-item">
          <span className="contact-icon"><Mail size={20} /></span>
          <span>{personalInfo.email}</span>
        </a>
        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon"><Github size={20} /></span>
          <span>GitHub</span>
        </a>
        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon"><Linkedin size={20} /></span>
          <span>LinkedIn</span>
        </a>
        <div className="contact-item location">
          <span className="contact-icon"><MapPin size={20} /></span>
          <span>{personalInfo.location}</span>
        </div>
      </div>
    </div>
  )
}

// Main Panel Manager
function PanelOverlay() {
  const activePanel = useStore((state) => state.activePanel)
  const closePanel = useStore((state) => state.closePanel)
  const showEasterEgg = useStore((state) => state.showEasterEgg)
  const isNightMode = useStore((state) => state.isNightMode)
  const { playClick } = useSounds()
  
  // Don't render anything for playground - TVGameOverlay handles it
  if (activePanel === 'playground') return null
  
  // Portfolio OS for projects - renders fullscreen
  if (activePanel === 'projects') {
    return <PortfolioOS onExit={closePanel} />
  }
  
  if (!activePanel && !showEasterEgg) return null
  
  const handleClose = () => {
    playClick()
    closePanel()
  }
  
  // Easter Egg display
  if (showEasterEgg) {
    return (
      <div className="easter-egg-overlay">
        <div className="easter-egg-content">
          <span className="easter-egg-emoji"><Cat size={64} /></span>
          <p>Meow! You found me! <PartyPopper size={20} style={{display: 'inline', verticalAlign: 'middle'}} /></p>
        </div>
      </div>
    )
  }
  
  const renderPanel = () => {
    switch (activePanel) {
      case 'skills':
        return <SkillsPanel isNightMode={isNightMode} />
      case 'playground':
        // Playground is now handled by TVGameOverlay
        return null
      case 'contact':
        return <ContactPanel isNightMode={isNightMode} />
      case 'about':
        return <AboutPanel isNightMode={isNightMode} />
      case 'blog':
        return <BooksPanel isNightMode={isNightMode} />
      default:
        return null
    }
  }
  
  return (
    <div className="panel-overlay" onClick={handleClose}>
      <div className={`panel-container ${isNightMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={handleClose} aria-label="Close">×</button>
        <div className="panel-scroll-content">
          {renderPanel()}
        </div>
      </div>
    </div>
  )
}

export default PanelOverlay
