import { useEffect } from 'react'
import { useCatalogState } from '../catalog/CatalogContext'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'
import { drop } from '../content/story'

export default function Shop() {
  const state = useCatalogState()

  useEffect(() => {
    document.title = 'Shop — Wulesport'
  }, [])

  return (
    <div className="wrap page page--shop">
      <div className="section-head">
        <div>
          <p className="eyebrow">The Drop</p>
          <h1 className="display">Shop</h1>
        </div>
        <p className="section-head__note">{drop.intro}</p>
      </div>
      {state.status === 'loading' && <p className="status">Loading the drop…</p>}
      {state.status === 'error' && <p className="status">Couldn't load the shop. Please refresh.</p>}
      {state.status === 'ready' && (
        <ul className="grid">
          {state.catalog.styles.map((style, i) => (
            <li key={style.code}>
              <Reveal delay={(i % 3) * 90}>
                <ProductCard style={style} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
