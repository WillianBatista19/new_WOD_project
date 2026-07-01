import {
  AppearanceProviderFor,
  PDFCheckBox,
  PDFDocument,
  PDFFont,
  PDFForm,
  PDFHexString,
  PDFName,
  PDFPage,
  StandardFonts,
  degrees,
  drawEllipse,
  drawLine,
  drawRectangle,
  rgb,
} from 'pdf-lib'
import { DotTrait, MageSheetData } from '../types'
import { SYSTEMS } from '../data/systems'
import { HEALTH_LEVELS, groupHealthLevels, healthPenaltyLabel, healthHasPenalty } from '../data/health'

const MAGE = SYSTEMS.find((s) => s.id === 'mago')!

const hexToRgb01 = (hex: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return { r: 0, g: 0, b: 0 }
  return { r: parseInt(m[1], 16) / 255, g: parseInt(m[2], 16) / 255, b: parseInt(m[3], 16) / 255 }
}

const toRgb = (hex: string) => {
  const { r, g, b } = hexToRgb01(hex)
  return rgb(r, g, b)
}

// Mago: A Ascensão palette (see CLAUDE.md — dark background, purple accent)
const COLORS = {
  bg: toRgb('#0a0a0f'),
  card: toRgb('#111118'),
  text: toRgb('#e8e0d0'),
  muted: toRgb('#8a8090'),
  border: toRgb('#2a2a3a'),
  accent: toRgb(MAGE.color),
  danger: rgb(0.9, 0.35, 0.35),
}

const ACCENTS: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
}

