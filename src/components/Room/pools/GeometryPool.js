import * as THREE from 'three'

/**
 * GeometryPool - Flyweight Pattern for Three.js Geometries
 * 
 * Reuses geometry instances with identical dimensions to prevent
 * duplicate GPU buffer allocations and reduce memory overhead.
 */
class GeometryPool {
  constructor() {
    this.boxPool = new Map()
    this.cylinderPool = new Map()
    this.spherePool = new Map()
    this.planePool = new Map()
    this.circlePool = new Map()
  }

  getBox(w, h, d) {
    const key = `${w}_${h}_${d}`
    if (!this.boxPool.has(key)) {
      this.boxPool.set(key, new THREE.BoxGeometry(w, h, d))
    }
    return this.boxPool.get(key)
  }

  getCylinder(rt, rb, h, segs = 12) {
    const key = `${rt}_${rb}_${h}_${segs}`
    if (!this.cylinderPool.has(key)) {
      this.cylinderPool.set(key, new THREE.CylinderGeometry(rt, rb, h, segs))
    }
    return this.cylinderPool.get(key)
  }

  getSphere(radius, widthSegments = 12, heightSegments = 12) {
    const key = `${radius}_${widthSegments}_${heightSegments}`
    if (!this.spherePool.has(key)) {
      this.spherePool.set(key, new THREE.SphereGeometry(radius, widthSegments, heightSegments))
    }
    return this.spherePool.get(key)
  }

  getPlane(width, height) {
    const key = `${width}_${height}`
    if (!this.planePool.has(key)) {
      this.planePool.set(key, new THREE.PlaneGeometry(width, height))
    }
    return this.planePool.get(key)
  }

  getCircle(radius, segments = 16) {
    const key = `${radius}_${segments}`
    if (!this.circlePool.has(key)) {
      this.circlePool.set(key, new THREE.CircleGeometry(radius, segments))
    }
    return this.circlePool.get(key)
  }

  clear() {
    this.boxPool.forEach((geo) => geo.dispose())
    this.cylinderPool.forEach((geo) => geo.dispose())
    this.spherePool.forEach((geo) => geo.dispose())
    this.planePool.forEach((geo) => geo.dispose())
    this.circlePool.forEach((geo) => geo.dispose())
    this.boxPool.clear()
    this.cylinderPool.clear()
    this.spherePool.clear()
    this.planePool.clear()
    this.circlePool.clear()
  }
}

export const geometryPool = new GeometryPool()
export default geometryPool

