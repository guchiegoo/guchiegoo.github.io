import { Link } from 'react-router-dom'
import { colorsFor, formatPrice, styleAvailability } from '../catalog/catalog'
import type { CatalogStyle } from '../catalog/types'
import { ProductImage } from './ProductImage'

/** Minimal card; Task 4 adds tilt and swatch colour cycling. */
export function ProductCard({ style }: { style: CatalogStyle }) {
  const colors = colorsFor(style)
  const first = colors.find((c) => !c.soldOut) ?? colors[0]
  const availability = styleAvailability(style)
  return (
    <Link to={`/p/${style.code}`} className="card">
      <div className="card__art">
        <ProductImage style={style} color={first?.color ?? ''} alt={`${style.name} in ${first?.color ?? ''}`} />
      </div>
      <span className="card__name">{style.name}</span>
      <span className="card__price">{formatPrice(style.priceCents)}</span>
      {availability === 'sold-out' && <span className="badge badge--out">Sold out</span>}
      {availability === 'coming-soon' && <span className="badge badge--soon">Coming soon</span>}
    </Link>
  )
}
