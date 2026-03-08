/**
 * Tetris Game Logic
 *
 * Canvas 460×260 (landscape):
 *   Board : 10 cols × 20 rows, cell = 12px  → 120×240px (left side)
 *   Panel : x=142 onwards                    → score, next piece, controls
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_COLORS } from './constants'

// ── Constants ────────────────────────────────────────────────────────────────

const COLS = 10
const ROWS = 20
const CELL = 12

const BOARD_X = 8           // board left edge
const BOARD_Y = 10          // board top edge
const PANEL_X = BOARD_X + COLS * CELL + 14  // = 142

// Classic Tetris scoring (×level)
const LINE_SCORES = [0, 100, 300, 500, 800]

// Drop speed in ms per level (index = level-1, capped at 10)
const SPEEDS = [800, 720, 630, 550, 470, 380, 300, 220, 160, 120, 90]

// Tetromino shapes (2D boolean matrix + color)
const SHAPES = {
  I: {
    matrix: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    color: '#22d3ee',
  },
  O: {
    matrix: [[1,1],[1,1]],
    color: '#fbbf24',
  },
  T: {
    matrix: [[0,1,0],[1,1,1],[0,0,0]],
    color: '#a855f7',
  },
  S: {
    matrix: [[0,1,1],[1,1,0],[0,0,0]],
    color: '#4ade80',
  },
  Z: {
    matrix: [[1,1,0],[0,1,1],[0,0,0]],
    color: '#ef4444',
  },
  J: {
    matrix: [[1,0,0],[1,1,1],[0,0,0]],
    color: '#3b82f6',
  },
  L: {
    matrix: [[0,0,1],[1,1,1],[0,0,0]],
    color: '#f97316',
  },
}

const PIECE_TYPES = Object.keys(SHAPES)

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomType() {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]
}

/** Rotate matrix 90° clockwise */
function rotateMatrix(matrix) {
  const rows = matrix.length
  const cols = matrix[0].length
  const result = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][rows - 1 - r] = matrix[r][c]
    }
  }
  return result
}

function makePiece(type) {
  const shape = SHAPES[type]
  const matrix = shape.matrix.map(row => [...row])
  return {
    type,
    matrix,
    color: shape.color,
    x: Math.floor((COLS - matrix[0].length) / 2),
    y: 0,
  }
}

function collides(board, matrix, px, py) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue
      const bx = px + c
      const by = py + r
      if (bx < 0 || bx >= COLS || by >= ROWS) return true
      if (by >= 0 && board[by][bx] !== null) return true
    }
  }
  return false
}

function lockPiece(state) {
  const { current, board } = state
  let topOut = false
  for (let r = 0; r < current.matrix.length; r++) {
    for (let c = 0; c < current.matrix[r].length; c++) {
      if (!current.matrix[r][c]) continue
      const by = current.y + r
      const bx = current.x + c
      if (by < 0) { topOut = true; continue }
      board[by][bx] = current.color
    }
  }
  if (topOut) state.gameOver = true
}

function clearLines(state) {
  let count = 0
  for (let r = ROWS - 1; r >= 0; ) {
    if (state.board[r].every(cell => cell !== null)) {
      state.board.splice(r, 1)
      state.board.unshift(Array(COLS).fill(null))
      count++
      // don't decrement r — same index is a new row
    } else {
      r--
    }
  }
  return count
}

function getGhostY(state) {
  let gy = state.current.y
  while (!collides(state.board, state.current.matrix, state.current.x, gy + 1)) {
    gy++
  }
  return gy
}

