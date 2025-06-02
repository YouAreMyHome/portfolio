// src/translations/index.js
export const translations = {
  vi: {
    // Navigation
    nav: {
      home: 'Trang Chủ',
      education: 'Học Vấn', 
      awards: 'Giải Thưởng',
      projects: 'Dự Án',
      contact: 'Liên Hệ',
      funGame: 'Game Vui',
      urlShortener: 'Rút Gọn Link'
    },
    
    // Hero Section
    hero: {
      greeting: 'Xin chào, tôi là',
      title: 'Sinh viên IT tại HUFLIT',
      description: 'Lập trình viên phần mềm tương lai chuyên về phát triển web với niềm đam mê tạo ra các ứng dụng hiệu quả, thân thiện với người dùng.',
      contactBtn: 'Liên Hệ Ngay'
    },
    
    // Education Section
    education: {
      title: 'Học Vấn',
      university: 'Đại học Ngoại Ngữ-Tin Học TP.Hồ Chí Minh',
      degree: 'Cử nhân Công nghệ Thông tin',
      period: '2022 - 2026',
      gpa: 'GPA',
      status: 'Đang theo học',
      website: 'Trang web trường'
    },
    
    // Awards Section
    awards: {
      title: 'Giải Thưởng & Chứng Chỉ',
      items: [
        {
          title: 'Chứng Chỉ JavaScript',
          organization: 'FreeCodeCamp',
          year: '2024',
          description: 'Hoàn thành khóa học JavaScript Algorithms and Data Structures'
        },
        {
          title: 'Chứng Chỉ React Development',
          organization: 'Coursera',
          year: '2024',
          description: 'Chuyên ngành Frontend Development với React'
        },
        {
          title: 'Giải Ba Cuộc Thi Lập Trình',
          organization: 'HUFLIT',
          year: '2023',
          description: 'Cuộc thi lập trình sinh viên cấp trường'
        }
      ]
    },
    
    // Projects Section
    projects: {
      title: 'Dự Án Nổi Bật',
      viewCode: 'Xem Code',
      liveDemo: 'Demo Trực Tiếp',
      items: [
        {
          title: 'Portfolio Website',
          description: 'Website portfolio cá nhân được xây dựng với React và Tailwind CSS, tích hợp dark mode và responsive design.',
          technologies: ['React', 'Tailwind CSS', 'Vite']
        },
        {
          title: 'Task Management App',
          description: 'Ứng dụng quản lý công việc với các tính năng drag & drop, phân loại task theo priority.',
          technologies: ['React', 'Node.js', 'MongoDB']
        },
        {
          title: 'Weather Dashboard',
          description: 'Dashboard thời tiết hiển thị dữ liệu thời tiết thời gian thực với biểu đồ và maps tương tác.',
          technologies: ['Vue.js', 'Chart.js', 'Weather API']
        }
      ]
    },
      // Contact Section
    contact: {
      title: 'Liên Hệ',
      subtitle: 'Hãy kết nối với tôi',
      description: 'Tôi luôn sẵn sàng thảo luận về các cơ hội hợp tác mới và các dự án thú vị.',
      form: {
        title: 'Gửi tin nhắn cho tôi',
        name: 'Họ và Tên',
        email: 'Email',
        message: 'Tin Nhắn',
        namePlaceholder: 'Họ và tên đầy đủ',
        emailPlaceholder: 'email.cua.ban@example.com',
        messagePlaceholder: 'Hãy cho tôi biết làm thế nào tôi có thể giúp bạn...',
        submit: 'Gửi Tin Nhắn',
        sending: 'Đang gửi...',
        success: 'Tin nhắn đã được gửi thành công!',
        error: 'Không thể gửi tin nhắn. Vui lòng thử lại sau.',
        configError: 'Lỗi cấu hình. Không thể gửi tin nhắn.'
      },
      info: {
        email: 'Email',
        phone: 'Điện Thoại',
        location: 'Địa Điểm'
      }
    },
    
    // Clean URI Tool
    cleanUriTool: {
      title: 'Rút Gọn Liên Kết',
      description: 'Dán URL dài của bạn và nhận ngay một liên kết ngắn gọn, chuyên nghiệp.',
      placeholder: 'https://www.example.com/url-rat-dai-cua-ban...',
      inputLabel: 'URL gốc',
      clearLabel: 'Xóa nội dung',
      submitButton: 'Rút gọn ngay',
      processing: 'Đang xử lý...',
      successMessage: '🎉 Liên kết đã được rút gọn thành công!',
      copy: 'Sao chép',
      copied: 'Đã sao chép',
      copyLabel: 'Sao chép liên kết',
      copiedLabel: 'Đã sao chép!',
      errors: {
        emptyUrl: 'Vui lòng nhập URL bạn muốn rút gọn.',
        invalidUrl: 'URL không hợp lệ. Vui lòng kiểm tra lại.',
        serverError: 'Lỗi',
        unexpectedError: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
        copyError: 'Lỗi sao chép:'
      }
    },
    
    // JS Runner Game
    jsRunnerGame: {
      title: 'Cat Run!',
      instructions: 'Nhấn',
      or: 'hoặc',
      clickButton: 'Nhấn Nút',
      score: 'Điểm',
      startInstructions: 'Nhấn',
      toStart: 'để Bắt đầu',
      toRestart: 'để Chơi lại',
      gameOver: 'Kết thúc!',
      startGame: 'Bắt đầu Game',
      jump: 'Nhảy',
      jumpButton: 'Nhảy!',
      start: 'Bắt đầu',
      playAgain: 'Chơi lại',
      mobileTitle: 'Yêu cầu Desktop',
      mobileDescription: 'Game này được tối ưu cho trải nghiệm desktop. Vui lòng truy cập trang này trên trình duyệt PC hoặc laptop để có trải nghiệm chơi game tốt nhất!',
      mobileInstruction: '🎮 Sử dụng bàn phím để điều khiển nhảy',
      mobileDetected: 'Phát hiện Thiết bị Di động'
    }
  },
  
  en: {
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
      greeting: "Hi, I'm",
      title: 'IT Student at HUFLIT',
      description: 'Aspiring Software Developer specializing in web development with a passion for creating efficient, user-friendly applications.',
      contactBtn: 'Get In Touch'
    },
    
    // Education Section
    education: {
      title: 'Education',
      university: 'Ho Chi Minh City University of Foreign Languages-Information Technology',
      degree: 'Bachelor of Information Technology',
      period: '2022 - 2026',
      gpa: 'GPA',
      status: 'Currently Studying',
      website: 'University Website'
    },
    
    // Awards Section
    awards: {
      title: 'Awards & Certifications',
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
          description: 'Frontend Development Specialization with React'
        },
        {
          title: 'Third Prize Programming Contest',
          organization: 'HUFLIT',
          year: '2023',
          description: 'University-level student programming contest'
        }
      ]
    },
    
    // Projects Section
    projects: {
      title: 'Featured Projects',
      viewCode: 'View Code',
      liveDemo: 'Live Demo',
      items: [
        {
          title: 'Portfolio Website',
          description: 'Personal portfolio website built with React and Tailwind CSS, featuring dark mode and responsive design.',
          technologies: ['React', 'Tailwind CSS', 'Vite']
        },
        {
          title: 'Task Management App',
          description: 'Task management application with drag & drop features and priority-based task categorization.',
          technologies: ['React', 'Node.js', 'MongoDB']
        },
        {
          title: 'Weather Dashboard',
          description: 'Weather dashboard displaying real-time weather data with interactive charts and maps.',
          technologies: ['Vue.js', 'Chart.js', 'Weather API']
        }
      ]
    },
      // Contact Section
    contact: {
      title: 'Contact',
      subtitle: "Let's Connect",
      description: "I'm always open to discussing new opportunities and exciting projects.",
      form: {
        title: 'Send Me a Message',
        name: 'Full Name',
        email: 'Email',
        message: 'Message',
        namePlaceholder: 'Your Full Name',
        emailPlaceholder: 'your.email@example.com',
        messagePlaceholder: 'Tell me how I can help you...',
        submit: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again later.',
        configError: 'Configuration error. Could not send message.'
      },
      info: {
        email: 'Email',
        phone: 'Phone',
        location: 'Location'
      }
    },
    
    // Clean URI Tool
    cleanUriTool: {
      title: 'URL Shortener',
      description: 'Paste your long URL and get a short, professional link instantly.',
      placeholder: 'https://www.example.com/your-very-long-url...',
      inputLabel: 'Original URL',
      clearLabel: 'Clear content',
      submitButton: 'Shorten Now',
      processing: 'Processing...',
      successMessage: '🎉 Link shortened successfully!',
      copy: 'Copy',
      copied: 'Copied',
      copyLabel: 'Copy link',
      copiedLabel: 'Copied!',
      errors: {
        emptyUrl: 'Please enter the URL you want to shorten.',
        invalidUrl: 'Invalid URL. Please check again.',
        serverError: 'Error',
        unexpectedError: 'An unexpected error occurred. Please try again.',
        copyError: 'Copy error:'
      }
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
      toRestart: 'to Restart',
      gameOver: 'Game Over!',
      startGame: 'Start Game',
      jump: 'Jump',
      jumpButton: 'Jump!',
      start: 'Start',
      playAgain: 'Play Again',
      mobileTitle: 'Desktop Required',
      mobileDescription: 'This game is optimized for desktop experience. Please visit this page on a PC or laptop browser for the best gaming experience!',
      mobileInstruction: '🎮 Use keyboard controls for jumping',
      mobileDetected: 'Mobile Detected'
    }
  }
};

export const getTranslation = (language, key) => {
  const keys = key.split('.');
  let translation = translations[language];
  
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      return key; // Fallback to key if translation not found
    }
  }
  
  return translation;
};
