export const personalInfo = {
  name: "Le Trong Nghia",
  title: "IT Student at HUFLIT",
  tagline: "Future Software Developer passionate about web development",
  email: "ltn66441@gmail.com",
  github: "https://github.com/YouAreMyHome",
  linkedin: "https://www.linkedin.com/in/youaremyhome/",
  website: "https://letrongnghia.me",
  location: "TP. Hồ Chí Minh, Việt Nam 🇻🇳",
}

export const aboutMe = {
  intro: "Xin chào! Mình là Nghĩa - sinh viên IT tại HUFLIT với đam mê phát triển web.",
  description: `
    Lập trình viên phần mềm tương lai chuyên về phát triển web với niềm đam mê 
    tạo ra các ứng dụng hiệu quả, thân thiện với người dùng. Mình luôn tìm kiếm 
    cơ hội để học hỏi công nghệ mới và xây dựng những sản phẩm có giá trị.
  `,
  highlights: [
    "🎓 Sinh viên CNTT tại HUFLIT (2022 - 2026)",
    "💻 Đam mê Full-stack Development",
    "🎮 Thích tạo ra những trải nghiệm tương tác",
    "🌱 Luôn học hỏi và phát triển",
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
    { name: "GraphQL", level: 70 },
  ],
  tools: [
    { name: "Git", level: 90 },
    { name: "Docker", level: 75 },
    { name: "AWS", level: 70 },
    { name: "Figma", level: 65 },
    { name: "VS Code", level: 95 },
  ],
}

export const projects = [
  {
    id: 1,
    title: "SHN Gear - E-commerce Platform",
    description: "Nền tảng thương mại điện tử hiện đại cho thiết bị gaming với tính năng quản lý đơn hàng và thanh toán tích hợp.",
    fullDescription: "SHN Gear là một nền tảng thương mại điện tử toàn diện được thiết kế đặc biệt cho cộng đồng gaming. Hệ thống được xây dựng với kiến trúc hiện đại, đảm bảo hiệu suất cao và khả năng mở rộng.",
    image: "/assets/img/project1.png",
    tags: ["React", "Node.js", "MongoDB", "Stripe API", "Tailwind CSS"],
    features: [
      "Hệ thống xác thực người dùng an toàn với JWT",
      "Quản lý sản phẩm với hình ảnh và mô tả chi tiết",
      "Giỏ hàng và quy trình thanh toán tối ưu",
      "Tích hợp thanh toán trực tuyến với Stripe",
      "Dashboard quản trị viên cho quản lý đơn hàng",
      "Responsive design cho mọi thiết bị"
    ],
    role: "Full-stack Developer",
    team: "3 thành viên",
    duration: "4 tháng",
    github: "https://github.com/Waito3007/SHNGear.git",
    demo: "https://shn-gear.vercel.app",
    featured: true,
  },
  {
    id: 2,
    title: "Hotel Booking Management System",
    description: "Hệ thống quản lý đặt phòng khách sạn với Node.js, React và MongoDB, hỗ trợ đầy đủ chức năng cho khách hàng và quản trị viên.",
    fullDescription: "Hệ thống quản lý đặt phòng khách sạn toàn diện được phát triển bởi đội ngũ sinh viên HUFLIT. Dự án tích hợp đầy đủ các tính năng từ quản lý khách sạn, đặt phòng đến xử lý thanh toán.",
    image: "/assets/img/project2.png",
    tags: ["Node.js", "React", "MongoDB", "Ant Design", "JWT"],
    features: [
      "Hệ thống xác thực và phân quyền theo vai trò",
      "Quản lý khách sạn và phòng toàn diện",
      "Tính năng đặt phòng và xử lý thanh toán",
      "Giao diện responsive với React và Ant Design",
      "Upload hình ảnh thông qua Cloudinary API",
      "Dashboard quản trị toàn diện"
    ],
    role: "Full-stack Developer",
    team: "2 thành viên - Sang Vu & Nghia Le (HUFLIT)",
    duration: "3 tháng",
    github: "https://github.com/Waito3007/WEB-DAT-PHONG.git",
    demo: "https://web-dat-phong.vercel.app",
    featured: true,
  },
  {
    id: 3,
    title: "Personal Portfolio Website",
    description: "Website portfolio cá nhân hiện đại với thiết kế responsive và hiệu ứng animation mượt mà.",
    fullDescription: "Website portfolio cá nhân được xây dựng với React, tích hợp các hiệu ứng animation mượt mà và tối ưu hóa hiệu suất. Website giới thiệu bản thân, các dự án đã thực hiện và kỹ năng lập trình.",
    image: "/assets/img/project3.png",
    tags: ["React", "Tailwind CSS", "Framer Motion", "Vercel"],
    features: [
      "Thiết kế responsive hoàn toàn",
      "Hiệu ứng animation mượt mà",
      "Form liên hệ tích hợp email",
      "Tối ưu hóa SEO",
      "Dark/Light mode",
      "Multi-language support"
    ],
    role: "Solo Developer",
    team: "1 thành viên - Solo project",
    duration: "2 tháng",
    github: "https://github.com/Waito3007/KLTN04.git",
    demo: "https://letrongnghia.me",
    featured: true,
  },
  {
    id: 4,
    title: "3D Portfolio Room",
    description: "Interactive 3D portfolio website built with Three.js and React Three Fiber",
    fullDescription: "An immersive 3D room experience showcasing personal portfolio with interactive elements, day/night mode, and pixel art aesthetics.",
    image: "/assets/img/project4.png",
    tags: ["React", "Three.js", "React Three Fiber", "Zustand"],
    features: [
      "Interactive 3D room environment",
      "Day/Night mode toggle",
      "Clickable objects with panels",
      "Pixel art aesthetic",
      "Music player integration",
      "Responsive design"
    ],
    role: "Solo Developer",
    team: "1 thành viên",
    duration: "Completed",
    github: "https://github.com/Waito3007/portfolio",
    demo: "https://nghia-room.vercel.app",
    featured: false,
  },
]

