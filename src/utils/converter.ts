import { CustomDate } from "../types";
import { bsCalendarData } from "../data/bs-calendar";

const bsEpoch: CustomDate = { year: 2000, month: 1, day: 1 };
const adEpoch = new Date(1943, 3, 14); // April 14, 1943 (month is 0-based)

function daysBetweenDates(d1: Date, d2: Date): number {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((date2.getTime() - date1.getTime()) / msPerDay);
}

export function convertADToBS(adDate: Date): CustomDate {
  const diffDays = daysBetweenDates(adEpoch, adDate);
  let bsYear = bsEpoch.year;
  let bsMonth = bsEpoch.month;
  let bsDay = bsEpoch.day;

  let remainingDays = diffDays;
  while (remainingDays > 0) {
    // Check if year exists in calendar data
    if (!bsCalendarData[bsYear]) {
      throw new Error(
        `Year ${bsYear} is outside the supported range (2000-2090)`,
      );
    }

    const daysInMonth = bsCalendarData[bsYear][bsMonth - 1];
    if (typeof daysInMonth !== "number") {
      throw new Error(
        `Invalid calendar data for year ${bsYear}, month ${bsMonth}`,
      );
    }

    bsDay++;
    if (bsDay > daysInMonth) {
      bsDay = 1;
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }

    remainingDays--;
  }

  return { year: bsYear, month: bsMonth, day: bsDay };
}

export function convertBSToAD(bsDate: CustomDate): CustomDate {
  let bsYear = bsEpoch.year;
  let bsMonth = bsEpoch.month;
  let bsDay = bsEpoch.day;
  let adDate = new Date(adEpoch);

  while (
    bsYear !== bsDate.year ||
    bsMonth !== bsDate.month ||
    bsDay !== bsDate.day
  ) {
    // Check if year exists in calendar data
    if (!bsCalendarData[bsYear]) {
      throw new Error(
        `Year ${bsYear} is outside the supported range (2000-2090)`,
      );
    }

    const daysInMonth = bsCalendarData[bsYear][bsMonth - 1];
    if (typeof daysInMonth !== "number") {
      throw new Error(
        `Invalid calendar data for year ${bsYear}, month ${bsMonth}`,
      );
    }

    bsDay++;
    adDate.setDate(adDate.getDate() + 1);

    if (bsDay > daysInMonth) {
      bsDay = 1;
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }
  }

  return {
    year: adDate.getFullYear(),
    month: adDate.getMonth() + 1, // JS months are 0-based, so add 1
    day: adDate.getDate(),
  };
}

export function getTodayBS(): CustomDate {
  return convertADToBS(new Date());
}

export function getDaysInMonth(year: number, month: number): number {
  if (!bsCalendarData[year]) {
    throw new Error(`Year ${year} is outside the supported range (2000-2090)`);
  }

  const daysInMonth = bsCalendarData[year][month - 1];
  if (typeof daysInMonth !== "number") {
    throw new Error(`Invalid calendar data for year ${year}, month ${month}`);
  }

  return daysInMonth;
}

export function isValidBsDate(date: CustomDate): boolean {
  try {
    const { year, month, day } = date;

    // Check if year exists in our data
    if (!bsCalendarData[year]) return false;

    // Check month is valid
    if (month < 1 || month > 12) return false;

    // Check day is valid for that month
    const daysInMonth = bsCalendarData[year][month - 1];
    if (typeof daysInMonth !== "number") return false;
    if (day < 1 || day > daysInMonth) return false;

    return true;
  } catch (error) {
    return false;
  }
}

export function isDateInRange(
  date: CustomDate,
  minDate?: CustomDate,
  maxDate?: CustomDate,
): boolean {
  if (!isValidBsDate(date)) return false;

  if (minDate && compareDates(date, minDate) < 0) return false;
  if (maxDate && compareDates(date, maxDate) > 0) return false;

  return true;
}

export function compareDates(a: CustomDate, b: CustomDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function getFirstDayOfMonth(bsYear: number, bsMonth: number): number {
  // Get the AD date of the 1st day of the given BS month
  const bsDate: CustomDate = { year: bsYear, month: bsMonth, day: 1 };
  const adDate = convertBSToAD(bsDate);

  // Convert to JS Date to get day of week
  const jsDate = new Date(adDate.year, adDate.month - 1, adDate.day);
  return jsDate.getDay(); // 0 = Sunday, 6 = Saturday
}

export function addMonths(date: CustomDate, months: number): CustomDate {
  let { year, month, day } = date;

  month += months;

  while (month > 12) {
    month -= 12;
    year++;
  }

  while (month < 1) {
    month += 12;
    year--;
  }

  // Adjust day if it exceeds the max days in the new month
  const maxDays = getDaysInMonth(year, month);
  if (day > maxDays) {
    day = maxDays;
  }

  return { year, month, day };
}

