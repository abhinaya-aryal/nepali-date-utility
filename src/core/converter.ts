import type { BSDate } from "./types";
import {
  MIN_BS_YEAR,
  MAX_BS_YEAR,
  getDaysInMonth,
  getDaysInYear,
  isSupportedBSYear,
} from "./calendar-data";
import { assertValidBSDate } from "./compare";

const AD_EPOCH_UTC = Date.UTC(1943, 3, 14); // 1943-04-14 = 2000-01-01 BS
const MS_PER_DAY = 86_400_000;

/**
 * Total days elapsed since 2000-01-01 BS.
 */
export function toEpochDays(bsDate: BSDate): number {
  assertValidBSDate(bsDate);

  let total = 0;
  for (let y = MIN_BS_YEAR; y < bsDate.year; y++) {
    total += getDaysInYear(y);
  }
  for (let m = 1; m < bsDate.month; m++) {
    total += getDaysInMonth(bsDate.year, m);
  }
  return total + bsDate.day - 1;
}

/**
 * Convert days elapsed since 2000-01-01 BS back to a BSDate.
 */
export function fromEpochDays(days: number): BSDate {
  if (!Number.isInteger(days) || days < 0) {
    throw new RangeError(
      `Date is before the supported BS range (${MIN_BS_YEAR}-01-01)`,
    );
  }

  let remaining = days;
  let year = MIN_BS_YEAR;

  while (year <= MAX_BS_YEAR) {
    const yearDays = getDaysInYear(year);
    if (remaining < yearDays) break;
    remaining -= yearDays;
    year++;
  }

  if (!isSupportedBSYear(year)) {
    throw new RangeError(
      `Year ${year} is outside the supported range (${MIN_BS_YEAR}-${MAX_BS_YEAR})`,
    );
  }

  let month = 1;
  while (month <= 12) {
    const monthDays = getDaysInMonth(year, month);
    if (remaining < monthDays) break;
    remaining -= monthDays;
    month++;
  }

  return { year, month, day: remaining + 1 };
}

/**
 * Convert a Gregorian (AD) JS Date to a Bikram Sambat (BS) date.
 */
export function adToBS(adDate: Date): BSDate {
  if (!(adDate instanceof Date) || Number.isNaN(adDate.getTime())) {
    throw new RangeError("Invalid AD date");
  }

  const targetUtc = Date.UTC(
    adDate.getFullYear(),
    adDate.getMonth(),
    adDate.getDate(),
  );
  const diffDays = Math.round((targetUtc - AD_EPOCH_UTC) / MS_PER_DAY);

  if (diffDays < 0) {
    throw new RangeError(
      `AD date is before the supported range (earliest: 1943-04-14 / BS ${MIN_BS_YEAR}-01-01)`,
    );
  }

  return fromEpochDays(diffDays);
}

/**
 * Convert a Bikram Sambat (BS) date to a local Gregorian (AD) JS Date.
 */
export function bsToAD(bsDate: BSDate): Date {
  const days = toEpochDays(bsDate);
  return new Date(1943, 3, 14 + days);
}

/**
 * Get today's date in Bikram Sambat (BS).
 */
export function todayBS(): BSDate {
  return adToBS(new Date());
}

/**
 * Get the day of the week (0 = Sunday .. 6 = Saturday) for a BS date.
 */
export function getDayOfWeek(bsDate: BSDate): number {
  return bsToAD(bsDate).getDay();
}

/**
 * Get the day of the week (0 = Sunday .. 6 = Saturday) of the 1st of a BS month.
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return getDayOfWeek({ year, month, day: 1 });
}
