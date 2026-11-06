import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Sparkles, Mail, Github, Linkedin, MapPin } from 'lucide-react'
import { IMAGES } from '../../../data/images'
import { personalInfo, aboutMe } from '../../../data/portfolio'

export default function AboutApp() {
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const { i18n } = useTranslation()
  const lf = (vi, en) => (i18n.language === 'en' && en ? en : vi)

  return (
    <div className="window-content">
      <div className="about-content">
        <div className="about-header">
          <img
            src={IMAGES.avatar}
            alt={personalInfo.name}
            className="about-avatar clickable"
            onClick={() => setShowAvatarModal(true)}
            title="Click to view full image"
          />
          <div className="about-name">
            <h2>{personalInfo.name}</h2>
            <p>{lf(personalInfo.title, personalInfo.titleEn)}</p>
            <p style={{ color: '#000080' }}>{lf(personalInfo.tagline, personalInfo.taglineEn)}</p>
          </div>
        </div>

        <div className="about-section">
          <h3>
            <User size={16} /> {lf('Giới thiệu', 'About')}
          </h3>
          <p>{lf(aboutMe.intro, aboutMe.introEn)}</p>
          <p>{lf(aboutMe.description, aboutMe.descriptionEn)}</p>
        </div>

        <div className="about-section">
          <h3>
            <Sparkles size={16} /> {lf('Điểm nổi bật', 'Highlights')}
          </h3>
          <ul className="about-list">
            {(lf(aboutMe.highlights, aboutMe.highlightsEn) || aboutMe.highlights).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="about-section">
          <h3>
            <Mail size={16} /> {lf('Liên hệ', 'Contact')}
          </h3>
          <p>
            <Mail size={14} /> Email: <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
          </p>
          <p>
            <Github size={14} /> GitHub:{' '}
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
              {personalInfo.github}
            </a>
          </p>
          <p>
            <Linkedin size={14} /> LinkedIn:{' '}
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn Profile
            </a>
          </p>
          <p>
            <MapPin size={14} /> {lf('Vị trí', 'Location')}:{' '}
            {lf(personalInfo.location, personalInfo.locationEn)}
          </p>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="avatar-modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="avatar-modal-close" onClick={() => setShowAvatarModal(false)}>
              ×
            </button>
            <img src={IMAGES.avatar} alt={personalInfo.name} className="avatar-modal-image" />
          </div>
        </div>
      )}
    </div>
  )
}

