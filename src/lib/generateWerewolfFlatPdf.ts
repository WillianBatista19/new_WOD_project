const PAGE_WIDTH = 595.28 // A4 portrait, points
const PAGE_HEIGHT = 841.89
const MARGIN = 20
const USABLE_WIDTH = PAGE_WIDTH - MARGIN * 2
const USABLE_HEIGHT = PAGE_HEIGHT - MARGIN * 2
const CARD_GAP = 14 // space between stacked card images on the same page
const CAPTURE_WIDTH = 900 // px — force a desktop-width layout regardless of the real viewport

// Flattened export: rasterizes each SectionCard in the live sheet DOM individually (via
// html2canvas) and lays the resulting images out across A4 pages using jsPDF — no AcroForm
// fields at all, purely a static snapshot. Mirrors generateVampireFlatPdf.ts's approach; see
// that file (or generateMageFlatPdf.ts) for why cards are captured and placed individually
// rather than sliced as one tall image.
export async function generateWerewolfFlatPdf(sheetElement: HTMLElement): Promise<Uint8Array> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])

  // Wait for the Cinzel/Crimson Text web fonts to finish loading before rasterizing —
  // capturing too early falls back to system fonts mid-load and the text comes out wrong.
  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  // Force a desktop-width capture on any device. Two things have to change together:
  //  1. The element's own inline width/min-width — some layout depends on the element's actual
  //     box size, not just media queries.
  //  2. html2canvas's `windowWidth` — Tailwind's `md:`/`lg:` classes are driven by @media
  //     queries against the *viewport*, not the target element's width, and html2canvas
  //     renders its capture inside a hidden same-origin iframe sized by windowWidth/Height.
  // Original inline styles are restored in `finally` so the live page is untouched afterward,
  // even if a capture throws partway through.
  const previousWidth = sheetElement.style.width
  const previousMinWidth = sheetElement.style.minWidth
  sheetElement.style.width = `${CAPTURE_WIDTH}px`
  sheetElement.style.minWidth = `${CAPTURE_WIDTH}px`
  void sheetElement.offsetHeight // force a synchronous reflow before html2canvas measures layout

  let cardImages: { dataUrl: string; width: number; height: number }[]
  try {
    const captureOptions = {
      backgroundColor: '#0a0a0f',
      scale: 2,
      windowWidth: CAPTURE_WIDTH,
      useCORS: true,
      allowTaint: false,
      // Strip the site-wide decorative grain texture (body::after) from the clone — its random
      // noise pattern is nearly incompressible and bloats the captured image.
      onclone: (clonedDoc: Document) => {
        const style = clonedDoc.createElement('style')
        style.textContent = 'body::after { content: none !important; }'
        clonedDoc.head.appendChild(style)
      },
    }

    const cards = Array.from(sheetElement.querySelectorAll('section')) as HTMLElement[]
    cardImages = []
    for (const card of cards) {
      const canvas = await html2canvas(card, captureOptions)
      const width = USABLE_WIDTH
      const height = (canvas.height * width) / canvas.width
      cardImages.push({ dataUrl: canvas.toDataURL('image/jpeg', 0.92), width, height })
    }
  } finally {
    sheetElement.style.width = previousWidth
    sheetElement.style.minWidth = previousMinWidth
  }

  const pdf = new jsPDF({ format: 'a4', unit: 'pt' })
  let pageStarted = false
  let cursorY = MARGIN

  const startNewPage = () => {
    if (pageStarted) pdf.addPage()
    pageStarted = true
    pdf.setFillColor(10, 10, 15) // #0a0a0f
    pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F')
    cursorY = MARGIN
  }

  startNewPage()

  cardImages.forEach(({ dataUrl, width, height }) => {
    if (height > USABLE_HEIGHT) {
      // Fallback for a single card taller than one whole page: it has to be sliced, the same
      // way the old whole-sheet approach did it, but now scoped to just this one oversized card
      // instead of the entire document. Page k shows the image shifted up by k page-heights.
      if (cursorY > MARGIN) startNewPage()
      const sliceCount = Math.ceil(height / USABLE_HEIGHT)
      for (let k = 0; k < sliceCount; k++) {
        if (k > 0) startNewPage()
        pdf.addImage(dataUrl, 'JPEG', MARGIN, MARGIN - k * USABLE_HEIGHT, width, height)
      }
      cursorY = MARGIN + (height - (sliceCount - 1) * USABLE_HEIGHT) + CARD_GAP
      return
    }

    if (cursorY + height > PAGE_HEIGHT - MARGIN) {
      startNewPage()
    }

    pdf.addImage(dataUrl, 'JPEG', MARGIN, cursorY, width, height)
    cursorY += height + CARD_GAP
  })

  return new Uint8Array(pdf.output('arraybuffer'))
}
