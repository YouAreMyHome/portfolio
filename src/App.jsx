// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
// Icons
import { Menu, X, Github as GitHub, Linkedin, Facebook, Mail, Sun, Moon, Home, Briefcase, Award, Code as CodeIcon, Gamepad2, Link as LinkIcon } from 'lucide-react'; // Thêm LinkIcon

// Page Components
import HomePage from './pages/HomePage';
import JsRunnerGamePage from './pages/JsRunnerGamePage';
import CleanUriToolPage from './pages/CleanUriToolPage'; // Import trang mới

// (Không cần import Hero, Experience, Awards, Projects, Contact, JsRunnerGame trực tiếp ở đây nữa nếu chúng chỉ dùng trong các page)

function App() {
  const [activeSection, setActiveSection] = useState('home'); // Sẽ chủ yếu dùng cho HomePage
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const location = useLocation(); // Hook để lấy path hiện tại
  const navigate = useNavigate(); // Hook để điều hướng programmatic

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Cập nhật activeSection dựa trên route cho các trang không phải HomePage
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveSection('home');
    else if (path === '/fun-game') setActiveSection('fun-game');
    else if (path === '/url-shortener') setActiveSection('url-shortener');
    // Các route khác nếu có
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển route
  }, [location.pathname]);


  const toggleDarkMode = () => setDarkMode(prevMode => !prevMode);

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
    { id: 'home', label: 'Home', path: '/', icon: Home, isPage: false }, // isPage=false nghĩa là section trên HomePage
    { id: 'experience', label: 'Experience', path: 'experience', icon: Briefcase, isPage: false },
    { id: 'awards', label: 'Awards', path: 'awards', icon: Award, isPage: false },
    { id: 'projects', label: 'Projects', path: 'projects', icon: CodeIcon, isPage: false },
    { id: 'url-shortener', label: 'URL Shortener', path: '/url-shortener', icon: LinkIcon, isPage: true }, // Trang riêng
    { id: 'fun-game', label: 'Fun Game', path: '/fun-game', icon: Gamepad2, isPage: true }, // Trang riêng
    { id: 'contact', label: 'Contact', path: 'contact', icon: Mail, isPage: false },
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            <Link to="/" onClick={() => handleNavClick('home')} className="text-xl font-bold focus:outline-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Le Trong Nghia
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                item.isPage ? (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${activeSection === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-800 scale-105' : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button 
                    key={item.id}
                    onClick={() => handleNavClick(item.path, false)} // path ở đây là sectionId
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${activeSection === item.id && location.pathname === '/' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-800 scale-105' : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    aria-current={activeSection === item.id && location.pathname === '/' ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                )
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
              <button /* Dark mode toggle (giữ nguyên) */ onClick={toggleDarkMode} className="p-2 ..."> {darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
              <button onClick={() => setMobileMenuOpen(prev => !prev)} className="inline-flex ..."> {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`md:hidden absolute w-full bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              item.isPage ? (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${activeSection === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <div className="flex items-center"> <item.icon size={18} className="mr-3 flex-shrink-0" /> {item.label} </div>
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path, false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${activeSection === item.id && location.pathname === '/' ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  aria-current={activeSection === item.id && location.pathname === '/' ? 'page' : undefined}
                >
                  <div className="flex items-center"> <item.icon size={18} className="mr-3 flex-shrink-0" /> {item.label} </div>
                </button>
              )
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content - Outlet sẽ render page component tương ứng */}
      <main className="pt-16"> 
        <Routes>
          <Route 
            path="/" 
            element={<HomePage setActiveSection={setActiveSection} scrollToSection={performScroll} performScroll={performScroll} />} 
          />
          <Route path="/fun-game" element={<JsRunnerGamePage />} />
          <Route path="/url-shortener" element={<CleanUriToolPage />} />
          {/* Bạn có thể thêm các route khác ở đây, ví dụ trang chi tiết dự án */}
        </Routes>
      </main>

      {/* Footer (giữ nguyên) */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 border-t border-gray-200 dark:border-gray-700">
        {/* ... nội dung footer ... */}
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
              {/* ... các social links khác ... */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;