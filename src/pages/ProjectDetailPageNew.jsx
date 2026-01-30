import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, Star, GitFork, Users, Code, Copy, CheckCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';
import { useGitHubProjects } from '../hooks/useGitHub';

const ProjectDetailPageNew = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  const [copiedText, setCopiedText] = useState('');

  // Get GitHub projects
  const { projects: githubProjects, loading, error } = useGitHubProjects('YouAreMyHome', 20);
  
  // Get static projects from translations
  const staticProjects = t('projects.items');

  // Find project from GitHub or static data
  const [project, setProject] = useState(null);
  const [isGitHubProject, setIsGitHubProject] = useState(false);

  useEffect(() => {
    // Try to find in GitHub projects first
    if (githubProjects && githubProjects.length > 0) {
      const githubProject = githubProjects.find(p => 
        p.id.toString() === projectId || 
        p.repoName === projectId ||
        p.title.toLowerCase().replace(/\s+/g, '-') === projectId
      );
      
      if (githubProject) {
        setProject(githubProject);
        setIsGitHubProject(true);
        return;
      }
    }

    // Fallback to static projects - find by ID or by index
    if (staticProjects && staticProjects.length > 0) {
      // First try to find by ID
      const staticProjectById = staticProjects.find(p => p.id === projectId);
      if (staticProjectById) {
        setProject({
          ...staticProjectById,
          isStatic: true
        });
        setIsGitHubProject(false);
        return;
      }

      // Then try by index (for backward compatibility)
      const projectIndex = parseInt(projectId);
      if (!isNaN(projectIndex) && staticProjects[projectIndex]) {
        setProject({
          ...staticProjects[projectIndex],
          id: projectId,
          isStatic: true
        });
        setIsGitHubProject(false);
        return;
      }
    }

    // If no project found, set to null
    setProject(null);
  }, [projectId, githubProjects, staticProjects]);

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyber-blue font-mono">Loading project details...</p>
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
            {language === 'vi' ? 'Không tìm thấy dự án' : 'Project not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-cyber-blue/20 border border-cyber-blue/50 rounded-xl text-cyber-blue hover:bg-cyber-blue/30 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            {language === 'vi' ? 'Về trang chủ' : 'Back to Home'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="p-3 cyber-card rounded-full text-cyber-blue hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              {isGitHubProject && (
                <>
                  {project.isContributed && (
                    <span className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs">
                      Contributed
                    </span>
                  )}
                  {project.owner && project.owner !== 'YouAreMyHome' && (
                    <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400 text-xs">
                      by {project.owner}
                    </span>
                  )}
                </>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {project.year || new Date().getFullYear()}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Image */}
            <motion.div
              className="aspect-video bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-2xl overflow-hidden border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {(project.image || (project.images && project.images.length > 0)) ? (
                <img
                  src={project.image || project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl opacity-50">
                    {isGitHubProject ? '📁' : '🚀'}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              className="cyber-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-orbitron font-bold text-cyber-blue mb-4">
                {language === 'vi' ? 'Mô tả dự án' : 'Project Description'}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.description || 'No description available.'}
              </p>
            </motion.div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                className="cyber-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-xl font-orbitron font-bold text-cyber-purple mb-4">
                  {language === 'vi' ? 'Công nghệ sử dụng' : 'Technologies Used'}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/20 rounded-full text-cyber-blue font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Features for static projects */}
            {!isGitHubProject && project.features && project.features.length > 0 && (
              <motion.div
                className="cyber-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-xl font-orbitron font-bold text-cyber-pink mb-4">
                  {language === 'vi' ? 'Tính năng chính' : 'Key Features'}
                </h2>
                <div className="space-y-3">
                  {project.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="w-2 h-2 bg-cyber-pink rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Challenges for static projects */}
            {!isGitHubProject && project.challenges && project.challenges.length > 0 && (
              <motion.div
                className="cyber-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-xl font-orbitron font-bold text-amber-400 mb-4">
                  {language === 'vi' ? 'Thử thách và giải pháp' : 'Challenges & Solutions'}
                </h2>
                <div className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{challenge}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Clone Commands for GitHub projects */}
            {isGitHubProject && project.clone_url && (
              <motion.div
                className="cyber-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-xl font-orbitron font-bold text-cyber-pink mb-4">
                  Clone Repository
                </h2>
                <div className="space-y-3">
                  <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-400">HTTPS</span>
                      <button
                        onClick={() => handleCopy(`git clone ${project.clone_url}`, 'https')}
                        className="flex items-center gap-1 text-xs text-cyber-blue hover:text-cyber-purple transition-colors"
                      >
                        {copiedText === 'https' ? <CheckCheck size={12} /> : <Copy size={12} />}
                        {copiedText === 'https' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <code className="text-green-400 font-mono text-sm break-all">
                      git clone {project.clone_url}
                    </code>
                  </div>
                  
                  {project.ssh_url && (
                    <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-gray-400">SSH</span>
                        <button
                          onClick={() => handleCopy(`git clone ${project.ssh_url}`, 'ssh')}
                          className="flex items-center gap-1 text-xs text-cyber-blue hover:text-cyber-purple transition-colors"
                        >
                          {copiedText === 'ssh' ? <CheckCheck size={12} /> : <Copy size={12} />}
                          {copiedText === 'ssh' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <code className="text-green-400 font-mono text-sm break-all">
                        git clone {project.ssh_url}
                      </code>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <motion.div
              className="cyber-card p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-orbitron font-bold text-white mb-4">
                {language === 'vi' ? 'Thông tin dự án' : 'Project Info'}
              </h3>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'In Progress' 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {project.status || 'Active'}
                  </span>
                </div>

                {/* GitHub Stats */}
                {isGitHubProject && (
                  <>
                    {project.stars > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Star size={14} />
                          Stars
                        </span>
                        <span className="text-amber-400">{project.stars}</span>
                      </div>
                    )}
                    {project.forks > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-1">
                          <GitFork size={14} />
                          Forks
                        </span>
                        <span className="text-cyan-400">{project.forks}</span>
                      </div>
                    )}
                    {project.primaryLanguage && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Code size={14} />
                          Language
                        </span>
                        <span className="text-cyber-blue">{project.primaryLanguage}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Static project info */}
                {!isGitHubProject && (
                  <>
                    {project.team && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Users size={14} />
                          Team
                        </span>
                        <span className="text-cyber-blue">{project.team.split(' - ')[0]}</span>
                      </div>
                    )}
                    {project.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-cyber-purple">{project.duration}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Live Demo - for both GitHub and static projects */}
              {((project.link && project.link !== project.github) || project.demoUrl) && (
                <a
                  href={project.demoUrl || project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-cyber-purple/20 border border-cyber-purple/50 rounded-xl text-cyber-purple hover:bg-cyber-purple/30 transition-colors flex items-center gap-2 justify-center"
                >
                  <ExternalLink size={16} />
                  {language === 'vi' ? 'Xem Demo' : 'Live Demo'}
                </a>
              )}

              {/* GitHub - for both GitHub and static projects */}
              {(project.github || project.githubUrl) && (
                <a
                  href={project.github || project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 hover:border-white hover:text-white transition-colors flex items-center gap-2 justify-center"
                >
                  <Github size={16} />
                  {language === 'vi' ? 'Mã nguồn' : 'Source Code'}
                </a>
              )}

              {/* Live URL for static projects (fallback) */}
              {!isGitHubProject && project.liveUrl && !project.demoUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-cyber-blue/20 border border-cyber-blue/50 rounded-xl text-cyber-blue hover:bg-cyber-blue/30 transition-colors flex items-center gap-2 justify-center"
                >
                  <ExternalLink size={16} />
                  {language === 'vi' ? 'Xem trang web' : 'Visit Website'}
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPageNew;
