import { useParams, Navigate, Link } from 'react-router-dom'
import { SYSTEMS } from '../../data/systems'
import MageSheet from './MageSheet'

export default function CharacterSheet() {
  const { id } = useParams<{ id: string }>()
  const system = SYSTEMS.find((s) => s.id === id)

  if (!system) return <Navigate to="/sistemas" replace />

  if (system.id === 'mago') {
    return <MageSheet />
  }

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-6 py-24 text-center"
      style={
        {
          '--system-color': system.color,
          '--system-glow': system.colorGlow,
        } as React.CSSProperties
      }
    >
      <div className="max-w-lg">
        <p
          className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
          style={{ color: system.color }}
        >
          Em construção
        </p>
        <h1 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-4">
          Ficha de {system.name} ainda não está disponível
        </h1>
        <p className="font-crimson text-lg text-wod-muted leading-relaxed mb-8">
          O criador de fichas interativo chega primeiro para Mago: A Ascensão. As demais fichas
          — incluindo {system.name} — estão a caminho.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/sistemas/${system.id}`}
            className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase border border-wod-border text-wod-muted px-7 py-3 rounded transition-all duration-300 hover:border-wod-text hover:text-wod-text"
          >
            ← Voltar para {system.name}
          </Link>
          <Link
            to="/sistemas/mago/ficha"
            className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase border border-wod-text text-wod-text px-7 py-3 rounded transition-all duration-300 hover:bg-wod-text hover:text-wod-bg"
          >
            Experimentar a ficha de Mago
          </Link>
        </div>
      </div>
    </div>
  )
}
