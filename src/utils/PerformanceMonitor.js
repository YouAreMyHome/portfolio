// src/utils/PerformanceMonitor.js
/**
 * Performance Monitor for Game Optimization
 * Tracks FPS, memory usage, and performance metrics
 */

class PerformanceMonitor {
  constructor(sampleSize = 60) {
    this.sampleSize = sampleSize;
    this.frameTimes = [];
    this.lastTime = 0;
    this.fps = 0;
    this.averageFps = 0;
    this.minFps = Infinity;
    this.maxFps = 0;
    this.frameCount = 0;
    
    // Memory tracking
    this.memoryUsage = {
      current: 0,
      peak: 0,
      average: 0,
      samples: []
    };
    
    // Performance warnings
    this.warnings = {
      lowFps: [],
      highMemory: [],
      frameDrops: []
    };
    
    // Thresholds
    this.thresholds = {
      lowFps: 30,
      highMemory: 50 * 1024 * 1024, // 50MB
      frameDropThreshold: 10 // ms
    };
    
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.startMemoryMonitoring();
  }

  stop() {
    this.isRunning = false;
  }

  update(currentTime = performance.now()) {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Calculate FPS
    this.fps = deltaTime > 0 ? 1000 / deltaTime : 0;
    this.frameCount++;
    
    // Store frame time sample
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > this.sampleSize) {
      this.frameTimes.shift();
    }
    
    // Update FPS statistics
    this.updateFpsStats();
    
    // Check for performance issues
    this.checkPerformanceWarnings(deltaTime);
    
    // Update memory usage periodically
    if (this.frameCount % 60 === 0) {
      this.updateMemoryUsage();
    }
  }

  updateFpsStats() {
    if (this.frameTimes.length === 0) return;
    
    const totalFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0);
    this.averageFps = 1000 / (totalFrameTime / this.frameTimes.length);
    
    this.minFps = Math.min(this.minFps, this.fps);
    this.maxFps = Math.max(this.maxFps, this.fps);
  }

  updateMemoryUsage() {
    if (performance.memory) {
      const memory = performance.memory;
      this.memoryUsage.current = memory.usedJSHeapSize;
      this.memoryUsage.peak = Math.max(this.memoryUsage.peak, memory.usedJSHeapSize);
      
      this.memoryUsage.samples.push(memory.usedJSHeapSize);
      if (this.memoryUsage.samples.length > 100) {
        this.memoryUsage.samples.shift();
      }
      
      this.memoryUsage.average = this.memoryUsage.samples.reduce((sum, val) => sum + val, 0) / this.memoryUsage.samples.length;
    }
  }

  checkPerformanceWarnings(deltaTime) {
    const currentTime = performance.now();
    
    // Low FPS warning
    if (this.fps < this.thresholds.lowFps) {
      this.warnings.lowFps.push({
        time: currentTime,
        fps: this.fps,
        frameTime: deltaTime
      });
      
      // Keep only recent warnings
      this.warnings.lowFps = this.warnings.lowFps.filter(
        warning => currentTime - warning.time < 10000
      );
    }
    
    // Frame drop warning
    if (deltaTime > this.thresholds.frameDropThreshold) {
      this.warnings.frameDrops.push({
        time: currentTime,
        frameTime: deltaTime
      });
      
      this.warnings.frameDrops = this.warnings.frameDrops.filter(
        warning => currentTime - warning.time < 5000
      );
    }
    
    // High memory warning
    if (this.memoryUsage.current > this.thresholds.highMemory) {
      this.warnings.highMemory.push({
        time: currentTime,
        memory: this.memoryUsage.current
      });
      
      this.warnings.highMemory = this.warnings.highMemory.filter(
        warning => currentTime - warning.time < 30000
      );
    }
  }

  startMemoryMonitoring() {
    if (!performance.memory) return;
    
    // Force garbage collection if available (dev tools)
    if (window.gc) {
      setInterval(() => {
        window.gc();
      }, 10000);
    }
  }

  getStats() {
    return {
      fps: {
        current: Math.round(this.fps * 10) / 10,
        average: Math.round(this.averageFps * 10) / 10,
        min: Math.round(this.minFps * 10) / 10,
        max: Math.round(this.maxFps * 10) / 10
      },
      memory: {
        current: this.formatBytes(this.memoryUsage.current),
        peak: this.formatBytes(this.memoryUsage.peak),
        average: this.formatBytes(this.memoryUsage.average)
      },
      warnings: {
        lowFpsCount: this.warnings.lowFps.length,
        frameDropCount: this.warnings.frameDrops.length,
        highMemoryCount: this.warnings.highMemory.length
      },
      frameCount: this.frameCount
    };
  }

  getDetailedWarnings() {
    return {
      lowFps: this.warnings.lowFps.slice(-5), // Last 5 warnings
      frameDrops: this.warnings.frameDrops.slice(-5),
      highMemory: this.warnings.highMemory.slice(-5)
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  reset() {
    this.frameTimes = [];
    this.fps = 0;
    this.averageFps = 0;
    this.minFps = Infinity;
    this.maxFps = 0;
    this.frameCount = 0;
    
    this.memoryUsage = {
      current: 0,
      peak: 0,
      average: 0,
      samples: []
    };
    
    this.warnings = {
      lowFps: [],
      highMemory: [],
      frameDrops: []
    };
  }

  // Performance optimization suggestions
  getOptimizationSuggestions() {
    const suggestions = [];
    const stats = this.getStats();
    
    if (stats.fps.average < 30) {
      suggestions.push({
        type: 'critical',
        message: 'Low average FPS detected. Consider reducing visual effects or game complexity.',
        priority: 1
      });
    }
    
    if (stats.warnings.frameDropCount > 10) {
      suggestions.push({
        type: 'warning',
        message: 'Frequent frame drops detected. Check for blocking operations in game loop.',
        priority: 2
      });
    }
    
    if (this.memoryUsage.current > 30 * 1024 * 1024) { // 30MB
      suggestions.push({
        type: 'warning',
        message: 'High memory usage detected. Consider implementing object pooling.',
        priority: 2
      });
    }
    
    if (stats.fps.max - stats.fps.min > 30) {
      suggestions.push({
        type: 'info',
        message: 'High FPS variance detected. Consider frame rate limiting.',
        priority: 3
      });
    }
    
    return suggestions.sort((a, b) => a.priority - b.priority);
  }
  
  render(ctx, x = 10, y = 10) {
    if (!this.isRunning) return;
    
    const stats = this.getStats();
    
    // Background
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, 180, 80);
    ctx.strokeStyle = '#00f7ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 180, 80);
    
    // Text
    ctx.fillStyle = '#00f7ff';
    ctx.font = '12px monospace';
    ctx.fillText(`FPS: ${stats.fps.current.toFixed(1)}`, x + 5, y + 15);
    ctx.fillText(`Avg: ${stats.fps.average.toFixed(1)}`, x + 5, y + 30);
    ctx.fillText(`Min: ${stats.fps.min.toFixed(1)}`, x + 5, y + 45);
    ctx.fillText(`Max: ${stats.fps.max.toFixed(1)}`, x + 5, y + 60);
    
    // Memory (if available)
    if (performance.memory) {
      const memMB = (this.memoryUsage.current / 1024 / 1024).toFixed(1);
      ctx.fillText(`Mem: ${memMB}MB`, x + 90, y + 15);
    }
    
    ctx.restore();
  }
}

export default PerformanceMonitor;
