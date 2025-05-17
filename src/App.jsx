// src/App.jsx
import React, { useState, useEffect } from 'react';
// Thêm Gamepad2 hoặc icon bạn muốn cho game
import { Menu, X, Github as GitHub, Linkedin, Facebook, Mail, Sun, Moon, Home, Briefcase, Award, Code as CodeIcon, Gamepad2 } from 'lucide-react';
import Hero from './components/Hero'; // Đảm bảo Hero có id="home" bên trong
import Experience from './components/Experience'; // Đảm bảo có id="experience"
import Awards from './components/Awards'; // Đảm bảo có id="awards"
import Projects from './components/Projects'; // Đảm bảo có id="projects"
import Contact from './components/Contact'; // Đảm bảo có id="contact"
import JsRunnerGame from './components/JsRunnerGame'; // Game component đã có id="fun-game"
import { /*...,*/ ChevronDown, ChevronUp } from 'lucide-react'; // Thêm icon nếu muốn

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Chỉ thực thi localStorage và matchMedia ở client-side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Giá trị mặc định nếu không ở client-side (ví dụ SSR)
  });

  // State mới để quản lý hiển thị game
  const [isGameSectionVisible, setIsGameSectionVisible] = useState(true); // Mặc định là hiển thị

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Intersection Observer để tự động cập nhật activeSection khi cuộn
  useEffect(() => {
    const sections = ['home', 'experience', 'awards', 'projects', 'fun-game', 'contact'];
    const observerOptions = {
      root: null, // Quan sát trong viewport
      rootMargin: '-40% 0px -60% 0px', // Kích hoạt khi section ở khoảng giữa màn hình
      threshold: 0 // Kích hoạt ngay khi một phần nhỏ của section vào vùng rootMargin
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => { // Dọn dẹp observer
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []); // Chạy một lần khi component mount


  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const scrollToSection = (sectionId) => {
    if (sectionId === 'fun-game' && !isGameSectionVisible) {
      setIsGameSectionVisible(true); // Tự động mở game nếu đang đóng khi click nav
      // Đợi một chút để game kịp mở rồi mới cuộn
      setTimeout(() => {
        performScroll(sectionId);
      }, 100); // Thời gian chờ có thể cần điều chỉnh
    } else {
      performScroll(sectionId);
    }
    setMobileMenuOpen(false);
  };

  const performScroll = (sectionId) => { // Tách logic cuộn ra
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'awards', label: 'Awards', icon: Award },
    { id: 'projects', label: 'Projects', icon: CodeIcon },
    { id: 'fun-game', label: 'Fun Game', icon: Gamepad2 }, // Thêm mục game
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full"> {/* Thêm items-center */}
            <div className="flex items-center">
              <button onClick={() => scrollToSection('home')} className="text-xl font-bold focus:outline-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Le Trong Nghia
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${activeSection === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-800 scale-105' : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={toggleDarkMode}
                className="ml-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            {/* Mobile menu button and dark mode toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {/* Transition cho mobile menu */}
        <div
          id="mobile-menu"
          className={`md:hidden absolute w-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${activeSection === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <div className="flex items-center">
                  <item.icon size={18} className="mr-3 flex-shrink-0" />
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {/* Thêm padding-top bằng chiều cao navbar để nội dung không bị che */}
      <main className="pt-16"> 
        <Hero scrollToContact={() => scrollToSection('contact')} /> 
        <Experience /> 
        <Awards /> 
        <Projects /> 
        {/* Fun Game Section - ĐÃ CẬP NHẬT */}
        <section id="fun-game" className="scroll-mt-16 bg-slate-100 dark:bg-gray-800"> {/* Nền cho cả section game */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center"> {/* Container chung */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white inline-block">
                Mini Game Zone
              </h2>
              <button
                onClick={() => setIsGameSectionVisible(!isGameSectionVisible)}
                className="ml-4 px-4 py-2 text-sm font-medium rounded-lg
                           bg-sky-500 hover:bg-sky-600 text-white 
                           dark:bg-sky-600 dark:hover:bg-sky-700
                           focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50
                           transition-all duration-300 flex items-center justify-center mx-auto mt-4 md:mt-0 md:inline-flex"
                aria-expanded={isGameSectionVisible}
                aria-controls="cat-run-game-content"
              >
                {isGameSectionVisible ? (
                  <>Hide Game <ChevronUp size={20} className="ml-2" /></>
                ) : (
                  <>Show Game <ChevronDown size={20} className="ml-2" /></>
                )}
              </button>
            </div>
            
            {/* Khu vực nội dung game có thể thu nhỏ/mở rộng */}
            <div
              id="cat-run-game-content"
              className={`transition-all duration-700 ease-in-out overflow-hidden ${
                isGameSectionVisible 
                  ? 'max-h-[1500px] opacity-100 visible' // max-h đủ lớn cho game và khoảng trống
                  : 'max-h-0 opacity-0 invisible'
              }`}
            >
              {/* JsRunnerGame sẽ được render ở đây.
                  Nó không còn thẻ <section> bao ngoài với min-h-screen nữa.
                  Nó sẽ hiển thị "chiếc TV" trực tiếp.
                  Thêm flex và justify-center để căn giữa TV nếu cần (tùy thuộc vào return của JsRunnerGame)
              */}
              {isGameSectionVisible && (
                <div className="flex justify-center items-start pt-4 pb-8"> 
                  <JsRunnerGame />
                </div>
              )}
            </div>
          </div>
        </section> 
        <Contact /> 
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Le Trong Nghia. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com/YouAreMyHome" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <GitHub size={20} />
              </a>
              <a href="https://www.linkedin.com/in/youaremyhome/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.facebook.com/consauchetduoi" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
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