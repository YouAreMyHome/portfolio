import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Palette, Server, Wrench } from 'lucide-react'
import { skills } from '../../data/portfolio'
import dataService from '../../services/dataService'

export default function SkillsPanel() {
  const [skillsData, setSkillsData] = useState(skills)
  const { t } = useTranslation()
  const skillCategories = [
    { key: 'frontend', label: t('panel.skills_frontend'), icon: <Palette size={18} /> },
    { key: 'backend', label: t('panel.skills_backend'), icon: <Server size={18} /> },
    { key: 'tools', label: t('panel.skills_tools'), icon: <Wrench size={18} /> },
  ]

  useEffect(() => {
    dataService.getSkills().then((data) => {
      if (data) setSkillsData(data)
    })
  }, [])

  return (
    <div className="panel-content">
      <h2>{t('panel.skills')}</h2>
      <div className="skills-grid">
        {skillCategories.map(({ key, label, icon }) => (
          <div key={key} className="skill-group">
            <h3>
              {icon} {label}
            </h3>
            <div className="skill-items">
              {skillsData[key]?.map((skill) => (
                <div key={skill.name} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{ width: `${skill.level}%` }} />
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

