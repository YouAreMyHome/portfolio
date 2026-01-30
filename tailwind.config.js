/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        orbitron: ['Orbitron', 'monospace'],
      },
      colors: {
        cyber: {
          blue: '#00f7ff',
          purple: '#7c3aed',
          pink: '#ec4899',
          dark: '#0a0a0a',
          darker: '#111827',
          darkest: '#1f2937',
        },
        neon: {
          blue: '#00f7ff',
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#10b981',
          yellow: '#f59e0b',
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00f7ff 0%, #7c3aed 50%, #ec4899 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #1f2937 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, #00f7ff 0px, transparent 50%), radial-gradient(at 80% 0%, #7c3aed 0px, transparent 50%), radial-gradient(at 0% 50%, #ec4899 0px, transparent 50%)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'glow-move': 'glow-move 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-lg': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'cyber': '0 0 20px rgba(0, 247, 255, 0.3)',
        'cyber-lg': '0 0 30px rgba(0, 247, 255, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};