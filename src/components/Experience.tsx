import React from 'react';
import { Calendar, Code, Server, Shield } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      period: "2025 - Present",
      title: "E-commerce System Development",
      company: "SHN",
      description: "Developing an e-commerce system using React and ASP.NET Core. Implementing features like product catalog, shopping cart, and payment processing.",
      icon: <Code size={24} className="text-blue-600 dark:text-blue-400" />
    },
    {
      period: "2024",
      title: "Hotel Booking System",
      company: "Personal Project",
      description: "Built a hotel booking system using MERN Stack (MongoDB, Express, React, Node.js) with Ant Design for the UI components.",
      icon: <Server size={24} className="text-blue-600 dark:text-blue-400" />
    },
    {
      period: "2023",
      title: "Email Security Research",
      company: "HUFLIT",
      description: "Researched email security at HUFLIT, focusing on phishing prevention and implementing warning systems.",
      icon: <Shield size={24} className="text-blue-600 dark:text-blue-400" />
    },
    {
      period: "2022",
      title: "Programming Competitions",
      company: "Various",
      description: "Participated in various programming competitions and hackathons, developing problem-solving skills and teamwork.",
      icon: <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
    }
  ];

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Experience</h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Timeline items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 border-4 border-white dark:border-gray-900 z-10"></div>
                
                {/* Content */}
                <div className="md:w-1/2 p-6">
                  <div className={`bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-transform hover:scale-105 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <div className="flex items-center mb-4">
                      <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        {exp.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{exp.description}</p>
                    <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                      {exp.period}
                    </div>
                  </div>
                </div>
                
                {/* Empty div for layout on mobile */}
                <div className="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;