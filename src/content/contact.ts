import { formatPrice } from '../catalog/catalog'
import type { CatalogVariant } from '../catalog/types'

/** The owner's verified Instagram handle (owner-supplied 2026-10-06, confirmed live). */
const INSTAGRAM_HANDLE = 'wulesport.us'

/**
 * A stopgap order channel for a variant that's live and in stock but has no
 * Stripe Payment Link yet. Opens a direct-message thread with the owner on
 * Instagram (ig.me/m/<handle> is Instagram's own "Message" deep link); the
 * owner replies and arranges payment (Venmo, Cash App, PayPal...) themselves
 * — the site never touches money. Instagram's DM composer can't be
 * pre-filled, so the exact piece is shown next to the button instead (see
 * orderSummary) rather than lost once the customer leaves the site.
 */
export function messageToOrderHref(): string {
  return `https://ig.me/m/${INSTAGRAM_HANDLE}`
}

/** "Oversize Fleeced Hoodie — Pink, M — $48": what to mention when messaging. */
export function orderSummary(styleName: string, variant: CatalogVariant): string {
  return `${styleName} — ${variant.color}, ${variant.size} — ${formatPrice(variant.priceCents)}`
}
