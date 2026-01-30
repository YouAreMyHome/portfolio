import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Play, Pause, RefreshCw, Star, GitFork } from 'lucide-react';
import { useGitHubProjects } from '../hooks/useGitHub';

const ProjectShowroom = ({ projects = [], username = 'YouAreMyHome' }) => {
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
    if (!isAutoPlay) return;

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

  const getVisibleProjects = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + validProjectData.length) % validProjectData.length;
      visible.push({
        ...validProjectData[index],
        position: i,
        index
      });
    }
    return visible;
  };

  const getProjectStyle = (position) => {
    const baseZ = 50;
    const spacing = 120;
    
    switch (position) {
      case -2:
        return {
          x: -spacing * 2,
          z: baseZ - 30,
          rotateY: 30,
          scale: 0.75,
          opacity: 0.6
        };
      case -1:
        return {
          x: -spacing,
          z: baseZ - 15,
          rotateY: 15,
          scale: 0.9,
          opacity: 0.85
        };
      case 0:
        return {
          x: 0,
          z: baseZ,
          rotateY: 0,
          scale: 1,
          opacity: 1
        };
      case 1:
        return {
          x: spacing,
          z: baseZ - 15,
          rotateY: -15,
          scale: 0.9,
          opacity: 0.85
        };
      case 2:
        return {
          x: spacing * 2,
          z: baseZ - 30,
          rotateY: -30,
          scale: 0.75,
          opacity: 0.6
        };
      default:
        return {
          x: spacing * 3,
          z: baseZ - 50,
          rotateY: position > 0 ? -45 : 45,
          scale: 0.5,
          opacity: 0.2
        };
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Debug Info */}
      <div className="absolute top-4 left-4 z-50">
        <div className="cyber-card p-3 border-cyan-500/30 bg-cyan-500/10 text-xs">
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error ? 'Yes' : 'No'}</div>
          <div>GitHub Projects: {gitHubProjects?.length || 0}</div>
          <div>Valid Projects: {validProjectData?.length || 0}</div>
          <div>Show GitHub: {showGitHubData ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="cyber-card p-8 text-center">
            <RefreshCw className="w-12 h-12 animate-spin text-cyber-blue mx-auto mb-4" />
            <p className="text-cyber-blue font-orbitron">Loading GitHub Projects...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="absolute top-4 right-4 z-50">
          <div className="cyber-card p-4 border-red-500/30 bg-red-500/10">
            <p className="text-red-400 text-sm">Failed to load GitHub data</p>
            <button
              onClick={() => setShowGitHubData(false)}
              className="text-xs text-gray-400 hover:text-white mt-1"
            >
              Use fallback data
            </button>
          </div>
        </div>
      )}
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,247,255,0.1)_0%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Main 3D showcase */}
      <div className="relative w-full h-full flex items-center justify-center perspective-1000">
        <div className="relative w-full h-full flex items-center justify-center transform-gpu">
          {getVisibleProjects().map((project) => {
            const style = getProjectStyle(project.position);
            
            return (
              <motion.div
                key={project.uniqueKey || project.id}
                className="absolute w-80 h-96 cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  x: style.x,
                  z: style.z,
                  rotateY: style.rotateY,
                  scale: style.scale,
                  opacity: style.opacity,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onClick={() => project.position === 0 && setSelectedProject(project)}
                whileHover={project.position === 0 ? { scale: 1.02, z: style.z + 10 } : {}}
              >
                {/* Project card */}
                <div className="w-full h-full cyber-card border-cyber-blue/30 overflow-hidden group">
                  {/* Project image */}
                  <div className="relative h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    
                    {/* Real project image or fallback */}
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2 opacity-60">
                          {project.primaryLanguage?.charAt(0) || '⚡'}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {project.primaryLanguage || 'Project'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status badge */}
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-mono z-20 ${
                      project.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {project.status}
                    </div>

                    {/* GitHub stats */}
                    {(project.stars > 0 || project.forks > 0) && (
                      <div className="absolute top-4 left-4 flex gap-2 z-20">
                        {project.stars > 0 && (
                          <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs">
                            <Star size={10} className="text-yellow-400" />
                            <span className="text-white">{project.stars}</span>
                          </div>
                        )}
                        {project.forks > 0 && (
                          <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs">
                            <GitFork size={10} className="text-gray-400" />
                            <span className="text-white">{project.forks}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Project info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-orbitron font-bold text-white transition-colors">
                          {project.title}
                        </h3>
                        {project.isContributed && (
                          <span className="px-2 py-1 bg-cyber-purple/20 border border-cyber-purple/40 rounded text-xs text-cyber-purple font-mono">
                            Contributor
                          </span>
                        )}
                        {project.owner && project.owner !== 'YouAreMyHome' && (
                          <span className="text-xs text-gray-400 font-mono">
                            by {project.owner}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {project.description}
                      </p>
                      <span className="text-cyber-blue text-xs font-mono">
                        {project.year}
                      </span>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || []).slice(0, 3).map((tech, index) => (
                        <span
                          key={`tech-${project.uniqueKey || project.id}-${tech}-${index}`}
                          className="px-2 py-1 bg-cyber-blue/10 border border-cyber-blue/20 rounded text-xs text-cyber-blue font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies || []).length > 3 && (
                        <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
                          +{(project.technologies || []).length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    {project.position === 0 && (
                      <div className="flex gap-2 mt-4">
                        <motion.a
                          href={project.link}
                          className="flex items-center gap-1 px-3 py-2 bg-cyber-blue/20 border border-cyber-blue/30 rounded text-cyber-blue text-xs hover:bg-cyber-blue/30 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ExternalLink size={12} />
                          View
                        </motion.a>
                        <motion.a
                          href={project.github}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-300 text-xs hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Github size={12} />
                          Code
                        </motion.a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        <motion.button
          onClick={prevProject}
          className="p-3 cyber-card border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div className="flex items-center gap-2">
          {validProjectData.map((project, index) => (
            <motion.button
              key={`dot-${project.uniqueKey || project.id}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-cyber-blue'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`p-3 cyber-card border-cyber-blue/30 transition-colors ${
            isAutoPlay ? 'text-cyber-blue bg-cyber-blue/20' : 'text-gray-400'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
        </motion.button>

        <motion.button
          onClick={nextProject}
          className="p-3 cyber-card border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Project counter and controls */}
      <div className="absolute top-8 right-8 text-right">
        <div className="cyber-card p-4 space-y-2">
          <div className="text-cyber-blue font-orbitron font-bold text-lg">
            {String(currentIndex + 1).padStart(2, '0')}
          </div>
          <div className="text-gray-500 text-sm font-mono">
            of {String(validProjectData.length).padStart(2, '0')}
          </div>
          
          {/* Data source toggle */}
          <div className="pt-2 border-t border-gray-700">
            <button
              onClick={refetch}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyber-blue transition-colors"
              disabled={loading}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="text-xs text-gray-500 mt-1">
              {showGitHubData ? 'Live GitHub' : 'Static Data'}
            </div>
          </div>

          {/* GitHub stats */}
          {stats && showGitHubData && (
            <div className="pt-2 border-t border-gray-700 space-y-1">
              <div className="text-xs text-gray-400">GitHub Stats:</div>
              <div className="text-xs text-cyber-blue">{stats.totalStars} ⭐</div>
              <div className="text-xs text-cyber-purple">{stats.publicRepos} repos</div>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-8 left-8">
        <h2 className="text-3xl font-orbitron font-bold gradient-cyber-text">
          {showGitHubData ? 'Live GitHub Projects' : 'Project Showcase'}
        </h2>
        <p className="text-gray-400 font-mono text-sm mt-2">
          {showGitHubData 
            ? `Real-time data from @${username}` 
            : 'Interactive 3D portfolio display'
          }
        </p>
        
        {/* Last update info */}
        {stats && showGitHubData && (
          <div className="text-xs text-gray-500 mt-1">
            Last activity: {stats.lastActive?.toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="max-w-2xl w-full cyber-card border-cyber-blue/50 p-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-orbitron font-bold text-white">
                  {selectedProject.title}
                </h3>
                {selectedProject.isContributed && (
                  <span className="px-3 py-1 bg-cyber-purple/20 border border-cyber-purple/40 rounded text-sm text-cyber-purple font-mono">
                    Contributor
                  </span>
                )}
                {selectedProject.owner && selectedProject.owner !== 'YouAreMyHome' && (
                  <span className="text-sm text-gray-400 font-mono">
                    by {selectedProject.owner}
                  </span>
                )}
              </div>
              <p className="text-gray-300 mb-6">
                {selectedProject.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-cyber-blue font-orbitron font-bold mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={`modal-tech-${selectedProject.uniqueKey || selectedProject.id}-${tech}-${index}`}
                        className="px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/20 rounded text-cyber-blue font-mono text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-cyber-blue font-orbitron font-bold mb-3">Project Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={selectedProject.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}>
                        {selectedProject.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Year:</span>
                      <span className="text-white">{selectedProject.year}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <motion.a
                  href={selectedProject.link}
                  className="flex items-center gap-2 px-6 py-3 bg-cyber-blue/20 border border-cyber-blue/30 rounded text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={16} />
                  Live Demo
                </motion.a>
                <motion.a
                  href={selectedProject.github}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={16} />
                  Source Code
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectShowroom;
