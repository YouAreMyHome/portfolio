import React, { useState, useEffect } from 'react';
import { Menu, X, Github as GitHub, Linkedin, Facebook, Mail, ExternalLink, Award, Briefcase, Code, User, Home, Sun, Moon } from 'lucide-react';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Awards from './components/Awards';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Update the document class when dark mode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Le Trong Nghia</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className={`${activeSection === 'home' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('experience')}
                className={`${activeSection === 'experience' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              >
                Experience
              </button>
              <button 
                onClick={() => scrollToSection('awards')}
                className={`${activeSection === 'awards' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              >
                Awards
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className={`${activeSection === 'projects' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`${activeSection === 'contact' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-blue-400'} transition-colors`}
              >
                Contact
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            {/* Mobile menu button and dark mode toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => scrollToSection('home')}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <Home size={18} className="mr-2" />
                  Home
                </div>
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <Briefcase size={18} className="mr-2" />
                  Experience
                </div>
              </button>
              <button
                onClick={() => scrollToSection('awards')}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <Award size={18} className="mr-2" />
                  Awards
                </div>
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <Code size={18} className="mr-2" />
                  Projects
                </div>
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <Mail size={18} className="mr-2" />
                  Contact
                </div>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <Hero scrollToContact={() => scrollToSection('contact')} />
        <Experience />
        <Awards />
        <Projects />
        <Contact />
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Nghĩa. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <GitHub size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Linkedin size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;