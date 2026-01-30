// src/game/Obstacle.js
import { AnimationState } from '../utils/AnimationState.js';

export class BaseObstacle {
  constructor(x, y, width, height, type, spriteManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.spriteManager = spriteManager;
    this.active = true;
    this.speed = 4;
  }
  
  update(gameSpeed) {
    this.x -= this.speed * gameSpeed;
    if (this.x + this.width < 0) {
      this.active = false;
    }
  }
  
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
  
  render(ctx) {
    // Fallback rectangle
    const fallbackColor = (this.spriteManager && typeof this.spriteManager.getFallbackColor === 'function') ?
      this.spriteManager.getFallbackColor(this.type) : '#8844AA';
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Cactus extends BaseObstacle {
  constructor(x, y, spriteManager) {
    const height = 40 + Math.random() * 20;
    super(x, y - height, 25, height, 'cactus', spriteManager);
    
    this.variant = Math.floor(Math.random() * 3); // 3 cactus variants
  }
  
  render(ctx) {
    // Try to render sprite, fallback to styled rectangle
    if (this.spriteManager.isLoaded('cactus')) {
      this.spriteManager.drawFrame(
        ctx,
        'cactus',
        this.variant,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      // Styled cactus fallback
      ctx.fillStyle = '#228B22';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      // Add some spikes
      ctx.fillStyle = '#32CD32';
      for (let i = 0; i < 3; i++) {
        const spikeY = this.y + (i * this.height / 3);
        ctx.fillRect(this.x - 3, spikeY, 6, 4);
        ctx.fillRect(this.x + this.width - 3, spikeY + 5, 6, 4);
      }
      
      // Top
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(this.x, this.y, this.width, 4);
    }
    
    // Add glow effect
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#228B22';
    ctx.strokeStyle = '#90EE90';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

export class Bird extends BaseObstacle {
  constructor(x, y, spriteManager) {
    const flightHeight = 40 + Math.random() * 60;
    super(x, y - flightHeight, 35, 25, 'bird', spriteManager);
    
    this.animationState = new AnimationState(3, 4); // 3 frames, 4 updates per frame
    this.hoverOffset = 0;
    this.hoverSpeed = 0.1;
  }
  
  update(gameSpeed) {
    super.update(gameSpeed);
    this.animationState.update();
    
    // Add hovering motion
    this.hoverOffset += this.hoverSpeed;
    this.y += Math.sin(this.hoverOffset) * 0.5;
  }
  
  render(ctx) {
    if (this.spriteManager.isLoaded('bird')) {
      this.spriteManager.drawAnimated(
        ctx,
        'bird',
        this.animationState,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      // Styled bird fallback
      ctx.fillStyle = '#4169E1';
      ctx.fillRect(this.x, this.y + 8, this.width, this.height - 8);
      
      // Wings (animated)
      const wingFlap = Math.sin(this.animationState.currentFrame * 0.8) * 5;
      ctx.fillStyle = '#6495ED';
      ctx.fillRect(this.x - 5, this.y + wingFlap, 15, 8);
      ctx.fillRect(this.x + this.width - 10, this.y + wingFlap, 15, 8);
      
      // Beak
      ctx.fillStyle = '#FFA500';
      ctx.fillRect(this.x + this.width, this.y + 10, 5, 3);
      
      // Eye
      ctx.fillStyle = '#000';
      ctx.fillRect(this.x + this.width - 8, this.y + 8, 3, 3);
    }
    
    // Wing blur effect for speed
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#87CEEB';
    const blur = this.animationState.currentFrame % 2 === 0 ? 2 : 0;
    ctx.fillRect(this.x - 3 - blur, this.y + 5, 8, 4);
    ctx.fillRect(this.x + this.width - 5 + blur, this.y + 5, 8, 4);
    ctx.restore();
  }
}

export class Spike extends BaseObstacle {
  constructor(x, y, spriteManager) {
    super(x, y - 20, 20, 20, 'spike', spriteManager);
    this.rotation = 0;
    this.rotationSpeed = 0.1;
  }
  
  update(gameSpeed) {
    super.update(gameSpeed);
    this.rotation += this.rotationSpeed;
  }
  
  render(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    
    if (this.spriteManager.isLoaded('spike')) {
      this.spriteManager.drawFrame(
        ctx,
        'spike',
        0,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      // Styled spike fallback
      ctx.fillStyle = '#8B0000';
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);
      ctx.lineTo(-this.width / 2, this.height / 2);
      ctx.closePath();
      ctx.fill();
      
      // Inner highlight
      ctx.fillStyle = '#CD5C5C';
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2 + 2);
      ctx.lineTo(this.width / 2 - 2, this.height / 2 - 2);
      ctx.lineTo(-this.width / 2 + 2, this.height / 2 - 2);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
    
    // Danger glow
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF0000';
    ctx.strokeStyle = '#FF4500';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

// Obstacle factory
export class ObstacleFactory {
  static createObstacle(type, x, y, spriteManager) {
    switch (type) {
      case 'cactus':
        return new Cactus(x, y, spriteManager);
      case 'bird':
        return new Bird(x, y, spriteManager);
      case 'spike':
        return new Spike(x, y, spriteManager);
      default:
        return new Cactus(x, y, spriteManager);
    }
  }
  
  static getRandomType() {
    const types = ['cactus', 'bird', 'spike'];
    return types[Math.floor(Math.random() * types.length)];
  }
  
  // Create obstacle patterns
  static createPattern(x, y, spriteManager, difficulty = 1) {
    const patterns = [
      // Single obstacle
      () => [ObstacleFactory.createObstacle('cactus', x, y, spriteManager)],
      
      // Double cactus
      () => [
        ObstacleFactory.createObstacle('cactus', x, y, spriteManager),
        ObstacleFactory.createObstacle('cactus', x + 40, y, spriteManager)
      ],
      
      // Bird + cactus combo
      () => [
        ObstacleFactory.createObstacle('bird', x, y, spriteManager),
        ObstacleFactory.createObstacle('cactus', x + 60, y, spriteManager)
      ],
      
      // Spike field
      () => [
        ObstacleFactory.createObstacle('spike', x, y, spriteManager),
        ObstacleFactory.createObstacle('spike', x + 30, y, spriteManager),
        ObstacleFactory.createObstacle('spike', x + 60, y, spriteManager)
      ]
    ];
    
    // Higher difficulty = more complex patterns
    const maxPatterns = Math.min(patterns.length, Math.floor(difficulty * 2) + 1);
    const patternIndex = Math.floor(Math.random() * maxPatterns);
    
    return patterns[patternIndex]();
  }
}

export default ObstacleFactory;
