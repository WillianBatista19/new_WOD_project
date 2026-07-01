import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GameSystem } from '../../types'
import SystemIcon from '../SystemIcon/SystemIcon'

interface SystemCardProps {
  system: GameSystem
  compact?: boolean
}

export default function SystemCard({ system, compact = false }: SystemCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={`/sistemas/${system.id}`}
      className="block h-full rounded"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Explorar ${system.name}`}
      style={{ '--system-color': system.color } as React.CSSProperties}
    >
      <article
        className="relative overflow-hidden rounded h-full transition-transform duration-300 ease-out"
        style={{
          transform: hovered ? 'scale(1.02)' : 'scale(1)',
          background: `linear-gradient(160deg, ${system.colorSecondary}55 0%, #111118 55%)`,
          border: `1px solid ${system.color}44`,
          boxShadow: hovered
            ? `0 0 40px ${system.colorGlow}, 0 0 80px ${system.colorGlow}`
            : `0 0 16px ${system.colorGlow}`,
        }}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${system.color}cc, transparent)`,
          }}
        />

        {/* Hover mist overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse at 50% 0%, ${system.colorSecondary}40 0%, transparent 65%)`,
          }}
        />

        {/* Content */}
        <div className={`relative z-10 ${compact ? 'p-4' : 'p-6 md:p-7'}`}>
          <div className="mb-4 select-none" style={{ color: system.color }}>
            <SystemIcon systemId={system.id} size={compact ? 32 : 48} />
          </div>

          <h3
            className={`font-cinzel font-semibold text-wod-text mb-1 leading-tight ${
              compact ? 'text-base' : 'text-xl'
            }`}
          >
            {system.name}
          </h3>

          <p className="font-cinzel text-xs tracking-widest text-wod-muted uppercase mb-4">
            {system.subtitle}
          </p>

          <p
            className="font-crimson italic mb-4 leading-snug"
            style={{ color: system.color, fontSize: compact ? '0.9rem' : '1.05rem' }}
          >
            "{system.tagline}"
          </p>

          {!compact && (
            <p className="font-crimson text-base text-wod-muted leading-relaxed">
              {system.description}
            </p>
          )}

          {/* Explore indicator */}
          <div
            className="mt-5 flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase transition-colors duration-300"
            style={{ color: hovered ? system.color : '#8a8090' }}
          >
            <span>Explorar</span>
            <span
              className="transition-transform duration-300"
              style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}
            >
              →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
