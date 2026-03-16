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
  const dpr = window.devicePixelRatio || 1

  // Mobile ưu tiên FPS ổn định, giảm các hiệu ứng nặng GPU.
  if (isMobile) {
    return {
      shadows: false,
      postProcessing: false,
      pixelRatio: Math.min(dpr, 1.15),
      antialias: false,
      aoSamples: 4,
      bloomIntensity: 0.22,
      softShadows: false,
      shadowSamples: 4,
      shadowSize: 16,
      contactShadows: false,
      contactShadowFramesMain: 1,
      contactShadowFramesRug: 1,
      contactShadowResolutionMain: 256,
      contactShadowResolutionRug: 128,
      composerMultisampling: 0,
      zoom: 55
    }
  }

  // Tablet giữ phần lớn trải nghiệm visual nhưng giới hạn chi phí render.
  if (isTablet) {
    return {
      shadows: true,
      postProcessing: true,
      pixelRatio: Math.min(dpr, 1.5),
      antialias: true,
      aoSamples: 8,
      bloomIntensity: 0.28,
      softShadows: false,
      shadowSamples: 8,
      shadowSize: 20,
      contactShadows: true,
      contactShadowFramesMain: 60,
      contactShadowFramesRug: 40,
      contactShadowResolutionMain: 384,
      contactShadowResolutionRug: 192,
      composerMultisampling: 2,
      zoom: 65
    }
  }

  // Desktop giữ chất lượng cao.
  return {
    shadows: true,
    postProcessing: true,
    pixelRatio: Math.min(dpr, 2),
    antialias: true,
    aoSamples: 16,
    bloomIntensity: 0.35,
    softShadows: true,
    shadowSamples: 16,
    shadowSize: 25,
    contactShadows: true,
    contactShadowFramesMain: 120,
    contactShadowFramesRug: 80,
    contactShadowResolutionMain: 512,
    contactShadowResolutionRug: 256,
    composerMultisampling: 4,
    zoom: 80
  }
}

export default useMobile
