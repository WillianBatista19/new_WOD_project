interface HungerTrackProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

// Mirrors DotRating's cumulative click behavior (fill up to the clicked box, clear from it
// onward), but left-to-right: box 1 is leftmost, filling rightward as Hunger rises toward `max`.
export default function HungerTrack({ value, onChange, max = 5 }: HungerTrackProps) {
  const boxes = Array.from({ length: max }, (_, i) => i + 1)

  const handleClick = (box: number) => {
    const filled = box <= value
    onChange(filled ? box - 1 : box)
  }

  return (
    <div className="inline-flex items-center gap-2 flex-nowrap shrink-0" role="group" aria-label="Fome">
      {boxes.map((box) => {
        const filled = box <= value
        return (
          <button
            key={box}
            type="button"
            onClick={() => handleClick(box)}
            aria-label={`Fome: ${box} de ${max}`}
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
