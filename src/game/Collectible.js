// src/game/Collectible.js
import { AnimationState } from '../utils/AnimationState.js';

export class BaseCollectible {
  constructor(x, y, width, height, type, spriteManager) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.spriteManager = spriteManager;
    this.active = true;
    this.collected = false;
    this.speed = 4;
    
    // Visual effects
    this.rotation = 0;
    this.rotationSpeed = 0.05;
    this.pulseTimer = 0;
    this.bobOffset = Math.random() * Math.PI * 2;
  }
  
  update(gameSpeed) {
    this.x -= this.speed * gameSpeed;
    
    // Rotation and bobbing animation
    this.rotation += this.rotationSpeed;
    this.pulseTimer += 0.1;
    
    if (this.x + this.width < 0) {
      this.active = false;
    }
  }
  
  getBounds() {
    return {
      x: this.x + 2,
      y: this.y + 2,
      width: this.width - 4,
      height: this.height - 4
    };
  }
  
  collect() {
    this.collected = true;
    this.active = false;
  }
  
  render(ctx) {
    ctx.save();
    
    // Bobbing motion
    const bobY = Math.sin(this.pulseTimer + this.bobOffset) * 3;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2 + bobY;
    
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    
    this.renderSprite(ctx);
    
    ctx.restore();
    
    // Render glow effect
    this.renderGlow(ctx, centerX, centerY);
  }
  renderSprite(ctx) {
    // Default sprite drawing with safe color fallback
    const fallbackColor = (this.spriteManager && typeof this.spriteManager.getFallbackColor === 'function') ?
      this.spriteManager.getFallbackColor('collectible') : '#FFFFFF';
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
  
  renderGlow(ctx, centerX, centerY) {
    // Override in subclasses
  }
}

export class Coin extends BaseCollectible {
  constructor(x, y, spriteManager) {
    super(x, y, 20, 20, 'coin', spriteManager);
    
    this.value = 10;
    this.animationState = new AnimationState(4, 8); // 4 frames spinning
    this.glowIntensity = 0;
    this.glowDirection = 1;
  }
  
  update(gameSpeed) {
    super.update(gameSpeed);
    this.animationState.update();
    
    // Pulsing glow
    this.glowIntensity += this.glowDirection * 0.02;
    if (this.glowIntensity >= 1 || this.glowIntensity <= 0.3) {
      this.glowDirection *= -1;
    }
  }
  
