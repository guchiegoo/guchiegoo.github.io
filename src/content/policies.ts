/**
 * Store policies shown on the FAQ. The shipping price itself is never
 * hard-coded here; it comes from `catalog.shippingCents`. The contact
 * channel is Instagram DM (see `content/contact.ts`), the same live channel
 * the Buy button already uses — there is no checked support email.
 */

export const policies = {
  shipping: {
    /** `{price}` is replaced with the catalog's shipping price, e.g. "$6". */
    summary: 'Flat {price} shipping on every order within the US.',
    region: 'We ship within the United States only for now.',
    timing: 'Orders ship within 3 business days.',
  },
  returns: {
    window: 'Returns are accepted within 14 days of delivery.',
    condition: 'Items must be unworn, with tags on.',
    cost: 'The buyer pays return shipping.',
  },
  sizing: {
    oversize: 'Oversize fits run roomy — size down for a regular fit.',
    help: 'Not sure between two sizes? Message us before you order and we will help.',
  },
}

/** Fill the `{price}` slot in a policy line. */
export function withPrice(line: string, price: string): string {
  return line.replace('{price}', price)
}
