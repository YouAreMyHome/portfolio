import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github as GitHub, Linkedin, Facebook, ArrowRight, Download, Terminal, Code, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';
import CyberBackground from './CyberBackground';
import IdentityCode from './IdentityCode';
import CyberTerminal from './CyberTerminal';
import { useCyberSounds } from './SoundSystem';

const Hero = ({ scrollToContact }) => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  const [typingText, setTypingText] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [showIdentityCode, setShowIdentityCode] = useState(false);
  const jobTitle = t('hero.title');
  const sounds = useCyberSounds();

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < jobTitle.length) {
        setTypingText(jobTitle.slice(0, index + 1));
        sounds.playTyping();
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [jobTitle]);

  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-cyber-dark">
      {/* Cyber Background */}
      <CyberBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          
          {/* Left Content */}
          <motion.div 
            className="lg:w-1/2 mb-8 lg:mb-0"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Glitch effect background */}
              <motion.div
                className="absolute -top-4 -left-4 w-full h-full bg-cyber-blue/10 rounded-lg blur-sm"
                animate={{
                  x: [0, 2, -2, 0],
                  y: [0, -1, 1, 0],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              
              <div className="relative z-10">
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-7xl font-orbitron font-bold mb-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="text-white">
                    {t('hero.greeting')}
                  </span>
                  <br />
                  <span className="gradient-cyber-text neon-text animate-pulse-glow">
                    NGHIA
                  </span>
                </motion.h1>
                
                <div className="h-16 mb-8">
                  <motion.h2 
                    className="text-xl sm:text-2xl lg:text-3xl font-mono text-cyber-blue font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <span className="text-white">{'> '}</span>
                    <span className="border-r-2 border-cyber-blue animate-pulse">
                      {typingText}
                    </span>
                  </motion.h2>
                </div>
                
                <motion.p 
                  className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  {t('hero.description')}
                </motion.p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.button
                onClick={() => {
                  scrollToContact();
                  sounds.playClick();
                }}
                className="cyber-card px-8 py-4 rounded-lg text-cyber-blue font-semibold flex items-center gap-2 group overflow-hidden relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={sounds.playHover}
              >
                <span className="relative z-10">Contact Me</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-cyber-gradient opacity-0 group-hover:opacity-20 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.button>
              
              <motion.a
                href="/assets/pdf/CV.pdf"
                download
                className="cyber-card px-8 py-4 rounded-lg text-cyber-purple font-semibold flex items-center gap-2 group border-cyber-purple/30 hover:border-cyber-purple/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sounds.playClick}
                onMouseEnter={sounds.playHover}
              >
                <span>Download CV</span>
                <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </motion.a>

              {/* Interactive CV Experience */}
              <Link to="/interactive-cv">
                <motion.button
                  className="cyber-card px-8 py-4 rounded-lg text-cyan-400 font-semibold flex items-center gap-2 group border-cyan-400/30 hover:border-cyan-400/50 bg-gradient-to-r from-cyan-400/10 to-blue-500/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sounds.playClick}
                  onMouseEnter={sounds.playHover}
                >
                  <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Interactive CV Experience</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              {/* Identity Code Toggle */}
              <motion.button
                onClick={() => {
                  setShowIdentityCode(!showIdentityCode);
                  sounds.playClick();
                }}
                className="cyber-card px-6 py-4 rounded-lg text-cyber-pink font-semibold flex items-center gap-2 group border-cyber-pink/30 hover:border-cyber-pink/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={sounds.playHover}
              >
                <Code className="w-5 h-5" />
                <span>{showIdentityCode ? 'Hide' : 'Show'} Code</span>
              </motion.button>

              {/* Terminal Toggle */}
              <motion.button
                onClick={() => {
                  setShowTerminal(!showTerminal);
                  sounds.playClick();
                }}
                className="cyber-card px-6 py-4 rounded-lg text-cyan-400 font-semibold flex items-center gap-2 group border-cyan-400/30 hover:border-cyan-400/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={sounds.playHover}
              >
                <Terminal className="w-5 h-5" />
                <span>{showTerminal ? 'Close' : 'Open'} Terminal</span>
              </motion.button>
            </motion.div>
            
            {/* Social Links */}
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { icon: GitHub, href: "https://github.com/YouAreMyHome", color: "cyber-blue" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/youaremyhome", color: "cyber-purple" },
                { icon: Facebook, href: "https://facebook.com/youaremyhome", color: "cyber-pink" }
              ].map(({ icon: Icon, href, color }, index) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 cyber-card rounded-full text-${color} hover:shadow-cyber transition-all duration-300 group`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right Content - 3D Avatar */}
          <motion.div 
            className="lg:w-1/2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Hexagon frame */}
              <motion.div
                className="relative w-80 h-80 lg:w-96 lg:h-96"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 border-2 border-cyber-blue/50 transform rotate-0"
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                </div>
                <div className="absolute inset-4 border border-cyber-purple/30 transform rotate-0"
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                </div>
              </motion.div>
              
              {/* Avatar */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden relative">
                  {/* Avatar image */}
                  <img 
                    src="/assets/img/nghiale.jpg" 
                    alt="Le Trong Nghia"
                    className="w-56 h-56 lg:w-72 lg:h-72 rounded-full object-cover border-4 border-cyber-blue/30 shadow-cyber"
                  />
                  
                  {/* Pulse effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyber-blue/50"
                    animate={{ scale: [1, 1.1, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
              
              {/* Floating elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-cyber-blue rounded-full"
                  style={{
                    left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 120}px`,
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 120}px`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Advanced Features */}
      {/* Identity Code Component */}
      <AnimatePresence>
        {showIdentityCode && (
          <motion.div
            className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <IdentityCode />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Component */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            className="absolute bottom-20 left-8 z-20"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <CyberTerminal onClose={() => setShowTerminal(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cyber-blue/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-cyber-blue rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
