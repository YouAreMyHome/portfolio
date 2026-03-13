import { IMAGES } from './images'

export const personalInfo = {
  name: "Le Trong Nghia",
  title: "IT Student at HUFLIT",
  titleEn: "IT Student at HUFLIT",
  tagline: "Full-stack Developer • Three.js • React • Node.js",
  taglineEn: "Full-stack Developer • Three.js • React • Node.js",
  email: "ltn66441@gmail.com",
  github: "https://github.com/YouAreMyHome",
  linkedin: "https://www.linkedin.com/in/youaremyhome/",
  website: "https://letrongnghia.me",
  location: "TP. Hồ Chí Minh, Việt Nam 🇻🇳",
  locationEn: "Ho Chi Minh City, Vietnam 🇻🇳",
}

export const aboutMe = {
  intro: "Xin chào! Mình là Nghĩa - sinh viên IT tại HUFLIT với đam mê phát triển web.",
  introEn: "Hello! I'm Nghia - an IT student at HUFLIT passionate about web development.",
  description: `
    Lập trình viên phần mềm tương lai chuyên về phát triển web với niềm đam mê 
    tạo ra các ứng dụng hiệu quả, thân thiện với người dùng. Mình luôn tìm kiếm 
    cơ hội để học hỏi công nghệ mới và xây dựng những sản phẩm có giá trị.
  `,
  descriptionEn: `
    A future software developer specializing in web development with a passion for
    creating efficient, user-friendly applications. I'm always seeking opportunities
    to learn new technologies and build valuable products.
  `,
  highlights: [
    "Sinh viên CNTT tại HUFLIT (2022 - 2026)",
    "Đam mê Full-stack Development",
    "Thích tạo ra những trải nghiệm tương tác",
    "Luôn tìm tòi và học hỏi công nghệ mới",
  ],
  highlightsEn: [
    "IT Student at HUFLIT (2022 - 2026)",
    "Passionate about Full-stack Development",
    "Love creating interactive experiences",
    "Always exploring and learning new technologies",
  ],
}

export const skills = {
  frontend: [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Three.js", level: 75 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Next.js", level: 80 },
  ],
  backend: [
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "PostgreSQL", level: 75 },
    { name: "MongoDB", level: 70 },
    { name: ".NET", level: 80 },],
  tools: [
    { name: "Git", level: 90 },
    { name: "Docker", level: 50 },
    { name: "VS Code", level: 95 },
  ],
}

