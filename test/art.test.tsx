import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { colorHex } from '../src/art/colors'
import { GarmentArt, garmentKind } from '../src/art/GarmentArt'
import { ProductImage } from '../src/components/ProductImage'
import { sampleCatalog, styleOf } from './fixtures'

describe('colorHex', () => {
  it('maps known colours and falls back to grey', () => {
    expect(colorHex('Klein Blue')).toBe('#1f3fbf')
    expect(colorHex('Nope')).toBe('#999999')
  })

  it('resolves to a real hex for every colour in the sample catalog, known or not', () => {
    const colours = new Set(sampleCatalog().styles.flatMap((s) => s.variants.map((v) => v.color)))
    for (const c of colours) expect(colorHex(c), c).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe('garmentKind', () => {
  it('maps all five style codes', () => {
    expect(garmentKind('HD')).toBe('hoodie')
    expect(garmentKind('HZ')).toBe('halfzip')
    expect(garmentKind('AWLS')).toBe('longsleeve')
    expect(garmentKind('SCT')).toBe('tee')
    expect(garmentKind('WCT')).toBe('tee')
    expect(garmentKind('???')).toBe('tee')
  })
})

describe('GarmentArt', () => {
  it('renders a labelled svg whose body is filled with the colour', () => {
    const { container } = render(<GarmentArt styleCode="HD" color="Pink" label="Pink hoodie" />)
    const svg = screen.getByRole('img', { name: 'Pink hoodie' })
    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(container.querySelector('[data-part="body"]')).toHaveAttribute('fill', '#f2a7b8')
  })

  it('draws a hood only for the hoodie and a zip only for the half-zip', () => {
    const hd = render(<GarmentArt styleCode="HD" color="Pink" label="a" />)
    expect(hd.container.querySelector('[data-part="hood"]')).not.toBeNull()
    expect(hd.container.querySelector('[data-part="zip"]')).toBeNull()
    hd.unmount()
    const hz = render(<GarmentArt styleCode="HZ" color="Oat Gray" label="b" />)
    expect(hz.container.querySelector('[data-part="zip"]')).not.toBeNull()
    expect(hz.container.querySelector('[data-part="hood"]')).toBeNull()
  })
})

describe('ProductImage', () => {
  it('draws garment art when the style has no images', () => {
    const style = styleOf(sampleCatalog(), 'HD')
    render(<ProductImage style={style} color="Pink" alt="Pink hoodie" />)
    expect(screen.getByRole('img', { name: 'Pink hoodie' }).tagName.toLowerCase()).toBe('svg')
  })

  it('renders a lazy <img> when the style has images', () => {
    const style = { ...styleOf(sampleCatalog(), 'HD'), images: ['images/HD/main.jpg'] }
    render(<ProductImage style={style} color="Pink" alt="Pink hoodie" />)
    const img = screen.getByRole('img', { name: 'Pink hoodie' })
    expect(img.tagName.toLowerCase()).toBe('img')
    expect(img).toHaveAttribute('src', '/images/HD/main.jpg')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('falls back to garment art when the image fails to load', () => {
    const style = { ...styleOf(sampleCatalog(), 'HD'), images: ['images/HD/missing.jpg'] }
    render(<ProductImage style={style} color="Pink" alt="Pink hoodie" />)
    fireEvent.error(screen.getByRole('img', { name: 'Pink hoodie' }))
    expect(screen.getByRole('img', { name: 'Pink hoodie' }).tagName.toLowerCase()).toBe('svg')
  })
})
