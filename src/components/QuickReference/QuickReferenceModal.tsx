import { useEffect } from 'react'
import QuickReferenceContent, { ReferenceTopic } from './QuickReferenceContent'

export interface QuickReferenceModalState {
  title: string
  topics: ReferenceTopic[]
}

export default function QuickReferenceModal({
  state,
  onClose,
}: {
  state: QuickReferenceModalState | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!state) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [state, onClose])

  if (!state) return null

  return (
    <div className="lg:hidden fixed top-0 right-0 bottom-0 left-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={state.title}
        className="relative w-full sm:max-w-md sm:mx-4 max-h-[80vh] bg-wod-card border border-wod-border rounded-t sm:rounded overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-wod-border shrink-0">
          <h2 className="font-cinzel text-sm font-semibold uppercase tracking-widest text-wod-text">
            {state.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-wod-muted hover:text-wod-text transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <QuickReferenceContent topics={state.topics} />
        </div>
      </div>
    </div>
  )
}
