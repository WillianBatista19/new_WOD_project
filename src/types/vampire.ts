import { DotTrait } from './index'

// A V5 health box cycles through three states on click — empty, Superficial ("/"), or
// Aggravated ("X") — unlike Mago's single filled/empty boolean. See VampireHealthTrack.
export type HealthBoxState = 0 | 1 | 2
export const HEALTH_EMPTY: HealthBoxState = 0
export const HEALTH_SUPERFICIAL: HealthBoxState = 1
export const HEALTH_AGGRAVATED: HealthBoxState = 2

export interface VampireSheetData {
  header: {
    name: string
    player: string
    chronicle: string
    clan: string
    generation: string
    predatorType: string
    concept: string
    ambition: string
    desire: string
  }
  attributes: {
    physical: DotTrait[]
    social: DotTrait[]
    mental: DotTrait[]
  }
  skills: {
    physical: DotTrait[]
    social: DotTrait[]
    mental: DotTrait[]
  }
  disciplines: DotTrait[]
  health: HealthBoxState[]
  bloodPotency: number
  hunger: number
  willpowerPermanent: number
  willpowerTemporary: number
  humanity: number
  resonance: string
  touchstones: string
  xpTotal: number
  xpSpent: number
  notes: string
}
