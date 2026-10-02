/**
 * Store policies shown on the FAQ.
 *
 * PLACEHOLDER: the owner must review and edit the returns, sizing and contact
 * text below before launch. The shipping price itself is never hard-coded
 * here; it comes from `catalog.shippingCents`.
 */

export const policies = {
  shipping: {
    /** `{price}` is replaced with the catalog's shipping price, e.g. "$6". */
    summary: 'Flat {price} shipping on every order within the US.',
    region: 'We ship within the United States only for now.',
    timing: 'Orders ship within 3 business days (placeholder).',
  },
  returns: {
    placeholderNotice: 'Placeholder policy — the owner will confirm the final terms before launch.',
    window: 'Returns are accepted within 14 days of delivery.',
    condition: 'Items must be unworn, with tags on.',
    cost: 'The buyer pays return shipping.',
  },
  sizing: {
    /** PLACEHOLDER copy. */
    oversize: 'Oversize fits run roomy — size down for a regular fit.',
    help: 'Not sure between two sizes? Email us before you order and we will help.',
  },
  contact: {
    email: 'hello@wulesport.com',
    emailLabel: 'hello@wulesport.com (placeholder — owner to confirm)',
  },
}

/** Fill the `{price}` slot in a policy line. */
export function withPrice(line: string, price: string): string {
  return line.replace('{price}', price)
}
