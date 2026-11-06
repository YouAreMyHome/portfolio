import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Briefcase, GraduationCap } from 'lucide-react'
import { IMAGES } from '../../data/images'
import { personalInfo, aboutMe, experience, education } from '../../data/portfolio'
import { useSounds } from '../../utils/useSounds'

export default function AboutPanel() {
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const { playClick } = useSounds()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const lf = (vi, en) => (lang === 'en' && en ? en : vi)

  const handleAvatarClick = () => {
    playClick()
    setShowAvatarModal(true)
  }

  const closeAvatarModal = () => {
    setShowAvatarModal(false)
  }

  return (
    <div className="panel-content">
      <h2>{t('panel.about')}</h2>
      <div className="about-header">
        <img
          src={IMAGES.avatar}
          alt={personalInfo.name}
          className="about-avatar clickable"
          onClick={handleAvatarClick}
        />
        <div className="about-info">
          <h3>{personalInfo.name}</h3>
          <p className="about-title">{lf(personalInfo.title, personalInfo.titleEn)}</p>
          <p className="about-tagline">{lf(personalInfo.tagline, personalInfo.taglineEn)}</p>
        </div>
      </div>
      <p className="about-intro">{lf(aboutMe.intro, aboutMe.introEn)}</p>
      <p className="about-description">{lf(aboutMe.description, aboutMe.descriptionEn)}</p>
      <div className="about-highlights">
        {(lf(aboutMe.highlights, aboutMe.highlightsEn) || aboutMe.highlights).map((highlight, i) => (
          <div key={i} className="highlight-item">
            {highlight}
          </div>
        ))}
      </div>

      {/* Experience */}
      <h3 className="section-title">
        <Briefcase size={18} /> {t('panel.experience')}
      </h3>
      <div className="experience-list">
        {experience.map((exp) => (
          <div key={exp.id} className="experience-item">
            <div className="exp-header">
              <span className="exp-position">{lf(exp.position, exp.positionEn)}</span>
              <span className="exp-duration">{lf(exp.duration, exp.durationEn)}</span>
            </div>
            <span className="exp-company">{exp.company}</span>
            <p className="exp-description">{lf(exp.description, exp.descriptionEn)}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <h3 className="section-title">
        <GraduationCap size={18} /> {t('panel.education')}
      </h3>
      <div className="education-list">
        {education.map((edu) => (
          <div key={edu.id} className="education-item">
            <div className="edu-header">
              <img src={IMAGES.huflitLogo} alt="HUFLIT Logo" className="edu-logo" />
              <div className="edu-info">
                <span className="edu-school">{lf(edu.school, edu.schoolEn)}</span>
                <span className="edu-degree">{lf(edu.degree, edu.degreeEn)}</span>
                <span className="edu-duration">{edu.duration}</span>
              </div>
            </div>
            <p className="edu-description">{lf(edu.description, edu.descriptionEn)}</p>
            <div className="edu-details">
              {edu.gpa && <span className="edu-gpa">GPA: {edu.gpa}</span>}
              {edu.status && <span className="edu-status">{lf(edu.status, edu.statusEn)}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Avatar Modal */}
      {showAvatarModal &&
        createPortal(
          <div className="avatar-modal-overlay" onClick={closeAvatarModal}>
            <div className="avatar-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="avatar-modal-close" onClick={closeAvatarModal}>
                ×
              </button>
              <img src={IMAGES.avatar} alt={personalInfo.name} className="avatar-modal-image" />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

