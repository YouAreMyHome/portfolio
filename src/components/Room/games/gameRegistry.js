/**
 * Game Registry - Central configuration for all arcade games
 * 
 * To add a new game:
 * 1. Create GameName.js in games/ folder with standard interface
 * 2. Import and add to GAME_REGISTRY below
 * 3. That's it! TVScreen will automatically include it
 */

import {
  createSnakeState,
  updateSnake,
  getSnakeSpeed,
  setSnakeDirection,
  drawSnakeMenu,
  drawSnakeGame,
  drawSnakePaused,
  drawSnakeGameOver,
} from './SnakeGame'

import {
  createPongState,
  updatePong,
  drawPongMenu,
  drawPongGame,
  drawPongPaused,
  drawPongGameOver,
} from './PongGame'

import {
  createDinoState,
  updateDino,
  drawDinoMenu,
  drawDinoGame,
  drawDinoPaused,
  drawDinoGameOver,
} from './DinoGame'

import { STORAGE_KEYS } from './constants'

/**
 * Game Registry
 * 
 * Each game must provide:
 * - id: unique identifier
 * - name: display name with emoji
 * - desc: short description
 * - storageKey: localStorage key for score/stats
 * - createState: () => gameState
 * - update: (state, ...args) => void
 * - draw: { menu, game, paused, gameover } functions
 * - controls: keyboard control configuration
 */
export const GAME_REGISTRY = {
  snake: {
    id: 'snake',
    name: '🐍 SNAKE',
    desc: 'Classic snake game',
    storageKey: STORAGE_KEYS.SNAKE_HIGH_SCORE,
    scoreType: 'highScore',  // 'highScore' | 'wins'
    
    createState: createSnakeState,
    update: updateSnake,
    getSpeed: getSnakeSpeed,
    setDirection: setSnakeDirection,
    
    draw: {
      menu: drawSnakeMenu,
      game: drawSnakeGame,
      paused: drawSnakePaused,
      gameover: drawSnakeGameOver,
    },
    
    // Control scheme
    controls: {
      // Movement keys mapped to direction
      movement: {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        W: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        S: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        A: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
        D: { x: 1, y: 0 },
      },
      pause: ['p', 'P'],
      start: [' ', 'Enter'],
    },
    
    // Update timing (use getSpeed for dynamic timing)
    updateInterval: null, // null means use getSpeed()
  },
  
  pong: {
    id: 'pong',
    name: '🏓 PONG',
    desc: 'Beat the CPU!',
    storageKey: STORAGE_KEYS.PONG_WINS,
    scoreType: 'wins',
    
    createState: createPongState,
    update: updatePong,
    
    draw: {
      menu: drawPongMenu,
      game: drawPongGame,
      paused: drawPongPaused,
      gameover: drawPongGameOver,
    },
    
    controls: {
      paddle: {
        ArrowUp: 'up',
        ArrowDown: 'down',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
      },
      start: [' ', 'Enter'],
    },
    
    updateInterval: 16, // ~60fps
  },
  
  dino: {
    id: 'dino',
    name: '🦖 DINO RUN',
    desc: 'Jump over obstacles!',
    storageKey: STORAGE_KEYS.DINO_HIGH_SCORE,
    scoreType: 'highScore',
    
    createState: createDinoState,
    update: updateDino,
    
    draw: {
      menu: drawDinoMenu,
      game: drawDinoGame,
      paused: drawDinoPaused,
      gameover: drawDinoGameOver,
    },
    
    controls: {
      jump: [' ', 'ArrowUp'],
      start: [' ', 'ArrowUp'],
    },
    
    updateInterval: 16, // ~60fps
  },
}

/**
 * Get ordered list of games for menu display
 */
export function getGameList() {
  return Object.values(GAME_REGISTRY).map(game => ({
    id: game.id,
    name: game.name,
    desc: game.desc,
  }))
}

/**
 * Get game by ID
 */
export function getGame(id) {
  return GAME_REGISTRY[id] || null
}

/**
 * Load saved score/stats for a game
 */
export function loadGameScore(gameId) {
  const game = GAME_REGISTRY[gameId]
  if (!game) return 0
  return parseInt(localStorage.getItem(game.storageKey) || '0')
}

/**
 * Save score/stats for a game
 */
export function saveGameScore(gameId, value) {
  const game = GAME_REGISTRY[gameId]
  if (!game) return
  localStorage.setItem(game.storageKey, value.toString())
}

/**
 * Check if new score beats saved score
 */
export function isNewHighScore(gameId, newScore) {
  const saved = loadGameScore(gameId)
  return newScore > saved
}

export default GAME_REGISTRY
