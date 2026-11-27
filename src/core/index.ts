// Types
export type {
  BSDate,
  Locale,
  DateFormatPreset,
  FormatOptions,
  ParseOptions,
} from "./types";

// Calendar data & constants
export {
  MIN_BS_YEAR,
  MAX_BS_YEAR,
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  BS_DAYS_EN,
  BS_DAYS_NE,
  BS_DAYS_SHORT_EN,
  BS_DAYS_SHORT_NE,
  NEPALI_DIGITS,
  isSupportedBSYear,
  getDaysInMonth,
  getDaysInYear,
} from "./calendar-data";

// Conversion
export {
  adToBS,
  bsToAD,
  todayBS,
  getDayOfWeek,
  getFirstDayOfMonth,
} from "./converter";

// Validation & comparison
export {
  isValidBSDate,
  compareBS,
  isSameDay,
  isBefore,
  isAfter,
  isDateInRange,
} from "./compare";

// Date arithmetic
export {
  addDays,
  addMonths,
  addYears,
  diffDays,
  startOfMonth,
  endOfMonth,
} from "./math";

// Formatting, parsing & digits
export {
  formatBS,
  parseBS,
  toNepaliDigits,
  toEnglishDigits,
} from "./formatter";
