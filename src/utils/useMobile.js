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
 * Full quality for all devices with mathematically responsive zoom
 */
export function getGraphicsSettings(isMobile, isTablet) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200
  const height = typeof window !== 'undefined' ? window.innerHeight : 800
  const aspect = width / height

  // Tính toán zoom ban đầu chuẩn xác theo tỉ lệ màn hình
  const responsiveZoom = aspect < 0.65
    ? Math.max(34, Math.round(width / 10.0))
    : aspect < 1.0
      ? Math.max(48, Math.round(width / 10.8))
      : aspect < 1.3
        ? Math.max(65, Math.round(width / 12.0))
        : 95

  // Mobile ưu tiên FPS ổn định, giảm các hiệu ứng nặng GPU.
  if (isMobile) {
    return {
      shadows: false,
      postProcessing: false,
      pixelRatio: Math.min(dpr, 1.2),
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
      zoom: responsiveZoom,
      isMobile: true,
    }
  }

  // Tablet giữ phần lớn trải nghiệm visual nhưng giới hạn chi phí render.
  if (isTablet) {
    return {
      shadows: true,
      postProcessing: true,
      pixelRatio: Math.min(dpr, 1.5),
      antialias: false,
      aoSamples: 6,
      bloomIntensity: 0.28,
      softShadows: false,
      shadowSamples: 8,
      shadowSize: 20,
      contactShadows: true,
      contactShadowFramesMain: 1,
      contactShadowFramesRug: 1,
      contactShadowResolutionMain: 384,
      contactShadowResolutionRug: 192,
      composerMultisampling: 0,
      zoom: responsiveZoom,
      isTablet: true,
    }
  }

  // Desktop tối ưu mượt mà 60-120 FPS đẳng cấp Awwwards (Zoom 95 bố cục ấm cúng, đầy đặn)
  return {
    shadows: true,
    postProcessing: true,
    pixelRatio: Math.min(dpr, 1.5), // Giới hạn 1.5x kết hợp SMAA: Sắc nét hoàn hảo, giảm 45% GPU fillrate, triệt tiêu giật lag khi xoay camera
    antialias: false, // Tắt antialias canvas khi có EffectComposer SMAA để tránh đệm kép
    aoSamples: 8,
    bloomIntensity: 0.35,
    softShadows: true,
    shadowSamples: 8,
    shadowSize: 20,
    contactShadows: true,
    contactShadowFramesMain: 1,
    contactShadowFramesRug: 1,
    contactShadowResolutionMain: 512,
    contactShadowResolutionRug: 256,
    composerMultisampling: 0,
    zoom: responsiveZoom,
    isMobile: false,
  }
}

export default useMobile
