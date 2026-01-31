import { useState, useEffect, useCallback, useRef } from 'react'
import useStore from '../../store/useStore'

const CELL_SIZE = 20
const BOARD_WIDTH = 460
const BOARD_HEIGHT = 260
const ROWS = BOARD_HEIGHT / CELL_SIZE
const COLS = BOARD_WIDTH / CELL_SIZE

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 6 }])
  const [food, setFood] = useState({ x: 15, y: 6 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [highScore, setHighScore] = useState(0)

  const closePanel = useStore((state) => state.closePanel)
  const gameLoopRef = useRef()
  const directionRef = useRef(DIRECTION.RIGHT)

  const spawnFood = useCallback(() => {
    const x = Math.floor(Math.random() * COLS)
    const y = Math.floor(Math.random() * ROWS)
    setFood({ x, y })
  }, [])

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 6 }])
    directionRef.current = DIRECTION.RIGHT
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
    spawnFood()
  }, [spawnFood])

  const checkCollision = useCallback((head) => {
    // Wall collision
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) return true
    // Self collision
    for (const segment of snake) {
      if (head.x === segment.x && head.y === segment.y) return true
    }
    return false
  }, [snake])

  const gameStep = useCallback(() => {
    if (gameOver || !isPlaying) return

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] }
      const dir = directionRef.current
      head.x += dir.x
      head.y += dir.y

      if (checkCollision(head)) {
        setGameOver(true)
        setIsPlaying(false)
        if (score > highScore) setHighScore(score)
        return prevSnake
      }

      const newSnake = [head, ...prevSnake]

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1)
        spawnFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, gameOver, isPlaying, score, highScore, spawnFood, checkCollision])

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(gameStep, 100)
    } else {
      clearInterval(gameLoopRef.current)
    }
    return () => clearInterval(gameLoopRef.current)
  }, [isPlaying, gameOver, gameStep])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        // Only prevent default if we are playing or in menu?
        // We are in an iframe/div inside the canvas, so maybe we want to block scroll always when focused?
        // But the listener is on window.
        // Let's rely on standard bubbling.
      }

      if (gameOver) {
          if (e.key === ' ' || e.key === 'Enter') resetGame()
          if (e.key === 'Escape') closePanel()
          return
      }

      if (!isPlaying) {
         if (e.key === ' ' || e.key === 'Enter') resetGame()
         if (e.key === 'Escape') closePanel()
         return
      }

      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== DIRECTION.DOWN) directionRef.current = DIRECTION.UP
          break
        case 'ArrowDown':
          if (directionRef.current !== DIRECTION.UP) directionRef.current = DIRECTION.DOWN
          break
        case 'ArrowLeft':
          if (directionRef.current !== DIRECTION.RIGHT) directionRef.current = DIRECTION.LEFT
          break
        case 'ArrowRight':
          if (directionRef.current !== DIRECTION.LEFT) directionRef.current = DIRECTION.RIGHT
          break
        case 'Escape':
          closePanel()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, gameOver, closePanel, resetGame])

  return (
    <div
      style={{
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        backgroundColor: '#9ca3af',
        position: 'relative',
        fontFamily: 'monospace',
        border: '4px solid #374151',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
      }}
    >
      {/* Game Board */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Food */}
        <div
            style={{
                position: 'absolute',
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: '#dc2626',
                borderRadius: '50%',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
            }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: i === 0 ? '#15803d' : '#22c55e',
                    border: '1px solid #14532d',
                    zIndex: 1,
                    borderRadius: i === 0 ? '4px' : '2px'
                }}
            />
        ))}
      </div>

      {/* Scanline effect overlay */}
      <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 2px, 3px 100%',
          pointerEvents: 'none',
          zIndex: 20
      }} />

      {/* UI Overlay */}
      {(!isPlaying || gameOver) && (
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 30,
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#4ade80', textShadow: '2px 2px #000' }}>SNAKE</h1>
            {gameOver && <h2 style={{ color: '#ef4444', marginBottom: '10px' }}>GAME OVER</h2>}
            <p style={{ marginBottom: '5px' }}>Score: {score}</p>
            <p style={{ marginBottom: '20px', fontSize: '12px', color: '#9ca3af' }}>High Score: {highScore}</p>
            <button
                onClick={resetGame}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    fontFamily: 'inherit',
                    marginBottom: '10px',
                    boxShadow: '0 4px 0 #15803d',
                    active: { boxShadow: '0 0 0', transform: 'translateY(4px)' }
                }}
            >
                {gameOver ? 'TRY AGAIN' : 'START GAME'}
            </button>
            <p style={{ fontSize: '10px', color: '#d1d5db', marginTop: '10px' }}>Use Arrow Keys to Move</p>
            <button
              onClick={(e) => { e.stopPropagation(); closePanel() }}
              style={{
                marginTop: '15px',
                background: 'transparent',
                border: '1px solid #666',
                color: '#aaa',
                padding: '5px 10px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Exit TV (ESC)
            </button>
        </div>
      )}

      {/* Score HUD during game */}
      {isPlaying && !gameOver && (
          <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              fontWeight: 'bold',
              zIndex: 25,
              textShadow: '1px 1px 0 #000'
          }}>
              {score}
          </div>
      )}
    </div>
  )
}

export default SnakeGame
