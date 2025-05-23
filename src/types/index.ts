export interface CustomDate {
  year: number;
  month: number;
  day: number;
}

export type CustomDateFormatOptions = {
  format?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD" | string;
  locale?: "en" | "ne";
  separator?: string;
};

export interface DatePickerProps {
  /**
   * Selected date in Bikram Sambat format
   */
  value?: CustomDate | null;

  /**
   * Callback when date changes
   */
  onChange?: (date: CustomDate) => void;

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
  minDate?: CustomDate;

  /**
   * Max date (inclusive)
   */
  maxDate?: CustomDate;

  /**
   * Format for displaying the date
   */
  formatOptions?: CustomDateFormatOptions;

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
  selectedDate?: CustomDate | null;

  /**
   * Currently viewed month and year
   */
  viewDate: CustomDate;

  /**
   * Callback when date is selected
   */
  onDateSelect: (date: CustomDate) => void;

  /**
   * Callback when month view changes
   */
  onViewDateChange: (date: CustomDate) => void;

  /**
   * Min date (inclusive)
   */
  minDate?: CustomDate;

  /**
   * Max date (inclusive)
   */
  maxDate?: CustomDate;

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
  value?: CustomDate | null;
  onChange?: (value: string) => void;
  onSelect?: (date: CustomDate | null) => void;
  placeholder?: string;
  disabled?: boolean;
  formatOptions?: CustomDateFormatOptions;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface MonthNavigationProps {
  viewDate: CustomDate;
  onViewDateChange: (date: CustomDate) => void;
  locale?: "en" | "ne";
  className?: string;
}
