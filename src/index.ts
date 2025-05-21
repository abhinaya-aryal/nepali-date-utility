import "./index.css";

// Type exports
export type { NepaliDate, GregorianDate, DatePickerProps } from "./types";

// Component exports
export { default as NepaliDatePicker } from "./components/DatePicker";
export { default as Calendar } from "./components/Calendar";
export { default as DateInput } from "./components/DateInput";

// Utility exports
export {
  convertADToBS,
  convertBSToAD,
  getTodayBS,
  isValidBsDate,
  isDateInRange,
  getDaysInMonth,
} from "./utils/converter";

export { formatBSDate, parseBSDate } from "./utils/formatter";

// Data exports
export { bsMonthsEn, bsMonthsNe, bsDaysEn, bsDaysNe } from "./data/bs-calendar";

