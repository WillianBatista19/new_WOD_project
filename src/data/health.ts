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
