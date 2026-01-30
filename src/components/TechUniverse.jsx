import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TechUniverse = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [floatingElements] = useState([
    // Tech symbols
    { symbol: '{', x: 0, y: 0, speed: 0.5, size: 20, opacity: 0.3 },
    { symbol: '}', x: 0, y: 0, speed: 0.7, size: 18, opacity: 0.25 },
    { symbol: '</', x: 0, y: 0, speed: 0.4, size: 16, opacity: 0.35 },
    { symbol: '/>', x: 0, y: 0, speed: 0.6, size: 14, opacity: 0.3 },
    { symbol: '[]', x: 0, y: 0, speed: 0.3, size: 22, opacity: 0.2 },
    { symbol: '()', x: 0, y: 0, speed: 0.8, size: 12, opacity: 0.4 },
    { symbol: '=>', x: 0, y: 0, speed: 0.5, size: 16, opacity: 0.3 },
    { symbol: '&&', x: 0, y: 0, speed: 0.4, size: 18, opacity: 0.25 },
    { symbol: '||', x: 0, y: 0, speed: 0.6, size: 20, opacity: 0.3 },
    { symbol: '!==', x: 0, y: 0, speed: 0.7, size: 15, opacity: 0.35 },
    { symbol: '===', x: 0, y: 0, speed: 0.3, size: 17, opacity: 0.3 },
    { symbol: '++', x: 0, y: 0, speed: 0.9, size: 14, opacity: 0.4 },
    { symbol: '--', x: 0, y: 0, speed: 0.4, size: 16, opacity: 0.25 },
    { symbol: '=>', x: 0, y: 0, speed: 0.6, size: 18, opacity: 0.3 },
    { symbol: '...', x: 0, y: 0, speed: 0.5, size: 20, opacity: 0.2 },
    // Binary numbers
    { symbol: '0101', x: 0, y: 0, speed: 0.3, size: 12, opacity: 0.15 },
    { symbol: '1010', x: 0, y: 0, speed: 0.7, size: 14, opacity: 0.2 },
    { symbol: '1100', x: 0, y: 0, speed: 0.4, size: 10, opacity: 0.25 },
    { symbol: '0011', x: 0, y: 0, speed: 0.8, size: 16, opacity: 0.15 },
    // Hex codes
    { symbol: '#FF0', x: 0, y: 0, speed: 0.5, size: 14, opacity: 0.3 },
    { symbol: '#0FF', x: 0, y: 0, speed: 0.6, size: 12, opacity: 0.25 },
    { symbol: '#F0F', x: 0, y: 0, speed: 0.4, size: 16, opacity: 0.2 },
  ]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Initialize random positions for floating elements
    floatingElements.forEach(element => {
      element.x = Math.random() * window.innerWidth;
      element.y = Math.random() * window.innerHeight;
      element.rotation = Math.random() * 360;
      element.rotationSpeed = (Math.random() - 0.5) * 2;
    });

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid pattern
      drawGrid(ctx, canvas.width, canvas.height);
      
      // Draw floating tech elements
      drawFloatingElements(ctx, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions]);

  const drawGrid = (ctx, width, height) => {
    const gridSize = 50;
    
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawFloatingElements = (ctx, width, height) => {
    floatingElements.forEach(element => {
      // Update position
      element.y -= element.speed;
      element.rotation += element.rotationSpeed;

      // Reset position if element goes off screen
      if (element.y < -50) {
        element.y = height + 50;
        element.x = Math.random() * width;
      }

      // Draw element
      ctx.save();
      ctx.translate(element.x, element.y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      ctx.font = `${element.size}px JetBrains Mono, monospace`;
      ctx.fillStyle = `rgba(0, 247, 255, ${element.opacity})`;
      ctx.textAlign = 'center';
      ctx.fillText(element.symbol, 0, 0);
      
      ctx.restore();
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Canvas for animated background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* 3D Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating cubes */}
        <motion.div
          className="absolute w-20 h-20 border border-cyber-blue/20"
          style={{
            left: '10%',
            top: '20%',
            transform: 'rotateX(45deg) rotateY(45deg)',
          }}
          animate={{
            rotateX: [45, 90, 45],
            rotateY: [45, 90, 135, 45],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        <motion.div
          className="absolute w-16 h-16 border border-cyber-purple/20"
          style={{
            right: '15%',
            top: '30%',
            transform: 'rotateX(30deg) rotateZ(30deg)',
          }}
          animate={{
            rotateX: [30, 120, 30],
            rotateZ: [30, 90, 150, 30],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating hexagons */}
        <motion.div
          className="absolute w-24 h-24"
          style={{
            left: '70%',
            bottom: '20%',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full border-2 border-cyber-pink/30 transform rotate-45" />
        </motion.div>

        {/* Neural network nodes */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyber-blue/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Data streams */}
        <div className="absolute left-0 top-1/4 w-full h-px overflow-hidden">
          <motion.div
            className="w-20 h-px bg-gradient-to-r from-transparent via-cyber-blue to-transparent"
            animate={{
              x: ['-100px', '100vw'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
        
        <div className="absolute right-0 top-2/3 w-full h-px overflow-hidden">
          <motion.div
            className="w-32 h-px bg-gradient-to-r from-transparent via-cyber-purple to-transparent"
            animate={{
              x: ['100vw', '-100px'],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'linear',
              delay: 2,
            }}
          />
        </div>

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 10 L5 10 L5 5 L15 5 L15 15 L10 15 L10 20"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#circuit)"
              className="text-cyber-blue"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TechUniverse;
