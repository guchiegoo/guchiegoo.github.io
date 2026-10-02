import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap page page--center">
      <p className="eyebrow">404</p>
      <h1 className="display">Wrong turn.</h1>
      <p className="lede">That page doesn’t exist. The pieces are this way.</p>
      <Link to="/shop" className="btn btn--signal">
        Back to the shop
      </Link>
    </div>
  )
}
