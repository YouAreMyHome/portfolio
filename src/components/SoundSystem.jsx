import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

// Sound context
const SoundContext = createContext();

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
};

// Sound Provider Component
export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRefs = useRef({});

  // Pre-generate audio using Web Audio API for cyberpunk sounds
  const generateCyberSound = (type, frequency = 440, duration = 0.2) => {
    if (typeof window === 'undefined' || !window.AudioContext) return null;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case 'hover':
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, audioContext.currentTime + duration);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          oscillator.type = 'sine';
          break;

        case 'click':
          oscillator.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioContext.currentTime + duration);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume * 0.2, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          oscillator.type = 'square';
          break;

        case 'success':
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(frequency * 2, audioContext.currentTime + duration / 2);
          oscillator.frequency.linearRampToValueAtTime(frequency * 1.5, audioContext.currentTime + duration);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume * 0.15, audioContext.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          oscillator.type = 'triangle';
          break;

        case 'error':
          oscillator.frequency.setValueAtTime(frequency * 0.5, audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(frequency * 0.3, audioContext.currentTime + duration);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          oscillator.type = 'sawtooth';
          break;

        case 'typing':
          oscillator.frequency.setValueAtTime(frequency + Math.random() * 100, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume * 0.05, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
          oscillator.type = 'square';
          break;

        case 'glitch':
          // Create rapid frequency changes for glitch effect
          const startTime = audioContext.currentTime;
          for (let i = 0; i < 10; i++) {
            const time = startTime + (i * duration / 10);
            oscillator.frequency.setValueAtTime(
              frequency + (Math.random() - 0.5) * frequency * 0.5,
              time
            );
          }
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          oscillator.type = 'sawtooth';
          break;

        default:
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          oscillator.type = 'sine';
      }

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      return { audioContext, oscillator, gainNode };
    } catch (error) {
      console.warn('Audio context not supported:', error);
      return null;
    }
  };

  const playSound = (type, options = {}) => {
    if (isMuted || typeof window === 'undefined') return;

    const { frequency = 440, duration = 0.2 } = options;
    generateCyberSound(type, frequency, duration);
  };

  // Ambient sound generator
  const generateAmbientSound = () => {
    if (isMuted || typeof window === 'undefined') return null;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create multiple oscillators for ambient effect
      const oscillators = [];
      const gainNodes = [];

      // Low frequency hum
      const bass = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      bass.frequency.setValueAtTime(40, audioContext.currentTime);
      bass.type = 'sine';
      bassGain.gain.setValueAtTime(volume * 0.02, audioContext.currentTime);
      bass.connect(bassGain);
      bassGain.connect(audioContext.destination);
      
      // High frequency ambient
      const treble = audioContext.createOscillator();
      const trebleGain = audioContext.createGain();
      treble.frequency.setValueAtTime(2000 + Math.random() * 1000, audioContext.currentTime);
      treble.type = 'triangle';
      trebleGain.gain.setValueAtTime(volume * 0.01, audioContext.currentTime);
      treble.connect(trebleGain);
      trebleGain.connect(audioContext.destination);

      // Start oscillators
      bass.start();
      treble.start();

      oscillators.push(bass, treble);
      gainNodes.push(bassGain, trebleGain);

      return {
        audioContext,
        oscillators,
        gainNodes,
        stop: () => {
          oscillators.forEach(osc => {
            try {
              osc.stop();
            } catch (e) {
              // Oscillator might already be stopped
            }
          });
        }
      };
    } catch (error) {
      console.warn('Ambient sound not supported:', error);
      return null;
    }
  };

  const contextValue = {
    isMuted,
    setIsMuted,
    volume,
    setVolume,
    playSound,
    generateAmbientSound,
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

// Custom hook for specific sound effects
export const useCyberSounds = () => {
  const { playSound, isMuted } = useSoundContext();

  return {
    playHover: () => playSound('hover', { frequency: 800, duration: 0.1 }),
    playClick: () => playSound('click', { frequency: 1000, duration: 0.15 }),
    playSuccess: () => playSound('success', { frequency: 600, duration: 0.5 }),
    playError: () => playSound('error', { frequency: 200, duration: 0.8 }),
    playTyping: () => playSound('typing', { frequency: 1200, duration: 0.05 }),
    playGlitch: () => playSound('glitch', { frequency: 500, duration: 0.3 }),
    playNavigation: () => playSound('hover', { frequency: 1500, duration: 0.2 }),
    playNotification: () => playSound('success', { frequency: 800, duration: 0.3 }),
    isMuted,
  };
};

// Sound control component
export const SoundControls = () => {
  const { isMuted, setIsMuted, volume, setVolume } = useSoundContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-20 left-4 z-40">
      <div className="relative">
        {/* Control button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 cyber-card border-cyber-blue/30 transition-colors ${
            isOpen ? 'bg-cyber-blue/20 text-cyber-blue' : 'text-gray-400 hover:text-cyber-blue'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMuted ? (
              <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            ) : (
              <>
                <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path d="M17 8l4 4-4 4M19 12H9" />
              </>
            )}
          </svg>
        </button>

        {/* Control panel */}
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 p-4 cyber-card border-cyber-blue/30 min-w-max">
            <div className="space-y-4">
              {/* Mute toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-300">Sound:</span>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    isMuted
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}
                >
                  {isMuted ? 'OFF' : 'ON'}
                </button>
              </div>

              {/* Volume control */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-300">Volume:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isMuted}
                  />
                  <span className="text-xs font-mono text-cyber-blue min-w-[2rem]">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>

              {/* Sound test */}
              <div className="space-y-2">
                <span className="text-sm font-mono text-gray-300">Test:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => !isMuted && playSound('hover')}
                    className="px-2 py-1 bg-cyber-blue/20 border border-cyber-blue/30 rounded text-xs text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                    disabled={isMuted}
                  >
                    Hover
                  </button>
                  <button
                    onClick={() => !isMuted && playSound('click')}
                    className="px-2 py-1 bg-cyber-blue/20 border border-cyber-blue/30 rounded text-xs text-cyber-blue hover:bg-cyber-blue/30 transition-colors"
                    disabled={isMuted}
                  >
                    Click
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for custom slider */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00f7ff;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #00f7ff;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      `}</style>
    </div>
  );
};

