/**
 * Portfolio OS - Configuration & Data
 * 
 * Central configuration for the retro OS experience
 */

import { personalInfo, aboutMe, skills, projects } from '../../data/portfolio'

// OS Theme
export const OS_THEME = {
  // Windows 95 inspired colors
  desktop: '#008080',  // Teal desktop
  taskbar: '#c0c0c0',  // Silver taskbar
  taskbarDark: '#808080',
  window: '#c0c0c0',
  windowTitle: '#000080',  // Navy title bar
  windowTitleText: '#ffffff',
  text: '#000000',
  textLight: '#808080',
  border3dLight: '#ffffff',
  border3dDark: '#808080',
  border3dDarker: '#404040',
  
  // Terminal colors
  terminalBg: '#0a0a0a',
  terminalText: '#00ff00',
  terminalCursor: '#00ff00',
  terminalError: '#ff4444',
  terminalInfo: '#00aaff',
  terminalWarning: '#ffaa00',
}

// Desktop Icons Configuration
export const DESKTOP_ICONS = [
  {
    id: 'my-computer',
    name: 'My Computer',
    icon: '▣',
    app: 'skills',
    position: { x: 20, y: 20 },
  },
  {
    id: 'my-projects',
    name: 'My Projects',
    icon: '□',
    app: 'projects',
    position: { x: 20, y: 100 },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '■',
    app: 'terminal',
    position: { x: 20, y: 180 },
  },
  {
    id: 'about-me',
    name: 'About Me.txt',
    icon: '≡',
    app: 'about',
    position: { x: 20, y: 260 },
  },
  {
    id: 'recycle-bin',
    name: 'Recycle Bin',
    icon: '✘',
    app: 'recycle',
    position: { x: 20, y: 340 },
  },
]

// Failed/Recycled Projects (Fun content)
export const RECYCLED_PROJECTS = [
  {
    id: 'rp1',
    name: 'TODO_app_final_v3_REAL.zip',
    reason: 'Bỏ vì phát hiện đã có 10000 app TODO khác rồi',
    reasonEn: 'Abandoned after discovering 10,000 other TODO apps already exist',
    date: '2023-06-15',
  },
  {
    id: 'rp2',
    name: 'blockchain_startup_idea.docx',
    reason: 'Hóa ra không phải mọi thứ đều cần blockchain',
    reasonEn: "Turns out not everything needs blockchain",
    date: '2023-04-20',
  },
  {
    id: 'rp3',
    name: 'ai_girlfriend_chatbot.py',
    reason: 'Không comment...',
    reasonEn: 'No comment...',
    date: '2023-03-01',
  },
  {
    id: 'rp4',
    name: 'facebook_clone_better.zip',
    reason: 'Nhận ra cần cả ngàn engineers để làm Facebook',
    reasonEn: 'Realized it takes thousands of engineers to build Facebook',
    date: '2022-12-10',
  },
  {
    id: 'rp5',
    name: 'crypto_trading_bot.js',
    reason: 'Lỗ 50$ sau 2 ngày test. RIP tiền...',
    reasonEn: 'Lost $50 after 2 days of testing. RIP money...',
    date: '2022-08-05',
  },
]

