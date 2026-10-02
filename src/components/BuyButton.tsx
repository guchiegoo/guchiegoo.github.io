import { formatPrice, isPurchasable } from '../catalog/catalog'
import type { CatalogVariant } from '../catalog/types'

/**
 * Opens the variant's Stripe Payment Link in the same tab. Stripe returns the
 * buyer to /thanks. Without a link (or stock) it renders a disabled button.
 */
export function BuyButton({ variant }: { variant: CatalogVariant | null }) {
  if (variant && isPurchasable(variant)) {
    return (
      <a className="buy btn btn--signal" href={variant.buyUrl!} rel="noopener">
        Buy — {formatPrice(variant.priceCents)}
      </a>
    )
  }
  const label = variant && variant.available > 0 ? 'Coming soon' : 'Sold out'
  return (
    <button type="button" className="buy buy--off btn" disabled>
      {label}
    </button>
  )
}