// Strips accents and produces a clean snake_case identifier, e.g. "Força" -> "forca".
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[áàâãäéèêëíìîïóòôõöúùûüçñ]/g, (ch) => ACCENTS[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

// PDF field names must be unique across the whole AcroForm (text fields, radio groups, and
// checkboxes all share one namespace). Every field name — whatever kind — is reserved here.
const usedFieldNames = new Set<string>()
function reserveFieldName(base: string): string {
  let name = base
  let n = 2
  while (usedFieldNames.has(name)) {
    name = `${base}_dup${n}`
    n += 1
  }
  usedFieldNames.add(name)
  return name
}

// Every trait dot is its own independent PDFCheckBox (never a radio group — some readers
// render custom radio appearance streams as toggle switches or overlapping widgets instead
// of plain circles). Checked = filled purple circle; unchecked = empty outlined circle.
// Field size and geometry are fixed regardless of caller (12x12pt box, 14pt center spacing).
const DOT_CHECKBOX_SIZE = 12
const DOT_CHECKBOX_SPACING = 14

const checkboxDotAppearanceProvider: AppearanceProviderFor<PDFCheckBox> = (_checkBox, widget) => {
  const { width, height } = widget.getRectangle()
  const radius = Math.min(width, height) / 2 - 0.5
  const cx = width / 2
  const cy = height / 2
  const off = drawEllipse({ x: cx, y: cy, xScale: radius, yScale: radius, color: undefined, borderColor: COLORS.border, borderWidth: 1 })
  const on = drawEllipse({ x: cx, y: cy, xScale: radius, yScale: radius, color: COLORS.accent, borderColor: COLORS.accent, borderWidth: 1 })
  return { normal: { on, off } }
}

// Filled dark square + X mark when checked; empty outline square when unchecked.
const healthCheckboxAppearanceProvider: AppearanceProviderFor<PDFCheckBox> = (_checkBox, widget) => {
  const { width, height } = widget.getRectangle()
  const rectBase = { x: 0, y: 0, width, height, rotate: degrees(0), xSkew: degrees(0), ySkew: degrees(0) }
  const off = drawRectangle({ ...rectBase, color: COLORS.card, borderColor: COLORS.border, borderWidth: 1 })
  const inset = Math.min(width, height) * 0.24
  const on = [
    ...drawRectangle({ ...rectBase, color: COLORS.card, borderColor: COLORS.accent, borderWidth: 1 }),
    ...drawLine({ start: { x: inset, y: inset }, end: { x: width - inset, y: height - inset }, thickness: 1.3, color: COLORS.accent }),
    ...drawLine({ start: { x: inset, y: height - inset }, end: { x: width - inset, y: inset }, thickness: 1.3, color: COLORS.accent }),
  ]
  return { normal: { on, off } }
}

const PAGE_WIDTH = 595.28 // A4 portrait, points
const PAGE_HEIGHT = 841.89
const MARGIN = 40
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const TOP_BAR_HEIGHT = 8

class PdfCanvas {
  doc: PDFDocument
  font: PDFFont
  fontBold: PDFFont
  page!: PDFPage
  y = 0

  constructor(doc: PDFDocument, font: PDFFont, fontBold: PDFFont) {
    this.doc = doc
    this.font = font
    this.fontBold = fontBold
    this.addPage()
  }

  addPage() {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLORS.bg })
    this.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - TOP_BAR_HEIGHT,
      width: PAGE_WIDTH,
      height: TOP_BAR_HEIGHT,
      color: COLORS.accent,
    })
    this.y = PAGE_HEIGHT - TOP_BAR_HEIGHT - MARGIN
  }

  // Reserves `height` points of vertical space, starting a new page first if it doesn't fit.
  // Every block MUST call this with its full height before drawing anything, so content
  // never gets cut mid-block across a page boundary.
  ensureSpace(height: number) {
    if (this.y - height < MARGIN) this.addPage()
  }

  text(str: string, x: number, y: number, opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb> } = {}) {
    this.page.drawText(str, {
      x,
      y,
      size: opts.size ?? 9,
      font: opts.bold ? this.fontBold : this.font,
      color: opts.color ?? COLORS.text,
    })
  }

  rect(x: number, y: number, width: number, height: number, opts: { fill?: ReturnType<typeof rgb>; border?: ReturnType<typeof rgb> } = {}) {
    this.page.drawRectangle({
      x,
      y,
      width,
      height,
      color: opts.fill,
      borderColor: opts.border,
      borderWidth: opts.border ? 0.75 : 0,
    })
  }

  line(x1: number, y1: number, x2: number, y2: number) {
    this.page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 0.5, color: COLORS.border })
  }

}

function sectionTitle(canvas: PdfCanvas, title: string, subtitle?: string) {
  const height = subtitle ? 34 : 24
  canvas.ensureSpace(height)
  canvas.text(title.toUpperCase(), MARGIN, canvas.y - 10, { size: 12, bold: true, color: COLORS.accent })
  canvas.y -= subtitle ? 16 : 14
  if (subtitle) {
    canvas.text(subtitle, MARGIN, canvas.y - 8, { size: 7.5, color: COLORS.muted })
    canvas.y -= 12
  }
  canvas.line(MARGIN, canvas.y, PAGE_WIDTH - MARGIN, canvas.y)
  canvas.y -= 12
}

// Draws a fillable text field anchored at an explicit top-left position, independent of canvas.y.
let blankFieldCounter = 0
function textFieldAt(
  canvas: PdfCanvas,
  form: PDFForm,
  label: string,
  value: string,
  x: number,
  topY: number,
  width: number,
  height: number,
  opts: { multiline?: boolean; fontSize?: number; name?: string; readOnly?: boolean; textColor?: ReturnType<typeof rgb> } = {}
) {
  if (label) canvas.text(label.toUpperCase(), x, topY - 7, { size: 6.5, color: COLORS.muted })
  const fieldTop = topY - (label ? 11 : 0)
  const fieldY = fieldTop - height
  canvas.rect(x, fieldY, width, height, { fill: COLORS.card, border: COLORS.border })

  blankFieldCounter += 1
  const base = opts.name ?? (label ? slugify(label) : `field_${blankFieldCounter}`)
  const field = form.createTextField(reserveFieldName(base))
  if (opts.multiline) field.enableMultiline()
  // addToPage must run first — it's what establishes the field's default appearance (DA),
  // which setFontSize/setText need in order to re-render the field's appearance stream.
  field.addToPage(canvas.page, {
    x,
    y: fieldY,
    width,
    height,
    textColor: opts.textColor ?? COLORS.text,
    backgroundColor: COLORS.card,
    borderWidth: 0,
    font: canvas.font,
  })
  field.setFontSize(opts.fontSize ?? (opts.multiline ? 9 : 9.5))
  field.setText(value)
  if (opts.readOnly) field.enableReadOnly()
  return field
}

