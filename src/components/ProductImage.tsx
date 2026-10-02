import { useState } from 'react'
import { GarmentArt } from '../art/GarmentArt'
import type { CatalogStyle } from '../catalog/types'

/** Resolve a catalog image path ("images/HD/main.jpg") against the site root. */
export function imageSrc(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/')) return path
  return `/${path}`
}

interface Props {
  style: CatalogStyle
  color: string
  alt: string
  className?: string
}

/** The style's first photo, or drawn garment art when there is none or it fails to load. */
export function ProductImage({ style, color, alt, className }: Props) {
  const [failed, setFailed] = useState<string | null>(null)
  const src = style.images[0]

  if (!src || failed === src) {
    return <GarmentArt styleCode={style.code} color={color} label={alt} className={className} />
  }
  return (
    <img
      src={imageSrc(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setFailed(src)}
    />
  )
}
