import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Lock, Zap, Award, Code, Database, Server, Smartphone, Palette, Brain } from 'lucide-react';
import { useCyberSounds } from './SoundSystem';

const SkillTreeRPG = ({ onSkillUnlock, playerLevel = 1 }) => {
  const [unlockedSkills, setUnlockedSkills] = useState(new Set(['html', 'css', 'javascript']));
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillPoints, setSkillPoints] = useState(15);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const sounds = useCyberSounds();

  // Skill tree data with RPG progression
  const skillCategories = {
    frontend: {
      name: 'Frontend Mastery',
      icon: Palette,
      color: 'cyber-blue',
      skills: {
        html: { name: 'HTML', level: 1, cost: 0, prerequisite: null, xp: 100 },
        css: { name: 'CSS', level: 1, cost: 0, prerequisite: null, xp: 100 },
        javascript: { name: 'JavaScript', level: 2, cost: 0, prerequisite: null, xp: 150 },
        react: { name: 'React', level: 3, cost: 3, prerequisite: 'javascript', xp: 200 },
        vue: { name: 'Vue.js', level: 3, cost: 3, prerequisite: 'javascript', xp: 200 },
        typescript: { name: 'TypeScript', level: 4, cost: 4, prerequisite: 'javascript', xp: 250 },
        nextjs: { name: 'Next.js', level: 5, cost: 5, prerequisite: 'react', xp: 300 },
        tailwind: { name: 'Tailwind CSS', level: 3, cost: 2, prerequisite: 'css', xp: 180 },
      }
    },
    backend: {
      name: 'Backend Engineering',
      icon: Server,
      color: 'cyber-purple',
      skills: {
        nodejs: { name: 'Node.js', level: 3, cost: 3, prerequisite: 'javascript', xp: 200 },
        express: { name: 'Express.js', level: 4, cost: 3, prerequisite: 'nodejs', xp: 220 },
        python: { name: 'Python', level: 2, cost: 2, prerequisite: null, xp: 150 },
        django: { name: 'Django', level: 4, cost: 4, prerequisite: 'python', xp: 250 },
        fastapi: { name: 'FastAPI', level: 4, cost: 4, prerequisite: 'python', xp: 240 },
        php: { name: 'PHP', level: 2, cost: 2, prerequisite: null, xp: 140 },
        laravel: { name: 'Laravel', level: 4, cost: 4, prerequisite: 'php', xp: 260 },
      }
    },
    database: {
      name: 'Data Management',
      icon: Database,
      color: 'cyber-pink',
      skills: {
        mysql: { name: 'MySQL', level: 2, cost: 2, prerequisite: null, xp: 160 },
        mongodb: { name: 'MongoDB', level: 3, cost: 3, prerequisite: null, xp: 180 },
        postgresql: { name: 'PostgreSQL', level: 3, cost: 3, prerequisite: 'mysql', xp: 200 },
        redis: { name: 'Redis', level: 4, cost: 3, prerequisite: 'mongodb', xp: 190 },
        graphql: { name: 'GraphQL', level: 5, cost: 4, prerequisite: 'mongodb', xp: 280 },
      }
    },
    mobile: {
      name: 'Mobile Development',
      icon: Smartphone,
      color: 'cyan-400',
      skills: {
        reactnative: { name: 'React Native', level: 4, cost: 4, prerequisite: 'react', xp: 270 },
        flutter: { name: 'Flutter', level: 4, cost: 4, prerequisite: null, xp: 260 },
        ionic: { name: 'Ionic', level: 3, cost: 3, prerequisite: 'javascript', xp: 220 },
      }
    },
    ai: {
      name: 'AI & Machine Learning',
      icon: Brain,
      color: 'green-400',
      skills: {
        machinelearning: { name: 'Machine Learning', level: 5, cost: 5, prerequisite: 'python', xp: 350 },
        tensorflow: { name: 'TensorFlow', level: 6, cost: 6, prerequisite: 'machinelearning', xp: 400 },
        pytorch: { name: 'PyTorch', level: 6, cost: 6, prerequisite: 'machinelearning', xp: 400 },
        nlp: { name: 'NLP', level: 7, cost: 7, prerequisite: 'tensorflow', xp: 450 },
      }
    }
  };

  const canUnlock = (skillId, skill) => {
    if (unlockedSkills.has(skillId)) return false;
    if (skillPoints < skill.cost) return false;
    if (skill.prerequisite && !unlockedSkills.has(skill.prerequisite)) return false;
    return true;
  };

  const unlockSkill = (categoryId, skillId, skill) => {
    if (!canUnlock(skillId, skill)) return;
    
    setUnlockedSkills(prev => new Set([...prev, skillId]));
    setSkillPoints(prev => prev - skill.cost);
    sounds.playSuccess();
    onSkillUnlock && onSkillUnlock({ categoryId, skillId, skill });
  };

  const getSkillStatus = (skillId, skill) => {
    if (unlockedSkills.has(skillId)) return 'unlocked';
    if (canUnlock(skillId, skill)) return 'available';
    return 'locked';
  };

  const calculateTotalXP = () => {
    let total = 0;
    Object.values(skillCategories).forEach(category => {
      Object.entries(category.skills).forEach(([skillId, skill]) => {
        if (unlockedSkills.has(skillId)) {
          total += skill.xp;
        }
      });
    });
    return total;
  };

  return (
    <div className="w-full h-full bg-black/80 backdrop-blur-sm rounded-lg border border-cyber-blue/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 p-4 border-b border-cyber-blue/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-orbitron font-bold gradient-cyber-text">
              Skill Tree RPG
            </h2>
            <p className="text-cyber-blue text-sm font-mono">
              Level {playerLevel} Developer • {calculateTotalXP()} XP
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-400" size={20} />
              <span className="text-yellow-400 font-bold font-mono">{skillPoints} SP</span>
            </div>
            <p className="text-xs text-gray-400 font-mono">Skill Points</p>
          </div>
        </div>
      </div>

      {/* Skill Tree Grid */}
      <div className="p-6 h-96 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(skillCategories).map(([categoryId, category]) => (
            <motion.div
              key={categoryId}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Object.keys(skillCategories).indexOf(categoryId) * 0.1 }}
            >
              {/* Category Header */}
              <div className={`flex items-center gap-2 text-${category.color} mb-4`}>
                <category.icon size={20} />
                <h3 className="font-orbitron font-bold">{category.name}</h3>
              </div>

              {/* Skills in Category */}
              <div className="space-y-2">
                {Object.entries(category.skills).map(([skillId, skill]) => {
                  const status = getSkillStatus(skillId, skill);
                  
                  return (
                    <motion.div
                      key={skillId}
                      className={`relative p-3 rounded-lg border transition-all cursor-pointer ${
                        status === 'unlocked'
                          ? `bg-${category.color}/20 border-${category.color}/50`
                          : status === 'available'
                          ? `bg-gray-800/50 border-${category.color}/30 hover:border-${category.color}/50`
                          : 'bg-gray-900/50 border-gray-600/30'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        if (status === 'available') {
                          unlockSkill(categoryId, skillId, skill);
                        } else if (status === 'unlocked') {
                          setSelectedSkill({ categoryId, skillId, skill });
                        }
                        sounds.playClick();
                      }}
                      onMouseEnter={() => {
                        setHoveredSkill({ categoryId, skillId, skill });
                        sounds.playHover();
                      }}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      {/* Skill Icon */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {status === 'unlocked' ? (
                            <Star className={`text-${category.color}`} size={16} />
                          ) : status === 'available' ? (
                            <Zap className="text-yellow-400" size={16} />
                          ) : (
                            <Lock className="text-gray-500" size={16} />
                          )}
                          
                          <div>
                            <h4 className={`font-mono font-bold text-sm ${
                              status === 'unlocked' 
                                ? `text-${category.color}` 
                                : status === 'available'
                                ? 'text-white'
                                : 'text-gray-500'
                            }`}>
                              {skill.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-400">Lv.{skill.level}</span>
                              {status !== 'unlocked' && (
                                <span className="text-yellow-400">{skill.cost} SP</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* XP Badge */}
                        <div className={`text-xs px-2 py-1 rounded ${
                          status === 'unlocked'
                            ? `bg-${category.color}/30 text-${category.color}`
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {skill.xp} XP
                        </div>
                      </div>

                      {/* Prerequisite indicator */}
                      {skill.prerequisite && (
                        <div className="mt-1 text-xs text-gray-500">
                          Requires: {skillCategories[categoryId].skills[skill.prerequisite]?.name}
                        </div>
                      )}

                      {/* Unlock animation */}
                      {status === 'unlocked' && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className={`w-full h-full rounded-lg bg-gradient-to-r from-${category.color}/20 to-transparent`} />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              className="cyber-card p-6 max-w-md w-full m-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Star className="text-cyber-blue" size={24} />
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-white">
                    {selectedSkill.skill.name}
                  </h3>
                  <p className="text-cyber-blue text-sm">
                    Level {selectedSkill.skill.level} • {selectedSkill.skill.xp} XP
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-cyber-purple font-bold mb-2">Skill Mastery</h4>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-2 rounded-full"
                      style={{ width: `${(selectedSkill.skill.level / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-cyber-pink font-bold mb-2">Description</h4>
                  <p className="text-gray-300 text-sm">
                    Mastered {selectedSkill.skill.name} technology with {selectedSkill.skill.level} years of experience.
                    Contributed to multiple projects and gained {selectedSkill.skill.xp} experience points.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSkill(null)}
                  className="w-full py-2 bg-cyber-blue/20 border border-cyber-blue/30 rounded text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            className="absolute bottom-4 left-4 cyber-card p-3 max-w-xs z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <h4 className="font-bold text-white text-sm">{hoveredSkill.skill.name}</h4>
            <p className="text-xs text-gray-300">
              Level {hoveredSkill.skill.level} • {hoveredSkill.skill.xp} XP
            </p>
            {hoveredSkill.skill.prerequisite && (
              <p className="text-xs text-gray-500 mt-1">
                Requires: {skillCategories[hoveredSkill.categoryId].skills[hoveredSkill.skill.prerequisite]?.name}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillTreeRPG;
