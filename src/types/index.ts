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
