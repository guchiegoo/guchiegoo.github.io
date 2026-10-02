import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { colorHex } from '../art/colors'
import { garmentKind } from '../art/GarmentArt'
import { colorsFor, findStyle, formatPrice, scarcityLabel, sizesFor } from '../catalog/catalog'
import { useCatalogState } from '../catalog/CatalogContext'
import type { Catalog, CatalogStyle } from '../catalog/types'
import { BuyButton } from '../components/BuyButton'
import { Picker } from '../components/Picker'
import { imageSrc, ProductImage } from '../components/ProductImage'

const KIND_LABEL = { hoodie: 'Hoodie', halfzip: 'Half-zip', longsleeve: 'Long sleeve', tee: 'Tee' }

/** First size with stock in a colour, else the first size listed. */
function defaultSize(style: CatalogStyle, color: string): string | null {
  const sizes = sizesFor(style, color)
  return (sizes.find((s) => !s.soldOut) ?? sizes[0])?.size ?? null
}

function ProductDetail({ style, catalog }: { style: CatalogStyle; catalog: Catalog }) {
  const colors = useMemo(() => colorsFor(style), [style])
  const [color, setColor] = useState(() => (colors.find((c) => !c.soldOut) ?? colors[0])?.color ?? '')
  const [size, setSize] = useState(() => defaultSize(style, color))
  const [imageIndex, setImageIndex] = useState(0)

  const sizes = sizesFor(style, color)
  const variant = sizes.find((s) => s.size === size)?.variant ?? null
  const scarcity = variant ? scarcityLabel(variant) : null
  const price = variant?.priceCents ?? style.priceCents

  useEffect(() => {
    document.title = `${style.name} — Wulesport`
  }, [style.name])

  function pickColor(next: string) {
    setColor(next)
    setSize(defaultSize(style, next))
  }

  // Show the chosen photo; GarmentArt (via ProductImage) covers styles without photos.
  const galleryStyle = { ...style, images: style.images.slice(imageIndex).concat(style.images.slice(0, imageIndex)) }

  return (
    <div className="wrap product">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link>
        <span aria-hidden="true">/</span>
        <span>{style.name}</span>
      </nav>

      <div className="product__grid">
        <div className="product__gallery">
          <div className="product__stage" style={{ '--tint': colorHex(color) } as CSSProperties}>
            <ProductImage key={`${color}-${imageIndex}`} style={galleryStyle} color={color} alt={`${style.name} in ${color}`} className="product__img" />
          </div>
          {style.images.length > 1 && (
            <div className="product__thumbs" role="group" aria-label="Photos">
              {style.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className="product__thumb"
                  aria-pressed={i === imageIndex}
                  aria-label={`Photo ${i + 1} of ${style.images.length}`}
                  onClick={() => setImageIndex(i)}
                >
                  <img src={imageSrc(src)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product__info">
          <p className="eyebrow">
            {style.code} · {KIND_LABEL[garmentKind(style.code)]}
          </p>
          <h1 className="product__name">{style.name}</h1>
          <p className="product__price">{formatPrice(price)}</p>

          <Picker
            label="Colour"
            variant="swatch"
            selected={color}
            onSelect={pickColor}
            options={colors.map((c) => ({
              value: c.color,
              soldOut: c.soldOut,
              selectableWhenSoldOut: true,
              swatch: colorHex(c.color),
            }))}
          />

          <Picker
            label="Size"
            variant="size"
            selected={size}
            onSelect={setSize}
            options={sizes.map((s) => ({ value: s.size, soldOut: s.soldOut }))}
          />

          <p className="product__scarcity" aria-live="polite">
            {scarcity}
          </p>

          <BuyButton variant={variant} />

          <p className="product__ship">
            Flat {formatPrice(catalog.shippingCents)} US shipping · 14-day returns
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Product() {
  const { code = '' } = useParams()
  const state = useCatalogState()

  if (state.status === 'loading') return <p className="wrap status">Loading the drop…</p>
  if (state.status === 'error') return <p className="wrap status">Couldn't load the shop. Please refresh.</p>

  const style = findStyle(state.catalog, code)
  if (!style) {
    return (
      <div className="wrap page page--center">
        <h1 className="display">We couldn't find that piece</h1>
        <p className="lede">It may have sold through, or the link is off. Everything we have is in the shop.</p>
        <Link to="/shop" className="btn btn--signal">
          Browse the shop
        </Link>
      </div>
    )
  }
  return <ProductDetail key={style.code} style={style} catalog={state.catalog} />
}
