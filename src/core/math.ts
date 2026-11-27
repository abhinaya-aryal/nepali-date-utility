import type { BSDate } from "./types";
import { getDaysInMonth } from "./calendar-data";
import { fromEpochDays, toEpochDays } from "./converter";
import { assertValidBSDate } from "./compare";

export function addDays(date: BSDate, days: number): BSDate {
  if (!Number.isInteger(days)) {
    throw new RangeError(`days must be an integer, received ${days}`);
  }
  return fromEpochDays(toEpochDays(date) + days);
}

export function addMonths(date: BSDate, months: number): BSDate {
  assertValidBSDate(date);
  if (!Number.isInteger(months)) {
    throw new RangeError(`months must be an integer, received ${months}`);
  }

  const totalMonths = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(totalMonths / 12);
  const month = (((totalMonths % 12) + 12) % 12) + 1;
  const maxDay = getDaysInMonth(year, month);

  return {
    year,
    month,
    day: Math.min(date.day, maxDay),
  };
}

export function addYears(date: BSDate, years: number): BSDate {
  if (!Number.isInteger(years)) {
    throw new RangeError(`years must be an integer, received ${years}`);
  }
  return addMonths(date, years * 12);
}

/**
 * Returns the signed number of days between two BS dates (a - b).
 */
export function diffDays(a: BSDate, b: BSDate): number {
  return toEpochDays(a) - toEpochDays(b);
}

export function startOfMonth(date: BSDate): BSDate {
  assertValidBSDate(date);
  return { year: date.year, month: date.month, day: 1 };
}

export function endOfMonth(date: BSDate): BSDate {
  assertValidBSDate(date);
  return {
    year: date.year,
    month: date.month,
    day: getDaysInMonth(date.year, date.month),
  };
}
