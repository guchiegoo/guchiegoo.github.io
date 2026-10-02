import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../src/App'
import type { Catalog } from '../src/catalog/types'
import { okResponse, sampleCatalog } from './fixtures'

/** Stub fetch with a catalog and render the full app at `path`. */
export function renderApp(path: string, catalog: Catalog = sampleCatalog()) {
  const fetchMock = vi.fn().mockResolvedValue(okResponse(catalog))
  vi.stubGlobal('fetch', fetchMock)
  const utils = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  return { ...utils, fetchMock }
}

/** Make `matchMedia('(prefers-reduced-motion: reduce)')` report the given value. */
export function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: reduce && query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}
