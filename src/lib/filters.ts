import { getCurrentPeriode, periodeRange } from "./periode";

export type PeriodeFilterMode = "single" | "range";

export interface PeriodeFilterValue {
  mode: PeriodeFilterMode;
  periode: string; // used when mode === "single"
  periodeFrom: string; // used when mode === "range"
  periodeTo: string; // used when mode === "range"
}

export function defaultPeriodeFilter(): PeriodeFilterValue {
  const current = getCurrentPeriode().value;
  return { mode: "single", periode: current, periodeFrom: current, periodeTo: current };
}

/** Whether a given periode value falls inside the active filter selection. */
export function periodeMatches(filter: PeriodeFilterValue, value: string): boolean {
  if (!value) return false;
  if (filter.mode === "single") return value === filter.periode;
  return periodeRange(filter.periodeFrom, filter.periodeTo).includes(value);
}
