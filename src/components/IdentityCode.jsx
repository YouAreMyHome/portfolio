import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const IdentityCode = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  
  const codeLines = [
    'const Nghia = "Fullstack Developer 🚀";',
    'let skills = ["React", "Node.js", "Python", "MongoDB"];',
    'if (coding) { passion = true; }',
    'while (learning) { keepGrowing(); }',
    'function createAmazingThings() { return innovation; }'
  ];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (charIndex < codeLines[currentLineIndex].length) {
        setCurrentCode(codeLines[currentLineIndex].slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else {
        // Pause and then move to next line
        setTimeout(() => {
          setCurrentLineIndex((prev) => (prev + 1) % codeLines.length);
          setCharIndex(0);
          setCurrentCode('');
        }, 2000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [charIndex, currentLineIndex, codeLines]);

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
  };

  return (
    <motion.div 
      className="relative font-mono text-sm sm:text-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      {/* Terminal window frame */}
      <div className="cyber-card rounded-lg p-4 mb-4 border border-cyber-blue/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-cyber-blue text-xs ml-2">identity.js</span>
        </div>
        
        <div className="text-cyber-blue">
          <span className="text-gray-400">1 </span>
          <motion.span
            className={`${isGlitching ? 'animate-pulse text-cyber-pink' : ''}`}
            onClick={triggerGlitch}
            style={{ cursor: 'pointer' }}
          >
            {currentCode}
            <motion.span
              className="inline-block w-2 h-5 bg-cyber-blue ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.span>
        </div>
      </div>

      {/* QR Code */}
      <motion.div
        className="flex justify-center"
        whileHover={{ scale: 1.05 }}
        onClick={() => window.open('https://github.com/YouAreMyHome', '_blank')}
        style={{ cursor: 'pointer' }}
      >
        <div className="relative p-4 cyber-card rounded-lg border border-cyber-purple/30 group">
          <div className="w-24 h-24 bg-cyber-purple/20 rounded border-2 border-cyber-purple/50 flex items-center justify-center">
            <div className="grid grid-cols-8 gap-0.5">
              {Array.from({ length: 64 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-cyber-purple' : 'bg-transparent'}`}
                  animate={{
                    backgroundColor: [
                      Math.random() > 0.5 ? '#a855f7' : 'transparent',
                      Math.random() > 0.5 ? '#00f7ff' : 'transparent',
                      Math.random() > 0.5 ? '#a855f7' : 'transparent'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.02
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-cyber-purple mt-2 text-center group-hover:text-cyber-blue transition-colors">
            Scan for GitHub
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IdentityCode;
