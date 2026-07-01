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

// ── Character Sheet ──────────────────────────────────────────────────────────

export interface DotTrait {
  label: string;
  value: number;
}

export interface HealthLevel {
  label: string;
  penalty: string;
}

export interface ReferenceEntry {
  name: string;
  description: string;
}

export interface MageSheetData {
  header: {
    name: string;
    player: string;
    chronicle: string;
    tradition: string;
    essence: string;
    concept: string;
    nature: string;
    demeanor: string;
  };
  attributes: {
    physical: DotTrait[];
    social: DotTrait[];
    mental: DotTrait[];
  };
  abilities: {
    talents: DotTrait[];
    skills: DotTrait[];
    knowledges: DotTrait[];
  };
  spheres: DotTrait[];
  backgrounds: DotTrait[];
  health: boolean[];
  arete: number;
  quintessence: number;
  paradox: number;
  willpowerPermanent: number;
  willpowerTemporary: number;
  magicalFocus: string;
  notes: string;
}
