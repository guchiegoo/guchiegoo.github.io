/** One buyable SKU: a single colour + size of a style. */
export interface CatalogVariant {
  sku: string
  color: string
  size: string
  priceCents: number
  /** Units the station will sell right now (0 when sold out or not live). */
  available: number
  /** Stripe Payment Link, or null until one exists. */
  buyUrl: string | null
}

/** A garment style, e.g. "HD" = Oversize Fleeced Hoodie. */
export interface CatalogStyle {
  code: string
  name: string
  priceCents: number
  /** Image paths relative to the site root, e.g. "images/HD/main.jpg". May be empty. */
  images: string[]
  variants: CatalogVariant[]
}

/** The whole `public/catalog.json`, written by the station. */
export interface Catalog {
  generatedAt: string
  business: string
  shippingCents: number
  styles: CatalogStyle[]
}

export type StyleAvailability = 'available' | 'sold-out'
