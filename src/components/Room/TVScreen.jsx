import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  createPongState,
  updatePong,
  drawPongMenu,
  drawPongGame,
  drawPongPaused,
  drawPongGameOver,
} from './games/PongGame'
import {
  createDinoState,
  updateDino,
  drawDinoMenu,
  drawDinoGame,
  drawDinoPaused,
  drawDinoGameOver,
} from './games/DinoGame'

/**
 * TVScreen - Retro Arcade Machine
 * 
 * Features:
 * - Game selection menu
 * - Snake game
 * - Pong game
 */

const CANVAS_WIDTH = 460
const CANVAS_HEIGHT = 260
const CELL_SIZE = 13
const GRID_WIDTH = Math.floor(CANVAS_WIDTH / CELL_SIZE)
const GRID_HEIGHT = Math.floor(CANVAS_HEIGHT / CELL_SIZE)
const SNAKE_INITIAL_SPEED = 120

// Retro color palette
const COLORS = {
  background: '#0a0a0a',
  grid: '#0f0f0f',
  snake: '#4ade80',
  snakeHead: '#22c55e',
  food: '#ef4444',
  text: '#4ade80',
  textDim: '#166534',
  pong: '#22d3ee',
  selected: '#fbbf24',
}

// Available games
const GAMES = [
  { id: 'snake', name: '🐍 SNAKE', desc: 'Classic snake game' },
  { id: 'pong', name: '🏓 PONG', desc: 'Beat the CPU!' },
  { id: 'dino', name: '🦖 DINO RUN', desc: 'Jump over obstacles!' },
]

