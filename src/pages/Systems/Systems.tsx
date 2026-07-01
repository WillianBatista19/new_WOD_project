import { useState } from 'react'
import SystemCard from '../../components/SystemCard/SystemCard'
import { SYSTEMS } from '../../data/systems'

// Priority systems stay visible at all times — 6 on desktop, 3 on mobile. Anything past that
// (Múmia and any future additions) only shows once "Ver mais" is expanded.
const DESKTOP_ALWAYS_VISIBLE = 6
const MOBILE_ALWAYS_VISIBLE = 3

export default function Systems() {
  const [showAll, setShowAll] = useState(false)

  return (
    <>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section
        className="pt-28 sm:pt-36 pb-16 px-6 text-center relative"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 60%)`,
        }}
      >
        <div className="container mx-auto max-w-3xl">
          <p className="font-cinzel text-xs tracking-[0.5em] text-wod-muted uppercase mb-4">
            Universos de horror pessoal
          </p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-wod-text mb-6">
            Os Sistemas
          </h1>
          <p className="font-crimson text-xl text-wod-muted leading-relaxed">
            Cada linha de jogo do World of Darkness é um universo distinto com suas próprias regras,
            facções e horrores. Escolha o que ressoa com você — e mergulhe.
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-transparent pointer-events-none" />
      </section>

      {/* ── Systems grid ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SYSTEMS.map((system, i) => {
              const visibility =
                i < MOBILE_ALWAYS_VISIBLE
                  ? ''
                  : i < DESKTOP_ALWAYS_VISIBLE
                  ? `${showAll ? 'block' : 'hidden'} md:block`
                  : showAll
                  ? 'block'
                  : 'hidden'
              return (
                <div key={system.id} className={visibility}>
                  <SystemCard system={system} />
                </div>
              )
            })}
          </div>

          {SYSTEMS.length > MOBILE_ALWAYS_VISIBLE && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="font-cinzel text-xs tracking-widest uppercase border border-wod-border text-wod-muted px-6 py-3 rounded transition-all duration-300 hover:border-wod-text hover:text-wod-text"
              >
                {showAll ? 'Ver menos ↑' : 'Ver mais ↓'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
