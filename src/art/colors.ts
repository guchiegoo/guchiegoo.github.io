/** Swatch colours for every colourway name the station uses. */
export const COLOR_HEX: Record<string, string> = {
  Pink: '#f2a7b8',
  'Medium Green': '#5c8a5a',
  'Klein Blue': '#1f3fbf',
  White: '#f6f4ef',
  Brown: '#6e4a32',
  Coffee: '#4a3426',
  'Oat Gray': '#cfc6b5',
  'Flower Gray': '#a7a39b',
  Black: '#1a1a1a',
  'Light Blue': '#a9cbe8',
}

export const UNKNOWN_COLOR = '#999999'

export function colorHex(name: string): string {
  return COLOR_HEX[name] ?? UNKNOWN_COLOR
}

/** True for colours dark enough that marks drawn on them need a light treatment. */
export function isDark(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b < 110
}
