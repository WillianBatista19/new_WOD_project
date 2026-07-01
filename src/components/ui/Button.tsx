import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  to?: string
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase rounded transition-all duration-300 px-6 py-3 cursor-pointer select-none'

const variants = {
  primary: 'bg-wod-text text-wod-bg hover:bg-white disabled:opacity-50',
  outline:
    'border border-wod-text text-wod-text hover:bg-wod-text hover:text-wod-bg disabled:opacity-50',
  ghost: 'text-wod-muted hover:text-wod-text disabled:opacity-50',
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  )
}
