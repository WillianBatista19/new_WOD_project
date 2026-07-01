import { DotTrait } from './index'

// W5 uses the same tri-state Health box model as V5 (empty / Superficial / Aggravated).
export type HealthBoxState = 0 | 1 | 2
export const HEALTH_EMPTY: HealthBoxState = 0
export const HEALTH_SUPERFICIAL: HealthBoxState = 1
export const HEALTH_AGGRAVATED: HealthBoxState = 2

export interface WerewolfSheetData {
  header: {
    name: string
    player: string
    chronicle: string
    tribe: string
    auspice: string
    patron: string
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
  gifts: {
    tribe: DotTrait[]
    auspice: DotTrait[]
    general: DotTrait[]
  }
  renownGlory: number
  renownHonor: number
  renownWisdom: number
  rage: number
  health: HealthBoxState[]
  willpowerPermanent: number
  willpowerTemporary: number
  harmony: number
  xpTotal: number
  xpSpent: number
  notes: string
}
