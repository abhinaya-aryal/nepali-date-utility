import { describe, it, expect } from "vitest";
import {
  MIN_BS_YEAR,
  MAX_BS_YEAR,
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  getDaysInMonth,
  getDaysInYear,
  adToBS,
  bsToAD,
  todayBS,
  getDayOfWeek,
  getFirstDayOfMonth,
  isValidBSDate,
  compareBS,
  isSameDay,
  isBefore,
  isAfter,
  isDateInRange,
  addDays,
  addMonths,
  addYears,
  diffDays,
  startOfMonth,
  endOfMonth,
  formatBS,
  parseBS,
  toNepaliDigits,
  toEnglishDigits,
} from "../src/core";

describe("core calendar data", () => {
  it("supports all 91 BS years (2000–2090) with valid day counts", () => {
    for (let y = MIN_BS_YEAR; y <= MAX_BS_YEAR; y++) {
      let sum = 0;
      for (let m = 1; m <= 12; m++) {
        const days = getDaysInMonth(y, m);
        expect(days).toBeGreaterThanOrEqual(29);
        expect(days).toBeLessThanOrEqual(32);
        sum += days;
      }
      expect(getDaysInYear(y)).toBe(sum);
      expect(sum).toBeGreaterThanOrEqual(365);
      expect(sum).toBeLessThanOrEqual(366);
    }
  });

  it("throws RangeError for unsupported years or months", () => {
    expect(() => getDaysInMonth(1999, 1)).toThrow(RangeError);
    expect(() => getDaysInMonth(2091, 1)).toThrow(RangeError);
    expect(() => getDaysInMonth(2080, 0)).toThrow(RangeError);
    expect(() => getDaysInMonth(2080, 13)).toThrow(RangeError);
    expect(() => getDaysInYear(1999)).toThrow(RangeError);
  });

  it("exports 12 English and Nepali month names", () => {
    expect(BS_MONTHS_EN).toHaveLength(12);
    expect(BS_MONTHS_NE).toHaveLength(12);
  });
});

describe("core conversion", () => {
  it("converts epoch and known BS ↔ AD dates accurately", () => {
    const pairs = [
      { bs: { year: 2000, month: 1, day: 1 }, ad: [1943, 4, 14] },
      { bs: { year: 2080, month: 1, day: 1 }, ad: [2023, 4, 14] },
      { bs: { year: 2081, month: 1, day: 1 }, ad: [2024, 4, 13] },
      { bs: { year: 2082, month: 1, day: 1 }, ad: [2025, 4, 14] },
      { bs: { year: 2083, month: 1, day: 1 }, ad: [2026, 4, 14] },
      { bs: { year: 2090, month: 12, day: 30 }, ad: [2034, 4, 13] },
    ] as const;

    for (const { bs, ad } of pairs) {
      const convertedAd = bsToAD(bs);
      expect(convertedAd).toBeInstanceOf(Date);
      expect([
        convertedAd.getFullYear(),
        convertedAd.getMonth() + 1,
        convertedAd.getDate(),
      ]).toEqual([...ad]);

      expect(adToBS(new Date(ad[0], ad[1] - 1, ad[2]))).toEqual(bs);
    }
  });

  it("throws on invalid or out-of-range AD/BS dates", () => {
    expect(() => adToBS(new Date("invalid"))).toThrow(RangeError);
    expect(() => adToBS(new Date(1943, 3, 13))).toThrow(RangeError);
    expect(() => adToBS(new Date(2034, 3, 14))).toThrow(RangeError);
    expect(() => bsToAD({ year: 1999, month: 1, day: 1 })).toThrow(RangeError);
    expect(() => bsToAD({ year: 2080, month: 1, day: 35 })).toThrow(RangeError);
  });

  it("returns valid todayBS and accurate weekday helpers", () => {
    expect(isValidBSDate(todayBS())).toBe(true);
    // 2082-01-01 BS = 2025-04-14 AD = Monday (1)
    expect(getDayOfWeek({ year: 2082, month: 1, day: 1 })).toBe(1);
    expect(getFirstDayOfMonth(2082, 1)).toBe(1);
  });
});