export const experience = [
  {
    id: 1,
    company: "Freelance",
    position: "Full Stack Developer",
    duration: "2023 - Hiện tại",
    description: "Phát triển các dự án web cho khách hàng",
    highlights: [
      "Xây dựng nền tảng e-commerce SHN Gear",
      "Phát triển hệ thống đặt phòng khách sạn",
      "Thiết kế và triển khai portfolio websites",
    ],
  },
  {
    id: 2,
    company: "HUFLIT",
    position: "Sinh viên CNTT",
    duration: "2022 - 2026",
    description: "Học tập và nghiên cứu công nghệ thông tin",
    highlights: [
      "Đạt giải Ba cuộc thi lập trình web cấp trường",
      "Tham gia các dự án nhóm",
      "GPA: 3.2+",
    ],
  },
]

export const awards = [
  {
    id: 1,
    title: "Intermediate SQL Server",
    organization: "DataCamp",
    year: "2024",
    description: "Hoàn thành khóa học Intermediate SQL Server (4 giờ) - Nov 2024",
  },
  {
    id: 2,
    title: "Joining Data in SQL",
    organization: "DataCamp",
    year: "2024",
    description: "Hoàn thành khóa học Joining Data in SQL (4 giờ) - Nov 2024",
  },
  {
    id: 3,
    title: "Intermediate SQL",
    organization: "DataCamp",
    year: "2024",
    description: "Hoàn thành khóa học Intermediate SQL (4 giờ) - Sep 2024",
  },
]

export const education = [
  {
    id: 1,
    school: "Đại học Ngoại Ngữ-Tin Học TP.Hồ Chí Minh (HUFLIT)",
    degree: "Cử nhân Công nghệ Thông tin",
    duration: "2022 - 2026",
    description: "Chuyên ngành Công nghệ phần mềm, tập trung vào phát triển web",
    status: "Đang theo học",
    gpa: "3.22",
  },
]