function TVScreen({ isActive }) {
  // Core state
  const [currentScreen, setCurrentScreen] = useState('select') // 'select', 'snake', 'pong'
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'paused', 'gameover'
  const [selectedGame, setSelectedGame] = useState(0)
  
  // Snake state
  const [snakeScore, setSnakeScore] = useState(0)
  const [snakeHighScore, setSnakeHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0')
  })
  
  // Pong state
  const [pongWins, setPongWins] = useState(() => {
    return parseInt(localStorage.getItem('pongWins') || '0')
  })
  
  // Dino state
  const [dinoHighScore, setDinoHighScore] = useState(() => {
    return parseInt(localStorage.getItem('dinoHighScore') || '0')
  })
  
  // Snake refs
  const snakeRef = useRef([{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }])
  const directionRef = useRef({ x: 1, y: 0 })
  const nextDirectionRef = useRef({ x: 1, y: 0 })
  const foodRef = useRef({ x: Math.floor(GRID_WIDTH * 0.75), y: Math.floor(GRID_HEIGHT / 2) })
  const snakeSpeedRef = useRef(SNAKE_INITIAL_SPEED)
  const snakeScoreRef = useRef(0)
  const lastSnakeUpdateRef = useRef(0)
  
  // Pong refs
  const pongStateRef = useRef(createPongState())
  const lastPongUpdateRef = useRef(0)
  
  // Dino refs
  const dinoStateRef = useRef(createDinoState())
  const dinoJumpRef = useRef(false)
  const lastDinoUpdateRef = useRef(0)
  
  // Create canvas and texture
  const { canvas, texture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = CANVAS_WIDTH
    cvs.height = CANVAS_HEIGHT
    
    const ctx = cvs.getContext('2d')
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    const tex = new THREE.CanvasTexture(cvs)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    
    return { canvas: cvs, texture: tex }
  }, [])
  
  // Cleanup
  useEffect(() => {
    return () => texture.dispose()
  }, [texture])
  
  // ========== GAME SELECTION ==========
  const drawGameSelect = useCallback((ctx) => {
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Title
    ctx.font = 'bold 24px "Courier New", monospace'
    ctx.fillStyle = COLORS.text
    ctx.textAlign = 'center'
    ctx.shadowColor = COLORS.text
    ctx.shadowBlur = 10
    ctx.fillText('🎮 RETRO ARCADE', CANVAS_WIDTH / 2, 45)
    ctx.shadowBlur = 0
    
    // Game options
    const startY = 90
    const itemHeight = 55
    
    GAMES.forEach((game, index) => {
      const y = startY + index * itemHeight
      const isSelected = index === selectedGame
      
      // Selection box
      if (isSelected) {
        ctx.fillStyle = 'rgba(74, 222, 128, 0.15)'
        ctx.fillRect(60, y - 20, CANVAS_WIDTH - 120, 50)
        ctx.strokeStyle = COLORS.selected
        ctx.lineWidth = 2
        ctx.strokeRect(60, y - 20, CANVAS_WIDTH - 120, 50)
      }
      
      // Game name
      ctx.font = isSelected ? 'bold 22px "Courier New", monospace' : '20px "Courier New", monospace'
      ctx.fillStyle = isSelected ? COLORS.selected : COLORS.text
      ctx.textAlign = 'center'
      ctx.fillText(game.name, CANVAS_WIDTH / 2, y + 5)
      
      // Description
      ctx.font = '12px "Courier New", monospace'
      ctx.fillStyle = COLORS.textDim
      ctx.fillText(game.desc, CANVAS_WIDTH / 2, y + 22)
    })
    
    // Instructions
    ctx.font = '12px "Courier New", monospace'
    ctx.fillStyle = COLORS.textDim
    ctx.fillText('↑↓ Select   SPACE Enter   ESC Exit', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20)
  }, [selectedGame])
  
  // ========== SNAKE GAME ==========
  const generateFood = useCallback(() => {
    const snake = snakeRef.current
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT)
      }
    } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y))
    foodRef.current = newFood
  }, [])
  
  const resetSnake = useCallback(() => {
    snakeRef.current = [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }]
    directionRef.current = { x: 1, y: 0 }
    nextDirectionRef.current = { x: 1, y: 0 }
    snakeSpeedRef.current = SNAKE_INITIAL_SPEED
    snakeScoreRef.current = 0
    setSnakeScore(0)
    generateFood()
  }, [generateFood])
  
  const updateSnake = useCallback(() => {
    const snake = snakeRef.current
    const food = foodRef.current
    
    directionRef.current = nextDirectionRef.current
    const direction = directionRef.current
    
    const head = snake[0]
    const newHead = { x: head.x + direction.x, y: head.y + direction.y }
    
    // Collision checks
    if (newHead.x < 0 || newHead.x >= GRID_WIDTH || 
        newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
      return false
    }
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      return false
    }
    
    snake.unshift(newHead)
    
    if (newHead.x === food.x && newHead.y === food.y) {
      snakeScoreRef.current += 10
      setSnakeScore(snakeScoreRef.current)
      snakeSpeedRef.current = Math.max(50, snakeSpeedRef.current - 2)
      generateFood()
    } else {
      snake.pop()
    }
    
    return true
  }, [generateFood])
  
  const drawSnakeMenu = useCallback((ctx) => {
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    ctx.font = 'bold 32px "Courier New", monospace'
    ctx.fillStyle = COLORS.snake
    ctx.textAlign = 'center'
    ctx.shadowColor = COLORS.snake
    ctx.shadowBlur = 10
    ctx.fillText('🐍 SNAKE', CANVAS_WIDTH / 2, 80)
    ctx.shadowBlur = 0
    
    ctx.font = '16px "Courier New", monospace'
    ctx.fillStyle = COLORS.textDim
    ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, 140)
    ctx.fillText('↑ ↓ ← → or WASD to move', CANVAS_WIDTH / 2, 170)
    
    ctx.font = '14px "Courier New", monospace'
    ctx.fillStyle = COLORS.text
    ctx.fillText(`High Score: ${snakeHighScore}`, CANVAS_WIDTH / 2, 220)
  }, [snakeHighScore])
  
  const drawSnakeGame = useCallback((ctx) => {
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Grid
    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 0.5
    for (let x = 0; x <= GRID_WIDTH; x++) {
      ctx.beginPath()
      ctx.moveTo(x * CELL_SIZE, 0)
      ctx.lineTo(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE)
      ctx.stroke()
    }
    for (let y = 0; y <= GRID_HEIGHT; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * CELL_SIZE)
      ctx.lineTo(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE)
      ctx.stroke()
    }
    
    // Food
    const food = foodRef.current
    ctx.shadowColor = COLORS.food
    ctx.shadowBlur = 8
    ctx.fillStyle = COLORS.food
    ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4)
    ctx.shadowBlur = 0
    
    // Snake
    snakeRef.current.forEach((segment, index) => {
      const isHead = index === 0
      ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snake
      if (isHead) {
        ctx.shadowColor = COLORS.snakeHead
        ctx.shadowBlur = 6
      }
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
      ctx.shadowBlur = 0
    })
    
    // HUD
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillStyle = COLORS.text
    ctx.textAlign = 'left'
    ctx.fillText(`SCORE: ${snakeScoreRef.current}`, 10, 20)
    ctx.textAlign = 'right'
    ctx.fillText(`HIGH: ${snakeHighScore}`, CANVAS_WIDTH - 10, 20)
  }, [snakeHighScore])
  
  const drawSnakePaused = useCallback((ctx) => {
    drawSnakeGame(ctx)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    ctx.font = 'bold 28px "Courier New", monospace'
    ctx.fillStyle = COLORS.snake
    ctx.textAlign = 'center'
    ctx.fillText('⏸️ PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
    
    ctx.font = '14px "Courier New", monospace'
    ctx.fillStyle = COLORS.textDim
    ctx.fillText('Press SPACE to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
  }, [drawSnakeGame])
  
  const drawSnakeGameOver = useCallback((ctx) => {
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    ctx.font = 'bold 28px "Courier New", monospace'
    ctx.fillStyle = '#ef4444'
    ctx.textAlign = 'center'
    ctx.shadowColor = '#ef4444'
    ctx.shadowBlur = 10
    ctx.fillText('💀 GAME OVER', CANVAS_WIDTH / 2, 80)
    ctx.shadowBlur = 0
    
    ctx.font = 'bold 20px "Courier New", monospace'
    ctx.fillStyle = COLORS.text
    ctx.fillText(`Score: ${snakeScoreRef.current}`, CANVAS_WIDTH / 2, 130)
    
    if (snakeScoreRef.current >= snakeHighScore && snakeScoreRef.current > 0) {
      ctx.font = '16px "Courier New", monospace'
      ctx.fillStyle = '#fbbf24'
      ctx.fillText('🎉 NEW HIGH SCORE!', CANVAS_WIDTH / 2, 160)
    }
    
    ctx.font = '14px "Courier New", monospace'
    ctx.fillStyle = COLORS.textDim
    ctx.fillText('Press SPACE to Retry', CANVAS_WIDTH / 2, 210)
    ctx.fillText('Press ESC to Exit', CANVAS_WIDTH / 2, 235)
  }, [snakeHighScore])
  
  // ========== KEYBOARD CONTROLS ==========
  useEffect(() => {
    if (!isActive) return
    
    const handleKeyDown = (e) => {
      const key = e.key
      
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' ', 'Escape', 'p', 'P'].includes(key)) {
        e.preventDefault()
        e.stopPropagation()
      }
      
      // ===== GAME SELECT SCREEN =====
      if (currentScreen === 'select') {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
          setSelectedGame(prev => (prev - 1 + GAMES.length) % GAMES.length)
        } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
          setSelectedGame(prev => (prev + 1) % GAMES.length)
        } else if (key === ' ' || key === 'Enter') {
          const game = GAMES[selectedGame]
          setCurrentScreen(game.id)
          setGameState('menu')
        }
        return
      }
      
      // ESC to go back to game select
      if (key === 'Escape') {
        if (gameState === 'menu') {
          setCurrentScreen('select')
        } else {
          setGameState('menu')
        }
        return
      }
      
      // ===== SNAKE CONTROLS =====
      if (currentScreen === 'snake') {
        if (key === ' ' || key === 'Enter') {
          if (gameState === 'menu' || gameState === 'gameover') {
            resetSnake()
            setGameState('playing')
          } else if (gameState === 'paused') {
            setGameState('playing')
          }
          return
        }
        
        if ((key === 'p' || key === 'P') && gameState === 'playing') {
          setGameState('paused')
          return
        }
        
        if (gameState !== 'playing') return
        
        const direction = directionRef.current
        switch (key) {
          case 'ArrowUp': case 'w': case 'W':
            if (direction.y !== 1) nextDirectionRef.current = { x: 0, y: -1 }
            break
          case 'ArrowDown': case 's': case 'S':
            if (direction.y !== -1) nextDirectionRef.current = { x: 0, y: 1 }
            break
          case 'ArrowLeft': case 'a': case 'A':
            if (direction.x !== 1) nextDirectionRef.current = { x: -1, y: 0 }
            break
          case 'ArrowRight': case 'd': case 'D':
            if (direction.x !== -1) nextDirectionRef.current = { x: 1, y: 0 }
            break
        }
      }
      
      // ===== PONG CONTROLS =====
      if (currentScreen === 'pong') {
        if (key === ' ' || key === 'Enter') {
          if (gameState === 'menu' || gameState === 'gameover') {
            pongStateRef.current = createPongState()
            setGameState('playing')
          } else if (gameState === 'paused') {
            setGameState('playing')
          } else if (gameState === 'playing') {
            setGameState('paused')
          }
          return
        }
        
        if (gameState !== 'playing') return
        
        // Paddle movement
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
          pongStateRef.current.moveUp = true
        }
        if (key === 'ArrowDown' || key === 's' || key === 'S') {
          pongStateRef.current.moveDown = true
        }
      }
      
      // ===== DINO CONTROLS =====
      if (currentScreen === 'dino') {
        if (key === ' ' || key === 'ArrowUp') {
          if (gameState === 'menu' || gameState === 'gameover') {
            dinoStateRef.current = createDinoState()
            setGameState('playing')
          } else if (gameState === 'paused') {
            setGameState('playing')
          } else if (gameState === 'playing') {
            // Jump!
            dinoJumpRef.current = true
          }
          return
        }
        
        if (key === 'Escape') {
          if (gameState === 'playing') {
            setGameState('paused')
          } else if (gameState === 'paused') {
            setGameState('playing')
          }
          return
        }
      }
    }
    
    const handleKeyUp = (e) => {
      if (currentScreen === 'pong') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          pongStateRef.current.moveUp = false
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          pongStateRef.current.moveDown = false
        }
      }
      
      if (currentScreen === 'dino') {
        if (e.key === ' ' || e.key === 'ArrowUp') {
          dinoJumpRef.current = false
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isActive, currentScreen, gameState, selectedGame, resetSnake])
  
  // ========== GAME LOOP ==========
  useFrame((state) => {
    if (!canvas || !texture) return
    
    const ctx = canvas.getContext('2d')
    const now = state.clock.elapsedTime * 1000
    
    // ===== GAME SELECT =====
    if (currentScreen === 'select') {
      drawGameSelect(ctx)
    }
    
    // ===== SNAKE =====
    else if (currentScreen === 'snake') {
      if (gameState === 'playing') {
        if (now - lastSnakeUpdateRef.current >= snakeSpeedRef.current) {
          const alive = updateSnake()
          if (!alive) {
            setGameState('gameover')
            if (snakeScoreRef.current > snakeHighScore) {
              setSnakeHighScore(snakeScoreRef.current)
              localStorage.setItem('snakeHighScore', snakeScoreRef.current.toString())
            }
          }
          lastSnakeUpdateRef.current = now
        }
      }
      
      switch (gameState) {
        case 'menu': drawSnakeMenu(ctx); break
        case 'playing': drawSnakeGame(ctx); break
        case 'paused': drawSnakePaused(ctx); break
        case 'gameover': drawSnakeGameOver(ctx); break
      }
    }
    
    // ===== PONG =====
    else if (currentScreen === 'pong') {
      const pong = pongStateRef.current
      
      if (gameState === 'playing') {
        // Update at 60fps
        if (now - lastPongUpdateRef.current >= 16) {
          updatePong(pong)
          
          if (pong.gameOver) {
            setGameState('gameover')
            if (pong.winner === 'PLAYER') {
              const newWins = pongWins + 1
              setPongWins(newWins)
              localStorage.setItem('pongWins', newWins.toString())
            }
          }
          lastPongUpdateRef.current = now
        }
      }
      
      switch (gameState) {
        case 'menu': drawPongMenu(ctx, pongWins); break
        case 'playing': drawPongGame(ctx, pong); break
        case 'paused': drawPongPaused(ctx, pong); break
        case 'gameover': drawPongGameOver(ctx, pong); break
      }
    }
    
    // ===== DINO =====
    else if (currentScreen === 'dino') {
      const dino = dinoStateRef.current
      
      if (gameState === 'playing') {
        // Update at 60fps
        if (now - lastDinoUpdateRef.current >= 16) {
          // Pass jump input to updateDino
          updateDino(dino, dinoJumpRef.current)
          
          if (dino.gameOver) {
            setGameState('gameover')
            if (dino.score > dinoHighScore) {
              setDinoHighScore(dino.score)
              localStorage.setItem('dinoHighScore', dino.score.toString())
            }
          }
          lastDinoUpdateRef.current = now
        }
      }
      
      switch (gameState) {
        case 'menu': drawDinoMenu(ctx, dinoHighScore); break
        case 'playing': drawDinoGame(ctx, dino); break
        case 'paused': drawDinoPaused(ctx, dino); break
        case 'gameover': drawDinoGameOver(ctx, dino, dinoHighScore); break
      }
    }
    
    texture.needsUpdate = true
  })
  
  // Reset when deactivated
  useEffect(() => {
    if (!isActive) {
      setCurrentScreen('select')
      setGameState('menu')
      setSelectedGame(0)
    }
  }, [isActive])
  
  return (
    <mesh>
      <planeGeometry args={[1.15, 0.65]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default TVScreen
