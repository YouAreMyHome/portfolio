import useStore from '../../store/useStore'
import { useSounds } from '../../utils/useSounds'
import { useState } from 'react'
import React from 'react'
import { personalInfo, aboutMe, skills, projects, experience, education } from '../../data/portfolio'
import './Panels.css'

/**
 * Panel Overlay - Hiển thị nội dung portfolio
 * 
 * Panels:
 * - projects: Các dự án
 * - skills: Kỹ năng
 * - playground: Games/Demos
 * - contact: Liên hệ
 * - about: Giới thiệu
 */

// Projects Panel - Connected to portfolio.js
function ProjectsPanel() {
  return (
    <div className="panel-content">
      <h2>🖥️ Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className={`project-card ${project.featured ? 'featured' : ''}`}>
            <div className="project-header">
              <h3>{project.title}</h3>
              {project.featured && <span className="featured-badge">⭐ Featured</span>}
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
                  🐙 Code
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  🚀 Demo
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
function SkillsPanel() {
  const skillCategories = [
    { key: 'frontend', label: 'Frontend', icon: '🎨' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'tools', label: 'Tools', icon: '🛠️' },
  ]
  
  return (
    <div className="panel-content">
      <h2>⚡ Skills</h2>
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

// About Panel - Connected to portfolio.js
function AboutPanel() {
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
      <h2>👋 About Me</h2>
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
      <h3 className="section-title">💼 Experience</h3>
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
      <h3 className="section-title">🎓 Education</h3>
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
              {edu.gpa && <span className="edu-gpa">📊 GPA: {edu.gpa}</span>}
              {edu.status && <span className="edu-status">📚 {edu.status}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="avatar-modal-overlay" onClick={closeAvatarModal}>
          <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="avatar-modal-close" onClick={closeAvatarModal}>×</button>
            <img 
              src="/assets/img/avatar.jpg" 
              alt={personalInfo.name}
              className="avatar-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Playground Panel
function PlaygroundPanel() {
  const games = [
    { icon: '🎲', name: 'Dice Roller', desc: 'Roll virtual dice' },
    { icon: '🎵', name: 'Music Visualizer', desc: 'Audio reactive visuals' },
    { icon: '🌈', name: 'Color Palette', desc: 'Generate color schemes' },
    { icon: '⏱️', name: 'Pomodoro Timer', desc: 'Focus timer' },
  ]
  
  return (
    <div className="panel-content">
      <h2>🎮 Playground</h2>
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

// Contact Panel - Connected to portfolio.js
function ContactPanel() {
  return (
    <div className="panel-content">
      <h2>📬 Contact</h2>
      <p className="panel-description">Let's connect and build something awesome!</p>
      <div className="contact-links">
        <a href={`mailto:${personalInfo.email}`} className="contact-item">
          <span className="contact-icon">📧</span>
          <span>{personalInfo.email}</span>
        </a>
        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon">🐙</span>
          <span>GitHub</span>
        </a>
        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
          <span className="contact-icon">💼</span>
          <span>LinkedIn</span>
        </a>
        <div className="contact-item location">
          <span className="contact-icon">📍</span>
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
  const { playClick } = useSounds()
  
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
          <span className="easter-egg-emoji">🐱</span>
          <p>Meow! You found me! 🎉</p>
        </div>
      </div>
    )
  }
  
  const renderPanel = () => {
    switch (activePanel) {
      case 'projects':
        return <ProjectsPanel />
      case 'skills':
        return <SkillsPanel />
      case 'playground':
        return <PlaygroundPanel />
      case 'contact':
        return <ContactPanel />
      case 'about':
        return <AboutPanel />
      default:
        return null
    }
  }
  
  return (
    <div className="panel-overlay" onClick={handleClose}>
      <div className="panel-container" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={handleClose}>×</button>
        {renderPanel()}
      </div>
    </div>
  )
}

export default PanelOverlay
