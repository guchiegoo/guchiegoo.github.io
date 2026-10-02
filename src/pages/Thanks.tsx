import { useEffect } from 'react'
import { Link } from 'react-router-dom'

/** Stripe Payment Links redirect here after a successful payment. */
export default function Thanks() {
  useEffect(() => {
    document.title = 'Order received — Wulesport'
  }, [])

  return (
    <div className="wrap page page--center thanks">
      <div className="thanks__flag" aria-hidden="true" />
      <h1 className="display">Order received — thank you!</h1>
      <p className="lede">You'll get a receipt from Stripe by email. We'll ship within 3 business days (placeholder).</p>
      <Link to="/shop" className="btn btn--signal">
        Back to the shop
      </Link>
    </div>
  )
}
