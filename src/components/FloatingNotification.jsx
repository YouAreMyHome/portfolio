import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

const FloatingNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification after 5 seconds
    const timer = setTimeout(() => {
      const hasSeenNotification = localStorage.getItem('utilityPanelNotification');
      if (!hasSeenNotification) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('utilityPanelNotification', 'seen');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-4 max-w-sm z-50"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="cyber-card border-cyber-blue/50 bg-black/90 backdrop-blur-sm p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyber-blue/20 rounded-lg">
                <Zap size={16} className="text-cyber-blue" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-orbitron font-bold text-cyber-blue text-sm mb-1">
                  🛠️ Quick Tools Available!
                </h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Discover hidden utilities: URL Shortener, Cat Jump Game, and more in the bottom-right corner!
                </p>
              </div>
              
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            
            {/* Animated arrow pointing to utility panel */}
            <motion.div
              className="absolute -right-2 top-1/2 transform -translate-y-1/2"
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="w-0 h-0 border-l-8 border-l-cyber-blue/50 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNotification;
