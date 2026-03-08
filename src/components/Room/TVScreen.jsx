/**
 * TVScreen - Retro Arcade Controller
 * 
 * Clean controller component that uses game registry for all games.
 * Adding a new game only requires updating gameRegistry.js
 */

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { track } from '@vercel/analytics'
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

// Per-game visual identity for the PS5-style select screen
const GAME_CARD_STYLES = {
  snake:  { color: '#4ade80', rgb: '74,222,128',  emoji: '\uD83D\uDC0D', label: 'SNAKE' },
  pong:   { color: '#22d3ee', rgb: '34,211,238',  emoji: '\uD83C\uDFD3', label: 'PONG' },
  dino:   { color: '#f97316', rgb: '249,115,22',  emoji: '\uD83E\uDD96', label: 'DINO RUN' },
  tetris: { color: '#a855f7', rgb: '168,85,247',  emoji: '\uD83E\uDDE9', label: 'TETRIS' },
}

// Draws a rounded rectangle path (no fill/stroke — caller does that)
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

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
  
  // ========== DRAWING: GAME SELECT (PS5-style) ==========
  const drawGameSelect = useCallback((ctx) => {
    const n = gameList.length
    const prevIdx = (selectedGame - 1 + n) % n
    const nextIdx = (selectedGame + 1) % n
    const selGame  = gameList[selectedGame]
    const prevGame = gameList[prevIdx]
    const nextGame = gameList[nextIdx]
    const fallback = { color: '#4ade80', rgb: '74,222,128', emoji: '\uD83C\uDFAE', label: 'GAME' }
    const selStyle  = GAME_CARD_STYLES[selGame.id]  || fallback
    const prevStyle = GAME_CARD_STYLES[prevGame.id] || fallback
    const nextStyle = GAME_CARD_STYLES[nextGame.id] || fallback

    // ── Background: dark + ambient radial glow from selected game color ──
    ctx.fillStyle = '#080808'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    const grd = ctx.createRadialGradient(CANVAS_WIDTH / 2, 90, 5, CANVAS_WIDTH / 2, 90, 210)
    grd.addColorStop(0, `rgba(${selStyle.rgb}, 0.20)`)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // ── Card layout ──
    const SEL_W = 128, SEL_H = 140
    const SIDE_W = 90,  SIDE_H = 108
    const GAP = 18
    const SEL_X = Math.floor((CANVAS_WIDTH - SEL_W) / 2)   // 166
    const SEL_Y = 24
    const SIDE_Y = SEL_Y + Math.floor((SEL_H - SIDE_H) / 2) // 40
    const PREV_X = SEL_X - GAP - SIDE_W                     //  58
    const NEXT_X = SEL_X + SEL_W + GAP                      // 312

    // ── Inner draw card ──
    const drawCard = (x, y, w, h, style, selected) => {
      ctx.save()
      if (selected) {
        ctx.shadowColor = style.color
        ctx.shadowBlur = 24
      }
      // BG fill
      drawRoundedRect(ctx, x, y, w, h, 10)
      if (selected) {
        const bg = ctx.createLinearGradient(x, y, x, y + h)
        bg.addColorStop(0, `rgba(${style.rgb}, 0.28)`)
        bg.addColorStop(1, `rgba(${style.rgb}, 0.06)`)
        ctx.fillStyle = bg
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.04)'
        ctx.globalAlpha = 0.6
      }
      ctx.fill()
      ctx.shadowBlur = 0
      // Border
      drawRoundedRect(ctx, x, y, w, h, 10)
      ctx.strokeStyle = selected ? style.color : 'rgba(255,255,255,0.10)'
      ctx.lineWidth = selected ? 1.5 : 1
      ctx.stroke()
      ctx.globalAlpha = 1

      // Emoji
      ctx.font = `${selected ? 40 : 28}px serif`
      ctx.textAlign = 'center'
      ctx.globalAlpha = selected ? 1 : 0.5
      ctx.fillText(style.emoji, x + w / 2, y + Math.floor(h * 0.54))
      ctx.globalAlpha = 1

      // Label
      if (selected) {
        ctx.font = 'bold 11px "Courier New", monospace'
        ctx.fillStyle = style.color
        ctx.shadowColor = style.color
        ctx.shadowBlur = 8
        ctx.textAlign = 'center'
        ctx.fillText(style.label, x + w / 2, y + h - 13)
        ctx.shadowBlur = 0
      } else {
        ctx.font = '9px "Courier New", monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.textAlign = 'center'
        ctx.fillText(style.label, x + w / 2, y + h - 11)
      }
      ctx.restore()
    }

    // ── Nav arrows ──
    if (n > 1) {
      ctx.globalAlpha = 0.3
      ctx.font = '13px "Courier New", monospace'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.fillText('\u25C4', PREV_X - 13, SIDE_Y + SIDE_H / 2 + 5)
      ctx.fillText('\u25BA', NEXT_X + SIDE_W + 13, SIDE_Y + SIDE_H / 2 + 5)
      ctx.globalAlpha = 1
    }

    // Side cards first (behind selected)
    drawCard(PREV_X, SIDE_Y, SIDE_W, SIDE_H, prevStyle, false)
    drawCard(NEXT_X, SIDE_Y, SIDE_W, SIDE_H, nextStyle, false)
    // Selected card on top
    drawCard(SEL_X, SEL_Y, SEL_W, SEL_H, selStyle, true)

    // ── Title strip (above cards, very top) ──
    ctx.font = 'bold 10px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.textAlign = 'center'
    ctx.letterSpacing = '2px'
    ctx.fillText('RETRO  ARCADE', CANVAS_WIDTH / 2, 14)
    ctx.letterSpacing = '0px'

    // ── Info area (below cards) ──
    const INFO_Y = SEL_Y + SEL_H + 14  // 178
    ctx.font = '11px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.textAlign = 'center'
    ctx.fillText(selGame.desc, CANVAS_WIDTH / 2, INFO_Y)

    const best = scores[selGame.id]
    if (best > 0) {
      ctx.font = '10px "Courier New", monospace'
      ctx.fillStyle = selStyle.color
      ctx.fillText(`BEST: ${best}`, CANVAS_WIDTH / 2, INFO_Y + 16)
    }

    // ── Dot indicators ──
    const DOT_Y = CANVAS_HEIGHT - 22
    const DOT_R = 3
    const DOT_GAP = 11
    const DOT_START = CANVAS_WIDTH / 2 - ((n - 1) * DOT_GAP) / 2
    for (let i = 0; i < n; i++) {
      ctx.beginPath()
      ctx.arc(DOT_START + i * DOT_GAP, DOT_Y, DOT_R, 0, Math.PI * 2)
      if (i === selectedGame) {
        ctx.fillStyle = selStyle.color
        ctx.shadowColor = selStyle.color
        ctx.shadowBlur = 6
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.shadowBlur = 0
      }
      ctx.fill()
      ctx.shadowBlur = 0
    }

    // ── Controls hint ──
    ctx.font = '8px "Courier New", monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.textAlign = 'center'
    ctx.fillText('\u25C4 \u25BA  move     SPACE / ENTER  play', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 8)
  }, [selectedGame, gameList, scores])
  
  // ========== START GAME ==========
  const startGame = useCallback((gameId) => {
    const game = getGame(gameId)
    if (!game) return
    
    track('game_start', { game: gameId })
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
      
      // ===== TETRIS =====
      else if (currentScreen === 'tetris') {
        // Start / resume
        if (key === ' ' || key === 'Enter') {
          if (gameState === 'menu' || gameState === 'gameover') {
            restartGame()
            return
          } else if (gameState === 'paused') {
            setGameState('playing')
            return
          }
          // playing → hard drop (fall through)
        }
        
        if ((key === 'p' || key === 'P') && gameState === 'playing') {
          setGameState('paused')
          return
        }
        
        if (gameState !== 'playing' || !gameStateRef.current) return
        const gs = gameStateRef.current
        if (key === 'ArrowLeft')  game.move(gs, -1)
        else if (key === 'ArrowRight') game.move(gs, 1)
        else if (key === 'ArrowUp' || key === 'z' || key === 'Z') game.rotate(gs)
        else if (key === 'ArrowDown') gs.softDrop = true
        else if (key === ' ') game.hardDrop(gs)
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
      
      // Tetris soft drop
      if (currentScreen === 'tetris' && gameStateRef.current) {
        if (e.key === 'ArrowDown') gameStateRef.current.softDrop = false
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
        } else if (currentScreen === 'tetris') {
          const alive = game.update(gState)
          if (!alive) {
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
