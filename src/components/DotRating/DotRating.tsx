interface DotRatingProps {
  value: number
  max: number
  min?: number
  onChange?: (value: number) => void
  color?: string
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  label?: string
  warn?: boolean
}

// Minimum 16px diameter per dot, with at least 4px of clear gap between adjacent dots —
// sized generously above that floor so dots read as distinct circles at every breakpoint.
// Below the `sm` breakpoint (640px — Tailwind has no built-in 375px breakpoint) dots shrink
// to 12px so 5-dot rows keep fitting card width on narrow phones without wrapping (flex-wrap
// on this row is what caused dots from different rows to stack/overlap — see MageSheet.tsx).
const SIZES: Record<NonNullable<DotRatingProps['size']>, string> = {
  sm: 'w-3 h-3 sm:w-4 sm:h-4',
  md: 'w-3 h-3 sm:w-5 sm:h-5',
  lg: 'w-3 h-3 sm:w-6 sm:h-6',
}

export default function DotRating({
  value,
  max,
  min = 0,
  onChange,
  color = 'var(--system-color)',
  size = 'md',
  readOnly = false,
  label = 'Valor',
  warn = false,
}: DotRatingProps) {
  const dots = Array.from({ length: max }, (_, i) => i + 1)

  const handleClick = (dot: number) => {
    if (readOnly || !onChange) return
    const filled = dot <= value
    const next = filled ? Math.max(min, dot - 1) : dot
    onChange(next)
  }

  return (
    <div
      className="inline-flex items-center gap-2 flex-nowrap shrink-0"
      role={readOnly ? undefined : 'group'}
      aria-label={label}
    >
      {dots.map((dot) => {
        const filled = dot <= value
        return (
          <button
            key={dot}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(dot)}
            aria-label={`${label}: ${dot} de ${max}`}
            aria-pressed={filled}
            className={`${SIZES[size]} rounded-full shrink-0 transition-all duration-150 ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${warn ? 'ring-1 ring-red-500/60' : ''}`}
            style={{
              backgroundColor: filled ? color : 'transparent',
              border: `1.5px solid ${filled ? color : '#2a2a3a'}`,
            }}
          />
        )
      })}
    </div>
  )
}
