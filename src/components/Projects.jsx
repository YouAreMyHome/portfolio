import React, { useState } from 'react';
import { Github as GitHub, ExternalLink, Info, Users, Calendar, Code, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  
  const projects = t('projects.items');

  // Improved project images mapping
  const getProjectImage = (projectId, index) => {
    const imageMap = {
      'shn-gear': "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      'hotel-booking': "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      'portfolio-website': "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
    };
    return imageMap[projectId] || imageMap['shn-gear'];
  };

  const getProjectIcon = (projectId) => {
    const iconMap = {
      'shn-gear': '🛒',
      'hotel-booking': '🏨',
      'portfolio-website': '💼'
    };
    return iconMap[projectId] || '🚀';
  };

  return (
    <section id="projects" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('projects.title')}</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('projects.description')}
          </p>
          <div className="mt-2 h-1 w-16 sm:w-20 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id || index} 
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getProjectImage(project.id, index)}
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                />
                
                {/* Project Icon Overlay */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  {getProjectIcon(project.id)}
                </div>

                {/* Featured Badge */}
                {index === 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      <Star size={12} className="mr-1" />
                      {language === 'vi' ? 'Nổi bật' : 'Featured'}
                    </span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${
                    hoveredProject === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/project/${index}`)}
                      className="p-3 bg-white/90 hover:bg-white rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg"
                      title={language === 'vi' ? 'Xem chi tiết' : 'View Details'}
                    >
                      <Info size={20} className="text-blue-600" />
                    </button>
                    <a 
                      href={project.githubUrl || "https://github.com"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-white/90 hover:bg-white rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg"
                      title={t('projects.github')}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GitHub size={20} className="text-gray-800" />
                    </a>
                    <a 
                      href={project.demoUrl || "https://example.com"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-white/90 hover:bg-white rounded-full transition-all duration-200 transform hover:scale-110 shadow-lg"
                      title={t('projects.demo')}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={20} className="text-green-600" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{project.title}</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                  {project.shortDescription || project.description}
                </p>

                {/* Project Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{project.team?.split(' - ')[0] || '2 thành viên'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{project.duration || '3 tháng'}</span>
                  </div>
                  <div className="flex items-center">
                    <Code size={14} className="mr-1" />
                    <span>{project.role?.split(' ')[0] || 'Full-stack'}</span>
                  </div>
                </div>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 4).map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md font-medium border border-blue-200 dark:border-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 4 && (
                    <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;