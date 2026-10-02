import { createContext, useContext, type ReactNode } from 'react'
import { useCatalog, type CatalogState } from './useCatalog'

/** Exported so tests and static renders can supply a catalog directly. */
export const CatalogContext = createContext<CatalogState>({ status: 'loading' })

/** Fetches the catalog once for the whole app. */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const state = useCatalog()
  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>
}

export function useCatalogState(): CatalogState {
  return useContext(CatalogContext)
}
