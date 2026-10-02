import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { prefersReducedMotion } from '../motion'

interface Props {
  children: ReactNode
  className?: string
  /** Stagger, in ms, applied as a CSS transition delay. */
  delay?: number
}

function showsImmediately(): boolean {
  return typeof IntersectionObserver === 'undefined' || prefersReducedMotion()
}

/** Fades its children in once they scroll into view. */
export function Reveal({ children, className, delay }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(showsImmediately)

  useEffect(() => {
    if (visible || !ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  const style = delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined
  const classes = ['reveal', visible && 'is-visible', className].filter(Boolean).join(' ')
  return (
    <div ref={ref} className={classes} style={style}>
      {children}
    </div>
  )
}
