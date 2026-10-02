import { useId } from 'react'
import { colorHex, isDark } from './colors'

export type GarmentKind = 'hoodie' | 'halfzip' | 'longsleeve' | 'tee'

const KINDS: Record<string, GarmentKind> = {
  HD: 'hoodie',
  HZ: 'halfzip',
  AWLS: 'longsleeve',
  SCT: 'tee',
  WCT: 'tee',
}

export function garmentKind(styleCode: string): GarmentKind {
  return KINDS[styleCode.toUpperCase()] ?? 'tee'
}

/*
 * Silhouettes on a 200 x 220 canvas, front view. Each body path includes the
 * sleeves so a single fill colours the whole garment.
 */
const BODY: Record<GarmentKind, string> = {
  tee: 'M72 34 Q100 52 128 34 L160 44 L190 80 L170 96 L154 78 L154 204 L46 204 L46 78 L30 96 L10 80 L40 44 Z',
  longsleeve:
    'M72 34 Q100 52 128 34 L160 44 L178 112 L188 190 L166 194 L158 116 L154 82 L154 204 L46 204 L46 82 L42 116 L34 194 L12 190 L22 112 L40 44 Z',
  // Oversize: dropped shoulders and a wider, boxier body.
  hoodie:
    'M74 40 Q100 56 126 40 L164 50 L184 118 L192 194 L168 198 L160 122 L158 92 L158 206 L42 206 L42 92 L40 122 L32 198 L8 194 L16 118 L36 50 Z',
  halfzip:
    'M74 36 Q100 50 126 36 L162 46 L180 114 L188 190 L166 194 L158 118 L154 84 L154 204 L46 204 L46 84 L42 118 L34 194 L12 190 L20 114 L38 46 Z',
}

/** Where the sleeves meet the body, drawn as faint seams for depth. */
const SEAMS: Record<GarmentKind, string> = {
  tee: 'M154 78 L160 44 M46 78 L40 44',
  longsleeve: 'M154 82 L160 44 M46 82 L40 44',
  hoodie: 'M158 92 L164 50 M42 92 L36 50',
  halfzip: 'M154 84 L162 46 M46 84 L38 46',
}

const LABEL_Y: Record<GarmentKind, number> = { tee: 78, longsleeve: 80, hoodie: 98, halfzip: 84 }

interface Props {
  styleCode: string
  color: string
  label: string
  className?: string
}

/** A stylised flat-lay of a garment, used until real product photos exist. */
export function GarmentArt({ styleCode, color, label, className }: Props) {
  const kind = garmentKind(styleCode)
  const fill = colorHex(color)
  const dark = isDark(fill)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const shadeId = `shade-${uid}`
  const outline = dark ? 'rgba(233,225,211,0.28)' : 'rgba(29,31,28,0.38)'
  const detail = dark ? 'rgba(233,225,211,0.22)' : 'rgba(29,31,28,0.2)'

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 200 220"
      className={className ? `garment ${className}` : 'garment'}
      data-kind={kind}
    >
      <defs>
        <linearGradient id={shadeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="212" rx="70" ry="5" fill="rgba(29,31,28,0.14)" />

      <path
        data-part="body"
        d={BODY[kind]}
        fill={fill}
        stroke={outline}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d={BODY[kind]} fill={`url(#${shadeId})`} />
      <path d={SEAMS[kind]} fill="none" stroke={detail} strokeWidth="1.2" />

      {kind === 'hoodie' && (
        <g data-part="hood">
          <path
            d="M64 46 C56 10 144 10 136 46 Q100 66 64 46 Z"
            fill={fill}
            stroke={outline}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M78 42 C76 20 124 20 122 42 Q100 56 78 42 Z" fill="rgba(0,0,0,0.26)" />
          <path d="M92 54 L89 88 M108 54 L111 88" stroke={detail} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M68 148 L132 148 L144 190 L56 190 Z"
            fill="none"
            stroke={detail}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </g>
      )}

      {kind === 'halfzip' && (
        <g data-part="zip">
          <path
            d="M74 36 L74 24 Q100 32 126 24 L126 36 Q100 50 74 36 Z"
            fill={fill}
            stroke={outline}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M100 30 L100 104" stroke={outline} strokeWidth="2.2" />
          <rect x="96.5" y="102" width="7" height="12" rx="2" fill="#1d1f1c" />
          <path d="M46 194 L154 194" stroke={detail} strokeWidth="1.4" />
        </g>
      )}

      {kind !== 'halfzip' && kind !== 'hoodie' && (
        <path d="M78 40 Q100 56 122 40" fill="none" stroke={detail} strokeWidth="1.4" />
      )}

      <text
        x="111"
        y={LABEL_Y[kind]}
        fontFamily='"Archivo Black", "Arial Black", Impact, sans-serif'
        fontSize="10"
        fontWeight="900"
        letterSpacing="0.5"
        fill="var(--signal, #ff6a1a)"
        aria-hidden="true"
      >
        WULE
      </text>
    </svg>
  )
}
