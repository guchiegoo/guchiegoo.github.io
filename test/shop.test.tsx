import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { renderApp } from './render'

const cardLink = (name: RegExp) => screen.findByRole('link', { name })

describe('Shop', () => {
  it('renders all five styles in catalog order', async () => {
    renderApp('/shop')
    const main = screen.getByRole('main')
    const links = await within(main).findAllByRole('link', { name: /\$\d+/ })
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/p/HZ', '/p/HD', '/p/AWLS', '/p/SCT', '/p/WCT'])
  })

  it('tags SCT as sold out, and keeps it visible', async () => {
    renderApp('/shop')
    const sct = await cardLink(/Sorona Quick-Dry Cooling T-Shirt/)
    expect(within(sct).getByText('Sold out')).toBeInTheDocument()
  })

  it('tags HD as coming soon because no buy links exist yet', async () => {
    renderApp('/shop')
    const hd = await cardLink(/Oversize Fleeced Hoodie/)
    expect(within(hd).getByText('Coming soon')).toBeInTheDocument()
    expect(within(hd).queryByText('Sold out')).toBeNull()
  })

  it('shows a colour swatch for every HD colourway', async () => {
    renderApp('/shop')
    await cardLink(/Oversize Fleeced Hoodie/)
    const swatches = screen.getByRole('group', { name: 'Oversize Fleeced Hoodie colours' })
    expect(within(swatches).getAllByRole('button')).toHaveLength(6)
  })

  it('shows a loading state, then an error state when the catalog fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(
      <MemoryRouter initialEntries={['/shop']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('Loading the drop…')).toBeInTheDocument()
    expect(await screen.findByText("Couldn't load the shop. Please refresh.")).toBeInTheDocument()
  })
})
