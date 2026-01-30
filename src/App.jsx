// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link, useLocation, useNavigate, BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
// Icons
import { Menu, X, Github as GitHub, Linkedin, Facebook, Mail, Home, Briefcase, Award, Code as CodeIcon, Languages } from 'lucide-react';

// Context
import { useLanguage } from './contexts/LanguageContext';
import { getTranslation } from './translations';

// Components
import CyberCursor from './components/CyberCursor';
import KonamiCode from './components/KonamiCode';
import TechUniverse from './components/TechUniverse';
import UtilityPanel from './components/UtilityPanel';
import FloatingNotification from './components/FloatingNotification';
import { SoundProvider, SoundControls, useCyberSounds } from './components/SoundSystem';
import { PageTransition, CyberLoader } from './components/CyberTransition';

// Page Components
import HomePage from './pages/HomePage';
import JsRunnerGamePage from './pages/JsRunnerGamePage';
import FlappyCatPage from './pages/FlappyCatPage';
import CleanUriToolPage from './pages/CleanUriToolPage'; // Import trang mới
import ProjectDetailPageNew from './pages/ProjectDetailPageNew'; // Import trang chi tiết dự án mới
import ShowcasePage from './pages/ShowcasePage'; // Import showcase page
import InteractiveCVPage from './pages/InteractiveCVPage'; // Import interactive CV experience

// (Không cần import Hero, Experience, Awards, Projects, Contact, JsRunnerGame trực tiếp ở đây nữa nếu chúng chỉ dùng trong các page)