export const projects = [
  {
    id: 1,
    title: "SHN Gear - E-commerce Platform",
    description: "Nền tảng thương mại điện tử hiện đại cho thiết bị gaming với tính năng quản lý đơn hàng và thanh toán tích hợp.",
    descriptionEn: "Modern e-commerce platform for gaming equipment with order management and integrated payment features.",
    fullDescription: "SHN Gear là một nền tảng thương mại điện tử toàn diện được thiết kế đặc biệt cho cộng đồng gaming. Hệ thống được xây dựng với kiến trúc hiện đại, đảm bảo hiệu suất cao và khả năng mở rộng.",
    fullDescriptionEn: "SHN Gear is a comprehensive e-commerce platform designed specifically for the gaming community. Built with modern architecture ensuring high performance and scalability.",
    image: IMAGES.project1,
    tags: ["React", "Node.js", "MongoDB", "Stripe API", "Tailwind CSS"],
    features: [
      "Hệ thống xác thực người dùng an toàn với JWT",
      "Quản lý sản phẩm với hình ảnh và mô tả chi tiết",
      "Giỏ hàng và quy trình thanh toán tối ưu",
      "Tích hợp thanh toán trực tuyến với Stripe",
      "Dashboard quản trị viên cho quản lý đơn hàng",
      "Responsive design cho mọi thiết bị"
    ],
    featuresEn: [
      "Secure user authentication with JWT",
      "Product management with images and detailed descriptions",
      "Optimized shopping cart and checkout flow",
      "Online payment integration with Stripe",
      "Admin dashboard for order management",
      "Responsive design for all devices"
    ],
    role: "Full-stack Developer",
    team: "3 thành viên",
    teamEn: "3 members",
    duration: "4 tháng",
    durationEn: "4 months",
    github: "https://github.com/Waito3007/SHNGear.git",
    demo: "https://github.com/Waito3007/SHNGear.git",
    featured: true,
  },
  {
    id: 2,
    title: "Hotel Booking Management System",
    description: "Hệ thống quản lý đặt phòng khách sạn với Node.js, React và MongoDB, hỗ trợ đầy đủ chức năng cho khách hàng và quản trị viên.",
    descriptionEn: "Hotel booking management system with Node.js, React and MongoDB, supporting full functionality for customers and administrators.",
    fullDescription: "Hệ thống quản lý đặt phòng khách sạn toàn diện được phát triển bởi đội ngũ sinh viên HUFLIT. Dự án tích hợp đầy đủ các tính năng từ quản lý khách sạn, đặt phòng đến xử lý thanh toán.",
    fullDescriptionEn: "Comprehensive hotel booking management system developed by a HUFLIT student team. The project integrates full features from hotel management and booking to payment processing.",
    image: IMAGES.project2,
    tags: ["Node.js", "React", "MongoDB", "Ant Design", "JWT"],
    features: [
      "Hệ thống xác thực và phân quyền theo vai trò",
      "Quản lý khách sạn và phòng toàn diện",
      "Tính năng đặt phòng và xử lý thanh toán",
      "Giao diện responsive với React và Ant Design",
      "Upload hình ảnh thông qua Cloudinary API",
      "Dashboard quản trị toàn diện"
    ],
    featuresEn: [
      "Role-based authentication and authorization",
      "Comprehensive hotel and room management",
      "Booking and payment processing",
      "Responsive interface with React and Ant Design",
      "Image upload via Cloudinary API",
      "Comprehensive admin dashboard"
    ],
    role: "Full-stack Developer",
    team: "2 thành viên - Sang Vu & Nghia Le (HUFLIT)",
    teamEn: "2 members - Sang Vu & Nghia Le (HUFLIT)",
    duration: "3 tháng",
    durationEn: "3 months",
    github: "https://github.com/Waito3007/WEB-DAT-PHONG.git",
    demo: "https://github.com/Waito3007/WEB-DAT-PHONG.git",
    featured: true,
  },
  {
    id: 3,
    title: "Personal Portfolio Website",
    description: "Website portfolio cá nhân hiện đại với thiết kế responsive và hiệu ứng animation mượt mà.",
    descriptionEn: "Modern personal portfolio website with responsive design and smooth animation effects.",
    fullDescription: "Website portfolio cá nhân được xây dựng với React, tích hợp các hiệu ứng animation mượt mà và tối ưu hóa hiệu suất. Website giới thiệu bản thân, các dự án đã thực hiện và kỹ năng lập trình.",
    fullDescriptionEn: "Personal portfolio website built with React, featuring smooth animation effects and performance optimization. Showcases personal info, completed projects, and programming skills.",
    image: IMAGES.project3,
    tags: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    features: [
      "Thiết kế responsive hoàn toàn",
      "Hiệu ứng animation mượt mà",
      "Form liên hệ tích hợp email",
      "Tối ưu hóa SEO",
      "Dark/Light mode",
      "Multi-language support"
    ],
    featuresEn: [
      "Fully responsive design",
      "Smooth animation effects",
      "Integrated email contact form",
      "SEO optimization",
      "Dark/Light mode",
      "Multi-language support"
    ],
    role: "Solo Developer",
    team: "1 thành viên - Solo project",
    teamEn: "1 member - Solo project",
    duration: "2 tháng",
    durationEn: "2 months",
    github: "https://github.com/YouAreMyHome/portfolio-Khai.git",
    demo: "https://portfolio-khai-eight.vercel.app",
    featured: true,
  },
  {
    id: 4,
    title: "3D Portfolio Room",
    description: "Website portfolio tương tác 3D isometric xây dựng với React Three Fiber, Zustand và các mini-game retro arcade.",
    descriptionEn: "Interactive 3D isometric portfolio website built with React Three Fiber, Zustand and retro arcade mini-games.",
    fullDescription: "Portfolio cá nhân dạng phòng 3D isometric đầy đủ tính năng: day/night mode, 4 mini-games (Snake, Pong, Dino, Tetris), Music Player, Kanban Board, Gallery Polaroid và Contact Form với EmailJS.",
    fullDescriptionEn: "Full-featured 3D isometric portfolio room: day/night mode, 4 mini-games (Snake, Pong, Dino, Tetris), Music Player, Kanban Board, Polaroid Gallery and Contact Form with EmailJS.",
    image: IMAGES.project4,
    tags: ["React", "Three.js", "React Three Fiber", "Zustand"],
    features: [
      "Interactive 3D room environment",
      "Day/Night mode toggle",
      "Clickable objects with panels",
      "Pixel art aesthetic",
      "Music player integration",
      "Responsive design"
    ],
    featuresEn: [
      "Interactive 3D room environment",
      "Day/Night mode toggle",
      "Clickable objects with panels",
      "Pixel art aesthetic",
      "Music player integration",
      "Responsive design"
    ],
    role: "Solo Developer",
    team: "1 thành viên",
    teamEn: "1 member",
    duration: "Đang phát triển",
    durationEn: "In development",
    github: "https://github.com/YouAreMyHome/portfolio-1",
    demo: "https://letrongnghia.me",
    featured: true,
  },
]

