import VampireQuickReferenceContent, { VampireReferenceTopic } from './VampireQuickReferenceContent'

const ALL_TOPICS: VampireReferenceTopic[] = ['clans', 'disciplines', 'hunger', 'bloodPotency', 'humanity']

export default function VampireQuickReferenceSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <aside
      className={`hidden lg:flex fixed top-[130px] right-0 w-96 h-[calc(100vh-65px)] lg:h-[calc(100vh-130px)] flex-col border-l border-wod-border bg-wod-card z-40 transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-wod-border shrink-0">
        <h2 className="font-cinzel text-sm font-semibold uppercase tracking-widest text-wod-text">
          Referência Rápida
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar referência rápida"
          tabIndex={open ? 0 : -1}
          className="text-wod-muted hover:text-wod-text transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <VampireQuickReferenceContent topics={ALL_TOPICS} />
      </div>
    </aside>
  )
}