function dotCheckboxRowWidth(max: number): number {
  return (max - 1) * DOT_CHECKBOX_SPACING + DOT_CHECKBOX_SIZE
}

// Attaches a mouse-up JavaScript action to a field's (first) widget. Acrobat/Reader-only —
// viewers that don't execute PDF JavaScript (Preview, Chrome's built-in viewer, Firefox/pdf.js)
// simply won't run it; the checkbox still works as a plain independent toggle there.
function attachMouseUpJs(doc: PDFDocument, field: PDFCheckBox, script: string) {
  const widget = field.acroField.getWidgets()[0]
  const jsAction = doc.context.obj({ Type: 'Action', S: 'JavaScript', JS: PDFHexString.fromText(script) })
  widget.dict.set(PDFName.of('AA'), doc.context.obj({ U: jsAction }))
}

// Checking dot `idx` (0-based) forces every lower-numbered dot checked; unchecking it forces
// every higher-numbered dot unchecked — the cumulative "fill up to N" behavior, driven by
// Acrobat JS instead of a radio group (radio appearance streams rendered as toggle switches /
// overlapping widgets in some readers).
function cumulativeFillScript(names: string[], idx: number): string {
  const lines = [`var f = this.getField("${names[idx]}");`, `if (f.value !== "Off") {`]
  names.slice(0, idx).forEach((n) => lines.push(`  this.getField("${n}").checkThisBox(0, true);`))
  lines.push(`} else {`)
  names.slice(idx + 1).forEach((n) => lines.push(`  this.getField("${n}").checkThisBox(0, false);`))
  lines.push(`}`)
  return lines.join('\n')
}

// Interactive dots: `max` independent PDFCheckBoxes named "<slug>_1".."<slug>_<max>", one per
// dot, each wired with a mouseUp JS action (see `cumulativeFillScript`) so checking dot N in
// Acrobat also fills dots 1..N-1, and unchecking it clears N+1..max.
// `x` is the left edge of the whole row (dot 1's left edge), matching `dotCheckboxRowWidth`
// for right-alignment math at call sites — not the center of dot 1.
function checkboxDotsAt(canvas: PdfCanvas, form: PDFForm, slug: string, x: number, y: number, value: number, max: number) {
  const names = Array.from({ length: max }, (_, i) => reserveFieldName(`${slug}_${i + 1}`))
  names.forEach((name, idx) => {
    const i = idx + 1
    const cx = x + DOT_CHECKBOX_SIZE / 2 + (i - 1) * DOT_CHECKBOX_SPACING
    const checkBox = form.createCheckBox(name)
    checkBox.addToPage(canvas.page, {
      x: cx - DOT_CHECKBOX_SIZE / 2,
      y: y - DOT_CHECKBOX_SIZE / 2,
      width: DOT_CHECKBOX_SIZE,
      height: DOT_CHECKBOX_SIZE,
      borderWidth: 0,
    })
    checkBox.updateAppearances(checkboxDotAppearanceProvider)
    if (i <= value) checkBox.check()
    attachMouseUpJs(canvas.doc, checkBox, cumulativeFillScript(names, idx))
  })
  return dotCheckboxRowWidth(max)
}

