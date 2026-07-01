interface SystemIconProps {
  systemId: string
  size?: number
  className?: string
}

export default function SystemIcon({ systemId, size = 48, className = '' }: SystemIconProps) {
  const base = { width: size, height: size, 'aria-hidden': true as const, className }

  switch (systemId) {
    case 'vampiro':
      return (
        <svg {...base} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 2 12 2z" />
        </svg>
      )

    case 'lobisomem':
      return (
        <svg {...base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
          <path d="M8 9l1.5 3M11 8l1 3.5M14 9l-1 3" strokeLinecap="round" />
        </svg>
      )

    case 'mago':
      return (
        <svg {...base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3L2 21h20L12 3z" strokeLinejoin="round" />
          <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none" />
          <path d="M9 14c0-1.66 1.34-3 3-3s3 1.34 3 3" strokeLinecap="round" />
        </svg>
      )

    case 'cacador':
      return (
        <svg {...base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="7" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="3" y1="12" x2="7" y2="12" />
          <line x1="17" y1="12" x2="21" y2="12" />
        </svg>
      )

    case 'mumia':
      return (
        <svg {...base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="7" r="4" />
          <line x1="12" y1="11" x2="12" y2="21" strokeLinecap="round" />
          <line x1="7" y1="15" x2="17" y2="15" strokeLinecap="round" />
        </svg>
      )

    default:
      return null
  }
}
