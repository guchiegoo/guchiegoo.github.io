import { act, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Reveal } from '../src/components/Reveal'
import { renderApp, stubReducedMotion } from './render'

describe('Home', () => {
  it('renders the headline and a Shop the drop link', async () => {
    renderApp('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Grown slow. Built fast.' })).toBeInTheDocument()
    expect(within(screen.getByRole('main')).getByText('Everyday performance wear with a racing heart.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Shop the drop' })).toHaveAttribute('href', '/shop')
    expect(await screen.findByRole('heading', { name: 'The Drop' })).toBeInTheDocument()
  })

  it('shows the first three non-sold-out styles in The Drop, plus See all', async () => {
    renderApp('/')
    const drop = (await screen.findByRole('heading', { name: 'The Drop' })).closest('section')!
    const cards = await within(drop).findAllByRole('link', { name: /\$\d+/ })
    expect(cards).toHaveLength(3)
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(['/p/HZ', '/p/HD', '/p/AWLS'])
    expect(within(drop).getByRole('link', { name: /see all/i })).toHaveAttribute('href', '/shop')
  })

  it('has the land beats, the transition band and the mission', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Where we’re headed.' })).toBeInTheDocument()
    expect(screen.getByText('US-raised sheep')).toBeInTheDocument()
    expect(screen.getByText('Grazed and sheared locally')).toBeInTheDocument()
    expect(screen.getByText('Fewer miles, less waste')).toBeInTheDocument()
    expect(screen.getByText('FROM PASTURE TO PIT LANE.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The mission.' })).toBeInTheDocument()
    expect(screen.getByText('Watch the story — coming soon')).toBeInTheDocument()
  })
})

describe('Reveal', () => {
  it('is visible immediately under reduced motion, without an observer', () => {
    stubReducedMotion(true)
    const observe = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function () {
        return { observe, disconnect: vi.fn(), unobserve: vi.fn(), takeRecords: vi.fn() }
      }),
    )
    const { container } = render(<Reveal>hello</Reveal>)
    const el = container.querySelector('.reveal')!
    expect(el).toHaveClass('is-visible')
    expect(observe).not.toHaveBeenCalled()
  })

  it('is visible immediately when IntersectionObserver is missing', () => {
    stubReducedMotion(false)
    vi.stubGlobal('IntersectionObserver', undefined)
    const { container } = render(<Reveal>hello</Reveal>)
    expect(container.querySelector('.reveal')).toHaveClass('is-visible')
  })

  it('waits for the element to intersect when motion is allowed', () => {
    stubReducedMotion(false)
    let fire: (entries: Array<{ isIntersecting: boolean }>) => void = () => {}
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (cb: typeof fire) {
        fire = cb
        return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn(), takeRecords: vi.fn() }
      }),
    )
    const { container } = render(<Reveal>hello</Reveal>)
    const el = container.querySelector('.reveal')!
    expect(el).not.toHaveClass('is-visible')
    act(() => fire([{ isIntersecting: true }]))
    expect(el).toHaveClass('is-visible')
  })
})

describe('Layout', () => {
  it('has the wordmark, nav links and a skip link to #main', () => {
    renderApp('/')
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/shop')
    expect(within(nav).getByRole('link', { name: 'Story' })).toHaveAttribute('href', '/about')
    expect(within(nav).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(document.getElementById('main')).not.toBeNull()
    expect(screen.getByRole('link', { name: /WULESPORT/ })).toHaveAttribute('href', '/')
  })

  it('shows the flat shipping note from the catalog in the footer', async () => {
    renderApp('/')
    const footer = screen.getByRole('contentinfo')
    expect(await within(footer).findByText(/Flat \$6 US shipping/)).toBeInTheDocument()
    expect(within(footer).getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument()
  })
})

describe('Routing', () => {
  it('renders NotFound with a Back to the shop link for unknown routes', () => {
    renderApp('/definitely/not/here')
    expect(screen.getByRole('link', { name: 'Back to the shop' })).toHaveAttribute('href', '/shop')
  })
})
