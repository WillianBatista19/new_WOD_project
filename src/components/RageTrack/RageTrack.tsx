interface RageTrackProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

// Mirrors HungerTrack's cumulative click behavior: box 1 is leftmost, filling rightward as
// Rage rises toward `max` — same fill-up-to-here logic as DotRating.
export default function RageTrack({ value, onChange, max = 5 }: RageTrackProps) {
  const boxes = Array.from({ length: max }, (_, i) => i + 1)

  const handleClick = (box: number) => {
    const filled = box <= value
    onChange(filled ? box - 1 : box)
  }

  return (
    <div className="inline-flex items-center gap-2 flex-nowrap shrink-0" role="group" aria-label="Raiva">
      {boxes.map((box) => {
        const filled = box <= value
        return (
          <button
            key={box}
            type="button"
            onClick={() => handleClick(box)}
            aria-label={`Raiva: ${box} de ${max}`}
            aria-pressed={filled}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm shrink-0 transition-all duration-150 cursor-pointer hover:scale-110 border-[1.5px]"
            style={{
              backgroundColor: filled ? 'var(--system-color)' : 'transparent',
              borderColor: filled ? 'var(--system-color)' : '#2a2a3a',
            }}
          />
        )
      })}
    </div>
  )
}
