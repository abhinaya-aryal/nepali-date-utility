import type { BSDate } from "./types";
import { getDaysInMonth, isSupportedBSYear } from "./calendar-data";

export function isValidBSDate(date: unknown): date is BSDate {
  if (!date || typeof date !== "object") return false;

  const { year, month, day } = date as Record<string, unknown>;
  if (
    typeof year !== "number" ||
    typeof month !== "number" ||
    typeof day !== "number" ||
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return false;
  }

  if (!isSupportedBSYear(year)) return false;
  if (month < 1 || month > 12) return false;

  const maxDay = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDay;
}

export function assertValidBSDate(date: BSDate): void {
  if (!isValidBSDate(date)) {
    const raw = date as Partial<BSDate> | null | undefined;
    throw new RangeError(
      `Invalid BS date: ${raw?.year}-${raw?.month}-${raw?.day}`,
    );
  }
}

export function compareBS(a: BSDate, b: BSDate): -1 | 0 | 1 {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

export function isSameDay(a: BSDate, b: BSDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isBefore(a: BSDate, b: BSDate): boolean {
  return compareBS(a, b) < 0;
}

export function isAfter(a: BSDate, b: BSDate): boolean {
  return compareBS(a, b) > 0;
}

export function isDateInRange(
  date: BSDate,
  minDate?: BSDate,
  maxDate?: BSDate,
): boolean {
  if (!isValidBSDate(date)) return false;
  if (minDate && isBefore(date, minDate)) return false;
  if (maxDate && isAfter(date, maxDate)) return false;
  return true;
}
