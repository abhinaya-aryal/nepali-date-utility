import type { BSDate, FormatOptions, ParseOptions } from "./types";
import {
  BS_DAYS_EN,
  BS_DAYS_NE,
  BS_DAYS_SHORT_EN,
  BS_DAYS_SHORT_NE,
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  NEPALI_DIGITS,
} from "./calendar-data";
import { getDayOfWeek } from "./converter";
import { isValidBSDate } from "./compare";

export function toNepaliDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => NEPALI_DIGITS[Number(d)]);
}

export function toEnglishDigits(value: string): string {
  return value.replace(/[०-९]/g, (d) => {
    const idx = (NEPALI_DIGITS as readonly string[]).indexOf(d);
    return idx !== -1 ? String(idx) : d;
  });
}

function parseNumericParts(parts: string[]): [number, number, number] | null {
  if (parts.length !== 3 || parts.some((p) => !/^\d+$/.test(p))) {
    return null;
  }
  return [
    parseInt(parts[0], 10),
    parseInt(parts[1], 10),
    parseInt(parts[2], 10),
  ];
}

export function formatBS(date: BSDate, options: FormatOptions = {}): string {
  if (!date) return "";

  const { format = "YYYY-MM-DD", locale = "en", separator } = options;
  const { year, month, day } = date;

  const yearStr = String(year);
  const shortYearStr = yearStr.slice(-2);
  const monthStr = month < 10 ? `0${month}` : String(month);
  const dayStr = day < 10 ? `0${day}` : String(day);

  const monthNames = locale === "ne" ? BS_MONTHS_NE : BS_MONTHS_EN;
  const dayNames = locale === "ne" ? BS_DAYS_NE : BS_DAYS_EN;
  const dayShortNames = locale === "ne" ? BS_DAYS_SHORT_NE : BS_DAYS_SHORT_EN;

  let weekday: number | undefined;
  const getWeekday = () => {
    if (weekday === undefined) {
      weekday = getDayOfWeek(date);
    }
    return weekday;
  };

  let formatted = format.replace(
    /YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D/g,
    (token) => {
      switch (token) {
        case "YYYY":
          return yearStr;
        case "YY":
          return shortYearStr;
        case "MMMM":
          return monthNames[month - 1] ?? "";
        case "MMM": {
          const name = monthNames[month - 1] ?? "";
          return locale === "ne" ? name : name.slice(0, 3);
        }
        case "MM":
          return monthStr;
        case "M":
          return String(month);
        case "dddd":
          return dayNames[getWeekday()] ?? "";
        case "ddd":
          return dayShortNames[getWeekday()] ?? "";
        case "DD":
          return dayStr;
        case "D":
          return String(day);
        default:
          return token;
      }
    },
  );

  if (locale === "ne") {
    formatted = toNepaliDigits(formatted);
  }

  if (separator !== undefined) {
    if (format === "YYYY-MM-DD" || format === "DD-MM-YYYY") {
      formatted = formatted.replace(/-/g, separator);
    } else if (format === "YYYY/MM/DD" || format === "MM/DD/YYYY") {
      formatted = formatted.replace(/\//g, separator);
    }
  }

  return formatted;
}

export function parseBS(
  input: string,
  options: ParseOptions = {},
): BSDate | null {
  if (typeof input !== "string") return null;

  const { format = "YYYY-MM-DD", separator } = options;
  const normalized = toEnglishDigits(input.trim());
  if (!normalized) return null;

  let candidate: BSDate | null = null;

  if (format === "YYYY-MM-DD") {
    const parsed = parseNumericParts(normalized.split(separator ?? "-"));
    if (parsed) {
      const [year, month, day] = parsed;
      candidate = { year, month, day };
    }
  } else if (format === "DD-MM-YYYY") {
    const parsed = parseNumericParts(normalized.split(separator ?? "-"));
    if (parsed) {
      const [day, month, year] = parsed;
      candidate = { year, month, day };
    }
  } else if (format === "MM/DD/YYYY") {
    const parsed = parseNumericParts(normalized.split(separator ?? "/"));
    if (parsed) {
      const [month, day, year] = parsed;
      candidate = { year, month, day };
    }
  } else if (format === "YYYY/MM/DD") {
    const parsed = parseNumericParts(normalized.split(separator ?? "/"));
    if (parsed) {
      const [year, month, day] = parsed;
      candidate = { year, month, day };
    }
  } else if (format === "MMMM DD, YYYY") {
    const match = normalized.match(/^(.+?)\s+(\d{1,2}),\s*(\d{4})$/);
    if (match) {
      const [, monthName, dayStr, yearStr] = match;
      let monthIndex = BS_MONTHS_EN.findIndex(
        (m) => m.toLowerCase() === monthName.toLowerCase(),
      );
      if (monthIndex === -1) {
        monthIndex = (BS_MONTHS_NE as readonly string[]).indexOf(monthName);
      }
      if (monthIndex !== -1) {
        candidate = {
          year: parseInt(yearStr, 10),
          month: monthIndex + 1,
          day: parseInt(dayStr, 10),
        };
      }
    }
  }

  return candidate && isValidBSDate(candidate) ? candidate : null;
}
