import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, BarChart3, Trophy, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import JsRunnerGame from '../components/JsRunnerGame';
// Optimized game removed; use original JsRunnerGame component only
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const JsRunnerGamePage = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  const [gameVersion, setGameVersion] = useState('original'); // 'original' or 'optimized'
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-dark via-purple-900/20 to-cyber-dark"></div>
      <div className="fixed inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 pt-8">
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 text-cyber-blue hover:text-cyber-purple transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-mono">{t('nav.back') || 'Back'}</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                🐱 Cat Runner
              </h1>
              <p className="text-gray-400 mt-2 font-mono">
                {gameVersion === 'optimized' ? 'Optimized Cyberpunk Runner' : 'Classic Endless Runner'}
              </p>
            </div>
            
            {/* Version Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                title="Game Info"
              >
                <Info size={16} />
              </button>
              <select
                value={gameVersion}
                onChange={(e) => setGameVersion(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white font-mono"
              >
                <option value="original">Original Version</option>
              </select>
            </div>
          </motion.div>
        </div>

        {/* Game Container */}
        <div className="container mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="cyber-card p-8 bg-black/40 border border-cyber-blue/30"
          >
            <JsRunnerGame />
          </motion.div>

          {/* Optimization Info */}
          {gameVersion === 'optimized' && (
            <motion.div
              className="mt-6 cyber-card p-4 bg-green-900/20 border border-green-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Settings size={16} className="text-green-400" />
                <span className="text-green-400 font-bold font-mono text-sm">Optimized Version Features</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-xs font-mono text-gray-300">
                <div>• Canvas-based rendering</div>
                <div>• Object pooling system</div>
                <div>• Performance monitoring</div>
                <div>• Memory optimization</div>
                <div>• Particle effects</div>
                <div>• Enhanced power-ups</div>
                <div>• Better collision detection</div>
                <div>• State management</div>
                <div>• Achievement system</div>
              </div>
            </motion.div>
          )}

          {/* Game Info */}
          {showInfo && (
            <motion.div
              className="mt-8 grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="cyber-card p-6 bg-black/20 border border-cyber-purple/30">
                <h3 className="text-xl font-orbitron font-bold text-cyber-purple mb-4">
                  🎮 {t('game.howToPlay') || 'How to Play'}
                </h3>
                <ul className="space-y-2 text-gray-300 font-mono text-sm">
                  <li>• Press <kbd className="px-2 py-1 bg-gray-800 rounded text-cyber-blue">SPACE</kbd> or <kbd className="px-2 py-1 bg-gray-800 rounded text-cyber-blue">↑</kbd> to jump</li>
                  <li>• Avoid purple obstacles</li>
                  <li>• Collect power-ups for special abilities</li>
                  <li>• Survive as long as possible!</li>
                  <li>• Speed increases over time</li>
                  {gameVersion === 'optimized' && (
                    <>
                      <li>• Press <kbd className="px-2 py-1 bg-gray-800 rounded text-cyber-blue">ESC</kbd> to pause</li>
                      <li>• Use double jump when available</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="cyber-card p-6 bg-black/20 border border-cyber-pink/30">
                <h3 className="text-xl font-orbitron font-bold text-cyber-pink mb-4">
                  ⚡ Power-ups
                </h3>
                <div className="space-y-2 text-gray-300 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                    <span>Shield - Temporary invincibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span>Speed Boost - Enhanced movement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span>Double Jump - Air jump ability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-400 rounded"></div>
                    <span>Score Multiplier - Double points</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Performance Comparison */}
          {gameVersion === 'optimized' && showInfo && (
            <motion.div
              className="mt-6 cyber-card p-6 bg-black/20 border border-yellow-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-xl font-orbitron font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Performance Improvements
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-300 mb-2">Original Version</h4>
                  <ul className="space-y-1 text-sm text-gray-400 font-mono">
                    <li>• DOM-based rendering</li>
                    <li>• Memory leaks possible</li>
                    <li>• Limited visual effects</li>
                    <li>• Basic collision detection</li>
                    <li>• No performance monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-green-400 mb-2">Optimized Version</h4>
                  <ul className="space-y-1 text-sm text-green-300 font-mono">
                    <li>✓ Canvas-based rendering (60+ FPS)</li>
                    <li>✓ Object pooling (reduced GC)</li>
                    <li>✓ Particle effects system</li>
                    <li>✓ Precise collision detection</li>
                    <li>✓ Real-time performance metrics</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsRunnerGamePage;