import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { colorHex } from '../art/colors'
import { garmentKind } from '../art/GarmentArt'
import { colorsFor, formatPrice, styleAvailability } from '../catalog/catalog'
import type { CatalogStyle } from '../catalog/types'
import { prefersReducedMotion } from '../motion'
import { ProductImage } from './ProductImage'

const KIND_LABEL = { hoodie: 'Hoodie', halfzip: 'Half-zip', longsleeve: 'Long sleeve', tee: 'Tee' }
const CYCLE_MS = 1100

/**
 * A shop card. The whole top area is one link to the product; the colour
 * swatches sit outside the link as their own buttons (no nested controls).
 * Hover tilts the card and cycles the colourways; hovering or focusing a
 * swatch shows that colour.
 */
export function ProductCard({ style }: { style: CatalogStyle }) {
  const colors = useMemo(() => colorsFor(style), [style])
  const firstInStock = colors.find((c) => !c.soldOut) ?? colors[0]
  const [shown, setShown] = useState(firstInStock?.color ?? '')
  const [cycling, setCycling] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const availability = styleAvailability(style)

  // While the pointer rests on the card, flip through the colourways.
  useEffect(() => {
    if (!cycling || colors.length < 2) return
    const id = window.setInterval(() => {
      setShown((current) => {
        const i = colors.findIndex((c) => c.color === current)
        return colors[(i + 1) % colors.length].color
      })
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [cycling, colors])

  function tilt(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    cardRef.current.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
    cardRef.current.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
  }

  function enter(e: PointerEvent<HTMLElement>) {
    if (e.pointerType === 'mouse' && !prefersReducedMotion()) setCycling(true)
  }

  function leave() {
    setCycling(false)
    setShown(firstInStock?.color ?? '')
    cardRef.current?.style.removeProperty('--rx')
    cardRef.current?.style.removeProperty('--ry')
  }

  const preview = (color: string) => {
    setCycling(false)
    setShown(color)
  }

  const tint = { '--tint': colorHex(shown) } as CSSProperties

  return (
    <article ref={cardRef} className="card" onPointerMove={tilt} onPointerEnter={enter} onPointerLeave={leave}>
      <Link to={`/p/${style.code}`} className="card__link">
        <div className="card__art" style={tint}>
          <span className="card__tag" aria-hidden="true">
            {style.code} · {KIND_LABEL[garmentKind(style.code)]}
          </span>
          <ProductImage key={shown} style={style} color={shown} alt={`${style.name} in ${shown}`} className="card__img" />
          {availability === 'sold-out' && <span className="badge badge--out">Sold out</span>}
          {availability === 'coming-soon' && <span className="badge badge--soon">Coming soon</span>}
        </div>
        <span className="card__name">{style.name}</span>
        <span className="card__price">{formatPrice(style.priceCents)}</span>
      </Link>
      <div className="card__swatches" role="group" aria-label={`${style.name} colours`}>
        {colors.map((c) => (
          <button
            key={c.color}
            type="button"
            className={`swatch${c.soldOut ? ' is-soldout' : ''}`}
            style={{ '--swatch': colorHex(c.color) } as CSSProperties}
            aria-label={c.soldOut ? `Show ${c.color}, sold out` : `Show ${c.color}`}
            aria-pressed={shown === c.color}
            onPointerEnter={() => preview(c.color)}
            onFocus={() => preview(c.color)}
            onClick={() => preview(c.color)}
          />
        ))}
        <span className="card__count">
          {colors.length} {colors.length === 1 ? 'colour' : 'colours'}
        </span>
      </div>
    </article>
  )
}
