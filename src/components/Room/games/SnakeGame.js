/**
 * Snake Game Logic
 * 
 * Classic snake - eat food, grow longer, don't hit walls or yourself!
 */

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GAME_COLORS,
  FONTS,
  drawUtils,
} from './constants'

// Snake constants
const CELL_SIZE = 13
const GRID_WIDTH = Math.floor(CANVAS_WIDTH / CELL_SIZE)
const GRID_HEIGHT = Math.floor(CANVAS_HEIGHT / CELL_SIZE)
const INITIAL_SPEED = 120  // ms between updates
const MIN_SPEED = 50       // fastest speed
const SPEED_DECREASE = 2   // speed up per food eaten

/**
 * Create initial Snake game state
 */
export function createSnakeState() {
  const centerX = Math.floor(GRID_WIDTH / 2)
  const centerY = Math.floor(GRID_HEIGHT / 2)
  
  return {
    // Snake segments (head first)
    snake: [{ x: centerX, y: centerY }],
    
    // Current direction
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    
    // Food position
    food: {
      x: Math.floor(GRID_WIDTH * 0.75),
      y: Math.floor(GRID_HEIGHT / 2)
    },
    
    // Game stats
    score: 0,
    speed: INITIAL_SPEED,
    
    // State
    gameOver: false,
  }
}

/**
 * Generate new food position (not on snake)
 */
export function generateFood(state) {
  let newFood
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    }
  } while (state.snake.some(seg => seg.x === newFood.x && seg.y === newFood.y))
  
  state.food = newFood
}

/**
 * Set snake direction (with opposite direction check)
 */
export function setSnakeDirection(state, dx, dy) {
  // Prevent 180-degree turn
  if (state.direction.x === -dx && state.direction.y === -dy) return
  if (state.direction.x === dx && state.direction.y === dy) return
  
  state.nextDirection = { x: dx, y: dy }
}

/**
 * Update Snake game state
 * @returns {boolean} true if still alive, false if game over
 */
export function updateSnake(state) {
  if (state.gameOver) return false
  
  // Apply next direction
  state.direction = state.nextDirection
  
  const head = state.snake[0]
  const newHead = {
    x: head.x + state.direction.x,
    y: head.y + state.direction.y
  }
  
  // Wall collision
  if (newHead.x < 0 || newHead.x >= GRID_WIDTH ||
      newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
    state.gameOver = true
    return false
  }
  
  // Self collision
  if (state.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
    state.gameOver = true
    return false
  }
  
  // Move snake
  state.snake.unshift(newHead)
  
  // Check food
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    state.score += 10
    state.speed = Math.max(MIN_SPEED, state.speed - SPEED_DECREASE)
    generateFood(state)
  } else {
    state.snake.pop()
  }
  
  return true
}

/**
 * Get current speed (for update timing)
 */
export function getSnakeSpeed(state) {
  return state.speed
}

// ========== DRAWING FUNCTIONS ==========

/**
 * Draw Snake menu screen
 */
export function drawSnakeMenu(ctx, highScore = 0) {
  drawUtils.clearCanvas(ctx)
  
  // Title with glow
  drawUtils.drawCenteredText(ctx, '🐍 SNAKE', 80, {
    font: FONTS.title,
    color: GAME_COLORS.snake,
    glow: true,
  })
  
  // Instructions
  drawUtils.drawCenteredText(ctx, 'Press SPACE to Start', 140, {
    font: FONTS.body,
    color: GAME_COLORS.textDim,
  })
  
  drawUtils.drawCenteredText(ctx, '↑ ↓ ← → or WASD to move', 170, {
    font: FONTS.body,
    color: GAME_COLORS.textDim,
  })
  
  // High score
  if (highScore > 0) {
    drawUtils.drawCenteredText(ctx, `High Score: ${highScore}`, 220, {
      font: FONTS.small,
      color: GAME_COLORS.text,
    })
  }
}

/**
 * Draw Snake game (playing state)
 */
export function drawSnakeGame(ctx, state, highScore = 0) {
  drawUtils.clearCanvas(ctx)
  
  // Grid lines
  ctx.strokeStyle = GAME_COLORS.grid
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
  
  // Food with glow
  ctx.shadowColor = GAME_COLORS.food
  ctx.shadowBlur = 8
  ctx.fillStyle = GAME_COLORS.food
  ctx.fillRect(
    state.food.x * CELL_SIZE + 2,
    state.food.y * CELL_SIZE + 2,
    CELL_SIZE - 4,
    CELL_SIZE - 4
  )
  ctx.shadowBlur = 0
  
  // Snake segments
  state.snake.forEach((segment, index) => {
    const isHead = index === 0
    ctx.fillStyle = isHead ? GAME_COLORS.snakeHead : GAME_COLORS.snake
    
    if (isHead) {
      ctx.shadowColor = GAME_COLORS.snakeHead
      ctx.shadowBlur = 6
    }
    
    ctx.fillRect(
      segment.x * CELL_SIZE + 1,
      segment.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    )
    ctx.shadowBlur = 0
  })
  
  // HUD
  drawUtils.drawHUD(ctx, state.score, highScore)
}

/**
 * Draw Snake paused screen
 */
export function drawSnakePaused(ctx, state, highScore = 0) {
  drawSnakeGame(ctx, state, highScore)
  drawUtils.drawOverlay(ctx)
  
  drawUtils.drawCenteredText(ctx, '⏸️ PAUSED', CANVAS_HEIGHT / 2 - 10, {
    font: 'bold 28px "Courier New", monospace',
    color: GAME_COLORS.snake,
  })
  
  drawUtils.drawCenteredText(ctx, 'Press SPACE to Resume', CANVAS_HEIGHT / 2 + 20, {
    font: FONTS.small,
    color: GAME_COLORS.textDim,
  })
}

/**
 * Draw Snake game over screen
 */
export function drawSnakeGameOver(ctx, state, highScore = 0) {
  drawUtils.clearCanvas(ctx)
  
  // Game Over title
  drawUtils.drawCenteredText(ctx, '💀 GAME OVER', 80, {
    font: 'bold 28px "Courier New", monospace',
    color: GAME_COLORS.textError,
    glow: true,
    glowColor: GAME_COLORS.textError,
  })
  
  // Score
  drawUtils.drawCenteredText(ctx, `Score: ${state.score}`, 130, {
    font: FONTS.heading,
    color: GAME_COLORS.text,
  })
  
  // New high score?
  if (state.score >= highScore && state.score > 0) {
    drawUtils.drawCenteredText(ctx, '🎉 NEW HIGH SCORE!', 160, {
      font: FONTS.body,
      color: GAME_COLORS.textHighlight,
    })
  }
  
  // Instructions
  drawUtils.drawCenteredText(ctx, 'Press SPACE to Retry', 210, {
    font: FONTS.small,
    color: GAME_COLORS.textDim,
  })
  
  drawUtils.drawCenteredText(ctx, 'Press ESC to Exit', 235, {
    font: FONTS.small,
    color: GAME_COLORS.textDim,
  })
}

// Export constants for external use
export const SNAKE_CONSTANTS = {
  CELL_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  INITIAL_SPEED,
}
