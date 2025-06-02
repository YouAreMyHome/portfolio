// src/components/JsRunnerGame.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const WALK_SPRITE = { id: 'walk', sprite: '/assets/game/cat_walk_sprite.png', frames: 7, speed: 120, loop: true, width: 32, height: 32 };
const JUMP_SPRITE = { id: 'jump', sprite: '/assets/game/cat_jump_sprite.png', frames: 13, speed: 80, loop: false, width: 32, height: 32 };
const IDLE_SPRITE = WALK_SPRITE;

const JsRunnerGame = () => {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Game states
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [playerBottom, setPlayerBottom] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState(IDLE_SPRITE);
  const [playerFrame, setPlayerFrame] = useState(0);
  const [gameWidth, setGameWidth] = useState(600);

  const animationIntervalRef = useRef(null);
  const gameContainerRef = useRef(null);
  const playerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const obstacleTimerRef = useRef(null);

  // Mobile detection function
  const detectMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    const isSmallScreen = window.innerWidth < 768;
    return isMobileDevice || isSmallScreen;
  };

  // Check for mobile on component mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(detectMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Game constants
  const playerInitialLeft = useMemo(() => Math.max(30, gameWidth * 0.08), [gameWidth]);
  const obstacleWidth = useMemo(() => Math.max(15, gameWidth * 0.03), [gameWidth]);
  const gameSpeed = useMemo(() => Math.max(3, gameWidth * 0.008), [gameWidth]);
  const jumpHeight = 120;
  const gravity = 7;
  const playerWidth = currentAnimation.width;
  const playerHeight = currentAnimation.height;

      // Update game width on resize
  useEffect(() => {
    setGameWidth(600); // Fixed width for desktop
  }, []);

  // Animation states
  useEffect(() => {
    let newAnimation = currentAnimation;
    let resetFrame = false;
    
    if (gameOver) {
      // Keep current animation when game over
    } else if (gameStarted) {
      if (isJumping) {
        if (currentAnimation.id !== JUMP_SPRITE.id) {
          newAnimation = JUMP_SPRITE;
          resetFrame = true;
        }
      } else {
        if (currentAnimation.id !== WALK_SPRITE.id) {
          newAnimation = WALK_SPRITE;
          resetFrame = true;
        }
      }
    } else {
      if (currentAnimation.id !== IDLE_SPRITE.id) {
        newAnimation = IDLE_SPRITE;
        resetFrame = true;
      }
    }
    
    if (newAnimation.id !== currentAnimation.id) {
      setCurrentAnimation(newAnimation);
    }
    if (resetFrame) {
      setPlayerFrame(0);
    }
  }, [gameStarted, gameOver, isJumping, currentAnimation.id]);

  // Animation frames
  useEffect(() => {
    clearInterval(animationIntervalRef.current);
    
    if ((gameStarted && !gameOver) || (!gameStarted && !gameOver && currentAnimation.loop)) {
      if (currentAnimation.frames > 1) {
        animationIntervalRef.current = setInterval(() => {
          setPlayerFrame(prevFrame => {
            const nextFrame = prevFrame + 1;
            if (nextFrame >= currentAnimation.frames) {
              return currentAnimation.loop ? 0 : prevFrame;
            }
            return nextFrame;
          });
        }, currentAnimation.speed);
      } else {
        setPlayerFrame(0);
      }
    }
    
    return () => clearInterval(animationIntervalRef.current);
  }, [currentAnimation, gameStarted, gameOver]);

  // Game functions
  const startGame = useCallback(() => {
    setScore(0);
    setPlayerBottom(0);
    setIsJumping(false);
    setObstacles([]);
    setGameOver(false);
    setGameStarted(true);
    if (playerRef.current) {
      playerRef.current.style.bottom = `0px`;
    }
  }, []);

  const jump = useCallback(() => {
    if (!isJumping && gameStarted && !gameOver) {
      setIsJumping(true);
      let currentJumpVelocity = 20;
      
      const jumpUpInterval = setInterval(() => {
        setPlayerBottom(pb => {
          const nextBottom = pb + currentJumpVelocity;
          currentJumpVelocity -= 1.1;
          
          if (currentJumpVelocity <= -5 || nextBottom >= jumpHeight + 10) {
            clearInterval(jumpUpInterval);
            
            const fallInterval = setInterval(() => {
              setPlayerBottom(pfb => {
                if (pfb - gravity <= 0) {
                  clearInterval(fallInterval);
                  setIsJumping(false);
                  return 0;
                }
                return pfb - gravity;
              });
            }, 25);
            
            return Math.min(nextBottom, jumpHeight + 5);
          }
          return nextBottom;
        });
      }, 20);
    }
  }, [isJumping, gameStarted, gameOver, jumpHeight, gravity]);

  const handleAction = useCallback(() => {
    if (gameOver) {
      startGame();
    } else if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  }, [gameOver, gameStarted, startGame, jump]);

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(function gameTick() {
        setObstacles(prevObstacles => 
          prevObstacles
            .map(obs => ({ ...obs, left: obs.left - gameSpeed }))
            .filter(obs => obs.left > -obstacleWidth)
        );

        if (playerRef.current && gameContainerRef.current) {
          const playerRect = {
            top: gameContainerRef.current.offsetHeight - playerBottom - playerHeight,
            bottom: gameContainerRef.current.offsetHeight - playerBottom,
            left: playerInitialLeft,
            right: playerInitialLeft + playerWidth,
            height: playerHeight,
            width: playerWidth
          };

          obstacles.forEach(obs => {
            const obsRect = {
              top: gameContainerRef.current.offsetHeight - (obs.height || 40),
              bottom: gameContainerRef.current.offsetHeight,
              left: obs.left,
              right: obs.left + obstacleWidth,
              height: (obs.height || 40),
              width: obstacleWidth
            };

            if (playerRect.left < obsRect.right && 
                playerRect.right > obsRect.left && 
                playerRect.top < obsRect.bottom && 
                playerRect.bottom > obsRect.top) {
              setGameOver(true);
            }
          });
        }

        if (gameStarted && !gameOver) {
          setScore(s => s + 1);
          gameLoopRef.current = requestAnimationFrame(gameTick);
        } else {
          cancelAnimationFrame(gameLoopRef.current);
        }
      });
    } else {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, obstacles, playerBottom, playerHeight, playerWidth, gameSpeed, playerInitialLeft, obstacleWidth]);

  // Obstacle spawning
  useEffect(() => {
    if (gameStarted && !gameOver) {
      obstacleTimerRef.current = setInterval(() => {
        setObstacles(prevObstacles => [
          ...prevObstacles,
          {
            id: Date.now(),
            left: gameWidth,
            height: Math.random() * 50 + 20
          }
        ]);
      }, 1800 + Math.random() * 1200);
    }

    return () => {
      if (obstacleTimerRef.current) {
        clearInterval(obstacleTimerRef.current);
      }
    };
  }, [gameStarted, gameOver, gameWidth]);

  // Keyboard controls
  const handleKeyPress = useCallback((event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl &&
        (activeEl.tagName === 'INPUT' ||
         activeEl.tagName === 'TEXTAREA' ||
         activeEl.isContentEditable === true ||
         (activeEl.closest && activeEl.closest('form')));

      if (event.code === 'Space' && isInputFocused) {
        return;
      }

      event.preventDefault();
      handleAction();
    }
  }, [handleAction]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Update player position
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.style.bottom = `${playerBottom}px`;
    }
  }, [playerBottom]);

  // If mobile, show message instead of game
  if (isMobile) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 
        bg-neutral-800 dark:bg-neutral-900 
        rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-900 dark:border-black">

        {/* TV Brand */}
        <div className="h-6 md:h-8 flex items-center justify-center mb-2 md:mb-3">
          <span className="text-xs md:text-sm font-bold text-neutral-500 dark:text-neutral-600 tracking-widest uppercase">
            CAT-VISION™
          </span>
        </div>

        {/* Title */}
        <div className="px-4 mb-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-sky-400 dark:text-sky-300 mb-2 tracking-tight">
            Cat Run!
          </h2>
        </div>

        {/* Mobile Message */}
        <div className="mx-auto rounded-lg shadow-inner
          border-2 border-black/70 dark:border-black/90
          bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-400
          dark:from-slate-700 dark:via-gray-800 dark:to-slate-950
          p-8 text-center"
          style={{ width: '100%', minHeight: '200px' }}>
          
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl mb-4">🖥️</div>
            <h3 className="text-lg font-bold text-white dark:text-slate-200 mb-3">
              Desktop Required
            </h3>
            <p className="text-sm text-white/90 dark:text-slate-300 leading-relaxed max-w-sm">
              This game is optimized for desktop experience. Please visit this page on a PC or laptop browser for the best gaming experience!
            </p>
            <div className="mt-4 text-xs text-white/70 dark:text-slate-400">
              🎮 Use keyboard controls for jumping
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="h-8 md:h-10 mt-3 flex items-center justify-between px-4">
          <div className="px-4 py-1.5 rounded-md bg-neutral-600 text-white text-xs font-semibold">
            Mobile Detected
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-5 h-1 bg-neutral-700 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop game
  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 
      bg-neutral-800 dark:bg-neutral-900 
      rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-neutral-900 dark:border-black
      transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105">

      {/* TV Brand */}
      <div className="h-6 md:h-8 flex items-center justify-center mb-2 md:mb-3">
        <span className="text-xs md:text-sm font-bold text-neutral-500 dark:text-neutral-600 tracking-widest uppercase">
          CAT-VISION™
        </span>
      </div>

      {/* Title and Instructions */}
      <div className="px-4 mb-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-sky-400 dark:text-sky-300 mb-2 tracking-tight">
          Cat Run!
        </h2>
        <p className="mb-3 text-xs md:text-sm text-neutral-300 dark:text-neutral-400 leading-tight">
          Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-600 border border-neutral-400 dark:border-neutral-500 rounded shadow-sm">Space</kbd> or <kbd className="px-1.5 py-0.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-600 border border-neutral-400 dark:border-neutral-500 rounded shadow-sm">↑</kbd> / Click Button
        </p>
      </div>

      {/* Game Screen */}
      <div
        ref={gameContainerRef}
        className="js-game-container mx-auto rounded-lg shadow-inner cursor-pointer
          border-2 border-black/70 dark:border-black/90
          bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-400
          dark:from-slate-700 dark:via-gray-800 dark:to-slate-950"
        style={{
          width: `${gameWidth}px`,
          height: '250px',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={handleAction}
      >
        {/* Player */}
        <div
          ref={playerRef}
          className="js-player absolute render-pixelated"
          style={{
            left: `${playerInitialLeft}px`,
            bottom: `${playerBottom}px`,
            width: `${playerWidth}px`,
            height: `${playerHeight}px`,
            backgroundImage: `url(${currentAnimation.sprite})`,
            backgroundPositionX: `-${playerFrame * playerWidth}px`,
            backgroundPositionY: `0px`,
          }}
        ></div>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="js-obstacle absolute rounded-t-sm bg-emerald-600 dark:bg-emerald-700 border-b-2 border-emerald-800 dark:border-emerald-900"
            style={{
              bottom: '0px',
              left: `${obs.left}px`,
              width: `${obstacleWidth}px`,
              height: `${obs.height || 40}px`,
            }}
          ></div>
        ))}

        {/* Score Board */}
        <div className="absolute top-2 right-3 px-2 py-0.5
          bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm
          rounded-md shadow
          text-xl font-bold text-orange-600 dark:text-orange-400">
          Score: {score}
        </div>

        {/* Start Instructions */}
        {!gameStarted && !gameOver && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            p-6 rounded-lg shadow-xl text-center
            bg-white/75 dark:bg-slate-950/75 backdrop-blur-sm
            text-lg font-semibold text-sky-700 dark:text-sky-300
            transition-opacity duration-300 ease-out">
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-600 border border-neutral-400 dark:border-neutral-500 rounded shadow-sm">Space</kbd> to Start
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            p-6 rounded-lg shadow-xl text-center
            bg-red-600/75 dark:bg-red-800/75 backdrop-blur-sm
            text-lg font-bold text-white dark:text-red-100
            transition-opacity duration-300 ease-out">
            Game Over! Score: {score}.<br />
            <div className="mt-1">
              Press <kbd className="px-1.5 py-0.5 mt-1.5 text-xs font-semibold text-red-800 dark:text-red-200 bg-white dark:bg-red-300 border border-red-300 dark:border-red-400 rounded shadow-sm">Space</kbd> to Restart.
            </div>
          </div>
        )}
      </div>

      {/* Control Button and Power Indicator */}
      <div className="h-8 md:h-10 mt-3 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={handleAction}
          className="px-4 py-1.5 rounded-md
            bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700
            text-white text-sm font-semibold shadow-md
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75
            active:bg-sky-700 dark:active:bg-sky-800
            transition-all duration-150 active:scale-95"
          aria-label={gameOver || !gameStarted ? "Start Game" : "Jump"}
        >
          {gameOver ? "Play Again" : (!gameStarted ? "Start" : "Jump!")}
        </button>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 ${gameStarted && !gameOver ? 'bg-green-500 animate-pulse' : 'bg-red-600/70'} rounded-full transition-colors duration-300`}></div>
          <div className="w-5 h-1 bg-neutral-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default JsRunnerGame;