function AppContent() {
  const [activeSection, setActiveSection] = useState('home'); // Sẽ chủ yếu dùng cho HomePage
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Cyberpunk theme luôn ở dark mode
  const [darkMode, setDarkMode] = useState(true);

  const { language, toggleLanguage } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const location = useLocation(); // Hook để lấy path hiện tại
  const navigate = useNavigate(); // Hook để điều hướng programmatic

  useEffect(() => {
    // Cyberpunk theme luôn ở dark mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Cập nhật activeSection dựa trên route cho các trang không phải HomePage
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveSection('home');
    else if (path === '/fun-game') setActiveSection('fun-game');
    else if (path === '/url-shortener') setActiveSection('url-shortener');
    // Các route khác nếu có
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển route
  }, [location.pathname]);

  // Hàm này giờ đây sẽ dùng cho việc cuộn trong HomePage hoặc điều hướng
  const handleNavClick = (pathOrSectionId, isExternalPage = false) => {
    setMobileMenuOpen(false);
    if (isExternalPage) {
      navigate(pathOrSectionId); // Điều hướng đến trang mới
    } else {
      // Nếu đang ở trang chủ, cuộn đến section
      if (location.pathname === '/') {
        performScroll(pathOrSectionId);
      } else {
        // Nếu không ở trang chủ, điều hướng về trang chủ rồi cuộn
        navigate('/');
        setTimeout(() => performScroll(pathOrSectionId), 100); // Đợi navigate xong rồi cuộn
      }
    }
  };

  const performScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Chiều cao navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'home', label: t('nav.home'), path: '/', icon: Home, isPage: false }, // isPage=false nghĩa là section trên HomePage
    { id: 'education', label: t('nav.education'), path: 'education', icon: Briefcase, isPage: false },
    // { id: 'awards', label: t('nav.awards'), path: 'awards', icon: Award, isPage: false }, // Hidden awards section
    { id: 'projects', label: t('nav.projects'), path: 'projects', icon: CodeIcon, isPage: false },
    { id: 'contact', label: t('nav.contact'), path: 'contact', icon: Mail, isPage: false },
  ];

  return (
    <div className={`min-h-screen bg-dark-gradient text-gray-200 transition-colors duration-300 font-sans`} style={{ cursor: 'none' }}>
      {/* Tech Universe Background */}
      <TechUniverse />
      
      {/* Konami Code Easter Egg */}
      <KonamiCode 
        onActivate={() => {
          // Redirect to game page when Konami code is activated
          navigate('/fun-game');
        }} 
      />
      
      {/* Sound Controls */}
      <SoundControls />
      
      {/* Utility Panel */}
      <UtilityPanel />
      
      {/* Floating Notification */}
      <FloatingNotification />
      
      {/* Custom Cursor */}
      <CyberCursor />
      
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 glassmorphism z-50 h-16 border-b border-cyber-blue/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/" 
                onClick={() => handleNavClick('home')} 
                className="text-xl font-orbitron font-bold focus:outline-none gradient-cyber-text transition-colors"
              >
                &lt; Le Trong Nghia /&gt;
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                item.isPage ? (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out outline-none focus:ring-2 focus:ring-cyber-blue/50 relative group ${
                        activeSection === item.id 
                          ? 'text-cyber-blue bg-cyber-blue/10 shadow-neon' 
                          : 'text-gray-300 hover:text-cyber-blue hover:bg-cyber-blue/5'
                      }`}
                      aria-current={activeSection === item.id ? 'page' : undefined}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {activeSection === item.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-cyber-gradient"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.div
                        className="absolute inset-0 rounded-lg border border-cyber-blue/30 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                      />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      onClick={() => handleNavClick(item.path, false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out outline-none focus:ring-2 focus:ring-cyber-blue/50 relative group ${
                        activeSection === item.id && location.pathname === '/' 
                          ? 'text-cyber-blue bg-cyber-blue/10 shadow-neon' 
                          : 'text-gray-300 hover:text-cyber-blue hover:bg-cyber-blue/5'
                      }`}
                      aria-current={activeSection === item.id && location.pathname === '/' ? 'page' : undefined}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {activeSection === item.id && location.pathname === '/' && (
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-cyber-gradient"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <motion.div
                        className="absolute inset-0 rounded-lg border border-cyber-blue/30 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                      />
                    </button>
                  </motion.div>
                )
              ))}
              
              <motion.button
                onClick={toggleLanguage}
                className="ml-2 p-3 rounded-full cyber-card text-cyber-pink flex items-center space-x-1 transition-all focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 group"
                aria-label="Toggle language"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Languages size={18} className="group-hover:text-cyber-blue transition-colors" />
                <span className="text-xs font-mono font-bold group-hover:text-cyber-blue transition-colors">
                  {language.toUpperCase()}
                </span>
              </motion.button>
            </div>
            
            {/* Mobile menu button and controls */}
            <div className="md:hidden flex items-center space-x-2">
              <motion.button 
                onClick={toggleLanguage} 
                className="p-2 cyber-card rounded-full text-cyber-pink flex items-center space-x-1 transition-all focus:outline-none focus:ring-2 focus:ring-cyber-blue/50" 
                aria-label="Toggle language"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Languages size={16} />
                <span className="text-xs font-mono font-bold">{language.toUpperCase()}</span>
              </motion.button>
              
              <motion.button 
                onClick={() => setMobileMenuOpen(prev => !prev)} 
                className="inline-flex items-center justify-center p-2 cyber-card rounded-lg text-cyber-blue transition-all focus:outline-none focus:ring-2 focus:ring-cyber-blue/50" 
                aria-label="Open main menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden absolute w-full cyber-card border-t border-cyber-blue/30 overflow-hidden`}
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: mobileMenuOpen ? 1 : 0, 
                  x: mobileMenuOpen ? 0 : -20 
                }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
              >
                {item.isPage ? (
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all group ${
                      activeSection === item.id 
                        ? 'text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/30' 
                        : 'text-gray-300 hover:text-cyber-blue hover:bg-cyber-blue/5'
                    }`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    <item.icon size={20} className="mr-3 flex-shrink-0 group-hover:text-cyber-blue transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.path, false)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all group ${
                      activeSection === item.id && location.pathname === '/' 
                        ? 'text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/30' 
                        : 'text-gray-300 hover:text-cyber-blue hover:bg-cyber-blue/5'
                    }`}
                    aria-current={activeSection === item.id && location.pathname === '/' ? 'page' : undefined}
                  >
                    <item.icon size={20} className="mr-3 flex-shrink-0 group-hover:text-cyber-blue transition-colors" />
                    <span>{item.label}</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.nav>

      {/* Main Content - Outlet sẽ render page component tương ứng */}
      <main className="pt-16"> 
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <PageTransition pageKey="home">
                  <HomePage setActiveSection={setActiveSection} scrollToSection={performScroll} performScroll={performScroll} />
                </PageTransition>
              } 
            />
            <Route 
              path="/fun-game" 
              element={
                <PageTransition pageKey="game">
                  <FlappyCatPage />
                </PageTransition>
              } 
            />
            {/* Optimized full-page removed */}
            <Route 
              path="/url-shortener" 
              element={
                <PageTransition pageKey="url-tool">
                  <CleanUriToolPage />
                </PageTransition>
              } 
            />
            <Route 
              path="/project/:projectId" 
              element={
                <PageTransition pageKey="project-detail">
                  <ProjectDetailPageNew />
                </PageTransition>
              } 
            />
            <Route 
              path="/showcase" 
              element={
                <PageTransition pageKey="showcase">
                  <ShowcasePage />
                </PageTransition>
              } 
            />
            <Route 
              path="/interactive-cv" 
              element={
                <PageTransition pageKey="interactive-cv">
                  <InteractiveCVPage />
                </PageTransition>
              } 
            />
            {/* Bạn có thể thêm các route khác ở đây, ví dụ trang chi tiết dự án */}
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-cyber-blue/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400 font-mono">
                © {new Date().getFullYear()} <span className="text-cyber-blue">Le Trong Nghia</span>. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              {[
                { icon: GitHub, href: "https://github.com/YouAreMyHome", color: "hover:text-cyber-blue" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/youaremyhome", color: "hover:text-cyber-purple" },
                { icon: Facebook, href: "https://facebook.com/youaremyhome", color: "hover:text-cyber-pink" }
              ].map(({ icon: Icon, href, color }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social Media Profile"
                  className={`p-2 text-gray-400 ${color} transition-all duration-300 rounded-full hover:bg-white/5`}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main App component with providers
function App() {
  return (
    <SoundProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;