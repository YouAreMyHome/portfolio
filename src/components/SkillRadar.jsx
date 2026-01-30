import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SkillRadar = ({ skills = [], size = 300 }) => {
  const canvasRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Default skills if none provided
  const defaultSkills = [
    { name: 'JavaScript', level: 90, color: '#f7df1e' },
    { name: 'React', level: 85, color: '#61dafb' },
    { name: 'Node.js', level: 80, color: '#339933' },
    { name: 'Python', level: 75, color: '#3776ab' },
    { name: 'MongoDB', level: 70, color: '#47a248' },
    { name: 'TypeScript', level: 75, color: '#3178c6' },
    { name: 'Vue.js', level: 65, color: '#4fc08d' },
    { name: 'Docker', level: 60, color: '#2496ed' },
  ];

  const skillData = skills.length > 0 ? skills : defaultSkills;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size / 2 - 50;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    drawRadar(ctx);
  }, [animationProgress, hoveredSkill, size]);

  const drawRadar = (ctx) => {
    ctx.clearRect(0, 0, size, size);
    
    // Draw background circles
    drawBackgroundGrid(ctx);
    
    // Draw skill areas
    drawSkillArea(ctx);
    
    // Draw skill points
    drawSkillPoints(ctx);
    
    // Draw labels
    drawLabels(ctx);
  };

  const drawBackgroundGrid = (ctx) => {
    const levels = 5;
    
    // Draw concentric circles
    for (let i = 1; i <= levels; i++) {
      const radius = (maxRadius / levels) * i;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 247, 255, ${0.1 + (i * 0.05)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw level percentage
      ctx.fillStyle = 'rgba(0, 247, 255, 0.6)';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`${(i * 20)}%`, centerX, centerY - radius + 15);
    }
    
    // Draw radial lines
    skillData.forEach((_, index) => {
      const angle = (index / skillData.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(0, 247, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  const drawSkillArea = (ctx) => {
    if (animationProgress === 0) return;
    
    ctx.beginPath();
    
    skillData.forEach((skill, index) => {
      const angle = (index / skillData.length) * Math.PI * 2 - Math.PI / 2;
      const radius = (skill.level / 100) * maxRadius * animationProgress;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.closePath();
    
    // Fill with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(0, 247, 255, 0.2)');
    gradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.15)');
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Stroke
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawSkillPoints = (ctx) => {
    skillData.forEach((skill, index) => {
      const angle = (index / skillData.length) * Math.PI * 2 - Math.PI / 2;
      const radius = (skill.level / 100) * maxRadius * animationProgress;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, hoveredSkill === index ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = skill.color || '#00f7ff';
      ctx.fill();
      
      // Glow effect
      if (hoveredSkill === index) {
        ctx.shadowColor = skill.color || '#00f7ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = skill.color || '#00f7ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Border
      ctx.beginPath();
      ctx.arc(x, y, hoveredSkill === index ? 8 : 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  const drawLabels = (ctx) => {
    skillData.forEach((skill, index) => {
      const angle = (index / skillData.length) * Math.PI * 2 - Math.PI / 2;
      const labelRadius = maxRadius + 30;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;
      
      ctx.fillStyle = hoveredSkill === index ? '#00f7ff' : '#ffffff';
      ctx.font = `${hoveredSkill === index ? 'bold ' : ''}12px Orbitron`;
      ctx.textAlign = 'center';
      ctx.fillText(skill.name, x, y);
      
      // Level percentage
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`${skill.level}%`, x, y + 15);
    });
  };

  const getSkillAtPosition = (x, y) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;
    
    // Check if cursor is near any skill point
    for (let i = 0; i < skillData.length; i++) {
      const skill = skillData[i];
      const angle = (i / skillData.length) * Math.PI * 2 - Math.PI / 2;
      const radius = (skill.level / 100) * maxRadius * animationProgress;
      const pointX = centerX + Math.cos(angle) * radius;
      const pointY = centerY + Math.sin(angle) * radius;
      
      const distance = Math.sqrt(
        Math.pow(canvasX - pointX, 2) + Math.pow(canvasY - pointY, 2)
      );
      
      if (distance < 20) {
        return i;
      }
    }
    
    return null;
  };

  const handleMouseMove = (e) => {
    const skillIndex = getSkillAtPosition(e.clientX, e.clientY);
    setHoveredSkill(skillIndex);
  };

  const handleMouseLeave = () => {
    setHoveredSkill(null);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ width: size, height: size }}
      />
      
      {/* Skill details tooltip */}
      {hoveredSkill !== null && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 cyber-card p-3 min-w-max z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="text-center">
            <h4 className="font-orbitron font-bold text-white text-sm">
              {skillData[hoveredSkill].name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: skillData[hoveredSkill].color || '#00f7ff' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skillData[hoveredSkill].level}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs font-mono text-cyber-blue">
                {skillData[hoveredSkill].level}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-cyber-blue/50 bg-black/50 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-cyber-blue text-xs font-orbitron font-bold">
              SKILLS
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillRadar;
