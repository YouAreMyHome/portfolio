import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * Snake Game - Retro style mini-game
 * 
 * Controls: Arrow keys or WASD
 * Features: Score tracking, speed increase, retro CRT effect
 */

const CANVAS_SIZE = 320
const CELL_SIZE = 16
const GRID_SIZE = CANVAS_SIZE / CELL_SIZE // 20x20 grid
const INITIAL_SPEED = 150 // ms per frame

// Retro color palette
const COLORS = {
  background: '#0a0a0a',
  grid: '#111',
  snake: '#4ade80',
  snakeHead: '#22c55e',
  food: '#ef4444',
  foodGlow: '#dc2626',
  text: '#4ade80',
  border: '#22c55e',
}

function SnakeGame({ onGameEnd, isActive }) {
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const [gameState, setGameState] = useState('idle') // 'idle', 'playing', 'paused', 'gameover'
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0')
  })
  
  // Game state refs (for use in game loop)
  const snakeRef = useRef([{ x: 10, y: 10 }])
  const directionRef = useRef({ x: 1, y: 0 })
  const nextDirectionRef = useRef({ x: 1, y: 0 })
  const foodRef = useRef({ x: 15, y: 10 })
  const speedRef = useRef(INITIAL_SPEED)
  const scoreRef = useRef(0)
  
  // Generate random food position
  const generateFood = useCallback(() => {
    const snake = snakeRef.current
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y))
    foodRef.current = newFood
  }, [])
  
  // Reset game
  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }]
    directionRef.current = { x: 1, y: 0 }
    nextDirectionRef.current = { x: 1, y: 0 }
    speedRef.current = INITIAL_SPEED
    scoreRef.current = 0
    setScore(0)
    generateFood()
  }, [generateFood])
  
  // Draw game
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const snake = snakeRef.current
    const food = foodRef.current
    
    // Clear with background
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    
    // Draw grid (subtle)
    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE)
      ctx.stroke()
    }
    
    // Draw food with glow effect
    ctx.shadowColor = COLORS.food
    ctx.shadowBlur = 10
    ctx.fillStyle = COLORS.food
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    )
    ctx.shadowBlur = 0
    
    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0
      ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snake
      
      // Add glow to head
      if (isHead) {
        ctx.shadowColor = COLORS.snakeHead
        ctx.shadowBlur = 8
      }
      
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      )
      
      ctx.shadowBlur = 0
    })
    
    // Draw border
    ctx.strokeStyle = COLORS.border
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2)
    
  }, [])
  
  // Game logic update
  const update = useCallback(() => {
    const snake = snakeRef.current
    const food = foodRef.current
    
    // Apply queued direction
    directionRef.current = nextDirectionRef.current
    const direction = directionRef.current
    
    // Calculate new head position
    const head = snake[0]
    const newHead = {
      x: head.x + direction.x,
      y: head.y + direction.y
    }
    
    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || 
        newHead.y < 0 || newHead.y >= GRID_SIZE) {
      return false // Game over
    }
    
    // Check self collision
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      return false // Game over
    }
    
    // Move snake
    snake.unshift(newHead)
    
    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      // Eat food - don't remove tail
      scoreRef.current += 10
      setScore(scoreRef.current)
      
      // Speed up slightly (min 50ms)
      speedRef.current = Math.max(50, speedRef.current - 2)
      
      // Generate new food
      generateFood()
    } else {
      // Remove tail
      snake.pop()
    }
    
    return true // Game continues
  }, [generateFood])
  
  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return
    
    const continueGame = update()
    draw()
    
    if (!continueGame) {
      // Game over
      setGameState('gameover')
      
      // Update high score
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current)
        localStorage.setItem('snakeHighScore', scoreRef.current.toString())
      }
      
      if (onGameEnd) {
        onGameEnd(scoreRef.current)
      }
      return
    }
    
    gameLoopRef.current = setTimeout(gameLoop, speedRef.current)
  }, [gameState, update, draw, highScore, onGameEnd])
  
  // Start game loop when playing
  useEffect(() => {
    if (gameState === 'playing') {
      draw() // Initial draw
      gameLoopRef.current = setTimeout(gameLoop, speedRef.current)
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
      }
    }
  }, [gameState, gameLoop, draw])
  
  // Handle keyboard input
  useEffect(() => {
    if (!isActive) return
    
    const handleKeyDown = (e) => {
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault()
      }
      
      // Start game with space or enter
      if ((e.key === ' ' || e.key === 'Enter') && gameState !== 'playing') {
        if (gameState === 'gameover' || gameState === 'idle') {
          resetGame()
        }
        setGameState('playing')
        return
      }
      
      // Pause with P or Escape
      if ((e.key === 'p' || e.key === 'Escape') && gameState === 'playing') {
        setGameState('paused')
        return
      }
      
      // Resume with P or Space
      if ((e.key === 'p' || e.key === ' ') && gameState === 'paused') {
        setGameState('playing')
        return
      }
      
      if (gameState !== 'playing') return
      
      const direction = directionRef.current
      
      // Direction controls (prevent 180° turns)
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) {
            nextDirectionRef.current = { x: 0, y: -1 }
          }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) {
            nextDirectionRef.current = { x: 0, y: 1 }
          }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) {
            nextDirectionRef.current = { x: -1, y: 0 }
          }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) {
            nextDirectionRef.current = { x: 1, y: 0 }
          }
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, gameState, resetGame])
  
  // Initial draw when component mounts
  useEffect(() => {
    resetGame()
    draw()
  }, [resetGame, draw])
  
  return (
    <div className="snake-game">
      {/* Game Canvas */}
      <div className="game-screen">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="game-canvas"
        />
        
        {/* Overlay States */}
        {gameState === 'idle' && (
          <div className="game-overlay">
            <div className="game-title">🐍 SNAKE</div>
            <div className="game-instruction">Press SPACE to Start</div>
            <div className="game-controls">
              ↑←↓→ or WASD to move
            </div>
          </div>
        )}
        
        {gameState === 'paused' && (
          <div className="game-overlay">
            <div className="game-title">⏸️ PAUSED</div>
            <div className="game-instruction">Press SPACE to Resume</div>
          </div>
        )}
        
        {gameState === 'gameover' && (
          <div className="game-overlay gameover">
            <div className="game-title">💀 GAME OVER</div>
            <div className="game-score-display">Score: {score}</div>
            {score >= highScore && score > 0 && (
              <div className="new-highscore">🎉 NEW HIGH SCORE!</div>
            )}
            <div className="game-instruction">Press SPACE to Retry</div>
          </div>
        )}
      </div>
      
      {/* Score Display */}
      <div className="game-hud">
        <div className="hud-item">
          <span className="hud-label">SCORE</span>
          <span className="hud-value">{score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">HIGH</span>
          <span className="hud-value">{highScore}</span>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame
