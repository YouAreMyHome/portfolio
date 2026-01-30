import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Star, Map, User, Award, Briefcase, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import TechUniverse from './TechUniverse';
import SkillTreeRPG from './SkillTreeRPG';
import CyberTerminal from './CyberTerminal';
import IdentityCode from './IdentityCode';
import { useCyberSounds } from './SoundSystem';

const InteractiveCVExperience = ({ onSectionChange }) => {
  const [activeMode, setActiveMode] = useState('overview');
  const [playerData, setPlayerData] = useState({
    level: 5,
    xp: 2250,
    achievements: [],
    unlockedSections: ['about', 'skills', 'experience']
  });
  const [showTerminal, setShowTerminal] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isModesCollapsed, setIsModesCollapsed] = useState(() => {
    return localStorage.getItem('cv-modes-collapsed') === 'true';
  });
  const [isQuestsCollapsed, setIsQuestsCollapsed] = useState(() => {
    return localStorage.getItem('cv-quests-collapsed') === 'true';
  });
  
  const sounds = useCyberSounds();

  // Game modes/sections
  const experienceModes = {
    overview: {
      name: 'System Overview',
      icon: User,
      color: 'cyber-blue',
      description: 'Main character profile and navigation hub'
    },
    skills: {
      name: 'Skill Tree',
      icon: Star,
      color: 'cyber-purple',
      description: 'RPG-style skill progression system'
    },
    experience: {
      name: 'Quest Log',
      icon: Map,
      color: 'cyber-pink',
      description: 'Professional experience as completed quests'
    },
    projects: {
      name: 'Achievement Gallery',
      icon: Award,
      color: 'cyan-400',
      description: 'Showcase of completed projects and achievements'
    },
    terminal: {
      name: 'Command Interface',
      icon: Terminal,
      color: 'green-400',
      description: 'Interactive command-line portfolio navigation'
    },
    contact: {
      name: 'Communication Portal',
      icon: MessageSquare,
      color: 'yellow-400',
      description: 'Direct communication and networking hub'
    }
  };

  // Quests/Tasks system
  const availableQuests = [
    {
      id: 'explore_skills',
      title: 'Skill Explorer',
      description: 'Unlock 5 skills in the skill tree',
      type: 'skills',
      target: 5,
      reward: { xp: 100, achievement: 'Skill Seeker' },
      completed: false
    },
    {
      id: 'terminal_master',
      title: 'Terminal Master',
      description: 'Execute 10 commands in the terminal',
      type: 'terminal',
      target: 10,
      reward: { xp: 150, achievement: 'Command Line Hero' },
      completed: false
    },
    {
      id: 'code_reader',
      title: 'Code Reader',
      description: 'View identity code for 30 seconds',
      type: 'code',
      target: 30,
      reward: { xp: 50, achievement: 'Code Whisperer' },
      completed: false
    },
    {
      id: 'section_explorer',
      title: 'Portfolio Explorer',
      description: 'Visit all portfolio sections',
      type: 'navigation',
      target: 6,
      reward: { xp: 200, achievement: 'Explorer' },
      completed: false
    }
  ];

  const [quests, setQuests] = useState(availableQuests);

  // Handle quest completion
  const completeQuest = (questId) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true }
        : quest
    ));
    
    const quest = quests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      setPlayerData(prev => ({
        ...prev,
        xp: prev.xp + quest.reward.xp,
        achievements: [...prev.achievements, quest.reward.achievement]
      }));
      sounds.playSuccess();
    }
  };

  // Handle skill unlock from RPG
  const handleSkillUnlock = (skillData) => {
    const skillQuest = quests.find(q => q.id === 'explore_skills');
    if (skillQuest && !skillQuest.completed) {
      // Check if we've unlocked enough skills
      // This would need to be connected to the actual skill tree state
      sounds.playNotification();
    }
  };

  // Experience level calculation
  const calculateLevel = (xp) => {
    return Math.floor(xp / 500) + 1;
  };

  useEffect(() => {
    setPlayerData(prev => ({
      ...prev,
      level: calculateLevel(prev.xp)
    }));
  }, [playerData.xp]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Tech Universe Background */}
      <TechUniverse />
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Player Stats HUD */}
        <motion.div
          className="absolute top-4 left-4 cyber-card p-4 pointer-events-auto"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-white">
                Le Trong Nghia
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-cyber-blue">Lv.{playerData.level}</span>
                <span className="text-gray-400">•</span>
                <span className="text-cyber-purple">{playerData.xp} XP</span>
              </div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((playerData.xp % 500) / 500) * 100}%` 
                }}
                transition={{ duration: 1, delay: 1 }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {playerData.xp % 500}/500 to next level
            </p>
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <motion.div
          className={`absolute top-4 right-4 cyber-card p-4 pointer-events-auto transition-all duration-300 ${
            isModesCollapsed ? 'bg-cyber-blue/5' : ''
          }`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-orbitron font-bold text-cyber-blue">
                Experience Modes
              </h4>
              {isModesCollapsed && (
                <motion.div
                  className="px-2 py-1 bg-cyber-blue/20 border border-cyber-blue/30 rounded text-xs font-mono text-cyber-blue"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {experienceModes[activeMode]?.name}
                </motion.div>
              )}
            </div>
            <motion.button
              onClick={() => {
                const newState = !isModesCollapsed;
                setIsModesCollapsed(newState);
                localStorage.setItem('cv-modes-collapsed', newState.toString());
                sounds.playClick();
              }}
              className="p-1 hover:bg-cyber-blue/20 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={sounds.playHover}
              title={isModesCollapsed ? "Expand modes" : "Collapse modes"}
            >
              {isModesCollapsed ? (
                <ChevronDown size={16} className="text-cyber-blue" />
              ) : (
                <ChevronUp size={16} className="text-cyber-blue" />
              )}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {!isModesCollapsed && (
              <motion.div
                className="grid grid-cols-2 gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {Object.entries(experienceModes).map(([modeId, mode]) => (
                  <motion.button
                    key={modeId}
                    onClick={() => {
                      setActiveMode(modeId);
                      sounds.playClick();
                      onSectionChange && onSectionChange(modeId);
                    }}
                    className={`p-3 rounded-lg transition-all text-left ${
                      activeMode === modeId
                        ? `bg-${mode.color}/20 border border-${mode.color}/50 text-${mode.color}`
                        : 'bg-gray-800/50 border border-gray-600/30 text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={sounds.playHover}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <mode.icon size={16} />
                      <span className="font-mono text-xs font-bold">
                        {mode.name}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 leading-tight">
                      {mode.description}
                    </p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Active Quests */}
        <motion.div
          className={`absolute bottom-4 left-4 cyber-card p-4 max-w-sm pointer-events-auto transition-all duration-300 ${
            isQuestsCollapsed ? 'bg-cyber-pink/5' : ''
          }`}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-orbitron font-bold text-cyber-pink flex items-center gap-2">
              <Map size={16} />
              Active Quests
            </h4>
            <motion.button
              onClick={() => {
                const newState = !isQuestsCollapsed;
                setIsQuestsCollapsed(newState);
                localStorage.setItem('cv-quests-collapsed', newState.toString());
                sounds.playClick();
              }}
              className="p-1 hover:bg-cyber-pink/20 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={sounds.playHover}
              title={isQuestsCollapsed ? "Expand quests" : "Collapse quests"}
            >
              {isQuestsCollapsed ? (
                <ChevronDown size={16} className="text-cyber-pink" />
              ) : (
                <ChevronUp size={16} className="text-cyber-pink" />
              )}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {!isQuestsCollapsed && (
              <motion.div
                className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {quests.filter(quest => !quest.completed).slice(0, 3).map(quest => (
                  <div key={quest.id} className="p-2 bg-gray-800/50 rounded border border-gray-600/30">
                    <h5 className="text-white text-sm font-bold">{quest.title}</h5>
                    <p className="text-gray-400 text-xs">{quest.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-cyan-400">+{quest.reward.xp} XP</span>
                      <span className="text-xs text-yellow-400">{quest.reward.achievement}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Achievements Panel */}
        {playerData.achievements.length > 0 && (
          <motion.div
            className="absolute bottom-4 right-4 cyber-card p-4 max-w-xs pointer-events-auto"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h4 className="font-orbitron font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <Award size={16} />
              Achievements
            </h4>
            <div className="space-y-1">
              {playerData.achievements.slice(-3).map((achievement, index) => (
                <motion.div
                  key={achievement}
                  className="flex items-center gap-2 p-2 bg-yellow-400/10 rounded border border-yellow-400/30"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Star size={14} className="text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-mono">
                    {achievement}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 z-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeMode === 'skills' && (
            <motion.div
              key="skills"
              className="w-full max-w-6xl h-full max-h-[80vh] m-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <SkillTreeRPG 
                onSkillUnlock={handleSkillUnlock}
                playerLevel={playerData.level}
              />
            </motion.div>
          )}

          {activeMode === 'terminal' && (
            <motion.div
              key="terminal"
              className="w-full max-w-4xl max-h-[80vh] m-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <CyberTerminal 
                fullscreen={true}
                onCommandExecute={() => {
                  // Track terminal usage for quest
                }}
              />
            </motion.div>
          )}

          {activeMode === 'overview' && (
            <motion.div
              key="overview"
              className="w-full max-w-4xl m-4 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="cyber-card p-8">
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-5xl font-orbitron font-bold gradient-cyber-text mb-4">
                    Interactive CV Experience
                  </h1>
                  <p className="text-xl text-gray-300 mb-6">
                    Welcome to the cyberpunk portfolio adventure
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyber-blue rounded-full"></div>
                      <span>Tech Universe Background</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyber-purple rounded-full"></div>
                      <span>RPG Skill System</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyber-pink rounded-full"></div>
                      <span>Terminal Interface</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {Object.entries(experienceModes).slice(1).map(([modeId, mode]) => (
                    <motion.button
                      key={modeId}
                      onClick={() => {
                        setActiveMode(modeId);
                        sounds.playClick();
                      }}
                      className={`p-6 cyber-card hover:border-${mode.color}/50 transition-all group`}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={sounds.playHover}
                    >
                      <mode.icon 
                        size={32} 
                        className={`text-${mode.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} 
                      />
                      <h3 className="font-orbitron font-bold text-white mb-2">
                        {mode.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {mode.description}
                      </p>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 space-y-3">
        <motion.button
          onClick={() => {
            setShowTerminal(!showTerminal);
            sounds.playClick();
          }}
          className="p-3 cyber-card rounded-full text-green-400 hover:bg-green-400/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={sounds.playHover}
        >
          <Terminal size={20} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setActiveMode('skills');
            sounds.playClick();
          }}
          className="p-3 cyber-card rounded-full text-cyber-purple hover:bg-cyber-purple/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={sounds.playHover}
        >
          <Star size={20} />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setActiveMode('overview');
            sounds.playClick();
          }}
          className="p-3 cyber-card rounded-full text-cyber-blue hover:bg-cyber-blue/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={sounds.playHover}
        >
          <User size={20} />
        </motion.button>
      </div>

      {/* Floating Terminal */}
      <AnimatePresence>
        {showTerminal && activeMode !== 'terminal' && (
          <motion.div
            className="absolute bottom-20 right-8 w-96 h-64 z-30"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
          >
            <CyberTerminal 
              onClose={() => setShowTerminal(false)}
              compact={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveCVExperience;