function traitRowAt(canvas: PdfCanvas, form: PDFForm, x: number, width: number, y: number, trait: DotTrait, max: number) {
  canvas.text(trait.label, x, y, { size: 8 })
  const dotsWidth = dotCheckboxRowWidth(max)
  checkboxDotsAt(canvas, form, slugify(trait.label), x + width - dotsWidth, y - 2.5, trait.value, max)
}

// Three named columns with an equal row count (Attributes, Abilities) — safe to treat as one
// atomic block since every column is exactly the same height, so it never splits mid-column.
function traitColumns(canvas: PdfCanvas, form: PDFForm, columns: { label: string; traits: DotTrait[] }[], max: number) {
  const rowCount = Math.max(...columns.map((c) => c.traits.length))
  const rowHeight = 13
  const headerHeight = columns.some((c) => c.label) ? 14 : 0
  const blockHeight = headerHeight + rowCount * rowHeight + 4
  canvas.ensureSpace(blockHeight)
  const startY = canvas.y
  const colWidth = CONTENT_WIDTH / columns.length
  columns.forEach((col, ci) => {
    const x = MARGIN + ci * colWidth
    let rowY = startY
    if (col.label) {
      canvas.text(col.label.toUpperCase(), x, rowY - 8, { size: 8, bold: true, color: COLORS.accent })
      rowY -= headerHeight
    }
    col.traits.forEach((trait) => {
      traitRowAt(canvas, form, x, colWidth - 8, rowY - 8, trait, max)
      rowY -= rowHeight
    })
  })
  canvas.y = startY - blockHeight
}

// Recomputes the highest currently-marked wound level across all health checkboxes and writes
// its consolidated label into the read-only "health_penalty_display" field. Attached to every
// health checkbox's mouseUp so the display stays in sync with whichever box was just (un)checked.
// Each box's display string is precomputed in TS via `healthPenaltyLabel` (shared with the web
// UI) rather than re-deriving the label-bucketing logic in JavaScript — one source of truth.
function healthPenaltyScript(boxes: { name: string; display: string }[]): string {
  const entries = boxes.map((b) => `["${b.name}", "${b.display}"]`).join(', ')
  return [
    `var levels = [${entries}];`,
    `var highest = -1;`,
    `for (var i = 0; i < levels.length; i++) {`,
    `  var f = this.getField(levels[i][0]);`,
    `  if (f && f.value !== "Off") highest = i;`,
    `}`,
    `var display = this.getField("health_penalty_display");`,
    `display.value = highest === -1 ? "${healthPenaltyLabel(null)}" : levels[highest][1];`,
  ].join('\n')
}

