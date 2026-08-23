/**
 * Custom "periode" cycle used by the company: every period runs from the
 * 21st of one month to the 20th of the next. A periode is identified by its
 * *start* month, encoded as "YYYY-MM" (e.g. "2026-07" is 21 Jul - 20 Aug 2026).
 */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const MONTHS_LONG = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export interface Periode {
  value: string; // "YYYY-MM"
  label: string; // "21 Jul - 20 Agu 2026"
  monthLabel: string; // "Juli 2026" (name of the start month, used in dropdowns)
  shortLabel: string; // "Jul 26" (compact form for chart axis ticks)
  start: Date;
  end: Date;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function parsePeriodeValue(value: string): { year: number; month: number } {
  const [y, m] = value.split("-").map(Number);
  return { year: y, month: m };
}

export function buildPeriode(year: number, month: number): Periode {
  const startYear = year;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;

  const start = new Date(startYear, month - 1, 21);
  const end = new Date(endYear, endMonth - 1, 20);

  const startShort = MONTHS_SHORT[month - 1];
  const endShort = MONTHS_SHORT[endMonth - 1];
  const label =
    startYear === endYear
      ? `21 ${startShort} - 20 ${endShort} ${startYear}`
      : `21 ${startShort} ${startYear} - 20 ${endShort} ${endYear}`;

  return {
    value: `${startYear}-${pad2(month)}`,
    label,
    monthLabel: `${MONTHS_LONG[month - 1]} ${startYear}`,
    shortLabel: `${startShort} ${String(startYear).slice(2)}`,
    start,
    end,
  };
}

export function periodeFromValue(value: string): Periode {
  const { year, month } = parsePeriodeValue(value);
  return buildPeriode(year, month);
}

/** Returns the periode value ("YYYY-MM") that a given date falls into. */
export function getPeriodeForDate(date: Date): Periode {
  const day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (day < 21) {
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }

  return buildPeriode(year, month);
}

export function getCurrentPeriode(): Periode {
  return getPeriodeForDate(new Date());
}

/** All 12 periods (Jan-Dec start months) for a given year. */
export function generatePeriodeList(year: number): Periode[] {
  return Array.from({ length: 12 }, (_, i) => buildPeriode(year, i + 1));
}

function periodeIndex(value: string): number {
  const { year, month } = parsePeriodeValue(value);
  return year * 12 + (month - 1);
}

export function comparePeriode(a: string, b: string): number {
  return periodeIndex(a) - periodeIndex(b);
}

export function addMonthsToPeriode(value: string, delta: number): string {
  const { year, month } = parsePeriodeValue(value);
  const idx = year * 12 + (month - 1) + delta;
  const newYear = Math.floor(idx / 12);
  const newMonth = (idx % 12) + 1;
  return `${newYear}-${pad2(newMonth)}`;
}

/** Inclusive list of periode values from `from` to `to` (order-independent). */
export function periodeRange(from: string, to: string): string[] {
  const a = periodeIndex(from);
  const b = periodeIndex(to);
  const [lo, hi] = a <= b ? [a, b] : [b, a];
  const result: string[] = [];
  for (let idx = lo; idx <= hi; idx++) {
    const year = Math.floor(idx / 12);
    const month = (idx % 12) + 1;
    result.push(`${year}-${pad2(month)}`);
  }
  return result;
}

/**
 * Compact list of periods for filter-bar dropdowns — a window around today,
 * most recent first (as opposed to `generatePeriodeList`, which lists a
 * single calendar year for the wizard's picker grid).
 */
export function generatePeriodeOptions(monthsBack = 18, monthsForward = 2): Periode[] {
  const current = getCurrentPeriode().value;
  const values = periodeRange(
    addMonthsToPeriode(current, -monthsBack),
    addMonthsToPeriode(current, monthsForward)
  );
  return values.map(periodeFromValue).reverse();
}

/**
 * Full contiguous periode timeline spanning the earliest to the latest of
 * the given values, extended to include the current periode. Used by charts
 * that must show every period, not just the ones with data.
 */
export function buildPeriodeTimeline(periodeValues: string[]): string[] {
  const current = getCurrentPeriode().value;
  const all = [...periodeValues, current].filter(Boolean);
  if (all.length === 0) return [current];

  let min = all[0];
  let max = all[0];
  for (const v of all) {
    if (comparePeriode(v, min) < 0) min = v;
    if (comparePeriode(v, max) > 0) max = v;
  }
  return periodeRange(min, max);
}
