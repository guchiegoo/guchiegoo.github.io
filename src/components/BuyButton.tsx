import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { formatPrice, isPurchasable } from '../catalog/catalog'
import { messageToOrderHref, orderSummary } from '../content/contact'
import type { CatalogVariant } from '../catalog/types'

const COPIED_MS = 4000

/** Mirrors the station's `cleanTag` (apps/server/src/launch/model.ts): a short lowercase slug. */
const TAG_RE = /^[a-z0-9][a-z0-9_-]{0,23}$/

function cleanTag(value: string | null): string | null {
  if (value === null) return null
  const t = value.trim().toLowerCase()
  return TAG_RE.test(t) ? t : null
}

/**
 * Carries the page's own `?src=<tag>` (set by the station's channel links,
 * docs/wulesport-launch.md "Channel tags") onto the Payment Link as
 * `client_reference_id`, the same way the station's own `buyLink` does for
 * links it generates directly. Without this, a buyer who lands on the site
 * from a tagged link and then clicks Buy loses the tag — the order comes
 * back untagged. Mirrors `apps/server/src/launch/links.ts`'s `buyLink`.
 */
function tagBuyUrl(url: string, tag: string | null): string {
  if (tag === null) return url
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:') return url
    u.searchParams.set('client_reference_id', tag)
    return u.toString()
  } catch {
    return url
  }
}

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
  const [searchParams] = useSearchParams()
  const tag = cleanTag(searchParams.get('src'))

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), COPIED_MS)
    return () => window.clearTimeout(id)
  }, [copied])

  if (variant && isPurchasable(variant)) {
    return (
      <a className="buy btn btn--signal" href={tagBuyUrl(variant.buyUrl!, tag)} rel="noopener">
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
