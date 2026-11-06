import { useState, useEffect, useRef } from 'react'
import { TERMINAL_COMMANDS, TERMINAL_WELCOME } from '../osConfig'
import { personalInfo } from '../../../data/portfolio'

export default function TerminalApp() {
  const [history, setHistory] = useState([{ type: 'success', content: TERMINAL_WELCOME }])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showHack, setShowHack] = useState(false)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  const executeCommand = (cmd) => {
    const parts = cmd.trim().split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Add to history
    setHistory((prev) => [...prev, { type: 'input', content: `nghia@portfolio:~$ ${cmd}` }])

    if (!command) return

    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)

    const handler = TERMINAL_COMMANDS[command]
    if (handler) {
      const result = handler.execute(args)

      if (result.type === 'clear') {
        setHistory([])
      } else if (result.type === 'matrix') {
        setShowMatrix(true)
        setTimeout(() => setShowMatrix(false), 5000)
      } else if (result.type === 'hack') {
        setShowHack(true)
        setTimeout(() => setShowHack(false), 3000)
      } else {
        setHistory((prev) => [...prev, result])
      }
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: 'error',
          content: `Command not found: ${command}. Type 'help' for available commands.`,
        },
      ])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const commands = Object.keys(TERMINAL_COMMANDS)
      const match = commands.find((c) => c.startsWith(input))
      if (match) setInput(match)
    }
  }

  return (
    <div className="window-content terminal-content" onClick={() => inputRef.current?.focus()}>
      {showMatrix && (
        <div className="matrix-overlay">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="matrix-column"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {'01'
                .repeat(50)
                .split('')
                .map((_c, j) => (
                  <span key={j} style={{ opacity: Math.random() }}>
                    {Math.random() > 0.5 ? '1' : '0'}
                  </span>
                ))}
            </div>
          ))}
        </div>
      )}

      {showHack && (
        <div className="hack-overlay">
          <div className="hack-text">
            ACCESS GRANTED
            <br />
            Welcome back, {personalInfo.name}
            <br />
            <br />
            System unlocked
            <br />
            <br />
            Just kidding, this is just a portfolio
          </div>
        </div>
      )}

      <div className="terminal-output" ref={outputRef}>
        {history.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.content}
          </div>
        ))}
      </div>
      <div className="terminal-input-line">
        <span className="terminal-prompt">nghia@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}

