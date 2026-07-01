import { HealthLevel } from '../../types'
import { HEALTH_LEVELS, groupHealthLevels } from '../../data/health'

interface HealthTrackProps {
  value: boolean[]
  onChange: (next: boolean[]) => void
  levels?: HealthLevel[]
}

export default function HealthTrack({ value, onChange, levels = HEALTH_LEVELS }: HealthTrackProps) {
  const rows = groupHealthLevels(levels)

  const handleClick = (index: number) => {
    const filled = value[index]
    const filledCount = filled ? index : index + 1
    onChange(levels.map((_, i) => i < filledCount))
  }

  const highestFilled = value.reduce((acc, filled, i) => (filled ? i : acc), -1)
  const currentLevel = highestFilled >= 0 ? levels[highestFilled] : null
  const hasPenalty = !!currentLevel && currentLevel.penalty !== '0'

  return (
    <div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={`${row.label}-${row.boxIndexes[0]}`} className="flex items-center justify-between gap-4 py-1">
            <span className="font-crimson text-base text-wod-text">{row.label}</span>
            <div className="flex items-center gap-4">
              <span className="font-cinzel text-[10px] tracking-widest uppercase text-wod-muted w-14 text-right">
                {row.penalty === '0' ? '—' : row.penalty}
              </span>
              <div className="flex items-center gap-1.5">
                {row.boxIndexes.map((index) => {
                  const filled = value[index]
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleClick(index)}
                      aria-label={`${row.label}: caixa ${index + 1} de ${levels.length}`}
                      aria-pressed={filled}
                      className="w-5 h-5 rounded-sm shrink-0 border-[1.5px] transition-all duration-150 hover:scale-110 cursor-pointer"
                      style={{
                        backgroundColor: filled ? 'var(--system-color)' : 'transparent',
                        borderColor: filled ? 'var(--system-color)' : '#2a2a3a',
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-wod-border/50 flex items-center justify-between">
        <span className="font-cinzel text-[10px] tracking-widest uppercase text-wod-muted">Penalidade atual</span>
        <span className={`font-cinzel text-sm font-semibold ${hasPenalty ? 'text-red-400' : 'text-wod-text'}`}>
          {currentLevel ? `${currentLevel.label} (${currentLevel.penalty})` : 'Nenhum ferimento'}
        </span>
      </div>
    </div>
  )
}
