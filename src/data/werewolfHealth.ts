import { HealthBoxState, HEALTH_AGGRAVATED, HEALTH_EMPTY } from '../types/werewolf'

// W5 mirrors V5's Health track exactly: a flat, unlabeled row of boxes sized by Vigor + 3.
// Penalty is driven by how many boxes remain empty: 2 left = -1, 1 left = -2, none left =
// Incapacitado. A fully Aggravated track means the Garou is at Death's door — the worst case,
// checked first.
export function werewolfHealthPenalty(health: HealthBoxState[]): { label: string; severe: boolean } {
  const total = health.length
  if (total === 0) return { label: 'Sem penalidade', severe: false }

  if (health.every((s) => s === HEALTH_AGGRAVATED)) {
    return { label: 'Morte (todas as caixas agravadas)', severe: true }
  }

  const emptyRemaining = health.filter((s) => s === HEALTH_EMPTY).length
  if (emptyRemaining === 0) return { label: 'Incapacitado (nenhuma caixa livre)', severe: true }
  if (emptyRemaining === 1) return { label: '-2 (resta 1 caixa livre)', severe: true }
  if (emptyRemaining === 2) return { label: '-1 (restam 2 caixas livres)', severe: true }
  return { label: 'Sem penalidade', severe: false }
}
