import { useEffect, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { formatPrice } from '../catalog/catalog'
import { useCatalogState } from '../catalog/CatalogContext'
import { missionOneLiner } from '../content/story'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'Story' },
  { to: '/faq', label: 'FAQ' },
]

export function Layout({ children }: { children: ReactNode }) {
  const state = useCatalogState()
  const year = new Date().getFullYear()

  return (
    <>
      <ScrollToTop />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="WULESPORT home">
          <img src="/brand/logo.jpg" alt="" className="wordmark__badge" width={32} height={32} />
          WULESPORT
        </Link>
        <nav aria-label="Main" className="site-nav">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className="site-nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__mark" aria-hidden="true">
            WULE<span>SPORT</span>
          </p>
          <p className="site-footer__line">{missionOneLiner}</p>
          <ul className="site-footer__meta">
            {state.status === 'ready' && <li>Flat {formatPrice(state.catalog.shippingCents)} US shipping</li>}
            <li>
              <Link to="/faq">Shipping &amp; returns</Link>
            </li>
            <li>© {year} Wulesport</li>
          </ul>
        </div>
      </footer>
    </>
  )
}
