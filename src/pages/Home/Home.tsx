import { Link } from 'react-router-dom'
import SystemCard from '../../components/SystemCard/SystemCard'
import { SYSTEMS } from '../../data/systems'
import MistBackgroundLocal from '../../components/MistBackground/MistBackgroundLocal'

const creationSteps = [
  {
    number: '01',
    title: 'Escolha seu Conceito',
    desc: 'Quem você era antes de tudo mudar? O conceito ancora sua identidade e dá sentido a cada escolha na ficha.',
  },
  {
    number: '02',
    title: 'Distribua Atributos',
    desc: 'Físico, Social e Mental em ordem de prioridade. Onde você se destaca define como você resolve problemas nas Trevas.',
  },
  {
    number: '03',
    title: 'Selecione Habilidades',
    desc: 'Talentos inatos, Perícias aprendidas e Conhecimentos acumulados. O que você sabe fazer em vida molda o sobrenatural.',
  },
  {
    number: '04',
    title: 'Escolha Vantagens',
    desc: 'Poderes únicos, histórico e recursos. O que te diferencia dos outros — e o que você tem a perder nas Trevas.',
  },
]

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <MistBackgroundLocal />
        </div>

        <section className="relative min-h-screen flex items-center justify-center text-center px-6">
          {/* Dark overlay so the mist stays readable behind the title */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Red/purple glow — main visual anchor of the hero */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 30% 55%, rgba(196,30,58,0.35) 0%, transparent 55%),
                radial-gradient(ellipse at 70% 45%, rgba(123,47,255,0.35) 0%, transparent 55%)
              `,
            }}
          />

          {/* Bottom fade into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-surface/60 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <p
              className="font-cinzel text-xs tracking-[0.5em] text-wod-muted uppercase mb-8"
              style={{ animation: 'fadeInUp 0.6s ease-out both' }}
            >
              Uma noite de horror pessoal
            </p>

            <h1
              className="font-cinzel font-bold text-wod-text leading-none tracking-wide mb-8"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', animation: 'fadeInUp 0.7s ease-out 0.1s both' }}
            >
              WORLD OF
              <br />
              <span className="text-white">DARKNESS</span>
            </h1>

            <p
              className="font-crimson text-xl md:text-2xl text-wod-muted leading-relaxed max-w-2xl mx-auto mb-12"
              style={{ animation: 'fadeInUp 0.7s ease-out 0.2s both' }}
            >
              Um universo de horror pessoal e grandeza trágica. Explore vampiros, lobisomens,
              magos e outros seres sobrenaturais em um mundo que é o nosso — mas muito mais sombrio.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animation: 'fadeInUp 0.7s ease-out 0.3s both' }}
            >
              <Link
                to="/sistemas"
                className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase border border-wod-text text-wod-text px-8 py-4 rounded transition-all duration-300 hover:bg-wod-text hover:text-wod-bg"
              >
                Explorar os Sistemas
              </Link>
              <Link
                to="/o-que-e-rpg"
                className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase border border-wod-border text-wod-muted px-8 py-4 rounded transition-all duration-300 hover:border-wod-text hover:text-wod-text"
              >
                O Que é RPG?
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── What is RPG — teaser ─────────────────────────────────────────── */}
      <section className="relative py-24 bg-wod-surface/60 overflow-hidden">
        {/* Top fade from Hero */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-wod-surface/60 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-cinzel text-xs tracking-[0.5em] text-wod-muted uppercase mb-4">
              Para quem está chegando
            </p>
            <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-wod-text mb-6">
              O Que é RPG de Mesa?
            </h2>
            <p className="font-crimson text-xl text-wod-muted leading-relaxed mb-8">
              Imagine um filme onde você é roteirista, ator e plateia ao mesmo tempo. RPG de mesa é
              narrativa colaborativa: um Narrador cria o mundo, os jogadores decidem como seus
              personagens reagem — sem telas, sem regras rígidas de vitória, só imaginação
              compartilhada e dados que tornam o imprevisível possível.
            </p>
            <Link
              to="/o-que-e-rpg"
              className="inline-flex items-center gap-3 font-cinzel text-xs tracking-widest uppercase text-wod-muted hover:text-wod-text transition-colors duration-200 group"
            >
              <span>Descubra como jogar</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom fade into Systems Grid */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-bg pointer-events-none" />
      </section>

      {/* ── Systems Grid ─────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-14">
            <p className="font-cinzel text-xs tracking-[0.5em] text-wod-muted uppercase mb-4">
              Escolha seu mundo
            </p>
            <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-wod-text">
              Os Sistemas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SYSTEMS.map((system) => (
              <SystemCard key={system.id} system={system} />
            ))}
          </div>
        </div>

        {/* Bottom fade into Character Creation section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-surface/60 pointer-events-none" />
      </section>

      {/* ── Character Creation Overview ───────────────────────────────────── */}
      <section className="py-24 bg-wod-surface/60">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-14">
            <p className="font-cinzel text-xs tracking-[0.5em] text-wod-muted uppercase mb-4">
              Guia rápido
            </p>
            <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-wod-text mb-4">
              Como Criar seu Personagem
            </h2>
            <p className="font-crimson text-xl text-wod-muted max-w-2xl mx-auto">
              Todos os sistemas do World of Darkness usam o mesmo sistema base — o{' '}
              <em>Storyteller System</em> — com variações temáticas únicas por jogo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creationSteps.map((step) => (
              <div
                key={step.number}
                className="bg-wod-card border border-wod-border rounded p-6 hover:border-wod-text/20 transition-colors duration-300"
              >
                <div className="font-cinzel text-5xl font-bold text-wod-border/60 mb-5 select-none leading-none">
                  {step.number}
                </div>
                <h3 className="font-cinzel text-sm font-semibold text-wod-text mb-3">
                  {step.title}
                </h3>
                <p className="font-crimson text-base text-wod-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
