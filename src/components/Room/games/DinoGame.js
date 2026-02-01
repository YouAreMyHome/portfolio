/**
 * Dino Run Game Logic - Chrome Dino Clone
 * 
 * Classic endless runner - jump over obstacles!
 */

const CANVAS_WIDTH = 460
const CANVAS_HEIGHT = 260

// Game constants
const GROUND_Y = 200
const GRAVITY = 0.6           // Giảm để nhảy mượt hơn
const JUMP_FORCE = -12        // Giảm để cân bằng với gravity thấp hơn
const INITIAL_SPEED = 4       // Bắt đầu chậm hơn
const MAX_SPEED = 11          // Giới hạn tốc độ tối đa
const SPEED_INCREMENT = 0.0008 // Tăng chậm hơn

// Dino dimensions
const DINO_WIDTH = 40
const DINO_HEIGHT = 44
const DINO_X = 50

// Obstacle dimensions
const CACTUS_WIDTH = 20
const CACTUS_HEIGHT_SMALL = 30  // Giảm để dễ nhảy qua hơn
const CACTUS_HEIGHT_LARGE = 45
const BIRD_WIDTH = 40
const BIRD_HEIGHT = 26         // Giảm để dễ tránh hơn

// Spawn timing (in distance units)
const WARM_UP_DISTANCE = 150   // Không spawn obstacle trong khoảng đầu
const MIN_SPAWN_GAP = 180      // Gap tối thiểu giữa obstacles
const MAX_SPAWN_GAP = 350      // Gap tối đa

// Colors
const COLORS = {
  background: '#0a0a0a',
  ground: '#333',
  dino: '#4ade80',
  cactus: '#22c55e',
  bird: '#f472b6',
  text: '#4ade80',
  textDim: '#166534',
  cloud: '#1a1a2e',
  score: '#fbbf24',
}

/**
 * Create initial Dino game state
 */
export function createDinoState() {
  return {
    // Dino
    dinoY: GROUND_Y - DINO_HEIGHT,
    dinoVelocity: 0,
    isJumping: false,
    isDucking: false,
    
    // Game
    speed: INITIAL_SPEED,
    score: 0,
    distance: 0,
    
    // Obstacles - cải thiện spawning
    obstacles: [],
    nextObstacleDistance: WARM_UP_DISTANCE, // Khoảng cách để spawn obstacle tiếp theo
    
    // Clouds (decoration)
    clouds: [
      { x: 100, y: 50 },
      { x: 250, y: 70 },
      { x: 400, y: 40 },
    ],
    
    // Ground details for parallax effect
    groundDetails: [
      { x: 50, type: 'small' },
      { x: 150, type: 'large' },
      { x: 280, type: 'small' },
      { x: 380, type: 'small' },
    ],
    
    // Animation
    dinoFrame: 0,
    frameCount: 0,
    
    // State
    gameOver: false,
  }
}

/**
 * Calculate jump height at current speed
 * Dùng để đảm bảo obstacles có thể nhảy qua được
 */
function getMaxJumpHeight() {
  // Physics: v² = v0² + 2*a*s => s = v0² / (2*g)
  const jumpHeight = (JUMP_FORCE * JUMP_FORCE) / (2 * GRAVITY)
  return jumpHeight
}

/**
 * Calculate minimum gap needed to react and jump
 */
function getMinGapForSpeed(speed) {
  // Player cần khoảng 15-20 frames để react và nhảy
  // Gap = speed * reaction_frames + safety_margin
  const reactionFrames = 18
  const safetyMargin = 60
  return Math.max(MIN_SPAWN_GAP, speed * reactionFrames + safetyMargin)
}

/**
 * Create a random obstacle - cải thiện logic
 */
