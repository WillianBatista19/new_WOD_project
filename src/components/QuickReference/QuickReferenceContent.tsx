import { TRADITIONS, SPHERES_REFERENCE, ESSENCES, ARETE_EXPLANATION, PARADOX_EXPLANATION } from '../../data/mageReference'
import { ReferenceEntry } from '../../types'

export type ReferenceTopic = 'traditions' | 'spheres' | 'essences' | 'arete' | 'paradox'

const TOPIC_TITLES: Record<ReferenceTopic, string> = {
  traditions: 'Tradições',
  spheres: 'Esferas',
  essences: 'Essências',
  arete: 'Arete',
  paradox: 'Paradoxo',
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

export default function QuickReferenceContent({ topics }: { topics: ReferenceTopic[] }) {
  return (
    <div className="space-y-6">
      {topics.map((topic) => (
        <div key={topic}>
          <h3 className="font-cinzel text-xs font-semibold uppercase tracking-widest text-wod-text mb-3 pb-2 border-b border-wod-border">
            {TOPIC_TITLES[topic]}
          </h3>
          {topic === 'traditions' && <EntryList entries={TRADITIONS} />}
          {topic === 'spheres' && <EntryList entries={SPHERES_REFERENCE} />}
          {topic === 'essences' && <EntryList entries={ESSENCES} />}
          {topic === 'arete' && (
            <p className="font-crimson text-sm text-wod-muted leading-relaxed">{ARETE_EXPLANATION}</p>
          )}
          {topic === 'paradox' && (
            <p className="font-crimson text-sm text-wod-muted leading-relaxed">{PARADOX_EXPLANATION}</p>
          )}
        </div>
      ))}
    </div>
  )
}
