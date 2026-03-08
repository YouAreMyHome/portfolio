import { lazy, Suspense } from 'react'

// Lazy load UI components
export const PanelOverlay = lazy(() => import('../components/UI/PanelOverlay'))
export const TVGameOverlay = lazy(() => import('../components/UI/TVGameOverlay'))
export const KanbanOverlay = lazy(() => import('../components/UI/KanbanOverlay'))
export const MusicPlayer = lazy(() => import('../components/UI/MusicPlayer'))
export const PolaroidLightbox = lazy(() => import('../components/UI/PolaroidLightbox'))
export const PortfolioOS = lazy(() => import('../components/PortfolioOS/PortfolioOS'))

// Loading fallback component
export const LoadingFallback = () => null

// Wrapper component for lazy components
export function LazyComponent({ component: Component, fallback = <LoadingFallback /> }) {
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  )
}
