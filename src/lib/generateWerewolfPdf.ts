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
import { DotTrait } from '../types'
import { HealthBoxState, WerewolfSheetData } from '../types/werewolf'
import { SYSTEMS } from '../data/systems'
import { werewolfHealthPenalty } from '../data/werewolfHealth'
import { FORMS_REFERENCE } from '../data/werewolfReference'

const WEREWOLF = SYSTEMS.find((s) => s.id === 'lobisomem')!

const hexToRgb01 = (hex: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!m) return { r: 0, g: 0, b: 0 }
  return { r: parseInt(m[1], 16) / 255, g: parseInt(m[2], 16) / 255, b: parseInt(m[3], 16) / 255 }
}

const toRgb = (hex: string) => {
  const { r, g, b } = hexToRgb01(hex)
  return rgb(r, g, b)
}

// Lobisomem: O Apocalipse palette (see CLAUDE.md — dark background, green accent)
const COLORS = {
  bg: toRgb('#0a0a0f'),
  card: toRgb('#111118'),
  text: toRgb('#e8e0d0'),
  muted: toRgb('#8a8090'),
  border: toRgb('#2a2a3a'),
  accent: toRgb(WEREWOLF.color),
  danger: rgb(0.9, 0.35, 0.35),
  // Aggravated damage is always red, regardless of the system's own accent color — matches
  // WerewolfHealthTrack.tsx's hardcoded "#c41e3a", the same universal WoD danger red V5 uses.
  aggravated: toRgb('#c41e3a'),
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
// of plain circles). Checked = filled green circle; unchecked = empty outlined circle.
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

// Plain filled square, no mark — used for Raiva, matching RageTrack.tsx's on-screen boxes.
const rageCheckboxAppearanceProvider: AppearanceProviderFor<PDFCheckBox> = (_checkBox, widget) => {
  const { width, height } = widget.getRectangle()
  const rectBase = { x: 0, y: 0, width, height, rotate: degrees(0), xSkew: degrees(0), ySkew: degrees(0) }
  const off = drawRectangle({ ...rectBase, color: undefined, borderColor: COLORS.border, borderWidth: 1 })
  const on = drawRectangle({ ...rectBase, color: COLORS.accent, borderColor: COLORS.accent, borderWidth: 1 })
  return { normal: { on, off } }
}

// Outlined square + "/" mark for superficial damage — light gray. The "off" appearance MUST
// leave `color` undefined (no fill): these two checkboxes fully overlap the Aggravated widget
// on top of them, and a filled "off" rectangle would paint over — and hide — this field's
// checked mark whenever the other field is unchecked.
const superficialCheckboxAppearanceProvider: AppearanceProviderFor<PDFCheckBox> = (_checkBox, widget) => {
  const { width, height } = widget.getRectangle()
  const rectBase = { x: 0, y: 0, width, height, rotate: degrees(0), xSkew: degrees(0), ySkew: degrees(0) }
  const off = drawRectangle({ ...rectBase, color: undefined, borderColor: COLORS.border, borderWidth: 1 })
  const inset = Math.min(width, height) * 0.2
  const on = [
    ...drawRectangle({ ...rectBase, color: COLORS.card, borderColor: COLORS.text, borderWidth: 1 }),
    ...drawLine({ start: { x: inset, y: inset }, end: { x: width - inset, y: height - inset }, thickness: 3, color: COLORS.text }),
  ]
  return { normal: { on, off } }
}

// Outlined square + "X" mark for aggravated damage — rendered in red. This widget is added
// after (on top of) the Superficial one, so its opaque "on" appearance correctly covers a
// checked Superficial mark underneath — Aggravated visually wins if both are ever checked.
const aggravatedCheckboxAppearanceProvider: AppearanceProviderFor<PDFCheckBox> = (_checkBox, widget) => {
  const { width, height } = widget.getRectangle()
  const rectBase = { x: 0, y: 0, width, height, rotate: degrees(0), xSkew: degrees(0), ySkew: degrees(0) }
  const off = drawRectangle({ ...rectBase, color: undefined, borderColor: COLORS.border, borderWidth: 1 })
  const inset = Math.min(width, height) * 0.2
  const on = [
    ...drawRectangle({ ...rectBase, color: COLORS.card, borderColor: COLORS.aggravated, borderWidth: 1 }),
    ...drawLine({ start: { x: inset, y: inset }, end: { x: width - inset, y: height - inset }, thickness: 3, color: COLORS.aggravated }),
    ...drawLine({ start: { x: inset, y: height - inset }, end: { x: width - inset, y: inset }, thickness: 3, color: COLORS.aggravated }),
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
// Acrobat JS instead of a radio group.
function cumulativeFillScript(names: string[], idx: number): string {
  const lines = [`var f = this.getField("${names[idx]}");`, `if (f.value !== "Off") {`]
  names.slice(0, idx).forEach((n) => lines.push(`  this.getField("${n}").checkThisBox(0, true);`))
  lines.push(`} else {`)
  names.slice(idx + 1).forEach((n) => lines.push(`  this.getField("${n}").checkThisBox(0, false);`))
  lines.push(`}`)
  return lines.join('\n')
}

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

// Raiva fills left-to-right: box 1 (leftmost) is the first to light up as Rage rises —
// matches RageTrack.tsx's on-screen behavior. Square boxes (not circles) to mirror the web UI.
function rageDotsAt(canvas: PdfCanvas, form: PDFForm, x: number, y: number, value: number, max = 5) {
  const names = Array.from({ length: max }, (_, i) => reserveFieldName(`raiva_${i + 1}`))
  names.forEach((name, idx) => {
    const dot = idx + 1
    const cx = x + DOT_CHECKBOX_SIZE / 2 + idx * DOT_CHECKBOX_SPACING
    const checkBox = form.createCheckBox(name)
    checkBox.addToPage(canvas.page, {
      x: cx - DOT_CHECKBOX_SIZE / 2,
      y: y - DOT_CHECKBOX_SIZE / 2,
      width: DOT_CHECKBOX_SIZE,
      height: DOT_CHECKBOX_SIZE,
      borderWidth: 0,
    })
    checkBox.updateAppearances(rageCheckboxAppearanceProvider)
    if (dot <= value) checkBox.check()
    attachMouseUpJs(canvas.doc, checkBox, cumulativeFillScript(names, idx))
  })
  return dotCheckboxRowWidth(max)
}

function traitRowAt(canvas: PdfCanvas, form: PDFForm, x: number, width: number, y: number, trait: DotTrait, max: number) {
  canvas.text(trait.label, x, y, { size: 8 })
  const dotsWidth = dotCheckboxRowWidth(max)
  checkboxDotsAt(canvas, form, slugify(trait.label), x + width - dotsWidth, y - 2.5, trait.value, max)
}

// Three named columns with an equal row count (Attributes, Skills) — safe to treat as one
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

// Gifts are an editable, variable-length list per category (unlike the fixed Disciplines/
// Sphere lists) — each row is a fillable name field plus a 1-5 dot rating, mirroring how
// Mage's Backgrounds section pairs a text field with dots.
function giftColumns(canvas: PdfCanvas, form: PDFForm, categories: { key: string; label: string; traits: DotTrait[] }[]) {
  const rowHeight = 22
  const maxRows = Math.max(...categories.map((c) => c.traits.length), 1)
  const headerHeight = 14
  const blockHeight = headerHeight + maxRows * rowHeight + 4
  canvas.ensureSpace(blockHeight)
  const startY = canvas.y
  const colWidth = CONTENT_WIDTH / categories.length
  const dotsWidth = dotCheckboxRowWidth(5)
  categories.forEach((cat, ci) => {
    const x = MARGIN + ci * colWidth
    canvas.text(cat.label.toUpperCase(), x, startY - 8, { size: 8, bold: true, color: COLORS.accent })
    let rowY = startY - headerHeight
    cat.traits.forEach((gift, gi) => {
      const fieldWidth = colWidth - 8 - dotsWidth - 10
      textFieldAt(canvas, form, '', gift.label, x, rowY, fieldWidth, 14, { name: `dom_${cat.key}_${gi + 1}_nome`, fontSize: 8 })
      checkboxDotsAt(canvas, form, `dom_${cat.key}_${gi + 1}`, x + fieldWidth + 10, rowY - 7, gift.value, 5)
      rowY -= rowHeight
    })
  })
  canvas.y = startY - blockHeight
}

// Recomputes the W5 penalty (see werewolfHealthPenalty in data/werewolfHealth.ts, mirrored
// here as inline Acrobat JS since the PDF's script runtime can't call our TS helper) across
// both damage-type checkboxes per box and writes it into the read-only
// "health_penalty_display" field. Attached to every health checkbox's mouseUp.
function healthPenaltyScript(boxes: { supName: string; aggName: string }[]): string {
  const entries = boxes.map((b) => `["${b.supName}", "${b.aggName}"]`).join(', ')
  return [
    `var boxes = [${entries}];`,
    `var states = [];`,
    `for (var i = 0; i < boxes.length; i++) {`,
    `  var sup = this.getField(boxes[i][0]);`,
    `  var agg = this.getField(boxes[i][1]);`,
    `  if (agg && agg.value !== "Off") states.push("aggravated");`,
    `  else if (sup && sup.value !== "Off") states.push("superficial");`,
    `  else states.push("none");`,
    `}`,
    `var total = states.length;`,
    `var allAggravated = true;`,
    `for (var i = 0; i < total; i++) { if (states[i] !== "aggravated") { allAggravated = false; break; } }`,
    `var emptyRemaining = 0;`,
    `for (var i = 0; i < total; i++) { if (states[i] === "none") emptyRemaining++; }`,
    `var display = this.getField("health_penalty_display");`,
    `if (allAggravated) { display.value = "Morte (todas as caixas agravadas)"; }`,
    `else if (emptyRemaining === 0) { display.value = "Incapacitado (nenhuma caixa livre)"; }`,
    `else if (emptyRemaining === 1) { display.value = "-2 (resta 1 caixa livre)"; }`,
    `else if (emptyRemaining === 2) { display.value = "-1 (restam 2 caixas livres)"; }`,
    `else { display.value = "Sem penalidade"; }`,
  ].join('\n')
}

// Superficial and aggravated marks share the same box: checking one via Acrobat JS unchecks
// the other (mutual exclusion), then both re-run the shared penalty recompute script.
function mutualExclusionScript(thisName: string, otherName: string, penaltyScript: string): string {
  return [
    `var self = this.getField("${thisName}");`,
    `if (self.value !== "Off") { this.getField("${otherName}").checkThisBox(0, false); }`,
    penaltyScript,
  ].join('\n')
}

// W5's Health track is a flat, unlabeled row of boxes (no named wound levels) sized by
// Vigor + 3 — `health.length` already reflects that, computed on the web sheet.
function healthBlock(canvas: PdfCanvas, form: PDFForm, health: HealthBoxState[]) {
  const boxSize = 16
  const spacing = 22
  const blockHeight = boxSize + 46
  canvas.ensureSpace(blockHeight)
  const startY = canvas.y

  const boxes: { sup: PDFCheckBox; agg: PDFCheckBox; supName: string; aggName: string }[] = []

  const rowTopY = startY - 8
  health.forEach((state, index) => {
    const boxX = MARGIN + index * spacing
    const supName = reserveFieldName(`health_sup_${index + 1}`)
    const aggName = reserveFieldName(`health_agg_${index + 1}`)

    // Superficial is added first (bottom of the paint order); Aggravated is added second, so
    // it's on top and correctly wins visually if both ever end up checked.
    const supBox = form.createCheckBox(supName)
    supBox.addToPage(canvas.page, { x: boxX, y: rowTopY - boxSize, width: boxSize, height: boxSize, borderWidth: 0 })
    supBox.updateAppearances(superficialCheckboxAppearanceProvider)
    if (state === 1) supBox.check()

    const aggBox = form.createCheckBox(aggName)
    aggBox.addToPage(canvas.page, { x: boxX, y: rowTopY - boxSize, width: boxSize, height: boxSize, borderWidth: 0 })
    aggBox.updateAppearances(aggravatedCheckboxAppearanceProvider)
    if (state === 2) aggBox.check()

    boxes.push({ sup: supBox, agg: aggBox, supName, aggName })
  })

  const penalty = werewolfHealthPenalty(health)
  const penaltyY = rowTopY - boxSize - 20
  canvas.line(MARGIN, penaltyY + 12, PAGE_WIDTH - MARGIN, penaltyY + 12)
  canvas.text('PENALIDADE ATUAL', MARGIN, penaltyY, { size: 7.5, color: COLORS.muted })
  textFieldAt(
    canvas,
    form,
    '',
    penalty.label,
    MARGIN + 140,
    penaltyY + 12,
    CONTENT_WIDTH - 140,
    14,
    { name: 'health_penalty_display', readOnly: true, fontSize: 8.5, textColor: penalty.severe ? COLORS.danger : COLORS.text }
  )

  const penaltyScript = healthPenaltyScript(boxes.map((b) => ({ supName: b.supName, aggName: b.aggName })))
  boxes.forEach((b) => {
    attachMouseUpJs(canvas.doc, b.sup, mutualExclusionScript(b.supName, b.aggName, penaltyScript))
    attachMouseUpJs(canvas.doc, b.agg, mutualExclusionScript(b.aggName, b.supName, penaltyScript))
  })

  canvas.y = startY - blockHeight
}

export async function generateWerewolfPdf(data: WerewolfSheetData): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(`Ficha de Personagem — ${data.header.name || 'Lobisomem: O Apocalipse'}`)
  doc.setSubject('Lobisomem: O Apocalipse (W5) — Ficha de Personagem')

  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const form = doc.getForm()
  const canvas = new PdfCanvas(doc, font, fontBold)

  // ── Cover header ─────────────────────────────────────────────────────────
  canvas.ensureSpace(20)
  canvas.text('LOBISOMEM: O APOCALIPSE', MARGIN, canvas.y - 10, { size: 16, bold: true, color: COLORS.accent })
  canvas.text('Ficha de Personagem — 5ª Edição', MARGIN, canvas.y - 24, { size: 8, color: COLORS.muted })
  canvas.y -= 34

  // ── Header fields ────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Cabeçalho', 'Quem é seu Garou')
  {
    const fields: { label: string; value: string }[] = [
      { label: 'Nome do Personagem', value: data.header.name },
      { label: 'Jogador', value: data.header.player },
      { label: 'Crônica', value: data.header.chronicle },
      { label: 'Tribo', value: data.header.tribe },
      { label: 'Auspício', value: data.header.auspice },
      { label: 'Patrono (Espírito Tótem)', value: data.header.patron },
      { label: 'Conceito', value: data.header.concept },
      { label: 'Ambição', value: data.header.ambition },
      { label: 'Desejo', value: data.header.desire },
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

  // ── Skills ───────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Perícias', '4 / 8 / 4 pontos, distribuídos entre os três grupos')
  traitColumns(
    canvas,
    form,
    [
      { label: 'Físico', traits: data.skills.physical },
      { label: 'Social', traits: data.skills.social },
      { label: 'Mental', traits: data.skills.mental },
    ],
    5
  )
  canvas.y -= 10

  // ── Gifts ────────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Dons', 'Cada Dom é um poder aprendido')
  giftColumns(canvas, form, [
    { key: 'tribo', label: 'Dons de Tribo', traits: data.gifts.tribe },
    { key: 'auspicio', label: 'Dons de Auspício', traits: data.gifts.auspice },
    { key: 'geral', label: 'Dons Gerais', traits: data.gifts.general },
  ])
  canvas.y -= 10

  // ── Forms ────────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Formas', 'As Cinco Formas do Garou')
  {
    const rowHeight = 26
    FORMS_REFERENCE.forEach((form_) => {
      canvas.ensureSpace(rowHeight)
      canvas.text(form_.name.toUpperCase(), MARGIN, canvas.y - 8, { size: 8.5, bold: true, color: COLORS.accent })
      canvas.text(form_.description, MARGIN, canvas.y - 19, { size: 7.5, color: COLORS.muted })
      canvas.y -= rowHeight
    })
  }
  canvas.y -= 10

  // ── Health ───────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Saúde', 'Caixas de saúde = Vigor + 3')
  healthBlock(canvas, form, data.health)
  canvas.y -= 10

  // ── Advantages ───────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Vantagens')
  {
    const halfWidth = (CONTENT_WIDTH - 16) / 2
    const thirdWidth = (CONTENT_WIDTH - 16) / 3

    canvas.ensureSpace(30)
    ;([
      ['GLÓRIA', data.renownGlory, 'gloria'],
      ['HONRA', data.renownHonor, 'honra'],
      ['SABEDORIA', data.renownWisdom, 'sabedoria'],
    ] as const).forEach(([label, value, slug], i) => {
      const x = MARGIN + i * (thirdWidth + 8)
      canvas.text(label, x, canvas.y - 8, { size: 8, bold: true, color: COLORS.accent })
      canvas.text(String(value), x + 70, canvas.y - 10, { size: 12, bold: true, color: COLORS.accent })
      checkboxDotsAt(canvas, form, `renome_${slug}`, x, canvas.y - 22, value, 10)
    })
    canvas.y -= 34

    canvas.ensureSpace(30)
    canvas.text('HARMONIA', MARGIN, canvas.y - 8, { size: 9, bold: true, color: COLORS.accent })
    canvas.text(String(data.harmony), MARGIN + 110, canvas.y - 10, { size: 13, bold: true, color: COLORS.accent })
    checkboxDotsAt(canvas, form, 'harmonia', MARGIN + 150, canvas.y - 8, data.harmony, 10)
    canvas.y -= 30

    canvas.ensureSpace(30)
    canvas.text('RAIVA', MARGIN, canvas.y - 8, { size: 9, bold: true, color: COLORS.accent })
    rageDotsAt(canvas, form, MARGIN + 110, canvas.y - 8, data.rage, 5)
    canvas.y -= 30

    canvas.ensureSpace(38)
    textFieldAt(canvas, form, 'XP Total', String(data.xpTotal), MARGIN, canvas.y, halfWidth, 18)
    textFieldAt(canvas, form, 'XP Gasto', String(data.xpSpent), MARGIN + halfWidth + 16, canvas.y, halfWidth, 18)
    canvas.y -= 38

    canvas.ensureSpace(30)
    canvas.text('FORÇA DE VONTADE — PERMANENTE', MARGIN, canvas.y - 6, { size: 6.5, color: COLORS.muted })
    checkboxDotsAt(canvas, form, 'forca_de_vontade_permanente', MARGIN, canvas.y - 18, data.willpowerPermanent, 10)
    canvas.text('FORÇA DE VONTADE — TEMPORÁRIA', MARGIN + halfWidth + 16, canvas.y - 6, { size: 6.5, color: COLORS.muted })
    checkboxDotsAt(canvas, form, 'forca_de_vontade_temporaria', MARGIN + halfWidth + 16, canvas.y - 18, data.willpowerTemporary, 10)
    canvas.y -= 30
  }

  // ── Free text ────────────────────────────────────────────────────────────
  sectionTitle(canvas, 'Histórico & Anotações')
  {
    const notesHeight = 90
    canvas.ensureSpace(notesHeight + 12)
    textFieldAt(canvas, form, 'Histórico & Anotações', data.notes, MARGIN, canvas.y, CONTENT_WIDTH, notesHeight - 11, { multiline: true })
    canvas.y -= notesHeight
  }

  return doc.save()
}