  renderSprite(ctx) {
  if (this.spriteManager && typeof this.spriteManager.isLoaded === 'function' && this.spriteManager.isLoaded('coin')) {
      this.spriteManager.drawAnimated(
        ctx,
        'coin',
        this.animationState,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      // Styled coin fallback
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.7, '#FFA500');
      gradient.addColorStop(1, '#FF8C00');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.width / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner circle
      ctx.fillStyle = '#FFFF00';
      ctx.beginPath();
      ctx.arc(0, 0, this.width / 2 - 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Dollar sign or star
      ctx.fillStyle = '#FFA500';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('★', 0, 4);
    }
  }
  
  renderGlow(ctx, centerX, centerY) {
    ctx.save();
    ctx.globalAlpha = this.glowIntensity * 0.6;
    
    // Multiple glow layers
    for (let i = 1; i <= 3; i++) {
      ctx.shadowBlur = i * 8;
      ctx.shadowColor = '#FFD700';
      ctx.fillStyle = `rgba(255, 215, 0, ${0.1 / i})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, this.width / 2 + i * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

export class PowerUp extends BaseCollectible {
  constructor(x, y, type, spriteManager) {
    super(x, y, 24, 24, type, spriteManager);
    
    this.powerType = type;
    this.animationState = new AnimationState(1, 1); // Static for now
    this.energyPulse = 0;
    
    // Power-up specific properties
    this.configs = {
      shield: { color: '#00FFFF', symbol: '🛡️', effect: 'Protection from obstacles' },
      speed: { color: '#FF6B6B', symbol: '⚡', effect: 'Increased movement speed' },
      magnet: { color: '#9D4EDD', symbol: '🧲', effect: 'Attracts nearby coins' },
      doubleJump: { color: '#06FFA5', symbol: '↗️', effect: 'Allows double jumping' }
    };
  }
  
  update(gameSpeed) {
    super.update(gameSpeed);
    this.energyPulse += 0.15;
  }
  
  renderSprite(ctx) {
    const config = this.configs[this.powerType];
    
  if (this.spriteManager && typeof this.spriteManager.isLoaded === 'function' && this.spriteManager.isLoaded(`power_${this.powerType}`)) {
      this.spriteManager.drawAnimated(
        ctx,
        `power_${this.powerType}`,
        this.animationState,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      // Styled power-up fallback
      const size = this.width / 2 - 2;
      
      // Base shape
      ctx.fillStyle = config.color;
      ctx.fillRect(-size, -size, size * 2, size * 2);
      
      // Inner glow
      ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      
      // Symbol
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(config.symbol, 0, 4);
    }
    
    // Energy border
    ctx.strokeStyle = this.configs[this.powerType].color;
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
  
  renderGlow(ctx, centerX, centerY) {
    const config = this.configs[this.powerType];
    const pulse = Math.sin(this.energyPulse) * 0.3 + 0.7;
    
    ctx.save();
    ctx.globalAlpha = pulse * 0.4;
    
    // Power-up specific glow
    for (let i = 1; i <= 4; i++) {
      ctx.shadowBlur = i * 6;
      ctx.shadowColor = config.color;
      ctx.fillStyle = `rgba(${this.hexToRgb(config.color)}, ${0.1 / i})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, this.width / 2 + i * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Energy particles
    for (let i = 0; i < 6; i++) {
      const angle = (this.energyPulse + i * Math.PI / 3) % (Math.PI * 2);
      const distance = 15 + Math.sin(this.energyPulse * 2) * 5;
      const particleX = centerX + Math.cos(angle) * distance;
      const particleY = centerY + Math.sin(angle) * distance;
      
      ctx.fillStyle = config.color;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '255, 255, 255';
  }
  
  getEffectDescription() {
    return this.configs[this.powerType].effect;
  }
}

// Collectible factory
export class CollectibleFactory {
  static createCoin(x, y, spriteManager) {
    return new Coin(x, y, spriteManager);
  }
  
  static createPowerUp(x, y, spriteManager, type = null) {
    const types = ['shield', 'speed', 'magnet', 'doubleJump'];
    const powerType = type || types[Math.floor(Math.random() * types.length)];
    return new PowerUp(x, y, powerType, spriteManager);
  }
  
  static createRandomCollectible(x, y, spriteManager, powerUpChance = 0.2) {
    if (Math.random() < powerUpChance) {
      return CollectibleFactory.createPowerUp(x, y, spriteManager);
    } else {
      return CollectibleFactory.createCoin(x, y, spriteManager);
    }
  }
  
  // Create coin trails or patterns
  static createCoinTrail(startX, startY, length, spacing, spriteManager) {
    const coins = [];
    for (let i = 0; i < length; i++) {
      const x = startX + (i * spacing);
      const y = startY - Math.sin(i * 0.5) * 20; // Wavy pattern
      coins.push(CollectibleFactory.createCoin(x, y, spriteManager));
    }
    return coins;
  }
  
  static createPowerUpCluster(x, y, spriteManager) {
    return [
      CollectibleFactory.createPowerUp(x, y, spriteManager, 'shield'),
      CollectibleFactory.createCoin(x + 30, y - 10, spriteManager),
      CollectibleFactory.createCoin(x + 60, y - 20, spriteManager),
      CollectibleFactory.createCoin(x + 90, y - 10, spriteManager)
    ];
  }
}

export default CollectibleFactory;
