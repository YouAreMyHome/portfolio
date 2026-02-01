import { useState, useEffect } from 'react'

/**
 * Hook to detect mobile device and screen size
 * Used for performance optimization and UI adjustments
 */
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [screenSize, setScreenSize] = useState('desktop')
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Touch detection
      const hasTouch = 'ontouchstart' in window || 
                       navigator.maxTouchPoints > 0 ||
                       window.matchMedia('(pointer: coarse)').matches
      
      // Screen size categories
      const mobile = width <= 480
      const tablet = width > 480 && width <= 1024
      
      setIsMobile(mobile)
      setIsTablet(tablet)
      setIsTouchDevice(hasTouch)
      
      if (mobile) {
        setScreenSize('mobile')
      } else if (tablet) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)
    
    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])
  
  return {
    isMobile,
    isTablet,
    isTouchDevice,
    screenSize,
    isSmallScreen: isMobile || isTablet
  }
}

/**
 * Get optimized graphics settings based on device
 * Full quality for all devices
 */
export function getGraphicsSettings(isMobile, isTablet) {
  // Full quality for all devices - same as desktop
  const fullQuality = {
    shadows: true,
    postProcessing: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    antialias: true,
    aoSamples: 16,
    bloomIntensity: 0.35,
    softShadows: true,
    zoom: isMobile ? 55 : isTablet ? 65 : 80  // Only adjust zoom for screen size
  }
  
  return fullQuality
}

export default useMobile
