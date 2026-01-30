export const personalInfo = {
  name: "Your Name",
  title: "Software Engineer",
  tagline: "Building pixel-perfect experiences",
  email: "your.email@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  location: "Vietnam",
}

export const aboutMe = {
  intro: "Hey there! I'm a passionate software engineer who loves turning ideas into reality through code.",
  description: `
    With a love for clean code and creative problem-solving, I specialize in building 
    modern web applications that are both beautiful and functional. When I'm not coding, 
    you'll find me exploring new technologies, gaming, or contributing to open source.
  `,
  highlights: [
    "🚀 3+ years of experience in web development",
    "💡 Passionate about UI/UX and user experience",
    "🎮 Love creating interactive and engaging experiences",
    "🌱 Always learning and growing",
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
