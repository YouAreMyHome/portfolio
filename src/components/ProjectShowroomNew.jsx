import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Play, Pause, Star, GitFork, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGitHubProjects } from '../hooks/useGitHub';

const ProjectShowroomNew = ({ projects = [], username = 'YouAreMyHome' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showGitHubData, setShowGitHubData] = useState(true);
  
  // Create stable reference for fallback key
  const fallbackKeyRef = useRef(`fallback-${Date.now()}-${Math.random()}`);

  // Use GitHub hook to fetch real projects
  const { 
    projects: gitHubProjects, 
    stats, 
    loading, 
    error, 
    refetch 
  } = useGitHubProjects(username, 8);

  // Use GitHub projects if available, fallback to props
  const projectData = showGitHubData && gitHubProjects.length > 0 ? gitHubProjects : projects;

  // Debug: Log project data
  console.log('ProjectShowroom - Raw projectData:', projectData?.map(p => ({ id: p.id, title: p.title, name: p.name })));

  // Ensure we always have valid project data with unique IDs
  const validProjectData = useMemo(() => {
    if (projectData && projectData.length > 0) {
      // Create a Map to track unique projects by ID and name
      const projectMap = new Map();
      
      projectData.forEach((project, index) => {
        const projectKey = `${project.id}-${project.name || project.title}`;
        if (!projectMap.has(projectKey)) {
          const uniqueKey = `${project.id}-${(project.title || 'untitled').replace(/\s+/g, '-')}-${index}`;
          projectMap.set(projectKey, {
            ...project,
            id: project.id || `project-${index}`,
            uniqueKey
          });
        }
      });
      
      return Array.from(projectMap.values());
    }
    
    // Create fallback with stable key
    return [{
      id: 'loading-fallback',
      uniqueKey: fallbackKeyRef.current,
      title: 'Loading Projects...',
      description: 'Fetching data from GitHub API...',
      technologies: ['React', 'GitHub API'],
      status: 'Loading',
      year: '2024'
    }];
  }, [projectData]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || validProjectData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validProjectData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, validProjectData.length]);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % validProjectData.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + validProjectData.length) % validProjectData.length);
  };

  const currentProject = validProjectData[currentIndex];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-dark overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,247,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,247,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Hero section */}
      <div className="relative z-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="text-6xl font-orbitron font-bold mb-4">
              <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                Project
              </span>
              <span className="text-white ml-4">Showcase</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore my latest projects with interactive visualization
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main showcase container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Stats bar */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="bg-black/50 backdrop-blur-xl border border-cyber-blue/30 rounded-2xl px-8 py-4">
            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-blue">{validProjectData.length}</div>
                <div className="text-gray-400">Projects</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-purple">{currentIndex + 1}</div>
                <div className="text-gray-400">Current</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {loading ? 'Loading' : 'Ready'}
                </div>
                <div className="text-gray-400">Status</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <button 
                  onClick={() => {
                    localStorage.clear(); // Clear GitHub cache
                    window.location.reload(); // Refresh to reload data
                  }}
                  className="px-4 py-2 bg-cyber-purple/20 border border-cyber-purple/30 rounded-lg text-cyber-purple hover:bg-cyber-purple/30 transition-colors text-xs font-mono"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main project display */}
        <div className="relative h-[600px] mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-transparent to-cyber-purple/5 rounded-3xl"></div>
          
          {/* Project cards carousel */}
          <div className="relative h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProject?.uniqueKey}
                className="w-full max-w-5xl"
                initial={{ opacity: 0, x: 100, rotateY: 30 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyber-blue/50 transition-all duration-500 group">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Project preview */}
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-2xl p-8 border border-cyber-blue/20">
                        <div className="h-full bg-black/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                          {/* Animated preview content */}
                          <div className="text-center">
                            <motion.div 
                              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyber-blue/30 to-cyber-purple/30 rounded-2xl flex items-center justify-center"
                              animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <span className="text-3xl">🚀</span>
                            </motion.div>
                            <div className="text-cyber-blue font-mono text-sm mb-2">Live Preview</div>
                            <div className="text-xs text-gray-400">Interactive Demo</div>
                          </div>
                          
                          {/* Floating particles */}
                          <motion.div
                            className="absolute top-4 right-4 w-2 h-2 bg-cyber-blue rounded-full"
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: 0
                            }}
                          />
                          <motion.div
                            className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-cyber-purple rounded-full"
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: 1
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Floating stats */}
                      {currentProject?.stargazers_count > 0 && (
                        <motion.div 
                          className="absolute -top-2 -right-2 bg-amber-500/20 border border-amber-500/50 rounded-full px-3 py-1 flex items-center gap-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Star size={12} className="text-amber-400" />
                          <span className="text-amber-400 text-xs font-mono">{currentProject.stargazers_count}</span>
                        </motion.div>
                      )}
                      
                      {currentProject?.forks_count > 0 && (
                        <motion.div 
                          className="absolute -bottom-2 -left-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-3 py-1 flex items-center gap-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <GitFork size={12} className="text-cyan-400" />
                          <span className="text-cyan-400 text-xs font-mono">{currentProject.forks_count}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Project info */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-4xl font-orbitron font-bold text-white group-hover:text-cyber-blue transition-colors">
                            {currentProject?.title}
                          </h2>
                          {currentProject?.isContributed && (
                            <motion.span 
                              className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              Contributed
                            </motion.span>
                          )}
                          {currentProject?.owner && currentProject?.owner !== username && (
                            <motion.span 
                              className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              by {currentProject.owner}
                            </motion.span>
                          )}
                        </div>
                        
                        <motion.p 
                          className="text-gray-300 text-lg leading-relaxed mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {(() => {
                            const description = currentProject?.description || 'No description available.';
                            // Truncate long descriptions for better display
                            if (description.length > 150) {
                              return description.substring(0, 150) + '...';
                            }
                            return description;
                          })()}
                        </motion.p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-cyber-blue font-mono">
                            {currentProject?.year} • {currentProject?.status || 'Active'}
                          </div>
                          {currentProject?.language && (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-cyber-purple rounded-full"></div>
                              <span className="text-gray-400">{currentProject.language}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h3 className="text-sm font-mono text-gray-400 mb-3">Technologies</h3>
                        <motion.div 
                          className="flex flex-wrap gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {(currentProject?.technologies || []).map((tech, index) => (
                            <motion.span
                              key={`tech-${currentProject?.uniqueKey}-${tech}-${index}`}
                              className="px-3 py-2 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/20 rounded-full text-cyber-blue text-sm font-mono hover:border-cyber-blue/50 transition-colors cursor-default"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>

                      {/* Action buttons */}
                      <motion.div 
                        className="flex gap-4 flex-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <motion.button
                          onClick={() => setSelectedProject(currentProject)}
                          className="px-6 py-3 bg-cyber-blue/20 border border-cyber-blue/50 rounded-xl text-cyber-blue font-mono hover:bg-cyber-blue/30 transition-all duration-300 flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink size={16} />
                          <span>View Details</span>
                        </motion.button>
                        
                        {/* Demo link button */}
                        {currentProject?.link && currentProject.link !== currentProject.github && (
                          <motion.a
                            href={currentProject.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-cyber-purple/20 border border-cyber-purple/50 rounded-xl text-cyber-purple font-mono hover:bg-cyber-purple/30 transition-all duration-300 flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ExternalLink size={16} />
                            <span>Live Demo</span>
                          </motion.a>
                        )}
                        
                        {/* GitHub link button */}
                        {currentProject?.github && (
                          <motion.a
                            href={currentProject.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 font-mono hover:border-white hover:text-white transition-all duration-300 flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Github size={16} />
                            <span>Source Code</span>
                          </motion.a>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <motion.button
            onClick={prevProject}
            className="w-12 h-12 bg-black/50 backdrop-blur-xl border border-cyber-blue/30 rounded-full flex items-center justify-center text-cyber-blue hover:bg-cyber-blue/20 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Pagination dots */}
          <div className="flex items-center gap-3">
            {validProjectData.map((project, index) => (
              <motion.button
                key={`dot-${project.uniqueKey || project.id}-${index}`}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-cyber-blue shadow-lg shadow-cyber-blue/50 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                whileHover={{ scale: index === currentIndex ? 1.25 : 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <motion.button
            onClick={nextProject}
            className="w-12 h-12 bg-black/50 backdrop-blur-xl border border-cyber-blue/30 rounded-full flex items-center justify-center text-cyber-blue hover:bg-cyber-blue/20 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Auto-play toggle */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-6 py-3 rounded-xl font-mono text-sm transition-all duration-300 flex items-center gap-2 ${
              isAutoPlay
                ? 'bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue'
                : 'bg-gray-800/50 border border-gray-600 text-gray-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
            <span>{isAutoPlay ? 'Pause' : 'Play'} Auto-rotation</span>
          </motion.button>
        </div>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
            <motion.div
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-cyber-blue/30 rounded-3xl p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-800/50 hover:bg-red-500/20 border border-gray-600 hover:border-red-500/50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
              >
                ×
              </button>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-orbitron font-bold text-white">
                      {selectedProject.title}
                    </h2>
                    {selectedProject.isContributed && (
                      <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono">
                        Contributed
                      </span>
                    )}
                    {selectedProject.owner && selectedProject.owner !== username && (
                      <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono">
                        by {selectedProject.owner}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="text-cyber-blue font-mono">
                      {selectedProject.year} • {selectedProject.status || 'Active'}
                    </div>
                    {selectedProject.stars > 0 && (
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star size={14} />
                        <span>{selectedProject.stars}</span>
                      </div>
                    )}
                    {selectedProject.forks > 0 && (
                      <div className="flex items-center gap-1 text-cyan-400">
                        <GitFork size={14} />
                        <span>{selectedProject.forks}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 mb-4">
                    <h3 className="text-sm font-mono text-gray-400 mb-2">Repository Description</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {selectedProject.description || 'No description available for this repository.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-mono text-gray-400 mb-3">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProject.technologies || []).map((tech, index) => (
                        <span
                          key={`modal-tech-${selectedProject.uniqueKey || selectedProject.id}-${tech}-${index}`}
                          className="px-3 py-2 bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg text-cyber-blue font-mono text-sm hover:bg-cyber-blue/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-mono text-gray-400 mb-3">Project Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {/* Demo/Live link */}
                      {selectedProject.link && selectedProject.link !== selectedProject.github && (
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-cyber-purple/20 border border-cyber-purple/50 rounded-xl text-cyber-purple font-mono hover:bg-cyber-purple/30 transition-colors flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                      
                      {/* GitHub link */}
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 font-mono hover:border-white hover:text-white transition-colors flex items-center gap-2"
                        >
                          <Github size={16} />
                          Source Code
                        </a>
                      )}
                      
                      {/* Repository link (if different from github) */}
                      {selectedProject.html_url && selectedProject.html_url !== selectedProject.github && (
                        <a
                          href={selectedProject.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-cyber-blue/20 border border-cyber-blue/50 rounded-xl text-cyber-blue font-mono hover:bg-cyber-blue/30 transition-colors flex items-center gap-2"
                        >
                          <Github size={16} />
                          Repository
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Additional project details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                      <h4 className="text-xs font-mono text-gray-400 mb-1">Created</h4>
                      <p className="text-gray-300">{selectedProject.year}</p>
                    </div>
                    
                    <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                      <h4 className="text-xs font-mono text-gray-400 mb-1">Status</h4>
                      <p className="text-gray-300">{selectedProject.status || 'Active'}</p>
                    </div>
                    
                    {selectedProject.primaryLanguage && (
                      <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                        <h4 className="text-xs font-mono text-gray-400 mb-1">Primary Language</h4>
                        <p className="text-gray-300">{selectedProject.primaryLanguage}</p>
                      </div>
                    )}
                    
                    {(selectedProject.stars > 0 || selectedProject.forks > 0) && (
                      <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                        <h4 className="text-xs font-mono text-gray-400 mb-1">GitHub Stats</h4>
                        <div className="flex items-center gap-4 text-sm">
                          {selectedProject.stars > 0 && (
                            <div className="flex items-center gap-1 text-amber-400">
                              <Star size={14} />
                              <span>{selectedProject.stars}</span>
                            </div>
                          )}
                          {selectedProject.forks > 0 && (
                            <div className="flex items-center gap-1 text-cyan-400">
                              <GitFork size={14} />
                              <span>{selectedProject.forks}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Repository metadata */}
                  {selectedProject.fullName && (
                    <div>
                      <h3 className="text-sm font-mono text-gray-400 mb-3">Repository Details</h3>
                      <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-gray-400">Full Name</span>
                          <span className="text-gray-300 font-mono text-sm">{selectedProject.fullName}</span>
                        </div>
                        
                        {selectedProject.default_branch && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-gray-400">Default Branch</span>
                            <span className="text-gray-300 font-mono text-sm">{selectedProject.default_branch}</span>
                          </div>
                        )}
                        
                        {selectedProject.size > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-gray-400">Repository Size</span>
                            <span className="text-gray-300 font-mono text-sm">{(selectedProject.size / 1024).toFixed(1)} MB</span>
                          </div>
                        )}
                        
                        {selectedProject.language && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-gray-400">Main Language</span>
                            <span className="text-gray-300 font-mono text-sm">{selectedProject.language}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-gray-400">Visibility</span>
                          <span className={`font-mono text-xs px-2 py-1 rounded ${
                            selectedProject.isPrivate 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {selectedProject.isPrivate ? 'Private' : 'Public'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Clone commands section */}
                  {selectedProject.clone_url && (
                    <div>
                      <h3 className="text-sm font-mono text-gray-400 mb-3">Clone Repository</h3>
                      <div className="space-y-3">
                        <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-mono text-gray-400">HTTPS</h4>
                            <button
                              onClick={() => navigator.clipboard.writeText(`git clone ${selectedProject.clone_url}`)}
                              className="text-xs text-cyber-blue hover:text-cyber-purple transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                          <code className="text-green-400 font-mono text-sm break-all">
                            git clone {selectedProject.clone_url}
                          </code>
                        </div>
                        
                        {selectedProject.ssh_url && (
                          <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-mono text-gray-400">SSH</h4>
                              <button
                                onClick={() => navigator.clipboard.writeText(`git clone ${selectedProject.ssh_url}`)}
                                className="text-xs text-cyber-blue hover:text-cyber-purple transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                            <code className="text-green-400 font-mono text-sm break-all">
                              git clone {selectedProject.ssh_url}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for grid animation */}
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

export default ProjectShowroomNew;
