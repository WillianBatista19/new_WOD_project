import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Início', end: true },
  { to: '/o-que-e-rpg', label: 'O Que é RPG?', end: false },
  { to: '/sistemas', label: 'Sistemas', end: false },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-wod-border bg-wod-bg/95 backdrop-blur-sm">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        <Link
          to="/"
          className="font-cinzel text-base font-bold tracking-[0.2em] text-wod-text hover:text-white transition-colors duration-200"
        >
          WORLD OF<span className="text-wod-muted"> DARKNESS</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `font-cinzel text-xs tracking-widest uppercase transition-colors duration-200 ${
                    isActive
                      ? 'text-wod-text'
                      : 'text-wod-muted hover:text-wod-text'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-wod-muted hover:text-wod-text transition-colors duration-200 p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-wod-border bg-wod-bg transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="container mx-auto px-6 py-4 flex flex-col gap-1 max-w-7xl">
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block font-cinzel text-xs tracking-widest uppercase py-3 border-b border-wod-border/50 transition-colors duration-200 ${
                    isActive ? 'text-wod-text' : 'text-wod-muted hover:text-wod-text'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
