import { NepaliDate, NepaliDateFormatOptions } from "../types";
import { bsMonthsEn, bsMonthsNe, nepaliDigits } from "../data/bs-calendar";

export function formatBSDate(
  date: NepaliDate,
  options: NepaliDateFormatOptions = {}
): string {
  const {
    format = "YYYY-MM-DD",
    locale = "en",
    separator = "-"
  } = options;

  if (!date) return "";

  const { year, month, day } = date;
  
  // Convert numbers to strings with leading zeros
  const yearStr = year.toString();
  const monthStr = month < 10 ? `0${month}` : month.toString();
  const dayStr = day < 10 ? `0${day}` : day.toString();
  
  // Replace tokens with actual values
  let formatted = format
    .replace("YYYY", yearStr)
    .replace("MM", monthStr)
    .replace("DD", dayStr)
    .replace("M", month.toString())
    .replace("D", day.toString());
  
  // Replace month name if format contains "MMM" or "MMMM"
  if (format.includes("MMMM")) {
    const monthNames = locale === "ne" ? bsMonthsNe : bsMonthsEn;
    formatted = formatted.replace("MMMM", monthNames[month - 1]);
  } 
  
  // Convert to Nepali digits if locale is Nepali
  if (locale === "ne") {
    formatted = formatted
      .split("")
      .map(char => {
        if (char >= "0" && char <= "9") {
          return nepaliDigits[parseInt(char)];
        }
        return char;
      })
      .join("");
  }
  
  // Replace default separator if specified
  if (separator !== "-" && (format === "YYYY-MM-DD" || format === "DD-MM-YYYY")) {
    formatted = formatted.replace(/-/g, separator);
  }
  
  return formatted;
}

export function parseBSDate(dateStr: string, format = "YYYY-MM-DD"): NepaliDate | null {
  try {
    // Default parsing for YYYY-MM-DD
    if (format === "YYYY-MM-DD") {
      const [yearStr, monthStr, dayStr] = dateStr.split("-");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10)
      };
    }
    
    // Parsing for DD-MM-YYYY
    if (format === "DD-MM-YYYY") {
      const [dayStr, monthStr, yearStr] = dateStr.split("-");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10)
      };
    }
    
    // Parsing for MM/DD/YYYY
    if (format === "MM/DD/YYYY") {
      const [monthStr, dayStr, yearStr] = dateStr.split("/");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10)
      };
    }
    
    // Parsing for YYYY/MM/DD
    if (format === "YYYY/MM/DD") {
      const [yearStr, monthStr, dayStr] = dateStr.split("/");
      return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10)
      };
    }
    
    // Failed to parse
    return null;
  } catch (error) {
    return null;
  }
}