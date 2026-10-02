import type { CSSProperties } from 'react'

export interface PickerOption {
  value: string
  soldOut: boolean
  /** Sold-out options are disabled unless this is set (colours stay selectable). */
  selectableWhenSoldOut?: boolean
  /** Swatch colour for colour pickers. */
  swatch?: string
}

interface Props {
  /** Group name, e.g. "Colour" or "Size". */
  label: string
  options: PickerOption[]
  selected: string | null
  onSelect: (value: string) => void
  variant: 'swatch' | 'size'
}

/** A row of real toggle buttons (`aria-pressed`) for one product option. */
export function Picker({ label, options, selected, onSelect, variant }: Props) {
  return (
    <div className={`picker picker--${variant}`}>
      <p className="picker__label" aria-hidden="true">
        {label}
        {selected && <span className="picker__value">{selected}</span>}
      </p>
      <div role="group" aria-label={label} className="picker__options">
        {options.map((o) => {
          const disabled = o.soldOut && !o.selectableWhenSoldOut
          const style = o.swatch ? ({ '--swatch': o.swatch } as CSSProperties) : undefined
          return (
            <button
              key={o.value}
              type="button"
              className={`picker__btn${o.soldOut ? ' is-soldout' : ''}`}
              aria-pressed={selected === o.value}
              aria-label={o.soldOut ? `${o.value}, sold out` : undefined}
              disabled={disabled}
              onClick={() => onSelect(o.value)}
              style={style}
            >
              {variant === 'swatch' && <span className="picker__dot" aria-hidden="true" />}
              <span className="picker__text">{o.value}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
