// src/game/Background.js
export class BackgroundLayer {
  constructor(spriteManager, imageName, scrollSpeed, y = 0, repeat = true) {
    this.spriteManager = spriteManager;
    this.imageName = imageName;
    this.scrollSpeed = scrollSpeed;
    this.y = y;
    this.repeat = repeat;
    this.x = 0;
    this.width = 800; // Default canvas width
    this.height = 300; // Default canvas height
  }
  
  update(gameSpeed) {
    this.x -= this.scrollSpeed * gameSpeed;
    
    if (this.repeat && this.x <= -this.width) {
      this.x = 0;
    }
  }
  
  render(ctx, canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    
    // Only use spriteManager if it's available and has the expected methods
    if (this.spriteManager && typeof this.spriteManager.isLoaded === 'function' && this.spriteManager.isLoaded(this.imageName)) {
      // Render sprite
      if (typeof this.spriteManager.drawFrame === 'function') {
        this.spriteManager.drawFrame(ctx, this.imageName, 0, this.x, this.y, this.width, this.height);
        if (this.repeat) {
          // Render second copy for seamless scrolling
          this.spriteManager.drawFrame(ctx, this.imageName, 0, this.x + this.width, this.y, this.width, this.height);
        }
      } else {
        this.renderFallback(ctx, canvasWidth, canvasHeight);
      }
    } else {
      // Fallback rendering
      this.renderFallback(ctx, canvasWidth, canvasHeight);
    }
  }
  
  renderFallback(ctx, canvasWidth, canvasHeight) {
    // Override in subclasses
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}

export class SkyLayer extends BackgroundLayer {
  constructor(spriteManager) {
    super(spriteManager, 'sky', 0.1, 0, false);
    this.cloudOffset = 0;
  }
  
  update(gameSpeed) {
    super.update(gameSpeed);
    this.cloudOffset += gameSpeed * 0.05;
  }
  
  renderFallback(ctx, canvasWidth, canvasHeight) {
    // Ensure canvasWidth/Height are finite numbers
    const w = Number.isFinite(canvasWidth) && canvasWidth > 0 ? canvasWidth : 800;
    const h = Number.isFinite(canvasHeight) && canvasHeight > 0 ? canvasHeight : 300;

    // Gradient sky
    try {
      const gradient = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(0.5, '#E0F6FF');
      gradient.addColorStop(1, '#98D8E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h * 0.7);
    } catch (err) {
      // Fallback solid
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, w, h * 0.7);
    }

    // Animated clouds
    this.renderClouds(ctx, w, h);
  }
  
  renderClouds(ctx, canvasWidth, canvasHeight) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    const clouds = [
      { x: 100, y: 50, size: 30 },
      { x: 300, y: 80, size: 25 },
      { x: 500, y: 40, size: 35 },
      { x: 700, y: 70, size: 20 }
    ];
    
    clouds.forEach(cloud => {
      const x = (cloud.x + this.cloudOffset) % (canvasWidth + cloud.size);
      this.drawCloud(ctx, x, cloud.y, cloud.size);
    });
  }
  
  drawCloud(ctx, x, y, size) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    
    // Cloud circles
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.2, y - size * 0.3, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y - size * 0.3, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

export class MountainLayer extends BackgroundLayer {
  constructor(spriteManager) {
    super(spriteManager, 'mountains', 0.3, 0, true);
  }
  
