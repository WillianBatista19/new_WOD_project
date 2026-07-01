import { HealthBoxState } from '../../types/werewolf'
import { werewolfHealthPenalty } from '../../data/werewolfHealth'

interface WerewolfHealthTrackProps {
  value: HealthBoxState[]
  onChange: (next: HealthBoxState[]) => void
}

const STATE_LABEL: Record<HealthBoxState, string> = {
  0: 'sem dano',
  1: 'dano superficial',
  2: 'dano agravado',
}

// Cycles 0 -> 1 -> 2 -> 0, wrapping with modulo so every click always advances the state.
const nextState = (state: HealthBoxState): HealthBoxState => ((state + 1) % 3) as HealthBoxState

export default function WerewolfHealthTrack({ value, onChange }: WerewolfHealthTrackProps) {
  const handleClick = (index: number) => {
    onChange(value.map((state, i) => (i === index ? nextState(state) : state)))
  }

  const penalty = werewolfHealthPenalty(value)

  return (
    <div>
      <div className="flex items-center flex-wrap" style={{ gap: '6px' }}>
        {value.map((state, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            aria-label={`Caixa de saúde ${index + 1} de ${value.length} — ${STATE_LABEL[state]}`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm shrink-0 border-2 transition-transform duration-150 hover:scale-110 cursor-pointer flex items-center justify-center bg-transparent"
            style={{ borderColor: '#2a2a3a' }}
          >
            {state === 1 && (
              <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
                <line x1="7" y1="25" x2="25" y2="7" stroke="#e8e0d0" strokeWidth="4" strokeLinecap="round" />
              </svg>
            )}
            {state === 2 && (
              <svg viewBox="0 0 32 32" className="w-full h-full" aria-hidden="true">
                <line x1="6" y1="6" x2="26" y2="26" stroke="#c41e3a" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="6" y1="26" x2="26" y2="6" stroke="#c41e3a" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-wod-border/50 flex items-center justify-between">
        <span className="font-cinzel text-[10px] tracking-widest uppercase text-wod-muted">Penalidade Atual</span>
        <span className={`font-cinzel text-sm font-semibold ${penalty.severe ? 'text-red-400' : 'text-wod-text'}`}>
          {penalty.label}
        </span>
      </div>
    </div>
  )
}
