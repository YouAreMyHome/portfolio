import { useCallback, useEffect, useRef } from 'react'
import { create } from 'zustand'

/**
 * Sound Effects System
 * Uses Web Audio API for low-latency playback
 */

// Sound store for global mute control
export const useSoundStore = create((set) => ({
  isMuted: false,
  volume: 0.5,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
}))

// Audio context singleton
let audioContext = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Resume audio context on user interaction (required by browsers)
const resumeAudioContext = () => {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
}

// Sound generators using Web Audio API (no external files needed!)
const soundGenerators = {
  // Click sound - short blip
  click: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
    
    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  },
  
  // Hover sound - subtle tick
  hover: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    
    gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  },
  
  // Panel open - ascending chime
  panelOpen: (ctx, volume) => {
    const notes = [523, 659, 784] // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      
      const startTime = ctx.currentTime + i * 0.08
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2)
      
      osc.start(startTime)
      osc.stop(startTime + 0.2)
    })
  },
  
  // Panel close - descending
  panelClose: (ctx, volume) => {
    const notes = [784, 659, 523] // G5, E5, C5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      
      const startTime = ctx.currentTime + i * 0.06
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15)
      
      osc.start(startTime)
      osc.stop(startTime + 0.15)
    })
  },
  
  // Day mode - bright sound
  dayMode: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15)
    
    gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  },
  
  // Night mode - softer, lower sound
  nightMode: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.2)
    
    gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  },
  
  // Cat meow - synthesized meow
  meow: (ctx, volume) => {
    // Main "meow" tone
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    // Meow frequency contour
    osc.frequency.setValueAtTime(700, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4)
    
    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  },
  
  // Easter egg - celebration fanfare
  easterEgg: (ctx, volume) => {
    const melody = [523, 659, 784, 1047] // C5, E5, G5, C6
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      
      const startTime = ctx.currentTime + i * 0.1
      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(volume * 0.15, startTime + 0.02)
      gain.gain.setValueAtTime(volume * 0.15, startTime + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25)
      
      osc.start(startTime)
      osc.stop(startTime + 0.25)
    })
  },
  
  // Success sound
  success: (ctx, volume) => {
    const notes = [523, 784] // C5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      
      const startTime = ctx.currentTime + i * 0.1
      gain.gain.setValueAtTime(volume * 0.25, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2)
      
      osc.start(startTime)
      osc.stop(startTime + 0.2)
    })
  },
  
  // Character - bubble pop
  charPop: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  },

  // Character - happy ding
  charHappy: (ctx, volume) => {
    ;[880, 1100].forEach((freq) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(volume * 0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    })
  },

  // Character - angry buzz
  charAngry: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(volume * 0.20, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  },

  // Character - shy hmm
  charShy: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(volume * 0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  },

  // Character - tired sigh
  charTired: (ctx, volume) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(250, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume * 0.08, ctx.currentTime + 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  },

  // Whoosh - for transitions
  whoosh: (ctx, volume) => {
    const bufferSize = ctx.sampleRate * 0.2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }
    
    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    
    source.buffer = buffer
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1000, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2)
    filter.Q.value = 1
    
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    
    source.start(ctx.currentTime)
    source.stop(ctx.currentTime + 0.2)
  },
}

/**
 * useSounds hook
 * @returns {Object} Sound functions
 */
export function useSounds() {
  const { isMuted, volume } = useSoundStore()
  const lastHoverTime = useRef(0)
  
  // Resume audio context on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      resumeAudioContext()
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
    
    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [])
  
  const playSound = useCallback((soundName) => {
    if (isMuted) return
    
    const generator = soundGenerators[soundName]
    if (!generator) {
      console.warn(`Sound "${soundName}" not found`)
      return
    }
    
    try {
      const ctx = getAudioContext()
      generator(ctx, volume)
    } catch (error) {
      console.warn('Error playing sound:', error)
    }
  }, [isMuted, volume])
  
  // Debounced hover sound
  const playHover = useCallback(() => {
    const now = Date.now()
    if (now - lastHoverTime.current > 100) {
      lastHoverTime.current = now
      playSound('hover')
    }
  }, [playSound])
  
  return {
    playClick: () => playSound('click'),
    playHover,
    playPanelOpen: () => playSound('panelOpen'),
    playPanelClose: () => playSound('panelClose'),
    playDayMode: () => playSound('dayMode'),
    playNightMode: () => playSound('nightMode'),
    playMeow: () => playSound('meow'),
    playEasterEgg: () => playSound('easterEgg'),
    playSuccess: () => playSound('success'),
    playWhoosh: () => playSound('whoosh'),
    playSound,
  }
}

export default useSounds
