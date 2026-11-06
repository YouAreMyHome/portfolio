import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, Code, ExternalLink } from 'lucide-react'
import { projects } from '../../data/portfolio'
import dataService from '../../services/dataService'

export default function ProjectsPanel() {
  const [projectList, setProjectList] = useState(projects)
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const lf = (vi, en) => (lang === 'en' && en ? en : vi)

  useEffect(() => {
    dataService.getProjects().then((data) => {
      if (data && data.length > 0) setProjectList(data)
    })
  }, [])

  return (
    <div className="panel-content">
      <h2>{t('panel.projects')}</h2>
      <div className="projects-grid">
        {projectList.map((project) => (
          <div key={project.id} className={`project-card ${project.featured ? 'featured' : ''}`}>
            <div className="project-header">
              <h3>{project.title}</h3>
              {project.featured && (
                <span className="featured-badge">
                  <Star size={14} /> {t('panel.featured')}
                </span>
              )}
            </div>
            <p>{lf(project.description, project.descriptionEn)}</p>
            <div className="tech-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="project-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Code size={14} /> {t('panel.code')}
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} /> {t('panel.demo')}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

