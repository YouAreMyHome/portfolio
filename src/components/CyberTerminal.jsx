import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';

const CyberTerminal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to NGHIA_TERMINAL v2.1.0' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'prompt', content: '' }
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: () => [
      'Available commands:',
      '  about     - Show personal information',
      '  skills    - Display technical skills',
      '  projects  - List all projects',
      '  contact   - Show contact information',
      '  clear     - Clear terminal',
      '  matrix    - Run matrix animation',
      '  exit      - Close terminal'
    ],
    about: () => [
      '╔══════════════════════════════════════╗',
      '║              PROFILE DATA            ║',
      '╠══════════════════════════════════════╣',
      '║ Name: Le Trong Nghia                 ║',
      '║ Role: Fullstack Developer            ║',
      '║ Location: Ho Chi Minh City, Vietnam  ║',
      '║ University: HUFLIT                   ║',
      '║ Status: Final Year Student           ║',
      '║ Passion: Creating Amazing Things     ║',
      '╚══════════════════════════════════════╝'
    ],
    skills: () => [
      'TECHNICAL SKILLS MATRIX:',
      '',
      '📋 Frontend:',
      '  ▓▓▓▓▓▓▓▓▓░ React.js (90%)',
      '  ▓▓▓▓▓▓▓▓░░ JavaScript (80%)',
      '  ▓▓▓▓▓▓▓░░░ TypeScript (70%)',
      '  ▓▓▓▓▓▓▓▓░░ HTML/CSS (80%)',
      '',
      '⚙️ Backend:',
      '  ▓▓▓▓▓▓▓░░░ Node.js (70%)',
      '  ▓▓▓▓▓▓░░░░ Python (60%)',
      '  ▓▓▓▓▓▓▓▓░░ Express.js (80%)',
      '',
      '🗄️ Database:',
      '  ▓▓▓▓▓▓▓░░░ MongoDB (70%)',
      '  ▓▓▓▓▓▓░░░░ MySQL (60%)'
    ],
    projects: () => [
      'PROJECT REPOSITORY:',
      '',
      '📦 SHN GEAR - E-commerce Platform',
      '   Tech: React, Node.js, MongoDB',
      '   Status: ✅ Completed',
      '',
      '🏨 Hotel Booking System',
      '   Tech: React, Express, MySQL',
      '   Status: ✅ Completed',
      '',
      '💼 Portfolio Website',
      '   Tech: React, Framer Motion, Tailwind',
      '   Status: 🚀 Live',
      '',
      'Use command "cd projects" for detailed view'
    ],
    contact: () => [
      'CONTACT INFORMATION:',
      '',
      '📧 Email: letrongnghia.dev@gmail.com',
      '🐙 GitHub: github.com/YouAreMyHome',
      '💼 LinkedIn: linkedin.com/in/youaremyhome',
      '📍 Location: Ho Chi Minh City, Vietnam',
      '',
      'Response time: < 24 hours'
    ],
    clear: () => {
      setHistory([{ type: 'prompt', content: '' }]);
      return [];
    },
    matrix: () => {
      // Trigger matrix animation
      return [
        'Initializing Matrix Protocol...',
        '█▓▒░ Loading... ░▒▓█',
        'Connection established.',
        'Welcome to the real world, Neo.'
      ];
    },
    exit: () => {
      onClose();
      return ['Terminal session ended.'];
    }
  };

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const output = commands[trimmedCmd] ? commands[trimmedCmd]() : [`Command not found: ${cmd}. Type "help" for available commands.`];
    
    setHistory(prev => [
      ...prev,
      { type: 'input', content: `nghia@portfolio:~$ ${cmd}` },
      ...output.map(line => ({ type: 'output', content: line })),
      { type: 'prompt', content: '' }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`bg-black border-2 border-cyber-blue/50 rounded-lg shadow-2xl ${
            isMinimized ? 'w-80 h-12' : 'w-full max-w-4xl h-96 sm:h-[500px]'
          } transition-all duration-300`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between p-3 border-b border-cyber-blue/30 bg-cyber-dark">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-blue" />
              <span className="text-cyber-blue font-mono text-sm">NGHIA_TERMINAL</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>
              <button
                onClick={onClose}
                className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Terminal content */}
          {!isMinimized && (
            <div className="h-full flex flex-col">
              <div 
                ref={terminalRef}
                className="flex-1 p-4 overflow-y-auto font-mono text-sm text-cyber-blue bg-black"
              >
                {history.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      line.type === 'input' 
                        ? 'text-cyber-purple' 
                        : line.type === 'output' 
                        ? 'text-cyber-blue' 
                        : ''
                    }`}
                  >
                    {line.content}
                  </motion.div>
                ))}
                
                {/* Input line */}
                <form onSubmit={handleSubmit} className="flex items-center">
                  <span className="text-cyber-purple mr-2">nghia@portfolio:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent text-cyber-blue outline-none border-none"
                    style={{ caretColor: '#00f7ff' }}
                  />
                  <motion.span
                    className="w-2 h-4 bg-cyber-blue ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CyberTerminal;