function createObstacle(x, speed, score) {
  const rand = Math.random()
  
  // Bird chỉ xuất hiện sau khi đạt score 50 và speed > 6
  // Tỷ lệ bird tăng dần theo score
  const canSpawnBird = score > 50 && speed > 6
  const birdChance = canSpawnBird ? Math.min(0.25, (score - 50) / 400) : 0
  
  if (rand < birdChance) {
    // Flying bird - 2 độ cao: thấp (cần nhảy) hoặc cao (cần cúi - nhưng ta không có cúi nên bay cao để nhảy qua)
    // Chỉ spawn bird ở độ cao mà dino có thể nhảy qua hoặc chạy dưới
    const birdY = Math.random() > 0.6 
      ? GROUND_Y - 30  // Thấp - cần nhảy qua
      : GROUND_Y - 75  // Cao - chạy dưới được
    return {
      type: 'bird',
      x,
      y: birdY,
      width: BIRD_WIDTH,
      height: BIRD_HEIGHT,
    }
  } else {
    // Cactus - điều chỉnh độ khó theo score
    const isLarge = score > 30 && Math.random() > 0.5
    // Số lượng cactus tăng theo score: 1 cactus đầu, sau đó có thể 2-3
    const maxCount = score < 20 ? 1 : (score < 80 ? 2 : 3)
    const count = Math.floor(Math.random() * maxCount) + 1
    
    return {
      type: 'cactus',
      x,
      y: GROUND_Y - (isLarge ? CACTUS_HEIGHT_LARGE : CACTUS_HEIGHT_SMALL),
      width: CACTUS_WIDTH * count + (count - 1) * 2, // Thêm gap giữa các cactus
      height: isLarge ? CACTUS_HEIGHT_LARGE : CACTUS_HEIGHT_SMALL,
      count,
      isLarge,
    }
  }
}

/**
 * Update Dino game state - cải thiện logic
 */
export function updateDino(state, jumpPressed) {
  if (state.gameOver) return state
  
  // Jump - chỉ cho phép nhảy khi đang trên mặt đất
  const onGround = state.dinoY >= GROUND_Y - DINO_HEIGHT - 1
  if (jumpPressed && !state.isJumping && onGround) {
    state.dinoVelocity = JUMP_FORCE
    state.isJumping = true
  }
  
  // Apply gravity
  state.dinoVelocity += GRAVITY
  state.dinoY += state.dinoVelocity
  
  // Ground collision
  if (state.dinoY >= GROUND_Y - DINO_HEIGHT) {
    state.dinoY = GROUND_Y - DINO_HEIGHT
    state.dinoVelocity = 0
    state.isJumping = false
  }
  
  // Update speed và score
  // Speed tăng chậm dần khi gần max
  const speedProgress = (state.speed - INITIAL_SPEED) / (MAX_SPEED - INITIAL_SPEED)
  const adjustedIncrement = SPEED_INCREMENT * (1 - speedProgress * 0.5)
  state.speed = Math.min(MAX_SPEED, state.speed + adjustedIncrement)
  
  state.distance += state.speed
  state.score = Math.floor(state.distance / 10)
  
  // Animation frame
  state.frameCount++
  if (state.frameCount % 5 === 0) {
    state.dinoFrame = (state.dinoFrame + 1) % 2
  }
  
  // Spawn obstacles - thuật toán mới
  if (state.distance >= state.nextObstacleDistance) {
    state.obstacles.push(createObstacle(CANVAS_WIDTH + 20, state.speed, state.score))
    
    // Tính khoảng cách đến obstacle tiếp theo
    const minGap = getMinGapForSpeed(state.speed)
    const gapRange = MAX_SPAWN_GAP - minGap
    // Random gap, nhưng đảm bảo luôn >= minGap
    state.nextObstacleDistance = state.distance + minGap + Math.random() * gapRange
  }
  
  // Update obstacles
  state.obstacles = state.obstacles.filter(obs => {
    obs.x -= state.speed
    return obs.x > -obs.width - 10
  })
  
  // Update clouds (parallax chậm hơn)
  state.clouds.forEach(cloud => {
    cloud.x -= state.speed * 0.2
    if (cloud.x < -50) {
      cloud.x = CANVAS_WIDTH + 30 + Math.random() * 50
      cloud.y = 25 + Math.random() * 50
    }
  })
  
  // Update ground details
  state.groundDetails.forEach(detail => {
    detail.x -= state.speed * 0.8
    if (detail.x < -20) {
      detail.x = CANVAS_WIDTH + Math.random() * 100
      detail.type = Math.random() > 0.5 ? 'small' : 'large'
    }
  })
  
  // Collision detection - hitbox thu nhỏ để fair hơn
  const dinoHitbox = {
    x: DINO_X + 8,           // Padding nhiều hơn
    y: state.dinoY + 8,
    width: DINO_WIDTH - 16,  // Hitbox nhỏ hơn sprite
    height: DINO_HEIGHT - 12,
  }
  
  for (const obs of state.obstacles) {
    // Obstacle hitbox cũng thu nhỏ
    const padding = obs.type === 'bird' ? 6 : 4
    const obsHitbox = {
      x: obs.x + padding,
      y: obs.y + padding,
      width: obs.width - padding * 2,
      height: obs.height - padding * 2,
    }
    
    // AABB collision
    if (
      dinoHitbox.x < obsHitbox.x + obsHitbox.width &&
      dinoHitbox.x + dinoHitbox.width > obsHitbox.x &&
      dinoHitbox.y < obsHitbox.y + obsHitbox.height &&
      dinoHitbox.y + dinoHitbox.height > obsHitbox.y
    ) {
      state.gameOver = true
      break
    }
  }
  
  return state
}

