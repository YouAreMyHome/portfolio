import React, { useState } from 'react';
import { Github as GitHub, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  
  const projects = t('projects.items');

  return (
    <section id="projects" className="py-16 sm:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('projects.title')}</h2>
          <div className="mt-2 h-1 w-16 sm:w-20 bg-blue-600 mx-auto"></div>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const images = [
              "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
              "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80"
            ];
            
            return (
            <div 
              key={index} 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={images[index] || images[0]} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-110"
                />
                
                {/* Overlay that appears on hover */}
                <div 
                  className={`absolute inset-0 bg-blue-600 bg-opacity-80 flex items-center justify-center space-x-4 transition-opacity duration-300 ${
                    hoveredProject === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                    title={t('projects.viewCode')}
                  >
                    <GitHub size={24} className="text-blue-600" />
                  </a>
                  <a 
                    href="https://example.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                    title={t('projects.liveDemo')}
                  >
                    <ExternalLink size={24} className="text-blue-600" />
                  </a>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;