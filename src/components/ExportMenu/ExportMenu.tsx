import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

export type ExportKind = 'editavel' | 'fixa'

interface ExportMenuProps {
  color: string
  exporting: ExportKind | null
  onExport: (kind: ExportKind) => void
}

// Dropdown is rendered via a portal into document.body, positioned with `fixed` from the
// trigger button's own bounding rect. This is what lets the toolbar use overflow-x-auto (for
// the no-wrap mobile layout) without clipping the menu — a normally-positioned `absolute`
// dropdown would get clipped, since CSS forces overflow-y to computed `auto` on any element
// that sets overflow-x to something other than `visible`.
export default function ExportMenu({ color, exporting, onExport }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const isExporting = exporting !== null

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
    }
    setOpen((v) => !v)
  }

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleSelect = (kind: ExportKind) => {
    setOpen(false)
    onExport(kind)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        disabled={isExporting}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-cinzel text-xs tracking-widest uppercase text-wod-bg px-6 py-3 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
        style={{ backgroundColor: color }}
      >
        {isExporting ? 'Gerando…' : 'Exportar PDF'}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed w-52 bg-wod-card border border-wod-border rounded shadow-xl overflow-hidden z-[60]"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <button
              role="menuitem"
              type="button"
              onClick={() => handleSelect('editavel')}
              title="PDF com campos preenchíveis (dots, checkboxes de saúde e textos)"
              className="w-full text-left px-4 py-3 font-cinzel text-xs tracking-widest uppercase text-wod-text hover:bg-wod-bg transition-colors"
            >
              Ficha Editável
            </button>
            <button
              role="menuitem"
              type="button"
              onClick={() => handleSelect('fixa')}
              title="PDF estático, apenas visual — sem campos preenchíveis"
              className="w-full text-left px-4 py-3 font-cinzel text-xs tracking-widest uppercase text-wod-text hover:bg-wod-bg transition-colors border-t border-wod-border"
            >
              Ficha Fixa
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
