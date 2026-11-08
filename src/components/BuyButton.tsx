import { formatPrice, isPurchasable } from '../catalog/catalog'
import { messageToOrderHref, orderSummary } from '../content/contact'
import type { CatalogVariant } from '../catalog/types'

/**
 * Opens the variant's Stripe Payment Link in the same tab. Stripe returns the
 * buyer to /thanks. With stock but no link yet, it offers the message-to-order
 * stopgap (Instagram DM) instead of a dead end, with the exact piece shown
 * underneath since Instagram's composer can't be pre-filled. Only when
 * there's no stock is it disabled.
 */
export function BuyButton({ variant, styleName }: { variant: CatalogVariant | null; styleName: string }) {
  if (variant && isPurchasable(variant)) {
    return (
      <a className="buy btn btn--signal" href={variant.buyUrl!} rel="noopener">
        Buy — {formatPrice(variant.priceCents)}
      </a>
    )
  }
  if (variant && variant.available > 0) {
    return (
      <div className="buy-stack">
        <a className="buy btn btn--signal" href={messageToOrderHref()} target="_blank" rel="noopener noreferrer">
          Message to order — {formatPrice(variant.priceCents)}
        </a>
        <p className="buy-stack__hint">Mention: {orderSummary(styleName, variant)}</p>
      </div>
    )
  }
  return (
    <button type="button" className="buy buy--off btn" disabled>
      Sold out
    </button>
  )
}
