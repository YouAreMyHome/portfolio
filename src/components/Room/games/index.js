/**
 * Games Module - Barrel Export
 * 
 * Centralized exports for the arcade games system
 */

// Shared constants and utilities
export {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GAME_COLORS,
  FONTS,
  drawUtils,
  GAME_STATES,
  STORAGE_KEYS,
} from './constants'

// Game registry (main interface for TVScreen)
export {
  GAME_REGISTRY,
  getGameList,
  getGame,
  loadGameScore,
  saveGameScore,
  isNewHighScore,
} from './gameRegistry'

// Individual games (for direct access if needed)
export * from './SnakeGame'
export * from './PongGame'
export * from './TetrisGame'
export * from './DinoGame'