/**
 * Draw Dino menu
 */
export function drawDinoMenu(ctx, highScore = 0) {
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Ground line
  ctx.strokeStyle = COLORS.ground
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
  ctx.stroke()
  
  // Title
  ctx.font = 'bold 32px "Courier New", monospace'
  ctx.fillStyle = COLORS.dino
  ctx.textAlign = 'center'
  ctx.shadowColor = COLORS.dino
  ctx.shadowBlur = 12
  ctx.fillText('🦖 DINO RUN', CANVAS_WIDTH / 2, 70)
  ctx.shadowBlur = 0
  
  // Draw a little dino
  drawDino(ctx, CANVAS_WIDTH / 2 - 20, GROUND_Y - DINO_HEIGHT, 0, false)
  
  // Instructions
  ctx.font = '16px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('Press SPACE or ↑ to Jump', CANVAS_WIDTH / 2, 140)
  ctx.fillText('Avoid the obstacles!', CANVAS_WIDTH / 2, 165)
  
  // High score
  if (highScore > 0) {
    ctx.font = '14px "Courier New", monospace'
    ctx.fillStyle = COLORS.score
    ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH / 2, 230)
  }
  
  ctx.font = '14px "Courier New", monospace'
  ctx.fillStyle = COLORS.text
  ctx.fillText('Press SPACE to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20)
}

/**
 * Draw the dino character
 */
function drawDino(ctx, x, y, frame, isJumping) {
  ctx.fillStyle = COLORS.dino
  ctx.shadowColor = COLORS.dino
  ctx.shadowBlur = 6
  
  // Body
  ctx.fillRect(x + 10, y + 5, 25, 25)
  
  // Head
  ctx.fillRect(x + 20, y - 5, 20, 15)
  
  // Eye
  ctx.fillStyle = COLORS.background
  ctx.fillRect(x + 32, y - 2, 4, 4)
  ctx.fillStyle = COLORS.dino
  
  // Tail
  ctx.fillRect(x, y + 10, 15, 10)
  
  // Legs (animated)
  if (isJumping) {
    // Both legs down when jumping
    ctx.fillRect(x + 12, y + 30, 6, 14)
    ctx.fillRect(x + 24, y + 30, 6, 14)
  } else {
    // Running animation
    if (frame === 0) {
      ctx.fillRect(x + 12, y + 30, 6, 14)
      ctx.fillRect(x + 24, y + 28, 6, 10)
    } else {
      ctx.fillRect(x + 12, y + 28, 6, 10)
      ctx.fillRect(x + 24, y + 30, 6, 14)
    }
  }
  
  ctx.shadowBlur = 0
}

/**
 * Draw a cactus
 */
function drawCactus(ctx, obs) {
  ctx.fillStyle = COLORS.cactus
  ctx.shadowColor = COLORS.cactus
  ctx.shadowBlur = 4
  
  const singleWidth = CACTUS_WIDTH - 4
  for (let i = 0; i < obs.count; i++) {
    const cx = obs.x + i * (singleWidth + 2)
    const cy = obs.y
    const ch = obs.height
    
    // Main stem
    ctx.fillRect(cx + 6, cy, 8, ch)
    
    // Arms
    if (obs.isLarge) {
      ctx.fillRect(cx, cy + 10, 8, 6)
      ctx.fillRect(cx, cy + 10, 6, 15)
      ctx.fillRect(cx + 12, cy + 20, 8, 6)
      ctx.fillRect(cx + 14, cy + 15, 6, 15)
    } else {
      ctx.fillRect(cx + 2, cy + 8, 6, 4)
      ctx.fillRect(cx + 12, cy + 12, 6, 4)
    }
  }
  
  ctx.shadowBlur = 0
}

/**
 * Draw a bird
 */
