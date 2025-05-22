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

  /**
   * Additional class names for day in claendar
   */
  dayClassName?: string;

  /**
   * Additional class names for selected day in calendar
   */
  selectedDayClassName?: string;

  /**
   * Additional class names for today date in claendar
   */
  todayClassName?: string;

  /**
   * Additional class names for disabled day in calendar
   */
  disabledDayClassName?: string;
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
  calendarClassName?: string;

  /**
   * Additional class names
   */
  dayClassName?: string;

  /**
   * Additional class names
   */
  selectedDayClassName?: string;

  /**
   * Additional class names
   */
  todayClassName?: string;

  /**
   * Additional class names
   */
  disabledDayClassName?: string;
}

export interface DateInputProps {
  value?: NepaliDate | null;
  onChange?: (value: string) => void;
  onSelect?: (date: NepaliDate | null) => void;
  placeholder?: string;
  disabled?: boolean;
  formatOptions?: NepaliDateFormatOptions;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface MonthNavigationProps {
  viewDate: NepaliDate;
  onViewDateChange: (date: NepaliDate) => void;
  locale?: "en" | "ne";
  className?: string;
}
