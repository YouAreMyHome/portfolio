/**
 * Pong Game Logic - Classic arcade game
 * 
 * Two paddles, one ball, first to score wins!
 */

const CANVAS_WIDTH = 460
const CANVAS_HEIGHT = 260

// Game constants
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 50
const BALL_SIZE = 8
const PADDLE_SPEED = 5
const INITIAL_BALL_SPEED = 4
const MAX_BALL_SPEED = 8
const WINNING_SCORE = 5

// Colors
const COLORS = {
  background: '#0a0a0a',
  paddle: '#4ade80',
  ball: '#22d3ee',
  text: '#4ade80',
  textDim: '#166534',
  net: '#1a1a2e',
  score: '#fbbf24',
}

/**
 * Create initial Pong game state
 */
export function createPongState() {
  return {
    // Player paddle (left)
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    playerScore: 0,
    
    // AI paddle (right)
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiScore: 0,
    
    // Ball
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVX: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    ballVY: (Math.random() - 0.5) * INITIAL_BALL_SPEED,
    
    // Input
    moveUp: false,
    moveDown: false,
    
    // Game state
    paused: false,
    gameOver: false,
    winner: null,
  }
}

/**
 * Reset ball to center
 */
export function resetBall(state, direction = 1) {
  state.ballX = CANVAS_WIDTH / 2
  state.ballY = CANVAS_HEIGHT / 2
  state.ballVX = INITIAL_BALL_SPEED * direction
  state.ballVY = (Math.random() - 0.5) * INITIAL_BALL_SPEED
}

/**
 * Update Pong game state
 */
export function updatePong(state) {
  if (state.paused || state.gameOver) return state
  
  // Player movement
  if (state.moveUp) {
    state.playerY = Math.max(0, state.playerY - PADDLE_SPEED)
  }
  if (state.moveDown) {
    state.playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.playerY + PADDLE_SPEED)
  }
  
  // Simple AI - follows ball with some delay
  const aiCenter = state.aiY + PADDLE_HEIGHT / 2
  const aiSpeed = PADDLE_SPEED * 0.7 // Slower than player
  
  if (state.ballX > CANVAS_WIDTH * 0.3) { // Only react when ball is coming
    if (aiCenter < state.ballY - 10) {
      state.aiY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.aiY + aiSpeed)
    } else if (aiCenter > state.ballY + 10) {
      state.aiY = Math.max(0, state.aiY - aiSpeed)
    }
  }
  
  // Ball movement
  state.ballX += state.ballVX
  state.ballY += state.ballVY
  
  // Ball collision with top/bottom walls
  if (state.ballY <= 0 || state.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
    state.ballVY = -state.ballVY
    state.ballY = state.ballY <= 0 ? 0 : CANVAS_HEIGHT - BALL_SIZE
  }
  
  // Ball collision with player paddle (left)
  if (
    state.ballX <= PADDLE_WIDTH + 15 &&
    state.ballX >= 15 &&
    state.ballY + BALL_SIZE >= state.playerY &&
    state.ballY <= state.playerY + PADDLE_HEIGHT
  ) {
    // Bounce off paddle
    state.ballVX = Math.abs(state.ballVX) * 1.05 // Speed up slightly
    state.ballVX = Math.min(state.ballVX, MAX_BALL_SPEED)
    
    // Add angle based on where ball hit paddle
    const hitPos = (state.ballY - state.playerY) / PADDLE_HEIGHT
    state.ballVY = (hitPos - 0.5) * 8
    
    state.ballX = PADDLE_WIDTH + 16
  }
  
  // Ball collision with AI paddle (right)
  if (
    state.ballX + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH - 15 &&
    state.ballX <= CANVAS_WIDTH - 15 &&
    state.ballY + BALL_SIZE >= state.aiY &&
    state.ballY <= state.aiY + PADDLE_HEIGHT
  ) {
    // Bounce off paddle
    state.ballVX = -Math.abs(state.ballVX) * 1.05
    state.ballVX = Math.max(state.ballVX, -MAX_BALL_SPEED)
    
    // Add angle
    const hitPos = (state.ballY - state.aiY) / PADDLE_HEIGHT
    state.ballVY = (hitPos - 0.5) * 8
    
    state.ballX = CANVAS_WIDTH - PADDLE_WIDTH - 16 - BALL_SIZE
  }
  
  // Score - ball goes past paddles
  if (state.ballX < 0) {
    // AI scores
    state.aiScore++
    if (state.aiScore >= WINNING_SCORE) {
      state.gameOver = true
      state.winner = 'AI'
    } else {
      resetBall(state, 1) // Ball goes toward player
    }
  }
  
  if (state.ballX > CANVAS_WIDTH) {
    // Player scores
    state.playerScore++
    if (state.playerScore >= WINNING_SCORE) {
      state.gameOver = true
      state.winner = 'PLAYER'
    } else {
      resetBall(state, -1) // Ball goes toward AI
    }
  }
  
  return state
}