function healthBlock(canvas: PdfCanvas, form: PDFForm, health: boolean[]) {
  const rows = groupHealthLevels(HEALTH_LEVELS)
  const rowHeight = 14
  const blockHeight = rows.length * rowHeight + 22
  canvas.ensureSpace(blockHeight)
  const startY = canvas.y

  const boxes: { checkBox: PDFCheckBox; name: string; display: string }[] = []

  let rowY = startY - 8
  rows.forEach((row) => {
    canvas.text(row.label, MARGIN, rowY, { size: 8.5 })
    canvas.text(row.penalty === '0' ? '—' : row.penalty, MARGIN + 140, rowY, { size: 7.5, color: COLORS.muted })
    const rowSlug = slugify(row.label)
    row.boxIndexes.forEach((index, i) => {
      const name = reserveFieldName(row.boxIndexes.length > 1 ? `health_${rowSlug}_${i + 1}` : `health_${rowSlug}`)
      const checkBox = form.createCheckBox(name)
      checkBox.addToPage(canvas.page, { x: MARGIN + 190 + i * 16, y: rowY - 6, width: 9, height: 9, borderWidth: 0 })
      checkBox.updateAppearances(healthCheckboxAppearanceProvider)
      if (health[index]) checkBox.check()
      boxes.push({ checkBox, name, display: healthPenaltyLabel(HEALTH_LEVELS[index]) })
    })
    rowY -= rowHeight
  })

  const highestFilled = health.reduce((acc, filled, i) => (filled ? i : acc), -1)
  const currentLevel = highestFilled >= 0 ? HEALTH_LEVELS[highestFilled] : null
  rowY -= 6
  canvas.line(MARGIN, rowY + 4, PAGE_WIDTH - MARGIN, rowY + 4)
  canvas.text('PENALIDADE ATUAL', MARGIN, rowY - 6, { size: 7.5, color: COLORS.muted })
  // Name is hardcoded (not slugified from a label) because the mouseUp scripts below reference
  // it by this exact literal string.
  textFieldAt(
    canvas,
    form,
    '',
    healthPenaltyLabel(currentLevel),
    MARGIN + 140,
    rowY + 6,
    160,
    14,
    { name: 'health_penalty_display', readOnly: true, fontSize: 8.5, textColor: healthHasPenalty(currentLevel) ? COLORS.danger : COLORS.text }
  )

  const script = healthPenaltyScript(boxes.map((b) => ({ name: b.name, display: b.display })))
  boxes.forEach((b) => attachMouseUpJs(canvas.doc, b.checkBox, script))

  canvas.y = startY - blockHeight
}

