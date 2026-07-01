import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SYSTEMS } from '../../data/systems'
import DotRating from '../../components/DotRating/DotRating'
import WerewolfHealthTrack from '../../components/HealthTrack/WerewolfHealthTrack'
import RageTrack from '../../components/RageTrack/RageTrack'
import WerewolfQuickReferenceSidebar from '../../components/QuickReference/WerewolfQuickReferenceSidebar'
import WerewolfQuickReferenceModal, {
  WerewolfQuickReferenceModalState,
} from '../../components/QuickReference/WerewolfQuickReferenceModal'
import ReferenceButton from '../../components/QuickReference/ReferenceButton'
import ExportMenu, { ExportKind } from '../../components/ExportMenu/ExportMenu'
import { FORMS_REFERENCE } from '../../data/werewolfReference'
import { DotTrait } from '../../types'
import { HEALTH_EMPTY, HealthBoxState, WerewolfSheetData } from '../../types/werewolf'
import { generateWerewolfPdf } from '../../lib/generateWerewolfPdf'
import { generateWerewolfFlatPdf } from '../../lib/generateWerewolfFlatPdf'

const WEREWOLF = SYSTEMS.find((s) => s.id === 'lobisomem')!

const ATTRIBUTE_POOL = 7 + 5 + 3
const SKILL_POOL = 4 + 8 + 4

const makeTraits = (labels: string[], base: number): DotTrait[] =>
  labels.map((label) => ({ label, value: base }))

const makeGiftSlot = (): DotTrait => ({ label: '', value: 1 })

