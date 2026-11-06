import * as THREE from 'three'

/**
 * MaterialPool - Flyweight Pattern for Three.js Materials
 * 
 * Reuses material instances with identical parameters to avoid
 * redundant shader compilations and GPU state changes.
 */
class MaterialPool {
  constructor() {
    this.standardPool = new Map()
    this.basicPool = new Map()
  }

  getStandard({
    color = '#ffffff',
    roughness = 0.5,
    metalness = 0.0,
    transparent = false,
    opacity = 1.0,
  } = {}) {
    const key = `${color}_${roughness}_${metalness}_${transparent}_${opacity}`
    if (!this.standardPool.has(key)) {
      this.standardPool.set(
        key,
        new THREE.MeshStandardMaterial({
          color,
          roughness,
          metalness,
          transparent,
          opacity,
        })
      )
    }
    return this.standardPool.get(key)
  }

  getBasic({
    color = '#ffffff',
    transparent = false,
    opacity = 1.0,
    depthWrite = true,
  } = {}) {
    const key = `${color}_${transparent}_${opacity}_${depthWrite}`
    if (!this.basicPool.has(key)) {
      this.basicPool.set(
        key,
        new THREE.MeshBasicMaterial({
          color,
          transparent,
          opacity,
          depthWrite,
        })
      )
    }
    return this.basicPool.get(key)
  }

  clear() {
    this.standardPool.forEach((mat) => mat.dispose())
    this.basicPool.forEach((mat) => mat.dispose())
    this.standardPool.clear()
    this.basicPool.clear()
  }
}

export const materialPool = new MaterialPool()
export default materialPool