export async function generateMagePdf(data: MageSheetData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(`Ficha de Personagem — ${data.header.name || 'Mago: A Ascensão'}`)
  doc.setSubject('Mago: A Ascensão (M20) — Ficha de Personagem')

  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const form = doc.getForm()
  const canvas = new PdfCanvas(doc, font, fontBold)

  // ── Cover header ─────────────────────────────────────────────────────────
  canvas.ensureSpace(20)
  canvas.text('MAGO: A ASCENSÃO', MARGIN, canvas.y - 10, { size: 16, bold: true, color: COLORS.accent })
  canvas.text('Ficha de Personagem — 20th Anniversary Edition', MARGIN, canvas.y - 24, { size: 8, color: COLORS.muted })
  canvas.y -= 34

  // ── Header fields ────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Cabeçalho', 'Quem é seu Desperto')
  {
    const fields: { label: string; value: string }[] = [
      { label: 'Nome do Personagem', value: data.header.name },
      { label: 'Jogador', value: data.header.player },
      { label: 'Crônica', value: data.header.chronicle },
      { label: 'Tradição', value: data.header.tradition },
      { label: 'Essência', value: data.header.essence },
      { label: 'Conceito', value: data.header.concept },
      { label: 'Natureza', value: data.header.nature },
      { label: 'Comportamento', value: data.header.demeanor },
    ]
    const cols = 4
    const gap = 8
    const colWidth = (CONTENT_WIDTH - gap * (cols - 1)) / cols
    const rowHeight = 34
    const rows = Math.ceil(fields.length / cols)
    canvas.ensureSpace(rows * rowHeight)
    const startY = canvas.y
    fields.forEach((f, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = MARGIN + col * (colWidth + gap)
      const topY = startY - row * rowHeight
      textFieldAt(canvas, form, f.label, f.value, x, topY, colWidth, 18)
    })
    canvas.y = startY - rows * rowHeight
  }

  // ── Attributes ───────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Atributos', '7 / 5 / 3 pontos, distribuídos entre os três grupos')
  traitColumns(
    canvas,
    form,
    [
      { label: 'Físico', traits: data.attributes.physical },
      { label: 'Social', traits: data.attributes.social },
      { label: 'Mental', traits: data.attributes.mental },
    ],
    5
  )
  canvas.y -= 10

  // ── Abilities ────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Habilidades', '13 / 9 / 5 pontos, distribuídos entre os três grupos')
  traitColumns(
    canvas,
    form,
    [
      { label: 'Talentos', traits: data.abilities.talents },
      { label: 'Perícias', traits: data.abilities.skills },
      { label: 'Conhecimentos', traits: data.abilities.knowledges },
    ],
    5
  )
  canvas.y -= 10

  // ── Spheres ──────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Esferas', `Nenhuma Esfera pode exceder o Arete (${data.arete})`)
  {
    const chunkSize = Math.ceil(data.spheres.length / 3)
    const columns = [0, 1, 2].map((i) => ({
      label: '',
      traits: data.spheres.slice(i * chunkSize, i * chunkSize + chunkSize),
    }))
    traitColumns(canvas, form, columns, 5)
  }
  canvas.y -= 10

  // ── Backgrounds ──────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Antecedentes')
  {
    const rowHeight = 24
    data.backgrounds.forEach((bg) => {
      canvas.ensureSpace(rowHeight)
      const fieldWidth = 260
      textFieldAt(canvas, form, '', bg.label, MARGIN, canvas.y, fieldWidth, 16)
      checkboxDotsAt(canvas, form, `antecedente_${slugify(bg.label)}`, MARGIN + fieldWidth + 20, canvas.y - 12, bg.value, 5)
      canvas.y -= rowHeight
    })
  }

  // ── Health ───────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Saúde', 'Níveis de dano — a penalidade é calculada pelo nível mais alto marcado')
  healthBlock(canvas, form, data.health)
  canvas.y -= 10

  // ── Advantages ───────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Vantagens')
  {
    canvas.ensureSpace(30)
    canvas.text('ARETE', MARGIN, canvas.y - 8, { size: 9, bold: true, color: COLORS.accent })
    canvas.text(String(data.arete), MARGIN + 50, canvas.y - 10, { size: 13, bold: true, color: COLORS.accent })
    checkboxDotsAt(canvas, form, 'arete', MARGIN + 90, canvas.y - 8, data.arete, 10)
    canvas.y -= 30

    canvas.ensureSpace(38)
    const halfWidth = (CONTENT_WIDTH - 16) / 2
    textFieldAt(canvas, form, 'Quintessência', String(data.quintessence), MARGIN, canvas.y, halfWidth, 18)
    textFieldAt(canvas, form, 'Paradoxo', String(data.paradox), MARGIN + halfWidth + 16, canvas.y, halfWidth, 18)
    canvas.y -= 38

    canvas.ensureSpace(30)
    canvas.text('FORÇA DE VONTADE — PERMANENTE', MARGIN, canvas.y - 6, { size: 6.5, color: COLORS.muted })
    checkboxDotsAt(canvas, form, 'forca_de_vontade_permanente', MARGIN, canvas.y - 18, data.willpowerPermanent, 10)
    canvas.text('FORÇA DE VONTADE — TEMPORÁRIA', MARGIN + halfWidth + 16, canvas.y - 6, { size: 6.5, color: COLORS.muted })
    checkboxDotsAt(canvas, form, 'forca_de_vontade_temporaria', MARGIN + halfWidth + 16, canvas.y - 18, data.willpowerTemporary, 10)
    canvas.y -= 30
  }

  // ── Free text ────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Foco Mágico & Histórico')
  {
    const focusHeight = 44
    canvas.ensureSpace(focusHeight + 12)
    textFieldAt(canvas, form, 'Foco Mágico (Paradigma & Instrumentos)', data.magicalFocus, MARGIN, canvas.y, CONTENT_WIDTH, focusHeight - 11, { multiline: true })
    canvas.y -= focusHeight + 6

    const notesHeight = 90
    canvas.ensureSpace(notesHeight + 12)
    textFieldAt(canvas, form, 'Histórico & Anotações', data.notes, MARGIN, canvas.y, CONTENT_WIDTH, notesHeight - 11, { multiline: true })
    canvas.y -= notesHeight
  }

  return doc.save()
}