/**
 * Draw Pong menu
 */
export function drawPongMenu(ctx, highScore = 0) {
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Title
  ctx.font = 'bold 36px "Courier New", monospace'
  ctx.fillStyle = COLORS.ball
  ctx.textAlign = 'center'
  ctx.shadowColor = COLORS.ball
  ctx.shadowBlur = 15
  ctx.fillText('🏓 PONG', CANVAS_WIDTH / 2, 70)
  ctx.shadowBlur = 0
  
  // Subtitle
  ctx.font = '14px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('Classic Arcade Game', CANVAS_WIDTH / 2, 100)
  
  // Instructions
  ctx.font = '16px "Courier New", monospace'
  ctx.fillStyle = COLORS.text
  ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, 150)
  
  ctx.font = '14px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('↑ ↓ or W S to move paddle', CANVAS_WIDTH / 2, 180)
  ctx.fillText(`First to ${WINNING_SCORE} wins!`, CANVAS_WIDTH / 2, 205)
  
  // Win count
  if (highScore > 0) {
    ctx.fillStyle = COLORS.score
    ctx.fillText(`Wins: ${highScore}`, CANVAS_WIDTH / 2, 240)
  }
}

/**
 * Draw Pong game
 */
export function drawPongGame(ctx, state) {
  // Background
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Center net (dashed line)
  ctx.strokeStyle = COLORS.net
  ctx.lineWidth = 2
  ctx.setLineDash([10, 10])
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH / 2, 0)
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
  ctx.stroke()
  ctx.setLineDash([])
  
  // Scores
  ctx.font = 'bold 48px "Courier New", monospace'
  ctx.fillStyle = COLORS.score
  ctx.textAlign = 'center'
  ctx.globalAlpha = 0.3
  ctx.fillText(state.playerScore.toString(), CANVAS_WIDTH / 4, 70)
  ctx.fillText(state.aiScore.toString(), (CANVAS_WIDTH * 3) / 4, 70)
  ctx.globalAlpha = 1
  
  // Player paddle (left)
  ctx.shadowColor = COLORS.paddle
  ctx.shadowBlur = 8
  ctx.fillStyle = COLORS.paddle
  ctx.fillRect(15, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
  
  // AI paddle (right)
  ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH - 15, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ctx.shadowBlur = 0
  
  // Ball
  ctx.shadowColor = COLORS.ball
  ctx.shadowBlur = 12
  ctx.fillStyle = COLORS.ball
  ctx.beginPath()
  ctx.arc(state.ballX + BALL_SIZE / 2, state.ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  
  // Labels
  ctx.font = '12px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.textAlign = 'left'
  ctx.fillText('YOU', 15, CANVAS_HEIGHT - 10)
  ctx.textAlign = 'right'
  ctx.fillText('CPU', CANVAS_WIDTH - 15, CANVAS_HEIGHT - 10)
}

/**
 * Draw Pong paused
 */
export function drawPongPaused(ctx, state) {
  drawPongGame(ctx, state)
  
  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Paused text
  ctx.font = 'bold 28px "Courier New", monospace'
  ctx.fillStyle = COLORS.ball
  ctx.textAlign = 'center'
  ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
  
  ctx.font = '14px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('Press SPACE to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
}

/**
 * Draw Pong game over
 */
export function drawPongGameOver(ctx, state) {
  drawPongGame(ctx, state)
  
  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Result
  const isWinner = state.winner === 'PLAYER'
  ctx.font = 'bold 32px "Courier New", monospace'
  ctx.fillStyle = isWinner ? COLORS.paddle : '#ef4444'
  ctx.textAlign = 'center'
  ctx.shadowColor = ctx.fillStyle
  ctx.shadowBlur = 10
  ctx.fillText(isWinner ? '🎉 YOU WIN!' : '💀 GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30)
  ctx.shadowBlur = 0
  
  // Final score
  ctx.font = '18px "Courier New", monospace'
  ctx.fillStyle = COLORS.score
  ctx.fillText(`${state.playerScore} - ${state.aiScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10)
  
  // Instructions
  ctx.font = '14px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('Press SPACE to Play Again', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 45)
}

export const PONG_CONSTANTS = {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WINNING_SCORE,
}
