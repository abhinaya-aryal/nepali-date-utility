export interface NepaliDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export type NepaliDateFormatOptions = {
  format?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD" | string;
  locale?: "en" | "ne";
  separator?: string;
};

export interface DatePickerProps {
  /**
   * Selected date in Bikram Sambat format
   */
  value?: NepaliDate | null;

  /**
   * Callback when date changes
   */
  onChange?: (date: NepaliDate) => void;

  /**
   * Placeholder text for input
   */
  placeholder?: string;

  /**
   * Disable the datepicker
   */
  disabled?: boolean;

  /**
   * Min date (inclusive)
   */
  minDate?: NepaliDate;

  /**
   * Max date (inclusive)
   */
  maxDate?: NepaliDate;

  /**
   * Format for displaying the date
   */
  formatOptions?: NepaliDateFormatOptions;

  /**
   * Additional class names
   */
  className?: string;

  /**
   * Additional class name for input field
   */
  inputClassName?: string;

  /**
   * Additional class name for calendar popup
   */
  calendarClassName?: string;

  /**
   * Position of the calendar popup
   */
  position?: "bottom" | "top" | "auto";
}

export interface CalendarProps {
  /**
   * Currently selected locale
   */
  locale?: "en" | "ne";
  /**
   * Currently selected date
   */
  selectedDate?: NepaliDate | null;

  /**
   * Currently viewed month and year
   */
  viewDate: NepaliDate;

  /**
   * Callback when date is selected
   */
  onDateSelect: (date: NepaliDate) => void;

  /**
   * Callback when month view changes
   */
  onViewDateChange: (date: NepaliDate) => void;

  /**
   * Min date (inclusive)
   */
  minDate?: NepaliDate;

  /**
   * Max date (inclusive)
   */
  maxDate?: NepaliDate;

  /**
   * Additional class names
   */
  className?: string;
}

