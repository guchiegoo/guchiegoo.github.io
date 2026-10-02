import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { sampleCatalog, styleOf } from './fixtures'
import { renderApp } from './render'

const colourGroup = () => screen.getByRole('group', { name: 'Colour' })
const sizeGroup = () => screen.getByRole('group', { name: 'Size' })

describe('Product HZ', () => {
  it('defaults to Oat Gray / S', async () => {
    renderApp('/p/HZ')
    expect(await screen.findByRole('heading', { level: 1, name: 'Half-Zip Rolled Edge Fleece Sweatshirt' })).toBeInTheDocument()
    expect(within(colourGroup()).getByRole('button', { name: 'Oat Gray' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(colourGroup()).getByRole('button', { name: 'Flower Gray' })).toHaveAttribute('aria-pressed', 'false')
    expect(within(sizeGroup()).getByRole('button', { name: 'S' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('$69')).toBeInTheDocument()
  })

  it('disables Oat Gray L as sold out', async () => {
    renderApp('/p/HZ')
    await screen.findByRole('group', { name: 'Size' })
    const l = within(sizeGroup()).getByRole('button', { name: 'L, sold out' })
    expect(l).toBeDisabled()
  })

  it('shows Only 2 left for Flower Gray / M', async () => {
    renderApp('/p/HZ')
    await screen.findByRole('group', { name: 'Colour' })
    fireEvent.click(within(colourGroup()).getByRole('button', { name: 'Flower Gray' }))
    fireEvent.click(within(sizeGroup()).getByRole('button', { name: 'M' }))
    expect(within(sizeGroup()).getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Only 2 left')).toBeInTheDocument()
  })

  it('shows a disabled Coming soon button while there is no buy link', async () => {
    renderApp('/p/HZ')
    const btn = await screen.findByRole('button', { name: 'Coming soon' })
    expect(btn).toBeDisabled()
    expect(screen.queryByRole('link', { name: /^Buy/ })).toBeNull()
  })

  it('shows the shipping and returns line', async () => {
    renderApp('/p/HZ')
    expect(await screen.findByText('Flat $6 US shipping · 14-day returns')).toBeInTheDocument()
  })
})

describe('Product HD with a live buy link', () => {
  it('renders a Stripe link for Pink / M', async () => {
    const catalog = sampleCatalog()
    styleOf(catalog, 'HD').variants.find((v) => v.sku === 'WULE-HD-PINK-M')!.buyUrl = 'https://buy.stripe.com/test_123'
    renderApp('/p/HD', catalog)
    await screen.findByRole('group', { name: 'Colour' })
    expect(within(colourGroup()).getByRole('button', { name: 'Pink' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(sizeGroup()).getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'true')
    const buy = screen.getByRole('link', { name: 'Buy — $48' })
    expect(buy).toHaveAttribute('href', 'https://buy.stripe.com/test_123')
    expect(buy).toHaveAttribute('rel', 'noopener')
    expect(buy).not.toHaveAttribute('target')
    expect(buy).toHaveClass('buy')
  })
})

describe('Product SCT (fully sold out)', () => {
  it('keeps the sold-out colour selectable and shows Sold out', async () => {
    renderApp('/p/SCT')
    await screen.findByRole('group', { name: 'Colour' })
    const black = within(colourGroup()).getByRole('button', { name: 'Black, sold out' })
    expect(black).toBeEnabled()
    expect(black).toHaveAttribute('aria-pressed', 'true')
    expect(within(sizeGroup()).getByRole('button', { name: 'L, sold out' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Sold out' })).toBeDisabled()
  })
})

describe('Unknown product', () => {
  it('renders a not-found message with a link to the shop', async () => {
    renderApp('/p/NOPE')
    expect(await screen.findByText("We couldn't find that piece")).toBeInTheDocument()
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'Browse the shop' })).toHaveAttribute('href', '/shop')
  })
})
