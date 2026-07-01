# World of Darkness — Encyclopedia & Character Sheet Builder

## Project Overview

An encyclopedic and interactive website about the **Classic World of Darkness (WoD)**, the tabletop RPG universe created by White Wolf. The goal is to be the go-to Portuguese-language reference for the setting: explain what tabletop RPG is, present all WoD game lines, guide character creation step by step, and let users build character sheets directly on the site with PDF export.

The previous project (https://github.com/WillianBatista19/projeto-wod) exists as a reference for intent only — **everything is being rewritten from scratch**: new stack, new design, new structure.

The site content (UI text, descriptions, labels) should be in **Brazilian Portuguese (pt-BR)**.

---

## Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3 — utility-first, no component libraries
- **PDF export:** `jsPDF` + `html2canvas` (for the character sheet)
- **Fonts:** Google Fonts — Cinzel (display/headings) + Crimson Text (body)
- **Icons:** Lucide React or inline SVG
- **Deploy:** Vercel

**Do NOT use:** Create React App, Bootstrap, MUI, Chakra, or any component library.

---

## Development Phases

The project is built incrementally. Each phase has a clear deliverable before moving to the next. **Do not work ahead of the current phase.**

### Phase 1 — Foundation & Home
- Vite + React + TypeScript + Tailwind setup
- Global styles, design tokens, fonts
- Navbar and Footer components
- Home page: hero, "What is RPG?" teaser block, system cards grid (portal effect), character creation overview
- Systems listing page (`/sistemas`) with all five cards

### Phase 2 — System Detail Pages
- `SystemDetail` page component reading from `systems.ts`
- Full detail pages for **Vampiro (V5)**, **Lobisomem (W5)**, and **Mago (M20)**
- Sections: hero, setting description, clans/tribes/traditions grid, creation steps, unique stat
- "What is RPG" full page (`/o-que-e-rpg`)

### Phase 3 — Polish & Content
- Responsive pass on all pages (mobile, tablet, desktop)
- Animations and hover states refined
- Content review and copywriting pass
- Vercel deploy and routing config

### Phase 4 — Character Sheet Builder (only after Phase 3 is done)
- Route `/sistemas/:id/ficha` added
- Mago M20 sheet first: attributes, abilities, spheres, advantages, PDF export
- Then Vampiro V5 and Lobisomem W5 sheets

---



```
/                         → Home
/o-que-e-rpg              → What is tabletop RPG (intro for newcomers)
/sistemas                 → All WoD game lines listing
/sistemas/:id             → Individual game line detail page
/sistemas/:id/ficha       → Character sheet builder for that game line
```

### Game lines to cover (priority order)
1. **Vampiro: A Máscara** (Vampire: The Masquerade) — **5th Edition (V5)**
2. **Lobisomem: O Apocalipse** (Werewolf: The Apocalypse) — **5th Edition (W5)**
3. **Mago: A Ascensão** (Mage: The Ascension) — **20th Anniversary Edition (M20)**
4. **Caçador: O Ajuste de Contas** (Hunter: The Reckoning) — *(future)*
5. **Múmia: O Caminho** (Mummy: The Resurrection) — *(future)*
6. *(future: Changeling, Wraith, Demon)*

### Character sheet builder — Phase 4 (do NOT implement yet)
The character sheet feature (`/sistemas/:id/ficha`) is planned but must only be built **after all three base systems (Vampiro, Lobisomem, Mago) are fully live on the site**. Do not scaffold, stub, or reference this route in the current phases.

---

## Design & Visual Identity

### Core principle
Each game line has its **own thematic color**. The entire site is dark and atmospheric, but the accent color shifts based on context.

### Base palette (global CSS variables)
```css
--bg-primary:   #0a0a0f   /* main background, near-black */
--bg-card:      #111118   /* card backgrounds */
--bg-surface:   #1a1a2e   /* elevated surfaces */
--text-primary: #e8e0d0   /* main text, warm cream */
--text-muted:   #8a8090   /* secondary text */
--border:       #2a2a3a   /* subtle borders */
```

### Per-system thematic colors
```css
/* Vampiro */   --system-color: #c41e3a;  --system-glow: rgba(196,30,58,0.4);
/* Mago */      --system-color: #7b2fff;  --system-glow: rgba(123,47,255,0.4);
/* Lobisomem */ --system-color: #4caf50;  --system-glow: rgba(76,175,80,0.4);
/* Caçador */   --system-color: #d4860a;  --system-glow: rgba(212,134,10,0.4);
/* Múmia */     --system-color: #c9a227;  --system-glow: rgba(201,162,39,0.4);
```

### Styling with Tailwind
- Use Tailwind utility classes for layout, spacing, and typography
- For system-specific colors (glow, accent), use inline `style` props with CSS custom properties (`--system-color`, `--system-glow`) since Tailwind can't handle dynamic values at runtime
- Example: `style={{ boxShadow: `0 0 24px var(--system-glow)` }}`
- Custom fonts via `font-cinzel` and `font-crimson` (configured in tailwind.config.js)

### Typography
```
Display/Headings: 'Cinzel', serif        (weights: 400, 600, 700)
Body/Text:        'Crimson Text', serif  (weights: 400, 600; also italic)
UI/Labels:        system-ui, sans-serif
```

### System cards — "portal" effect (signature element)
The system cards on the Home and Systems pages are the central visual element:
- Dark background with a faint thematic background image (low opacity overlay)
- Border with `box-shadow` glow in the system's color
- Hover: glow intensifies, subtle `scale(1.02)` transform, mist/vignette overlay deepens
- The sensation that each card is a window into another world
- Max border-radius: 6px — keep it sharp, not bubbly

### General style rules
- Border-radius max 6–8px throughout
- Subtle texture (CSS noise or grain via SVG filter) to avoid flat-design feel
- Smooth transitions: `0.3s ease` — don't overdo animation
- Mobile-first, fully responsive
- Respect `prefers-reduced-motion`

---

## Pages

### Home (`/`)
Sections:
1. **Hero** — Epic full-viewport header: "WORLD OF DARKNESS" title, short universe description, CTA button to explore the systems. Dark atmospheric background.
2. **What is RPG?** — Short intro block for newcomers, linking to `/o-que-e-rpg`.
3. **The Systems** — Grid of system cards with portal effect.
4. **How character creation works** — 3–4 steps overview that applies to all systems.

### What is RPG (`/o-que-e-rpg`)
Accessible, welcoming explanation for people who have never played:
- What tabletop RPG is
- How a session works (Storyteller + players, collaborative fiction)
- What World of Darkness specifically is (personal horror, politics, urban supernatural)
- How to start (what to buy, where to find a group)
- Tone: warm, not condescending, uses film/TV analogies

### Systems Listing (`/sistemas`)
Grid of all game line cards:
- Thematic color, icon, name, one-line tagline per card
- Each card links to `/sistemas/:id`

### System Detail (`/sistemas/:id`)
Sections:
1. **System hero** — Name, subtitle, thematic image, system color applied as accent throughout
2. **The setting** — Long description of the world and premise
3. **Clans / Tribes / Traditions** — Grid of playable faction cards
4. **Character creation steps** — Numbered visual walkthrough
5. **Attributes & powers overview** — Rules summary
6. **Unique stat** — e.g. Humanity (Vampiro), Arete (Mago), Rage (Lobisomem)
7. **CTA** → link to character sheet builder

### Character Sheet (`/sistemas/:id/ficha`)
**Build Mago: A Ascensão first.** The component should be designed so other systems can be added later with their own sheet components.

---

## Mago: A Ascensão — Character Sheet Spec (Phase 4, do not build yet)

**Edition: 20th Anniversary Edition (M20)**

Follows the official sheet structure from Mage: The Ascension 20th Anniversary Edition.

### Header fields (text inputs)
- Character Name, Player, Chronicle
- Tradition, Essence, Concept
- Nature, Demeanor

### Attributes (3 groups × 3, dots 1–5)
- **Physical:** Força, Destreza, Vigor
- **Social:** Carisma, Manipulação, Aparência
- **Mental:** Percepção, Inteligência, Raciocínio

Point allocation reminder: 7 / 5 / 3 across the three groups (player chooses which group gets which).

### Abilities (3 groups, dots 0–5)
- **Talents:** Alerta, Atletismo, Briga, Empatia, Expressão, Intimidação, Liderança, Lábia, Prontidão, Subterfúgio
- **Skills:** Animais, Condução, Esportes, Etiqueta, Furtividade, Ofícios, Performance, Primeiros Socorros, Segurança, Sobrevivência
- **Knowledges:** Acadêmicos, Burocracia, Ciência, Computadores, Cosmologia, Enigmas, Lei, Linguística, Medicina, Ocultismo

Point allocation: 13 / 9 / 5 across groups.

### Spheres (9 Spheres, dots 0–5 each)
Correspondência, Entropia, Forças, Vida, Matéria, Mente, Primo, Espírito, Tempo

Note: no Sphere can exceed the character's Arete rating.

### Backgrounds (dots 0–5 each, editable list)
Default list: Aliados, Avatar, Biblioteca, Consagrado, Contatos, Familiar, Influência, Mentor, Patrono, Recursos, Reputação

### Advantages
- **Arete** (1–10) — most important stat; displayed prominently
- **Quintessência** (point pool, number input)
- **Paradox** (counter, number input)
- **Força de Vontade** (1–10, two rows: permanent + temporary)

### Free-text fields
- Magical Focus (how this mage manifests magic — paradigm, instruments)
- Character History / Notes (textarea)

### Dot component behavior
- Clicking a filled dot clears from that dot to the end
- Clicking an empty dot fills from 1 up to that dot
- Visually: filled = solid circle in system color, empty = outlined circle
- Use a reusable `<DotRating>` component throughout

### Point tracking
- Show a soft counter per section: "X / Y points used"
- Warn (visual highlight, not blocking) if over the recommended allocation
- Never block the user — these are guidelines, not hard locks

### PDF Export
- Button: "Exportar PDF"
- Use `jsPDF` + `html2canvas` to capture the sheet div
- Output: A4 portrait, dark-themed matching the site aesthetic
- Include the system color accent in the PDF header

---

## Data & Types

All shared TypeScript interfaces live in `src/types/index.ts`:

```ts
export interface Faction {
  name: string;
  description: string;
}

export interface CreationStep {
  title: string;
  desc: string;
}

export interface GameSystem {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  color: string;
  colorSecondary: string;
  colorGlow: string;
  icon: string;
  uniqueStat: { name: string; description: string };
  factions: Faction[];
  steps: CreationStep[];
}
```

All system data lives in `src/data/systems.ts` as a typed exported array:

```ts
import { GameSystem } from "../types";

export const SYSTEMS: GameSystem[] = [
  {
    id: "mago",
    name: "Mago: A Ascensão",
    subtitle: "The Ascension",
    tagline: "A realidade é apenas um ponto de vista",
    description: "...",       // short, used on cards
    longDescription: "...",   // long, used on detail page
    color: "#7b2fff",
    colorSecondary: "#4a0e8f",
    colorGlow: "rgba(123,47,255,0.4)",
    icon: "✨",
    uniqueStat: {
      name: "Arete",
      description: "Your mastery over magic. Caps the maximum rating of any Sphere."
    },
    factions: [
      { name: "Order of Hermes", description: "Classical wizards of grimoires and arcane theory" },
    ],
    steps: [
      { title: "Choose your Tradition", desc: "Defines your magical worldview and Paradigm" },
    ],
  },
  // ... other systems
];
```

---

## File Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── SystemCard/
│   │   └── SystemCard.tsx
│   ├── DotRating/
│   │   └── DotRating.tsx          ← reusable clickable dots
│   └── ui/
│       └── Button.tsx
├── pages/
│   ├── Home/
│   │   └── Home.tsx
│   ├── WhatIsRPG/
│   │   └── WhatIsRPG.tsx
│   ├── Systems/
│   │   └── Systems.tsx
│   ├── SystemDetail/
│   │   └── SystemDetail.tsx
│   └── CharacterSheet/
│       ├── CharacterSheet.tsx     ← router: picks sheet by system id
│       └── MageSheet.tsx          ← Mago: A Ascensão sheet
├── data/
│   └── systems.ts
├── types/
│   └── index.ts                   ← shared TypeScript interfaces
├── styles/
│   └── global.css                 ← Tailwind directives + base font variables
└── main.tsx
```

---

## Project Setup

```bash
npm create vite@latest wod-encyclopedia -- --template react-ts
cd wod-encyclopedia
npm install react-router-dom jspdf html2canvas lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

Configure `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        crimson: ["Crimson Text", "serif"],
      },
      colors: {
        "wod-bg": "#0a0a0f",
        "wod-card": "#111118",
        "wod-surface": "#1a1a2e",
        "wod-text": "#e8e0d0",
        "wod-muted": "#8a8090",
        "wod-border": "#2a2a3a",
      },
    },
  },
  plugins: [],
};
```

`src/styles/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --system-color: #7b2fff;
    --system-glow: rgba(123, 47, 255, 0.4);
  }
}
```

Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

---

## Visual Refinements (apply before Phase 4)

### Section transition gradients
Between sections that flow into each other (where background color changes), add a gradient fade div at the bottom of the upper section to soften the transition. **Do not apply to every section break** — only where there is a real color contrast change (e.g. dark hero → lighter card grid, lore block → faction grid). Overusing it kills the effect.

```tsx
// Bottom fade-out of a section — blends into the next section's bg color
<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-wod-surface pointer-events-none" />

// Top fade-in of a section — use when the section below needs the blend too
<div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-wod-bg pointer-events-none" />
```

Rule of thumb: use on 2–3 transitions per page maximum. The hero-to-content transition and a mid-page color shift are the best candidates.

### System icons — thematic inline SVG (replace all emojis)
Remove all emoji icons from system cards and detail pages. Replace with inline SVG icons that match the dark aesthetic of the site. Each icon should be monochrome, rendered in `currentColor` or `var(--system-color)`, sized around 48–64px on cards.

SVG icons per system:

**Vampiro: A Máscara** — blood drop
```svg
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0C19 10.5 12 2 12 2z"/>
</svg>
```

**Lobisomem: O Apocalipse** — crescent moon with claw marks
```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
  <path d="M8 9l1.5 3M11 8l1 3.5M14 9l-1 3" strokeLinecap="round"/>
</svg>
```

**Mago: A Ascensão** — triangle with eye / pyramid
```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
  <path d="M12 3L2 21h20L12 3z" strokeLinejoin="round"/>
  <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none"/>
  <path d="M9 14c0-1.66 1.34-3 3-3s3 1.34 3 3" strokeLinecap="round"/>
</svg>
```

**Caçador: O Ajuste de Contas** — crosshair / target
```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
  <circle cx="12" cy="12" r="9"/>
  <circle cx="12" cy="12" r="3"/>
  <line x1="12" y1="3" x2="12" y2="7"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
  <line x1="3" y1="12" x2="7" y2="12"/>
  <line x1="17" y1="12" x2="21" y2="12"/>
</svg>
```

**Múmia: O Caminho** — ankh
```svg
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
  <circle cx="12" cy="7" r="4"/>
  <line x1="12" y1="11" x2="12" y2="21" strokeLinecap="round"/>
  <line x1="7" y1="15" x2="17" y2="15" strokeLinecap="round"/>
</svg>
```

Create a `src/components/SystemIcon/SystemIcon.tsx` component that receives `systemId: string` and renders the correct SVG. Use it everywhere the emoji was used.

---



- **All UI text and content in Brazilian Portuguese (pt-BR)**
- **Do not reproduce copyrighted book text** — write original descriptions that capture each system's essence
- **Mobile-first** — character sheet needs to work on tablet minimum; desktop is the ideal viewport for the full sheet
- **No hard dependencies on images** — use CSS gradients as fallbacks if images fail to load
- **Basic accessibility** — all form inputs labeled, minimum AA contrast, keyboard-navigable dots
- **Performance** — lazy-load images, don't over-import