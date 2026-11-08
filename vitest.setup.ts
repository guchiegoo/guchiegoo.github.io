import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom does not implement scrolling; the layout scrolls to top on navigation.
window.scrollTo = (() => {}) as typeof window.scrollTo

// jsdom has no canvas 2D context; canvas-confetti's real animation loop would
// keep ticking requestAnimationFrame after a test unmounts and throw.
vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})
