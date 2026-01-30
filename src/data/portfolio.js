export const personalInfo = {
  name: "Nghia",
  title: "Software Engineer",
  tagline: "Building pixel-perfect experiences",
  email: "nghia@example.com",
  github: "https://github.com/nghia",
  linkedin: "https://linkedin.com/in/nghia",
  location: "Vietnam 🇻🇳",
}

export const aboutMe = {
  intro: "Xin chào! Mình là Nghia - một lập trình viên đam mê biến ý tưởng thành sản phẩm thực tế.",
  description: `
    Với niềm yêu thích code sạch và giải quyết vấn đề sáng tạo, mình chuyên xây dựng 
    các ứng dụng web hiện đại, đẹp mắt và hiệu quả. Khi không code, bạn sẽ thấy mình 
    đang khám phá công nghệ mới, chơi game, hoặc đóng góp cho open source.
  `,
  highlights: [
    "🚀 3+ năm kinh nghiệm phát triển web",
    "💡 Đam mê UI/UX và trải nghiệm người dùng",
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
    title: "3D Portfolio Room",
    description: "An interactive 3D portfolio website built with Three.js and React",
    image: "/assets/img/project1.png",
    tags: ["React", "Three.js", "WebGL"],
    github: "https://github.com/yourusername/portfolio",
    demo: "https://yourportfolio.com",
    featured: true,
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    image: "/assets/img/project2.png",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    github: "https://github.com/yourusername/ecommerce",
    demo: "https://demo.com",
    featured: true,
  },
  {
    id: 3,
    title: "Task Management App",
    description: "Collaborative task management with real-time updates",
    image: "/assets/img/project3.png",
    tags: ["React", "Socket.io", "MongoDB"],
    github: "https://github.com/yourusername/taskapp",
    demo: "https://taskapp.com",
    featured: false,
  },
  {
    id: 4,
    title: "AI Chat Bot",
    description: "Intelligent chatbot powered by machine learning",
    image: "/assets/img/project4.png",
    tags: ["Python", "TensorFlow", "FastAPI"],
    github: "https://github.com/yourusername/chatbot",
    demo: "https://chatbot.com",
    featured: false,
  },
]

export const experience = [
  {
    id: 1,
    company: "Tech Company",
    position: "Senior Software Engineer",
    duration: "2023 - Present",
    description: "Leading frontend development for major products",
    highlights: [
      "Led team of 5 developers",
      "Improved performance by 40%",
      "Implemented CI/CD pipeline",
    ],
  },
  {
    id: 2,
    company: "Startup Inc",
    position: "Full Stack Developer",
    duration: "2021 - 2023",
    description: "Built features from scratch for growing startup",
    highlights: [
      "Developed core features",
      "Mentored junior developers",
      "Reduced load time by 60%",
    ],
  },
]

export const education = [
  {
    id: 1,
    school: "University of Technology",
    degree: "Bachelor of Computer Science",
    duration: "2017 - 2021",
    description: "Focus on software engineering and web development",
  },
]
