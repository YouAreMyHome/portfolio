/**
 * Grid Utilities for 3D Scene Layout
 * Provides functions for snapping positions to grid and debugging
 */

// Grid size constant - all objects should align to this
export const GRID_SIZE = 0.5

/**
 * Snap a single value to the nearest grid point
 * @param {number} value - The value to snap
 * @param {number} gridSize - Grid size (default 0.5)
 * @returns {number} Snapped value
 */
export function snapToGrid(value, gridSize = GRID_SIZE) {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Snap a position array [x, y, z] to grid
 * @param {number[]} position - [x, y, z] position array
 * @param {number} gridSize - Grid size (default 0.5)
 * @returns {number[]} Snapped position array
 */
export function snapPositionToGrid(position, gridSize = GRID_SIZE) {
  return [
    snapToGrid(position[0], gridSize),
    snapToGrid(position[1], gridSize),
    snapToGrid(position[2], gridSize)
  ]
}

/**
 * Create a position that snaps X and Z to grid, but keeps Y as-is
 * Useful for objects that need precise Y positioning (like on top of desk)
 * @param {number} x - X position
 * @param {number} y - Y position (not snapped)
 * @param {number} z - Z position
 * @returns {number[]} Position array
 */
export function gridPos(x, y, z) {
  return [snapToGrid(x), y, snapToGrid(z)]
}

/**
 * Create a fully snapped position
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position
 * @returns {number[]} Position array
 */
export function gridPosAll(x, y, z) {
  return [snapToGrid(x), snapToGrid(y), snapToGrid(z)]
}

/**
 * Standard positions for room layout (pre-calculated grid-snapped)
 */
export const ROOM_LAYOUT = {
  // Room boundaries
  ROOM_SIZE: 8, // 8x8 units
  WALL_THICKNESS: 0.12,
  
  // Wall positions (snapped to grid)
  BACK_WALL_Z: -4,
  LEFT_WALL_X: -4,
  
  // Floor level
  FLOOR_Y: 0,
  
  // Standard furniture heights
  DESK_TOP_Y: 0.75,
  BED_TOP_Y: 0.5,
  CHAIR_SEAT_Y: 0.5,
  
  // Zone definitions (grid-snapped)
  ZONES: {
    WORKSPACE: { x: 2, z: -2 },    // Right side, desk area
    REST: { x: -2.5, z: 0.5 },     // Left side, bed area
    ENTERTAINMENT: { x: -1, z: -3.5 }, // Back left, TV area
    STORAGE: { x: 3.5, z: -3 },    // Back right, shelves
    ENTRY: { x: -3, z: 2.5 },      // Front left, entrance
  }
}

/**
 * Debug utility - log position info
 */
export function logPosition(name, position) {
  if (import.meta.env.DEV) {
    const snapped = snapPositionToGrid(position)
    const aligned = position.every((v, i) => v === snapped[i])
    console.log(`[${name}] pos: [${position.join(', ')}] ${aligned ? '✓' : '⚠ NOT ALIGNED'}`)
  }
}
