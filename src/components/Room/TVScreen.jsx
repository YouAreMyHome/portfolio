/**
 * TVScreen - Retro Arcade Controller
 * 
 * Clean controller component that uses game registry for all games.
 * Adding a new game only requires updating gameRegistry.js
 */

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GAME_COLORS,
  FONTS,
  getGameList,
  getGame,
  loadGameScore,
  saveGameScore,
  isNewHighScore,
} from './games'

/**
 * TVScreen Component
 * 
 * @param {boolean} isActive - Whether the arcade is currently active
 */
function TVScreen({ isActive }) {
  // ========== STATE ==========
  const [currentScreen, setCurrentScreen] = useState('select')
  const [gameState, setGameState] = useState('menu')
  const [selectedGame, setSelectedGame] = useState(0)
  
  // Game scores (loaded from localStorage)
  const [scores, setScores] = useState(() => {
    const games = getGameList()
    const initial = {}
    games.forEach(g => {
      initial[g.id] = loadGameScore(g.id)
    })
    return initial
  })
  
  // ========== REFS ==========
  // Game state refs (mutable, not triggering re-renders)
  const gameStateRef = useRef(null)
  const lastUpdateRef = useRef(0)
  const inputRef = useRef({}) // For continuous input (jump, paddle movement)
  
  // ========== CANVAS & TEXTURE ==========
  const { canvas, texture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = CANVAS_WIDTH
    cvs.height = CANVAS_HEIGHT
    
    const ctx = cvs.getContext('2d')
    ctx.fillStyle = GAME_COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    const tex = new THREE.CanvasTexture(cvs)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    
    return { canvas: cvs, texture: tex }
  }, [])
  
  // Cleanup texture on unmount
  useEffect(() => {
    return () => texture.dispose()
  }, [texture])
  
  // ========== GAME LIST ==========
  const gameList = useMemo(() => getGameList(), [])
  
  // ========== DRAWING: GAME SELECT ==========
  const drawGameSelect = useCallback((ctx) => {
    ctx.fillStyle = GAME_COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    // Title
    ctx.font = FONTS.subtitle
    ctx.fillStyle = GAME_COLORS.text
    ctx.textAlign = 'center'
    ctx.shadowColor = GAME_COLORS.text
    ctx.shadowBlur = 10
    ctx.fillText('🎮 RETRO ARCADE', CANVAS_WIDTH / 2, 45)
    ctx.shadowBlur = 0
    
    // Game options
    const startY = 90
    const itemHeight = 55
    
    gameList.forEach((game, index) => {
      const y = startY + index * itemHeight
      const isSelected = index === selectedGame
      
      // Selection box
      if (isSelected) {
        ctx.fillStyle = 'rgba(74, 222, 128, 0.15)'
        ctx.fillRect(60, y - 20, CANVAS_WIDTH - 120, 50)
        ctx.strokeStyle = GAME_COLORS.textHighlight
        ctx.lineWidth = 2
        ctx.strokeRect(60, y - 20, CANVAS_WIDTH - 120, 50)
      }
      
      // Game name
      ctx.font = isSelected ? 'bold 22px "Courier New", monospace' : '20px "Courier New", monospace'
      ctx.fillStyle = isSelected ? GAME_COLORS.textHighlight : GAME_COLORS.text
      ctx.textAlign = 'center'
      ctx.fillText(game.name, CANVAS_WIDTH / 2, y + 5)
      
      // Description
      ctx.font = FONTS.tiny
      ctx.fillStyle = GAME_COLORS.textDim
      ctx.fillText(game.desc, CANVAS_WIDTH / 2, y + 22)
    })
    
    // Instructions
    ctx.font = FONTS.tiny
    ctx.fillStyle = GAME_COLORS.textDim
    ctx.fillText('↑↓ Select   SPACE Enter   ESC Exit', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20)
  }, [selectedGame, gameList])
  
  // ========== START GAME ==========
  const startGame = useCallback((gameId) => {
    const game = getGame(gameId)
    if (!game) return
    
    gameStateRef.current = game.createState()
    inputRef.current = {}
    setCurrentScreen(gameId)
    setGameState('menu')
  }, [])
  
  // ========== RESTART GAME ==========
  const restartGame = useCallback(() => {
    const game = getGame(currentScreen)
    if (!game) return
    
    gameStateRef.current = game.createState()
    inputRef.current = {}
    setGameState('playing')
  }, [currentScreen])
  
  // ========== HANDLE GAME OVER ==========
  const handleGameOver = useCallback((game, state) => {
    setGameState('gameover')
    
    // Check for new high score
    let scoreValue = state.score
    if (game.scoreType === 'wins' && state.winner === 'PLAYER') {
      scoreValue = scores[game.id] + 1
    }
    
    if (game.scoreType === 'highScore' && isNewHighScore(game.id, state.score)) {
      saveGameScore(game.id, state.score)
      setScores(prev => ({ ...prev, [game.id]: state.score }))
    } else if (game.scoreType === 'wins' && state.winner === 'PLAYER') {
      saveGameScore(game.id, scoreValue)
      setScores(prev => ({ ...prev, [game.id]: scoreValue }))
    }
  }, [scores])
  
  // ========== KEYBOARD CONTROLS ==========
  useEffect(() => {
    if (!isActive) return
    
    const handleKeyDown = (e) => {
      const key = e.key
      
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
           'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 
           ' ', 'Escape', 'Enter', 'p', 'P'].includes(key)) {
        e.preventDefault()
        e.stopPropagation()
      }
      
      // ===== GAME SELECT =====
      if (currentScreen === 'select') {
        if (key === 'ArrowUp' || key === 'w' || key === 'W') {
          setSelectedGame(prev => (prev - 1 + gameList.length) % gameList.length)
        } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
          setSelectedGame(prev => (prev + 1) % gameList.length)
        } else if (key === ' ' || key === 'Enter') {
          startGame(gameList[selectedGame].id)
        }
        return
      }
      
      // ESC handling
      if (key === 'Escape') {
        if (gameState === 'menu' || gameState === 'gameover') {
          setCurrentScreen('select')
          setGameState('menu')
        } else if (gameState === 'playing') {
          setGameState('paused')
        } else if (gameState === 'paused') {
          setGameState('playing')
        }
        return
      }
      
      const game = getGame(currentScreen)
      if (!game) return
      
      // ===== SNAKE =====
      if (currentScreen === 'snake') {
        // Start/Pause
        if (key === ' ' || key === 'Enter') {
          if (gameState === 'menu' || gameState === 'gameover') {
            restartGame()
          } else if (gameState === 'paused') {
            setGameState('playing')
          }
          return
        }
        
        if ((key === 'p' || key === 'P') && gameState === 'playing') {
          setGameState('paused')
          return
        }
        
        // Direction
        if (gameState === 'playing' && game.controls.movement[key]) {
          const dir = game.controls.movement[key]
          game.setDirection(gameStateRef.current, dir.x, dir.y)
        }
      }
      
      // ===== PONG =====
      else if (currentScreen === 'pong') {
        if (key === ' ' || key === 'Enter') {
          if (gameState === 'menu' || gameState === 'gameover') {
            restartGame()
          } else if (gameState === 'paused') {
            setGameState('playing')
          } else if (gameState === 'playing') {
            setGameState('paused')
          }
          return
        }
        
        // Paddle movement (continuous)
        if (game.controls.paddle[key]) {
          const dir = game.controls.paddle[key]
          if (dir === 'up') gameStateRef.current.moveUp = true
          if (dir === 'down') gameStateRef.current.moveDown = true
        }
      }
      
      // ===== DINO =====
      else if (currentScreen === 'dino') {
        if (game.controls.jump.includes(key)) {
          if (gameState === 'menu' || gameState === 'gameover') {
            restartGame()
          } else if (gameState === 'paused') {
            setGameState('playing')
          } else if (gameState === 'playing') {
            inputRef.current.jump = true
          }
          return
        }
        
        if (key === 'Escape' && gameState === 'playing') {
          setGameState('paused')
        }
      }
    }
    
    const handleKeyUp = (e) => {
      const game = getGame(currentScreen)
      if (!game) return
      
      // Pong paddle
      if (currentScreen === 'pong' && gameStateRef.current) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          gameStateRef.current.moveUp = false
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          gameStateRef.current.moveDown = false
        }
      }
      
      // Dino jump
      if (currentScreen === 'dino') {
        if (game.controls.jump.includes(e.key)) {
          inputRef.current.jump = false
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isActive, currentScreen, gameState, selectedGame, gameList, startGame, restartGame])
  
  // ========== GAME LOOP ==========
  useFrame((state) => {
    if (!canvas || !texture) return
    
    const ctx = canvas.getContext('2d')
    const now = state.clock.elapsedTime * 1000
    
    // Game Select Screen
    if (currentScreen === 'select') {
      drawGameSelect(ctx)
      texture.needsUpdate = true
      return
    }
    
    const game = getGame(currentScreen)
    if (!game || !gameStateRef.current) {
      texture.needsUpdate = true
      return
    }
    
    const gState = gameStateRef.current
    
    // Update game logic
    if (gameState === 'playing') {
      const interval = game.getSpeed 
        ? game.getSpeed(gState) 
        : game.updateInterval
      
      if (now - lastUpdateRef.current >= interval) {
        // Game-specific update
        if (currentScreen === 'snake') {
          const alive = game.update(gState)
          if (!alive) {
            handleGameOver(game, gState)
          }
        } else if (currentScreen === 'pong') {
          game.update(gState)
          if (gState.gameOver) {
            handleGameOver(game, gState)
          }
        } else if (currentScreen === 'dino') {
          game.update(gState, inputRef.current.jump)
          if (gState.gameOver) {
            handleGameOver(game, gState)
          }
        }
        
        lastUpdateRef.current = now
      }
    }
    
    // Draw based on state
    const score = scores[game.id]
    switch (gameState) {
      case 'menu':
        game.draw.menu(ctx, score)
        break
      case 'playing':
        game.draw.game(ctx, gState, score)
        break
      case 'paused':
        game.draw.paused(ctx, gState, score)
        break
      case 'gameover':
        game.draw.gameover(ctx, gState, score)
        break
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
