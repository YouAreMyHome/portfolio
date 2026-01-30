// Lightweight SpriteManager for the Cat Run game
// - supports loading normal image files and .yymps JSON metadata
// - caches loaded images and exposes draw helpers with fallbacks

class SpriteManager {
  constructor() {
    this.sprites = new Map(); // optional metadata
    this.loadedSprites = new Map(); // name -> { image, frameWidth, frameHeight, frames }
    this.loadingPromises = new Map();
    this.failedSprites = new Map();
    this.silent = false; // when true, suppress console warnings/errors
  }

  // Accept options: { silent: boolean }
  setOptions(options = {}) {
    if (typeof options.silent === 'boolean') this.silent = options.silent;
  }

  // Convenience: load a predefined list of game sprites
  async loadAllGameSprites() {
    const spriteList = [
      { name: 'cat_walk', url: '/assets/game/cat_walk_sprite.png', frameWidth: 64, frameHeight: 64, frames: 8 },
      { name: 'cat_jump', url: '/assets/game/cat_jump_sprite.png', frameWidth: 64, frameHeight: 64, frames: 4 },
      { name: 'cactus', url: '/assets/game/cactus.png', frameWidth: 30, frameHeight: 60, frames: 1 },
      { name: 'bird', url: '/assets/game/bird.png', frameWidth: 40, frameHeight: 30, frames: 4 },
      { name: 'spike', url: '/assets/game/spike.png', frameWidth: 40, frameHeight: 20, frames: 1 },
      { name: 'coin', url: '/assets/game/coin.png', frameWidth: 20, frameHeight: 20, frames: 8 },
      { name: 'powerup', url: '/assets/game/powerup.png', frameWidth: 24, frameHeight: 24, frames: 1 },
      { name: 'sky', url: '/assets/game/sky.png', frameWidth: 800, frameHeight: 300, frames: 1 },
      { name: 'mountain', url: '/assets/game/mountain.png', frameWidth: 800, frameHeight: 200, frames: 1 },
      { name: 'tree', url: '/assets/game/tree.png', frameWidth: 100, frameHeight: 150, frames: 1 },
      { name: 'ground', url: '/assets/game/ground.png', frameWidth: 800, frameHeight: 100, frames: 1 }
    ];

    const promises = spriteList.map(s =>
      this.loadSprite(s.name, s.url, s.frameWidth, s.frameHeight, s.frames).catch(err => {
        if (!this.silent) console.warn(`SpriteManager: failed to load ${s.name}`, err);
        return null;
      })
    );

    await Promise.allSettled(promises);
    return Array.from(this.loadedSprites.keys());
  }