function spawnNext(state) {
  state.current = {
    ...state.next,
    x: Math.floor((COLS - state.next.matrix[0].length) / 2),
    y: 0,
  }
  state.next = makePiece(randomType())
  if (collides(state.board, state.current.matrix, state.current.x, state.current.y)) {
    state.gameOver = true
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export function createTetrisState() {
  const first = randomType()
  const next  = randomType()
  return {
    board:     Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    current:   makePiece(first),
    next:      makePiece(next),
    score:     0,
    level:     1,
    lines:     0,
    gameOver:  false,
    softDrop:  false,     // set true while ArrowDown held
  }
}

/** Called by game loop to get current drop interval (ms) */
export function getTetrisSpeed(state) {
  if (state.softDrop) return 50
  const idx = Math.min(state.level - 1, SPEEDS.length - 1)
  return SPEEDS[idx]
}

/** Move left/right — call on keydown */
export function moveTetris(state, dx) {
  const nx = state.current.x + dx
  if (!collides(state.board, state.current.matrix, nx, state.current.y)) {
    state.current.x = nx
  }
}

/** Rotate clockwise with wall-kick — call on keydown */
export function rotateTetris(state) {
  const rotated = rotateMatrix(state.current.matrix)
  for (const kick of [0, 1, -1, 2, -2]) {
    if (!collides(state.board, rotated, state.current.x + kick, state.current.y)) {
      state.current.matrix = rotated
      state.current.x += kick
      return
    }
  }
}

/** Instantly drop to bottom — call on keydown Space */
export function hardDropTetris(state) {
  const gy = getGhostY(state)
  state.score += (gy - state.current.y) * 2
  state.current.y = gy
  // trigger a lock immediately
  lockPiece(state)
  if (!state.gameOver) {
    const cleared = clearLines(state)
    if (cleared > 0) {
      state.score += LINE_SCORES[cleared] * state.level
      state.lines += cleared
      state.level = Math.floor(state.lines / 10) + 1
    }
    spawnNext(state)
  }
}

/**
 * Drop piece 1 row — called by game loop at getTetrisSpeed() interval
 * Returns false if game over
 */
export function updateTetris(state) {
  if (state.gameOver) return false

  if (!collides(state.board, state.current.matrix, state.current.x, state.current.y + 1)) {
    state.current.y++
  } else {
    lockPiece(state)
    if (state.gameOver) return false

    const cleared = clearLines(state)
    if (cleared > 0) {
      state.score += LINE_SCORES[cleared] * state.level
      state.lines += cleared
      state.level = Math.floor(state.lines / 10) + 1
    }
    spawnNext(state)
    if (state.gameOver) return false
  }

  return true
}

// ── Draw helpers ─────────────────────────────────────────────────────────────

function drawCell(ctx, bx, by, color, alpha = 1) {
  const x = BOARD_X + bx * CELL
  const y = BOARD_Y + by * CELL
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2)
  // highlight edge
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  ctx.fillRect(x + 1, y + 1, CELL - 2, 2)
  ctx.fillRect(x + 1, y + 1, 2, CELL - 2)
  // shadow edge
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.fillRect(x + 1, y + CELL - 3, CELL - 2, 2)
  ctx.fillRect(x + CELL - 3, y + 1, 2, CELL - 2)
  ctx.globalAlpha = 1
}

function drawBoard(ctx, board) {
  // border
  ctx.strokeStyle = '#1e3a2a'
  ctx.lineWidth = 1
  ctx.strokeRect(BOARD_X - 1, BOARD_Y - 1, COLS * CELL + 2, ROWS * CELL + 2)
  // grid lines
  ctx.strokeStyle = '#111'
  ctx.lineWidth = 0.5
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.strokeRect(BOARD_X + c * CELL, BOARD_Y + r * CELL, CELL, CELL)
    }
  }
  // placed cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) drawCell(ctx, c, r, board[r][c])
    }
  }
}

function drawActivePiece(ctx, state) {
  const ghostY = getGhostY(state)
  const { current } = state
  // ghost
  if (ghostY !== current.y) {
    for (let r = 0; r < current.matrix.length; r++) {
      for (let c = 0; c < current.matrix[r].length; c++) {
        if (current.matrix[r][c]) drawCell(ctx, current.x + c, ghostY + r, current.color, 0.15)
      }
    }
  }
  // piece
  for (let r = 0; r < current.matrix.length; r++) {
    for (let c = 0; c < current.matrix[r].length; c++) {
      if (current.matrix[r][c]) drawCell(ctx, current.x + c, current.y + r, current.color)
    }
  }
}

