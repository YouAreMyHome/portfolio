import React from 'react';
import { GraduationCap, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const Education = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  return (
    <section id="education" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 
                          bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 sm:mb-6">
            <GraduationCap size={24} className="sm:w-8 sm:h-8 text-white" />
          </div>          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
                         text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                         dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-3 sm:mb-4">
            {t('education.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {language === 'vi' ? 'Hành trình học tập và phát triển kiến thức chuyên môn' : 'Academic journey and professional knowledge development'}
          </p>
        </div>

        {/* Education Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl 
                          p-6 sm:p-8 md:p-10 transition-all duration-300 hover:shadow-3xl
                          border border-gray-200/50 dark:border-gray-700/50 group">
            
            {/* University Info */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6">              {/* University Logo */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-slate-700 
                                rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300
                                border border-gray-200/50 dark:border-gray-600/50 p-2">
                  <img 
                    src="/assets/img/huflit-removebg-preview.png" 
                    alt="HUFLIT Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* University Details */}
              <div className="flex-grow text-center md:text-left">                <div className="mb-3 sm:mb-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t('education.university')}
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">
                    (HUFLIT)
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {t('education.degree')}
                  </p>
                </div>

                {/* Academic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* GPA */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                                  p-3 sm:p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>                      <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400">
                        {t('education.gpa')}
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-300">
                      3.2/4.0
                    </p>
                  </div>

                  {/* Status */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                                  p-3 sm:p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <Calendar size={12} className="sm:w-3 sm:h-3 text-blue-600 dark:text-blue-400" />                      <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">
                        {t('education.status')}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-blue-800 dark:text-blue-300">
                      {t('education.status')}
                    </p>
                  </div>
                </div>

                {/* Location & Website */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm sm:text-base">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin size={16} className="sm:w-4 sm:h-4 text-gray-500" />
                    <span>TP. Hồ Chí Minh</span>
                  </div>

                  {/* Website Link */}
                  <a 
                    href="https://huflit.edu.vn/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 
                               dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200
                               text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
                  >
                    <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">{t('education.website')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Achievements */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                                p-4 sm:p-5 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                  <h4 className="text-sm sm:text-base font-semibold text-purple-800 dark:text-purple-300 mb-2 sm:mb-3">
                    Thành tích nổi bật
                  </h4>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-purple-700 dark:text-purple-400">
                    <li>• Tham gia các dự án web development</li>
                    <li>• Học tập và nghiên cứu công nghệ mới</li>
                    <li>• Phát triển kỹ năng lập trình full-stack</li>
                  </ul>
                </div>

                {/* Skills Gained */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 
                                p-4 sm:p-5 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                  <h4 className="text-sm sm:text-base font-semibold text-orange-800 dark:text-orange-300 mb-2 sm:mb-3">
                    Kỹ năng đạt được
                  </h4>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-orange-700 dark:text-orange-400">
                    <li>• Lập trình web với React.js</li>
                    <li>• Phát triển ứng dụng JavaScript</li>
                    <li>• Thiết kế giao diện người dùng</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
