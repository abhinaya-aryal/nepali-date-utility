export interface BSDate {
  /** Bikram Sambat year (2000–2090) */
  year: number;
  /** Bikram Sambat month (1–12, where 1 = Baishakh, 12 = Chaitra) */
  month: number;
  /** Day of month (1–32) */
  day: number;
}

export type Locale = "en" | "ne";

export type DateFormatPreset =
  | "YYYY-MM-DD"
  | "DD-MM-YYYY"
  | "MM/DD/YYYY"
  | "YYYY/MM/DD"
  | "MMMM DD, YYYY";

export interface FormatOptions {
  /** Output format pattern (default: "YYYY-MM-DD") */
  format?: DateFormatPreset | (string & {});
  /** Output locale for digits and month/day names (default: "en") */
  locale?: Locale;
  /** Override the separator for standard numeric formats */
  separator?: string;
}

export interface ParseOptions {
  /** Expected input format pattern (default: "YYYY-MM-DD") */
  format?: DateFormatPreset | (string & {});
  /** Override the expected separator for standard numeric formats */
  separator?: string;
}
