export default function ReferenceButton({
  onClick,
  label,
  className = '',
}: {
  onClick: () => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full border border-wod-border text-wod-muted hover:text-wod-text hover:border-[var(--system-color)] font-cinzel text-xs shrink-0 transition-colors ${className}`}
    >
      ?
    </button>
  )
}
