import { Link } from 'react-router-dom'
import { styleAvailability } from '../catalog/catalog'
import { useCatalogState } from '../catalog/CatalogContext'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'
import { band, drop, hero, land, mission } from '../content/story'

/** Layered pasture hills with a low sun, drawn in the palette. Decorative. */
function Landscape() {
  return (
    <div className="hero__land" aria-hidden="true">
      <svg className="hero__layer hero__layer--far" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0 210 C180 150 340 170 520 140 C700 110 860 170 1040 150 C1220 130 1340 160 1440 140 L1440 320 L0 320 Z" />
      </svg>
      <svg className="hero__layer hero__layer--mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0 240 C220 190 420 250 640 210 C860 170 1060 230 1260 200 C1340 188 1400 196 1440 190 L1440 320 L0 320 Z" />
      </svg>
      <svg className="hero__layer hero__layer--near" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0 280 C260 240 520 290 780 260 C1040 230 1240 280 1440 250 L1440 320 L0 320 Z" />
        {/* a fence line running along the near pasture */}
        <path
          className="hero__fence"
          d="M0 268 C260 230 520 280 780 250 C1040 220 1240 270 1440 240"
          fill="none"
        />
      </svg>
    </div>
  )
}

function BeatIcon({ index }: { index: number }) {
  // 0: sheep, 1: shears over grass, 2: a short route between two pins.
  if (index === 0)
    return (
      <svg viewBox="0 0 64 48" aria-hidden="true" className="beat__icon">
        <path d="M14 30c-6 0-8-8-2-10-2-7 7-11 11-6 3-6 13-6 15 0 5-4 13 0 11 6 6 1 6 10-1 11-1 6-10 7-13 3-4 4-13 3-15-2-2 1-5 0-6-2z" />
        <path d="M48 22c4-2 9 0 9 5s-4 7-8 5" />
        <path d="M24 39v6M40 39v6" />
      </svg>
    )
  if (index === 1)
    return (
      <svg viewBox="0 0 64 48" aria-hidden="true" className="beat__icon">
        <path d="M6 44c4-8 6-12 8-20M16 44c2-6 3-10 3-16M26 44c3-7 6-11 10-14M38 44c2-5 5-8 9-10M50 44c1-4 3-7 8-9" />
        <path d="M30 6l14 18M44 6L30 24" />
        <circle cx="27" cy="27" r="3.5" />
        <circle cx="47" cy="27" r="3.5" />
      </svg>
    )
  return (
    <svg viewBox="0 0 64 48" aria-hidden="true" className="beat__icon">
      <path d="M12 36c10-14 26 6 40-12" strokeDasharray="3 5" />
      <path d="M12 38a6 6 0 1 0 0-.1M52 26a6 6 0 1 0 0-.1" />
      <circle cx="12" cy="32" r="2" />
      <circle cx="52" cy="20" r="2" />
    </svg>
  )
}

export default function Home() {
  const state = useCatalogState()
  const dropStyles =
    state.status === 'ready' ? state.catalog.styles.filter((s) => styleAvailability(s) !== 'sold-out').slice(0, 3) : []

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__sun" aria-hidden="true" />
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__slow">{hero.headlineSlow}</span>{' '}
            <span className="hero__fast">{hero.headlineFast}</span>
          </h1>
          <p className="hero__sub">{hero.subline}</p>
          <Link to="/shop" className="btn btn--signal">
            {hero.cta}
          </Link>
        </div>
        <Landscape />
      </section>

      <section className="land" aria-labelledby="land-title">
        <div className="wrap">
          <Reveal>
            <h2 id="land-title" className="display land__title">
              {land.heading}
            </h2>
          </Reveal>
          <ol className="land__trail">
            {land.beats.map((beat, i) => (
              <li key={beat.title} className="beat">
                <Reveal delay={i * 120}>
                  <BeatIcon index={i} />
                  <h3 className="beat__title">{beat.title}</h3>
                  <p className="beat__body">{beat.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band" aria-label="From pasture to pit lane">
        <div className="band__stripes" aria-hidden="true" />
        <p className="band__type">
          <span>{band}</span>
        </p>
      </section>

      <section className="drop" aria-labelledby="drop-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="drop-title" className="display">
              {drop.heading}
            </h2>
            <p className="section-head__note">{drop.intro}</p>
          </div>
          {state.status === 'loading' && <p className="status">Loading the drop…</p>}
          {state.status === 'error' && <p className="status">Couldn't load the shop. Please refresh.</p>}
          <ul className="grid">
            {dropStyles.map((style, i) => (
              <li key={style.code}>
                <Reveal delay={i * 90}>
                  <ProductCard style={style} />
                </Reveal>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="link-arrow">
            {drop.seeAll}
          </Link>
        </div>
      </section>

      <section className="mission" aria-labelledby="mission-title">
        <div className="wrap mission__inner">
          <Reveal>
            <h2 id="mission-title" className="display">
              {mission.heading}
            </h2>
            <p className="mission__line">{mission.charity}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="video-slot" role="img" aria-label={mission.video}>
              <span className="video-slot__play" aria-hidden="true" />
              <span className="video-slot__label" aria-hidden="true">
                {mission.video}
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
