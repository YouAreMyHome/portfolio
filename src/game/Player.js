// src/game/Player.js
import { AnimationState } from '../utils/AnimationState.js';

export class Player {
  constructor(x, y, spriteManager) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.spriteManager = spriteManager;
    
    // Physics
    this.velocityY = 0;
    this.velocityX = 0;
    this.groundY = y;
    this.isJumping = false;
    this.isOnGround = true;
    this.jumpPower = -15;
    this.gravity = 0.8;
    this.maxFallSpeed = 15;
    
    // Animation states
    this.animationStates = {
      idle: new AnimationState(4, 10),
      run: new AnimationState(6, 8),
      jump: new AnimationState(4, 6),
      fall: new AnimationState(2, 8),
      dead: new AnimationState(3, 4)
    };
    
    this.currentState = 'run';
    this.previousState = 'run';
    this.facingRight = true;
    
    // Visual effects
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.tailWagTimer = 0;
    
    // Power-up effects
    this.effects = {
      shield: { active: false, timer: 0, duration: 300 },
      speed: { active: false, timer: 0, duration: 180 },
      magnet: { active: false, timer: 0, duration: 240 },
      doubleJump: { active: false, timer: 0, duration: 300, used: false }
    };
    
    // State machine
    this.setupStateMachine();
  }
  
  setupStateMachine() {
    this.stateMachine = {
      idle: {
        enter: () => {
          this.animationStates.idle.reset();
        },
        update: () => {
          if (this.velocityX !== 0) this.setState('run');
          if (!this.isOnGround) this.setState('jump');
        }
      },
      
      run: {
        enter: () => {
          this.animationStates.run.reset();
        },
        update: () => {
          if (this.velocityX === 0) this.setState('idle');
          if (!this.isOnGround) this.setState('jump');
        }
      },
      
      jump: {
        enter: () => {
          this.animationStates.jump.reset();
        },
        update: () => {
          if (this.isOnGround) {
            this.setState(this.velocityX !== 0 ? 'run' : 'idle');
          } else if (this.velocityY > 0) {
            this.setState('fall');
          }
        }
      },
      
      fall: {
        enter: () => {
          this.animationStates.fall.reset();
        },
        update: () => {
          if (this.isOnGround) {
            this.setState(this.velocityX !== 0 ? 'run' : 'idle');
          }
        }
      },
      
      dead: {
        enter: () => {
          this.animationStates.dead.reset();
          this.animationStates.dead.loop = false;
        },
        update: () => {
          // Stay in dead state
        }
      }
    };
  }
  
  setState(newState) {
    if (this.currentState === newState) return;
    
    this.previousState = this.currentState;
    this.currentState = newState;
    
    // Call enter function for new state
    if (this.stateMachine[newState] && this.stateMachine[newState].enter) {
      this.stateMachine[newState].enter();
    }
  }

  // Added to support engine.reset call
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.groundY = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isOnGround = true;
    this.isJumping = false;
    this.currentState = 'run';
    Object.keys(this.animationStates).forEach(k => this.animationStates[k].reset());
    Object.keys(this.effects).forEach(k => {
      this.effects[k].active = false;
      this.effects[k].timer = 0;
      if (k === 'doubleJump') this.effects[k].used = false;
    });
  }
  
  update() {
    // Update physics
    this.updatePhysics();
    
    // Update state machine
    if (this.stateMachine[this.currentState] && this.stateMachine[this.currentState].update) {
      this.stateMachine[this.currentState].update();
    }
    
    // Update animations
    this.animationStates[this.currentState].update();
    
    // Update visual effects
    this.updateVisualEffects();
    
    // Update power-ups
    this.updatePowerUps();
  }
  
  updatePhysics() {
    // Apply gravity
    if (!this.isOnGround) {
      this.velocityY += this.gravity;
      this.velocityY = Math.min(this.velocityY, this.maxFallSpeed);
    }
    
    // Update position
    this.y += this.velocityY;
    this.x += this.velocityX;
    
    // Ground collision
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.velocityY = 0;
      this.isOnGround = true;
      this.isJumping = false;
      this.effects.doubleJump.used = false;
    } else {
      this.isOnGround = false;
    }
  }
  
  updateVisualEffects() {
    // Blinking eyes
    this.blinkTimer++;
    if (this.blinkTimer >= 180) { // Blink every 3 seconds at 60fps
      this.isBlinking = true;
      this.blinkTimer = 0;
    }
    if (this.isBlinking && this.blinkTimer >= 6) { // Blink for 0.1 seconds
      this.isBlinking = false;
    }
    
    // Tail wagging
    this.tailWagTimer += 0.1;
  }
  
  updatePowerUps() {
    Object.keys(this.effects).forEach(key => {
      if (this.effects[key].active) {
        this.effects[key].timer--;
        if (this.effects[key].timer <= 0) {
          this.effects[key].active = false;
        }
      }
    });
  }
  
  jump() {
    if (this.currentState === 'dead') return false;
    
    if (this.isOnGround) {
      this.velocityY = this.jumpPower;
      this.isOnGround = false;
      this.isJumping = true;
      this.setState('jump');
      return true;
    } else if (this.effects.doubleJump.active && !this.effects.doubleJump.used) {
      this.velocityY = this.jumpPower * 0.8;
      this.effects.doubleJump.used = true;
      this.setState('jump');
      return true;
    }
    
    return false;
  }
  
  die() {
    this.setState('dead');
    this.velocityX = 0;
  }
  
  activatePowerUp(type) {
    if (this.effects[type]) {
      this.effects[type].active = true;
      this.effects[type].timer = this.effects[type].duration;
      
      if (type === 'doubleJump') {
        this.effects[type].used = false;
      }
    }
  }
  
  render(ctx) {
    ctx.save();
    
    // Shield effect
    if (this.effects.shield.active) {
      this.renderShieldEffect(ctx);
    }
    
    // Speed trail effect
    if (this.effects.speed.active) {
      this.renderSpeedTrail(ctx);
    }
    
    // Render main sprite
    this.renderMainSprite(ctx);
    
    // Render eyes (blinking)
    this.renderEyes(ctx);
    
    // Render tail
    this.renderTail(ctx);
    
    ctx.restore();
  }
  
  renderMainSprite(ctx) {
    const spriteName = this.getSpriteNameForState();
    const animation = this.animationStates[this.currentState];
    
    // Add slight bounce effect when running
    let offsetY = 0;
    if (this.currentState === 'run') {
      offsetY = Math.sin(animation.currentFrame * 0.5) * 2;
    }
    
    this.spriteManager.drawAnimated(
      ctx,
      spriteName,
      animation,
      this.x,
      this.y + offsetY,
      this.width,
      this.height,
      !this.facingRight
    );
  }
  
  renderEyes(ctx) {
    if (this.currentState === 'dead') return;
    
    const eyeSize = this.isBlinking ? 2 : 4;
    const eyeY = this.y + 8;
    
    // Left eye
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 8, eyeY, 4, eyeSize);
    
    // Right eye
    ctx.fillRect(this.x + 24, eyeY, 4, eyeSize);
    
    // Eye shine
    if (!this.isBlinking) {
      ctx.fillStyle = '#FFF';
      ctx.fillRect(this.x + 9, eyeY + 1, 1, 1);
      ctx.fillRect(this.x + 25, eyeY + 1, 1, 1);
    }
  }
  
  renderTail(ctx) {
    if (this.currentState === 'dead') return;
    
    const tailX = this.facingRight ? this.x - 8 : this.x + this.width;
    const tailY = this.y + this.height / 2;
    const wagOffset = Math.sin(this.tailWagTimer) * 3;
    
    ctx.strokeStyle = '#D2691E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(
      tailX + (this.facingRight ? -10 : 10), 
      tailY + wagOffset - 5,
      tailX + (this.facingRight ? -15 : 15), 
      tailY + wagOffset
    );
    ctx.stroke();
  }
  
  renderShieldEffect(ctx) {
    const radius = Math.max(this.width, this.height) / 2 + 10;
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(Date.now() * 0.01) * 0.2})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner glow
    ctx.strokeStyle = `rgba(0, 255, 255, 0.1)`;
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  
  renderSpeedTrail(ctx) {
    for (let i = 1; i <= 3; i++) {
      const alpha = 0.3 - (i * 0.1);
      const offsetX = i * -10;
      
      ctx.fillStyle = `rgba(255, 107, 107, ${alpha})`;
      ctx.fillRect(
        this.x + offsetX,
        this.y + 8,
        8,
        16
      );
    }
  }
  
  getSpriteNameForState() {
    switch (this.currentState) {
      case 'idle': return 'cat_idle';
      case 'run': return 'cat_walk';
      case 'jump': 
      case 'fall': return 'cat_jump';
      case 'dead': return 'cat_dead';
      default: return 'cat_walk';
    }
  }
  
  getBounds() {
    return {
      x: this.x + 4, // Slightly smaller hitbox
      y: this.y + 4,
      width: this.width - 8,
      height: this.height - 8
    };
  }
  
  checkCollision(other) {
    const a = this.getBounds();
    const b = other.getBounds ? other.getBounds() : other;
    
    return !(a.x + a.width < b.x || 
             a.x > b.x + b.width || 
             a.y + a.height < b.y || 
             a.y > b.y + b.height);
  }
}

export default Player;
