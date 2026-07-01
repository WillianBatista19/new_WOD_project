import {
  CLANS,
  DISCIPLINES_REFERENCE,
  HUNGER_EXPLANATION,
  BLOOD_POTENCY_EXPLANATION,
  HUMANITY_EXPLANATION,
} from '../../data/vampireReference'
import { ReferenceEntry } from '../../types'

export type VampireReferenceTopic = 'clans' | 'disciplines' | 'hunger' | 'bloodPotency' | 'humanity'

const TOPIC_TITLES: Record<VampireReferenceTopic, string> = {
  clans: 'Clãs',
  disciplines: 'Disciplinas',
  hunger: 'Fome',
  bloodPotency: 'Potência de Sangue',
  humanity: 'Humanidade',
}

function EntryList({ entries }: { entries: ReferenceEntry[] }) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.name}>
          <p className="font-cinzel text-xs tracking-wide" style={{ color: 'var(--system-color)' }}>
            {entry.name}
          </p>
          <p className="font-crimson text-sm text-wod-muted leading-snug">{entry.description}</p>
        </li>
      ))}
    </ul>
  )
}

export default function VampireQuickReferenceContent({ topics }: { topics: VampireReferenceTopic[] }) {
  return (
    <div className="space-y-6">
      {topics.map((topic) => (
        <div key={topic}>
          <h3 className="font-cinzel text-xs font-semibold uppercase tracking-widest text-wod-text mb-3 pb-2 border-b border-wod-border">
            {TOPIC_TITLES[topic]}
          </h3>
          {topic === 'clans' && <EntryList entries={CLANS} />}
          {topic === 'disciplines' && <EntryList entries={DISCIPLINES_REFERENCE} />}
          {topic === 'hunger' && (
            <p className="font-crimson text-sm text-wod-muted leading-relaxed">{HUNGER_EXPLANATION}</p>
          )}
          {topic === 'bloodPotency' && (
            <p className="font-crimson text-sm text-wod-muted leading-relaxed">{BLOOD_POTENCY_EXPLANATION}</p>
          )}
          {topic === 'humanity' && (
            <p className="font-crimson text-sm text-wod-muted leading-relaxed">{HUMANITY_EXPLANATION}</p>
          )}
        </div>
      ))}
    </div>
  )
}
