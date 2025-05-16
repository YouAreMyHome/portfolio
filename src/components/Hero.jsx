import React from 'react';
import { Github as GitHub, Linkedin, Facebook, ArrowRight } from 'lucide-react';

const Hero = ({ scrollToContact }) => {
  return (
    <section id="home" className="py-20 md:py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-70"></div>
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                  Hi, I'm <span className="text-blue-600 dark:text-blue-400 relative">
                    Nghia
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 dark:bg-blue-400 transform -translate-y-1"></span>
                  </span>
                </h1>
                <h2 className="text-xl md:text-2xl font-medium mb-6 text-gray-700 dark:text-gray-300">
                  IT Student at HUFLIT
                </h2>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                  Aspiring Software Developer specializing in web development with a passion for creating efficient, user-friendly applications.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4 mb-8">
              <a 
                href="github.com/YouAreMyHome" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
              >
                <GitHub size={24} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a 
                href="www.linkedin.com/in/youaremyhome" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
              >
                <Linkedin size={24} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a 
                href="www.facebook.com/consauchetduoi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
              >
                <Facebook size={24} className="text-gray-700 dark:text-gray-300" />
              </a>
            </div>
            
            <button 
              onClick={scrollToContact}
              className="group px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center"
            >
              Contact Me
              <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white dark:from-blue-900/30 dark:to-gray-900 rounded-full blur-md -m-4"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative">
                <img 
                  src="https://res.cloudinary.com/dackig67m/image/upload/v1740667437/z6358831259755_64b8d57e8509ee4d7792963b5c469615_a5zhv0.jpg" 
                  alt="Nghĩa" 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
                <p className="font-medium">Software Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;