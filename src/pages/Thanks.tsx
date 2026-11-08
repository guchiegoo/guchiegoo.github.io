import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { prefersReducedMotion } from '../motion'

/** Stripe Payment Links redirect here after a successful payment. */
export default function Thanks() {
  useEffect(() => {
    document.title = 'Order received — Wulesport'
    if (prefersReducedMotion()) return
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b5502f', '#1d1f1c', '#e9e1d3'],
    })
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