  renderFallback(ctx, canvasWidth, canvasHeight) {
    const groundY = canvasHeight * 0.7;
    
    // Mountains silhouette
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.moveTo(this.x, groundY);
    
    const peaks = [
      { x: 0.1, height: 0.4 },
      { x: 0.25, height: 0.6 },
      { x: 0.4, height: 0.3 },
      { x: 0.6, height: 0.7 },
      { x: 0.8, height: 0.4 },
      { x: 1.0, height: 0.5 }
    ];
    
    peaks.forEach(peak => {
      const x = this.x + (peak.x * canvasWidth);
      const y = groundY - (peak.height * groundY * 0.6);
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(this.x + canvasWidth, groundY);
    ctx.lineTo(this.x, groundY);
    ctx.fill();
    
    // Render second copy for seamless scrolling
    ctx.beginPath();
    ctx.moveTo(this.x + canvasWidth, groundY);
    
    peaks.forEach(peak => {
      const x = this.x + canvasWidth + (peak.x * canvasWidth);
      const y = groundY - (peak.height * groundY * 0.6);
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(this.x + canvasWidth * 2, groundY);
    ctx.lineTo(this.x + canvasWidth, groundY);
    ctx.fill();
  }
}

export class TreeLayer extends BackgroundLayer {
  constructor(spriteManager) {
    super(spriteManager, 'trees', 0.6, 0, true);
    this.trees = this.generateTrees();
  }
  
  generateTrees() {
    const trees = [];
    const treeCount = 8;
    
    for (let i = 0; i < treeCount; i++) {
      trees.push({
        x: (i / treeCount) * 800 + Math.random() * 50,
        height: 60 + Math.random() * 40,
        width: 15 + Math.random() * 10,
        type: Math.floor(Math.random() * 3)
      });
    }
    
    return trees;
  }
  
  renderFallback(ctx, canvasWidth, canvasHeight) {
    const groundY = canvasHeight - 20;
    
    // Render trees at two positions for seamless scrolling
    [0, canvasWidth].forEach(offsetX => {
      this.trees.forEach(tree => {
        const x = this.x + tree.x + offsetX;
        if (x > -tree.width && x < canvasWidth + tree.width) {
          this.drawTree(ctx, x, groundY - tree.height, tree.width, tree.height, tree.type);
        }
      });
    });
  }
  
  drawTree(ctx, x, y, width, height, type) {
    // Tree trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + width * 0.3, y + height * 0.6, width * 0.4, height * 0.4);
    
    // Tree crown based on type
    ctx.fillStyle = ['#228B22', '#32CD32', '#006400'][type];
    
    switch (type) {
      case 0: // Round tree
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height * 0.3, width * 0.6, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 1: // Triangular tree
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x, y + height * 0.6);
        ctx.lineTo(x + width, y + height * 0.6);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 2: // Oval tree
        ctx.save();
        ctx.translate(x + width / 2, y + height * 0.3);
        ctx.scale(1, 1.5);
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
    }
  }
}

export class GroundLayer extends BackgroundLayer {
  constructor(spriteManager) {
    super(spriteManager, 'ground', 1.0, 0, true);
    this.grassBlades = this.generateGrass();
  }
  
  generateGrass() {
    const grass = [];
    for (let i = 0; i < 50; i++) {
      grass.push({
        x: Math.random() * 800,
        height: 3 + Math.random() * 7,
        sway: Math.random() * Math.PI * 2
      });
    }
    return grass;
  }
  
  update(gameSpeed) {
    super.update(gameSpeed);
    
    // Animate grass swaying
    this.grassBlades.forEach(blade => {
      blade.sway += 0.05;
    });
  }
  
  renderFallback(ctx, canvasWidth, canvasHeight) {
    const groundY = canvasHeight - 20;
    
    // Ground base
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, groundY, canvasWidth, 20);
    
    // Ground surface
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, groundY - 3, canvasWidth, 3);
    
    // Animated grass
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 1;
    
    [0, canvasWidth].forEach(offsetX => {
      this.grassBlades.forEach(blade => {
        const x = (this.x + blade.x + offsetX) % (canvasWidth + 50);
        const swayOffset = Math.sin(blade.sway) * 2;
        
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + swayOffset, groundY - blade.height);
        ctx.stroke();
      });
    });
    
    // Ground details (rocks, dirt patches)
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < 10; i++) {
      const x = (this.x + (i * 80)) % canvasWidth;
      const size = 3 + Math.random() * 4;
      ctx.fillRect(x, groundY - size / 2, size, size);
    }
  }
}

export class ParallaxBackground {
  constructor(spriteManager) {
    this.spriteManager = spriteManager;
    this.layers = [
      new SkyLayer(spriteManager),
      new MountainLayer(spriteManager),
      new TreeLayer(spriteManager),
      new GroundLayer(spriteManager)
    ];
  }
  
  update(gameSpeed) {
    this.layers.forEach(layer => layer.update(gameSpeed));
  }
  
  render(ctx, canvasWidth, canvasHeight) {
    // Render layers from back to front
    this.layers.forEach(layer => {
      layer.render(ctx, canvasWidth, canvasHeight);
    });
  }
  
  // Add environmental effects
  renderEnvironmentalEffects(ctx, canvasWidth, canvasHeight, gameSpeed) {
    this.renderSunbeams(ctx, canvasWidth, canvasHeight);
    this.renderParticles(ctx, canvasWidth, canvasHeight, gameSpeed);
  }
  
  renderSunbeams(ctx, canvasWidth, canvasHeight) {
    const time = Date.now() * 0.001;
    
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#FFFF99';
    
    for (let i = 0; i < 3; i++) {
      const angle = Math.sin(time + i) * 0.1;
      const x = canvasWidth * 0.8 + Math.sin(time + i * 2) * 50;
      
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(angle);
      ctx.fillRect(-5, 0, 10, canvasHeight * 0.6);
      ctx.restore();
    }
    
    ctx.restore();
  }
  
  renderParticles(ctx, canvasWidth, canvasHeight, gameSpeed) {
    // Dust particles
    ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    
    for (let i = 0; i < 15; i++) {
      const x = (Date.now() * 0.1 * gameSpeed + i * 50) % (canvasWidth + 50);
      const y = canvasHeight - 30 + Math.sin(Date.now() * 0.005 + i) * 10;
      const size = 1 + Math.sin(Date.now() * 0.01 + i) * 1;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default ParallaxBackground;
