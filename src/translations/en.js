export const englishTranslations = {
  // Navigation
  nav: {
    home: 'Home',
    education: 'Education',
    awards: 'Awards',
    projects: 'Projects',
    contact: 'Contact',
    funGame: 'Fun Game',
    urlShortener: 'URL Shortener'
  },
  
  // Hero Section
  hero: {
    greeting: 'Hello, I am',
    title: 'IT Student at HUFLIT',
    description: 'Future software developer specializing in web development with a passion for creating efficient, user-friendly applications.',
    contactBtn: 'Contact Me'
  },
  
  // Education Section
  education: {
    title: 'Education',
    university: 'Ho Chi Minh City University of Foreign Languages and Information Technology',
    degree: 'Bachelor of Information Technology',
    period: '2022 - 2026',
    gpa: 'GPA',
    status: 'Currently enrolled',
    website: 'University website'
  },
  
  // Awards Section
  awards: {
    title: 'Awards & Certificates',
    items: [
      {
        title: 'JavaScript Certificate',
        organization: 'FreeCodeCamp',
        year: '2024',
        description: 'Completed JavaScript Algorithms and Data Structures course'
      },
      {
        title: 'React Development Certificate',
        organization: 'Coursera',
        year: '2024',
        description: 'Specialized in Frontend Development with React'
      },
      {
        title: 'Third Prize Programming Contest',
        organization: 'HUFLIT',
        year: '2023',
        description: 'Achieved third place in university-level web programming contest'
      }
    ]
  },
  
  // Projects Section
  projects: {
    title: 'My Projects',
    description: 'Explore the projects I have worked on',
    viewDetails: 'View Details',
    backToProjects: 'Back to Projects',
    projectOverview: 'Project Overview',
    keyFeatures: 'Key Features',
    technologiesUsed: 'Technologies Used',
    projectTeam: 'Project Team',
    projectDuration: 'Duration',
    projectRole: 'My Role',
    challenges: 'Challenges',
    github: 'Source Code',
    demo: 'Live Demo',
    items: [
      {
        id: 'shn-gear',
        title: 'SHN Gear - E-commerce Platform',
        shortDescription: 'Modern e-commerce platform for gaming gear with integrated order management and payment processing.',
        description: 'SHN Gear is a comprehensive e-commerce platform specifically designed for the gaming community. This project focuses on providing a seamless shopping experience for gaming products such as mice, keyboards, headsets, and other accessories. The system is built with modern architecture, ensuring high performance and scalability.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT', 'Tailwind CSS', 'Cloudinary'],
        features: [
          'Secure user authentication system with JWT',
          'Product management with detailed images and descriptions',
          'Optimized cart and checkout process',
          'Online payment integration with Stripe',
          'Admin dashboard for order management',
          'Product review and rating system',
          'Smart product search and filtering',
          'Responsive design for all devices'
        ],
        role: 'Full-stack Developer',
        team: '3 members - 1 Backend Developer, 1 Frontend Developer, 1 UI/UX Designer',
        duration: '4 months',
        challenges: [
          'Performance optimization with large product catalog',
          'Ensuring security in payment processing',
          'Designing intuitive UX/UI for gaming users',
          'Integrating complex payment APIs'
        ],
        githubUrl: 'https://github.com/letrongnghia/shn-gear',
        demoUrl: 'https://shn-gear.vercel.app',
        images: [
          'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800',
          'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800'
        ]
      },
      {
        id: 'task-manager',
        title: 'Task Management System',
        shortDescription: 'Intuitive task management application supporting team collaboration and progress tracking.',
        description: 'A task management system designed to help teams work more efficiently. The application provides features for task management, work assignment, progress tracking, and detailed reporting.',
        technologies: ['Vue.js', 'Firebase', 'Vuex', 'Bootstrap', 'Chart.js'],
        features: [
          'Create and manage projects',
          'Assign tasks to team members',
          'Real-time progress tracking',
          'Detailed reports and analytics',
          'Notification system',
          'Integrated team chat'
        ],
        role: 'Frontend Developer',
        team: '2 members - 1 Frontend Developer, 1 Backend Developer',
        duration: '3 months',
        challenges: [
          'Real-time data synchronization',
          'Multi-device interface optimization',
          'Complex access control handling'
        ],
        githubUrl: 'https://github.com/letrongnghia/task-manager',
        demoUrl: 'https://task-manager-demo.vercel.app',
        images: [
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800'
        ]
      },
      {
        id: 'portfolio-website',
        title: 'Personal Portfolio Website',
        shortDescription: 'Personal portfolio website built with React, showcasing my projects and skills.',
        description: 'Modern personal portfolio website with responsive design, smooth animation effects, and performance optimization. The website is built to showcase myself, completed projects, and programming skills.',
        technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'EmailJS'],
        features: [
          'Fully responsive design',
          'Smooth animation effects',
          'Integrated email contact form',
          'SEO optimization',
          'Dark/Light mode',
          'Multi-language support'
        ],
        role: 'Solo Developer',
        team: '1 member - Solo project',
        duration: '2 months',
        challenges: [
          'Loading performance optimization',
          'Attractive UX/UI design',
          'Cross-browser compatibility'
        ],
        githubUrl: 'https://github.com/letrongnghia/portfolio',
        demoUrl: 'https://letrongnghia.vercel.app',
        images: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
        ]
      }
    ]
  },
  
  // Contact Section
  contact: {
    title: 'Contact',
    description: 'Get in touch with me to discuss collaboration opportunities',
    form: {
      name: 'Your Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'An error occurred. Please try again.'
    },
    info: {
      email: 'letrongnghia2806@gmail.com',
      phone: '+84 123 456 789',
      location: 'Ho Chi Minh City, Vietnam'
    }
  },
  
  // Clean URI Tool
  cleanUriTool: {
    title: 'Clean URI Tool',
    description: 'Remove tracking parameters and clean URLs',
    inputPlaceholder: 'Enter URL to clean...',
    cleanButton: 'Clean URL',
    copyButton: 'Copy',
    resetButton: 'Reset',
    resultLabel: 'Cleaned URL:',
    copied: 'Copied!',
    invalidUrl: 'Invalid URL',
    noParamsRemoved: 'No parameters removed',
    paramsRemoved: 'parameters removed'
  },
  
  // JS Runner Game
  jsRunnerGame: {
    title: 'Cat Run!',
    instructions: 'Press',
    or: 'or',
    clickButton: 'Click Button',
    score: 'Score',
    startInstructions: 'Press',
    toStart: 'to Start',
    toRestart: 'to Play Again',
    gameOver: 'Game Over!',
    startGame: 'Start Game',
    jump: 'Jump',
    jumpButton: 'Jump!',
    start: 'Start',
    playAgain: 'Play Again',
    mobileTitle: 'Desktop Required',
    mobileDescription: 'This game is optimized for desktop experience. Please access this page on a PC or laptop browser for the best gaming experience!',
    mobileInstruction: '🎮 Use keyboard controls for jumping',
    mobileDetected: 'Mobile Detected'
  }
};
