import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ExternalLink, MapPin, Calendar, BookOpen, Award, Code, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const Education = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section id="education" className="py-20 bg-cyber-darker relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-cyber-purple mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-6 h-6" />
            <span className="font-mono text-sm uppercase tracking-wider">Academic</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold gradient-cyber-text mb-6">
            {t('education.title')}
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {language === 'vi' ? 'Hành trình học tập và phát triển kiến thức chuyên môn' : 'Academic journey and professional knowledge development'}
          </p>
          
          <motion.div 
            className="mt-6 h-1 w-20 bg-cyber-gradient mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>

        {/* Education Card */}
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="cyber-card rounded-2xl p-8 group relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-cyber-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-300"
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(0,247,255,0.05) 0%, rgba(124,58,237,0.05) 100%)',
                  'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(236,72,153,0.05) 100%)',
                  'linear-gradient(135deg, rgba(236,72,153,0.05) 0%, rgba(0,247,255,0.05) 100%)',
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            />
            
            {/* University Info */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 relative z-10">
              {/* University Logo */}
              <motion.div 
                className="flex-shrink-0 mx-auto lg:mx-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-24 h-24 lg:w-32 lg:h-32 cyber-card rounded-2xl flex items-center justify-center shadow-cyber group-hover:shadow-cyber-lg transition-all duration-300 p-4">
                  <img 
                    src="/assets/img/huflit-removebg-preview.png" 
                    alt="HUFLIT Logo" 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </motion.div>

              {/* University Details */}
              <div className="flex-grow text-center lg:text-left">
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-white mb-3 group-hover:text-cyber-blue transition-colors">
                    HUFLIT University
                  </h3>
                  
                  <motion.div 
                    className="inline-flex items-center gap-2 bg-cyber-blue/10 text-cyber-blue px-4 py-2 rounded-full border border-cyber-blue/30 mb-4"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 247, 255, 0.2)' }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="font-mono text-sm">Information Technology</span>
                  </motion.div>
                </motion.div>

                {/* Education Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <motion.div 
                    className="flex items-center gap-3 text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="w-10 h-10 cyber-card rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-cyber-purple" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Duration</p>
                      <p className="font-mono text-sm">2021 - 2025</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <div className="w-10 h-10 cyber-card rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-cyber-pink" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                      <p className="font-mono text-sm">Ho Chi Minh City</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <div className="w-10 h-10 cyber-card rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-cyber-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Degree</p>
                      <p className="font-mono text-sm">Bachelor</p>
                    </div>
                  </motion.div>
                </div>

                {/* Key Subjects */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <h4 className="text-lg font-orbitron font-semibold text-cyber-blue mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Key Subjects
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Data Structures & Algorithms',
                      'Web Development',
                      'Database Management',
                      'Software Engineering',
                      'Computer Networks',
                      'Mobile Development'
                    ].map((subject, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-cyber-purple/10 text-cyber-purple text-sm rounded-full border border-cyber-purple/30 font-mono"
                        whileHover={{ 
                          scale: 1.1, 
                          backgroundColor: 'rgba(124, 58, 237, 0.2)',
                          boxShadow: '0 0 10px rgba(124, 58, 237, 0.3)'
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      >
                        {subject}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <motion.a
                    href="https://huflit.edu.vn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 cyber-card text-cyber-blue font-semibold rounded-lg hover:shadow-cyber transition-all group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Visit University</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                  
                  <motion.div
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-gradient/10 text-white font-semibold rounded-lg border border-cyber-blue/30"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(0, 247, 255, 0.3)'
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="font-mono">Final Year Student</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
