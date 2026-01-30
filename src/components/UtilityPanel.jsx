import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Gamepad2, Settings, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCyberSounds } from './SoundSystem';

const UtilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const sounds = useCyberSounds();

  const utilities = [
    {
      id: 'url-shortener',
      icon: Link,
      label: 'URL Shortener',
      description: 'Rút gọn liên kết',
      path: '/url-shortener',
      color: 'cyber-blue'
    },
    {
      id: 'fun-game',
      icon: Gamepad2,
      label: 'Cat Jump Game',
      description: 'Game giải trí',
      path: '/fun-game',
      color: 'cyber-pink'
    },
    {
      id: 'interactive-cv',
      icon: Settings,
      label: 'Interactive CV',
      description: 'Trải nghiệm CV tương tác',
      path: '/interactive-cv',
      color: 'cyber-purple'
    },
    {
      id: 'showcase',
      icon: ExternalLink,
      label: '3D Showcase',
      description: 'Showcase dự án 3D',
      path: '/showcase',
      color: 'cyan-400'
    }
  ];

  const handleUtilityClick = (path) => {
    navigate(path);
    setIsOpen(false);
    sounds.playClick();
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Main toggle button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className={`w-14 h-14 rounded-full cyber-card border-2 transition-all duration-300 ${
          isOpen 
            ? 'border-cyber-blue/50 bg-cyber-blue/20 text-cyber-blue' 
            : 'border-gray-600/50 bg-black/50 text-gray-400 hover:border-cyber-blue/30 hover:text-cyber-blue'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={sounds.playHover}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full flex items-center justify-center"
        >
          {isOpen ? <X size={20} /> : <Settings size={20} />}
        </motion.div>
      </motion.button>

      {/* Utility items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-2"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, staggerChildren: 0.05 }}
          >
            {utilities.map((utility, index) => (
              <motion.div
                key={utility.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => handleUtilityClick(utility.path)}
                  className={`flex items-center gap-3 p-3 cyber-card border border-${utility.color}/30 hover:border-${utility.color}/50 bg-black/80 backdrop-blur-sm rounded-lg min-w-[200px] group transition-all duration-200`}
                  whileHover={{ scale: 1.02, x: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={sounds.playHover}
                >
                  <div className={`p-2 rounded-lg bg-${utility.color}/20 border border-${utility.color}/30 group-hover:bg-${utility.color}/30 transition-colors`}>
                    <utility.icon size={16} className={`text-${utility.color}`} />
                  </div>
                  
                  <div className="text-left flex-1">
                    <div className={`font-orbitron font-bold text-sm text-${utility.color} group-hover:text-white transition-colors`}>
                      {utility.label}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {utility.description}
                    </div>
                  </div>

                  <ExternalLink size={12} className="text-gray-500 group-hover:text-cyber-blue transition-colors" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick access tooltip */}
      {!isOpen && (
        <motion.div
          className="absolute bottom-16 right-0 cyber-card p-2 text-xs font-mono text-gray-400 whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          🛠️ Quick Tools
        </motion.div>
      )}
    </div>
  );
};

export default UtilityPanel;
