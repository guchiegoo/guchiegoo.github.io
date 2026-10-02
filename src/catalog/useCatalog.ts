import { useEffect, useState } from 'react'
import { parseCatalog } from './catalog'
import type { Catalog } from './types'

export type CatalogState =
  | { status: 'loading'; catalog?: undefined }
  | { status: 'ready'; catalog: Catalog }
  | { status: 'error'; catalog?: undefined }

export const CATALOG_URL = '/catalog.json'

/**
 * Fetch and validate the station-written catalog. `no-store` so a freshly
 * published stock change is never hidden behind a browser cache.
 */
export function useCatalog(): CatalogState {
  const [state, setState] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetch(CATALOG_URL, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return parseCatalog(await res.json())
      })
      .then(
        (catalog) => {
          if (!cancelled) setState({ status: 'ready', catalog })
        },
        () => {
          if (!cancelled) setState({ status: 'error' })
        },
      )
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
