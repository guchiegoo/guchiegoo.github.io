import { useEffect, useState } from 'react'
import { formatPrice, isPurchasable } from '../catalog/catalog'
import { messageToOrderHref, orderSummary } from '../content/contact'
import type { CatalogVariant } from '../catalog/types'

const COPIED_MS = 4000

/**
 * Opens the variant's Stripe Payment Link in the same tab. Stripe returns the
 * buyer to /thanks. With stock but no link yet, it offers the message-to-order
 * stopgap (Instagram DM) instead of a dead end. Instagram's composer can't be
 * pre-filled, so clicking also copies the exact piece to the clipboard — one
 * click opens the DM and loads "paste" with the right answer, instead of
 * asking the buyer to read and retype it themselves. The line stays printed
 * underneath either way, so a failed or blocked copy never loses the order.
 * Parent should key this on the variant's sku so a size/colour change can't
 * leave a stale "Copied" message showing for a piece that was never copied.
 */
export function BuyButton({ variant, styleName }: { variant: CatalogVariant | null; styleName: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), COPIED_MS)
    return () => window.clearTimeout(id)
  }, [copied])

  if (variant && isPurchasable(variant)) {
    return (
      <a className="buy btn btn--signal" href={variant.buyUrl!} rel="noopener">
        Buy — {formatPrice(variant.priceCents)}
      </a>
    )
  }
  if (variant && variant.available > 0) {
    const summary = orderSummary(styleName, variant)
    return (
      <div className="buy-stack">
        <a
          className="buy btn btn--signal"
          href={messageToOrderHref()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            navigator.clipboard?.writeText(summary).then(
              () => setCopied(true),
              () => {},
            )
          }}
        >
          Message to order — {formatPrice(variant.priceCents)}
        </a>
        <p className="buy-stack__hint" aria-live="polite">
          {copied ? `Copied — paste it into the message: “${summary}”` : `Mention: ${summary}`}
        </p>
      </div>
    )
  }
  return (
    <button type="button" className="buy buy--off btn" disabled>
      Sold out
    </button>
  )
}
