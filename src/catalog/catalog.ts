import type { Catalog, CatalogStyle, CatalogVariant, StyleAvailability } from './types'

type Obj = Record<string, unknown>

const isObj = (x: unknown): x is Obj => typeof x === 'object' && x !== null && !Array.isArray(x)
const isStr = (x: unknown): x is string => typeof x === 'string' && x.length > 0
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x)

function invalid(): never {
  throw new Error('Invalid catalog')
}

function parseVariant(raw: unknown): CatalogVariant | null {
  if (!isObj(raw)) return null
  const { sku, color, size, priceCents, available, buyUrl } = raw
  if (!isStr(sku) || !isStr(color) || !isStr(size)) return null
  if (!isNum(priceCents) || priceCents < 0) return null
  if (!isNum(available)) return null
  if (buyUrl !== null && !isStr(buyUrl)) return null
  return { sku, color, size, priceCents, available: Math.max(0, Math.floor(available)), buyUrl }
}

function parseStyle(raw: unknown): CatalogStyle {
  if (!isObj(raw)) invalid()
  const { code, name, priceCents, images, variants } = raw
  if (!isStr(code) || !isStr(name) || !isNum(priceCents) || !Array.isArray(variants)) invalid()
  return {
    code,
    name,
    priceCents,
    images: Array.isArray(images) ? images.filter(isStr) : [],
    variants: variants.map(parseVariant).filter((v): v is CatalogVariant => v !== null),
  }
}

/**
 * Validate untrusted JSON into a Catalog.
 * Throws `Error('Invalid catalog')` when the top-level or style shape is wrong;
 * individual variants with bad fields are dropped rather than failing the whole shop.
 */
export function parseCatalog(json: unknown): Catalog {
  if (!isObj(json)) invalid()
  const { generatedAt, business, shippingCents, styles } = json
  if (!isStr(generatedAt) || !isStr(business) || !isNum(shippingCents) || !Array.isArray(styles)) invalid()
  return { generatedAt, business, shippingCents, styles: styles.map(parseStyle) }
}

/** A variant can be bought only when it has stock and a Stripe link. */
export function isPurchasable(v: CatalogVariant): boolean {
  return v.available > 0 && v.buyUrl !== null
}

export function styleAvailability(s: CatalogStyle): StyleAvailability {
  if (s.variants.some(isPurchasable)) return 'available'
  if (s.variants.some((v) => v.available > 0)) return 'coming-soon'
  return 'sold-out'
}

/** Colours in order of first appearance; soldOut when no variant of that colour has stock. */
export function colorsFor(s: CatalogStyle): Array<{ color: string; soldOut: boolean }> {
  const order: string[] = []
  const inStock = new Map<string, boolean>()
  for (const v of s.variants) {
    if (!inStock.has(v.color)) {
      order.push(v.color)
      inStock.set(v.color, false)
    }
    if (v.available > 0) inStock.set(v.color, true)
  }
  return order.map((color) => ({ color, soldOut: !inStock.get(color) }))
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function sizeRank(size: string): number {
  const i = SIZE_ORDER.indexOf(size.toUpperCase())
  return i === -1 ? SIZE_ORDER.length : i
}

/** Sizes offered in a colour, sorted XS..XXL then alphabetically. */
export function sizesFor(
  s: CatalogStyle,
  color: string,
): Array<{ size: string; variant: CatalogVariant; soldOut: boolean }> {
  return s.variants
    .filter((v) => v.color === color)
    .map((variant) => ({ size: variant.size, variant, soldOut: variant.available <= 0 }))
    .sort((a, b) => sizeRank(a.size) - sizeRank(b.size) || a.size.localeCompare(b.size))
}

/** 4800 -> "$48", 6950 -> "$69.50". */
export function formatPrice(cents: number): string {
  const dollars = cents / 100
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`
}

/** "Only N left" for 1-2 units, "Sold out" at 0, otherwise nothing. */
export function scarcityLabel(v: CatalogVariant): string | null {
  if (v.available <= 0) return 'Sold out'
  if (v.available <= 2) return `Only ${v.available} left`
  return null
}

export function findStyle(catalog: Catalog, code: string): CatalogStyle | undefined {
  return catalog.styles.find((s) => s.code.toUpperCase() === code.toUpperCase())
}
