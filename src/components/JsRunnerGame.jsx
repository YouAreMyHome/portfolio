// src/components/JsRunnerGame.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ... (toàn bộ state, refs, sprite configs, useEffects, và functions logic game của bạn giữ nguyên như trước) ...
// Ví dụ:
const WALK_SPRITE = { id: 'walk', sprite: '/assets/game/cat_walk_sprite.png', frames: 7, speed: 120, loop: true, width: 32, height: 32 };
const JUMP_SPRITE = { id: 'jump', sprite: '/assets/game/cat_jump_sprite.png', frames: 13, speed: 80, loop: false, width: 32, height: 32 };
const IDLE_SPRITE = WALK_SPRITE;


const JsRunnerGame = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [playerBottom, setPlayerBottom] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState(IDLE_SPRITE);
  const [playerFrame, setPlayerFrame] = useState(0);

  const animationIntervalRef = useRef(null);
  const gameContainerRef = useRef(null);
  const playerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const obstacleTimerRef = useRef(null);

  const gameWidth = 600; // Giữ nguyên chiều rộng game của bạn
  const playerInitialLeft = 50;
  const obstacleWidth = 20;
  const gameSpeed = 5;
  const jumpHeight = 120;
  const gravity = 7;

  const playerWidth = currentAnimation.width;
  const playerHeight = currentAnimation.height;

  // --- Các useEffect cho logic game và animation (giữ nguyên logic JS của bạn) ---
  useEffect(() => {
    let newAnimation = currentAnimation;
    let resetFrame = false;
    if (gameOver) { /* ... */ }
    else if (gameStarted) { if (isJumping) { if (currentAnimation.id !== JUMP_SPRITE.id) { newAnimation = JUMP_SPRITE; resetFrame = true; } } else { if (currentAnimation.id !== WALK_SPRITE.id) { newAnimation = WALK_SPRITE; resetFrame = true; } } }
    else { if (currentAnimation.id !== IDLE_SPRITE.id) { newAnimation = IDLE_SPRITE; resetFrame = true; } }
    if (newAnimation.id !== currentAnimation.id) setCurrentAnimation(newAnimation);
    if (resetFrame) setPlayerFrame(0);
  }, [gameStarted, gameOver, isJumping, currentAnimation.id]);

  useEffect(() => {
    clearInterval(animationIntervalRef.current);
    if ((gameStarted && !gameOver) || (!gameStarted && !gameOver && currentAnimation.loop)) {
      if (currentAnimation.frames > 1) {
        animationIntervalRef.current = setInterval(() => {
          setPlayerFrame(prevFrame => { const nextFrame = prevFrame + 1; if (nextFrame >= currentAnimation.frames) { return currentAnimation.loop ? 0 : prevFrame; } return nextFrame; });
        }, currentAnimation.speed);
      } else { setPlayerFrame(0); }
    }
    return () => clearInterval(animationIntervalRef.current);
  }, [currentAnimation, gameStarted, gameOver]);

  const startGame = useCallback(() => { setScore(0); setPlayerBottom(0); setIsJumping(false); setObstacles([]); setGameOver(false); setGameStarted(true); if (playerRef.current) playerRef.current.style.bottom = `0px`; }, []);
  const jump = useCallback(() => { if (!isJumping && gameStarted && !gameOver) { setIsJumping(true); let currentJumpVelocity = 20; const jumpUpInterval = setInterval(() => { setPlayerBottom(pb => { const nextBottom = pb + currentJumpVelocity; currentJumpVelocity -= 1.1; if (currentJumpVelocity <= -5 || nextBottom >= jumpHeight + 10) { clearInterval(jumpUpInterval); const fallInterval = setInterval(() => { setPlayerBottom(pfb => { if (pfb - gravity <= 0) { clearInterval(fallInterval); setIsJumping(false); return 0; } return pfb - gravity; }); }, 25); return Math.min(nextBottom, jumpHeight + 5); } return nextBottom; }); }, 20); } }, [isJumping, gameStarted, gameOver, jumpHeight, gravity]);
  
  useEffect(() => { if (gameStarted && !gameOver) { gameLoopRef.current = requestAnimationFrame(function gameTick() { setObstacles(prevObstacles => prevObstacles.map(obs => ({ ...obs, left: obs.left - gameSpeed })).filter(obs => obs.left > -obstacleWidth)); if (playerRef.current && gameContainerRef.current) { const playerRect = { top: gameContainerRef.current.offsetHeight - playerBottom - playerHeight, bottom: gameContainerRef.current.offsetHeight - playerBottom, left: playerInitialLeft, right: playerInitialLeft + playerWidth, height: playerHeight, width: playerWidth }; obstacles.forEach(obs => { const obsRect = { top: gameContainerRef.current.offsetHeight - (obs.height || 40), bottom: gameContainerRef.current.offsetHeight, left: obs.left, right: obs.left + obstacleWidth, height: (obs.height || 40), width: obstacleWidth }; if (playerRect.left < obsRect.right && playerRect.right > obsRect.left && playerRect.top < obsRect.bottom && playerRect.bottom > obsRect.top) { setGameOver(true); } }); } if (gameStarted && !gameOver) { setScore(s => s + 1); gameLoopRef.current = requestAnimationFrame(gameTick); } else { cancelAnimationFrame(gameLoopRef.current); } }); } else { cancelAnimationFrame(gameLoopRef.current); } return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); }; }, [gameStarted, gameOver, obstacles, playerBottom, playerHeight, playerWidth, gameSpeed, playerInitialLeft, obstacleWidth]);
  
  useEffect(() => { if (gameStarted && !gameOver) { obstacleTimerRef.current = setInterval(() => { setObstacles(prevObstacles => [...prevObstacles, { id: Date.now(), left: gameWidth, height: Math.random() * 50 + 20 }]); }, 1800 + Math.random() * 1200); } return () => { if (obstacleTimerRef.current) clearInterval(obstacleTimerRef.current); }; }, [gameStarted, gameOver, gameWidth]);
  const handleKeyPress = useCallback((event) => { if (event.code === 'Space') { event.preventDefault(); if (gameOver) startGame(); else if (!gameStarted) startGame(); else jump(); } }, [gameOver, gameStarted, startGame, jump]);
  useEffect(() => { document.addEventListener('keydown', handleKeyPress); return () => document.removeEventListener('keydown', handleKeyPress); }, [handleKeyPress]);
  useEffect(() => { if (playerRef.current) { playerRef.current.style.bottom = `${playerBottom}px`; } }, [playerBottom]);


  return (
    // Section này đóng vai trò là "phông nền" cho chiếc TV
    
     <section id="fun-game" className="min-h-screen py-10 md:py-16 bg-slate-600 dark:bg-slate-800 flex items-center justify-center text-center px-4"> {/* Thêm px-4 để có chút lề ở màn hình nhỏ */}
      
     {/* Đây là "Thân TV" - ĐÃ CẬP NHẬT CLASS max-width */}
     <div className="max-w-2xl w-full mx-auto p-3 sm:p-4 md:p-6 
                     bg-neutral-800 dark:bg-neutral-900 
                     rounded-3xl shadow-2xl border-2 border-neutral-900 dark:border-black
                     transform transition-all duration-300 hover:scale-105_tv"> {/* Bỏ class .max-w-max_tv_width, dùng max-w-2xl của Tailwind */}
       
       {/* Chi tiết nhỏ trên TV: "Thương hiệu" (giữ nguyên) */}
       <div className="h-6 sm:h-8 flex items-center justify-center mb-2 sm:mb-3">
           <span className="text-[10px] sm:text-xs font-bold text-neutral-500 dark:text-neutral-600 tracking-widest uppercase">CAT-VISION™</span>
       </div>

       {/* Tiêu đề và Hướng dẫn - nằm trên "thân TV", phía trên màn hình (giữ nguyên) */}
       <div className="px-2 sm:px-4 mb-3 sm:mb-4">
         {/* ... h2 và p ... */}
         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-400 dark:text-sky-300 mb-2 md:mb-3 tracking-tight">
           Mini Game: <span className="text-orange-400 dark:text-orange-300">Cat Run!</span>
         </h2>
         <p className="mb-3 sm:mb-4 md:mb-5 text-xs sm:text-sm text-neutral-300 dark:text-neutral-400">
           Help the cat run! Press <kbd className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-600 border border-neutral-400 dark:border-neutral-500 rounded shadow-sm">Space</kbd> to start and jump!
         </p>
       </div>

       {/* "Màn hình TV" - Chính là khu vực chơi game của bạn */}
       <div
          ref={gameContainerRef}
          className="js-game-container mx-auto rounded-lg shadow-inner_tv cursor-pointer /* shadow-inner_tv là class custom */
                     border-2 border-black/70 dark:border-black/90 /* Viền màn hình */
                     bg-gradient-to-br from-sky-300 via-cyan-200 to-blue-300 /* Nền màn hình game */
                     dark:from-slate-700 dark:via-gray-800 dark:to-slate-900"
          style={{
            width: `${gameWidth}px`, // Chiều rộng game cố định
            height: '250px',        // Chiều cao game cố định
            position: 'relative',   // Tailwind: relative
            overflow: 'hidden'      // Tailwind: overflow-hidden
            // Bạn có thể thêm relative overflow-hidden vào className
          }}
        >
          {/* --- Player --- */}
          <div
            ref={playerRef}
            className="js-player absolute render-pixelated"
            style={{
              left: `${playerInitialLeft}px`, bottom: `${playerBottom}px`,
              width: `${playerWidth}px`, height: `${playerHeight}px`,
              backgroundImage: `url(${currentAnimation.sprite})`,
              backgroundPositionX: `-${playerFrame * playerWidth}px`, backgroundPositionY: `0px`,
            }}
          ></div>

          {/* --- Obstacles --- */}
          {obstacles.map(obs => (
            <div
              key={obs.id}
              className="js-obstacle absolute rounded-t-sm bg-emerald-600 dark:bg-emerald-700 border-b-2 border-emerald-800 dark:border-emerald-900"
              style={{
                bottom: '0px', left: `${obs.left}px`,
                width: `${obstacleWidth}px`, height: `${obs.height || 40}px`,
              }}
            ></div>
          ))}

          {/* --- Score Board --- */}
          <div className="absolute top-2 right-2.5 md:top-3 md:right-3.5 px-2 py-0.5  
                          bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm 
                          rounded-md shadow
                          text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">
            Score: {score}
          </div>

          {/* --- Instructions & Game Over (giữ nguyên style như trước, nhưng nằm trong "màn hình") --- */}
          {!gameStarted && !gameOver && (
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           p-4 md:p-6 rounded-lg shadow-xl text-center
                           bg-white/75 dark:bg-slate-950/75 backdrop-blur-sm
                           text-lg md:text-xl font-semibold text-sky-700 dark:text-sky-300
                           transition-opacity duration-300 ease-out ${gameStarted || gameOver ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              Press <kbd className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-600 border border-neutral-400 dark:border-neutral-500 rounded shadow-sm">Space</kbd> to Start
            </div>
          )}
          {gameOver && (
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           p-4 md:p-6 rounded-lg shadow-xl text-center
                           bg-red-600/75 dark:bg-red-800/75 backdrop-blur-sm
                           text-lg md:text-xl font-bold text-white dark:text-red-100
                           transition-opacity duration-300 ease-out ${!gameOver ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              Game Over! Score: {score}.<br />
              Press <kbd className="px-1.5 py-0.5 mt-1.5 text-[10px] sm:text-xs font-semibold text-red-800 dark:text-red-200 bg-white dark:bg-red-300 border border-red-300 dark:border-red-400 rounded shadow-sm">Space</kbd> to Restart.
            </div>
          )}
        </div>
       
       {/* Chi tiết nhỏ dưới TV: "Nút nguồn" (giả) (giữ nguyên) */}
       <div className="h-6 sm:h-8 mt-2 sm:mt-3 flex items-center justify-end px-4 space-x-2">
           {/* ... nút nguồn ... */}
           <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${gameStarted && !gameOver ? 'bg-green-500 animate-pulse' : 'bg-red-600/70'} rounded-full transition-colors duration-300`}></div>
           <div className="w-5 h-1 bg-neutral-700 rounded-full"></div>
       </div>
     </div>
   </section>
  );
};

export default JsRunnerGame;