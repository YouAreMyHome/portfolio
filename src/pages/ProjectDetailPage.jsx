import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Calendar, Users, Code, Database, Server, Globe, Star, Shield, Zap, Layout, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const projects = t('projects.items');
  const project = projects[parseInt(projectId)];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'vi' ? 'Không tìm thấy dự án' : 'Project not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'vi' ? 'Về trang chủ' : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }
  const projectImages = {
    0: [ // SHN Gear
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80"
    ],
    1: [ // Hotel Booking
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1780&q=80"
    ],
    2: [ // Portfolio
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1931&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
    ]
  };

  const currentProjectImages = projectImages[parseInt(projectId)] || projectImages[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentProjectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentProjectImages.length) % currentProjectImages.length);
  };
  const getProjectIcon = (tech) => {
    const icons = {
      'Node.js': <Server className="w-5 h-5" />,
      'React': <Code className="w-5 h-5" />,
      'MongoDB': <Database className="w-5 h-5" />,
      'Express': <Server className="w-5 h-5" />,
      'Ant Design': <Layout className="w-5 h-5" />,
      'JWT': <Shield className="w-5 h-5" />,
      'Cloudinary API': <Globe className="w-5 h-5" />,
      'ASP.NET Core': <Server className="w-5 h-5" />,
      'SQL Server': <Database className="w-5 h-5" />,
      'JavaScript': <Code className="w-5 h-5" />,
      'HTML': <Globe className="w-5 h-5" />,
      'CSS': <Globe className="w-5 h-5" />,
      'Tailwind CSS': <Globe className="w-5 h-5" />,
      'Framer Motion': <Zap className="w-5 h-5" />,
      'Vercel': <Globe className="w-5 h-5" />,
      'EmailJS': <Globe className="w-5 h-5" />
    };
    return icons[tech] || <Code className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {language === 'vi' ? 'Quay lại' : 'Back'}
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h1>
                {parseInt(projectId) === 0 && (
                  <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full font-semibold">
                    {language === 'vi' ? 'Dự án nhóm' : 'Team Project'}
                  </span>
                )}
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {project.description}
              </p>
            </div>
              <div className="flex space-x-4">
              <a
                href={project.githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                {t('projects.github')}
              </a>
              <a
                href={project.demoUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {t('projects.demo')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <img
                  src={currentProjectImages[currentImageIndex]}
                  alt={project.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
                />
                {currentProjectImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {currentProjectImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>            {/* Project Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('projects.projectOverview')}
              </h2>
              
              {/* Project-specific content */}
              {parseInt(projectId) === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      {language === 'vi' ? 'Tổng quan dự án' : 'Project Overview'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {language === 'vi' 
                        ? 'SHN Gear là nền tảng thương mại điện tử chuyên về thiết bị gaming được phát triển bởi đội ngũ sinh viên. Dự án tập trung vào việc cung cấp trải nghiệm mua sắm tối ưu cho cộng đồng game thủ với các tính năng hiện đại như thanh toán đa dạng, quản lý đơn hàng thông minh và dashboard analytics.'
                        : 'SHN Gear is an e-commerce platform specializing in gaming equipment developed by a student team. The project focuses on providing optimal shopping experience for the gaming community with modern features like diverse payment methods, smart order management, and analytics dashboard.'
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-500" />
                      {t('projects.keyFeatures')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel Booking System - Project ID 1 */}
              {parseInt(projectId) === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      {language === 'vi' ? 'Tổng quan dự án' : 'Project Overview'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {language === 'vi' 
                        ? 'Hệ thống quản lý đặt phòng khách sạn toàn diện được phát triển với Node.js, React và MongoDB. Dự án hỗ trợ 3 loại người dùng: khách hàng, quản lý khách sạn và quản trị viên, mỗi loại có quyền truy cập và chức năng riêng biệt.'
                        : 'Comprehensive hotel booking management system developed with Node.js, React, and MongoDB. The project supports 3 types of users: customers, hotel managers, and administrators, each with distinct access rights and functionalities.'
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-500" />
                      {t('projects.keyFeatures')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Code className="w-5 h-5 mr-2 text-green-500" />
                      {language === 'vi' ? 'Kiến trúc hệ thống' : 'System Architecture'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center">
                          <Server className="w-4 h-4 mr-2" />
                          Backend
                        </h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Node.js với Express Framework</li>
                          <li>• MongoDB với Mongoose ODM</li>
                          <li>• JWT Authentication & Authorization</li>
                          <li>• Cloudinary API cho upload ảnh</li>
                          <li>• Role-based Access Control</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
                        <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center">
                          <Layout className="w-4 h-4 mr-2" />
                          Frontend
                        </h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• React 18 với Hooks</li>
                          <li>• Ant Design Components</li>
                          <li>• Responsive Design</li>
                          <li>• State Management</li>
                          <li>• Real-time Updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-red-500" />
                      {t('projects.challenges')}
                    </h3>
                    <div className="space-y-3">
                      {project.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-red-700 dark:text-red-300 text-sm">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Generic content for other projects */}
              {parseInt(projectId) !== 0 && parseInt(projectId) !== 1 && (
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-500" />
                      {t('projects.keyFeatures')}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {project.features?.map((feature, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                        </div>
                      )) || (
                        <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {language === 'vi' ? 'Giao diện thân thiện với người dùng' : 'User-friendly interface'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {project.challenges && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-red-500" />
                        {t('projects.challenges')}
                      </h3>
                      <div className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-red-700 dark:text-red-300 text-sm">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" />
                {t('projects.technologiesUsed')}
              </h3>
              <div className="space-y-3">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex-shrink-0 text-blue-600">
                      {getProjectIcon(tech)}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('projects.projectTeam')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {t('projects.projectDuration')}
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {project.duration || (language === 'vi' ? '3-6 tháng' : '3-6 months')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {t('projects.projectTeam')}
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {project.team || (parseInt(projectId) === 0 
                        ? (language === 'vi' ? '2 thành viên' : '2 members')
                        : (language === 'vi' ? 'Dự án cá nhân' : 'Solo project')
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {t('projects.projectRole')}
                    </p>
                    <p className="text-gray-900 dark:text-white font-semibold">
                      {project.role || (language === 'vi' ? 'Full-stack Developer' : 'Full-stack Developer')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'vi' ? 'Liên kết dự án' : 'Project Links'}
              </h3>
              <div className="space-y-3">
                <a
                  href={project.githubUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <Github className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white">
                      {t('projects.github')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'vi' ? 'Xem mã nguồn trên GitHub' : 'View source code on GitHub'}
                    </p>
                  </div>
                </a>
                
                <a
                  href={project.demoUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group border border-blue-200 dark:border-blue-800"
                >
                  <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-blue-700 dark:text-blue-300 font-medium">
                      {t('projects.demo')}
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-400">
                      {language === 'vi' ? 'Trải nghiệm demo trực tiếp' : 'Experience live demo'}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Project Stats (if available) */}
            {(parseInt(projectId) === 0 || parseInt(projectId) === 1) && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  {language === 'vi' ? 'Thống kê dự án' : 'Project Stats'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {project.technologies.length}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {language === 'vi' ? 'Công nghệ' : 'Technologies'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {project.features?.length || 8}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {language === 'vi' ? 'Tính năng' : 'Features'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