describe("core validation and comparison", () => {
  it("acts as a strict type guard in isValidBSDate", () => {
    expect(isValidBSDate({ year: 2081, month: 2, day: 32 })).toBe(true);
    expect(isValidBSDate({ year: 2081, month: 1, day: 32 })).toBe(false);
    expect(isValidBSDate({ year: 2081, month: 1, day: 1.5 })).toBe(false);
    expect(isValidBSDate(null)).toBe(false);
    expect(isValidBSDate("2081-01-01")).toBe(false);
  });

  it("compares dates and checks ranges accurately", () => {
    const a = { year: 2082, month: 1, day: 10 };
    const b = { year: 2082, month: 1, day: 20 };
    expect(compareBS(a, b)).toBe(-1);
    expect(compareBS(b, a)).toBe(1);
    expect(compareBS(a, { ...a })).toBe(0);
    expect(isSameDay(a, { ...a })).toBe(true);
    expect(isBefore(a, b)).toBe(true);
    expect(isAfter(b, a)).toBe(true);
    expect(isDateInRange({ year: 2082, month: 1, day: 15 }, a, b)).toBe(true);
    expect(isDateInRange({ year: 2082, month: 1, day: 9 }, a, b)).toBe(false);
  });
});

describe("core date arithmetic", () => {
  it("adds and subtracts days across month/year boundaries", () => {
    const start = { year: 2081, month: 12, day: 31 };
    expect(addDays(start, 1)).toEqual({ year: 2082, month: 1, day: 1 });
    expect(addDays({ year: 2082, month: 1, day: 1 }, -1)).toEqual(start);
    expect(diffDays({ year: 2082, month: 1, day: 1 }, start)).toBe(1);
    expect(diffDays(start, { year: 2082, month: 1, day: 1 })).toBe(-1);
  });

  it("adds months and years while clamping day to target month length", () => {
    // 2081 Jestha has 32 days; Ashadh has 31 days; 2082 Jestha has 31 days
    expect(addMonths({ year: 2081, month: 2, day: 32 }, 1)).toEqual({
      year: 2081,
      month: 3,
      day: 31,
    });
    expect(addYears({ year: 2081, month: 2, day: 32 }, 1)).toEqual({
      year: 2082,
      month: 2,
      day: 31,
    });
  });

  it("computes startOfMonth and endOfMonth", () => {
    const date = { year: 2081, month: 2, day: 15 };
    expect(startOfMonth(date)).toEqual({ year: 2081, month: 2, day: 1 });
    expect(endOfMonth(date)).toEqual({ year: 2081, month: 2, day: 32 });
  });
});

describe("core formatting, parsing, and digits", () => {
  it("formats dates with all tokens without corrupting month/day names", () => {
    const mangsir = { year: 2082, month: 8, day: 15 };
    expect(formatBS(mangsir)).toBe("2082-08-15");
    expect(formatBS(mangsir, { format: "YY/M/D" })).toBe("82/8/15");
    expect(formatBS(mangsir, { format: "MMMM DD, YYYY" })).toBe(
      "Mangsir 15, 2082",
    );
    expect(formatBS(mangsir, { format: "MMM DD, YYYY" })).toBe("Man 15, 2082");
    expect(formatBS(mangsir, { format: "MMMM DD, YYYY", locale: "ne" })).toBe(
      "मंसिर १५, २०८२",
    );
    expect(
      formatBS({ year: 2082, month: 1, day: 1 }, { format: "dddd, MMMM D, YYYY" }),
    ).toBe("Monday, Baishakh 1, 2082");
    expect(
      formatBS({ year: 2082, month: 1, day: 1 }, { separator: "/" }),
    ).toBe("2082/01/01");
  });

  it("parses valid English and Nepali strings and rejects invalid ones", () => {
    expect(parseBS("2082-01-05")).toEqual({ year: 2082, month: 1, day: 5 });
    expect(parseBS("०५-०१-२०८२", { format: "DD-MM-YYYY" })).toEqual({
      year: 2082,
      month: 1,
      day: 5,
    });
    expect(parseBS("2082/01/05", { separator: "/" })).toEqual({
      year: 2082,
      month: 1,
      day: 5,
    });
    expect(parseBS("मंसिर १५, २०८२", { format: "MMMM DD, YYYY" })).toEqual({
      year: 2082,
      month: 8,
      day: 15,
    });

    expect(parseBS("")).toBeNull();
    expect(parseBS("invalid")).toBeNull();
    expect(parseBS("2082-01-35")).toBeNull(); // invalid calendar day
    expect(parseBS("2082abc-01-05")).toBeNull();
  });

  it("converts between Nepali and English digits", () => {
    expect(toNepaliDigits(2082)).toBe("२०८२");
    expect(toEnglishDigits("२०८२-०१-०५")).toBe("2082-01-05");
  });
});
