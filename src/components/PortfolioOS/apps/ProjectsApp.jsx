import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FolderOpen, FolderSearch, Info, Star, Square } from 'lucide-react'
import { projects } from '../../../data/portfolio'
import dataService from '../../../services/dataService'

export default function ProjectsApp() {
  const [projectList, setProjectList] = useState(projects)
  const [selectedProject, setSelectedProject] = useState(null)
  const { i18n } = useTranslation()
  const lf = (vi, en) => (i18n.language === 'en' && en ? en : vi)

  useEffect(() => {
    dataService.getProjects().then((data) => {
      if (data && data.length > 0) setProjectList(data)
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
      <div className="projects-toolbar">
        <button className="toolbar-btn">
          <FolderOpen size={14} /> Open
        </button>
        <button className="toolbar-btn">
          <FolderSearch size={14} /> Find
        </button>
        <button className="toolbar-btn">
          <Info size={14} /> Details
        </button>
      </div>
      <div className="window-content">
        <div className="projects-content">
          <div className="projects-list">
            {projectList.map((project) => (
              <div
                key={project.id}
                className={`project-item ${selectedProject === project.id ? 'selected' : ''}`}
                onClick={() => setSelectedProject(project.id)}
                onDoubleClick={() => project.demo && window.open(project.demo, '_blank')}
              >
                <span className="project-icon">
                  {project.featured ? <Star size={20} /> : <Square size={20} />}
                </span>
                <div className="project-info">
                  <h4>{project.title}</h4>
                  <p>{lf(project.description, project.descriptionEn)}</p>
                  <div className="project-tags">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="window-statusbar">
        <span className="statusbar-item">{projectList.length} projects</span>
        <span className="statusbar-item">
          {selectedProject
            ? lf('Double-click để mở demo', 'Double-click to open demo')
            : lf('Chọn một dự án', 'Select a project')}
        </span>
      </div>
    </>
  )
}

