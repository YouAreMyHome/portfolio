// src/utils/ObjectPool.js
/**
 * Object Pool System for Game Performance Optimization
 * Reuses objects to minimize garbage collection and improve performance
 */

class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    this.pool = [];
    this.active = [];
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get() {
    let obj;
    
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }
    
    this.active.push(obj);
    return obj;
  }

  release(obj) {
    const index = this.active.indexOf(obj);
    if (index !== -1) {
      this.active.splice(index, 1);
      
      // Reset object state
      if (this.resetFn) {
        this.resetFn(obj);
      }
      
      // Return to pool if under max size
      if (this.pool.length < this.maxSize) {
        this.pool.push(obj);
      }
    }
  }

  releaseAll() {
    while (this.active.length > 0) {
      this.release(this.active[0]);
    }
  }

  getActiveCount() {
    return this.active.length;
  }

  getPooledCount() {
    return this.pool.length;
  }

  clear() {
    this.pool.length = 0;
    this.active.length = 0;
  }
  
  reset() {
    this.releaseAll();
  }
}

// Specialized pools for game objects
class GameObjectPools {
  constructor() {
    this.obstacles = new ObjectPool(
      () => ({ x: 0, y: 0, width: 20, height: 40, speed: 4, active: true }),
      (obj) => {
        obj.x = 0;
        obj.y = 0;
        obj.active = true;
      },
      5,
      20
    );

    this.powerUps = new ObjectPool(
      () => ({ 
        x: 0, y: 0, width: 24, height: 24, speed: 4, active: true, 
        type: 'shield', animation: { rotation: 0, pulse: 0 }
      }),
      (obj) => {
        obj.x = 0;
        obj.y = 0;
        obj.active = true;
        obj.animation.rotation = 0;
        obj.animation.pulse = 0;
      },
      3,
      10
    );

    this.particles = new ObjectPool(
      () => ({ 
        x: 0, y: 0, velocityX: 0, velocityY: 0, life: 0, 
        maxLife: 0, color: '#ffffff', size: 2 
      }),
      (obj) => {
        obj.x = 0;
        obj.y = 0;
        obj.velocityX = 0;
        obj.velocityY = 0;
        obj.life = 0;
        obj.maxLife = 0;
      },
      20,
      100
    );
  }

  clear() {
    this.obstacles.clear();
    this.powerUps.clear();
    this.particles.clear();
  }

  getStats() {
    return {
      obstacles: {
        active: this.obstacles.getActiveCount(),
        pooled: this.obstacles.getPooledCount()
      },
      powerUps: {
        active: this.powerUps.getActiveCount(),
        pooled: this.powerUps.getPooledCount()
      },
      particles: {
        active: this.particles.getActiveCount(),
        pooled: this.particles.getPooledCount()
      }
    };
  }
}

export { ObjectPool, GameObjectPools };