function drawSidePanel(ctx, state, highScore) {
  const x = PANEL_X
  const MINI = 10 // mini cell size for next preview

  // ── Score ──
  ctx.font = '10px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textDim
  ctx.textAlign = 'left'
  ctx.fillText('SCORE', x, BOARD_Y + 10)

  ctx.font = 'bold 15px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textHighlight
  ctx.fillText(state.score.toString(), x, BOARD_Y + 24)

  // ── Level & Lines ──
  ctx.font = '10px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textDim
  ctx.fillText(`LVL  ${state.level}`, x, BOARD_Y + 40)
  ctx.fillText(`LINE ${state.lines}`, x, BOARD_Y + 52)

  if (highScore > 0) {
    ctx.font = '10px "Courier New", monospace'
    ctx.fillStyle = GAME_COLORS.textDim
    ctx.fillText(`BEST ${highScore}`, x, BOARD_Y + 64)
  }

  // ── Next piece ──
  const ny = BOARD_Y + 82
  ctx.font = '10px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textDim
  ctx.fillText('NEXT', x, ny - 4)

  const matrix = state.next.matrix
  const offsetX = x + Math.floor((4 - matrix[0].length) / 2) * MINI
  const offsetY = ny + Math.floor((4 - matrix.length) / 2) * MINI

  // Preview box
  ctx.strokeStyle = '#1e3a2a'
  ctx.lineWidth = 1
  ctx.strokeRect(x - 2, ny, 4 * MINI + 4, 4 * MINI + 4)

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        const px = offsetX + c * MINI
        const py = offsetY + r * MINI
        ctx.fillStyle = state.next.color
        ctx.fillRect(px + 1, py + 1, MINI - 2, MINI - 2)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
        ctx.fillRect(px + 1, py + 1, MINI - 2, 2)
      }
    }
  }

  // ── Controls hint ──
  const hy = CANVAS_HEIGHT - 68
  ctx.font = '9px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textDim
  const hints = ['← → MOVE', '↑  ROTATE', '↓  SOFT DROP', 'SPC HARD DROP', 'P   PAUSE']
  hints.forEach((line, i) => ctx.fillText(line, x, hy + i * 12))
}

// ── Screen draw functions ─────────────────────────────────────────────────────

