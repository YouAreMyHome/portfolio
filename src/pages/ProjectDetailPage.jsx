import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Calendar, Users, Code, Database, Server, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

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

  const projectImages = [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1605870445919-838d190e8e1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80"
  ];

  const getProjectIcon = (tech) => {
    const icons = {
      'ASP.NET Core': <Server className="w-5 h-5" />,
      'React': <Code className="w-5 h-5" />,
      'SQL Server': <Database className="w-5 h-5" />,
      'JavaScript': <Code className="w-5 h-5" />,
      'Node.js': <Server className="w-5 h-5" />,
      'HTML': <Globe className="w-5 h-5" />,
      'CSS': <Globe className="w-5 h-5" />
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
                href={project.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                {language === 'vi' ? 'Xem Code' : 'View Code'}
              </a>
              <a
                href={project.demo || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {language === 'vi' ? 'Demo' : 'Live Demo'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="mb-8">
              <img
                src={projectImages[parseInt(projectId)] || projectImages[0]}
                alt={project.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Project Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'vi' ? 'Chi tiết dự án' : 'Project Details'}
              </h2>
              
              {/* Project-specific content */}
              {parseInt(projectId) === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {language === 'vi' ? 'Tổng quan' : 'Overview'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {language === 'vi' 
                        ? 'SHN Gear là một nền tảng thương mại điện tử toàn diện chuyên về các sản phẩm công nghệ như điện thoại, laptop, tai nghe và phụ kiện. Dự án được xây dựng với kiến trúc fullstack hiện đại, cung cấp trải nghiệm mua sắm trực tuyến hoàn chỉnh với giao diện quản trị tiên tiến.'
                        : 'SHN Gear is a comprehensive e-commerce platform specializing in technology products such as phones, laptops, headphones and accessories. The project is built with modern fullstack architecture, providing a complete online shopping experience with advanced admin interface.'
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {language === 'vi' ? 'Tính năng chính' : 'Key Features'}
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {language === 'vi' ? 'Xác thực người dùng với JWT Authentication' : 'User authentication with JWT Authentication'}
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {language === 'vi' ? 'Thanh toán đa dạng (COD, MoMo, PayPal)' : 'Multiple payment methods (COD, MoMo, PayPal)'}
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {language === 'vi' ? 'Dashboard quản trị với thống kê realtime' : 'Admin dashboard with realtime statistics'}
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {language === 'vi' ? 'Hệ thống đánh giá và voucher' : 'Review and voucher system'}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {language === 'vi' ? 'Kiến trúc hệ thống' : 'System Architecture'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Backend</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• ASP.NET Core 6</li>
                          <li>• Entity Framework Core</li>
                          <li>• SQL Server Express</li>
                          <li>• JWT Authentication</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• React 18.2.0</li>
                          <li>• Material-UI (MUI)</li>
                          <li>• Tailwind CSS</li>
                          <li>• Recharts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generic content for other projects */}
              {parseInt(projectId) !== 0 && (
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {language === 'vi' ? 'Tính năng' : 'Features'}
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      {project.features?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {feature}
                        </li>
                      )) || (
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {language === 'vi' ? 'Giao diện thân thiện với người dùng' : 'User-friendly interface'}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'vi' ? 'Công nghệ sử dụng' : 'Technologies Used'}
              </h3>
              <div className="space-y-3">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center space-x-3">
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
                {language === 'vi' ? 'Thông tin dự án' : 'Project Info'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'vi' ? 'Thời gian' : 'Duration'}
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {project.duration || (language === 'vi' ? '3-6 tháng' : '3-6 months')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'vi' ? 'Nhóm' : 'Team'}
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {parseInt(projectId) === 0 
                        ? (language === 'vi' ? '2 người' : '2 members')
                        : (language === 'vi' ? 'Cá nhân' : 'Solo project')
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Code className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {language === 'vi' ? 'Loại' : 'Type'}
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {project.type || (language === 'vi' ? 'Ứng dụng web' : 'Web Application')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'vi' ? 'Liên kết' : 'Links'}
              </h3>
              <div className="space-y-3">
                <a
                  href={project.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Github className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {language === 'vi' ? 'Mã nguồn' : 'Source Code'}
                  </span>
                </a>
                
                <a
                  href={project.demo || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {language === 'vi' ? 'Demo trực tiếp' : 'Live Demo'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
