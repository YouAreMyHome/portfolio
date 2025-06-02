import React from 'react';
import { Award, Users, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const Awards = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const awards = t('awards.items');

  return (
    <section id="awards" className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('awards.title')}</h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {awards.map((award, index) => {
            const icons = [
              <Award size={32} className="text-yellow-500" />,
              <Users size={32} className="text-blue-500" />,
              <BookOpen size={32} className="text-green-500" />
            ];
            const images = [
              "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            ];
            
            return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="h-40 sm:h-48 overflow-hidden">
                <img 
                  src={images[index] || images[0]} 
                  alt={award.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="mr-3 sm:mr-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div className="block sm:hidden">
                      {React.cloneElement(icons[index] || icons[0], { size: 24 })}
                    </div>
                    <div className="hidden sm:block">
                      {icons[index] || icons[0]}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">{award.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{award.organization} • {award.year}</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{award.description}</p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Awards;