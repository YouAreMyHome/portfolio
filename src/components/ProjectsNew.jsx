import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github as GitHub, ExternalLink, Info, Users, Calendar, Code, Star, Zap } from 'lucide-react';
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
    <section id="projects" className="py-20 bg-cyber-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-cyber-blue mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-6 h-6" />
            <span className="font-mono text-sm uppercase tracking-wider">Portfolio</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold gradient-cyber-text mb-6">
            {t('projects.title')}
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('projects.description')}
          </p>
          
          <motion.div 
            className="mt-6 h-1 w-20 bg-cyber-gradient mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id || index}
              className="cyber-card rounded-xl overflow-hidden group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, rotateY: 5 }}
              style={{ transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={getProjectImage(project.id, index)}
                  alt={project.title} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Cyber overlay */}
                <motion.div
                  className="absolute inset-0 bg-cyber-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.2 }}
                />
                
                {/* Project Icon Overlay */}
                <motion.div 
                  className="absolute top-4 left-4 w-12 h-12 cyber-card rounded-full flex items-center justify-center text-2xl shadow-cyber"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {getProjectIcon(project.id)}
                </motion.div>

                {/* Featured Badge */}
                {index === 0 && (
                  <motion.div
                    className="absolute top-4 right-4 bg-cyber-gradient text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-3 h-3 inline mr-1" />
                    Featured
                  </motion.div>
                )}

                {/* Hover Actions */}
                <motion.div
                  className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 cyber-card rounded-full text-cyber-blue hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <GitHub className="w-5 h-5" />
                    </motion.a>
                  )}
                  
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 cyber-card rounded-full text-cyber-purple hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.a>
                  )}
                  
                  <motion.button
                    onClick={() => navigate(`/project/${project.id || index + 1}`)}
                    className="p-3 cyber-card rounded-full text-cyber-pink hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Info className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-orbitron font-bold text-white leading-tight group-hover:text-cyber-blue transition-colors">
                    {project.title}
                  </h3>
                  <motion.div
                    className="flex text-cyber-blue"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Star className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Project Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1 text-cyber-purple" />
                    <span>{project.team?.split(' - ')[0] || '2 thành viên'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1 text-cyber-pink" />
                    <span>{project.duration || '3 tháng'}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      className="px-2 py-1 bg-cyber-blue/10 text-cyber-blue text-xs rounded-full border border-cyber-blue/30 font-mono"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 247, 255, 0.2)' }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                  {project.technologies?.length > 3 && (
                    <span className="px-2 py-1 bg-cyber-purple/10 text-cyber-purple text-xs rounded-full border border-cyber-purple/30 font-mono">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => navigate(`/project/${project.id || index + 1}`)}
                    className="flex-1 py-2 px-4 cyber-card text-cyber-blue text-sm font-semibold rounded-lg hover:shadow-cyber transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                  
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 cyber-card text-cyber-purple rounded-lg hover:shadow-cyber transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Code className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
