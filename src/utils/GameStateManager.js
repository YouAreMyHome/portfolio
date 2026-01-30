// src/utils/GameStateManager.js
/**
 * Game State Manager for Optimized Cat Run Game
 * Manages game state, saves/loads, and provides state transitions
 */

class GameStateManager {
  constructor() {
    this.currentState = 'menu';
    this.previousState = null;
    this.stateHistory = [];
    this.gameData = this.getDefaultGameData();
    this.settings = this.loadSettings();
    this.achievements = this.loadAchievements();
    this.statistics = this.loadStatistics();
    
    // State change listeners
    this.listeners = {};
  }

  getDefaultGameData() {
    return {
      score: 0,
      highScore: parseInt(localStorage.getItem('catrun-highscore') || '0'),
      gameSpeed: 1,
      level: 1,
      powerUps: {
        shield: 0,
        speedBoost: 0,
        doubleJump: false,
        scoreMultiplier: 1,
        scoreMultiplierTime: 0
      },
      player: {
        x: 80,
        y: 250,
        velocityY: 0,
        onGround: true,
        animation: {
          frame: 0,
          frameTime: 0,
          state: 'running'
        }
      },
      obstacles: [],
      powerUpItems: [],
      particles: [],
      sessionStartTime: Date.now(),
      playTime: 0,
      obstaclesPassed: 0,
      powerUpsCollected: 0,
      jumps: 0,
      deaths: 0
    };
  }

