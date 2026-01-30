export const vietnameseTranslations = {
  // Navigation
  nav: {
    home: 'Trang Chủ',
    education: 'Học Vấn', 
    awards: 'Giải Thưởng',
    projects: 'Dự Án',
    contact: 'Liên Hệ',
  funGame: 'Game Vui',
  back: 'Quay Lại',
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
        description: 'Đạt giải ba trong cuộc thi lập trình web cấp trường'
      }
    ]
  },
    // Projects Section
  projects: {
    title: 'Dự Án Của Tôi',
    description: 'Khám phá các dự án tôi đã thực hiện với đầy đủ tính năng và công nghệ hiện đại',
    viewDetails: 'Xem Chi Tiết',
    backToProjects: 'Trở Về Dự Án',
    projectOverview: 'Tổng Quan Dự Án',
    keyFeatures: 'Tính Năng Chính',
    technologiesUsed: 'Công Nghệ Sử Dụng',
    projectTeam: 'Đội Ngũ Dự Án',
    projectDuration: 'Thời Gian Thực Hiện',
    projectRole: 'Vai Trò',
    challenges: 'Thử Thách',
    github: 'Mã Nguồn',
    demo: 'Xem Demo',
    viewCode: 'Xem Mã Nguồn',
    liveDemo: 'Demo Trực Tiếp',
    items: [
      {
        id: 'shn-gear',
        title: 'SHN Gear - E-commerce Platform',
        shortDescription: 'Nền tảng thương mại điện tử hiện đại cho thiết bị gaming với tính năng quản lý đơn hàng và thanh toán tích hợp.',
        description: 'SHN Gear là một nền tảng thương mại điện tử toàn diện được thiết kế đặc biệt cho cộng đồng gaming. Dự án này tập trung vào việc cung cấp trải nghiệm mua sắm mượt mà cho các sản phẩm gaming như chuột, bàn phím, tai nghe và các phụ kiện khác. Hệ thống được xây dựng với kiến trúc hiện đại, đảm bảo hiệu suất cao và khả năng mở rộng.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT', 'Tailwind CSS', 'Cloudinary'],
        features: [
          'Hệ thống xác thực người dùng an toàn với JWT',
          'Quản lý sản phẩm với hình ảnh và mô tả chi tiết',
          'Giỏ hàng và quy trình thanh toán tối ưu',
          'Tích hợp thanh toán trực tuyến với Stripe',
          'Dashboard quản trị viên cho quản lý đơn hàng',
          'Hệ thống đánh giá và nhận xét sản phẩm',
          'Tìm kiếm và lọc sản phẩm thông minh',
          'Responsive design cho mọi thiết bị'
        ],
        role: 'Full-stack Developer',
        team: '3 thành viên - 1 Backend Developer, 1 Frontend Developer, 1 UI/UX Designer',
        duration: '4 tháng',        challenges: [
          'Tối ưu hóa hiệu suất với lượng lớn sản phẩm',
          'Đảm bảo bảo mật trong xử lý thanh toán',
          'Thiết kế UX/UI trực quan cho người dùng gaming',
          'Tích hợp các API thanh toán phức tạp'
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
        shortDescription: 'Hệ thống quản lý đặt phòng khách sạn được xây dựng với Node.js, React và MongoDB, hỗ trợ đầy đủ chức năng cho khách hàng, quản lý khách sạn và quản trị viên.',
        description: 'Hệ thống quản lý đặt phòng khách sạn toàn diện được phát triển bởi đội ngũ sinh viên HUFLIT. Dự án tích hợp đầy đủ các tính năng từ quản lý khách sạn, đặt phòng đến xử lý thanh toán, với giao diện người dùng hiện đại và responsive được xây dựng bằng React và Ant Design.',
        technologies: ['Node.js', 'React', 'MongoDB', 'Express', 'Ant Design', 'JWT', 'Cloudinary API'],
        features: [
          'Hệ thống xác thực và phân quyền theo vai trò (Khách hàng, Quản lý khách sạn, Admin)',
          'Quản lý khách sạn và phòng toàn diện cho quản lý viên',
          'Tính năng đặt phòng và xử lý thanh toán cho khách hàng',
          'Giao diện responsive được xây dựng với React và Ant Design',
          'Tính năng upload hình ảnh thông qua Cloudinary API',
          'Hệ thống tìm kiếm và lọc khách sạn, phòng thông minh',
          'Dashboard quản trị toàn diện',
          'Giám sát hoạt động nền tảng realtime'
        ],
        role: 'Full-stack Developer',
        team: '2 thành viên - Sang Vu (sinh viên HUFLIT), Nghia Le (sinh viên HUFLIT)',
        duration: '3 tháng',
        challenges: [
          'Xây dựng hệ thống phân quyền phức tạp với 3 vai trò khác nhau',
          'Tích hợp Cloudinary API cho việc quản lý hình ảnh',
          'Thiết kế database MongoDB tối ưu cho hệ thống booking',
          'Đảm bảo bảo mật cao cho hệ thống thanh toán',
          'Tối ưu hóa hiệu suất với khối lượng dữ liệu lớn'
        ],
        githubUrl: 'https://github.com/Waito3007/WEB-DAT-PHONG.git',
        demoUrl: 'https://web-dat-phong.vercel.app',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 'portfolio-website',
        title: 'Personal Portfolio Website',
        shortDescription: 'Website portfolio cá nhân được xây dựng với React, giới thiệu các dự án và kỹ năng của tôi.',
        description: 'Website portfolio cá nhân hiện đại với thiết kế responsive, tích hợp các hiệu ứng animation mượt mà và tối ưu hóa hiệu suất. Website được xây dựng để giới thiệu bản thân, các dự án đã thực hiện và kỹ năng lập trình.',
        technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'EmailJS'],
        features: [
          'Thiết kế responsive hoàn toàn',
          'Hiệu ứng animation mượt mà',
          'Form liên hệ tích hợp email',
          'Tối ưu hóa SEO',
          'Dark/Light mode',
          'Multi-language support'
        ],
        role: 'Solo Developer',
        team: '1 thành viên - Solo project',
        duration: '2 tháng',        challenges: [
          'Tối ưu hóa hiệu suất loading',
          'Thiết kế UX/UI thu hút',
          'Tương thích cross-browser'
        ],
        githubUrl: 'https://github.com/Waito3007/KLTN04.git',
        demoUrl: 'https://letrongnghia.me',
        images: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
        ]
      }
    ]
  },
    // Contact Section
  contact: {
    title: 'Liên Hệ',
    subtitle: 'Thông tin liên hệ',
    description: 'Hãy liên hệ với tôi để thảo luận về các cơ hội hợp tác',
    form: {
      title: 'Gửi tin nhắn',
      name: 'Tên của bạn',
      email: 'Email',
      subject: 'Chủ đề',
      message: 'Tin nhắn',
      send: 'Gửi Tin Nhắn',
      submit: 'Gửi Tin Nhắn',
      sending: 'Đang gửi...',
      success: 'Tin nhắn đã được gửi thành công!',
      error: 'Có lỗi xảy ra. Vui lòng thử lại.',
      configError: 'Cấu hình email chưa được thiết lập đúng.',
      namePlaceholder: 'Nhập tên của bạn...',
      emailPlaceholder: 'Nhập địa chỉ email của bạn...',
      messagePlaceholder: 'Nhập tin nhắn của bạn...'
    },
    info: {
      email: 'letrongnghia2806@gmail.com',
      phone: '+84 123 456 789',
      location: 'TP. Hồ Chí Minh, Việt Nam'
    }
  },
  
  // Clean URI Tool
  cleanUriTool: {
    title: 'Clean URI Tool',
    description: 'Loại bỏ tracking parameters và làm sạch URL',
    inputPlaceholder: 'Nhập URL cần làm sạch...',
    cleanButton: 'Làm Sạch URL',
    copyButton: 'Sao Chép',
    resetButton: 'Đặt Lại',
    resultLabel: 'URL đã làm sạch:',
    copied: 'Đã sao chép!',
    invalidUrl: 'URL không hợp lệ',
    noParamsRemoved: 'Không có tham số nào được loại bỏ',
    paramsRemoved: 'tham số đã được loại bỏ'
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
};
