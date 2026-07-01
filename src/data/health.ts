import { HealthLevel } from '../types';

// Classic World of Darkness wound track — shared structure across all game lines.
export const HEALTH_LEVELS: HealthLevel[] = [
  { label: 'Contusão', penalty: '0' },
  { label: 'Contusão', penalty: '0' },
  { label: 'Machucado', penalty: '0' },
  { label: 'Ferido', penalty: '-1' },
  { label: 'Machucado Grave', penalty: '-2' },
  { label: 'Incapacitado', penalty: '-2' },
  { label: 'Aleijado', penalty: '-5' },
  { label: 'Moribundo', penalty: 'Especial' },
];

export interface HealthRow {
  label: string;
  penalty: string;
  boxIndexes: number[];
}

// Groups consecutive levels that share a name (e.g. the two "Contusão" boxes) into one row.
export function groupHealthLevels(levels: HealthLevel[] = HEALTH_LEVELS): HealthRow[] {
  const rows: HealthRow[] = [];
  levels.forEach((level, i) => {
    const last = rows[rows.length - 1];
    if (last && last.label === level.label && last.penalty === level.penalty) {
      last.boxIndexes.push(i);
    } else {
      rows.push({ label: level.label, penalty: level.penalty, boxIndexes: [i] });
    }
  });
  return rows;
}

// Consolidated "current penalty" summary text — several levels share a bucket (Contusão and
// Machucado both read as no penalty; Machucado Grave and Incapacitado both read "Grave (-2)").
// Shared by the web UI (HealthTrack) and the PDF export (health_penalty_display's JS) so the
// two can never drift apart — the PDF's Acrobat script just embeds these precomputed strings
// rather than re-deriving the mapping in JavaScript.
export function healthPenaltyLabel(level: HealthLevel | null): string {
  if (!level) return 'Nenhum Ferimento';
  switch (level.label) {
    case 'Contusão':
    case 'Machucado':
      return 'Sem Penalidade';
    case 'Ferido':
      return 'Ferido (-1)';
    case 'Machucado Grave':
    case 'Incapacitado':
      return 'Grave (-2)';
    case 'Aleijado':
      return 'Aleijado (-5)';
    case 'Moribundo':
      return 'Moribundo (Especial)';
    default:
      return `${level.label} (${level.penalty})`;
  }
}

export function healthHasPenalty(level: HealthLevel | null): boolean {
  return !!level && level.label !== 'Contusão' && level.label !== 'Machucado';
}