function drawBird(ctx, obs, frame) {
  ctx.fillStyle = COLORS.bird
  ctx.shadowColor = COLORS.bird
  ctx.shadowBlur = 6
  
  const x = obs.x
  const y = obs.y
  
  // Body
  ctx.fillRect(x + 10, y + 12, 25, 10)
  
  // Head
  ctx.fillRect(x + 30, y + 8, 10, 12)
  
  // Beak
  ctx.fillStyle = COLORS.score
  ctx.fillRect(x + 38, y + 12, 6, 4)
  ctx.fillStyle = COLORS.bird
  
  // Wings (animated)
  if (frame % 2 === 0) {
    ctx.fillRect(x + 12, y + 2, 18, 10)
  } else {
    ctx.fillRect(x + 12, y + 22, 18, 8)
  }
  
  ctx.shadowBlur = 0
}

/**
 * Draw Dino game
 */
export function drawDinoGame(ctx, state) {
  // Background
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Clouds
  ctx.fillStyle = COLORS.cloud
  state.clouds.forEach(cloud => {
    ctx.beginPath()
    ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2)
    ctx.arc(cloud.x + 20, cloud.y - 5, 12, 0, Math.PI * 2)
    ctx.arc(cloud.x + 35, cloud.y, 10, 0, Math.PI * 2)
    ctx.fill()
  })
  
  // Ground
  ctx.strokeStyle = COLORS.ground
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, GROUND_Y)
  ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
  ctx.stroke()
  
  // Ground details (rocks, grass, etc.)
  ctx.fillStyle = '#2a2a2a'
  if (state.groundDetails) {
    state.groundDetails.forEach(detail => {
      if (detail.type === 'small') {
        ctx.fillRect(detail.x, GROUND_Y + 4, 3, 2)
      } else {
        ctx.fillRect(detail.x, GROUND_Y + 3, 5, 3)
        ctx.fillRect(detail.x + 2, GROUND_Y + 6, 2, 2)
      }
    })
  }
  
  // Additional ground texture (scrolling dots)
  ctx.fillStyle = '#222'
  for (let i = 0; i < 20; i++) {
    const gx = ((i * 30 - state.distance * 0.8) % (CANVAS_WIDTH + 60)) - 30
    ctx.fillRect(gx, GROUND_Y + 8, 2, 1)
  }
  
  // Obstacles
  state.obstacles.forEach(obs => {
    if (obs.type === 'cactus') {
      drawCactus(ctx, obs)
    } else if (obs.type === 'bird') {
      drawBird(ctx, obs, state.frameCount)
    }
  })
  
  // Dino
  drawDino(ctx, DINO_X, state.dinoY, state.dinoFrame, state.isJumping)
  
  // Score HUD
  ctx.font = 'bold 16px "Courier New", monospace'
  ctx.fillStyle = COLORS.text
  ctx.textAlign = 'right'
  ctx.fillText(`${state.score.toString().padStart(5, '0')}`, CANVAS_WIDTH - 20, 30)
}

/**
 * Draw Dino paused
 */
export function drawDinoPaused(ctx, state) {
  drawDinoGame(ctx, state)
  
  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Paused text
  ctx.font = 'bold 28px "Courier New", monospace'
  ctx.fillStyle = COLORS.dino
  ctx.textAlign = 'center'
  ctx.fillText('⏸️ PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
  
  ctx.font = '14px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('Press SPACE to Resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)
}

/**
 * Draw Dino game over
 */
export function drawDinoGameOver(ctx, state, highScore) {
  drawDinoGame(ctx, state)
  
  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  
  // Game Over
  ctx.font = 'bold 32px "Courier New", monospace'
  ctx.fillStyle = '#ef4444'
  ctx.textAlign = 'center'
  ctx.shadowColor = '#ef4444'
  ctx.shadowBlur = 10
  ctx.fillText('💀 GAME OVER', CANVAS_WIDTH / 2, 80)
  ctx.shadowBlur = 0
  
  // Score
  ctx.font = 'bold 24px "Courier New", monospace'
  ctx.fillStyle = COLORS.score
  ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH / 2, 130)
  
  // New high score?
  if (state.score > highScore && state.score > 0) {
    ctx.font = '18px "Courier New", monospace'
    ctx.fillStyle = COLORS.score
    ctx.fillText('🎉 NEW HIGH SCORE!', CANVAS_WIDTH / 2, 160)
  }
  
  // Instructions
  ctx.font = '14px "Courier New", monospace'
  ctx.fillStyle = COLORS.textDim
  ctx.fillText('Press SPACE to Retry', CANVAS_WIDTH / 2, 210)
  ctx.fillText('Press ESC to Exit', CANVAS_WIDTH / 2, 235)
}

export const DINO_CONSTANTS = {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
}
