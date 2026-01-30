import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KonamiCode = ({ onActivate }) => {
  const [sequence, setSequence] = useState([]);
  const [isActivated, setIsActivated] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      const newSequence = [...sequence, event.code].slice(-konamiCode.length);
      setSequence(newSequence);

      // Check if the sequence matches Konami code
      if (newSequence.length === konamiCode.length) {
        const isMatch = newSequence.every((key, index) => key === konamiCode[index]);
        if (isMatch && !isActivated) {
          setIsActivated(true);
          onActivate();
          
          // Show celebration effect
          setTimeout(() => {
            setIsActivated(false);
            setSequence([]);
          }, 3000);
        }
      }
    };

    // Show hint after 30 seconds
    const hintTimer = setTimeout(() => {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 5000);
    }, 30000);

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(hintTimer);
    };
  }, [sequence, isActivated, onActivate]);

  return (
    <>
      {/* Activation Effect */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Glitch overlay */}
            <motion.div
              className="absolute inset-0 bg-cyber-blue/20"
              animate={{
                opacity: [0, 1, 0, 1, 0],
                scale: [1, 1.02, 1, 1.01, 1],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            />
            
            {/* Success message */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="cyber-card p-8 text-center border-cyber-blue/50"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <motion.h2
                  className="text-4xl font-orbitron font-bold gradient-cyber-text mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🎮 EASTER EGG ACTIVATED! 🎮
                </motion.h2>
                <p className="text-cyber-blue font-mono">
                  Welcome to the secret zone, hacker! 🚀
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  Game mode unlocked. Enjoy the cat jumping game!
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="fixed bottom-4 right-4 z-40"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="cyber-card p-4 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-cyber-blue">🕹️</span>
                <span className="text-sm font-orbitron font-bold text-cyber-blue">Secret Hint</span>
              </div>
              <p className="text-xs text-gray-300 font-mono">
                Try the classic: ↑↑↓↓←→←→BA
              </p>
              <div className="flex gap-1 mt-2">
                {konamiCode.map((key, index) => (
                  <span
                    key={index}
                    className={`w-6 h-6 text-xs bg-cyber-blue/20 border border-cyber-blue/30 rounded flex items-center justify-center ${
                      sequence[index] === key ? 'bg-cyber-blue/50 text-white' : 'text-cyber-blue'
                    }`}
                  >
                    {key.includes('Arrow') 
                      ? key.replace('Arrow', '').charAt(0) 
                      : key.replace('Key', '')
                    }
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KonamiCode;
