import { useEffect, type ReactNode } from 'react'
import { formatPrice } from '../catalog/catalog'
import { useCatalogState } from '../catalog/CatalogContext'
import { policies, withPrice } from '../content/policies'

function Qa({ q, children, open }: { q: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="qa" open={open}>
      <summary>{q}</summary>
      <div className="qa__a">{children}</div>
    </details>
  )
}

export default function Faq() {
  const state = useCatalogState()
  const shippingLine =
    state.status === 'ready'
      ? withPrice(policies.shipping.summary, formatPrice(state.catalog.shippingCents))
      : 'Flat-rate shipping on every order within the US.'

  useEffect(() => {
    document.title = 'FAQ — Wulesport'
  }, [])

  return (
    <div className="wrap page faq">
      <p className="eyebrow">Shipping · Returns · Sizing · Contact</p>
      <h1 className="display">FAQ</h1>

      <section className="faq__section" aria-labelledby="faq-shipping">
        <h2 id="faq-shipping" className="faq__h">
          Shipping
        </h2>
        <Qa q="How much is shipping?" open>
          <p>{shippingLine}</p>
        </Qa>
        <Qa q="Where do you ship?">
          <p>{policies.shipping.region}</p>
        </Qa>
        <Qa q="When will my order ship?">
          <p>{policies.shipping.timing}</p>
        </Qa>
      </section>

      <section className="faq__section" aria-labelledby="faq-returns">
        <h2 id="faq-returns" className="faq__h">
          Returns
        </h2>
        <Qa q="Can I return something?">
          <p>
            {policies.returns.window} {policies.returns.condition} {policies.returns.cost}
          </p>
        </Qa>
      </section>

      <section className="faq__section" aria-labelledby="faq-sizing">
        <h2 id="faq-sizing" className="faq__h">
          Sizing
        </h2>
        <Qa q="How do the pieces fit?">
          <p>{policies.sizing.oversize}</p>
          <p>{policies.sizing.help}</p>
        </Qa>
      </section>

      <section className="faq__section" aria-labelledby="faq-contact">
        <h2 id="faq-contact" className="faq__h">
          Contact
        </h2>
        <Qa q="How do I reach you?">
          <p>
            Email <a href={`mailto:${policies.contact.email}`}>{policies.contact.emailLabel}</a>
          </p>
        </Qa>
      </section>
    </div>
  )
}
