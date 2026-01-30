// Minimal AnimationState used by legacy game code when sprites are not used
export class AnimationState {
  constructor(frames = 1, frameRate = 8) {
    this.frames = frames;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.loop = true;
  }

  reset() {
    this.currentFrame = 0;
    this.frameTimer = 0;
  }

  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameRate) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % Math.max(1, this.frames);
      if (!this.loop && this.currentFrame === this.frames - 1) {
        // stop at last frame
        this.frameTimer = Infinity;
      }
    }
  }
}

export default AnimationState;
