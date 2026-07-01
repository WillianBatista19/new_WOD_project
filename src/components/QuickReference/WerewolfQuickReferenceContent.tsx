import {
  TRIBES,
  AUSPICES,
  RAGE_EXPLANATION,
  HARMONY_EXPLANATION,
  FORMS_REFERENCE,
} from '../../data/werewolfReference'
import { ReferenceEntry } from '../../types'

export type WerewolfReferenceTopic = 'tribes' | 'auspices' | 'rage' | 'harmony' | 'forms'

const TOPIC_TITLES: Record<WerewolfReferenceTopic, string> = {
  tribes: 'Tribos',
  auspices: 'Auspícios',
  rage: 'Raiva',
  harmony: 'Harmonia',
  forms: 'Formas',
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

export default function WerewolfQuickReferenceContent({ topics }: { topics: WerewolfReferenceTopic[] }) {
  return (
    <div className="space-y-6">
      {topics.map((topic) => (
        <div key={topic}>
          <h3 className="font-cinzel text-xs font-semibold uppercase tracking-widest text-wod-text mb-3 pb-2 border-b border-wod-border">
            {TOPIC_TITLES[topic]}
          </h3>
          {topic === 'tribes' && <EntryList entries={TRIBES} />}
          {topic === 'auspices' && <EntryList entries={AUSPICES} />}
          {topic === 'forms' && <EntryList entries={FORMS_REFERENCE} />}
          {topic === 'rage' && (
            <p className="font-crimson text-sm text-wod-muted leading-relaxed">{RAGE_EXPLANATION}</p>
          )}
          {topic === 'harmony' && (
            <p className="font-crimson text-sm text-wod-muted leading-relaxed">{HARMONY_EXPLANATION}</p>
          )}
        </div>
      ))}
    </div>
  )
}
