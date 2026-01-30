import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectShowroomNew from '../components/ProjectShowroomNew';
import SkillRadar from '../components/SkillRadar';
import GitHubStats from '../components/GitHubStats';
import { SectionTransition } from '../components/CyberTransition';

const ShowcasePage = () => {
  const [activeView, setActiveView] = useState('projects');

  // Fallback projects for testing
  const fallbackProjects = [
    {
      id: 'demo-1',
      title: 'Demo Project 1',
      description: 'This is a demo project to test the showcase',
      technologies: ['React', 'JavaScript', 'CSS'],
      year: '2024',
      status: 'Completed'
    },
    {
      id: 'demo-2', 
      title: 'Demo Project 2',
      description: 'Another demo project for testing',
      technologies: ['Vue.js', 'TypeScript', 'SCSS'],
      year: '2024', 
      status: 'In Progress'
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-cyber-blue/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-cyber-blue hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-orbitron font-bold">Back to Portfolio</span>
            </Link>
            
            <div className="flex gap-4">
              <button
                onClick={() => setActiveView('projects')}
                className={`px-4 py-2 rounded font-mono text-sm transition-colors ${
                  activeView === 'projects'
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                3D Projects
              </button>
              <button
                onClick={() => setActiveView('skills')}
                className={`px-4 py-2 rounded font-mono text-sm transition-colors ${
                  activeView === 'skills'
                    ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Skill Radar
              </button>
              <button
                onClick={() => setActiveView('github')}
                className={`px-4 py-2 rounded font-mono text-sm transition-colors ${
                  activeView === 'github'
                    ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Github size={16} className="inline mr-1" />
                GitHub Stats
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20">
        {activeView === 'projects' && (
          <SectionTransition>
            <ProjectShowroomNew 
              username="YouAreMyHome" 
              projects={fallbackProjects}
            />
          </SectionTransition>
        )}

        {activeView === 'skills' && (
          <SectionTransition>
            <div className="min-h-screen flex items-center justify-center p-8">
              <div className="max-w-4xl w-full">
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-cyber-text mb-4">
                    Skill Visualization
                  </h1>
                  <p className="text-gray-400 font-mono text-lg">
                    Interactive radar chart showing technical expertise
                  </p>
                </motion.div>

                <div className="flex justify-center">
                  <SkillRadar size={400} />
                </div>

                {/* Additional Skills Info */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {[
                    { category: 'Frontend', count: 8, color: 'cyber-blue' },
                    { category: 'Backend', count: 6, color: 'cyber-purple' },
                    { category: 'Database', count: 4, color: 'cyber-pink' },
                    { category: 'DevOps', count: 5, color: 'cyan-400' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.category}
                      className="cyber-card p-6 text-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className={`text-2xl font-orbitron font-bold text-${item.color} mb-2`}>
                        {item.count}+
                      </h3>
                      <p className="text-gray-300 font-mono text-sm">
                        {item.category} Technologies
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </SectionTransition>
        )}

        {activeView === 'github' && (
          <SectionTransition>
            <div className="min-h-screen p-8 pt-24">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-6xl font-orbitron font-bold gradient-cyber-text mb-4">
                    GitHub Analytics
                  </h1>
                  <p className="text-gray-400 font-mono text-lg">
                    Real-time statistics and activity from @YouAreMyHome
                  </p>
                </motion.div>

                <GitHubStats username="YouAreMyHome" />
              </div>
            </div>
          </SectionTransition>
        )}
      </main>
    </div>
  );
};

export default ShowcasePage;
