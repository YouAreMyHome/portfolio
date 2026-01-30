import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import InteractiveCVExperience from '../components/InteractiveCVExperience';
import { CyberLoader } from '../components/CyberTransition';

const InteractiveCVPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark text-white overflow-hidden">
      {/* Loading Screen */}
      <CyberLoader 
        isLoading={isLoading} 
        text="Initializing Interactive CV Experience" 
      />

      {!isLoading && (
        <>
          {/* Header Controls */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-cyber-blue/20"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-cyber-blue hover:text-white transition-colors group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="font-orbitron font-bold">Exit Experience</span>
                </Link>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="flex items-center gap-2 px-4 py-2 cyber-card text-cyber-purple hover:bg-cyber-purple/20 transition-colors"
                  >
                    <Info size={16} />
                    <span className="font-mono text-sm">Guide</span>
                  </button>
                  
                  <div className="text-right">
                    <h1 className="text-xl font-orbitron font-bold gradient-cyber-text">
                      Interactive CV Experience
                    </h1>
                    <p className="text-xs text-gray-400 font-mono">
                      Tech Universe • RPG Skills • Terminal Interface
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Panel */}
          {showInfo && (
            <motion.div
              className="fixed top-20 right-4 z-40 w-80 cyber-card p-6"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <h3 className="font-orbitron font-bold text-cyber-blue mb-4">
                How to Navigate
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-cyber-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyber-blue text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Explore Skill Tree</h4>
                    <p className="text-gray-400">Unlock skills using skill points to gain XP and level up</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-cyber-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyber-purple text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Use Terminal</h4>
                    <p className="text-gray-400">Execute commands to navigate and discover information</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-cyber-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-cyber-pink text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Complete Quests</h4>
                    <p className="text-gray-400">Finish tasks to earn achievements and unlock content</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-600">
                  <h4 className="text-cyber-blue font-bold mb-2">Available Commands:</h4>
                  <div className="space-y-1 font-mono text-xs">
                    <div><span className="text-green-400">help</span> - Show all commands</div>
                    <div><span className="text-green-400">about</span> - About information</div>
                    <div><span className="text-green-400">skills</span> - List skills</div>
                    <div><span className="text-green-400">projects</span> - Show projects</div>
                    <div><span className="text-green-400">contact</span> - Contact info</div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowInfo(false)}
                className="w-full mt-4 py-2 bg-cyber-blue/20 border border-cyber-blue/30 rounded text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
              >
                Got it!
              </button>
            </motion.div>
          )}

          {/* Main Experience */}
          <div className="pt-20">
            <InteractiveCVExperience 
              onSectionChange={(section) => {
                console.log('Section changed to:', section);
                // Handle section changes, analytics, etc.
              }}
            />
          </div>

          {/* Footer Info */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-30 glassmorphism border-t border-cyber-blue/20"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-mono">System Online</span>
                  </div>
                  <div className="text-gray-400 font-mono">
                    FPS: 60 | Latency: 12ms
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-gray-400 font-mono">
                    Interactive CV v2.0.1
                  </div>
                  <div className="text-cyber-blue font-mono">
                    Powered by React + Framer Motion
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default InteractiveCVPage;
