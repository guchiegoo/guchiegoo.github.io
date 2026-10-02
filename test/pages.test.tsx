import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from './render'

const main = () => screen.getByRole('main')

describe('About', () => {
  it('renders its heading and the mission story', () => {
    renderApp('/about')
    expect(screen.getByRole('heading', { level: 1, name: 'Slow-grown materials, fast-moving life.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The wool mission' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Today’s drop' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Charity work' })).toBeInTheDocument()
    expect(screen.getByText('Wulesport = slow-grown materials, fast-moving life.')).toBeInTheDocument()
  })
})

describe('FAQ', () => {
  it('renders its heading and the four sections', () => {
    renderApp('/faq')
    expect(screen.getByRole('heading', { level: 1, name: 'FAQ' })).toBeInTheDocument()
    for (const name of ['Shipping', 'Returns', 'Sizing', 'Contact']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    }
  })

  it('puts every answer in a <details> element', () => {
    const { container } = renderApp('/faq')
    const details = container.querySelectorAll('main details')
    expect(details.length).toBeGreaterThanOrEqual(4)
    details.forEach((d) => expect(d.querySelector('summary')).not.toBeNull())
  })

  it('quotes the $6 flat shipping rate', async () => {
    renderApp('/faq')
    expect(await within(main()).findByText(/Flat \$6 shipping/)).toBeInTheDocument()
  })

  it('marks the returns policy and the contact email as placeholders', () => {
    renderApp('/faq')
    expect(within(main()).getByText(/placeholder policy/i)).toBeInTheDocument()
    expect(within(main()).getByText(/Oversize fits run roomy — size down for a regular fit/)).toBeInTheDocument()
    expect(within(main()).getByText('hello@wulesport.com (placeholder — owner to confirm)')).toBeInTheDocument()
  })
})

describe('Thanks', () => {
  it('confirms the order and links back to the shop', () => {
    renderApp('/thanks')
    expect(screen.getByRole('heading', { level: 1, name: 'Order received — thank you!' })).toBeInTheDocument()
    expect(
      screen.getByText("You'll get a receipt from Stripe by email. We'll ship within 3 business days (placeholder)."),
    ).toBeInTheDocument()
    expect(within(main()).getByRole('link', { name: /shop/i })).toHaveAttribute('href', '/shop')
  })
})
