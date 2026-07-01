import { lazy, Suspense } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { SYSTEMS } from '../../data/systems'
import SystemIcon from '../../components/SystemIcon/SystemIcon'
import SmokeBackground from '../../components/SmokeBackground/SmokeBackground'

const MageGridBackground = lazy(() => import('../../components/MageGridBackground/MageGridBackground'))

// ── Static content keyed by system.id ────────────────────────────────────────

const FACTION_LABELS: Record<string, string> = {
  vampiro: 'Clãs',
  lobisomem: 'Tribos',
  mago: 'Tradições',
  changeling: 'Kiths',
  demonio: 'Casas',
  cacador: 'Credos',
  mumia: 'Caminhos',
}

const EDITION_LABELS: Record<string, string> = {
  vampiro: '5ª Edição',
  lobisomem: '5ª Edição',
  mago: 'Edição do 20º Aniversário',
  changeling: 'Edição do 20º Aniversário',
  demonio: '1ª Edição (2002)',
  cacador: 'Edição Original',
  mumia: 'Edição Original',
}

interface RulesBlock {
  label: string
  content: string
}

const RULES_OVERVIEW: Record<string, RulesBlock[]> = {
  vampiro: [
    {
      label: 'Atributos & Habilidades',
      content:
        'Atributos medem capacidades brutas em três categorias — Físico (Força, Destreza, Vigor), Social (Carisma, Manipulação, Aparência) e Mental (Percepção, Inteligência, Raciocínio), cada um de 1 a 5. Habilidades representam o que você treinou. Combinar um Atributo com uma Habilidade forma seu pool de dados: role 1d10 por ponto e conte resultados de 6 ou mais como sucessos.',
    },
    {
      label: 'Disciplinas',
      content:
        'Os poderes do sangue Kindred, organizados por Clã. Cada Clã tem acesso facilitado a três Disciplinas — Animalismo, Auspício, Celeridade, Dominação, Oblívio, Presença, Vitalidade e outras. Comprar Disciplinas fora do Clã é possível, mas custa o dobro de pontos de experiência.',
    },
    {
      label: 'Fome',
      content:
        'A Fome (0 a 5) cresce toda vez que você não se alimenta. Ela permeia os dados: dados de Fome rolados no lugar de dados normais criam complicações em falhas e torpor nos fracassos. Gerenciar a Fome é a tensão constante de cada noite.',
    },
    {
      label: 'Humanidade & Potência de Sangue',
      content:
        'Humanidade (0 a 10) mede o quanto de humano resta — instintos, empatia, a capacidade de conviver entre mortais. Cai a cada atrocidade cometida. Potência de Sangue define o nível de poder vampírico e quantos dados de Fome entram na equação.',
    },
  ],
  lobisomem: [
    {
      label: 'Atributos & Habilidades',
      content:
        'O mesmo sistema Storyteller base — três grupos de Atributos e três de Habilidades. Garou tendem a ter Atributos Físicos elevados; em forma Crinos, recebem bônus significativos de Força e Vigor que os tornam terríveis no combate corpo a corpo.',
    },
    {
      label: 'As Cinco Formas',
      content:
        'Homid (humano), Glabro (semi-humano musculoso), Crinos (lobisomem clássico de 3m+), Hispo (lobo gigante) e Lupus (lobo). Cada forma tem modificadores de Atributo e capacidades distintas. A forma Crinos causa Pavor Delirium em humanos que a vejam e é devastadora no combate — mas difícil de controlar sob Raiva elevada.',
    },
    {
      label: 'Raiva & Gnose',
      content:
        'Raiva (1 a 10) é o combustível da fúria Garou — permite ações extras, ativar certos Dons e continuar lutando além dos limites físicos normais. Mas acumular Raiva aumenta o risco de Frenesi. Gnose (1 a 10) é a conexão espiritual, necessária para entrar no Umbra e ativar Dons espirituais.',
    },
    {
      label: 'Renome & Dons',
      content:
        'Renome (Pureza, Glória, Honra) define o Rank Garou — de Filhote a Älde — e o acesso a Dons mais poderosos. Dons são poderes concedidos por espíritos aliados. Diferente de Disciplinas vampíricas, cada Dom precisa ser ensinado por um espírito específico e negociado, não herdado.',
    },
  ],
  mago: [
    {
      label: 'Atributos & Habilidades',
      content:
        'O sistema base é idêntico ao dos outros jogos WoD — três grupos de Atributos e três de Habilidades. O que diferencia Magos não são os Atributos, mas as Esferas que controlam e a Arete que limita seu potencial mágico.',
    },
    {
      label: 'As Nove Esferas',
      content:
        'Os domínios da realidade que um Desperto manipula: Correspondência (espaço e distância), Entropia (caos e decadência), Forças (energia e fenômenos físicos), Vida (biologia), Matéria (substância inerte), Mente (consciência), Primo (energia mágica pura), Espírito (o além) e Tempo. Nenhuma Esfera pode exceder o valor de Arete do Mago.',
    },
    {
      label: 'Arete & Quintessência',
      content:
        'Arete (1 a 10) é a maestria mágica geral do Desperto — define o teto de cada Esfera e determina quantos dados são rolados em efeitos mágicos. Quintessência é a energia mágica pura armazenada no Avatar; pode ser gasta para amplificar efeitos e como combustível para Feitiços de grande escala.',
    },
    {
      label: 'O Paradoxo',
      content:
        'Quando a magia viola as expectativas do Consenso mortal — quando é visível, óbvia, impossível de ignorar — a realidade resiste. Paradoxo acumula a cada ato de magia vulgar e pode estorar catastroficamente: backlash, maldições, bolsões de realidade alternativa ou eventos que destroem a vida do Mago.',
    },
  ],
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SystemDetail() {
  const { id } = useParams<{ id: string }>()
  const system = SYSTEMS.find((s) => s.id === id)

  if (!system) return <Navigate to="/sistemas" replace />

  const factionLabel = FACTION_LABELS[system.id] ?? 'Facções'
  const editionLabel = EDITION_LABELS[system.id] ?? ''
  const rulesBlocks = RULES_OVERVIEW[system.id] ?? []

  return (
    <div
      style={
        {
          '--system-color': system.color,
          '--system-glow': system.colorGlow,
        } as React.CSSProperties
      }
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-28 sm:pt-40 pb-24 px-6 text-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% -10%, ${system.colorSecondary}70 0%, transparent 60%)`,
        }}
      >
        {/* WebGL smoke/fog effect, scoped to this section only */}
        {system.id === 'vampiro' && <SmokeBackground smokeColor={system.color} />}

        {/* WebGL arcane grid effect, scoped to this section only */}
        {system.id === 'mago' && (
          <Suspense fallback={null}>
            <MageGridBackground />
          </Suspense>
        )}

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 10%, ${system.colorGlow} 0%, transparent 50%)`,
          }}
        />

        {/* Centered color glow behind text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${system.colorGlow} 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 container mx-auto max-w-4xl">
          {editionLabel && (
            <p
              className={`font-cinzel text-xs tracking-[0.5em] uppercase mb-6 ${
                system.id === 'vampiro' || system.id === 'mago' ? 'text-wod-text' : ''
              }`}
              style={{
                color: system.id === 'vampiro' || system.id === 'mago' ? undefined : system.color,
                animation: 'fadeInUp 0.5s ease-out both',
              }}
            >
              {editionLabel}
            </p>
          )}

          {system.id !== 'vampiro' && system.id !== 'mago' && (
            <div
              className="mb-6 select-none"
              aria-hidden="true"
              style={{ color: system.color, animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
            >
              <SystemIcon systemId={system.id} size={72} />
            </div>
          )}

          <h1
            className="font-cinzel text-4xl md:text-6xl font-bold text-wod-text mb-3 leading-tight"
            style={{ animation: 'fadeInUp 0.7s ease-out 0.15s both' }}
          >
            {system.name}
          </h1>

          <p
            className="font-cinzel text-sm md:text-base text-wod-muted tracking-widest mb-8"
            style={{ animation: 'fadeInUp 0.7s ease-out 0.2s both' }}
          >
            {system.subtitle}
          </p>

          <div
            className="mx-auto mb-8 h-px w-28"
            style={{
              background: `linear-gradient(90deg, transparent, ${system.color}, transparent)`,
              animation: 'fadeIn 0.8s ease-out 0.25s both',
            }}
          />

          <p
            className={`font-crimson text-xl md:text-2xl italic max-w-xl mx-auto leading-snug ${
              system.id === 'vampiro' ? 'text-wod-muted' : system.id === 'mago' ? 'text-wod-text' : ''
            }`}
            style={{
              color: system.id === 'vampiro' || system.id === 'mago' ? undefined : system.color,
              animation: 'fadeInUp 0.7s ease-out 0.3s both',
            }}
          >
            "{system.tagline}"
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-bg pointer-events-none" />
      </section>

      {/* ── The Setting ──────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-3xl">
          <p
            className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: system.color }}
          >
            O Cenário
          </p>
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-10">
            O Mundo
          </h2>

          <blockquote
            className="border-l-[3px] pl-7"
            style={{ borderColor: system.color + '90' }}
          >
            <p className="font-crimson text-xl leading-relaxed text-wod-text/90">
              {system.longDescription}
            </p>
          </blockquote>
        </div>

        {/* Bottom fade into Factions section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
      </section>

      {/* ── Factions ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-wod-surface/60 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <p
              className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
              style={{ color: system.color }}
            >
              Escolha sua origem
            </p>
            <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text">
              {factionLabel}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {system.factions.map((faction) => (
              <div
                key={faction.name}
                className="bg-wod-card rounded p-5 border border-wod-border border-l-[3px] transition-all duration-200 hover:border-wod-border/50"
                style={{
                  borderLeftColor: system.color,
                  '--system-color': system.color,
                } as React.CSSProperties}
              >
                <h3
                  className="font-cinzel text-sm font-semibold mb-2"
                  style={{ color: system.color }}
                >
                  {faction.name}
                </h3>
                <p className="font-crimson text-base text-wod-muted leading-relaxed">
                  {faction.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
      </section>

      {/* ── Character Creation Steps ──────────────────────────────────────── */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-3xl">
          <p
            className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: system.color }}
          >
            Passo a passo
          </p>
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-12">
            Criando seu Personagem
          </h2>

          <div>
            {system.steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                {/* Number column with connecting line */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-cinzel text-sm font-bold text-wod-bg"
                    style={{ backgroundColor: system.color }}
                  >
                    {i + 1}
                  </div>
                  {i < system.steps.length - 1 && (
                    <div
                      className="w-px flex-1 min-h-8 my-2"
                      style={{ backgroundColor: system.color + '35' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={i < system.steps.length - 1 ? 'pb-8' : 'pb-0'}>
                  <h3 className="font-cinzel text-sm font-semibold text-wod-text mb-2 pt-2">
                    {step.title}
                  </h3>
                  <p className="font-crimson text-base text-wod-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
      </section>

      {/* ── Attributes & Powers Overview ─────────────────────────────────── */}
      {rulesBlocks.length > 0 && (
        <section className="relative py-20 bg-wod-surface/60 px-6 overflow-hidden">
          <div className="container mx-auto max-w-5xl">
            <p
              className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
              style={{ color: system.color }}
            >
              Como funciona
            </p>
            <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-12">
              Atributos & Poderes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rulesBlocks.map((block) => (
                <div
                  key={block.label}
                  className="bg-wod-card border border-wod-border rounded p-6"
                >
                  <h3
                    className="font-cinzel text-sm font-semibold mb-3"
                    style={{ color: system.color }}
                  >
                    {block.label}
                  </h3>
                  <p className="font-crimson text-base text-wod-muted leading-relaxed">
                    {block.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom fade into Unique Stat section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/60 pointer-events-none" />
        </section>
      )}

      {/* ── Unique Stat ───────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${system.colorSecondary}35 0%, transparent 70%)`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${system.colorGlow} 0%, transparent 60%)`,
          }}
        />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <p
            className="font-cinzel text-xs tracking-[0.5em] uppercase mb-6"
            style={{ color: system.color }}
          >
            O Recurso Central
          </p>

          <h2
            className="font-cinzel font-bold mb-6 leading-none"
            style={{
              color: system.color,
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              textShadow: `0 0 60px ${system.colorGlow}`,
            }}
          >
            {system.uniqueStat.name}
          </h2>

          <div
            className="mx-auto mb-8 h-px w-24"
            style={{
              background: `linear-gradient(90deg, transparent, ${system.color}, transparent)`,
            }}
          />

          <p className="font-crimson text-xl text-wod-text/90 leading-relaxed max-w-2xl mx-auto">
            {system.uniqueStat.description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-surface/60 pointer-events-none" />
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-wod-surface/60 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <p
            className="font-cinzel text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: system.color }}
          >
            {system.id === 'mago' || system.id === 'vampiro' ? 'Disponível agora' : 'Em breve'}
          </p>
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-wod-text mb-4">
            Criador de Fichas
          </h2>
          <p className="font-crimson text-xl text-wod-muted leading-relaxed mb-10">
            {system.id === 'mago' || system.id === 'vampiro' ? (
              <>
                Monte, preencha e exporte sua ficha completa de{' '}
                <span style={{ color: system.color }}>{system.name}</span> diretamente nesta página.
              </>
            ) : (
              <>
                Em breve você poderá montar, preencher e exportar fichas de personagem completas
                para <span style={{ color: system.color }}>{system.name}</span> diretamente nesta página.
              </>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(system.id === 'mago' || system.id === 'vampiro') && (
              <Link
                to={`/sistemas/${system.id}/ficha`}
                className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase px-7 py-3 rounded transition-all duration-300 text-wod-bg"
                style={{ backgroundColor: system.color }}
              >
                Criar Ficha
              </Link>
            )}
            <Link
              to="/sistemas"
              className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase border border-wod-border text-wod-muted px-7 py-3 rounded transition-all duration-300 hover:border-wod-text hover:text-wod-text"
            >
              ← Ver todos os sistemas
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 font-cinzel text-xs tracking-widest uppercase border border-wod-border text-wod-muted px-7 py-3 rounded transition-all duration-300 hover:border-wod-text hover:text-wod-text"
            >
              Início
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