export const experience = [
  {
    id: 1,
    company: "Freelance",
    position: "Full Stack Developer",
    positionEn: "Full Stack Developer",
    duration: "2023 - Hiện tại",
    durationEn: "2023 - Present",
    description: "Phát triển các dự án web cho khách hàng",
    descriptionEn: "Developing web projects for clients",
    highlights: [
      "Xây dựng nền tảng e-commerce SHN Gear",
      "Phát triển hệ thống đặt phòng khách sạn",
      "Thiết kế và triển khai portfolio websites",
    ],
    highlightsEn: [
      "Built e-commerce platform SHN Gear",
      "Developed hotel booking system",
      "Designed and deployed portfolio websites",
    ],
  },
  {
    id: 2,
    company: "HUFLIT",
    position: "Sinh viên CNTT",
    positionEn: "IT Student",
    duration: "2022 - 2026",
    durationEn: "2022 - 2026",
    description: "Học tập và nghiên cứu công nghệ thông tin",
    descriptionEn: "Studying and researching information technology",
    highlights: [
      "GPA: 3.2+",
    ],
    highlightsEn: [
      "GPA: 3.2+",
    ],
  },
]

export const awards = [
  {
    id: 1,
    title: "Intermediate SQL Server",
    organization: "DataCamp",
    year: "2025",
    description: "Hoàn thành khóa học Intermediate SQL Server (4 giờ) - Nov 2025",
  },
  {
    id: 2,
    title: "Joining Data in SQL",
    organization: "DataCamp",
    year: "2025",
    description: "Hoàn thành khóa học Joining Data in SQL (4 giờ) - Nov 2025",
  },
  {
    id: 3,
    title: "Intermediate SQL",
    organization: "DataCamp",
    year: "2025",
    description: "Hoàn thành khóa học Intermediate SQL (4 giờ) - Sep 2025",
  },
]

export const education = [
  {
    id: 1,
    school: "Đại học Ngoại Ngữ-Tin Học TP.Hồ Chí Minh (HUFLIT)",
    schoolEn: "Ho Chi Minh City University of Foreign Languages and Information Technology (HUFLIT)",
    degree: "Cử nhân Công nghệ Thông tin",
    degreeEn: "Bachelor of Information Technology",
    duration: "2022 - 2026",
    description: "Chuyên ngành Công nghệ phần mềm, tập trung vào phát triển web",
    descriptionEn: "Software Engineering major, focusing on web development",
    status: "Đang theo học",
    statusEn: "Currently enrolled",
    gpa: "3.22",
  },
]


// books đã được tách sang src/data/books.js
// Re-export để backward compatibility với các import cũ
export { books } from './books'
