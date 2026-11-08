import { formatPrice } from '../catalog/catalog'
import type { CatalogVariant } from '../catalog/types'
import { policies } from './policies'

/**
 * A stopgap order channel for a variant that's live and in stock but has no
 * Stripe Payment Link yet. The owner replies and arranges payment
 * (Venmo, Cash App, PayPal...) themselves — the site never touches money.
 */
export function messageToOrderHref(styleName: string, variant: CatalogVariant): string {
  const subject = encodeURIComponent(`Order: ${styleName} — ${variant.color} ${variant.size}`)
  const body = encodeURIComponent(
    `Hi! I'd like to order the ${styleName} in ${variant.color}, size ${variant.size} (${formatPrice(variant.priceCents)}). SKU ${variant.sku}.`,
  )
  return `mailto:${policies.contact.email}?subject=${subject}&body=${body}`
}
