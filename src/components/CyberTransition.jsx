import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CyberTransition = ({ isActive, onComplete, children, type = 'glitch' }) => {
  const [transitionStage, setTransitionStage] = useState('idle');

  useEffect(() => {
    if (isActive) {
      setTransitionStage('entering');
      const timer = setTimeout(() => {
        setTransitionStage('exiting');
        setTimeout(() => {
          setTransitionStage('idle');
          onComplete && onComplete();
        }, 800);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  const glitchTransition = {
    entering: {
      initial: { x: 0, opacity: 1 },
      animate: {
        x: [0, -5, 5, -2, 2, 0],
        opacity: [1, 0.8, 0.2, 0.9, 0.1, 0],
        scale: [1, 1.02, 0.98, 1.01, 0.99, 1],
        filter: [
          'hue-rotate(0deg) saturate(1)',
          'hue-rotate(90deg) saturate(1.5)',
          'hue-rotate(180deg) saturate(2)',
          'hue-rotate(270deg) saturate(1.5)',
          'hue-rotate(360deg) saturate(1)',
        ],
      },
      transition: { duration: 1, ease: 'easeInOut' }
    },
    exiting: {
      initial: { x: 0, opacity: 0 },
      animate: {
        x: [0, 2, -2, 5, -5, 0],
        opacity: [0, 0.1, 0.9, 0.2, 0.8, 1],
        scale: [1, 0.99, 1.01, 0.98, 1.02, 1],
        filter: [
          'hue-rotate(360deg) saturate(1)',
          'hue-rotate(270deg) saturate(1.5)',
          'hue-rotate(180deg) saturate(2)',
          'hue-rotate(90deg) saturate(1.5)',
          'hue-rotate(0deg) saturate(1)',
        ],
      },
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  };

  const matrixTransition = {
    entering: {
      initial: { y: 0, opacity: 1 },
      animate: {
        y: [0, -20, 20, -10, 10, 0],
        opacity: [1, 0.7, 0.3, 0.8, 0.1, 0],
        rotateX: [0, 5, -5, 3, -3, 0],
      },
      transition: { duration: 1, ease: 'easeInOut' }
    },
    exiting: {
      initial: { y: 0, opacity: 0 },
      animate: {
        y: [0, 10, -10, 20, -20, 0],
        opacity: [0, 0.1, 0.8, 0.3, 0.7, 1],
        rotateX: [0, -3, 3, -5, 5, 0],
      },
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  };

  const hologramTransition = {
    entering: {
      initial: { opacity: 1, scale: 1 },
      animate: {
        opacity: [1, 0.8, 0.2, 0.9, 0.1, 0],
        scale: [1, 1.05, 0.95, 1.02, 0.98, 1],
        filter: [
          'brightness(1) contrast(1)',
          'brightness(1.2) contrast(1.5)',
          'brightness(0.8) contrast(2)',
          'brightness(1.1) contrast(1.3)',
          'brightness(0.5) contrast(1)',
        ],
      },
      transition: { duration: 1, ease: 'easeInOut' }
    },
    exiting: {
      initial: { opacity: 0, scale: 1 },
      animate: {
        opacity: [0, 0.1, 0.9, 0.2, 0.8, 1],
        scale: [1, 0.98, 1.02, 0.95, 1.05, 1],
        filter: [
          'brightness(0.5) contrast(1)',
          'brightness(1.1) contrast(1.3)',
          'brightness(0.8) contrast(2)',
          'brightness(1.2) contrast(1.5)',
          'brightness(1) contrast(1)',
        ],
      },
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  };

  const getTransitionConfig = () => {
    switch (type) {
      case 'matrix':
        return matrixTransition;
      case 'hologram':
        return hologramTransition;
      default:
        return glitchTransition;
    }
  };

  const transitionConfig = getTransitionConfig();

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {transitionStage === 'entering' && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            {...transitionConfig.entering}
          >
            {children}
          </motion.div>
        )}
        
        {transitionStage === 'exiting' && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            {...transitionConfig.exiting}
          >
            {children}
          </motion.div>
        )}
        
        {transitionStage === 'idle' && !isActive && (
          <div className="w-full h-full">
            {children}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children, pageKey }) => {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

// Cyber loading transition
export const CyberLoader = ({ isLoading, text = 'Loading...' }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            {/* Animated logo/spinner */}
            <motion.div
              className="w-20 h-20 border-4 border-cyber-blue/30 border-t-cyber-blue rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Loading text */}
            <motion.h2
              className="text-2xl font-orbitron font-bold gradient-cyber-text mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {text}{dots}
            </motion.h2>
            
            {/* Progress bar */}
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            
            {/* Matrix effect */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-cyber-blue/20 font-mono text-sm"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, -50, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Section transition
export const SectionTransition = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger animation for lists
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Glitch text effect
export const GlitchText = ({ children, className = '' }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{
        textShadow: [
          '0 0 0 transparent',
          '2px 0 0 #ff0000, -2px 0 0 #00ffff',
          '0 0 0 transparent',
          '1px 0 0 #ff0000, -1px 0 0 #00ffff',
          '0 0 0 transparent',
        ],
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    >
      {children}
    </motion.span>
  );
};

export default CyberTransition;
