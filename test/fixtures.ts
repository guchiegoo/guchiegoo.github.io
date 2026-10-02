import sampleJson from '../public/catalog.json'
import type { Catalog } from '../src/catalog/types'

/** A fresh deep copy of the sample catalog, so tests can mutate it freely. */
export function sampleCatalog(): Catalog {
  return JSON.parse(JSON.stringify(sampleJson)) as Catalog
}

export function styleOf(catalog: Catalog, code: string) {
  const style = catalog.styles.find((s) => s.code === code)
  if (!style) throw new Error(`No style ${code}`)
  return style
}

/** A minimal successful fetch Response carrying the given JSON body. */
export function okResponse(body: unknown): Response {
  return { ok: true, status: 200, json: async () => body } as unknown as Response
}
