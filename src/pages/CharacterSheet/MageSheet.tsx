import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SYSTEMS } from '../../data/systems'
import DotRating from '../../components/DotRating/DotRating'
import HealthTrack from '../../components/HealthTrack/HealthTrack'
import { HEALTH_LEVELS } from '../../data/health'
import QuickReferenceSidebar from '../../components/QuickReference/QuickReferenceSidebar'
import QuickReferenceModal, { QuickReferenceModalState } from '../../components/QuickReference/QuickReferenceModal'
import ReferenceButton from '../../components/QuickReference/ReferenceButton'
import ExportMenu, { ExportKind } from '../../components/ExportMenu/ExportMenu'
import { DotTrait, MageSheetData } from '../../types'
import { generateMagePdf } from '../../lib/generateMagePdf'
import { generateMageFlatPdf } from '../../lib/generateMageFlatPdf'

const MAGE = SYSTEMS.find((s) => s.id === 'mago')!

const ATTRIBUTE_POOL = 7 + 5 + 3
const ABILITY_POOL = 13 + 9 + 5
const SPHERE_POOL = 6

const makeTraits = (labels: string[], base: number): DotTrait[] =>
  labels.map((label) => ({ label, value: base }))

const initialData: MageSheetData = {
  header: {
    name: '',
    player: '',
    chronicle: '',
    tradition: '',
    essence: '',
    concept: '',
    nature: '',
    demeanor: '',
  },
  attributes: {
    physical: makeTraits(['Força', 'Destreza', 'Vigor'], 1),
    social: makeTraits(['Carisma', 'Manipulação', 'Aparência'], 1),
    mental: makeTraits(['Percepção', 'Inteligência', 'Raciocínio'], 1),
  },
  abilities: {
    talents: makeTraits(
      ['Alerta', 'Atletismo', 'Briga', 'Empatia', 'Expressão', 'Intimidação', 'Liderança', 'Lábia', 'Prontidão', 'Subterfúgio'],
      0
    ),
    skills: makeTraits(
      ['Animais', 'Condução', 'Esportes', 'Etiqueta', 'Furtividade', 'Ofícios', 'Performance', 'Primeiros Socorros', 'Segurança', 'Sobrevivência'],
      0
    ),
    knowledges: makeTraits(
      ['Acadêmicos', 'Burocracia', 'Ciência', 'Computadores', 'Cosmologia', 'Enigmas', 'Lei', 'Linguística', 'Medicina', 'Ocultismo'],
      0
    ),
  },
  spheres: makeTraits(
    ['Correspondência', 'Entropia', 'Forças', 'Vida', 'Matéria', 'Mente', 'Primo', 'Espírito', 'Tempo'],
    0
  ),
  backgrounds: makeTraits(
    ['Aliados', 'Avatar', 'Biblioteca', 'Consagrado', 'Contatos', 'Familiar', 'Influência', 'Mentor', 'Patrono', 'Recursos', 'Reputação'],
    0
  ),
  health: HEALTH_LEVELS.map(() => false),
  arete: 1,
  quintessence: 0,
  paradox: 0,
  willpowerPermanent: 1,
  willpowerTemporary: 1,
  magicalFocus: '',
  notes: '',
}

function TextField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-cinzel text-[10px] tracking-widest uppercase text-wod-muted mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-wod-bg border border-wod-border rounded px-3 py-2 text-wod-text font-crimson text-base focus:outline-none focus:border-[var(--system-color)] transition-colors"
      />
    </div>
  )
}

function DotRow({
  trait,
  onChange,
  min = 0,
  max = 5,
  warn = false,
}: {
  trait: DotTrait
  onChange: (v: number) => void
  min?: number
  max?: number
  warn?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="font-crimson text-base text-wod-text">{trait.label}</span>
      <DotRating value={trait.value} max={max} min={min} onChange={onChange} label={trait.label} warn={warn} />
    </div>
  )
}

function PointCounter({ used, total }: { used: number; total: number }) {
  const over = used > total
  return (
    <span
      className={`font-cinzel text-[10px] tracking-widest uppercase ${
        over ? 'text-red-400' : 'text-wod-muted'
      }`}
    >
      {used} / {total} pontos usados
    </span>
  )
}

function SectionCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="bg-wod-card border border-wod-border rounded p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="font-cinzel text-lg font-semibold text-wod-text">{title}</h2>
          {subtitle && <p className="font-crimson text-sm text-wod-muted mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}

export default function MageSheet() {
  const [data, setData] = useState<MageSheetData>(initialData)
  const [exporting, setExporting] = useState<ExportKind | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalState, setModalState] = useState<QuickReferenceModalState | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const updateHeader = (field: keyof MageSheetData['header'], value: string) =>
    setData((d) => ({ ...d, header: { ...d.header, [field]: value } }))

  const updateGroupTrait = (
    section: 'attributes' | 'abilities',
    group: string,
    index: number,
    value: number
  ) =>
    setData((d) => ({
      ...d,
      [section]: {
        ...d[section],
        [group]: (d[section] as Record<string, DotTrait[]>)[group].map((t, i) =>
          i === index ? { ...t, value } : t
        ),
      },
    }))

  const updateSphere = (index: number, value: number) =>
    setData((d) => ({
      ...d,
      spheres: d.spheres.map((t, i) => (i === index ? { ...t, value } : t)),
    }))

  const updateBackground = (index: number, value: number) =>
    setData((d) => ({
      ...d,
      backgrounds: d.backgrounds.map((t, i) => (i === index ? { ...t, value } : t)),
    }))

  const updateHealth = (health: boolean[]) => setData((d) => ({ ...d, health }))

  const renameBackground = (index: number, label: string) =>
    setData((d) => ({
      ...d,
      backgrounds: d.backgrounds.map((t, i) => (i === index ? { ...t, label } : t)),
    }))

  const addBackground = () =>
    setData((d) => ({ ...d, backgrounds: [...d.backgrounds, { label: 'Novo Antecedente', value: 0 }] }))

  const removeBackground = (index: number) =>
    setData((d) => ({ ...d, backgrounds: d.backgrounds.filter((_, i) => i !== index) }))

  const sumPoints = (traits: DotTrait[], base: number) =>
    traits.reduce((acc, t) => acc + (t.value - base), 0)

  const attributePoints =
    sumPoints(data.attributes.physical, 1) +
    sumPoints(data.attributes.social, 1) +
    sumPoints(data.attributes.mental, 1)

  const abilityPoints =
    sumPoints(data.abilities.talents, 0) +
    sumPoints(data.abilities.skills, 0) +
    sumPoints(data.abilities.knowledges, 0)

  const spherePoints = sumPoints(data.spheres, 0)

  const downloadPdf = (bytes: Uint8Array, suffix: string) => {
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const fileName = data.header.name.trim() || 'personagem'
    const link = document.createElement('a')
    link.href = url
    link.download = `ficha-mago-${fileName.toLowerCase().replace(/\s+/g, '-')}-${suffix}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = async (kind: ExportKind) => {
    setExporting(kind)
    try {
      if (kind === 'editavel') {
        downloadPdf(await generateMagePdf(data), 'editavel')
      } else {
        if (!sheetRef.current) return
        downloadPdf(await generateMageFlatPdf(sheetRef.current), 'fixa')
      }
    } finally {
      setExporting(null)
    }
  }

  return (
    <div
      className="pt-16"
      style={
        {
          '--system-color': MAGE.color,
          '--system-glow': MAGE.colorGlow,
        } as React.CSSProperties
      }
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-[45] border-b border-wod-border bg-wod-bg/95 backdrop-blur-sm px-6 py-4">
        <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4 flex-nowrap overflow-x-auto">
          <div className="shrink-0 whitespace-nowrap">
            <p
              className="font-cinzel text-[10px] tracking-[0.4em] uppercase"
              style={{ color: MAGE.color }}
            >
              Criador de Fichas
            </p>
            <h1 className="font-cinzel text-lg font-semibold text-wod-text">{MAGE.name}</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Link
              to="/sistemas/mago"
              className="shrink-0 whitespace-nowrap font-cinzel text-xs tracking-widest uppercase text-wod-muted hover:text-wod-text transition-colors"
            >
              ← Voltar
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? 'Fechar referência rápida' : 'Abrir referência rápida'}
              aria-pressed={sidebarOpen}
              title="Referência rápida"
              className="hidden lg:inline-flex shrink-0 items-center justify-center w-9 h-9 rounded-full border font-cinzel text-sm transition-colors"
              style={{
                borderColor: sidebarOpen ? MAGE.color : '#2a2a3a',
                color: sidebarOpen ? MAGE.color : '#8a8090',
              }}
            >
              ?
            </button>
            <ExportMenu color={MAGE.color} exporting={exporting} onExport={handleExport} />
          </div>
        </div>
      </div>

      {/* ── Sheet ────────────────────────────────────────────────────────── */}
      <div ref={sheetRef} className={`bg-wod-bg transition-[margin] duration-300 ease-in-out ${sidebarOpen ? 'lg:mr-96' : ''}`}>
        <div className="h-1.5" style={{ backgroundColor: MAGE.color }} />

        <div className="container mx-auto max-w-6xl px-6 py-10 space-y-6">
          {/* Header fields */}
          <SectionCard
            title="Cabeçalho"
            subtitle="Quem é seu Desperto"
            right={
              <ReferenceButton
                className="lg:hidden"
                label="Referência: Tradições e Essências"
                onClick={() => setModalState({ title: 'Tradições & Essências', topics: ['traditions', 'essences'] })}
              />
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TextField id="name" label="Nome do Personagem" value={data.header.name} onChange={(v) => updateHeader('name', v)} />
              <TextField id="player" label="Jogador" value={data.header.player} onChange={(v) => updateHeader('player', v)} />
              <TextField id="chronicle" label="Crônica" value={data.header.chronicle} onChange={(v) => updateHeader('chronicle', v)} />
              <TextField id="tradition" label="Tradição" value={data.header.tradition} onChange={(v) => updateHeader('tradition', v)} />
              <TextField id="essence" label="Essência" value={data.header.essence} onChange={(v) => updateHeader('essence', v)} />
              <TextField id="concept" label="Conceito" value={data.header.concept} onChange={(v) => updateHeader('concept', v)} />
              <TextField id="nature" label="Natureza" value={data.header.nature} onChange={(v) => updateHeader('nature', v)} />
              <TextField id="demeanor" label="Comportamento" value={data.header.demeanor} onChange={(v) => updateHeader('demeanor', v)} />
            </div>
          </SectionCard>

          {/* Attributes */}
          <SectionCard
            title="Atributos"
            subtitle="7 / 5 / 3 pontos, distribua entre os três grupos"
            right={<PointCounter used={attributePoints} total={ATTRIBUTE_POOL} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(
                [
                  ['physical', 'Físico', data.attributes.physical],
                  ['social', 'Social', data.attributes.social],
                  ['mental', 'Mental', data.attributes.mental],
                ] as const
              ).map(([key, label, traits]) => (
                <div key={key}>
                  <h3 className="font-cinzel text-xs tracking-widest uppercase mb-3" style={{ color: MAGE.color }}>
                    {label}
                  </h3>
                  <div className="divide-y divide-wod-border/50">
                    {traits.map((trait, i) => (
                      <DotRow
                        key={trait.label}
                        trait={trait}
                        min={1}
                        max={5}
                        onChange={(v) => updateGroupTrait('attributes', key, i, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Abilities */}
          <SectionCard
            title="Habilidades"
            subtitle="13 / 9 / 5 pontos, distribua entre os três grupos"
            right={<PointCounter used={abilityPoints} total={ABILITY_POOL} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(
                [
                  ['talents', 'Talentos', data.abilities.talents],
                  ['skills', 'Perícias', data.abilities.skills],
                  ['knowledges', 'Conhecimentos', data.abilities.knowledges],
                ] as const
              ).map(([key, label, traits]) => (
                <div key={key}>
                  <h3 className="font-cinzel text-xs tracking-widest uppercase mb-3" style={{ color: MAGE.color }}>
                    {label}
                  </h3>
                  <div className="divide-y divide-wod-border/50">
                    {traits.map((trait, i) => (
                      <DotRow
                        key={trait.label}
                        trait={trait}
                        min={0}
                        max={5}
                        onChange={(v) => updateGroupTrait('abilities', key, i, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Spheres */}
          <SectionCard
            title="Esferas"
            subtitle={`6 pontos. Nenhuma Esfera pode exceder seu Arete (${data.arete})`}
            right={
              <div className="flex items-center gap-3">
                <ReferenceButton
                  className="lg:hidden"
                  label="Referência: Esferas"
                  onClick={() => setModalState({ title: 'Esferas', topics: ['spheres'] })}
                />
                <PointCounter used={spherePoints} total={SPHERE_POOL} />
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 divide-y md:divide-y-0 divide-wod-border/50">
              {data.spheres.map((trait, i) => (
                <DotRow
                  key={trait.label}
                  trait={trait}
                  min={0}
                  max={5}
                  warn={trait.value > data.arete}
                  onChange={(v) => updateSphere(i, v)}
                />
              ))}
            </div>
          </SectionCard>

          {/* Backgrounds */}
          <SectionCard title="Antecedentes" subtitle="Lista editável — adicione ou remova conforme necessário">
            <div className="space-y-2">
              {data.backgrounds.map((trait, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={trait.label}
                    onChange={(e) => renameBackground(i, e.target.value)}
                    aria-label="Nome do antecedente"
                    className="flex-1 min-w-[140px] bg-wod-bg border border-wod-border rounded px-3 py-1.5 text-wod-text font-crimson text-base focus:outline-none focus:border-[var(--system-color)] transition-colors"
                  />
                  <div className="flex items-center gap-3 shrink-0">
                    <DotRating value={trait.value} max={5} min={0} onChange={(v) => updateBackground(i, v)} label={trait.label} />
                    <button
                      type="button"
                      onClick={() => removeBackground(i)}
                      aria-label={`Remover ${trait.label}`}
                      className="font-cinzel text-xs text-wod-muted hover:text-red-400 transition-colors px-2"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addBackground}
                className="font-cinzel text-xs tracking-widest uppercase mt-2"
                style={{ color: MAGE.color }}
              >
                + Adicionar Antecedente
              </button>
            </div>
          </SectionCard>

          {/* Health */}
          <SectionCard title="Saúde" subtitle="Marque os níveis de dano conforme seu Desperto sofre ferimentos">
            <HealthTrack value={data.health} onChange={updateHealth} />
          </SectionCard>

          {/* Advantages */}
          <SectionCard
            title="Vantagens"
            right={
              <ReferenceButton
                className="lg:hidden"
                label="Referência: Arete e Paradoxo"
                onClick={() => setModalState({ title: 'Arete & Paradoxo', topics: ['arete', 'paradox'] })}
              />
            }
          >
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cinzel text-sm font-semibold" style={{ color: MAGE.color }}>
                    Arete
                  </h3>
                  <span
                    className="font-cinzel text-2xl font-bold"
                    style={{ color: MAGE.color, textShadow: `0 0 20px ${MAGE.colorGlow}` }}
                  >
                    {data.arete}
                  </span>
                </div>
                <DotRating
                  value={data.arete}
                  max={10}
                  min={1}
                  size="lg"
                  onChange={(v) => setData((d) => ({ ...d, arete: v }))}
                  label="Arete"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quintessence" className="block font-cinzel text-[10px] tracking-widest uppercase text-wod-muted mb-1.5">
                    Quintessência
                  </label>
                  <input
                    id="quintessence"
                    type="number"
                    min={0}
                    value={data.quintessence}
                    onChange={(e) => setData((d) => ({ ...d, quintessence: Number(e.target.value) }))}
                    className="w-full bg-wod-bg border border-wod-border rounded px-3 py-2 text-wod-text font-crimson text-base focus:outline-none focus:border-[var(--system-color)] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="paradox" className="block font-cinzel text-[10px] tracking-widest uppercase text-wod-muted mb-1.5">
                    Paradoxo
                  </label>
                  <input
                    id="paradox"
                    type="number"
                    min={0}
                    value={data.paradox}
                    onChange={(e) => setData((d) => ({ ...d, paradox: Number(e.target.value) }))}
                    className="w-full bg-wod-bg border border-wod-border rounded px-3 py-2 text-wod-text font-crimson text-base focus:outline-none focus:border-[var(--system-color)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-cinzel text-xs tracking-widest uppercase text-wod-muted mb-2">
                    Força de Vontade — Permanente
                  </h3>
                  <DotRating
                    value={data.willpowerPermanent}
                    max={10}
                    min={1}
                    onChange={(v) => setData((d) => ({ ...d, willpowerPermanent: v }))}
                    label="Força de Vontade Permanente"
                  />
                </div>
                <div>
                  <h3 className="font-cinzel text-xs tracking-widest uppercase text-wod-muted mb-2">
                    Força de Vontade — Temporária
                  </h3>
                  <DotRating
                    value={data.willpowerTemporary}
                    max={10}
                    min={0}
                    onChange={(v) => setData((d) => ({ ...d, willpowerTemporary: v }))}
                    label="Força de Vontade Temporária"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Free text */}
          <SectionCard title="Foco Mágico & Histórico">
            <div className="space-y-4">
              <div>
                <label htmlFor="magicalFocus" className="block font-cinzel text-[10px] tracking-widest uppercase text-wod-muted mb-1.5">
                  Foco Mágico (Paradigma & Instrumentos)
                </label>
                <textarea
                  id="magicalFocus"
                  rows={3}
                  value={data.magicalFocus}
                  onChange={(e) => setData((d) => ({ ...d, magicalFocus: e.target.value }))}
                  className="w-full bg-wod-bg border border-wod-border rounded px-3 py-2 text-wod-text font-crimson text-base leading-relaxed focus:outline-none focus:border-[var(--system-color)] transition-colors resize-y"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block font-cinzel text-[10px] tracking-widest uppercase text-wod-muted mb-1.5">
                  Histórico & Anotações
                </label>
                <textarea
                  id="notes"
                  rows={6}
                  value={data.notes}
                  onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
                  className="w-full bg-wod-bg border border-wod-border rounded px-3 py-2 text-wod-text font-crimson text-base leading-relaxed focus:outline-none focus:border-[var(--system-color)] transition-colors resize-y"
                />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <QuickReferenceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <QuickReferenceModal state={modalState} onClose={() => setModalState(null)} />
    </div>
  )
}
