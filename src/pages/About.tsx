import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { about } from '../content/story'

export default function About() {
  useEffect(() => {
    document.title = 'Story — Wulesport'
  }, [])

  return (
    <div className="about">
      <header className="about__head">
        <div className="wrap">
          <p className="eyebrow">Our story</p>
          <h1 className="display about__title">{about.heading}</h1>
        </div>
      </header>

      <div className="wrap about__body">
        {about.sections.map((s, i) => (
          <Reveal key={s.title} delay={i * 100}>
            <section className="about__section">
              <h2 className="about__h">{s.title}</h2>
              <p>{s.body}</p>
            </section>
          </Reveal>
        ))}
      </div>

      <div className="about__tagline on-dark">
        <div className="wrap">
          <p className="about__equation">{about.tagline}</p>
          <Link to="/shop" className="btn btn--signal">
            Shop the drop
          </Link>
        </div>
      </div>
    </div>
  )
}