  loadSettings() {
    const defaultSettings = {
      soundEnabled: true,
      musicEnabled: true,
      soundVolume: 0.7,
      musicVolume: 0.5,
      quality: 'high', // low, medium, high
      showFPS: false,
      showDebugInfo: false,
      controlScheme: 'space', // space, click, both
      difficulty: 'normal', // easy, normal, hard
      theme: 'cyber' // cyber, retro, minimal
    };

    try {
      const saved = localStorage.getItem('catrun-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      console.warn('Failed to load settings:', e);
      return defaultSettings;
    }
  }

  loadAchievements() {
    const defaultAchievements = {
      firstJump: { unlocked: false, timestamp: null },
      firstPowerUp: { unlocked: false, timestamp: null },
      score100: { unlocked: false, timestamp: null },
      score500: { unlocked: false, timestamp: null },
      score1000: { unlocked: false, timestamp: null },
      speed2x: { unlocked: false, timestamp: null },
      obstacles100: { unlocked: false, timestamp: null },
      perfectRun: { unlocked: false, timestamp: null },
      speedDemon: { unlocked: false, timestamp: null },
      survivor: { unlocked: false, timestamp: null }
    };

    try {
      const saved = localStorage.getItem('catrun-achievements');
      return saved ? { ...defaultAchievements, ...JSON.parse(saved) } : defaultAchievements;
    } catch (e) {
      console.warn('Failed to load achievements:', e);
      return defaultAchievements;
    }
  }

  loadStatistics() {
    const defaultStats = {
      gamesPlayed: 0,
      totalPlayTime: 0,
      totalScore: 0,
      totalJumps: 0,
      totalObstaclesPassed: 0,
      totalPowerUpsCollected: 0,
      totalDeaths: 0,
      bestStreaks: {
        obstacles: 0,
        powerUps: 0,
        perfectJumps: 0
      },
      averageScore: 0,
      averageGameTime: 0,
      favoritePowerUp: null
    };

    try {
      const saved = localStorage.getItem('catrun-statistics');
      return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    } catch (e) {
      console.warn('Failed to load statistics:', e);
      return defaultStats;
    }
  }

  // State Management
  setState(newState, data = {}) {
    if (this.currentState === newState) return;

    this.previousState = this.currentState;
    this.stateHistory.push({
      from: this.currentState,
      to: newState,
      timestamp: Date.now(),
      data
    });

    // Keep history manageable
    if (this.stateHistory.length > 100) {
      this.stateHistory.shift();
    }

    this.currentState = newState;
    this.notifyListeners('stateChange', {
      from: this.previousState,
      to: newState,
      data
    });

    // State-specific actions
    this.handleStateTransition(newState, this.previousState, data);
  }

  handleStateTransition(newState, oldState, data) {
    switch (newState) {
      case 'playing':
        if (oldState === 'menu' || oldState === 'gameOver') {
          this.startNewGame();
        }
        break;
      
      case 'gameOver':
        this.endGame(data);
        break;
      
      case 'paused':
        this.pauseGame();
        break;
      
      case 'menu':
        this.returnToMenu();
        break;
    }
  }

  startNewGame() {
    this.gameData = this.getDefaultGameData();
    this.gameData.sessionStartTime = Date.now();
    this.statistics.gamesPlayed++;
    this.notifyListeners('gameStart', this.gameData);
  }

  endGame(data = {}) {
    const endTime = Date.now();
    const playTime = endTime - this.gameData.sessionStartTime;
    
    // Update statistics
    this.statistics.totalPlayTime += playTime;
    this.statistics.totalScore += this.gameData.score;
    this.statistics.totalJumps += this.gameData.jumps;
    this.statistics.totalObstaclesPassed += this.gameData.obstaclesPassed;
    this.statistics.totalPowerUpsCollected += this.gameData.powerUpsCollected;
    this.statistics.totalDeaths++;
    
    // Calculate averages
    this.statistics.averageScore = this.statistics.totalScore / this.statistics.gamesPlayed;
    this.statistics.averageGameTime = this.statistics.totalPlayTime / this.statistics.gamesPlayed;
    
    // Update high score
    if (this.gameData.score > this.gameData.highScore) {
      this.gameData.highScore = this.gameData.score;
      localStorage.setItem('catrun-highscore', this.gameData.score.toString());
    }
    
    // Check achievements
    this.checkAchievements();
    
    // Save progress
    this.saveProgress();
    
    this.notifyListeners('gameEnd', {
      score: this.gameData.score,
      playTime,
      statistics: this.statistics
    });
  }

  pauseGame() {
    this.notifyListeners('gamePause', {
      currentScore: this.gameData.score,
      playTime: Date.now() - this.gameData.sessionStartTime
    });
  }

  returnToMenu() {
    this.notifyListeners('returnMenu', {});
  }

  // Achievement System
  checkAchievements() {
    const newAchievements = [];

    // Score-based achievements
    if (!this.achievements.score100.unlocked && this.gameData.score >= 100) {
      this.unlockAchievement('score100', newAchievements);
    }
    if (!this.achievements.score500.unlocked && this.gameData.score >= 500) {
      this.unlockAchievement('score500', newAchievements);
    }
    if (!this.achievements.score1000.unlocked && this.gameData.score >= 1000) {
      this.unlockAchievement('score1000', newAchievements);
    }

    // Speed achievement
    if (!this.achievements.speed2x.unlocked && this.gameData.gameSpeed >= 2) {
      this.unlockAchievement('speed2x', newAchievements);
    }

    // Obstacle achievement
    if (!this.achievements.obstacles100.unlocked && this.gameData.obstaclesPassed >= 100) {
      this.unlockAchievement('obstacles100', newAchievements);
    }

    // Perfect run (no deaths in a high-score game)
    if (!this.achievements.perfectRun.unlocked && 
        this.gameData.score >= 300 && 
        this.gameData.deaths === 0) {
      this.unlockAchievement('perfectRun', newAchievements);
    }

    return newAchievements;
  }

  unlockAchievement(achievementId, newAchievements) {
    this.achievements[achievementId] = {
      unlocked: true,
      timestamp: Date.now()
    };
    newAchievements.push(achievementId);
    this.notifyListeners('achievementUnlocked', achievementId);
  }

  // Data Management
  updateGameData(updates) {
    this.gameData = { ...this.gameData, ...updates };
    this.notifyListeners('gameDataUpdate', updates);
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.notifyListeners('settingsUpdate', newSettings);
  }

  saveProgress() {
    try {
      localStorage.setItem('catrun-achievements', JSON.stringify(this.achievements));
      localStorage.setItem('catrun-statistics', JSON.stringify(this.statistics));
      localStorage.setItem('catrun-highscore', this.gameData.highScore.toString());
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('catrun-settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }

  // Event System
  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.warn('Error in event listener:', e);
        }
      });
    }
  }

  // Getters
  getCurrentState() {
    return this.currentState;
  }

  getGameData() {
    return { ...this.gameData };
  }

  getSettings() {
    return { ...this.settings };
  }

  getAchievements() {
    return { ...this.achievements };
  }

  getStatistics() {
    return { ...this.statistics };
  }

  // Game actions
  incrementScore(amount = 1) {
    const multiplier = this.gameData.powerUps.scoreMultiplier;
    const points = amount * multiplier * this.gameData.gameSpeed;
    this.gameData.score += points;
    this.notifyListeners('scoreUpdate', { 
      points, 
      total: this.gameData.score,
      multiplier 
    });
  }

  collectPowerUp(type) {
    this.gameData.powerUpsCollected++;
    this.notifyListeners('powerUpCollected', type);
  }

  passObstacle() {
    this.gameData.obstaclesPassed++;
    this.incrementScore(10); // Bonus for passing obstacle
    this.notifyListeners('obstaclePass', this.gameData.obstaclesPassed);
  }

  playerJump() {
    this.gameData.jumps++;
    this.notifyListeners('playerJump', this.gameData.jumps);
  }

  playerDeath() {
    this.gameData.deaths++;
    this.notifyListeners('playerDeath', this.gameData.deaths);
  }
  
  addCoins(count = 1) {
    this.gameData.coinsCollected = (this.gameData.coinsCollected || 0) + count;
    this.statistics.totalCoinsCollected += count;
    this.saveStatistics();
    this.notifyListeners('coinsCollected', this.gameData.coinsCollected);
  }
  
  updateStats(stats) {
    if (stats.gamesPlayed) {
      this.statistics.gamesPlayed += stats.gamesPlayed;
    }
    if (stats.totalScore) {
      this.statistics.totalScore += stats.totalScore;
    }
    if (stats.obstaclesJumped) {
      this.statistics.totalObstaclesPassed += stats.obstaclesJumped;
    }
    this.saveStatistics();
    this.notifyListeners('statsUpdated', this.statistics);
  }

  saveStatistics() {
    localStorage.setItem('catrun-statistics', JSON.stringify(this.statistics));
  }

  // Reset and cleanup
  reset() {
    this.currentState = 'menu';
    this.previousState = null;
    this.stateHistory = [];
    this.gameData = this.getDefaultGameData();
  }

  clearAllData() {
    localStorage.removeItem('catrun-achievements');
    localStorage.removeItem('catrun-statistics');
    localStorage.removeItem('catrun-settings');
    localStorage.removeItem('catrun-highscore');
    
    this.achievements = this.loadAchievements();
    this.statistics = this.loadStatistics();
    this.settings = this.loadSettings();
    this.gameData = this.getDefaultGameData();
  }
}

export default GameStateManager;
