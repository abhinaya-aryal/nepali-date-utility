export const MIN_BS_YEAR = 2000;
export const MAX_BS_YEAR = 2090;

/**
 * Compact 2-bit packed BS calendar table (2000–2090 BS).
 * Each year occupies 6 hex chars (24 bits = 12 months × 2 bits),
 * where each 2-bit value stores (daysInMonth - 29) in [0..3].
 */
const PACKED_BS_CALENDAR =
  "7b9512aea445af9445bb95067b9512aea445af9445bb9506aba142aea445af9445bb9506" +
  "aba145aea445af9445bb9506aba145aea445bb9445bb9512aba445aea445bb9505bb9512" +
  "aba445aea445bb95067b9512aea445aed445bb95067b9512aea445af9445bb95067ba142" +
  "aea445af9445bb9506aba145aea445af9445bb9506aba145aea445bb9445bb9506aba445" +
  "aea445bb9505bb9512aba445aea445bb9505bb9512aea445aed445bb95067b9512aea445" +
  "af9445bb95067ba112aea445af9445bb9506aba142aea445af9445bb9506aba145aea445" +
  "bb9445bb9506aba445aea445bb9505bb9512aba445aea445bb9505bb9512aea445aea445" +
  "bb95067b9512aea445aea5156f65157b95157b9515";

export function isSupportedBSYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_BS_YEAR && year <= MAX_BS_YEAR;
}

export function getDaysInMonth(year: number, month: number): number {
  if (!isSupportedBSYear(year)) {
    throw new RangeError(
      `Year ${year} is outside the supported range (${MIN_BS_YEAR}-${MAX_BS_YEAR})`,
    );
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`Invalid BS month: ${month} (expected 1-12)`);
  }

  const offset = (year - MIN_BS_YEAR) * 6;
  const bits = parseInt(PACKED_BS_CALENDAR.slice(offset, offset + 6), 16);
  return 29 + ((bits >> ((12 - month) * 2)) & 3);
}

export function getDaysInYear(year: number): number {
  if (!isSupportedBSYear(year)) {
    throw new RangeError(
      `Year ${year} is outside the supported range (${MIN_BS_YEAR}-${MAX_BS_YEAR})`,
    );
  }

  const offset = (year - MIN_BS_YEAR) * 6;
  const bits = parseInt(PACKED_BS_CALENDAR.slice(offset, offset + 6), 16);
  let total = 29 * 12;
  for (let m = 0; m < 12; m++) {
    total += (bits >> (m * 2)) & 3;
  }
  return total;
}

export const BS_MONTHS_EN = [
  "Baishakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

export const BS_MONTHS_NE = [
  "बैशाख",
  "जेष्ठ",
  "आषाढ",
  "श्रावण",
  "भाद्र",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पौष",
  "माघ",
  "फाल्गुन",
  "चैत्र",
] as const;

export const BS_DAYS_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const BS_DAYS_NE = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहिबार",
  "शुक्रबार",
  "शनिबार",
] as const;

export const BS_DAYS_SHORT_EN = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const BS_DAYS_SHORT_NE = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
] as const;

export const NEPALI_DIGITS = [
  "०",
  "१",
  "२",
  "३",
  "४",
  "५",
  "६",
  "७",
  "८",
  "९",
] as const;
