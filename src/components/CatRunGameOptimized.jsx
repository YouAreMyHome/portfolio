// src/components/CatRunGameOptimized.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';
import { ObjectPool } from '../utils/ObjectPool';
import PerformanceMonitor from '../utils/PerformanceMonitor';
import GameStateManager from '../utils/GameStateManager';
import SpriteManager from '../utils/SpriteManager';
import Player from '../game/Player';
import ObstacleFactory from '../game/Obstacle';
import CollectibleFactory from '../game/Collectible';
import ParallaxBackground from '../game/Background';

class CatRunEngine {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = canvas.width;
    this.height = canvas.height;
    
  // Initialize systems
  this.spriteManager = new SpriteManager();
  // suppress sprite loader console spam; use fallbacks silently
  if (this.spriteManager.setOptions) this.spriteManager.setOptions({ silent: true });
    this.performanceMonitor = new PerformanceMonitor();
    this.gameStateManager = new GameStateManager();
    this.background = new ParallaxBackground(this.spriteManager);
    
    // Game state
    this.gameState = 'loading'; // loading, menu, playing, paused, gameOver
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('catrun-best') || '0');
    this.gameSpeed = 1;
    this.speedIncrement = 0.002;
    this.difficulty = 1;
    
    // Player
    this.player = null;
    
    // Game objects
    this.obstacles = [];
    this.collectibles = [];
    this.particles = [];
    
    // Spawning
    this.lastObstacleX = this.width;
    this.lastCollectibleX = this.width;
    this.obstacleTimer = 0;
    this.collectibleTimer = 0;
    this.patternTimer = 0;
    
    // Combo system
    this.combo = 0;
    this.comboTimer = 0;
    this.comboMultiplier = 1;
    this.lastCoinTime = 0;
    
    // Visual effects
    this.cameraShake = { x: 0, y: 0, intensity: 0 };
    this.slowMotion = { active: false, timer: 0, factor: 1 };
    
    // Controls
    this.keys = {};
    this.setupControls();
    
    // Initialize game
    this.initializePools();
    this.initializeProperties();
    this.initializeGame();
  }
  
  async initializeGame() {
    try {
      // Load all sprites
      await this.spriteManager.loadAllGameSprites();
      
      // Create player
      this.player = new Player(80, this.height - 60, this.spriteManager);
      
  // Create parallax background
  // ParallaxBackground expects a SpriteManager instance
  this.parallaxBackground = new ParallaxBackground(this.spriteManager);
      
      // Game is ready
      this.gameState = 'menu';
    } catch (error) {
      console.warn('Some sprites failed to load, using fallbacks:', error);
      // Still create player with fallback graphics
      this.player = new Player(80, this.height - 60, this.spriteManager);
  this.parallaxBackground = new ParallaxBackground(this.spriteManager);
      this.gameState = 'menu';
    }
  }
  
  // Object pools initialization
  initializePools() {
    this.obstaclePool = new ObjectPool(
      () => ({
        x: this.width,
        y: this.height - 60,
        width: 30,
        height: 60,
        active: false,
        type: 'cactus'
      }),
      (obj) => {
        obj.x = this.width;
        obj.y = this.height - 60;
        obj.active = false;
      },
      20
    );
    
    this.particlePool = new ObjectPool(
      () => ({
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        life: 1,
        maxLife: 1,
        active: false,
        color: '#FFD700'
      }),
      (obj) => {
        obj.x = 0;
        obj.y = 0;
        obj.velocityX = 0;
        obj.velocityY = 0;
        obj.life = 1;
        obj.active = false;
      },
      100
    );
    
    this.coinPool = new ObjectPool(
      () => ({
        x: this.width,
        y: this.height - 100,
        width: 20,
        height: 20,
        active: false,
        collected: false,
        rotation: 0
      }),
      (obj) => {
        obj.x = this.width;
        obj.y = this.height - 100;
        obj.active = false;
        obj.collected = false;
        obj.rotation = 0;
      },
      10
    );
  }
  
  // Initialize other properties
  initializeProperties() {
    // Active objects arrays
    this.obstacles = [];
    this.particles = [];
    this.coins = [];
    this.powerUps = [];
    
    // Sprites
    this.sprites = {
      player: {
        run: { frames: 6, width: 40, height: 40 },
        jump: { frames: 4, width: 40, height: 40 },
        idle: { frames: 4, width: 40, height: 40 }
      }
    };
    
    // Timers
    this.obstacleTimer = 0;
    this.coinTimer = 0;
    this.powerUpTimer = 0;
    
    // Performance
    this.performanceMonitor = new PerformanceMonitor();
    this.gameStateManager = new GameStateManager();
    
    // Controls
    this.keys = {};
    this.setupControls();
    
    // Background
    this.backgroundX = 0;
    this.clouds = [];
    this.initClouds();
    
    // Power-ups
    this.playerPowerUps = {
      shield: { active: false, timer: 0, duration: 300 },
      speed: { active: false, timer: 0, duration: 180 },
      magnet: { active: false, timer: 0, duration: 240 },
      doubleJump: { active: false, timer: 0, duration: 300, used: false }
    };
  }
  
  setupControls() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if ((e.code === 'Space' || e.code === 'ArrowUp') && this.gameState === 'playing') {
        e.preventDefault();
        this.jump();
      }
      if (e.code === 'Enter' && this.gameState !== 'playing') {
        this.startGame();
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    // Touch controls (passive listener to avoid scroll jank)
    this.canvas.addEventListener('touchstart', (e) => {
      // Note: avoid calling preventDefault in passive listeners; only handle quick taps
      if (this.gameState === 'playing') {
        this.jump();
      } else {
        this.startGame();
      }
    }, { passive: true });
    
    this.canvas.addEventListener('click', (e) => {
      if (this.gameState === 'playing') {
        this.jump();
      } else {
        this.startGame();
      }
    });
  }
  
  initClouds() {
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * this.width,
        y: Math.random() * 100 + 20,
        speed: Math.random() * 0.5 + 0.2,
        size: Math.random() * 30 + 20
      });
    }
  }
  
  startGame() {
    this.gameState = 'playing';
    this.score = 0;
    this.gameSpeed = 4;
    this.speed = 4;
    
    // Reset player
    if (this.player) {
      this.player.reset(80, this.height - 60);
    }
    
    // Reset game objects
    this.obstacles = [];
    this.collectibles = [];
    this.particles = [];
    
    // Reset spawn positions
    this.lastObstacleX = this.width;
    this.lastCollectibleX = this.width;
    
    // Reset combo system
    this.combo = 0;
    this.comboTimer = 0;
    this.comboMultiplier = 1;
    
    // Reset power-ups
    Object.keys(this.playerPowerUps).forEach(key => {
      this.playerPowerUps[key].active = false;
      this.playerPowerUps[key].timer = 0;
      if (key === 'doubleJump') {
        this.playerPowerUps[key].used = false;
      }
    });
    
    // Reset timers
    this.obstacleTimer = 0;
    this.collectibleTimer = 0;
    this.patternTimer = 0;
  }
  
  jump() {
    if (this.player) {
      const didJump = this.player.jump();
      if (didJump) {
        // Create dust particles
        this.createCollectionEffect(this.player.x, this.player.y + this.player.height, '#8B4513');
      }
    }
  }
  
  createParticles(x, y, count, color = '#FFD700') {
    for (let i = 0; i < count; i++) {
      const particle = this.particlePool.get();
      if (particle) {
        particle.x = x + Math.random() * 20;
        particle.y = y + Math.random() * 10;
        particle.velocityX = (Math.random() - 0.5) * 6;
        particle.velocityY = (Math.random() - 0.5) * 6 - 2;
        particle.life = particle.maxLife = Math.random() * 60 + 30;
        particle.color = color;
        particle.active = true;
        this.particles.push(particle);
      }
    }
  }
  
  spawnObstacle() {
    const obstacle = this.obstaclePool.get();
    if (obstacle) {
      obstacle.x = this.width;
      obstacle.y = this.height - 60;
      obstacle.width = 25 + Math.random() * 15;
      obstacle.height = 40 + Math.random() * 20;
      obstacle.active = true;
      obstacle.type = Math.random() > 0.7 ? 'bird' : 'cactus';
      
      if (obstacle.type === 'bird') {
        obstacle.y = this.height - 120 - Math.random() * 40;
        obstacle.width = 35;
        obstacle.height = 25;
      }
      
      this.obstacles.push(obstacle);
    }
  }
  
  spawnCoin() {
    // Create a collectible coin via CollectibleFactory so it's handled by the collectibles pipeline
    const coin = CollectibleFactory.createCoin(
      this.width,
      this.height - 100 - Math.random() * 80,
      this.spriteManager
    );
    this.collectibles.push(coin);
  }
  
  spawnPowerUp() {
    const types = ['shield', 'speed', 'magnet', 'doubleJump'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    this.powerUps.push({
      x: this.width,
      y: this.height - 120 - Math.random() * 60,
      width: 30,
      height: 30,
      type: type,
      active: true,
      rotation: 0
    });
  }
  
  updatePlayer() {
    // Gravity and jumping
    if (this.player.isJumping) {
      this.player.velocityY += this.player.gravity;
      this.player.y += this.player.velocityY;
      
      if (this.player.y >= this.player.groundY) {
        this.player.y = this.player.groundY;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        this.player.currentSprite = 'run';
        this.playerPowerUps.doubleJump.used = false;
      }
    }
    
    // Animation
    this.player.frameTimer++;
    if (this.player.frameTimer >= 8) {
      this.player.frameTimer = 0;
      this.player.frameIndex = (this.player.frameIndex + 1) % this.sprites.player[this.player.currentSprite].frames;
    }
    
    // Update power-ups
    Object.keys(this.playerPowerUps).forEach(key => {
      if (this.playerPowerUps[key].active) {
        this.playerPowerUps[key].timer--;
        if (this.playerPowerUps[key].timer <= 0) {
          this.playerPowerUps[key].active = false;
        }
      }
    });
  }
  
  updateObstacles() {
    const currentSpeed = this.playerPowerUps.speed.active ? this.gameSpeed * 1.5 : this.gameSpeed;
    
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.x -= currentSpeed;
      
      if (obstacle.x + obstacle.width < 0) {
        this.obstaclePool.release(obstacle);
        this.obstacles.splice(i, 1);
        continue;
      }
      
      // Collision detection
      if (this.checkCollision(this.player, obstacle) && !this.playerPowerUps.shield.active) {
        this.gameOver();
        return;
      }
    }
  }
  
  updateCoins() {
    const magnetRange = this.playerPowerUps.magnet.active ? 80 : 0;
    
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      
      // Magnet effect
      if (magnetRange > 0) {
        const dx = this.player.x - coin.x;
        const dy = this.player.y - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < magnetRange) {
          coin.x += dx * 0.1;
          coin.y += dy * 0.1;
        }
      }
      
      coin.x -= this.gameSpeed;
      coin.rotation += 0.1;
      
      if (coin.x + coin.width < 0) {
        this.coinPool.release(coin);
        this.coins.splice(i, 1);
        continue;
      }
      
      // Collection
      if (this.checkCollision(this.player, coin)) {
        this.score += 100;
        this.createParticles(coin.x, coin.y, 8, '#FFD700');
        this.coinPool.release(coin);
        this.coins.splice(i, 1);
        this.gameStateManager.addCoins(1);
      }
    }
  }
  
  updatePowerUps() {
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      powerUp.x -= this.gameSpeed;
      powerUp.rotation += 0.05;
      
      if (powerUp.x + powerUp.width < 0) {
        this.powerUps.splice(i, 1);
        continue;
      }
      
      // Collection
      if (this.checkCollision(this.player, powerUp)) {
        this.activatePowerUp(powerUp.type);
        this.createParticles(powerUp.x, powerUp.y, 10, '#FF00FF');
        this.powerUps.splice(i, 1);
      }
    }
  }
  
  activatePowerUp(type) {
    this.playerPowerUps[type].active = true;
    this.playerPowerUps[type].timer = this.playerPowerUps[type].duration;
    
    if (type === 'doubleJump') {
      this.playerPowerUps[type].used = false;
    }
    
    // Apply power-up to player
    if (this.player) {
      this.player.activatePowerUp(type, this.playerPowerUps[type].duration);
    }
  }
  
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.2; // gravity
      particle.life--;
      
      if (particle.life <= 0) {
        this.particlePool.release(particle);
        this.particles.splice(i, 1);
      }
    }
  }
  
  checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
  
  gameOver() {
    this.gameState = 'gameOver';
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('catrun-best', this.bestScore.toString());
    }
    
    // Update achievements
    this.gameStateManager.updateStats({
      gamesPlayed: 1,
      totalScore: this.score,
      obstaclesJumped: Math.floor(this.score / 100)
    });
  }
  
  update() {
    if (this.gameState !== 'playing') return;
    
    // Update game speed
    this.gameSpeed += this.speedIncrement;
    this.score += Math.floor(this.gameSpeed * 0.5);
    
    // Update parallax background
    if (this.parallaxBackground) {
      // use gameSpeed (numeric) to update layers
      this.parallaxBackground.update(this.gameSpeed);
    }
    
    // Update player with sprite animation
    if (this.player) {
      this.player.update();
    }
    
    // Update obstacles with sprite rendering (pass gameSpeed)
    this.obstacles = this.obstacles.filter(obstacle => {
      if (typeof obstacle.update === 'function') obstacle.update(this.gameSpeed);
      else obstacle.x -= this.gameSpeed;
      return obstacle.x > -obstacle.width && obstacle.active !== false;
    });
    
    // Update collectibles (pass gameSpeed)
    this.collectibles = this.collectibles.filter(collectible => {
      if (typeof collectible.update === 'function') collectible.update(this.gameSpeed);
      else collectible.x -= this.gameSpeed;
      return collectible.x > -collectible.width && collectible.active !== false;
    });
    
    // Update particles
    this.particles = this.particles.filter(particle => {
      if (particle && typeof particle.update === 'function') {
        particle.update();
        return particle.life > 0;
      }
      return false;
    });
    
    // Spawn new objects using pattern system
    this.patternTimer++;
    this.obstacleTimer++;
    this.collectibleTimer++;
    
    // Spawn obstacles with patterns
    if (this.obstacleTimer >= 120 - this.gameSpeed * 2) {
      this.spawnObstaclePattern();
      this.obstacleTimer = 0;
    }
    
    // Spawn collectibles
    if (this.collectibleTimer >= 180) {
      this.spawnCollectible();
      this.collectibleTimer = 0;
    }
    
    // Update combo system
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.comboMultiplier = 1;
      }
    }
    
    // Check collisions
    this.checkAllCollisions();
    
    // Update power-ups
    for (let powerUp in this.playerPowerUps) {
      if (this.playerPowerUps[powerUp].active) {
        this.playerPowerUps[powerUp].timer--;
        if (this.playerPowerUps[powerUp].timer <= 0) {
          this.playerPowerUps[powerUp].active = false;
          if (powerUp === 'doubleJump') {
            this.playerPowerUps[powerUp].used = false;
          }
        }
      }
    }
  }
  
  spawnObstaclePattern() {
    // Generate obstacle pattern
    const pattern = ObstacleFactory.createPattern(this.lastObstacleX, this.height - 60, this.spriteManager);
    this.obstacles.push(...pattern);
    this.lastObstacleX += 200 + Math.random() * 100;
  }
  
  spawnCollectible() {
    const type = Math.random() < 0.8 ? 'coin' : 'powerUp';
    let collectible;
    
    if (type === 'coin') {
      collectible = CollectibleFactory.createCoin(
        this.lastCollectibleX,
        this.height - 80 - Math.random() * 40,
        this.spriteManager
      );
    } else {
      const powerTypes = ['shield', 'speed', 'magnet', 'doubleJump'];
      const powerType = powerTypes[Math.floor(Math.random() * powerTypes.length)];
      collectible = CollectibleFactory.createPowerUp(
        this.lastCollectibleX,
        this.height - 80 - Math.random() * 40,
        this.spriteManager,
        powerType
      );
    }
    
    this.collectibles.push(collectible);
    this.lastCollectibleX += 150 + Math.random() * 100;
  }
  
  checkAllCollisions() {
    if (!this.player) return;
    
    const playerBounds = this.player.getBounds();
    
    // Check obstacle collisions
    for (let obstacle of this.obstacles) {
      let collided = false;
      if (typeof obstacle.checkCollision === 'function') {
        collided = obstacle.checkCollision(playerBounds);
      } else {
        // Fallback rectangle intersection if obstacle is a plain object
        const b = obstacle.getBounds ? obstacle.getBounds() : {
          x: obstacle.x, y: obstacle.y, width: obstacle.width, height: obstacle.height
        };
        collided = !(playerBounds.x + playerBounds.width < b.x || playerBounds.x > b.x + b.width || playerBounds.y + playerBounds.height < b.y || playerBounds.y > b.y + b.height);
      }

      if (collided) {
        if (!this.playerPowerUps.shield.active) {
          this.gameOver();
          return;
        }
      }
    }
    
    // Check collectible collisions
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const collectible = this.collectibles[i];
      let collected = false;
      if (typeof collectible.checkCollision === 'function') {
        collected = collectible.checkCollision(playerBounds);
      } else {
        const b = collectible.getBounds ? collectible.getBounds() : {
          x: collectible.x, y: collectible.y, width: collectible.width, height: collectible.height
        };
        collected = !(playerBounds.x + playerBounds.width < b.x || playerBounds.x > b.x + b.width || playerBounds.y + playerBounds.height < b.y || playerBounds.y > b.y + b.height);
      }

      if (collected) {
        if (typeof collectible.collect === 'function') {
          collectible.collect();
        }
        
        if (collectible.type === 'coin') {
          this.score += 10 * this.comboMultiplier;
          this.combo++;
          this.comboTimer = 180;
          this.comboMultiplier = Math.min(5, Math.floor(this.combo / 5) + 1);
          
          // Create particles
          this.createCollectionEffect(collectible.x, collectible.y, '#FFD700');
        } else if (collectible.type === 'powerUp') {
          this.activatePowerUp(collectible.powerType);
          this.createCollectionEffect(collectible.x, collectible.y, '#00FF00');
        }
        
        this.collectibles.splice(i, 1);
      }
    }
  }
  
  createCollectionEffect(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 2 + Math.random() * 3;
      
      const particle = {
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        maxLife: 30,
        color: color,
        active: true,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life--;
          this.active = this.life > 0;
        },
        render(ctx) {
          if (!this.active) return;
          const alpha = this.life / this.maxLife;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
          ctx.restore();
        }
      };
      
      this.particles.push(particle);
    }
  }
  
  updateBackground() {
    // Update background
    this.backgroundX -= this.gameSpeed * 0.5;
    if (this.backgroundX <= -this.width) {
      this.backgroundX = 0;
    }
    
    // Update clouds
    this.clouds.forEach(cloud => {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.size < 0) {
        cloud.x = this.width;
      }
    });
  }
  
  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw parallax background
    if (this.parallaxBackground) {
      // pass canvas width and height to render so layers receive correct dimensions
      this.parallaxBackground.render(this.ctx, this.width, this.height);
    } else {
      // Fallback background
      this.ctx.fillStyle = '#87CEEB';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.drawBackground();
    }
    
    // Draw game objects
    if (this.gameState === 'playing' || this.gameState === 'gameOver') {
      // Draw obstacles with sprite system
      this.obstacles.forEach(obstacle => {
        obstacle.render(this.ctx);
      });
      
      // Draw collectibles
      this.collectibles.forEach(collectible => {
        collectible.render(this.ctx);
      });
      
      // Draw particles
      this.particles.forEach(particle => {
        if (particle.active) {
          particle.render(this.ctx);
        }
      });
      
      // Draw player with sprite animation
      if (this.player) {
        this.player.render(this.ctx);
      }
      
      this.drawUI();
  if (this.gameState === 'gameOver') this.drawGameOver();
    } else {
      this.drawMenu();
    }
    
    // Performance monitor
    this.performanceMonitor.update();
    // TODO: Fix render method
    // this.performanceMonitor.render(this.ctx, this.width - 200, 10);
  }
  
  drawBackground() {
    // Ground
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(0, this.height - 20, this.width, 20);
    
    // Clouds
    this.ctx.fillStyle = '#FFFFFF';
    this.clouds.forEach(cloud => {
      this.ctx.globalAlpha = 0.8;
      this.ctx.beginPath();
      this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });
  }
  
  drawPlayer() {
    this.ctx.save();
    
    // Shield effect
    if (this.playerPowerUps.shield.active) {
      this.ctx.strokeStyle = '#00FFFF';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(this.player.x + this.player.width/2, this.player.y + this.player.height/2, 30, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // Player (simplified rectangle for now)
    this.ctx.fillStyle = this.playerPowerUps.speed.active ? '#FF6B6B' : '#FF8C42';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Eyes
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.player.x + 8, this.player.y + 8, 6, 6);
    this.ctx.fillRect(this.player.x + 20, this.player.y + 8, 6, 6);
    
    this.ctx.restore();
  }
  
  drawObstacles() {
    this.obstacles.forEach(obstacle => {
      if (obstacle.type === 'bird') {
        this.ctx.fillStyle = '#4169E1';
      } else {
        this.ctx.fillStyle = '#228B22';
      }
      this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  }
  
  drawCoins() {
    this.coins.forEach(coin => {
      this.ctx.save();
      this.ctx.translate(coin.x + coin.width/2, coin.y + coin.height/2);
      this.ctx.rotate(coin.rotation);
      this.ctx.fillStyle = '#FFD700';
      this.ctx.fillRect(-coin.width/2, -coin.height/2, coin.width, coin.height);
      this.ctx.restore();
    });
  }
  
  drawPowerUps() {
    this.powerUps.forEach(powerUp => {
      this.ctx.save();
      this.ctx.translate(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2);
      this.ctx.rotate(powerUp.rotation);
      
      const colors = {
        shield: '#00FFFF',
        speed: '#FF6B6B',
        magnet: '#9D4EDD',
        doubleJump: '#06FFA5'
      };
      
      this.ctx.fillStyle = colors[powerUp.type];
      this.ctx.fillRect(-powerUp.width/2, -powerUp.height/2, powerUp.width, powerUp.height);
      this.ctx.restore();
    });
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(particle.x, particle.y, 3, 3);
    });
    this.ctx.globalAlpha = 1;
  }
  
  drawUI() {
    // Score
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    this.ctx.fillText(`Best: ${this.bestScore}`, 20, 70);
    
    // Power-up indicators
    let yOffset = 100;
    Object.keys(this.playerPowerUps).forEach(key => {
      if (this.playerPowerUps[key].active) {
        const remaining = Math.ceil(this.playerPowerUps[key].timer / 60);
        this.ctx.fillStyle = '#000';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`${key}: ${remaining}s`, 20, yOffset);
        yOffset += 25;
      }
    });
  }

  drawGameOver() {
    // Semi-transparent overlay
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Message
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 36px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 20);
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}  Best: ${this.bestScore}`, this.width / 2, this.height / 2 + 20);

    // Restart hint
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Press ENTER or Click to Restart', this.width / 2, this.height / 2 + 60);
    this.ctx.restore();
  }
  
  drawMenu() {
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('CAT RUN', this.width/2, this.height/2 - 50);
    
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Press ENTER or Click to Start', this.width/2, this.height/2 + 20);
    
    if (this.bestScore > 0) {
      this.ctx.fillText(`Best Score: ${this.bestScore}`, this.width/2, this.height/2 + 60);
    }
    
    this.ctx.textAlign = 'left';
  }
}

const CatRunGameOptimized = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);

  const gameLoop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.update();
      engineRef.current.render();
    }
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false; // For pixel art

    // Set canvas size
    canvas.width = 800;
    canvas.height = 300;

    try {
      // Initialize game engine
      engineRef.current = new CatRunEngine(canvas, ctx);
      setIsLoaded(true);

      // Start game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } catch (error) {
      console.error('Failed to initialize game engine:', error);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-orbitron font-bold text-cyber-blue">
        {t('Cat Run - Optimized Version') || 'Cat Run - Optimized Version'}
      </h2>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-2 border-cyber-blue rounded-lg shadow-cyber bg-black"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            imageRendering: 'pixelated',
            touchAction: 'none'
          }}
        />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-cyber-blue font-mono">Loading...</div>
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-gray-400 font-mono">
        <p>Controls: SPACE/UP ARROW to jump, ENTER to start</p>
        <p>Features: Canvas rendering, Object pooling, Particle effects, Power-ups</p>
      </div>
    </div>
  );
};

export default CatRunGameOptimized;