export function drawTetrisMenu(ctx, highScore) {
  ctx.fillStyle = GAME_COLORS.background
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Decorative board outline
  ctx.strokeStyle = '#1e3a2a'
  ctx.lineWidth = 1
  ctx.strokeRect(BOARD_X - 1, BOARD_Y - 1, COLS * CELL + 2, ROWS * CELL + 2)

  // Decorative stacked blocks
  const deco = [
    { r: 15, c: 0, color: '#3b82f6' }, { r: 15, c: 1, color: '#3b82f6' }, { r: 15, c: 2, color: '#3b82f6' },
    { r: 15, c: 3, color: '#a855f7' }, { r: 15, c: 4, color: '#a855f7' },
    { r: 16, c: 0, color: '#ef4444' }, { r: 16, c: 1, color: '#ef4444' }, { r: 16, c: 2, color: '#ef4444' }, { r: 16, c: 3, color: '#ef4444' },
    { r: 16, c: 5, color: '#fbbf24' }, { r: 16, c: 6, color: '#fbbf24' },
    { r: 17, c: 0, color: '#4ade80' }, { r: 17, c: 1, color: '#4ade80' }, { r: 17, c: 2, color: '#4ade80' }, { r: 17, c: 3, color: '#4ade80' },
    { r: 17, c: 4, color: '#22d3ee' }, { r: 17, c: 5, color: '#22d3ee' }, { r: 17, c: 6, color: '#22d3ee' }, { r: 17, c: 7, color: '#22d3ee' },
    { r: 18, c: 0, color: '#f97316' }, { r: 18, c: 1, color: '#3b82f6' }, { r: 18, c: 2, color: '#4ade80' }, { r: 18, c: 3, color: '#ef4444' },
    { r: 18, c: 4, color: '#a855f7' }, { r: 18, c: 5, color: '#fbbf24' }, { r: 18, c: 6, color: '#22d3ee' }, { r: 18, c: 7, color: '#f97316' },
    { r: 18, c: 8, color: '#4ade80' }, { r: 18, c: 9, color: '#3b82f6' },
    { r: 19, c: 0, color: '#22d3ee' }, { r: 19, c: 1, color: '#22d3ee' }, { r: 19, c: 2, color: '#22d3ee' }, { r: 19, c: 3, color: '#22d3ee' },
    { r: 19, c: 4, color: '#22d3ee' }, { r: 19, c: 5, color: '#22d3ee' }, { r: 19, c: 6, color: '#22d3ee' }, { r: 19, c: 7, color: '#22d3ee' },
    { r: 19, c: 8, color: '#22d3ee' }, { r: 19, c: 9, color: '#22d3ee' },
  ]
  deco.forEach(({ r, c, color }) => drawCell(ctx, c, r, color))

  // Title
  const midX = PANEL_X + (CANVAS_WIDTH - PANEL_X) / 2
  ctx.font = 'bold 26px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.text
  ctx.textAlign = 'center'
  ctx.shadowColor = GAME_COLORS.text
  ctx.shadowBlur = 12
  ctx.fillText('TETRIS', midX, 50)
  ctx.shadowBlur = 0

  if (highScore > 0) {
    ctx.font = '12px "Courier New", monospace'
    ctx.fillStyle = GAME_COLORS.textHighlight
    ctx.fillText(`BEST: ${highScore}`, midX, 68)
  }

  // Controls
  ctx.textAlign = 'left'
  ctx.font = '10px "Courier New", monospace'
  const hints = [
    ['← →', 'Move'],
    ['↑', 'Rotate'],
    ['↓', 'Soft Drop'],
    ['SPACE', 'Hard Drop'],
    ['P', 'Pause'],
  ]
  hints.forEach(([key, desc], i) => {
    const hy = 92 + i * 16
    ctx.fillStyle = GAME_COLORS.textHighlight
    ctx.fillText(key.padEnd(7), PANEL_X + 2, hy)
    ctx.fillStyle = GAME_COLORS.textDim
    ctx.fillText(desc, PANEL_X + 58, hy)
  })

  ctx.textAlign = 'center'
  ctx.font = '11px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.text
  ctx.fillText('PRESS SPACE TO START', midX, CANVAS_HEIGHT - 16)
}

export function drawTetrisGame(ctx, state, highScore) {
  ctx.fillStyle = GAME_COLORS.background
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  drawBoard(ctx, state.board)
  if (!state.gameOver) drawActivePiece(ctx, state)
  drawSidePanel(ctx, state, highScore)
}

export function drawTetrisPaused(ctx, state, highScore) {
  drawTetrisGame(ctx, state, highScore)
  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.font = 'bold 22px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.text
  ctx.textAlign = 'center'
  ctx.shadowColor = GAME_COLORS.text
  ctx.shadowBlur = 10
  ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
  ctx.shadowBlur = 0
  ctx.font = '12px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textDim
  ctx.fillText('P or SPACE to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 12)
}

export function drawTetrisGameOver(ctx, state, highScore) {
  drawTetrisGame(ctx, state, highScore)
  ctx.fillStyle = 'rgba(0,0,0,0.72)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  ctx.textAlign = 'center'
  ctx.font = 'bold 22px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textError
  ctx.shadowColor = GAME_COLORS.textError
  ctx.shadowBlur = 12
  ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 24)
  ctx.shadowBlur = 0
  ctx.font = 'bold 16px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textHighlight
  ctx.fillText(`SCORE: ${state.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 2)
  if (state.score > 0 && state.score >= highScore) {
    ctx.font = '12px "Courier New", monospace'
    ctx.fillStyle = GAME_COLORS.text
    ctx.shadowColor = GAME_COLORS.text
    ctx.shadowBlur = 6
    ctx.fillText('✨ NEW HIGH SCORE! ✨', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 22)
    ctx.shadowBlur = 0
  }
  ctx.font = '11px "Courier New", monospace'
  ctx.fillStyle = GAME_COLORS.textDim
  ctx.fillText('SPACE to restart  |  ESC to exit', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 44)
}
