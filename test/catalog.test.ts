import { describe, expect, it } from 'vitest'
import {
  colorsFor,
  formatPrice,
  isPurchasable,
  parseCatalog,
  scarcityLabel,
  sizesFor,
  styleAvailability,
} from '../src/catalog/catalog'
import type { CatalogVariant } from '../src/catalog/types'
import { sampleCatalog, styleOf } from './fixtures'

const variant = (over: Partial<CatalogVariant>): CatalogVariant => ({
  sku: 'WULE-X-Y-M',
  color: 'Pink',
  size: 'M',
  priceCents: 4800,
  available: 1,
  buyUrl: null,
  ...over,
})

type RawCatalog = { styles: Array<{ variants: Array<Record<string, unknown>> }> }

describe('parseCatalog', () => {
  it('parses the sample into 6 styles and 23 variants', () => {
    const c = parseCatalog(sampleCatalog())
    expect(c.styles).toHaveLength(6)
    expect(c.styles.reduce((n, s) => n + s.variants.length, 0)).toBe(23)
    expect(c.shippingCents).toBe(600)
    expect(c.business).toBe('Wulesport')
  })

  it('throws on a bad shape', () => {
    expect(() => parseCatalog({})).toThrow('Invalid catalog')
    expect(() => parseCatalog(null)).toThrow('Invalid catalog')
    expect(() => parseCatalog('nope')).toThrow('Invalid catalog')
  })

  it('drops a variant that is missing its sku', () => {
    const raw = sampleCatalog() as unknown as RawCatalog
    const droppedSku = raw.styles[0].variants[0].sku
    delete raw.styles[0].variants[0].sku
    const c = parseCatalog(raw)
    expect(c.styles[0].variants).toHaveLength(5)
    expect(c.styles[0].variants.map((v) => v.sku)).not.toContain(droppedSku)
  })

  it('drops variants with other bad fields', () => {
    const raw = sampleCatalog() as unknown as RawCatalog
    raw.styles[1].variants[0].available = 'lots'
    raw.styles[1].variants[1].buyUrl = 42
    expect(parseCatalog(raw).styles[1].variants).toHaveLength(10)
  })
})

describe('isPurchasable', () => {
  it('needs stock and a buy link', () => {
    expect(isPurchasable(variant({ available: 1, buyUrl: null }))).toBe(false)
    expect(isPurchasable(variant({ available: 1, buyUrl: 'https://buy.stripe.com/x' }))).toBe(true)
    expect(isPurchasable(variant({ available: 0, buyUrl: 'https://buy.stripe.com/x' }))).toBe(false)
  })
})

describe('styleAvailability', () => {
  it('is sold-out for SCT', () => {
    expect(styleAvailability(styleOf(sampleCatalog(), 'SCT'))).toBe('sold-out')
  })

  it('is coming-soon for HD when every buyUrl is null', () => {
    expect(styleAvailability(styleOf(sampleCatalog(), 'HD'))).toBe('coming-soon')
  })

  it('is available for HD once an in-stock variant has a buyUrl', () => {
    const hd = styleOf(sampleCatalog(), 'HD')
    hd.variants.find((v) => v.sku === 'WULE-HD-PINK-M')!.buyUrl = 'https://buy.stripe.com/x'
    expect(styleAvailability(hd)).toBe('available')
  })
})

describe('colorsFor', () => {
  it('keeps first-appearance order for HD, none sold out', () => {
    expect(colorsFor(styleOf(sampleCatalog(), 'HD'))).toEqual([
      { color: 'Brown', soldOut: false },
      { color: 'Coffee', soldOut: false },
      { color: 'Klein Blue', soldOut: false },
      { color: 'Medium Green', soldOut: false },
      { color: 'Pink', soldOut: false },
      { color: 'White', soldOut: false },
    ])
  })

  it('marks SCT Black sold out', () => {
    expect(colorsFor(styleOf(sampleCatalog(), 'SCT'))).toEqual([{ color: 'Black', soldOut: true }])
  })
})

describe('sizesFor', () => {
  it('lists HZ Oat Gray as S, M, L with L sold out', () => {
    const sizes = sizesFor(styleOf(sampleCatalog(), 'HZ'), 'Oat Gray')
    expect(sizes.map((s) => s.size)).toEqual(['S', 'M', 'L'])
    expect(sizes.map((s) => s.soldOut)).toEqual([false, false, true])
    expect(sizes[0].variant.sku).toBe('WULE-HZ-OATGRAY-S')
  })

  it('sorts known sizes first, then the rest alphabetically', () => {
    const style = {
      code: 'T',
      name: 'T',
      priceCents: 100,
      images: [],
      variants: ['XXL', 'One', 'M', 'XS', 'Kids', 'XL', 'S', 'L'].map((size) => variant({ size })),
    }
    expect(sizesFor(style, 'Pink').map((s) => s.size)).toEqual(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Kids', 'One'])
  })
})

describe('formatPrice', () => {
  it('drops cents when whole, keeps them otherwise', () => {
    expect(formatPrice(4800)).toBe('$48')
    expect(formatPrice(6950)).toBe('$69.50')
    expect(formatPrice(600)).toBe('$6')
  })
})

describe('scarcityLabel', () => {
  it('labels low and zero stock', () => {
    expect(scarcityLabel(variant({ available: 2 }))).toBe('Only 2 left')
    expect(scarcityLabel(variant({ available: 1 }))).toBe('Only 1 left')
    expect(scarcityLabel(variant({ available: 0 }))).toBe('Sold out')
    expect(scarcityLabel(variant({ available: 3 }))).toBeNull()
  })
})
