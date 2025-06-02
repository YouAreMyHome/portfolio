import React from 'react';
import { Github as GitHub, Linkedin, Facebook, ArrowRight } from 'lucide-react';

const Hero = ({ scrollToContact }) => {
  return (
    <section id="home" className="py-16 sm:py-20 md:py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="relative">
              <div className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-70"></div>
              <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-70"></div>
              <div className="relative">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                  Hi, I'm <span className="text-blue-600 dark:text-blue-400 relative">
                    Nghia
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 transform -translate-y-1"></span>
                  </span>
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-4 sm:mb-6 text-gray-700 dark:text-gray-300">
                  IT Student at HUFLIT
                </h2>
                <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                  Aspiring Software Developer specializing in web development with a passion for creating efficient, user-friendly applications.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a 
                href="github.com/YouAreMyHome" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
              >
                <GitHub size={20} className="sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </a>
              <a 
                href="www.linkedin.com/in/youaremyhome" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
              >
                <Linkedin size={20} className="sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </a>
              <a 
                href="www.facebook.com/consauchetduoi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
              >
                <Facebook size={20} className="sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </a>
            </div>
            
            <button 
              onClick={scrollToContact}
              className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center text-sm sm:text-base"
            >
              Contact Me
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white dark:from-blue-900/30 dark:to-gray-900 rounded-full blur-md -m-3 sm:-m-4"></div>
              <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-3 sm:border-4 border-white dark:border-gray-800 shadow-xl relative">
                <img 
                  src="https://res.cloudinary.com/dackig67m/image/upload/v1740667437/z6358831259755_64b8d57e8509ee4d7792963b5c469615_a5zhv0.jpg" 
                  alt="Nghĩa" 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-md">
                <p className="font-medium text-xs sm:text-sm">Software Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;