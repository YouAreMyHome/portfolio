import { useState, useEffect } from 'react'
import { Monitor, Palette, Server, Wrench } from 'lucide-react'
import { skills } from '../../../data/portfolio'
import dataService from '../../../services/dataService'

export default function SkillsApp() {
  const [skillsData, setSkillsData] = useState(skills)
  const categories = [
    { key: 'frontend', label: 'Frontend', icon: <Palette size={16} /> },
    { key: 'backend', label: 'Backend', icon: <Server size={16} /> },
    { key: 'tools', label: 'Tools', icon: <Wrench size={16} /> },
  ]

  useEffect(() => {
    dataService.getSkills().then((data) => {
      if (data) setSkillsData(data)
    })
  }, [])

  return (
    <>
      <div className="window-menubar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>
      <div className="window-content">
        <div className="skills-content">
          <div className="skills-header">
            <span style={{ fontSize: 32 }}>
              <Monitor />
            </span>
            <h2>My Computer - Technical Skills</h2>
          </div>

          {categories.map((cat) => (
            <div key={cat.key} className="skill-category">
              <h3>
                {cat.icon} {cat.label}
              </h3>
              {skillsData[cat.key]?.map((skill) => (
                <div key={skill.name} className="skill-row">
                  <span className="skill-name">{skill.name}</span>
                  <div className="skill-bar-container">
                    <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                  <span className="skill-level">{skill.level}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="window-statusbar">
        <span className="statusbar-item">{Object.values(skillsData).flat().length} skills</span>
        <span className="statusbar-item">Ready</span>
      </div>
    </>
  )
}