const initialData: WerewolfSheetData = {
  header: {
    name: '',
    player: '',
    chronicle: '',
    tribe: '',
    auspice: '',
    patron: '',
    concept: '',
    ambition: '',
    desire: '',
  },
  attributes: {
    physical: makeTraits(['Força', 'Destreza', 'Vigor'], 1),
    social: makeTraits(['Carisma', 'Manipulação', 'Compostura'], 1),
    mental: makeTraits(['Inteligência', 'Raciocínio', 'Determinação'], 1),
  },
  skills: {
    physical: makeTraits(
      ['Atletismo', 'Briga', 'Condução', 'Furtividade', 'Armas Brancas', 'Armas de Fogo', 'Ofícios', 'Larceny', 'Esportes'],
      0
    ),
    social: makeTraits(
      ['Empatia', 'Expressão', 'Intimidação', 'Liderança', 'Performance', 'Persuasão', 'Subterfúgio'],
      0
    ),
    mental: makeTraits(
      ['Acadêmicos', 'Awareness', 'Finanças', 'Investigação', 'Medicina', 'Ocultismo', 'Política', 'Ciência', 'Tecnologia'],
      0
    ),
  },
  gifts: {
    tribe: [makeGiftSlot()],
    auspice: [makeGiftSlot()],
    general: [makeGiftSlot()],
  },
  renownGlory: 0,
  renownHonor: 0,
  renownWisdom: 0,
  rage: 1,
  // W5's Health track has Vigor + 3 boxes; attributes start at 1, so 1 + 3 = 4 boxes.
  health: Array.from({ length: 1 + 3 }, () => HEALTH_EMPTY),
  willpowerPermanent: 1,
  willpowerTemporary: 1,
  harmony: 5,
  xpTotal: 0,
  xpSpent: 0,
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

const GIFT_CATEGORY_LABELS: Record<keyof WerewolfSheetData['gifts'], string> = {
  tribe: 'Dons de Tribo',
  auspice: 'Dons de Auspício',
  general: 'Dons Gerais',
}

export default function WerewolfSheet() {
  const [data, setData] = useState<WerewolfSheetData>(initialData)
  const [exporting, setExporting] = useState<ExportKind | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalState, setModalState] = useState<WerewolfQuickReferenceModalState | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const vigorValue = data.attributes.physical.find((t) => t.label === 'Vigor')?.value ?? 1

  // W5's Health track always has Vigor + 3 boxes — resize it whenever Vigor changes, keeping
  // existing damage marks and padding/truncating from the end.
  useEffect(() => {
    const desiredLength = vigorValue + 3
    setData((d) => {
      if (d.health.length === desiredLength) return d
      const health: HealthBoxState[] =
        d.health.length < desiredLength
          ? [...d.health, ...Array<HealthBoxState>(desiredLength - d.health.length).fill(HEALTH_EMPTY)]
          : d.health.slice(0, desiredLength)
      return { ...d, health }
    })
  }, [vigorValue])

  const updateHeader = (field: keyof WerewolfSheetData['header'], value: string) =>
    setData((d) => ({ ...d, header: { ...d.header, [field]: value } }))

  const updateGroupTrait = (
    section: 'attributes' | 'skills',
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

  const updateHealth = (health: HealthBoxState[]) => setData((d) => ({ ...d, health }))

  const updateGift = (category: keyof WerewolfSheetData['gifts'], index: number, value: number) =>
    setData((d) => ({
      ...d,
      gifts: { ...d.gifts, [category]: d.gifts[category].map((g, i) => (i === index ? { ...g, value } : g)) },
    }))

  const renameGift = (category: keyof WerewolfSheetData['gifts'], index: number, label: string) =>
    setData((d) => ({
      ...d,
      gifts: { ...d.gifts, [category]: d.gifts[category].map((g, i) => (i === index ? { ...g, label } : g)) },
    }))

  const addGift = (category: keyof WerewolfSheetData['gifts']) =>
    setData((d) => ({ ...d, gifts: { ...d.gifts, [category]: [...d.gifts[category], makeGiftSlot()] } }))

  const removeGift = (category: keyof WerewolfSheetData['gifts'], index: number) =>
    setData((d) => ({ ...d, gifts: { ...d.gifts, [category]: d.gifts[category].filter((_, i) => i !== index) } }))

  const sumPoints = (traits: DotTrait[], base: number) =>
    traits.reduce((acc, t) => acc + (t.value - base), 0)

  const attributePoints =
    sumPoints(data.attributes.physical, 1) +
    sumPoints(data.attributes.social, 1) +
    sumPoints(data.attributes.mental, 1)

  const skillPoints =
    sumPoints(data.skills.physical, 0) +
    sumPoints(data.skills.social, 0) +
    sumPoints(data.skills.mental, 0)

  const downloadPdf = (bytes: Uint8Array, suffix: string) => {
    const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const fileName = data.header.name.trim() || 'personagem'
    const link = document.createElement('a')
    link.href = url
    link.download = `ficha-lobisomem-${fileName.toLowerCase().replace(/\s+/g, '-')}-${suffix}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = async (kind: ExportKind) => {
    setExporting(kind)
    try {
      if (kind === 'editavel') {
        downloadPdf(await generateWerewolfPdf(data), 'editavel')
      } else {
        if (!sheetRef.current) return
        downloadPdf(await generateWerewolfFlatPdf(sheetRef.current), 'fixa')
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
          '--system-color': WEREWOLF.color,
          '--system-glow': WEREWOLF.colorGlow,
        } as React.CSSProperties
      }
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-[45] border-b border-wod-border bg-wod-bg/95 backdrop-blur-sm px-6 py-4">
        <div className="container mx-auto max-w-6xl flex items-center justify-between gap-4 flex-nowrap overflow-x-auto">
          <div className="shrink-0 whitespace-nowrap">
            <p
              className="font-cinzel text-[10px] tracking-[0.4em] uppercase"
              style={{ color: WEREWOLF.color }}
            >
              Criador de Fichas
            </p>
            <h1 className="font-cinzel text-lg font-semibold text-wod-text">{WEREWOLF.name}</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Link
              to="/sistemas/lobisomem"
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
                borderColor: sidebarOpen ? WEREWOLF.color : '#2a2a3a',
                color: sidebarOpen ? WEREWOLF.color : '#8a8090',
              }}
            >
              ?
            </button>
            <ExportMenu color={WEREWOLF.color} exporting={exporting} onExport={handleExport} />
          </div>
        </div>
      </div>

      {/* ── Sheet ────────────────────────────────────────────────────────── */}
      <div ref={sheetRef} className={`bg-wod-bg transition-[margin] duration-300 ease-in-out ${sidebarOpen ? 'lg:mr-96' : ''}`}>
        <div className="h-1.5" style={{ backgroundColor: WEREWOLF.color }} />

        <div className="container mx-auto max-w-6xl px-6 py-10 space-y-6">
          {/* Header fields */}
          <SectionCard
            title="Cabeçalho"
            subtitle="Quem é seu Garou"
            right={
              <ReferenceButton
                className="lg:hidden"
                label="Referência: Tribos"
                onClick={() => setModalState({ title: 'Tribos', topics: ['tribes'] })}
              />
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TextField id="name" label="Nome do Personagem" value={data.header.name} onChange={(v) => updateHeader('name', v)} />
              <TextField id="player" label="Jogador" value={data.header.player} onChange={(v) => updateHeader('player', v)} />
              <TextField id="chronicle" label="Crônica" value={data.header.chronicle} onChange={(v) => updateHeader('chronicle', v)} />
              <TextField id="tribe" label="Tribo" value={data.header.tribe} onChange={(v) => updateHeader('tribe', v)} />
              <TextField id="auspice" label="Auspício" value={data.header.auspice} onChange={(v) => updateHeader('auspice', v)} />
              <TextField id="patron" label="Patrono (Espírito Tótem)" value={data.header.patron} onChange={(v) => updateHeader('patron', v)} />
              <TextField id="concept" label="Conceito" value={data.header.concept} onChange={(v) => updateHeader('concept', v)} />
              <TextField id="ambition" label="Ambição" value={data.header.ambition} onChange={(v) => updateHeader('ambition', v)} />
              <TextField id="desire" label="Desejo" value={data.header.desire} onChange={(v) => updateHeader('desire', v)} />
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
                  <h3 className="font-cinzel text-xs tracking-widest uppercase mb-3" style={{ color: WEREWOLF.color }}>
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

          {/* Skills */}
          <SectionCard
            title="Perícias"
            subtitle="4 / 8 / 4 pontos, distribua entre os três grupos"
            right={<PointCounter used={skillPoints} total={SKILL_POOL} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(
                [
                  ['physical', 'Físico', data.skills.physical],
                  ['social', 'Social', data.skills.social],
                  ['mental', 'Mental', data.skills.mental],
                ] as const
              ).map(([key, label, traits]) => (
                <div key={key}>
                  <h3 className="font-cinzel text-xs tracking-widest uppercase mb-3" style={{ color: WEREWOLF.color }}>
                    {label}
                  </h3>
                  <div className="divide-y divide-wod-border/50">
                    {traits.map((trait, i) => (
                      <DotRow
                        key={trait.label}
                        trait={trait}
                        min={0}
                        max={5}
                        onChange={(v) => updateGroupTrait('skills', key, i, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Gifts */}
          <SectionCard
            title="Dons"
            subtitle="Cada Dom é um poder aprendido — adicione conforme seu Garou evolui"
            right={
              <ReferenceButton
                className="lg:hidden"
                label="Referência: Auspícios"
                onClick={() => setModalState({ title: 'Auspícios', topics: ['auspices'] })}
              />
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(Object.keys(GIFT_CATEGORY_LABELS) as (keyof WerewolfSheetData['gifts'])[]).map((category) => (
                <div key={category}>
                  <h3 className="font-cinzel text-xs tracking-widest uppercase mb-3" style={{ color: WEREWOLF.color }}>
                    {GIFT_CATEGORY_LABELS[category]}
                  </h3>
                  <div className="space-y-2">
                    {data.gifts[category].map((gift, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={gift.label}
                          onChange={(e) => renameGift(category, i, e.target.value)}
                          placeholder="Nome do Dom"
                          aria-label="Nome do Dom"
                          className="flex-1 min-w-[110px] bg-wod-bg border border-wod-border rounded px-2 py-1.5 text-wod-text font-crimson text-sm focus:outline-none focus:border-[var(--system-color)] transition-colors"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <DotRating value={gift.value} max={5} min={1} onChange={(v) => updateGift(category, i, v)} label={gift.label || 'Dom'} />
                          <button
                            type="button"
                            onClick={() => removeGift(category, i)}
                            aria-label={`Remover ${gift.label || 'Dom'}`}
                            className="font-cinzel text-[10px] text-wod-muted hover:text-red-400 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addGift(category)}
                      className="font-cinzel text-xs tracking-widest uppercase mt-2"
                      style={{ color: WEREWOLF.color }}
                    >
                      + Adicionar Dom
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Forms */}
          <SectionCard title="Formas" subtitle="As Cinco Formas do Garou">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FORMS_REFERENCE.map((form) => (
                <div
                  key={form.name}
                  className="bg-wod-bg rounded p-4 border border-wod-border border-l-[3px]"
                  style={{ borderLeftColor: WEREWOLF.color }}
                >
                  <h3 className="font-cinzel text-sm font-semibold mb-1.5" style={{ color: WEREWOLF.color }}>
                    {form.name}
                  </h3>
                  <p className="font-crimson text-sm text-wod-muted leading-relaxed">{form.description}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Health */}
          <SectionCard title="Saúde" subtitle="Caixas de saúde = Vigor + 3">
            <WerewolfHealthTrack value={data.health} onChange={updateHealth} />
          </SectionCard>

          {/* Advantages */}
          <SectionCard
            title="Vantagens"
            right={
              <ReferenceButton
                className="lg:hidden"
                label="Referência: Harmonia"
                onClick={() => setModalState({ title: 'Harmonia', topics: ['harmony'] })}
              />
            }
          >
            <div className="space-y-8">
              <div>
                <h3 className="font-cinzel text-xs tracking-widest uppercase text-wod-muted mb-3">Renome</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {(
                    [
                      ['renownGlory', 'Glória', data.renownGlory],
                      ['renownHonor', 'Honra', data.renownHonor],
                      ['renownWisdom', 'Sabedoria', data.renownWisdom],
                    ] as const
                  ).map(([key, label, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-cinzel text-sm font-semibold" style={{ color: WEREWOLF.color }}>
                          {label}
                        </h4>
                        <span
                          className="font-cinzel text-2xl font-bold"
                          style={{ color: WEREWOLF.color, textShadow: `0 0 20px ${WEREWOLF.colorGlow}` }}
                        >
                          {value}
                        </span>
                      </div>
                      <DotRating
                        value={value}
                        max={10}
                        min={0}
                        onChange={(v) => setData((d) => ({ ...d, [key]: v }))}
                        label={label}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cinzel text-sm font-semibold" style={{ color: WEREWOLF.color }}>
                    Harmonia
                  </h3>
                  <span
                    className="font-cinzel text-2xl font-bold"
                    style={{ color: WEREWOLF.color, textShadow: `0 0 20px ${WEREWOLF.colorGlow}` }}
                  >
                    {data.harmony}
                  </span>
                </div>
                <DotRating
                  value={data.harmony}
                  max={10}
                  min={0}
                  size="lg"
                  onChange={(v) => setData((d) => ({ ...d, harmony: v }))}
                  label="Harmonia"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cinzel text-xs tracking-widest uppercase text-wod-muted">Raiva</h3>
                  <ReferenceButton
                    className="lg:hidden"
                    label="Referência: Raiva"
                    onClick={() => setModalState({ title: 'Raiva', topics: ['rage'] })}
                  />
                </div>
                <RageTrack value={data.rage} onChange={(v) => setData((d) => ({ ...d, rage: v }))} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="xpTotal" className="block font-cinzel text-[10px] tracking-widest uppercase text-wod-muted mb-1.5">
                    XP Total
                  </label>
                  <input
                    id="xpTotal"
                    type="number"
                    min={0}
                    value={data.xpTotal}
                    onChange={(e) => setData((d) => ({ ...d, xpTotal: Number(e.target.value) }))}
                    className="w-full bg-wod-bg border border-wod-border rounded px-3 py-2 text-wod-text font-crimson text-base focus:outline-none focus:border-[var(--system-color)] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="xpSpent" className="block font-cinzel text-[10px] tracking-widest uppercase text-wod-muted mb-1.5">
                    XP Gasto
                  </label>
                  <input
                    id="xpSpent"
                    type="number"
                    min={0}
                    value={data.xpSpent}
                    onChange={(e) => setData((d) => ({ ...d, xpSpent: Number(e.target.value) }))}
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
          <SectionCard title="Histórico & Anotações">
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
          </SectionCard>
        </div>
      </div>

      <WerewolfQuickReferenceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <WerewolfQuickReferenceModal state={modalState} onClose={() => setModalState(null)} />
    </div>
  )
}