// HOC to add sound effects to components
export const withSoundEffects = (WrappedComponent) => {
  return function SoundEnhancedComponent(props) {
    const sounds = useCyberSounds();

    return <WrappedComponent {...props} sounds={sounds} />;
  };
};

// Hook for ambient sound management
export const useAmbientSound = (enabled = false) => {
  const { generateAmbientSound, isMuted, volume } = useSoundContext();
  const ambientRef = useRef(null);

  useEffect(() => {
    if (enabled && !isMuted && !ambientRef.current) {
      ambientRef.current = generateAmbientSound();
    } else if ((!enabled || isMuted) && ambientRef.current) {
      ambientRef.current.stop();
      ambientRef.current = null;
    }

    return () => {
      if (ambientRef.current) {
        ambientRef.current.stop();
        ambientRef.current = null;
      }
    };
  }, [enabled, isMuted, generateAmbientSound]);

  useEffect(() => {
    // Update volume for ambient sound
    if (ambientRef.current && ambientRef.current.gainNodes) {
      ambientRef.current.gainNodes.forEach(gainNode => {
        gainNode.gain.setValueAtTime(volume * 0.02, gainNode.context.currentTime);
      });
    }
  }, [volume]);

  return {
    startAmbient: () => {
      if (!ambientRef.current && !isMuted) {
        ambientRef.current = generateAmbientSound();
      }
    },
    stopAmbient: () => {
      if (ambientRef.current) {
        ambientRef.current.stop();
        ambientRef.current = null;
      }
    },
    isPlaying: !!ambientRef.current,
  };
};

export default SoundProvider;