  // Load a single sprite. src may be an image path/dataURL or a .yymps JSON that points to image/dataUrl
  async loadSprite(name, src, frameWidth = null, frameHeight = null, frames = 1) {
    if (this.loadedSprites.has(name)) return this.loadedSprites.get(name);
    if (this.loadingPromises.has(name)) return this.loadingPromises.get(name);

    const p = (async () => {
      try {
        // Support .yymps metadata files (JSON describing the sprite)
        if (typeof src === 'string' && src.toLowerCase().endsWith('.yymps')) {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`Failed to fetch .yymps: ${src}`);
          const meta = await res.json();
          // meta may contain image (path), dataUrl, frameWidth, frameHeight, frames
          src = meta.dataUrl || meta.image || meta.url || src;
          frameWidth = frameWidth || meta.frameWidth;
          frameHeight = frameHeight || meta.frameHeight;
          frames = frames || meta.frames || 1;
        }

        // Load image with simple retry strategy for common path issues
        const tryLoad = (url) => new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Image load failed: ${url}`));
          img.src = url;
        });

        const candidates = [];
        if (typeof src === 'string') {
          candidates.push(src);
          // Try without leading slash
          if (src.startsWith('/')) candidates.push(src.slice(1));
          // Try under ./public path
          candidates.push(`./${src}`);
          // If src ends with .png try a .svg variant as a last resort
          if (src.toLowerCase().endsWith('.png')) {
            candidates.push(src.slice(0, -4) + '.svg');
            if (src.startsWith('/')) candidates.push(src.slice(1).slice(0, -4) + '.svg');
            candidates.push(`./${src.slice(0, -4)}.svg`);
          }
        }

        // Normalize candidates (remove duplicate slashes and leading './' when unnecessary)
        const normalize = (u) => {
          if (!u) return u;
          // replace multiple slashes with single
          u = u.replace(/\\/g, '/').replace(/\/\/+/g, '/');
          // remove leading './' that became './/'
          u = u.replace(/^\.\//, './');
          return u;
        };

        const seen = new Set();
        const normalized = [];
        for (let c of candidates) {
          const n = normalize(c);
          if (!n) continue;
          if (seen.has(n)) continue;
          seen.add(n);
          normalized.push(n);
        }

        // use normalized candidates
        const tryCandidates = normalized.length ? normalized : candidates;

        let img;
        let lastErr;
  for (let c of tryCandidates) {
          try {
            img = await tryLoad(c);
            break;
          } catch (err) {
            lastErr = err;
          }
        }
        if (!img) {
          const msg = (lastErr && lastErr.message) || `Image load failed for ${src}`;
          this.failedSprites.set(name, msg);
          if (!this.silent) console.warn(`SpriteManager: ${msg}`);
          throw lastErr || new Error(`Image load failed for ${src}`);
        }

        const spriteData = {
          image: img,
          frameWidth: frameWidth || img.width,
          frameHeight: frameHeight || img.height,
          frames: frames || 1,
          totalWidth: img.width,
          totalHeight: img.height
        };
  this.loadedSprites.set(name, spriteData);
  // clear any previous failure record
  if (this.failedSprites.has(name)) this.failedSprites.delete(name);

        return this.loadedSprites.get(name);
      } finally {
        // remove loading promise so future attempts can retry
        this.loadingPromises.delete(name);
      }
    })();

    this.loadingPromises.set(name, p);
    return p;
  }

  getSprite(name) {
    return this.loadedSprites.get(name);
  }

  // Draw a specific frame from a sprite sheet. If sprite isn't loaded, draw a fallback rectangle.
  drawFrame(ctx, spriteName, frameIndex, x, y, width, height, flipX = false) {
    const s = this.loadedSprites.get(spriteName);
    if (!s) {
      ctx.save();
      ctx.fillStyle = this.getFallbackColor(spriteName);
      ctx.fillRect(x, y, width, height);
      ctx.restore();
      return;
    }

    const frame = Math.max(0, frameIndex % (s.frames || 1));
    const sx = frame * s.frameWidth;
    const sy = 0;

    ctx.save();
    if (flipX) {
      ctx.translate(x + width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(s.image, sx, sy, s.frameWidth, s.frameHeight, 0, y, width, height);
    } else {
      ctx.drawImage(s.image, sx, sy, s.frameWidth, s.frameHeight, x, y, width, height);
    }
    ctx.restore();
  }

  // Draw using a simple animation state object: { currentFrame }
  drawAnimated(ctx, spriteName, animationState, x, y, width, height, flipX = false) {
    const frameIndex = animationState && typeof animationState.currentFrame === 'number' ? animationState.currentFrame : 0;
    this.drawFrame(ctx, spriteName, frameIndex, x, y, width, height, flipX);
  }

  getFallbackColor(spriteName) {
    const map = {
      cat_walk: '#FF8C42',
      cat_jump: '#FF6B6B',
      cat_idle: '#FFB84D',
      cactus: '#228B22',
      bird: '#4169E1',
      spike: '#8B0000',
      coin: '#FFD700',
      powerup: '#00FFFF',
      sky: '#87CEEB',
      mountain: '#8B7355',
      tree: '#228B22',
      ground: '#8B4513'
    };
    return map[spriteName] || '#CCCCCC';
  }

  isLoaded(name) {
    return this.loadedSprites.has(name);
  }

  // Return a list of sprites that failed to load and their errors
  getFailedSprites() {
    return Array.from(this.failedSprites.entries()).map(([name, err]) => ({ name, error: err }));
  }

  // Return true if there are no recorded failures (note: does not mean every desired sprite was requested)
  isAllLoaded() {
    return this.failedSprites.size === 0 && this.loadingPromises.size === 0;
  }
}

// Simple frame-based animation state helper
export class AnimationState {
  constructor(totalFrames = 1, frameRate = 8) {
    this.totalFrames = totalFrames;
    this.frameRate = frameRate; // ticks per frame
    this.currentFrame = 0;
    this._timer = 0;
    this.loop = true;
    this.playing = true;
  }

  update() {
    if (!this.playing) return;
    this._timer++;
    if (this._timer >= this.frameRate) {
      this._timer = 0;
      this.currentFrame++;
      if (this.currentFrame >= this.totalFrames) {
        if (this.loop) this.currentFrame = 0;
        else {
          this.currentFrame = this.totalFrames - 1;
          this.playing = false;
        }
      }
    }
  }

  reset() {
    this.currentFrame = 0;
    this._timer = 0;
    this.playing = true;
  }

  setFrame(f) {
    this.currentFrame = Math.max(0, Math.min(f, this.totalFrames - 1));
  }
}

export default SpriteManager;