// Terminal Commands
export const TERMINAL_COMMANDS = {
  help: {
    description: 'Show available commands',
    execute: () => ({
      type: 'info',
      content: `
Available commands:
  help          - Show this help message
  whoami        - Display user information
  skills        - List technical skills
  projects      - List projects
  contact       - Show contact info
  education     - Show education history
  clear         - Clear terminal
  neofetch      - System info (cool style)
  cat <file>    - Read file contents
  ls            - List files
  pwd           - Print working directory
  echo <text>   - Echo text
  date          - Show current date
  fortune       - Get a random fortune
  cowsay <msg>  - Cow says something
  matrix        - Enter the matrix
  hack          - Hacker mode
`,
    }),
  },
  
  whoami: {
    description: 'Display user information',
    execute: () => ({
      type: 'success',
      content: `
┌─────────────────────────────────────┐
│           ${personalInfo.name}             │
├─────────────────────────────────────┤
│   ${personalInfo.title}
│   ${personalInfo.location}
│   ${personalInfo.tagline}
│ 
│ ${aboutMe.intro}
└─────────────────────────────────────┘
`,
    }),
  },
  
  skills: {
    description: 'List technical skills',
    execute: () => {
      let output = '\n=== TECHNICAL SKILLS ===\n\n'
      
      output += '[Frontend]\n'
      skills.frontend.forEach(s => {
        const bar = '█'.repeat(Math.floor(s.level / 10)) + '░'.repeat(10 - Math.floor(s.level / 10))
        output += `   ${s.name.padEnd(12)} [${bar}] ${s.level}%\n`
      })
      
      output += '\n[Backend]\n'
      skills.backend.forEach(s => {
        const bar = '█'.repeat(Math.floor(s.level / 10)) + '░'.repeat(10 - Math.floor(s.level / 10))
        output += `   ${s.name.padEnd(12)} [${bar}] ${s.level}%\n`
      })
      
      output += '\n[Tools]\n'
      skills.tools.forEach(s => {
        const bar = '█'.repeat(Math.floor(s.level / 10)) + '░'.repeat(10 - Math.floor(s.level / 10))
        output += `   ${s.name.padEnd(12)} [${bar}] ${s.level}%\n`
      })
      
      return { type: 'success', content: output }
    },
  },
  
  projects: {
    description: 'List projects',
    execute: () => {
      let output = '\n=== MY PROJECTS ===\n\n'
      projects.forEach((p, i) => {
        output += `${i + 1}. ${p.featured ? '[Featured] ' : ''}${p.title}\n`
        output += `   ${p.description.substring(0, 60)}...\n`
        output += `   Tags: ${p.tags.slice(0, 3).join(', ')}\n\n`
      })
      return { type: 'success', content: output }
    },
  },
  
  contact: {
    description: 'Show contact info',
    execute: () => ({
      type: 'info',
      content: `
=== CONTACT INFO ===

Email:    ${personalInfo.email}
GitHub:   ${personalInfo.github}
LinkedIn: ${personalInfo.linkedin}
Website:  ${personalInfo.website}
Location: ${personalInfo.location}
`,
    }),
  },
  
  clear: {
    description: 'Clear terminal',
    execute: () => ({ type: 'clear' }),
  },
  
  neofetch: {
    description: 'Display system info',
    execute: () => ({
      type: 'success',
      content: `
        ████████╗██╗  ██╗███████╗
        ╚══██╔══╝██║  ██║██╔════╝
           ██║   ███████║█████╗  
           ██║   ██╔══██║██╔══╝  
           ██║   ██║  ██║███████╗
           ╚═╝   ╚═╝  ╚═╝╚══════╝
                                       
   ╔══════════════════════════════════════╗
   ║  ${personalInfo.name.padEnd(35)}║
   ╠══════════════════════════════════════╣
   ║  OS:      Portfolio OS v1.0          ║
   ║  Shell:   nghia-shell                ║
   ║  Theme:   Retro Hacker               ║
   ║  CPU:     Brain @ ∞GHz               ║
   ║  Memory:  Coffee / ∞                 ║
   ║  Uptime:  ${new Date().getFullYear() - 2002} years                      ║
   ╚══════════════════════════════════════╝
`,
    }),
  },
  
  date: {
    description: 'Show current date',
    execute: () => ({
      type: 'info',
      content: new Date().toLocaleString('vi-VN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    }),
  },
  
  fortune: {
    description: 'Get a random fortune',
    execute: () => {
      const fortunes = [
        '"Code is like humor. When you have to explain it, it\'s bad." \n  \u2014 Cory House',
        '"First, solve the problem. Then, write the code." \n  \u2014 John Johnson',
        '"A programmer is a person who fixed a problem you didn\'t know you had, in a way you don\'t understand."',
        '"99 little bugs in the code, 99 little bugs...\n Take one down, patch it around... \n 127 little bugs in the code."',
        '"There are only 10 types of people in the world: \n those who understand binary and those who don\'t."',
        '"Deleted code is debugged code." \n  \u2014 Jeff Sickel',
        '"It works on my machine!" \n  \u2014 Every developer ever',
      ]
      return { 
        type: 'success', 
        content: '\n' + fortunes[Math.floor(Math.random() * fortunes.length)] + '\n'
      }
    },
  },
  
  cowsay: {
    description: 'Cow says something',
    execute: (args) => {
      const msg = args.join(' ') || 'Mooo!'
      const border = '-'.repeat(msg.length + 2)
      return {
        type: 'success',
        content: `
 ${border}
< ${msg} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`,
      }
    },
  },
  
  pwd: {
    description: 'Print working directory',
    execute: () => ({ type: 'info', content: '/home/nghia/portfolio' }),
  },
  
  ls: {
    description: 'List files',
    execute: () => ({
      type: 'info',
      content: `
drwxr-xr-x  projects/
drwxr-xr-x  skills/
-rw-r--r--  about.txt
-rw-r--r--  contact.txt
-rw-r--r--  README.md
-rwx------  secret.sh
`,
    }),
  },
  
  cat: {
    description: 'Read file contents',
    execute: (args) => {
      const file = args[0]
      if (!file) return { type: 'error', content: 'Usage: cat <filename>' }
      
      const files = {
        'about.txt': aboutMe.intro + '\n\n' + aboutMe.highlights.join('\n'),
        'contact.txt': `Email: ${personalInfo.email}\nGitHub: ${personalInfo.github}`,
        'README.md': `# ${personalInfo.name}\n\n${personalInfo.tagline}\n\nWelcome to my portfolio!`,
        'secret.sh': '#!/bin/bash\necho "You found the secret!"\n# Just kidding, there\'s nothing here',
      }
      
      if (files[file]) {
        return { type: 'success', content: files[file] }
      }
      return { type: 'error', content: `cat: ${file}: No such file or directory` }
    },
  },
  
  echo: {
    description: 'Echo text',
    execute: (args) => ({ type: 'info', content: args.join(' ') }),
  },
  
  matrix: {
    description: 'Enter the matrix',
    execute: () => ({ type: 'matrix' }),
  },
  
  hack: {
    description: 'Hacker mode',
    execute: () => ({ type: 'hack' }),
  },
  
  sudo: {
    description: 'Super user do',
    execute: () => ({
      type: 'error',
      content: 'Nice try! But you\'re not in the sudoers file. This incident will be reported.',
    }),
  },
  
  rm: {
    description: 'Remove files',
    execute: (args) => {
      if (args.includes('-rf') && args.includes('/')) {
        return { type: 'error', content: 'Nice try! This is a portfolio, not a real system.' }
      }
      return { type: 'error', content: 'Permission denied. Read-only portfolio.' }
    },
  },
}

// Default terminal welcome message
export const TERMINAL_WELCOME = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗     ║
║   ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗    ║
║   ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║    ║
║   ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║    ║
║   ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝    ║
║   ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝     ║
║                                                           ║
║              Welcome to Portfolio Terminal                ║
║          Type 'help' to see available commands            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

`
