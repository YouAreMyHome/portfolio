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
    description: 'Explore the projects I have built with comprehensive features and modern technologies',
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
    viewCode: 'View Source Code',
    liveDemo: 'Live Demo',
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
        duration: '4 months',        challenges: [
          'Performance optimization with large product catalog',
          'Ensuring security in payment processing',
          'Designing intuitive UX/UI for gaming users',
          'Integrating complex payment APIs'
        ],
        githubUrl: 'https://github.com/Waito3007/SHNGear.git',
        demoUrl: 'https://shn-gear.vercel.app',
        images: [
          'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800',
          'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800'
        ]
      },      {
        id: 'hotel-booking',
        title: 'Hotel Booking Management System',
        shortDescription: 'Comprehensive hotel booking management system built with Node.js, React, and MongoDB, supporting full functionality for customers, hotel managers, and administrators.',
        description: 'A comprehensive hotel booking management system developed by HUFLIT university students. The project integrates complete features from hotel management, room booking to payment processing, with modern and responsive user interface built using React and Ant Design.',
        technologies: ['Node.js', 'React', 'MongoDB', 'Express', 'Ant Design', 'JWT', 'Cloudinary API'],
        features: [
          'User authentication and role-based access control (Customer, Hotel Manager, Admin)',
          'Comprehensive hotel and room management for managers',
          'Room booking and payment processing functionality for customers',
          'Responsive UI built with React and Ant Design',
          'Image uploading functionality via Cloudinary API',
          'Smart hotel and room search and filtering system',
          'Comprehensive admin dashboard',
          'Real-time platform activity monitoring'
        ],
        role: 'Full-stack Developer',
        team: '2 members - Sang Vu (HUFLIT student), Nghia Le (HUFLIT student)',
        duration: '3 months',
        challenges: [
          'Building complex role-based authorization system with 3 different roles',
          'Integrating Cloudinary API for image management',
          'Designing optimized MongoDB database for booking system',
          'Ensuring high security for payment system',
          'Performance optimization with large data volumes'
        ],
        githubUrl: 'https://github.com/Waito3007/WEB-DAT-PHONG.git',
        demoUrl: 'https://hotel-booking-management.vercel.app',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
        duration: '2 months',        challenges: [
          'Loading performance optimization',
          'Attractive UX/UI design',
          'Cross-browser compatibility'
        ],
        githubUrl: 'https://github.com/Waito3007/KLTN04.git',
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
    subtitle: 'Contact Information',
    description: 'Get in touch with me to discuss collaboration opportunities',
    form: {
      title: 'Send Message',
      name: 'Your Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      submit: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'An error occurred. Please try again.',
      configError: 'Email configuration is not set up correctly.',
      namePlaceholder: 'Enter your name...',
      emailPlaceholder: 'Enter your email address...',
      messagePlaceholder: 'Enter your message...'
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
