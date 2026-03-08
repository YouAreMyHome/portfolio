/**
 * Shared Game Constants
 * 
 * Centralized configuration for all arcade games
 */

// Canvas dimensions (shared across all games)
export const CANVAS_WIDTH = 460
export const CANVAS_HEIGHT = 260

// Retro color palette - consistent theme
export const GAME_COLORS = {
  // Background & UI
  background: '#0a0a0a',
  grid: '#0f0f0f',
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayDark: 'rgba(0, 0, 0, 0.8)',
  
  // Text
  text: '#4ade80',
  textDim: '#166534',
  textHighlight: '#fbbf24',
  textError: '#ef4444',
  
  // Game elements
  primary: '#4ade80',      // Green - main game color
  secondary: '#22d3ee',    // Cyan - accents
  accent: '#fbbf24',       // Yellow - highlights
  danger: '#ef4444',       // Red - danger/food
  pink: '#f472b6',         // Pink - special elements
  
  // Snake specific
  snake: '#4ade80',
  snakeHead: '#22c55e',
  food: '#ef4444',
  
  // Pong specific
  pong: '#22d3ee',
  paddle: '#22d3ee',
  ball: '#ffffff',
  
  // Dino specific
  dino: '#4ade80',
  cactus: '#22c55e',
  bird: '#f472b6',
  ground: '#333',
  cloud: '#1a1a2e',
  score: '#fbbf24',
}

// Typography
export const FONTS = {
  title: 'bold 32px "Courier New", monospace',
  subtitle: 'bold 24px "Courier New", monospace',
  heading: 'bold 20px "Courier New", monospace',
  body: '16px "Courier New", monospace',
  small: '14px "Courier New", monospace',
  tiny: '12px "Courier New", monospace',
}

// Common draw utilities
export const drawUtils = {
  /**
   * Clear canvas with background color
   */
  clearCanvas(ctx) {
    ctx.fillStyle = GAME_COLORS.background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  },
  
  /**
   * Draw centered text with optional glow
   */
  drawCenteredText(ctx, text, y, options = {}) {
    const {
      font = FONTS.body,
      color = GAME_COLORS.text,
      glow = false,
      glowColor = color,
    } = options
    
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    
    if (glow) {
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 10
    }
    
    ctx.fillText(text, CANVAS_WIDTH / 2, y)
    ctx.shadowBlur = 0
  },
  
  /**
   * Draw overlay (for pause/game over screens)
   */
  drawOverlay(ctx, dark = false) {
    ctx.fillStyle = dark ? GAME_COLORS.overlayDark : GAME_COLORS.overlay
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  },
  
  /**
   * Draw standard menu footer
   */
  drawMenuFooter(ctx, text = 'Press SPACE to Start') {
    ctx.font = FONTS.small
    ctx.fillStyle = GAME_COLORS.text
    ctx.textAlign = 'center'
    ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20)
  },
  
  /**
   * Draw game HUD with score
   */
  drawHUD(ctx, score, highScore = null) {
    ctx.font = 'bold 14px "Courier New", monospace'
    ctx.fillStyle = GAME_COLORS.text
    ctx.textAlign = 'left'
    ctx.fillText(`SCORE: ${score}`, 10, 20)
    
    if (highScore !== null) {
      ctx.textAlign = 'right'
      ctx.fillText(`HIGH: ${highScore}`, CANVAS_WIDTH - 10, 20)
    }
  },
}

// Game state enum
export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
}

// Storage keys
export const STORAGE_KEYS = {
  SNAKE_HIGH_SCORE: 'snakeHighScore',
  PONG_WINS: 'pongWins',
  DINO_HIGH_SCORE: 'dinoHighScore',
  TETRIS_HIGH_SCORE: 'tetrisHighScore',
}
